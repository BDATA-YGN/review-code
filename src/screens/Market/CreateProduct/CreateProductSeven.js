import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import ActionAppBar from '../../../commonComponent/ActionAppBar';
import ActionButton from '../../../components/Button/ActionButton';
import COLOR from '../../../constants/COLOR';
import IconManager from '../../../assets/IconManager';
import PIXEL from '../../../constants/PIXEL';
import { FontFamily } from '../../../constants/FONT';
import { addProductPhoto, removeProductPhoto } from '../../../stores/slices/CreateProductSlice';
import IconPic from '../../../components/Icon/IconPic';
import SPACING from '../../../constants/SPACING';
import RADIUS from '../../../constants/RADIUS';

const CreateProductSeven = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { darkMode } = route.params;
  const productPhotos = useSelector(state => state.CreateProductSlice.productPhotos);
  const [photoIsNull, setPhotoValidate] = useState(false);

  const pickImage = () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'photo',
      cropping: true,
    })
      .then(images => {
        images.forEach(image => {
          dispatch(addProductPhoto(image.path));
        });
        setPhotoValidate(false);
      })
      .catch(error => {
        console.error('Image picker error:', error);
      });
  };

  const handleNavigate = () => {
    if (productPhotos.length > 0) {
      navigation.navigate('CreateProductEight', { darkMode: darkMode });
    } else {
      Alert.alert('Error', 'Please add at least one image');
    }
  };

  const handleRemovePhoto = (photo) => {
    dispatch(removeProductPhoto(photo));
  };

  const renderItem = ({ item ,index}) => (
    <View key={index} style={styles.photoContainer}>
      <Image
        source={{ uri: item }}
        style={styles.croppedImageStyle}
      />
      <TouchableOpacity
        style={styles.removePhotoButton}
        onPress={() => handleRemovePhoto(item)}
      >
        <Text style={styles.removePhotoButtonText}>x</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <TouchableOpacity activeOpacity={0.7} onPress={pickImage}>
      <View style={styles.photoContainer}>
        <Image source={IconManager.choose_photo} resizeMode="contain" style={styles.croppedImageStyle} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={{
        backgroundColor: darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
        flex: 1,
      }}>
      <ActionAppBar
        appBarText="Create Product"
        darkMode={darkMode}
        source={IconManager.back_light}
        backpress={() => navigation.pop(7)}
      />
      <View style={{ padding: PIXEL.px16, rowGap: 15 }}>
        <View style={{ rowGap: 10 }}>
          <View>
            <Text
              style={{
                fontFamily: FontFamily.PoppinRegular,
                fontSize: PIXEL.px15,
                color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
              }}>
              Step 7/9
            </Text>
          </View>
          <View
            style={{
              backgroundColor: COLOR.Grey50,
              height: 6,
              width: '100%',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: COLOR.Grey50,
            }}>
            <View
              style={{
                width: '77.77%',
                height: '100%',
                backgroundColor: COLOR.Primary,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: COLOR.Primary,
              }}
            />
          </View>
        </View>

        <View style={{ rowGap: 20 }}>
          <View style={{ rowGap: 10 }}>
            <View style={[{ marginBottom: 8 }]}>
              <Text
                style={{
                  fontFamily: FontFamily.PoppinSemiBold,
                  fontSize: 19,
                  color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                }}>
                Product Photos
              </Text>
            </View>
            {productPhotos.length === 0 ? (
              <TouchableOpacity activeOpacity={0.7} onPress={() => pickImage()}>
                <View style={styles.dottedCardStyle}>
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <IconPic
                      source={IconManager.gallery_light}
                      width={SPACING.sp40}
                      height={SPACING.sp40}
                    />
                    <Text
                      style={[
                        styles.textStylePrimary,
                        {
                          color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                        },
                      ]}>
                      Choose Images
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles.photoRowContainer}>
              {renderHeader()}
              {productPhotos.map((photo, index) => renderItem({ item: photo, index }))}
            </View>
            )}
          </View>
          <ActionButton text="Next" onPress={handleNavigate} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  photoContainer: {
    margin: 5,
    position: 'relative',
  },
  croppedImageStyle: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 5,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLOR.Primary,
    borderRadius: RADIUS.rd25, // Assuming the button has a width and height of 20px
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removePhotoButtonText: {
    color: 'white',

  },
  dottedCardStyle: {
    borderWidth: 1,
    borderColor: COLOR.Grey300,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStylePrimary: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: 16,
  },
  photoRowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default CreateProductSeven;
