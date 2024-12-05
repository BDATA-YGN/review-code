import React, {useEffect, useRef, useState, useCallback} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  BackHandler,
  SafeAreaView,
  AppState,
  Platform,
  PermissionsAndroid, // Import BackHandler for hardware back press
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
  endLiveStreamNormal,
  generateStreamKey,
  generateStreamKeyNormal,
  getLiveCommentList,
  getLiveCommentListNormalLive,
  liveHardEnd,
} from '../../../../helper/LiveStream/liveStreamHelper';
import LiveEndDialog from '../liveComponent/dialog/liveEndDialog';
import LiveCommentsListStreaer from '../liveComponent/liveCommentListStreamer';
import {
  setBroadcastIdNormalLive,
  setFullScreen,
  setLiveCommentListNewNormalLive,
  setLiveCommentListNormalLive,
  setLiveProductListNormalLive,
  setStreamerIdNormalLive,
  setStreamPostIdNormalLive,
} from '../../../../stores/slices/normalLiveSlice';
import {logJsonData} from '../../../../helper/LiveStream/logFile';

const NormalLive = ({}) => {
  const ref = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [cameraID, setCameraId] = useState('front');
  const [showStream, setShowStream] = useState(false);
  const navigation = useNavigation();
  const liveCommentList = useSelector(
    state => state.NormalLiveSlice.liveCommentList,
  );
  const isAddNewComments = useSelector(
    state => state.NormalLiveSlice.isAddNewComments,
  );

  const dispatch = useDispatch();

  const stringKey = useSelector(state => state.NormalLiveSlice.streamKey);
  const formData = useSelector(
    state => state.NormalLiveSlice.addProductFormValidation,
  );
  const streamPostId = useSelector(state => state.NormalLiveSlice.streamPostId);
  const broadCastId = useSelector(state => state.NormalLiveSlice.broadCastId);
  const streamerId = useSelector(state => state.NormalLiveSlice.streamerId);
  const appState = useRef(AppState.currentState);
  const productList = useSelector(
    state => state.NormalLiveSlice.liveProductList,
  );
  const postToTimeLine = useSelector(
    state => state.NormalLiveSlice.postToTimeLine,
  );
  const {width, height} = useWindowDimensions(); // Get the window dimensions

  useEffect(() => {
    const onBackPress = () => {
      return true; // Prevent default back press behavior
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, []);

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

  useEffect(() => {
    const fetchComments = async () => {
      await getLiveCommentListNormalLive(
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

  const [isDialogVisible, setDialogVisible] = useState(false);

  const handleConfirm = async () => {
    const data = await liveHardEnd(streamPostId, broadCastId);
    if (data && data.api_status === 200) {
      dispatch(setStreamPostIdNormalLive(''));
      dispatch(setStreamerIdNormalLive(''));
      dispatch(setBroadcastIdNormalLive(''));
      dispatch(setLiveCommentListNormalLive([]));
      dispatch(setLiveCommentListNewNormalLive([]));
      dispatch(setLiveProductListNormalLive([]));
      setDialogVisible(false);
      ref.current?.stopStreaming();
      Platform.OS === 'ios' ? dispatch(setFullScreen(false)) : null;
      setTimeout(() => {
        Platform.OS === 'ios' ? navigation.pop(1) : navigation.pop(2);
      }, 1000);
    }
  };

  const handleCancel = () => {
    setDialogVisible(false);
  };

  const liveCommentAction = () => {
    console.log('Clicked');
  };

  const toogleCamera = () => {
    if (cameraID === 'front') {
      setCameraId('back');
    } else {
      setCameraId('front');
    }
  };

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
            top: Platform.OS === 'ios' ? height * 0.05 : height * 0.01,
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

      {/* {!streaming && (
        <View
          style={{
            position: 'absolute',
            top: Platform.OS === 'ios' ? height * 0.1 : height * 0.07,
            right: width * 0.04,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
          }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              toogleCamera();
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(49, 49, 49, 0.5)',
              borderRadius: 8,
              padding: 10,
            }}>
            <Text style={{color: COLOR.White100}}>{cameraID}</Text>
          </TouchableOpacity>
        </View>
      )} */}

      {/* Header and Live viewer count */}
      <View
        style={{
          position: 'absolute',
          top: Platform.OS === 'ios' ? height * 0.05 : height * 0.01, // Use responsive values
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
            1024
          </Text>
        </View>
      </View>

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
              // Alert.alert('Start');
              // ref.current?.stopStreaming();
              // setDialogVisible(true);
              await endLiveStreamNormal(
                streamerId,
                streamPostId,
                broadCastId,
                postToTimeLine,
              ).then(() => {
                setDialogVisible(true);
              });
            } else {
              // console.log(`rtmp://myspace.com.mm:1945/live/${stringKey}`);
              await generateStreamKeyNormal(
                formData,
                dispatch,
                ref,
                (type = 'normal-live'),
              ).then(() => {});
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

export default NormalLive;
