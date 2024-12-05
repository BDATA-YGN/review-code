import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  Modal, // Import Modal
} from 'react-native';
import COLOR from '../../../../../constants/COLOR';
import StreamingListRoute from './streamingList';
import VideoReelRoute from './videoList';
import {FontFamily} from '../../../../../constants/FONT';
import {getActiveLive} from '../../../../../helper/LiveStream/liveStreamHelper';
import {useDispatch, useSelector} from 'react-redux';
import {setActivePageIndex} from '../../../../../stores/slices/PostSlice';
import {setFetchDarkMode} from '../../../../../stores/slices/DarkModeSlice';
import {
  retrieveStringData,
  storeKeys,
} from '../../../../../helper/AsyncStorage';
import ShortVideoNew from '../../../../ShortVideo/ShortVideoNew';

const StreamingListMain = () => {
  const layout = Dimensions.get('window');
  const dispatch = useDispatch();
  const activePageIndex = useSelector(state => state.PostSlice.activePageIndex);
  const scrollPosition = useSelector(state => state.PostSlice.scrollPosition);
  const [darkMode, setDarkMode] = useState(null);
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const activePageIndexCopy = useSelector(
    state => state.PostSlice.activePageIndexCopy,
  );
  const [index, setIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility

  const handleRefresh = async () => {
    setRefreshing(true);
    await getActiveLive(dispatch);
    setRefreshing(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getActiveLive(dispatch);
    };
    fetchData();
  }, []);

  const handleIndexChange = newIndex => {
    setIndex(newIndex);
    console.log(`Tab changed to index: ${newIndex}`);
    // newIndex === 0
    //   ? dispatch(setActivePageIndex(activePageIndexCopy))
    //   : dispatch(setActivePageIndex(null));
    newIndex === 0
      ? dispatch(setActivePageIndex(null))
      : dispatch(setActivePageIndex(null));

    // Show modal when switching to 'Lives' tab (index 1)
    if (newIndex === 1) {
      setModalVisible(true); // Show the modal for live streaming
    } else {
      setModalVisible(false); // Hide the modal for other tabs
    }
  };

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

  const renderVieo = useCallback(() => {
    return (
      <View style={{height: '100%', zIndex: -2}}>
        <ShortVideoNew darkMode={darkMode} />
      </View>
    );
  });

  const renderLive = useCallback(() => {
    return (
      <View style={{flex: 1}}>
        <StreamingListRoute />
      </View>
    );
    return null; // Default case, if needed
  }, [index, darkMode]);

  return (
    <SafeAreaView style={[styles.safeArea]}>
      <View style={[styles.tabViewContainer]}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.button,
              index === 0 && styles.activeButton,
              {
                backgroundColor: index === 0 ? COLOR.Primary : COLOR.Blue50,
              },
            ]}
            onPress={() => handleIndexChange(0)}>
            <Text
              style={[
                styles.buttonText,
                index === 0 && styles.activeButtonText,
                {
                  color: index === 0 ? COLOR.White100 : COLOR.Grey500,
                },
              ]}>
              Videos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.button,
              index === 1 && styles.activeButton,
              {
                backgroundColor: index === 1 ? COLOR.Primary : COLOR.Blue50,
              },
            ]}
            onPress={() => handleIndexChange(1)}>
            <Text
              style={[
                styles.buttonText,
                index === 1 && styles.activeButtonText,
                {
                  color: index === 1 ? COLOR.White100 : COLOR.Grey500,
                },
              ]}>
              Lives
            </Text>
          </TouchableOpacity>
        </View>

        {/* Render the selected route */}
        {renderVieo(index)}
        {/* {modalVisible ? (
          <View style={styles.modalContent}>{renderLive()}</View>
        ) : (
          <View />
        )} */}
        {modalVisible && (
          <View
            style={{
              height: '100%',
              width: '100%',
              zIndex: 10,
              position: 'absolute',
              top: 0,
              zIndex: -1,
              // borderWidth: 3,
            }}>
            {renderLive()}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    zIndex: 1,
    backgroundColor: COLOR.White,
  },
  tabViewContainer: {
    flex: 1,
    backgroundColor: COLOR.White,
  },
  buttonContainer: {
    position: 'absolute',
    top: 0,
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0)',
    paddingVertical: 10,
    display: 'flex',
    gap: 16,
    marginHorizontal: 16,
  },
  button: {
    paddingVertical: 10,
    borderRadius: 30,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: COLOR.PrimaryBlue50,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: FontFamily.PoppinRegular,
  },
  activeButtonText: {
    fontFamily: FontFamily.PoppinSemiBold,
    color: COLOR.White100,
  },
  modalBackground: {
    flex: 1,
    marginVertical: 120,
    borderWidth: 3,
    borderColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: COLOR.White,
    // borderRadius: 10,
    width: '100%',
    height: '100%',
  },
});

export default StreamingListMain;
