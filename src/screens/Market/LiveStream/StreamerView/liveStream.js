import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  BackHandler,
  Platform,
  SafeAreaView,
  PermissionsAndroid,
  AppState, // Import BackHandler for hardware back press
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native'; // Import useFocusEffect to handle focus state
import {ApiVideoLiveStreamView} from '@api.video/react-native-livestream';
import COLOR from '../../../../constants/COLOR';
import {FontFamily, fontSizes} from '../../../../constants/FONT';
import IconManager from '../../../../assets/IconManager';
import SizedBox from '../../../../commonComponent/SizedBox';
import {useWindowDimensions} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  endLiveStream,
  generateStreamKey,
  getLiveCommentList,
  getLiveProductDetails,
  liveHardEnd,
} from '../../../../helper/LiveStream/liveStreamHelper';
import LiveEndDialog from '../liveComponent/dialog/liveEndDialog';
import {useKeepAwake} from '@sayem314/react-native-keep-awake';
import {
  setBroadcastId,
  setFullScreen,
  setLiveCommentList,
  setLiveCommentListNew,
  setLiveProductList,
  setStreamerId,
  setStreamPostId,
} from '../../../../stores/slices/liveStreamSlice';
import LiveCommentsListStreaer from '../liveComponent/liveCommentListStreamer';
import {logJsonData} from '../../../../helper/LiveStream/logFile';

