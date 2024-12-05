// import React, {useEffect, useState, useRef} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import COLOR from '../../../constants/COLOR';
// import IconManager from '../../../assets/IconManager';
// import SPACING from '../../../constants/SPACING';
// import {FontFamily, fontSizes} from '../../../constants/FONT';
// import SizedBox from '../../../commonComponent/SizedBox';
// import {
//   marketCategory,
//   productCondition,
// } from '../../../constants/CONSTANT_ARRAY';
// import CustomTextInput from './liveComponent/customTextInput';
// import CustomActionButton from './liveComponent/customActionButton';
// import CustomNormalDropdown from './liveComponent/customNormalDropDown';
// import LiveImagePicker from './liveComponent/multipleImagePicker';
// import AnimatedSwitch from './liveComponent/customSwitch';
// import {
//   generateStreamKey,
//   startLiveStream,
// } from '../../../helper/LiveStream/liveStreamHelper';
// import {useDispatch, useSelector} from 'react-redux';
// import {
//   setSelectedCategory,
//   setSelectedCondition,
//   setSelectedImages,
//   setSwitchValue,
//   updateCreateProductFormField,
// } from '../../../stores/slices/liveStreamSlice';
// import CustomRadioButton from './liveComponent/customRadioButton';
// import {err} from 'react-native-svg';
// import {useNavigation} from '@react-navigation/native';

// const LiveCreateProduct = () => {
//   // const [selected, setSelected] = useState(null);
//   // const [switchValue, setSwitchValue] = useState(false);
//   const [validationErrors, setValidationErrors] = useState({});
//   const navigation = useNavigation();

//   const dispatch = useDispatch();

//   // Refs for text inputs
//   const nameInputRef = useRef(null);
//   const priceInputRef = useRef(null);
//   const discountInputRef = useRef(null);
//   const phoneInputRef = useRef(null);
//   const itemCountInputRef = useRef(null);
//   const descriptionInputRef = useRef(null);

//   // Select form validation state from Redux
//   const addProductFormValidation = useSelector(
//     state => state.LiveStreamSlice.addProductFormValidation,
//   );
//   const selectedPostPrivacy = useSelector(
//     state => state.LiveStreamSlice.selectedPostPrivacy,
//   );
//   const createProductFormValidation = useSelector(
//     state => state.LiveStreamSlice.createProductFormValidation,
//   );
//   const switchValue = useSelector(state => state.LiveStreamSlice.switchValue);
//   const selectedCategory = useSelector(
//     state => state.LiveStreamSlice.selectedCategory,
//   );
//   const selectedCondition = useSelector(
//     state => state.LiveStreamSlice.selectedCondition,
//   );
//   const selectedImages = useSelector(
//     state => state.LiveStreamSlice.selectedImages,
//   );
//   const isLoading = useSelector(state => state.LiveStreamSlice.commonLoading);

//   const handleImagesChange = (inputName, images) => {
//     console.log('Images : ', images);
//     dispatch(setSelectedImages(images)); // Add this line to update the Redux state
//     setValidationErrors(prev => ({...prev, [inputName]: null}));
//   };

//   // Handle text input changes and dispatch to Redux
//   const onChangeText = (inputName, text) => {
//     dispatch(updateCreateProductFormField({field: inputName, value: text}));
//     setValidationErrors(prev => ({...prev, [inputName]: null}));
//   };

//   const handleToggleSwitch = newValue => {
//     dispatch(setSwitchValue(newValue));
//     console.log('Switch is now:', newValue);
//   };

//   const validateInputs = () => {
//     const errors = {};
//     if (!createProductFormValidation.name.text) {
//       errors.name = 'Product is required';
//     }
//     if (!createProductFormValidation.price.text) {
//       errors.price = 'Price is required';
//     }
//     if (!createProductFormValidation.discount.text) {
//       errors.discount = 'Discount is required';
//     }
//     if (!createProductFormValidation.phone.text) {
//       errors.phone = 'Phone number is required';
//     }
//     if (!createProductFormValidation.itemCount.text) {
//       errors.itemCount = 'Unit count is required';
//     }
//     if (!createProductFormValidation.description.text) {
//       errors.description = 'Fill the description.';
//     }
//     if (!selectedCategory) {
//       errors.category = 'Category option must be selected';
//     }
//     if (selectedImages.length <= 0) {
//       errors.imageError = 'Need to select at least an image.';
//     }
//     if (!selectedCondition) {
//       errors.radioError = 'Product conditions need to selected.';
//     }
//     return errors;
//   };

