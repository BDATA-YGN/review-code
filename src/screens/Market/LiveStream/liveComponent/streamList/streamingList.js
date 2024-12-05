import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import {VLCPlayer} from 'react-native-vlc-media-player';
import COLOR from '../../../../../constants/COLOR';
import {useDispatch, useSelector} from 'react-redux';
import IconManager from '../../../../../assets/IconManager';
import StreamViewerView from '../../ViewerView/streamViewerView';
import {FontFamily, fontSizes} from '../../../../../constants/FONT';
import {setFetchDarkMode} from '../../../../../stores/slices/DarkModeSlice';
import {
  retrieveStringData,
  storeKeys,
} from '../../../../../helper/AsyncStorage';
import {logJsonData} from '../../../../../helper/LiveStream/logFile';
import StreamNormalLiveView from '../../ViewerView/streamNormalLiveView';
import {getActiveLive} from '../../../../../helper/LiveStream/liveStreamHelper';
import {setLiveCommentListNormalLive} from '../../../../../stores/slices/normalLiveSlice';
import {setActivePageIndex} from '../../../../../stores/slices/PostSlice';

const StreamingListRoute = () => {
  const streamingList = useSelector(
    state => state.LiveStreamSlice.streamingList,
  );
  const emptyList = [{id: 1}];

  const dispatch = useDispatch();
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const [fullScreen, setFullScreen] = useState(false);
  const [fullScreenNormal, setFullScreenNormal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlayingMap, setIsPlayingMap] = useState({});
  const [isMutedMap, setIsMutedMap] = useState({});
  const [keyMap, setKeyMap] = useState({}); // For forcing VLC re-render on play/pause
  const flatListRef = useRef(null); // For referencing FlatList
  const [refreshing, setRefreshing] = useState(false); // Refreshing state
  const [isLoading, setLoading] = useState(true); // Refreshing state

  const onRefresh = useCallback(async () => {
    setLoading(true);
    setRefreshing(true);
    await getActiveLive(dispatch);
    setRefreshing(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  // useEffect(() => {}, [Alert.alert('Hello', `==>${streamingList.length}`)]);

  // Helper to toggle play/pause state for each video
  const togglePlayPause = id => {
    setIsPlayingMap(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
    if (!isPlayingMap[id]) {
      setKeyMap(prevKeyMap => ({
        ...prevKeyMap,
        [id]: (prevKeyMap[id] || 0) + 1, // Force VLC re-render for the video
      }));
    }
  };

  // Helper to toggle mute state for each video
  const toggleMute = id => {
    setIsMutedMap(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle viewable items (when scrolling through the FlatList)
  const handleViewableItemsChanged = ({viewableItems}) => {
    const currentVisibleItem = viewableItems[0]?.item?.id; // Get the ID of the visible item
    if (currentVisibleItem) {
      // Set all videos to paused except the visible one
      setIsPlayingMap(prev =>
        Object.keys(prev).reduce((acc, key) => {
          acc[key] = key === currentVisibleItem; // Play only the visible video
          return acc;
        }, {}),
      );
      // Force VLC re-render for the visible item
      setKeyMap(prevKeyMap => ({
        ...prevKeyMap,
        [currentVisibleItem]: (prevKeyMap[currentVisibleItem] || 0) + 1,
      }));
    }
  };

  const renderEmpty = item => {
    return (
      <View
        style={{
          width: '100%',
          height: 600,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: COLOR.Grey300,
            fontSize: 15,
            fontFamily: FontFamily.PoppinSemiBold,
          }}>
          Empty Live
        </Text>
      </View>
    );
  };

  // Render each video item with play/pause and mute buttons
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          // logJsonData('===>', item);
          dispatch(setLiveCommentListNormalLive([]));
          handleFullScreen(item);

          // Platform.OS === 'ios'
          //   ? handleFullScreen(item)
          //   : Alert.alert('Hello', 'Comming soon for Android!');
        }}
        style={styles.previewContainer}>
        <Image
          source={{uri: item.user_data.avatar}}
          style={{
            width: '100%',
            height: '100%',
            // borderWidth: 0.5,
            borderColor: 'blue',
            resizeMode: 'cover',
            borderRadius: 8,
          }}
        />
        <TouchableOpacity
          onPress={() => {}}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}>
          <Image
            style={{
              width: 45,
              height: 45,
              resizeMode: 'cover',
              borderRadius: 18,
              margin: 4,
              borderWidth: 2,
              borderColor: COLOR.Primary,
            }}
            source={{uri: item.user_data.avatar}}
          />
        </TouchableOpacity>
        <View style={styles.liveAndCountContainer}>
          <TouchableOpacity
            style={styles.watchButton}
            onPress={() => handleFullScreen(item)}>
            <Text style={styles.watchButtonText}>Live</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.viewerButton}
            onPress={() => handleFullScreen(item)}>
            <Image
              source={IconManager.live_eye_viewer}
              style={{width: 14, height: 14, resizeMode: 'contain'}}
            />
            <Text style={styles.viewerButtonText}>200</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: '100%',
            backgroundColor: '#333333',
            position: 'absolute',
            bottom: 0,
            padding: 4,
          }}>
          <Text numberOfLines={1} style={styles.header}>
            {item?.product_data?.name}
          </Text>
          <Text numberOfLines={2} style={styles.description}>
            {item?.product_data?.description}
          </Text>
          {/* <Text style={styles.username}>{item.user_data.username}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  const handleFullScreen = item => {
    if (item.is_live_sale) {
      // dispatch(setActivePageIndex(null));
      setSelectedVideo(item);
      setFullScreen(true);
    } else {
      // dispatch(setActivePageIndex(null));
      setSelectedVideo(item);
      setFullScreenNormal(true);
    }
  };

  const handleCloseFullScreen = () => {
    setFullScreen(false);
    setSelectedVideo(null);
  };

  const handleCloseFullScreenNormal = () => {
    setFullScreenNormal(false);
    setSelectedVideo(null);
  };

  // Render the fullscreen modal with play/pause and mute buttons
  const renderFullScreenModal = () => (
    <Modal
      visible={fullScreen}
      supportedOrientations={['landscape', 'portrait']}
      onRequestClose={handleCloseFullScreen}>
      {selectedVideo && (
        <StreamViewerView
          selectedVideo={selectedVideo}
          handleCloseFullScreen={handleCloseFullScreen}
          isMutedMap={isMutedMap}
          togglePlayPause={() => togglePlayPause(selectedVideo?.id)}
          toggleMute={() => toggleMute(selectedVideo?.id)}
          isPlayingMap={isPlayingMap}
        />
      )}
    </Modal>
  );

  const renderFullScreenModalNormal = () => (
    <Modal
      visible={fullScreenNormal}
      supportedOrientations={['landscape', 'portrait']}
      onRequestClose={handleCloseFullScreenNormal}>
      {selectedVideo && (
        <StreamNormalLiveView
          selectedVideo={selectedVideo}
          handleCloseFullScreen={handleCloseFullScreenNormal}
          isMutedMap={isMutedMap}
          togglePlayPause={() => togglePlayPause(selectedVideo?.id)}
          toggleMute={() => toggleMute(selectedVideo?.id)}
          isPlayingMap={isPlayingMap}
        />
      )}
    </Modal>
  );

  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);
  const getDarkModeTheme = async () => {
    try {
      const darkModeValue = await retrieveStringData({
        key: storeKeys.darkTheme,
      });
      if (darkModeValue !== null || undefined) {
        setDarkMode(darkModeValue);
      }
    } catch (error) {
      console.error('Error retrieving dark mode theme:', error);
    }
  };

  useEffect(() => {
    getDarkModeTheme();
  }, []);

  return (
    <SafeAreaView
      style={[
        styles.scene,
        {
          backgroundColor:
            darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
        },
      ]}>
      <StatusBar hidden={true} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 4,
          paddingHorizontal: 16,
          marginTop: 60,
        }}>
        <Text
          style={{
            fontFamily: FontFamily.PoppinSemiBold,
            color: COLOR.Primary,
            fontSize: fontSizes.size14,
          }}>
          Live Now
        </Text>
        <View
          style={{width: '80%', height: 1, backgroundColor: COLOR.Grey100}}
        />
      </View>
      {!isLoading > 0 ? (
        <FlatList
          ref={flatListRef}
          data={streamingList.length <= 0 ? emptyList : streamingList}
          renderItem={streamingList.length <= 0 ? renderEmpty : renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={handleViewableItemsChanged}
          numColumns={2}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50, // Trigger the viewable items callback when at least 50% of the item is visible
          }}
        />
      ) : (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text
            style={{
              color: COLOR.Grey500,
              fontSize: 15,
              fontFamily: FontFamily.PoppinSemiBold,
            }}>
            Loading ...
          </Text>
        </View>
      )}

      {/* Full-Screen Modal */}
      {fullScreen && renderFullScreenModal()}
      {fullScreenNormal && renderFullScreenModalNormal()}
    </SafeAreaView>
  );
};

