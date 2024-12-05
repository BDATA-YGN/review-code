import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
} from 'react-native';
import React from 'react';
import COLOR from '../../../constants/COLOR';
import ActionAppBar from '../../../commonComponent/ActionAppBar';
import {useNavigation} from '@react-navigation/native';
import IconManager from '../../../assets/IconManager';
import PIXEL from '../../../constants/PIXEL';
import {FontFamily} from '../../../constants/FONT';
import {useDispatch, useSelector} from 'react-redux';
import {useState} from 'react';
import {setProductPrice} from '../../../stores/slices/CreateProductSlice';
import ActionButton from '../../../components/Button/ActionButton';

const CreateProductTwo = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {darkMode} = route.params;
  const productPrice = useSelector(
    state => state.CreateProductSlice.productPrice,
  );
  const [isFocused, setIsFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleProductPriceChange = text => {
    dispatch(setProductPrice(text));
  };

  const handelNagivate = () => {
    if (productPrice) {
      navigation.navigate('CreateProductThree', {darkMode: darkMode});
    } else {
      Alert.alert('Error','Please enter the price');
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
        backpress={() => navigation.pop(2)}
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
              Step 2/9
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
              Product Price
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
              value={productPrice}
              placeholder="Enter Product Price"
              onChangeText={handleProductPriceChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              keyboardType="numeric"
            />
          </View>

          <View style={{marginTop: 5}}>
            <ActionButton text="Next" onPress={handelNagivate} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateProductTwo;

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
    width: '22.22%',
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
    fontSize: 19,
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
