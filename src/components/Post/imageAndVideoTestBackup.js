import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import IconManager from '../../assets/IconManager';
import AppImageSlider from './imageSliderTest';
import Video, {ControlsStyles} from 'react-native-video';
import {useSelector} from 'react-redux';

const NewFeedImageAndVideo = ({
  photo_multi,
  postFile_full,
  isPlaying,
  onPlay,
  index,
}) => {
  const [loading, setLoading] = useState(true); // Track loading state for the single image or video
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const styles = NewFeedImageStyle();
  const isVideoPlay = useSelector(state => state.PostSlice.isVideoPlay);
  const [isPlay, setIsPlay] = useState(false);

  const handleMediaLoadStart = () => {
    setLoading(true);
  };

  useEffect(() => {
    if (isVideoPlay === index) {
      setIsPlay(true);
    } else {
      setIsPlay(false);
    }
  }, [isVideoPlay]);

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

  if (postFile_full) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.singleMedia}
          onPress={() => {
            isVideo(postFile_full) ? null : openModal();
          }} // Show controls on touch
        >
          {isVideo(postFile_full) ? (
            <View style={styles.videoContainer}>
              <Video
                source={{uri: postFile_full}}
                style={styles.singleMedia}
                resizeMode="contain"
                // muted={true}
                paused={!isPlay} // Control playback with the isPlaying prop
                controls={true} // Enable default controls
                controlsStyles={_controlsStyles}
                onProgress={handleProgress}
              />
              {/* Overlay with Touchable */}
              {/* {!isPlay && (
                <TouchableOpacity
                  style={styles.overlay}
                  onPress={() => {
                    setIsPlay(true);
                  }} // Call onPlay when overlay is pressed
                >
                  <Image
                    source={IconManager.video_icon_light}
                    style={{width: 45, height: 45, resizeMode: 'contain'}}
                  />
                </TouchableOpacity>
              )} */}
            </View>
          ) : (
            <Image
              source={{uri: postFile_full}}
              style={styles.singleMedia}
              onLoadStart={handleMediaLoadStart}
              onLoadEnd={handleMediaLoadEnd}
            />
          )}
        </TouchableOpacity>

        {/* Modal for fullscreen image or video */}
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
    return (
      <View style={styles.sliderContainer}>
        <AppImageSlider
          clickable={true}
          imageList={photo_multi.map(photo => ({
            image: photo.image,
            label: photo.image_org, // Adjust this based on your needs
          }))}
        />
      </View>
    );
  }

  return null;
};

const NewFeedImageStyle = () => {
  return StyleSheet.create({
    sliderContainer: {
      height: 250,
      //   borderWidth: 2,
      //   borderColor: 'red',
    },
    container: {
      width: '100%',
      height: 250,
      justifyContent: 'center',
      alignItems: 'center',
    },
    singleMedia: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    videoContainer: {
      position: 'relative',
      width: '100%',
      height: '100%',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
    },
    overlayText: {
      color: 'white',
      fontSize: 20,
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