export default StreamingListRoute;

const styles = StyleSheet.create({
  scene: {
    // flex: 1,
    height: '100%',
  },
  previewContainer: {
    flex: 1,
    marginHorizontal: 4, // Add margin to create space between grid items
    marginVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
    height: 250, // Set a fixed height for grid items
  },
  videoContainer: {
    // borderWidth: 1,
    borderColor: 'blue',
    marginVertical: 10,
  },
  vlcPlayer: {
    width: '100%',
    height: 228,
    backgroundColor: 'black',
  },
  viewerContainer: {
    position: 'absolute',
    flexDirection: 'row',
    top: 0,
    right: 4,
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  liveButtonContainer: {
    position: 'absolute',
    flexDirection: 'row',
    top: 0,
    right: 8,
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  liveAndCountContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    right: 4,
    gap: 4,
    top: 4,
  },
  controlButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 5,
  },
  watchButton: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderRadius: 4,
  },
  viewerButton: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  controlButtonText: {
    fontSize: 12,
    color: COLOR.White100,
  },
  viewerButtonText: {
    fontSize: 12,
    color: COLOR.White100,
  },
  watchButtonText: {
    fontSize: 12,
    color: COLOR.White100,
  },
  fullScreenContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  fullScreenVlcPlayer: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 32,
    right: 10,
    zIndex: 2,
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 16,
  },
  header: {
    fontSize: 12,
    fontFamily: FontFamily.PoppinSemiBold,
    color: COLOR.Grey100,
  },
  description: {
    fontSize: 10,
    fontFamily: FontFamily.PoppinSemiBold,
    color: COLOR.Grey100,
  },
  username: {
    fontSize: 14,
    fontFamily: FontFamily.PoppinSemiBold,
    color: COLOR.Primary,
  },
});
