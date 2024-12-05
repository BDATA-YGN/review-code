import {SafeAreaView, StyleSheet, Text, View, TextInput} from 'react-native';
import React from 'react';
import COLOR from '../../../constants/COLOR';
import ActionAppBar from '../../../commonComponent/ActionAppBar';
import {useNavigation, useRoute} from '@react-navigation/native';
import IconManager from '../../../assets/IconManager';
import PIXEL from '../../../constants/PIXEL';
import {FontFamily, fontSizes} from '../../../constants/FONT';
import {useDispatch, useSelector} from 'react-redux';
import {useState} from 'react';
import {setProductName} from '../../../stores/slices/CreateProductSlice';
import ActionButton from '../../../components/Button/ActionButton';
import SPACING from '../../../constants/SPACING';
const CreateProductOne = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {darkMode} = route.params;
  const productName = useSelector(
    state => state.CreateProductSlice.productName,
  );
  const [isFocused, setIsFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleProductNameChange = text => {
    dispatch(setProductName(text));
    // if(text.length >= 10 || text != ''){
    setErrorMessage('');
    // }
  };

  

  const handelNagivate = () => {
    // Check if the trimmed product name meets the length requirement
    if (productName.trim().length >= 10) {
      // Clear any previous error messages
      setErrorMessage('');
      // Navigate to the next screen
      navigation.navigate('CreateProductTwo', {darkMode: darkMode});
    } else if (productName.trim() === '') {
      // Show error if the product name is only spaces or empty
      setErrorMessage('Product Name cannot be spaces!');
    } else if (productName.trim().length < 10) {
      // Show error if the product name is less than 10 characters (excluding spaces)
      setErrorMessage('Name should be more than 10 characters.');
    }
  };
  
  return (
    <SafeAreaView
      style={[
        styles.safeAreaView,
        {
          backgroundColor:
            darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
        },
      ]}>
      <ActionAppBar
        appBarText="Create New Product"
        source={IconManager.back_light}
        backpress={() => navigation.pop()}
        darkMode={darkMode}
      />
      <View style={styles.container}>
        <View style={styles.stepContainer}>
          <View>
            <Text
              style={[
                styles.stepText,
                {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500},
              ]}>
              Step 1/9
            </Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={styles.progressBarForeground} />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <View>
            <Text
              style={[
                styles.labelText,
                {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500},
              ]}>
              Product Name
            </Text>
          </View>
          <View>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor:
                    darkMode === 'enable'
                      ? COLOR.DarkThemLight
                      : COLOR.White100,
                  color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                },
                {
                  borderColor: errorMessage
                    ? 'red'
                    : isFocused
                    ? COLOR.Primary
                    : COLOR.Grey200,
                },
              ]}
              placeholderTextColor={
                darkMode === 'enable' ? COLOR.Grey50 : COLOR.Grey300
              }
              value={productName}
              placeholder="Enter Product Name"
              onChangeText={handleProductNameChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
          </View>

          <View style={{marginTop: 5}}>
            <ActionButton text="Next" onPress={handelNagivate} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateProductOne;

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: COLOR.White,
    flex: 1,
  },

  container: {
    padding: PIXEL.px16,
    rowGap: 15,
  },
  stepContainer: {
    rowGap: 10,
  },
  stepText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: PIXEL.px15,
  },
  progressBarBackground: {
    backgroundColor: COLOR.Grey50,
    height: 6,
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR.Grey50,
  },
  progressBarForeground: {
    width: '11.11%',
    height: '100%',
    backgroundColor: COLOR.Primary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR.Primary,
  },
  inputContainer: {
    rowGap: 10,
  },
  labelText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size19,
    color: COLOR.Grey150,
  },
  textInput: {
    backgroundColor: COLOR.White,
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: PIXEL.px15,
    textAlignVertical: 'top',
  },
  errorText: {
    color: 'red',
    fontFamily: FontFamily.PoppinRegular,
    fontSize: 13,
    marginTop: 5,
  },
});