//   // Log form values when the button is clicked
//   const handleCreateProduct = () => {
//     const errors = validateInputs();
//     if (Object.keys(errors).length > 0) {
//       setValidationErrors(errors); // Set validation errors
//       return; // Stop further execution if validation fails
//     }
//     const formData = {
//       selectedPostPrivacy: selectedPostPrivacy,
//       liveTitle: addProductFormValidation.title.text,
//       liveDescription: addProductFormValidation.description.text,
//       name: createProductFormValidation.name.text,
//       price: createProductFormValidation.price.text,
//       discount: createProductFormValidation.discount.text,
//       phone: createProductFormValidation.phone.text,
//       itemCount: createProductFormValidation.itemCount.text,
//       description: createProductFormValidation.description.text,
//       category: selectedCategory,
//       selectedCondition: selectedCondition,
//       switchValue: switchValue,
//       images: selectedImages, // Include selected images in form data
//     };

//     generateStreamKey(formData, navigation, dispatch);
//   };

//   // Handle privacy selection changes
//   const onCategoryChange = (inputName, value) => {
//     dispatch(setSelectedCategory(value)); // Dispatch the selected privacy option
//     setValidationErrors(prev => ({...prev, [inputName]: null}));
//   };

//   const handleSelect = selectedType => {
//     dispatch(setSelectedCondition(selectedType));
//     setValidationErrors(prev => ({...prev, ['radioError']: null}));
//   };
//   return (
//     <KeyboardAvoidingView
//       style={{flex: 1}}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       keyboardVerticalOffset={0} // Adjust this value if needed
//     >
//       <SafeAreaView style={{flex: 1, backgroundColor: COLOR.White100}}>
//         <View
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             borderBottomWidth: 0.3,
//             borderBottomColor: COLOR.Grey300,
//             backgroundColor: COLOR.White100,
//           }}>
//           <TouchableOpacity onPress={() => {}} activeOpacity={0.7}>
//             <Image
//               source={IconManager.back_light}
//               style={{
//                 width: SPACING.sp18,
//                 height: SPACING.sp18,
//                 resizeMode: 'contain',
//                 margin: SPACING.sp16,
//               }}
//             />
//           </TouchableOpacity>
//           <Text
//             style={{
//               fontFamily: FontFamily.PoppinRegular,
//               fontSize: fontSizes.size16,
//               color: COLOR.Grey500,
//             }}>
//             Live
//           </Text>
//           <SizedBox width={48} />
//         </View>
//         <ScrollView showsVerticalScrollIndicator={false}>
//           <View style={{padding: 16, gap: 16}}>
//             <CustomTextInput
//               label="Product Name"
//               labelEnable={false}
//               placeholder="Enter Product Name"
//               keyboardType="default"
//               onChangeText={text => onChangeText('name', text)}
//               value={createProductFormValidation.name.text}
//               ref={nameInputRef}
//               onSubmitEditing={() => priceInputRef?.current?.focus()}
//               blurOnSubmit={false}
//             />
//             {validationErrors.name && (
//               <Text style={{color: 'red'}}>{validationErrors.name}</Text>
//             )}
//             <CustomTextInput
//               label="Product Price"
//               labelEnable={false}
//               placeholder="Enter Product Price"
//               keyboardType="numeric"
//               onChangeText={text => onChangeText('price', text)}
//               value={createProductFormValidation.price.text}
//               ref={priceInputRef}
//               onSubmitEditing={() => discountInputRef?.current?.focus()}
//               blurOnSubmit={false}
//             />
//             {validationErrors.price && (
//               <Text style={{color: 'red'}}>{validationErrors.price}</Text>
//             )}
//             <CustomTextInput
//               label="Discount Price"
//               labelEnable={false}
//               placeholder="Enter Discount Price"
//               keyboardType="numeric"
//               onChangeText={text => onChangeText('discount', text)}
//               value={createProductFormValidation.discount.text}
//               ref={discountInputRef}
//               onSubmitEditing={() => phoneInputRef?.current?.focus()}
//               blurOnSubmit={false}
//             />
//             {validationErrors.discount && (
//               <Text style={{color: 'red'}}>{validationErrors.discount}</Text>
//             )}

