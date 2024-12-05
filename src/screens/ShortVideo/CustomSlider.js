import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Animated,
  PanResponder,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import COLOR from '../../constants/COLOR';

const CustomSlider = ({
  currentTime,
  duration,
  onSeeking,
  onSeek,
  minimumTrackTintColor = '#FFFFFF',
  maximumTrackTintColor = '#333333',
  thumbTintColor = '#FFFFFF',
  skipInterval = 10, // Set the interval in seconds to skip
}) => {
  const [sliderWidth, setSliderWidth] = useState(1);
  const [thumbPosition, setThumbPosition] = useState(0); // Track thumb position
  const [showPopup, setShowPopup] = useState(false); // Track if the popup is visible
  const [popupTime, setPopupTime] = useState('0:00'); // Track the time displayed in the popup
  const pan = useRef(new Animated.Value(0)).current;

  const onLayout = event => {
    const {width} = event.nativeEvent.layout;
    setSliderWidth(width || 1);
  };

  // Function to update thumb position and animate pan value
  const updateThumbPosition = time => {
    const position = (time / duration) * sliderWidth;
    setThumbPosition(position); // Update thumb position based on given time
    pan.setValue(position); // Set pan value for thumb animation
  };

  // useEffect to update thumb position whenever currentTime, duration, or sliderWidth changes
  useEffect(() => {
    if (sliderWidth > 0 && duration > 0) {
      updateThumbPosition(currentTime); // Update based on currentTime
    }
  }, [currentTime, duration, sliderWidth]);

  // Handle user click on the track to seek video
  const handleTrackPress = event => {
    const {locationX} = event.nativeEvent;
    const newTime = (locationX / sliderWidth) * duration; // Calculate time based on clicked position
    onSeek(newTime); // Call onSeek to update the video playback time
    showPopupWithTime(newTime); // Show popup with the selected time
    updateThumbPosition(newTime); // Update thumb position based on new time
  };

  // Format time in mm:ss format
  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  // Show popup with the selected time
  const showPopupWithTime = time => {
    setPopupTime(formatTime(time));
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1000); // Hide popup after 1 second
  };

  return (
    <TouchableWithoutFeedback onPress={handleTrackPress}>
      <View style={styles.container} onLayout={onLayout}>
        {/* <TouchableWithoutFeedback onPress={handleTrackPress}> */}
        <View
          style={[
            styles.track,
            {backgroundColor: maximumTrackTintColor, zIndex: 0},
          ]}>
          <Animated.View
            style={[
              styles.minimumTrack,
              {
                width: thumbPosition, // Set the width of the minimum track based on the thumb position
                backgroundColor: minimumTrackTintColor,
              },
            ]}
          />
          {/* <Animated.View
            style={[
              styles.thumb,
              {
                left: thumbPosition - 8, // Position thumb in the middle of track
                backgroundColor: thumbTintColor,
              },
            ]}
          /> */}
        </View>
        {/* </TouchableWithoutFeedback> */}
        {/* Popup text to display the current time near the thumb */}
        {/* {showPopup && (
        <View style={[styles.popup, {left: thumbPosition - 15}]}>
          <Text style={styles.popupText}>{popupTime}</Text>
        </View>
      )} */}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 32,
    // borderWidth: 1,
    justifyContent: 'center',
  },
  track: {
    height: 4,
    // borderRadius: 2,
    backgroundColor: '#333',
  },
  minimumTrack: {
    height: 4,
    position: 'absolute',
    left: 0,
  },
  thumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    position: 'absolute',
    top: -4,
  },
  popup: {
    position: 'absolute',
    top: -30, // Position popup above the thumb
    padding: 4,
    backgroundColor: '#000',
    borderRadius: 4,
  },
  popupText: {
    color: '#FFF',
    fontSize: 12,
  },
});

export default CustomSlider;
