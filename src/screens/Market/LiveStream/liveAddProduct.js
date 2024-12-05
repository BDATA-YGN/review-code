import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import COLOR from '../../../constants/COLOR';
import IconManager from '../../../assets/IconManager';
import SPACING from '../../../constants/SPACING';
import {FontFamily, fontSizes} from '../../../constants/FONT';
import SizedBox from '../../../commonComponent/SizedBox';
import CustomMiniDropdown from './liveComponent/customMiniDropDown';
import {postPrivary} from '../../../constants/CONSTANT_ARRAY';
import CustomTextInput from './liveComponent/customTextInput';
import CustomActionButton from './liveComponent/customActionButton';
import {useNavigation} from '@react-navigation/native';
import {
  updateAddProductFormField,
  setSelectedPostPrivacy, // Import the new action
} from '../../../stores/slices/liveStreamSlice';

const LiveAddProduct = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Refs to manage focus
  const titleInputRef = useRef(null);
  const descriptionInputRef = useRef(null);

  // State for validation messages
  const [validationErrors, setValidationErrors] = useState({});

  // Select form validation state and privacy from Redux
  const addProductFormValidation = useSelector(
    state => state.LiveStreamSlice.addProductFormValidation,
  );
  const selectedPostPrivacy = useSelector(
    state => state.LiveStreamSlice.selectedPostPrivacy,
  );
  const isLoading = useSelector(state => state.LiveStreamSlice.commonLoading);

  // Handle text input changes and dispatch to Redux
  const onChangeText = (inputName, text) => {
    dispatch(updateAddProductFormField({field: inputName, value: text}));
    setValidationErrors(prev => ({...prev, [inputName]: null})); // Clear error on change
  };

  // Handle privacy selection changes
  const onPrivacyChange = value => {
    dispatch(setSelectedPostPrivacy(value)); // Dispatch the selected privacy option
  };

  // Validate inputs
  const validateInputs = () => {
    const errors = {};
    if (!addProductFormValidation.title.text) {
      errors.title = 'Title is required';
    }
    if (!addProductFormValidation.description.text) {
      errors.description = 'Fill the description.';
    }
    if (!selectedPostPrivacy) {
      errors.privacy = 'Select Privacy';
    }
    return errors;
  };

  // Log form values when the button is clicked
  const handleAddProduct = () => {
    const errors = validateInputs();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors); // Set validation errors
      return; // Stop further execution if validation fails
    }

    console.log('Title:', addProductFormValidation.title.text);
    console.log('Description:', addProductFormValidation.description.text);
    console.log('Selected Privacy:', selectedPostPrivacy); // Log the selected privacy
    navigation.navigate('LiveCreateProduct');
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLOR.White100}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottomWidth: 0.3,
          borderBottomColor: COLOR.Grey300,
          backgroundColor: COLOR.White100,
        }}>
        <TouchableOpacity onPress={() => {}} activeOpacity={0.7}>
          <Image
            source={IconManager.back_light}
            style={{
              width: SPACING.sp18,
              height: SPACING.sp18,
              resizeMode: 'contain',
              margin: SPACING.sp16,
            }}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: FontFamily.PoppinRegular,
            fontSize: fontSizes.size16,
            color: COLOR.Grey500,
          }}>
          Live
        </Text>
        <SizedBox width={48} />
      </View>
      <View style={{padding: 16, gap: 16}}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <View style={{width: '15%'}}>
            <Image
              source={IconManager.default_cover}
              style={{width: 52, height: 52, borderRadius: 24}}
            />
          </View>
          <View style={{width: '51%', paddingLeft: 6}}>
            <Text
              style={{
                fontSize: 16,
                color: COLOR.Grey500,
                fontFamily: FontFamily.PoppinSemiBold,
              }}>
              Ye Ko Ko
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: COLOR.Grey300,
                fontFamily: FontFamily.PoppinSemiBold,
              }}>
              Type something here
            </Text>
          </View>
          <View style={{width: '34%'}}>
            <CustomMiniDropdown
              data={postPrivary}
              selectedValue={selectedPostPrivacy} // Bind selected value from Redux
              onValueChange={onPrivacyChange} // Call handler when privacy option changes
              placeholder="Select an option"
              pointerKey="id"
              labelKey="label"
              label="Label"
              isLabelVisible={false}
            />
            {validationErrors.privacy && (
              <Text style={{color: 'red'}}>{validationErrors.privacy}</Text>
            )}
          </View>
        </View>

        {/* CustomTextInput for title */}
        <CustomTextInput
          ref={titleInputRef} // Assign ref for focus management
          placeholder="Title"
          keyboardType="default"
          onChangeText={text => onChangeText('title', text)}
          value={addProductFormValidation.title.text}
        />
        {validationErrors.title && (
          <Text style={{color: 'red'}}>{validationErrors.title}</Text>
        )}

        {/* CustomTextInput for description */}
        <CustomTextInput
          ref={descriptionInputRef} // Assign ref to manage focus
          placeholder="Say something about this live video..."
          minLength={10}
          multiline={true}
          numberOfLines={4}
          onChangeText={text => onChangeText('description', text)}
          value={addProductFormValidation.description.text}
        />
        {validationErrors.description && (
          <Text style={{color: 'red'}}>{validationErrors.description}</Text>
        )}

        <CustomActionButton
          onPressButton={handleAddProduct}
          text="Add Product"
          darkMode="disable"
          isLoading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
};

export default LiveAddProduct;
