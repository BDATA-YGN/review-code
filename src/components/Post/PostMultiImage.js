import React, {useState, useEffect} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native'; // Import Image
import ImageSlider from 'react-native-image-slider';
import SPACING from '../../constants/SPACING';
import ImageViewing from './ImageViewing';

const PostMultiImage = props => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setIsVisible] = useState(false);
  const [imageSliderEnabled, setImageSliderEnabled] = useState(true);
  const [imageSizes, setImageSizes] = useState([]);

  useEffect(() => {
    // Preload image sizes
    const preloadImageSizes = async () => {
      const sizes = await Promise.all(
        props.photo_multi.map(async photo => {
          if (photo.image) {
            await Image.prefetch(photo.image); // Use Image.prefetch to preload images
            const {width, height} = await getImageSize(photo.image);
            return {uri: photo.image, width, height};
          } else {
            return null;
          }
        }),
      );
      setImageSizes(sizes.filter(size => size !== null));
    };

    if (props.photo_multi && Array.isArray(props.photo_multi)) {
      preloadImageSizes();
    }
  }, [props.photo_multi]);

  const getImageSize = async uri => {
    return new Promise((resolve, reject) => {
      Image.getSize(
        uri,
        (width, height) => resolve({width, height}),
        error => reject(error),
      );
    });
  };

  const onPositionChanged = index => {
    setCurrentIndex(index);
  };

  const toggleImageViewing = () => {
    setIsVisible(!visible);
    setImageSliderEnabled(!visible);
  };

  const onCloseImageViewing = () => {
    setIsVisible(false);
    setImageSliderEnabled(true);
  };

  const handleImagePress = index => {
    setCurrentIndex(index);
    toggleImageViewing();
  };

  if (
    props.photo_multi &&
    Array.isArray(props.photo_multi) &&
    props.photo_multi.length > 0
  ) {
    const images = props.photo_multi.map((photo, index) => ({
      uri: photo.image,
      width: imageSizes[index]?.width,
      height: imageSizes[index]?.height,
    }));
    const filteredImages = images.filter(image => image !== null);

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={toggleImageViewing} activeOpacity={1}>
          <ImageSlider
            images={images}
            customSlide={({index, item, style}) => (
              <TouchableOpacity
                key={index}
                activeOpacity={1}
                onPress={() => handleImagePress(index)}>
                <View style={style}>
                  <Image
                    style={styles.image}
                    // style={{width: item.width, height: item.height}}
                    source={{uri: item.uri}}
                    resizeMode="cover"
                  />
                  {/* {item.uri && (
                    <Image
                      style={styles.image}
                      source={{uri: item.uri}}
                      resizeMode="cover"
                    />
                  )} */}
                </View>
              </TouchableOpacity>
            )}
            onPositionChanged={onPositionChanged}
            disableTouch={visible || !imageSliderEnabled}
          />
        </TouchableOpacity>

        <ImageViewing
          visible={visible}
          images={filteredImages}
          currentIndex={currentIndex}
          onClose={onCloseImageViewing}
        />
      </View>
    );
  } else {
    return null;
  }
};

export default PostMultiImage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    marginTop: SPACING.sp16,
  },
  image: {
    flex: 1,
    width: '100%',
    aspectRatio: 1,
  },
});
