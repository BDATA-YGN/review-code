import React, {useRef} from 'react';
import {View, Animated} from 'react-native';
import COLOR from '../../../constants/COLOR';

const LoadingDots = ({darkMode}) => {
  const translateY1 = useRef(new Animated.Value(0)).current;
  const translateY2 = useRef(new Animated.Value(0)).current;
  const translateY3 = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(translateY1, {
            toValue: -8,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateY1, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateY2, {
            toValue: -8,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateY2, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateY3, {
            toValue: -8,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateY3, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    animate();
  }, [translateY1, translateY2, translateY3]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor:
          darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.Grey50,
      }}>
      <Animated.Text
        style={{
          color: COLOR.Primary,
          transform: [{translateY: translateY1}],
          marginHorizontal: 2,
          fontSize: 55,
        }}>
        .
      </Animated.Text>
      <Animated.Text
        style={{
          color: COLOR.Primary,
          transform: [{translateY: translateY2}],
          marginHorizontal: 2,
          fontSize: 55,
        }}>
        .
      </Animated.Text>
      <Animated.Text
        style={{
          color: COLOR.Primary,
          transform: [{translateY: translateY3}],
          marginHorizontal: 2,
          fontSize: 55,
        }}>
        .
      </Animated.Text>
    </View>
  );
};

export default LoadingDots;
