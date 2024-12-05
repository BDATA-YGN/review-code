import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import ImageSlider from 'react-native-image-slider';
import ImageScalable from 'react-native-scalable-image';
import ImageViewing from './ImageViewing';
import SPACING from '../../constants/SPACING';

const PostPhotoAlbum = props => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setIsVisible] = useState(false);

  const onPositionChanged = index => {
    setCurrentIndex(index);
  };
  if (
    props.photo_album &&
    Array.isArray(props.photo_album) &&
    props.photo_album.length > 0
  ) {
    const images = props.photo_album.map(photo => photo.image);
    const imagess = images.map(image => ({uri: image}));
    if (images.length == '0') return null;
    return (
      <View style={[styles.imagecontainer]}>
        <View onTouchEnd={() => setIsVisible(true)}>
          <ImageSlider
            images={images}
            customSlide={({index, item, style, width}) => (
              <View key={index} style={style}>
                <ImageScalable
                  width={Dimensions.get('window').width}
                  source={{uri: item}}
                  style={styles.customImage}
                />
              </View>
            )}
            onPositionChanged={onPositionChanged}
          />
        </View>
        <ImageViewing
          visible={visible}
          images={imagess}
          currentIndex={currentIndex}
          onClose={() => setIsVisible(false)}
        />
      </View>
    );
  } else {
    return null;
  }
};

export default PostPhotoAlbum;
const styles = StyleSheet.create({
  imagecontainer: {
    marginTop: SPACING.sp16,
    flex: 1,
    width: '100%',
  },
  customImage: {
    flex: 1,
    width: '100%',
  },
});
