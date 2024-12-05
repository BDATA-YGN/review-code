import React, {useState, forwardRef} from 'react';
import {View, TextInput, StyleSheet, Text} from 'react-native';
import COLOR from '../../../../constants/COLOR'; // Ensure you have this or replace it with a color
import {FontFamily, fontSizes} from '../../../../constants/FONT';

const CustomTextInput = forwardRef(
  (
    {
      placeholder,
      keyboardType = 'default',
      value = '',
      secureTextEntry = false,
      onChangeText,
      onSubmitEditing, // Add onSubmitEditing prop
      multiline = false, // New prop to handle multiline input
      numberOfLines = 1, // New prop to handle number of lines for multiline
      label,
      labelEnable = false,
      isValid,
    },
    ref,
  ) => {
    const [textVal, setValue] = useState(value);

    const handleInputChange = input => {
      setValue(input);
      onChangeText(input);
    };

    return (
      <View style={styles.container}>
        {labelEnable && (
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
        <TextInput
          ref={ref} // Use ref in the TextInput
          style={[
            styles.input,
            multiline && {height: 150, paddingTop: 8, paddingBottom: 8},
          ]} // Adjust height if multiline
          placeholder={placeholder}
          placeholderTextColor={COLOR.Grey200 || '#B0B0B0'}
          keyboardType={keyboardType}
          value={textVal}
          onChangeText={handleInputChange}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'} // Adjust text alignment for multiline
          onSubmitEditing={onSubmitEditing} // Handle submit event
          blurOnSubmit={!multiline} // Necessary for single-line TextInput to blur
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    color: COLOR.Black || '#333333',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#F9F9F9',
    fontSize: 16,
    color: '#333333',
  },
});

export default CustomTextInput;

// uses of CustomTextInput

// const [isFormValid, setIsFormValid] = useState({
//   title: {text: '', isValid: false},
//   description: {text: '', isValid: false},
// });

// // Handle validation status for each input
// const onChangeText = (inputName, text) => {
//   let isValid = text.trim().length > 0; // Basic validation: checking if text is not empty
//   setIsFormValid(prevState => ({
//     ...prevState,
//     [inputName]: {
//       text,
//       isValid,
//     },
//   }));
// };

// const validateForm = () => {
//   // Check if all fields' `isValid` properties are true
//   const allValid = Object.values(isFormValid).every(
//     field => field.isValid === true,
//   );

//   if (allValid) {
//     Alert.alert('Success', 'All inputs are valid!');
//   } else {
//     Alert.alert('Error', 'Please fill in all fields correctly.');
//   }
// };

// <CustomTextInput
// placeholder="Enter your email"
// keyboardType="email-address"
// onChangeText={text => {
//   onChangeText('title', text);
// }}
// />

// <CustomTextInput
// placeholder="Enter your description"
// minLength={10} // Minimum length validation for text input
// multiline={true}
// numberOfLines={4}
// onChangeText={text => {
//   onChangeText('description', text);
// }}
// />

// <Button title="Submit" onPress={validateForm} />
