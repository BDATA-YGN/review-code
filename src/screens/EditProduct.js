import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import ActionAppBar from '../commonComponent/ActionAppBar';
import IconManager from '../assets/IconManager';
import {useNavigation, useRoute} from '@react-navigation/native';
import {FontFamily, fontSizes, fontWeight} from '../constants/FONT';
import COLOR from '../constants/COLOR';
import PIXEL from '../constants/PIXEL';
import SizedBox from '../commonComponent/SizedBox';
import SPACING from '../constants/SPACING';
import RADIUS from '../constants/RADIUS';
import IconPic from '../components/Icon/IconPic';
import ImagePicker from 'react-native-image-crop-picker';
import {productCategories} from '../constants/CONSTANT_ARRAY';
import {setFetchDarkMode} from '../stores/slices/DarkModeSlice';
import {retrieveStringData, storeKeys} from '../helper/AsyncStorage';
import {useDispatch, useSelector} from 'react-redux';
import {FlatList} from 'react-native';
import {updateProduct} from '../helper/ApiModel';
import {
  getMarket,
  getMyProduct,
  getPurchased,
  makeUpdateProduct,
} from '../helper/Market/MarketHelper';
import i18n from '../i18n';
import {Alert} from 'react-native';
import SuccessedDialogNoAction from './Market/MarketHelper/success_dialog_no_action';
import AppLoading from '../commonComponent/Loading';
import {setLoading} from '../stores/slices/MydaySlice';
import WarningDialogNoAction from './Market/MarketHelper/warning_dialog_no_action';

