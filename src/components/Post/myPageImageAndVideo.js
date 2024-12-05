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
} from 'react-native';
import IconManager from '../../assets/IconManager';
import AppImageSlider from './imageSliderTest';
import Video from 'react-native-video';
import {logJsonData} from '../../helper/LiveStream/logFile';
import COLOR from '../../constants/COLOR';
import {useDispatch, useSelector} from 'react-redux';
import {setIsVideoPlay} from '../../stores/slices/PostSlice';

const MyPageImageAndVideoFeed = ({photo_multi, postFile_full, index}) => {
  const [loading, setLoading] = useState(true); // Track loading state for the single image or video
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const styles = NewFeedImageStyle();
  const [isPlay, setPlay] = useState(false); // Track play state for video
  const [isControl, setControl] = useState(false); // Track video control visibility
  const videoRef = useRef(null); // Reference for video component
  const isVideoPlay = useSelector(state => state.PostSlice.isVideoPlay);
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

  if (postFile_full) {
    return (
      <View style={styles.container}>
        <View style={styles.singleMedia}>
          {isVideo(postFile_full) ? (
            <View style={[styles.videoContainer]}>
              <Video
                ref={videoRef}
                source={{uri: postFile_full}}
                style={styles.backgroundVideo}
                resizeMode="contain"
                paused={index === isVideoPlay ? false : true}
                controls={isControl}
                onEnd={() => {
                  videoRef.current.seek(0);
                  setControl(false);
                  dispatch(setIsVideoPlay(null));
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
                onControlsVisibilityChange={useCallback(
                  value => {},
                  [isControl],
                )}
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
                    index === isVideoPlay
                      ? dispatch(setIsVideoPlay(null))
                      : dispatch(setIsVideoPlay(index));
                    setControl(false);
                  }}>
                  <Image
                    style={{height: 24, width: 24, resizeMode: 'contain'}}
                    source={
                      index === isVideoPlay
                        ? IconManager.newFeedPlay
                        : IconManager.newFeedPause
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Image
              source={{uri: postFile_full}}
              style={styles.singleMedia}
              onLoadStart={handleMediaLoadStart}
              onLoadEnd={handleMediaLoadEnd}
            />
          )}
        </View>

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
    return <View style={styles.sliderContainer}>{renderImageList()}</View>;
  }

  return null;
};

const NewFeedImageStyle = () => {
  return StyleSheet.create({
    sliderContainer: {
      height: 250,
    },
    container: {
      width: '100%',
      height: 250,
      justifyContent: 'center',
      alignItems: 'center',
    },
    singleMedia: {
      width: '100%',
      height: '100%',
    },
    videoContainer: {
      position: 'relative',
      width: '100%',
      height: '100%',
      borderWidth: 1,
    },
    backgroundVideo: {
      position: 'absolute',
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

export default MyPageImageAndVideoFeed;
