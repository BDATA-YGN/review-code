import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import IconManager from '../../../../assets/IconManager';
import COLOR from '../../../../constants/COLOR';
import {FontFamily, fontSizes} from '../../../../constants/FONT';

const LiveImagePicker = ({
  maxImages = 9,
  label = '',
  onImagesChange,
  selectedImages,
}) => {
  const [images, setImages] = useState(selectedImages);

  useEffect(() => {
    // Notify the parent component whenever the images change
    onImagesChange(images);
  }, [images]);

  const pickImages = () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 0, // 0 for multiple selection
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const selectedImages = response.assets.map(asset => asset.uri);
        // Append new images to the existing list
        setImages(prevImages =>
          [...prevImages, ...selectedImages].slice(0, maxImages),
        ); // Ensures max limit
      }
    }).then(value => {});
  };

  const removeImage = index => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {label === '' ? null : (
          <Text
            style={{
              fontFamily: FontFamily.PoppinSemiBold,
              fontSize: fontSizes.size16,
              color: COLOR.Grey400,
              marginLeft: 2,
            }}>
            {label}
          </Text>
        )}
        <View style={styles.imageContainer}>
          {images.map((imageUri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{uri: imageUri}} style={styles.image} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}>
                <Text style={styles.removeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
          {/* sdfa */}
          {/* Show "Pick Image" only if limit hasn't been reached */}
          {images.length < maxImages && (
            <TouchableOpacity
              style={styles.pickImageWrapper}
              onPress={pickImages}>
              <Image source={IconManager.choose_photo} style={styles.image} />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 16,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  imageWrapper: {
    width: '30%', // To fit 3 images per row
    aspectRatio: 1, // Keeps the images square
    margin: '1.5%',
    position: 'relative', // For positioning the remove button
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLOR.Grey100,
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgba(73, 78, 182, 0.9)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: 23,
    height: 23,
    zIndex: 1, // Makes sure the button is on top of the image
  },
  removeButtonText: {
    color: 'white',
    fontWeight: '800',
  },
  pickImageWrapper: {
    width: '30%',
    aspectRatio: 1,
    margin: '1.5%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderRadius: 10,
  },
  pickImageText: {
    color: '#000',
    fontSize: 16,
  },
});

export default LiveImagePicker;
