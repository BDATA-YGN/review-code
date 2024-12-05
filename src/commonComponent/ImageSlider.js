import React, {useState, useRef} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  Text,
} from 'react-native';
import COLOR from '../constants/COLOR';

const {width} = Dimensions.get('window');

const ImageSlider = ({images}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {x: scrollX}}}],
    {
      useNativeDriver: false,
      listener: event => {
        const slide = Math.ceil(
          event.nativeEvent.contentOffset.x /
            event.nativeEvent.layoutMeasurement.width,
        );
        if (slide !== activeIndex && slide < images.length) {
          setActiveIndex(slide);
        }
      },
    },
  );

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ref={scrollViewRef}
        style={styles.scrollView}>
        {images.map((image, index) => (
          <Image key={index} source={{uri: image.image}} style={styles.image} />
        ))}
      </Animated.ScrollView>
      <View style={styles.overlay} pointerEvents="none">
        {images[activeIndex] ? (
          <Text style={styles.welcomeText}>{images[activeIndex].label}</Text>
        ) : (
          <Text style={styles.welcomeText}>No label</Text>
        )}
      </View>
      <View style={styles.indicatorWrapper}>
        {images.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];
          const indicatorWidth = scrollX.interpolate({
            inputRange,
            // outputRange: [8, 8, 8],
            outputRange: [8, 16, 8],
            extrapolate: 'clamp',
          });
          const backgroundColor = scrollX.interpolate({
            inputRange,
            // outputRange: [
            //   'rgba(255, 255, 255, 0.5)',
            //   '#fff',
            //   'rgba(255, 255, 255, 0.5)',
            // ],
            outputRange: [COLOR.Grey50, COLOR.PrimaryBlue50, COLOR.Grey50],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={index}
              style={[
                styles.indicator,
                {
                  width: indicatorWidth,
                  backgroundColor: backgroundColor,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

export default ImageSlider;

const styles = StyleSheet.create({
  container: {
    height: 200, // Adjust height as needed
    width: width,
  },
  scrollView: {
    width: width,
    height: '100%',
  },
  image: {
    width: width,
    height: '100%',
    resizeMode: 'contain',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24, // Adjust size as needed
    color: '#fff',
    fontWeight: 'bold',
  },
  indicatorWrapper: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    margin: 5,
  },
});
