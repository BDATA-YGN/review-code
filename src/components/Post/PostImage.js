import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {getFileType} from '../../helper/FileTypeCheck';
import ImageViewing from './ImageViewing';
import PIXEL from '../../constants/PIXEL';
import SPACING from '../../constants/SPACING';
import COLOR from '../../constants/COLOR';

const PostImage = props => {
  const [visible, setVisible] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(4 / 3); // Default aspect ratio
  const DEFAULT_ASPECT_RATIO = 4 / 3; // Default aspect ratio

  useEffect(() => {
    if (props.postFile && getFileType(props.postFile) === 'photo') {
      // Get the size of the image
      Image.getSize(
        props.postFile,
        (width, height) => {
          const calculatedAspectRatio = width / height;
          setAspectRatio(calculatedAspectRatio);
        },
        error => {
          console.warn('Failed to get image size:', error);
          // Handle the error gracefully, e.g., set a fallback aspect ratio
          setAspectRatio(DEFAULT_ASPECT_RATIO);
        },
      );
    }
  }, [props.postFile]);

  if (props.postFile && getFileType(props.postFile) === 'photo') {
    return (
      <View style={styles.bodyImageContainer}>
        <TouchableOpacity activeOpacity={1} onPress={() => setVisible(true)}>
          <Image
            source={{uri: props.postFile}}
            style={[styles.bodyImage, {aspectRatio}]}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <ImageViewing
          visible={visible}
          currentIndex={0}
          images={[{uri: props.postFile}]}
          onClose={() => setVisible(false)}
        />
      </View>
    );
  } else {
    return null;
  }
};

export default PostImage;

const styles = StyleSheet.create({
  bodyImageContainer: {
    marginTop: SPACING.sp8,
    flex: 1,
    width: '100%',
    maxHeight: Dimensions.get('window').height * 0.6,
    overflow: 'hidden',
  },
  bodyImage: {
    // width: '100%',
    borderColor: COLOR.Grey100,
    borderWidth: 0.3,
  },
});