//             <CustomNormalDropdown
//               data={marketCategory}
//               selectedValue={selectedCategory}
//               onValueChange={val => {
//                 onCategoryChange('category', val);
//               }}
//               placeholder="Select Category"
//               labelKey="name"
//               pointerKey="category_id"
//               label="Category"
//               isLabelVisible={false}
//             />
//             {validationErrors.category && (
//               <Text style={{color: 'red'}}>{validationErrors.category}</Text>
//             )}
//             <CustomTextInput
//               label="Mobile Number"
//               labelEnable={false}
//               placeholder="Mobile Number"
//               keyboardType="phone-pad"
//               onChangeText={text => onChangeText('phone', text)}
//               value={createProductFormValidation.phone.text}
//               ref={phoneInputRef}
//               onSubmitEditing={() => itemCountInputRef?.current?.focus()}
//               blurOnSubmit={false}
//             />
//             {validationErrors.phone && (
//               <Text style={{color: 'red'}}>{validationErrors.phone}</Text>
//             )}
//             <CustomTextInput
//               label="Total Item Units"
//               labelEnable={false}
//               placeholder="Total Item Units"
//               keyboardType="numeric"
//               onChangeText={text => onChangeText('itemCount', text)}
//               value={createProductFormValidation.itemCount.text}
//               ref={itemCountInputRef}
//               onSubmitEditing={() => descriptionInputRef?.current?.focus()}
//               blurOnSubmit={false}
//             />
//             {validationErrors.itemCount && (
//               <Text style={{color: 'red'}}>{validationErrors.itemCount}</Text>
//             )}

//             <View
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//               }}>
//               <Text
//                 style={{
//                   fontFamily: FontFamily.PoppinSemiBold,
//                   fontSize: fontSizes.size16,
//                   color: COLOR.Grey400,
//                   marginLeft: 2,
//                 }}>
//                 Product Conditions
//               </Text>
//               <CustomRadioButton
//                 options={productCondition}
//                 layout="horizontal"
//                 onSelect={handleSelect}
//                 showLabel={true}
//                 selectedOption={selectedCondition}
//               />
//             </View>
//             {validationErrors.radioError && (
//               <Text style={{color: 'red'}}>{validationErrors.radioError}</Text>
//             )}

//             <CustomTextInput
//               label="Product Description"
//               labelEnable={false}
//               placeholder="Product Description"
//               minLength={10}
//               multiline={true}
//               numberOfLines={4}
//               onChangeText={text => onChangeText('description', text)}
//               value={createProductFormValidation.description.text}
//               ref={descriptionInputRef}
//               // onSubmitEditing={() => priceInputRef?.current?.focus()}
//             />
//             {validationErrors.description && (
//               <Text style={{color: 'red'}}>{validationErrors.description}</Text>
//             )}

//             <LiveImagePicker
//               label="Product Image"
//               selectedImages={selectedImages}
//               onImagesChange={value => handleImagesChange('imageError', value)}
//             />
//             {validationErrors.imageError && (
//               <Text style={{color: 'red'}}>{validationErrors.imageError}</Text>
//             )}

//             <View
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//               }}>
//               <Text
//                 numberOfLines={1}
//                 style={{
//                   fontFamily: FontFamily.PoppinSemiBold,
//                   fontSize: fontSizes.size16,
//                   color: COLOR.Grey400,
//                 }}>
//                 Record stream to live
//               </Text>
//               <AnimatedSwitch
//                 isOn={switchValue}
//                 onToggle={handleToggleSwitch}
//               />
//             </View>
//             <CustomActionButton
//               onPressButton={() => {
//                 handleCreateProduct();
//               }}
//               text="Go Live"
//               darkMode="disable"
//               isLoading={isLoading}
//             />
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   selectedText: {
//     marginTop: 20,
//     fontSize: 18,
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: FontFamily.PoppinBold,
//     marginBottom: 20,
//   },
//   content: {
//     fontSize: 18,
//     marginBottom: 20,
//   },
// });

// export default LiveCreateProduct;