const EditProduct = ({route}) => {
  const navigation = useNavigation();
  const {product, darkMode} = route.params;
  const dispatch = useDispatch();
  const [textEdit1, setTextEdit1] = useState(false);
  const [textEdit2, setTextEdit2] = useState(false);
  const [textEdit3, setTextEdit3] = useState(false);
  const [textEdit4, setTextEdit4] = useState(false);
  const [textEdit5, setTextEdit5] = useState(false);
  const [textEdit6, setTextEdit6] = useState(false);
  const [textEdit7, setTextEdit7] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [currency, setCurrency] = useState('');
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState(''); //
  const [images, setImages] = useState([]);
  const [photoIsNull, setPhotoValidate] = useState(false);
  const [productDescription, setProductDescription] = useState('');
  const [productItem, setProductItem] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [categoryId, setCategoryID] = useState('0');
  const [productLocation, setProductLocation] = useState('');
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [condition, setCondition] = useState('');
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const id = product.id;
  const [isLoading, setIsLoading] = useState(false);
  const [imgId, setImgId] = useState([]);
  const [deleteImageIDs, setDeleteImageIds] = useState([]);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isWarnDialogVisible, setWarnDialogVisible] = useState(false);
  const [updateImages, setUpdateImages] = useState([]);

  const handleShowDialog = () => {
    setDialogVisible(true);
  };

  const handleCloseDialog = () => {
    setDialogVisible(false);
    navigation.pop(2);
  };

  const handleShowDialogWarning = () => {
    setWarnDialogVisible(true);
  };

  const handleCloseDialogWarning = () => {
    setWarnDialogVisible(false);
    // navigation.goBack();
  };

  const handleProductCurrencyChange = selectedCurrency => {
    setCurrency(selectedCurrency);
    setCurrencyModalVisible(false);
  };
  const handleCategorySelect = selectedCategory => {
    setProductCategory(selectedCategory);
    setCategoryModalVisible(false);
  };

  const handleConditionSelect = condition => {
    setSelectedCondition(condition);
  };

  useEffect(() => {
    setCategoryID(product.category);
    if (product) {
      setProductName(product.name);
      setProductPrice(product.price);
      setCurrency(product.currency);
      setProductLocation(product.location);
      setProductItem(product.units);
      setProductCategory(findCategoryNameById(product.category));
      setProductDescription(product.description);
      setSelectedCondition(product.type);
      setImages(product.images.map(img => img.image));
    }
  }, [dispatch, product]);

  const findCategoryNameById = id => {
    // Alert.alert('Hello', `${id}`);
    const category = productCategories.find(cat => cat.category_id === id);
    return category ? category.name : 'Category not found';
  };

  const handleEditProduct = async () => {
    try {
      const data = await makeUpdateProduct(
        dispatch,
        id,
        productName,
        productPrice,
        currency,
        productLocation,
        parseInt(categoryId),
        productItem,
        productDescription,
        selectedCondition,
        updateImages,
        imgId,
        handleShowDialog,
        setIsLoading,
        handleShowDialogWarning,
      );
    } catch (error) {
      console.error(error);
    }
  };

  const pickImage = () => {
    return new Promise((resolve, reject) => {
      ImagePicker.openPicker({
        multiple: true,
        width: 400,
        height: 300,
        forceJpg: true,
        cropping: true,
      })
        .then(selectedImages => {
          const imagePaths = selectedImages.map(image => image.path);
          setImages(prevImages => [...prevImages, ...imagePaths]);
          setUpdateImages(prevImages => [...prevImages, ...imagePaths]);
          setPhotoValidate(false);
          resolve();
        })
        .catch(error => {
          // Alert.alert('Error', 'Failed to pick an image');
          reject(error);
        });
    });
  };

  const removeImage = index => {
    const foundItem = product.images.find(item => item.image === images[index]);
    if (foundItem) {
      imgId.push(foundItem.id);
      const newImages = [...images];
      newImages.splice(index, 1);
      setImages(newImages);
    } else {
      const newImages = [...images];
      newImages.splice(index, 1);
      setImages(newImages);
    }
  };

  const renderImageItem = ({item, index}) => (
    <View style={{}}>
      <Image
        source={{uri: item}}
        style={[styles.imagePreview, {width: 100, height: 100}]}
      />
      <TouchableOpacity
        onPress={() => removeImage(index)}
        style={styles.removeImageButton}>
        <Text style={styles.removeImageButtonText}>X</Text>
      </TouchableOpacity>
      <SizedBox height={SPACING.sp10} />
    </View>
  );
  const renderItem = () => {
    return (
      <View style={{}}>
        <View style={{marginHorizontal: 16}}>
          <Text
            style={[
              styles.sellProduct,
              {color: darkMode === 'enable' && COLOR.White100},
            ]}>
            Sell new product
          </Text>
          <Text
            style={[
              styles.saleProduct,
              {color: darkMode === 'enable' && COLOR.White100},
            ]}>
            You can list products for sale from the Add a Product tool.
          </Text>
        </View>
        <SizedBox height={SPACING.sp15} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent: 'center',
            borderColor: textEdit1 ? COLOR.Primary : COLOR.Grey100,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: PIXEL.px10,
            marginHorizontal: 16,
          }}>
          <View style={{marginEnd: PIXEL.px6}}>
            <Image
              source={
                textEdit1
                  ? IconManager.product_user_edit
                  : IconManager.product_user_light
              }
              resizeMode="contain"
              style={{height: 20, width: 20}}
            />
          </View>

          <TextInput
            placeholder="Product Name"
            style={[
              styles.textInput,
              {color: darkMode === 'enable' && COLOR.White100},
            ]}
            value={productName}
            onFocus={() => setTextEdit1(true)}
            onBlur={() => setTextEdit1(false)}
            placeholderTextColor={
              darkMode === 'enable' ? COLOR.Grey300 : COLOR.Grey300
            }
            onChangeText={setProductName}
          />
        </View>
        <SizedBox height={SPACING.sp18} />
        <View style={{flexDirection: 'row', gap: 10, marginHorizontal: 16}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderColor: textEdit2 ? COLOR.Primary : COLOR.Grey100,
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: PIXEL.px10,
              flex: 0.5,
            }}>
            <View style={{marginEnd: PIXEL.px6}}>
              <Image
                source={
                  textEdit2 ? IconManager.price_edit : IconManager.price_light
                }
                resizeMode="contain"
                style={{height: 20, width: 20}}
              />
            </View>
            <TextInput
              placeholder="Product Price"
              style={[
                styles.textInput,
                {color: darkMode === 'enable' && COLOR.White100},
              ]}
              value={productPrice}
              onFocus={() => setTextEdit2(true)}
              onBlur={() => setTextEdit2(false)}
              placeholderTextColor={COLOR.Grey300}
              onChangeText={setProductPrice}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderColor: textEdit3 ? COLOR.Primary : COLOR.Grey100,
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: PIXEL.px10,
              flex: 0.5,
            }}>
            <View style={styles.textInputBorderStyle}>
              <TextInput
                editable={false}
                value={currency === '0' ? 'Kyats' : 'USD'}
                placeholder="Select Currency"
                placeholderTextColor={COLOR.Grey300}
                style={[
                  styles.textInput,
                  {color: darkMode === 'enable' && COLOR.White100},
                ]}
                // color = {COLOR.Grey500}
              />
              <TouchableOpacity
                onPress={() => setCurrencyModalVisible(true)}
                style={styles.dropdownIconContainer}>
                <Image
                  source={
                    textEdit3
                      ? IconManager.downArrow_light
                      : IconManager.arrow_down
                  }
                  style={styles.dropdownIcon}
                  tintColor={COLOR.Grey200}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <SizedBox height={SPACING.sp18} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: textEdit4 ? COLOR.Primary : COLOR.Grey100,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: PIXEL.px10,
            marginHorizontal: 16,
          }}>
          <View style={{marginEnd: PIXEL.px6}}>
            <Image
              source={
                textEdit4
                  ? IconManager.location_light
                  : IconManager.event_location_light
              }
              resizeMode="contain"
              style={{height: 20, width: 20}}
            />
          </View>

          <TextInput
            placeholder="Location"
            style={[
              styles.textInput,
              {color: darkMode === 'enable' && COLOR.White100},
            ]}
            value={productLocation}
            onFocus={() => setTextEdit4(true)}
            onBlur={() => setTextEdit4(false)}
            placeholderTextColor={COLOR.Grey300}
            onChangeText={setProductLocation}
          />
        </View>
        <SizedBox height={SPACING.sp18} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: textEdit5 ? COLOR.Primary : COLOR.Grey100,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: PIXEL.px10,
            marginHorizontal: 16,
            flex: 0.5,
          }}>
          <View style={styles.textInputBorderStyle}>
            <TextInput
              editable={false}
              value={productCategory}
              placeholder="Select Category"
              placeholderTextColor={COLOR.Grey300}
              style={[
                styles.textInput,
                {color: darkMode === 'enable' && COLOR.White100},
              ]}
            />
            <TouchableOpacity
              onPress={() => setCategoryModalVisible(true)}
              style={styles.dropdownIconContainer}>
              <Image
                source={
                  textEdit3
                    ? IconManager.downArrow_light
                    : IconManager.arrow_down
                }
                style={styles.dropdownIcon}
                tintColor={COLOR.Grey200}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
        <SizedBox height={SPACING.sp18} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: textEdit6 ? COLOR.Primary : COLOR.Grey100,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: PIXEL.px10,
            marginHorizontal: 16,
          }}>
          <View style={{marginEnd: PIXEL.px6}}>
            <Image
              source={
                textEdit6 ? IconManager.unit_edit : IconManager.unit_light
              }
              resizeMode="contain"
              style={{height: 20, width: 20}}
            />
          </View>
          <TextInput
            placeholder="Total Item Units"
            style={[
              styles.textInput,
              {color: darkMode === 'enable' && COLOR.White100},
            ]}
            value={productItem}
            onFocus={() => setTextEdit6(true)}
            onBlur={() => setTextEdit6(false)}
            placeholderTextColor={COLOR.Grey200}
            onChangeText={setProductItem}
          />
        </View>
        <SizedBox height={SPACING.sp18} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start', // Align items to the center vertically
            borderColor: textEdit7 ? COLOR.Primary : COLOR.Grey100,
            borderWidth: 1,
            borderRadius: 8,
            marginHorizontal: 16,
            // padding: PIXEL.px10,
            height: PIXEL.px100,
          }}>
          <View style={{paddingTop: PIXEL.px15, marginHorizontal: PIXEL.px10}}>
            <Image
              source={
                textEdit7
                  ? IconManager.description_edit
                  : IconManager.description
              }
              resizeMode="contain"
              style={{height: 20, width: 20}}
            />
          </View>

          <TextInput
            placeholder="Product Description"
            style={[
              styles.textInput,
              {marginTop: Platform.OS === 'android' ? 0 : 8},
              {color: darkMode === 'enable' && COLOR.White100},
            ]}
            value={productDescription}
            onFocus={() => setTextEdit7(true)}
            onBlur={() => setTextEdit7(false)}
            placeholderTextColor={COLOR.Grey200}
            onChangeText={setProductDescription}
            multiline={true}
          />
        </View>
        <SizedBox height={SPACING.sp18} />
        <View style={{flexDirection: 'row', gap: 15, marginHorizontal: 16}}>
          <Image
            source={IconManager.product_condition}
            resizeMode="contain"
            style={{height: 20, width: 20}}
          />
          <TouchableOpacity onPress={() => handleConditionSelect('0')}>
            <Image
              source={
                selectedCondition === '0'
                  ? IconManager.selectd
                  : IconManager.select
              }
              resizeMode="contain"
              style={{height: 20, width: 20}}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.condition,
              {color: darkMode === 'enable' && COLOR.White100},
            ]}>
            New
          </Text>
          <TouchableOpacity onPress={() => handleConditionSelect('1')}>
            <Image
              source={
                selectedCondition === '1'
                  ? IconManager.selectd
                  : IconManager.select
              }
              resizeMode="contain"
              style={{height: 20, width: 20}}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.condition,
              {color: darkMode === 'enable' && COLOR.White100},
            ]}>
            Used
          </Text>
        </View>
        <SizedBox height={SPACING.sp18} />
        <View style={{marginHorizontal: 16}}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => pickImage()}>
            <View
              style={[
                styles.dottedCardStyle,
                photoIsNull && {borderColor: 'red'},
              ]}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <IconPic
                  source={IconManager.choose_image}
                  width={40}
                  height={40}
                />
                <Text
                  style={[
                    styles.textStylePrimary,
                    {color: darkMode === 'enable' && COLOR.White100},
                  ]}>
                  Choose Image
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginHorizontal: 16,
            marginTop: 16,
            marginBottom: 48,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {images.length > 0 && (
            <FlatList
              data={images}
              renderItem={renderImageItem}
              keyExtractor={(item, index) => index}
              numColumns={3}
              contentContainerStyle={{gap: 16, padding: 16}}
              columnWrapperStyle={{gap: 16}}
              // style={styles.imagePreviewContainer}
              // columnWrapperStyle={styles.imagePreview}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    );
  };
  const data = [{data: 1}];
  return (
    <SafeAreaView
      style={[
        styles.safeAreaView,
        {
          backgroundColor:
            darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
        },
      ]}>
      {isLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={COLOR.Primary} />
        </View>
      )}
      <View>
        <SuccessedDialogNoAction
          headerLabel="Success!"
          visible={isDialogVisible}
          onButtonPress={handleCloseDialog}
          darkMode={darkMode}
          labelText="Edit Product successful."
          buttonText="OK"
        />
        <WarningDialogNoAction
          headerLabel="Failed!"
          visible={isWarnDialogVisible}
          onButtonPress={handleCloseDialogWarning}
          darkMode={darkMode}
          labelText="product_category (POST) is missing!"
          buttonText="OK"
        />
        <ActionAppBar
          appBarText="Edit Product"
          source={IconManager.back_light}
          backpress={() => {
            navigation.goBack();
          }}
          darkMode={darkMode}
          actionButtonType={'text-button'}
          actionButtonPress={handleEditProduct}
          actionButtonText={'Save'}
        />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={renderItem}
        />
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={currencyModalVisible}
        onRequestClose={() => setCurrencyModalVisible(false)}>
        <View style={[styles.modalBox]}>
          <View
            style={[
              styles.modalInnerBox,
              {
                backgroundColor:
                  darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
              },
            ]}>
            <View style={styles.modalContent}>
              <View
                style={[
                  styles.closeButtonContainer,
                  {justifyContent: 'space-between', alignItems: 'center'},
                ]}>
                <Text
                  style={[
                    styles.modalTitle,
                    {
                      fontSize: fontSizes.size23,
                      color:
                        darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    },
                  ]}>
                  Select Currency
                </Text>
                <TouchableOpacity
                  onPress={() => setCurrencyModalVisible(false)}>
                  <Image
                    source={
                      darkMode === 'enable'
                        ? IconManager.close_dark
                        : IconManager.close_light
                    }
                    style={styles.closeIcon}
                    resizeMode="center"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.divider}></View>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleProductCurrencyChange('0')}>
                <Text
                  style={[
                    styles.modalOptionText,
                    {
                      color:
                        darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    },
                  ]}>
                  Kyats
                </Text>
              </TouchableOpacity>
              {/* Add more currency options here */}
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={categoryModalVisible}
        onRequestClose={() => setCategoryModalVisible(false)}>
        <View style={styles.modalBox}>
          <View
            style={[
              styles.modalInnerBox,
              {
                backgroundColor:
                  darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
              },
            ]}>
            <View style={styles.modalContent}>
              <View
                style={[
                  styles.closeButtonContainer,
                  {justifyContent: 'space-between', alignItems: 'center'},
                ]}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.modalTitle,
                    {
                      color:
                        darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    },
                  ]}>
                  Select a Category
                </Text>
                <TouchableOpacity
                  onPress={() => setCategoryModalVisible(false)}>
                  <Image
                    source={
                      darkMode === 'enable'
                        ? IconManager.close_dark
                        : IconManager.close_light
                    }
                    style={styles.closeIcon}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.divider}></View>
              {productCategories.map(category => (
                <TouchableOpacity
                  key={category.category_id}
                  style={styles.modalOption}
                  onPress={() => handleCategorySelect(category.name)}>
                  <Text
                    style={[
                      styles.modalOptionText,
                      {
                        color:
                          darkMode === 'enable'
                            ? COLOR.White100
                            : COLOR.Grey500,
                      },
                    ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
              {/* Add more currency options here */}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default EditProduct;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Ensure the overlay is on top
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: COLOR.White100,
  },
  sellProduct: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size19,
    fontWeight: fontWeight.weight600,
    color: COLOR.Grey500,
  },
  saleProduct: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    fontWeight: fontWeight.weight400,
    color: COLOR.Grey500,
  },
  textInput: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    fontWeight: fontWeight.weight400,
    paddingVertical: SPACING.sp12,
    flex: 1,
    color: COLOR.Grey500,

    // backgroundColor:'red'
  },
  // textInputDescription: {
  //   fontFamily: FontFamily.PoppinRegular,
  //   fontSize: fontSizes.size15,
  //   fontWeight: fontWeight.weight400,
  //   flex: 1,

  //   // backgroundColor:'red'
  // },
  inputContainer: {
    rowGap: 10,
  },
  labelText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: 19,
    color: COLOR.Grey150,
  },
  textInputBorderStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownIcon: {
    width: 17,
    height: 17,
  },
  modalBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalInnerBox: {
    backgroundColor: COLOR.White100,
    borderRadius: 8,
    padding: 20,
    width: '70%',
  },
  modalContent: {
    width: '100%',
    alignItems: 'flex-start',
  },
  closeButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalTitle: {
    fontSize: fontSizes.size23,
    fontWeight: '600',
    color: COLOR.Grey500,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
  divider: {
    width: '100%',
    height: 1,
    marginBottom: 8,
    marginTop: 8,
    backgroundColor: 'gray',
  },
  modalOption: {
    width: '100%',
    paddingVertical: 10,
    color: COLOR.Grey500,
  },
  modalOptionText: {
    fontSize: PIXEL.px16,
    color: COLOR.Grey500,
    fontFamily: FontFamily.PoppinRegular,
  },
  condition: {
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Grey300,
    fontSize: fontSizes.size15,
  },
  dottedCardStyle: {
    borderWidth: 2,
    borderRadius: 12,
    borderColor: COLOR.Grey200,
    borderStyle: 'dashed',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStylePrimary: {
    fontSize: 12,
    color: COLOR.Grey300,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  DtextStylePrimary: {
    fontSize: 12,
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  textStyleBlack: {
    fontSize: fontSizes.size15,
    color: COLOR.Grey500,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  DtextStyleBlack: {
    fontSize: fontSizes.size15,
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  croppedImageStyle: {width: '100%', height: '100%', borderRadius: RADIUS.rd12},
  textInputDescription: {
    flex: 1, // Take up the remaining space
    height: '100%', // Ensure the TextInput takes the full height of the parent View
    paddingVertical: 0, // Remove any vertical padding
    marginTop: PIXEL.px2, // Adjust top margin to align with icon
  },

  textStylePrimary: {
    color: '#555',
    marginTop: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageWrapper: {
    position: 'relative',
    margin: 5,
  },

  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    padding: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  addImageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  addImageButton: {
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 4,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  addImageButtonText: {
    color: '#007BFF',
    fontSize: 16,
  },
  imagePreviewContainer: {
    // flexDirection: 'row',
    // marginVertical: 10,
  },
  imagePreviewWrapper: {},
  imagePreview: {
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 5,
  },
  removeImageButtonText: {
    color: '#fff',
    fontSize: 12,
  },
});
