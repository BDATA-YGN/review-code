import React, {useState, useRef} from 'react';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
  Modal,
  TouchableOpacity,
  Platform,
} from 'react-native';
import IconManager from '../../assets/IconManager';
import COLOR from '../../constants/COLOR';

const {width} = Dimensions.get('window');

const AppImageSlider = React.memo(({imageList, clickable = true}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(Array(imageList.length).fill(true));
  const [modalVisible, setModalVisible] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [visibleImages, setVisibleImages] = useState([0]); // Track visible images
  const scrollX = useRef(new Animated.Value(0)).current;
  const styles = AppImageSliderStyle();

  const handleScroll = Animated.event(
    [{nativeEvent: {contentOffset: {x: scrollX}}}],
    {
      useNativeDriver: false,
      listener: event => {
        const slide = Math.ceil(event.nativeEvent.contentOffset.x / width);
        if (slide !== activeIndex && slide < imageList.length) {
          setActiveIndex(slide);
        }

        if (!visibleImages.includes(slide)) {
          setVisibleImages(prev => [...prev, slide]);
        }
      },
    },
  );

  const handleImageLoad = index => {
    const newLoadingState = [...loading];
    newLoadingState[index] = false;
    setLoading(newLoadingState);
  };

  const handleImagePress = index => {
    if (clickable) {
      setModalIndex(index);
      setModalVisible(true);
    }
  };

  const handleModalScroll = event => {
    const slide = Math.ceil(event.nativeEvent.contentOffset.x / width);
    if (slide !== modalIndex) {
      setModalIndex(slide);
    }
  };

  const renderItem = ({item, index}) => (
    <TouchableOpacity
      key={index}
      activeOpacity={1}
      style={styles.imageContainer}
      onPress={() => handleImagePress(index)}>
      {visibleImages.includes(index) ? (
        <Image
          source={{uri: item.image}}
          style={styles.image}
          onLoad={() => handleImageLoad(index)}
        />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={imageList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        // scrollEventThrottle={16}
        style={styles.scrollView}
      />

      {/* Modal to display the selected image */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <FlatList
            data={imageList}
            renderItem={({item}) => (
              <View style={styles.modalImageContainer}>
                <Image source={{uri: item.image}} style={styles.modalImage} />
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            onScroll={handleModalScroll}
            scrollEventThrottle={16}
            style={styles.modalScrollView}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}>
            <Image
              source={IconManager.close_dark}
              style={{width: 20, height: 20, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.indicatorWrapper}>
        {imageList.map((_, index) => {
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
            outputRange: [COLOR.Grey200, COLOR.Primary, COLOR.Grey200],
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
});

export default AppImageSlider;

const AppImageSliderStyle = () => {
  return StyleSheet.create({
    container: {
      height: 250,
      width: width,
    },
    scrollView: {
      width: width,
      height: '100%',
    },
    imageContainer: {
      width: width,
      height: 250,
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    image: {
      width: '100%',
      height: 250,
      resizeMode: 'cover',
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 1)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalScrollView: {
      width: width,
      height: '100%',
    },
    modalImageContainer: {
      width: width,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
    closeButton: {
      position: 'absolute',
      top: Platform.OS === 'android' ? 8 : 48,
      right: 8,
      backgroundColor: 'rgba(0, 0, 0, 1)',
      padding: 6,
      borderRadius: 5,
    },
    indicatorWrapper: {
      position: 'absolute',
      bottom: 8,
      left: 0,
      right: 24,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 3,
    },
    indicator: {
      height: 8,
      borderRadius: 4,
    },
  });
};
