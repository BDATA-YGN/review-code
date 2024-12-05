import React, {useState, useCallback, useMemo, useEffect, useRef} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Text,
  Platform,
  Alert,
  Dimensions,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import IconManager from '../../assets/IconManager';
import AppImageSlider from './imageSliderTest';
import Video from 'react-native-video';
import {logJsonData} from '../../helper/LiveStream/logFile';
import COLOR from '../../constants/COLOR';
import {useDispatch, useSelector} from 'react-redux';
import {
  setIsMyPageVideoPlay,
  setIsMyPopularPostVideoPlay,
  setIsMySavePostVideoPlay,
  setIsVideoPlay,
} from '../../stores/slices/PostSlice';
import {stringKey} from '../../constants/StringKey';

const NewFeedImageAndVideo = ({
  photo_multi,
  postFile_full,
  index,
  whereFrom,
}) => {
  const [loading, setLoading] = useState(true); // Track loading state for the single image or video
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const styles = NewFeedImageStyle();
  const [isPlay, setPlay] = useState(false); // Track play state for video
  const [isControl, setControl] = useState(false); // Track video control visibility
  const videoRef = useRef(null); // Reference for video component
  const isVideoPlay = useSelector(state => state.PostSlice.isVideoPlay);
  const [dimensions, setDimensions] = useState({width: 0, height: 0});
  const isMyPageVideoPlay = useSelector(
    state => state.PostSlice.isMyPageVideoPlay,
  );
  const isMySavePostVideoPlay = useSelector(
    state => state.PostSlice.isMySavePostVideoPlay,
  );
  const isMyPopularPaostVideoPlay = useSelector(
    state => state.PostSlice.isMyPopularPaostVideoPlay,
  );
  const dispatch = useDispatch();
  const [isCustomPlay, setCustomPlay] = useState(false);

  const handleMediaLoadStart = () => {
    setLoading(true);
  };

  const handleMediaLoadEnd = () => {
    setLoading(false);
  };

  // Function to open modal for fullscreen view
  const openModal = () => {
    setModalVisible(true);
  };

  // Function to close modal
  const closeModal = () => {
    setModalVisible(false);
  };

  const isVideo = uri => {
    return uri.match(/\.(mp4|mov|mkv|webm|avi)$/i);
  };

  if (!photo_multi && !postFile_full) {
    return null;
  }

  const _controlsStyles = {
    hideNavigationBarOnFullScreenMode: true,
    hideNotificationBarOnFullScreenMode: true,
    liveLabel: 'LIVE',
  };

  const handleProgress = useCallback(data => {
    const {currentTime} = data;
    // console.log('Current playback time:', currentTime);
  }, []);

  const imageList = useMemo(
    () =>
      photo_multi && photo_multi.length > 0
        ? photo_multi.map(photo => ({
            image: photo.image,
            label: photo.image_org,
          }))
        : [],
    [photo_multi],
  );

  const renderImageList = useCallback(() => {
    return <AppImageSlider clickable={true} imageList={imageList} />;
  }, [imageList]);

  const playPause = () => {
    if (!isPlay && videoRef.current) {
      videoRef.current.seek(0); // Reset to start if video has ended
    }
    setPlay(!isPlay);
    setControl(true);
  };

  useEffect(() => {}, [isControl]);

  const showHideControl = () => {
    setControl(!isControl);
  };

  const [imageDimensions, setImageDimensions] = useState({
    width: '100%',
    height: 280,
  }); // default height
  const [videoDimensions, setVideoDimensions] = useState({
    width: '100%',
    height: 280,
  }); // default height

  const setVideoAspectRatio = (uri, width, height) => {
    const screenWidth = Dimensions.get('window').width;
    // const aspectRatio = width && height ? height / width : 8 / 16; // Use 16:9 if undefined
    const aspectRatio = width && height ? height / width : 8 / 16; // Use 16:9 if undefined

    const videoHeight = screenWidth * aspectRatio;

    setVideoDimensions({width: screenWidth, height: videoHeight});
  };

  // useEffect(() => {
  //   if (postFile_full) {
  //     if (isVideo(postFile_full)) {
  //       // Set video aspect ratio when the post file changes
  //       setVideoAspectRatio(postFile_full, 0, 0);
  //     } else {
  //       // Set image aspect ratio for non-video content
  //       setImageAspectRatio(postFile_full);
  //     }
  //   }
  // }, [postFile_full]);

  const setImageAspectRatio = uri => {
    Image.getSize(uri, (width, height) => {
      const screenWidth = Dimensions.get('window').width;
      const aspectRatio = height / width;
      const imageHeight = screenWidth * aspectRatio;

      setImageDimensions({width: screenWidth, height: imageHeight});
    });
  };

  const handleImageLoad = () => {
    setLoading(false);
  };

  if (postFile_full) {
    return (
      <View style={styles.container}>
        {isVideo(postFile_full) ? (
          <>
            <Video
              ref={videoRef}
              source={{uri: postFile_full}}
              // style={styles.backgroundVideo}
              resizeMode="contain"
              // onLoad={({naturalSize}) => {
              //   const {width, height} = naturalSize || {}; // Check if naturalSize exists
              //   setVideoAspectRatio(postFile_full, width, height);
              // }}
              style={[styles.backgroundVideo, videoDimensions]}
              paused={
                whereFrom === stringKey.my_page_post
                  ? index === isMyPageVideoPlay
                    ? false
                    : true
                  : whereFrom === stringKey.save_post
                  ? index === isMySavePostVideoPlay
                    ? false
                    : true
                  : whereFrom === stringKey.popular_post
                  ? index === isMyPopularPaostVideoPlay
                    ? false
                    : true
                  : index === isVideoPlay
                  ? false
                  : true
              }
              controls={isControl}
              onEnd={() => {
                videoRef.current.seek(0);
                setControl(false);
                whereFrom === stringKey.my_page_post
                  ? dispatch(setIsMyPageVideoPlay(null))
                  : whereFrom === stringKey.save_post
                  ? dispatch(setIsMySavePostVideoPlay(null))
                  : whereFrom === stringKey.popular_post
                  ? dispatch(setIsMyPopularPostVideoPlay(null))
                  : dispatch(setIsVideoPlay(null));
              }}
              focusable={false}
              controlsStyles={{
                hideForward: true,
                hidePlayPause: true,
                hideNext: true,
                hidePrevious: true,
                hideRewind: true,
                // hideFullscreen: true,
                hideNavigationBarOnFullScreenMode: false,
                hideNotificationBarOnFullScreenMode: false,
              }}
              onControlsVisibilityChange={useCallback(value => {}, [isControl])}
              onFullscreenPlayerWillPresent={() => {
                console.log('Player PRESNENT');
              }}
              onFullscreenPlayerWillDismiss={() => {
                console.log('Player DIMISS');
              }}
              onFullscreenPlayerDidPresent={() => {
                console.log('PRESNENT');
              }}
              onFullscreenPlayerDidDismiss={() => {
                console.log('DIMISS');
              }}
            />
            {whereFrom === stringKey.my_page_post ? (
              <>
                {index === isMyPageVideoPlay && !isControl ? (
                  <TouchableOpacity
                    style={styles.overlay}
                    onPress={() => {
                      if (isControl) {
                        setControl(false);
                      } else {
                        setControl(true);
                      }
                    }} // Call onPlay when overlay is pressed
                  >
                    <Text style={{color: 'red'}}></Text>
                  </TouchableOpacity>
                ) : null}
              </>
            ) : whereFrom === stringKey.save_post ? (
              <>
                {index === isMySavePostVideoPlay && !isControl ? (
                  <TouchableOpacity
                    style={styles.overlay}
                    onPress={() => {
                      if (isControl) {
                        setControl(false);
                      } else {
                        setControl(true);
                      }
                    }} // Call onPlay when overlay is pressed
                  >
                    <Text style={{color: 'red'}}></Text>
                  </TouchableOpacity>
                ) : null}
              </>
            ) : whereFrom === stringKey.popular_post ? (
              <>
                {index === isMyPopularPaostVideoPlay && !isControl ? (
                  <TouchableOpacity
                    style={styles.overlay}
                    onPress={() => {
                      if (isControl) {
                        setControl(false);
                      } else {
                        setControl(true);
                      }
                    }} // Call onPlay when overlay is pressed
                  >
                    <Text style={{color: 'red'}}></Text>
                  </TouchableOpacity>
                ) : null}
              </>
            ) : (
              <>
                {index === isVideoPlay && !isControl ? (
                  <TouchableOpacity
                    style={styles.overlay}
                    onPress={() => {
                      if (isControl) {
                        setControl(false);
                      } else {
                        setControl(true);
                      }
                    }} // Call onPlay when overlay is pressed
                  >
                    <Text style={{color: 'red'}}></Text>
                  </TouchableOpacity>
                ) : null}
              </>
            )}
            <View
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                // zIndex: 1,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  borderRadius: 16,
                  padding: 8,
                }}
                onPress={() => {
                  if (whereFrom === stringKey.my_page_post) {
                    index === isMyPageVideoPlay
                      ? dispatch(setIsMyPageVideoPlay(null))
                      : index === isMySavePostVideoPlay
                      ? dispatch(setIsMySavePostVideoPlay(null))
                      : index === isMyPopularPaostVideoPlay
                      ? dispatch(setIsMyPopularPostVideoPlay(null))
                      : dispatch(setIsMyPageVideoPlay(index));
                  } else {
                    index === isVideoPlay
                      ? dispatch(setIsVideoPlay(null))
                      : dispatch(setIsVideoPlay(index));
                  }
                  setControl(false);
                }}>
                <Image
                  style={{height: 24, width: 24, resizeMode: 'contain'}}
                  source={
                    whereFrom === stringKey.my_page_post
                      ? index === isMyPageVideoPlay
                        ? IconManager.newFeedPlay
                        : IconManager.newFeedPause
                      : whereFrom === stringKey.save_post
                      ? index === isMySavePostVideoPlay
                        ? IconManager.newFeedPlay
                        : IconManager.newFeedPause
                      : whereFrom === stringKey.popular_post
                      ? index === isMyPopularPaostVideoPlay
                        ? IconManager.newFeedPlay
                        : IconManager.newFeedPause
                      : index === isVideoPlay
                      ? IconManager.newFeedPlay
                      : IconManager.newFeedPause
                  }
                />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <TouchableWithoutFeedback activeOpacity={1} onPress={openModal}>
            <Image
              source={{uri: postFile_full}}
              style={[styles.singleMedia, imageDimensions]}
              // onLoad={() => {
              //   handleImageLoad();
              //   setImageAspectRatio(postFile_full);
              // }}
              onLoadStart={handleMediaLoadStart}
              onLoadEnd={handleMediaLoadEnd}
            />
          </TouchableWithoutFeedback>
        )}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            {isVideo(postFile_full) ? null : (
              <Image
                source={{uri: postFile_full}}
                style={styles.modalMedia}
                resizeMode="contain"
              />
            )}
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Image
              source={IconManager.close_dark}
              style={{width: 20, height: 20, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }

  if (photo_multi && photo_multi.length > 0) {
    return <View style={styles.container}>{renderImageList()}</View>;
  }

  return null;
};

const NewFeedImageStyle = () => {
  return StyleSheet.create({
    sliderContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    singleMedia: {
      resizeMode: 'contain', // maintains aspect ratio within the dimensions
    },
    videoContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backgroundVideo: {
      // position: 'absolute',
      backgroundColor: 'black',
      // opacity: 0.1,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0)', // Semi-transparent overlay
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 1)',
    },
    modalMedia: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    closeButton: {
      position: 'absolute',
      top: Platform.OS === 'android' ? 8 : 48,
      right: 8,
      backgroundColor: 'rgba(0, 0, 0, 1)',
      padding: 6,
      borderRadius: 5,
    },
  });
};

export default NewFeedImageAndVideo;