const LiveStream = ({}) => {
  const ref = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const navigation = useNavigation();
  const [cameraID, setCameraId] = useState('front');
  const [showStream, setShowStream] = useState(false);
  const liveCommentList = useSelector(
    state => state.LiveStreamSlice.liveCommentList,
  );
  const isAddNewComments = useSelector(
    state => state.LiveStreamSlice.isAddNewComments,
  );

  const dispatch = useDispatch();

  const stringKey = useSelector(state => state.LiveStreamSlice.streamKey);
  const formData = useSelector(state => state.LiveStreamSlice.formData);
  const streamPostId = useSelector(state => state.LiveStreamSlice.streamPostId);
  const broadCastId = useSelector(state => state.LiveStreamSlice.broadCastId);
  const streamerId = useSelector(state => state.LiveStreamSlice.streamerId);
  const appState = useRef(AppState.currentState);
  const productList = useSelector(
    state => state.LiveStreamSlice.liveProductList,
  );
  const postToTimeLine = useSelector(
    state => state.LiveStreamSlice.postToTimeLine,
  );
  const {width, height} = useWindowDimensions(); // Get the window dimensions

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (stringKey !== '') {
          console.log('Restart streaming');
          setStreaming(true);
          console.log(`rtmp://myspace.com.mm:1945/live/${stringKey}`);
          ref.current?.startStreaming(
            stringKey,
            'rtmp://myspace.com.mm:1945/live',
          );
        }
      } else if (nextAppState.match(/inactive|background/)) {
        ref.current?.stopStreaming();
        console.log('Paused streaming');
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, [stringKey]);

  useEffect(() => {
    const fetchComments = async () => {
      await getLiveCommentList(
        dispatch,
        streamPostId,
        liveCommentList,
        isAddNewComments,
      );
    };

    fetchComments(); // Initial call
    const intervalId = setInterval(fetchComments, 7000); // Call every 7 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [dispatch, streamPostId, isAddNewComments]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      await getLiveProductDetails(streamPostId, dispatch);
    };

    fetchProductDetails(); // Initial call
    const intervalId = setInterval(fetchProductDetails, 15000); // Call every 15 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [dispatch, streamPostId]);

  const [isDialogVisible, setDialogVisible] = useState(false);

  const handleConfirm = async () => {
    const data = await liveHardEnd(streamPostId, broadCastId);
    if (data && data.api_status === 200) {
      dispatch(setStreamPostId(''));
      dispatch(setStreamerId(''));
      dispatch(setBroadcastId(''));
      dispatch(setLiveCommentList([]));
      dispatch(setLiveCommentListNew([]));
      dispatch(setLiveProductList([]));
      setDialogVisible(false);
      ref.current?.stopStreaming();
      Platform.OS === 'ios' ? dispatch(setFullScreen(false)) : null;
      setTimeout(() => {
        Platform.OS === 'ios' ? navigation.pop(2) : navigation.pop(3);
      }, 1000);
    }
  };

  const handleCancel = () => {
    setDialogVisible(false);
  };

  const liveCommentAction = () => {
    console.log('Clicked');
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const cameraPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        const microphonePermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );

        if (
          cameraPermission === PermissionsAndroid.RESULTS.GRANTED &&
          microphonePermission === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Camera and Microphone permissions granted');
        } else {
          Alert.alert(
            'Permissions Denied',
            'Camera and microphone permissions are required to stream.',
            [{text: 'OK'}],
          );
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      // For iOS, you can use a library like react-native-permissions to request permissions.
    }
  };

  useEffect(() => {
    // Request permissions when the screen is loaded
    requestPermissions();

    // Set the stream view to show after 5 seconds
    const timer = setTimeout(() => {
      setShowStream(true);
    }, 2000); // 5000 ms = 5 seconds

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <LiveEndDialog
        visible={isDialogVisible}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        darkMode={'disable'}
      />
      {showStream ? (
        <ApiVideoLiveStreamView
          style={{flex: 1, backgroundColor: 'black', alignSelf: 'stretch'}}
          ref={ref}
          camera={cameraID}
          enablePinchedZoom={true}
          video={{
            fps: 30,
            resolution: {width: 1280, height: 720},
            bitrate: 2 * 1024 * 1024,
            gopDuration: 1,
          }}
          audio={{
            bitrate: 128000,
            sampleRate: 44100,
            isStereo: true,
          }}
          isMuted={true}
          onConnectionSuccess={() => {
            setStreaming(true);
          }}
          onConnectionFailed={e => {
            console.error('Connection failed', e);
          }}
          onDisconnect={() => {
            setStreaming(false);
          }}
        />
      ) : (
        <Text style={{color: 'white'}}>Waiting for 5 seconds...</Text> // Show a loading message while waiting
      )}
      {/* Comments section */}
      <View
        style={{
          width: '100%',
          height: height * 0.3, // Responsive height
          position: 'absolute',
          bottom: 80,
        }}>
        <View style={{borderWidth: 0, marginHorizontal: 6}}>
          {liveCommentList.length >= 1 && (
            <LiveCommentsListStreaer
              data={liveCommentList}
              hideReaction={liveCommentAction}
              isViewer={false}
            />
          )}
        </View>
      </View>

      {!streaming && (
        <View
          style={{
            position: 'absolute',
            top: height * 0.05,
            right: width * 0.04,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
          }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              Platform.OS === 'ios'
                ? dispatch(setFullScreen(false))
                : navigation.pop(1);
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(49, 49, 49, 0.5)',
              borderRadius: 8,
              padding: 10,
            }}>
            <Image
              source={IconManager.close_dark}
              style={{width: 20, height: 20, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Header and Live viewer count */}
      <View
        style={{
          position: 'absolute',
          top: height * 0.05, // Use responsive values
          left: width * 0.04,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
        }}>
        {streaming && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(217, 56, 56, 0.5)',
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 2,
            }}>
            <Text
              style={{
                fontFamily: FontFamily.PoppinRegular,
                fontSize: fontSizes.size17,
                color: COLOR.White100,
              }}>
              Live
            </Text>
          </View>
        )}
        {productList.length >= 1 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(49, 49, 49, 0.5)',
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 2,
            }}>
            <Image
              source={IconManager.live_eye_viewer}
              style={{width: 20, height: 20}}
            />
            <SizedBox width={8} />
            <Text
              style={{
                fontFamily: FontFamily.PoppinRegular,
                fontSize: fontSizes.size17,
                color: COLOR.White100,
              }}>
              {productList[0].views}
            </Text>
          </View>
        )}
      </View>

      {/* Product information */}
      {productList.length >= 1 && (
        <View
          style={{
            position: 'absolute',
            top: height * 0.1, // Adjust to be responsive
            left: width * 0.04,
            width: width * 0.33,
            height: height * 0.17,
            alignItems: 'center',
            backgroundColor: 'rgba(49, 49, 49, 0.5)',
            borderRadius: 12,
          }}>
          <View style={{width: '100%', height: '90%'}}>
            <Image
              source={{uri: productList[0]?.product_media_data[0]?.image}}
              style={{
                width: '100%',
                height: '100%',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}
            />
          </View>
          <View
            style={{
              width: '100%',
              height: '20%',
              backgroundColor: 'white',
              borderBottomEndRadius: 8,
              borderBottomStartRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 8,
            }}>
            <Text
              style={{
                fontFamily: FontFamily.PoppinSemiBold,
                fontSize: fontSizes.size13,
                color: COLOR.Grey500,
              }}>
              {productList[0].price} Ks
            </Text>
          </View>
        </View>
      )}

      {/* Start/Stop Stream Button */}
      <View
        style={{
          position: 'absolute',
          bottom: height * 0.02, // Responsive bottom positioning
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            borderRadius: 8,
            backgroundColor: streaming
              ? 'rgba(217, 56, 56, 0.5)'
              : 'rgba(93, 189, 102, 0.5)',
            width: '90%',
            height: height * 0.06, // Responsive height
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={async () => {
            if (streaming) {
              // ref.current?.stopStreaming();
              await endLiveStream(
                streamerId,
                streamPostId,
                broadCastId,
                postToTimeLine,
              ).then(() => {
                setDialogVisible(true);
              });
            } else {
              // console.log(`rtmp://myspace.com.mm:1945/live/${stringKey}`);
              await generateStreamKey(formData, dispatch, ref).then(() => {});
            }
          }}>
          <Text
            style={{
              color: COLOR.White100,
              fontFamily: FontFamily.PoppinSemiBold,
              fontSize: fontSizes.size17,
            }}>
            {streaming ? 'End Live Stream' : 'Start Live Stream'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LiveStream;
