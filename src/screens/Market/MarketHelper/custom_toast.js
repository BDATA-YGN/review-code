import React, {useRef, useEffect} from 'react';
import {View, Text, StyleSheet, Animated, Easing, Platform} from 'react-native';
import COLOR from '../../../constants/COLOR';

const CustomToast = ({message, visible, onHide, duration = 2000}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      // Show Toast
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
      ]).start(() => {
        // Hide Toast after duration
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
              easing: Easing.in(Easing.ease),
            }),
            Animated.timing(translateY, {
              toValue: 50,
              duration: 300,
              useNativeDriver: true,
              easing: Easing.in(Easing.ease),
            }),
          ]).start(() => {
            if (onHide) {
              onHide();
            }
          });
        }, duration);
      });
    }
  }, [visible, opacity, translateY, duration, onHide]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          opacity,
          transform: [{translateY}],
        },
      ]}>
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 100,
    zIndex: 1,
    left: 100,
    right: 100,
    padding: 15,
    borderRadius: 10,
    backgroundColor: COLOR.PrimaryBlue50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  toastText: {
    color: COLOR.White100,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CustomToast;
