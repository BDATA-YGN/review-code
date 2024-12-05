import React, {useState, useRef} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  Text,
  TouchableOpacity,
} from 'react-native';
import COLOR from '../constants/COLOR';
import IconManager from '../assets/IconManager';

const {width} = Dimensions.get('window');

const LiveStreamImageSlider = ({images}) => {
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

  const goToPrevious = () => {
    if (activeIndex > 0) {
      scrollViewRef.current.scrollTo({
        x: (activeIndex - 1) * width,
        animated: true,
      });
      setActiveIndex(activeIndex - 1);
    }
  };

  const goToNext = () => {
    if (activeIndex < images.length - 1) {
      scrollViewRef.current.scrollTo({
        x: (activeIndex + 1) * width,
        animated: true,
      });
      setActiveIndex(activeIndex + 1);
    }
  };

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

      <View style={styles.indicatorWrapper}>
        {images.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];
          const indicatorWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: 'clamp',
          });
          const backgroundColor = scrollX.interpolate({
            inputRange,
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

      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          onPress={goToPrevious}
          disabled={activeIndex === 0}
          style={[styles.button, {opacity: activeIndex === 0 ? 0.5 : 1}]}>
          <Image
            style={{width: 18, height: 18, resizeMode: 'contain', margin: 6}}
            source={IconManager.previousWhite}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goToNext}
          disabled={activeIndex === images.length - 1}
          style={[
            styles.button,
            {opacity: activeIndex === images.length - 1 ? 0.5 : 1},
          ]}>
          <Image
            style={{width: 18, height: 18, resizeMode: 'contain', margin: 6}}
            source={IconManager.nextWhite}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LiveStreamImageSlider;

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: width,
    zIndex: 1,
  },
  scrollView: {
    width: width,
    height: '100%',
  },
  image: {
    width: width,
    height: '100%',
    resizeMode: 'contain',
    zIndex: 1,
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
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: '45%',
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: COLOR.Primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
