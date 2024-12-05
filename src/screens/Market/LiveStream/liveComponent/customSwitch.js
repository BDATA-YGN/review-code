import React, {useRef, useState} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
} from 'react-native';

const AnimatedSwitch = ({isOn, onToggle}) => {
  const [isSwift, setSwift] = useState(isOn); // Manage state internally based on isOn
  const translateX = useRef(new Animated.Value(isOn ? 20 : 0)).current; // Initial position based on isOn
  const switchColor = useRef(new Animated.Value(isOn ? 1 : 0)).current; // Initial color based on isOn

  const toggleSwitch = () => {
    const newValue = !isSwift;
    setSwift(newValue); // Update the internal state
    onToggle(newValue); // Notify parent of the change

    Animated.parallel([
      Animated.timing(translateX, {
        toValue: newValue ? 20 : 0, // Adjusted for smaller thumb
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(switchColor, {
        toValue: newValue ? 1 : 0, // Changing the background color
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const interpolatedBackgroundColor = switchColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ddd', 'rgba(73, 78, 182, 0.9)'],
  });

  const interpolatedGlow = switchColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0,0,0,0)', 'rgba(73, 78, 182, 0.6)'],
  });

  return (
    <TouchableWithoutFeedback onPress={toggleSwitch}>
      <View style={styles.switchWrapper}>
        <Animated.View
          style={[styles.glowEffect, {backgroundColor: interpolatedGlow}]}
        />
        <Animated.View
          style={[
            styles.switchContainer,
            {backgroundColor: interpolatedBackgroundColor},
          ]}>
          <Animated.View
            style={[styles.switchThumb, {transform: [{translateX}]}]}
          />
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  switchWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchContainer: {
    width: 50,
    height: 28,
    borderRadius: 16,
    justifyContent: 'center',
    padding: 4,
    backgroundColor: '#ddd',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  glowEffect: {
    position: 'absolute',
    top: -1,
    bottom: -1,
    left: -1,
    right: -1,
    borderRadius: 25,
    zIndex: -1,
  },
});

export default AnimatedSwitch;

// Uses of Component
// import React, {useState} from 'react';
// import {View, Text, StyleSheet} from 'react-native';
// import EnhancedAnimatedSwitch from './EnhancedAnimatedSwitch'; // Update the import path as necessary

// const ParentComponent = () => {
//   const [switchValue, setSwitchValue] = useState(false);

//   const handleToggleSwitch = (newValue) => {
//     setSwitchValue(newValue);
//     console.log("Switch is now:", newValue); // Log the new value or perform other actions
//   };

//   return (
//     <View style={styles.container}>
//       <Text>Switch is {switchValue ? 'On' : 'Off'}</Text>
//       <EnhancedAnimatedSwitch isOn={switchValue} onToggle={handleToggleSwitch} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default ParentComponent;
