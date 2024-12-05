import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  ActivityIndicator,
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
import ActionButton from '../../../components/Button/ActionButton';
import {
  setProductCategory,
  setProductCondition,
  setProductCurrency,
  setProductDescription,
  setProductLocation,
  setProductName,
  setProductPhotos,
  setProductPrice,
  setProductUnit,
} from '../../../stores/slices/CreateProductSlice';
import {submitCreateProduct} from '../../../helper/ApiModel';
import AppLoading from '../../../commonComponent/Loading';

const CreateProductNine = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {darkMode} = route.params;
  const productName = useSelector(
    state => state.CreateProductSlice.productName,
  );
  const productPrice = useSelector(
    state => state.CreateProductSlice.productPrice,
  );
  const productCurrency = useSelector(
    state => state.CreateProductSlice.productCurrency,
  );
  const productCategory = useSelector(
    state => state.CreateProductSlice.productCategory,
  );
  const productDescription = useSelector(
    state => state.CreateProductSlice.productDescription,
  );
  const productCondition = useSelector(
    state => state.CreateProductSlice.productCondition,
  );
  const productPhotos = useSelector(
    state => state.CreateProductSlice.productPhotos,
  );
  // Fixed typo here
  const productLocation = useSelector(
    state => state.CreateProductSlice.productLocation,
  );
  const productUnit = useSelector(
    state => state.CreateProductSlice.productUnit,
  );
  const [isFocused, setIsFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);

  const handleProductUnitChange = text => {
    dispatch(setProductUnit(text));
  };

  const handleClearProductInputData = () => {
    dispatch(setProductName(''));
    dispatch(setProductPrice(''));
    dispatch(setProductCurrency(''));
    dispatch(setProductCategory(''));
    dispatch(setProductDescription(''));
    dispatch(setProductCondition(''));
    dispatch(setProductPhotos([]));
    dispatch(setProductLocation(''));
    dispatch(setProductUnit(''));
  };

  const handleCreateProduct = () => {
    if (productUnit) {
      setLoading(true);
      submitCreateProduct(
        productName,
        productPrice,
        productCurrency,
        productCategory,
        productDescription,
        productCondition,
        productPhotos, // Fixed typo here
        productLocation,
        productUnit,
      )
        .then(value => {
          if (value.api_status === 200) {
            handleClearProductInputData();
            setLoading(false);
            Alert.alert(
              'Success',
              'Product created successfully!',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    // Perform action on alert button press
                    // navigation.navigate('ProductList'); // Navigate to Product List or any other screen
                    navigation.pop(9);
                  },
                },
              ],
              {cancelable: false},
            );
          } else {
            console.error('Error creating product:', value);
            setLoading(false); // Stop loading if there's an error
          }
        })
        .catch(error => {
          // Handle the error
          console.error('Error creating product:', error);
          setLoading(false); // Stop loading if there's an error
        });
    } else if (productUnit === '') {
      setErrorMessage('Please fill the unit');
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
        backpress={() => navigation.pop(9)}
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
              Step 9/9
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
              Product Total Item Units
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
              value={productUnit}
              placeholder="Total Item Units"
              onChangeText={handleProductUnitChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              keyboardType="numeric"
            />
          </View>
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
          <View style={{marginTop: 5}}>
            <ActionButton
              text="Create"
              onPress={handleCreateProduct}
              disabled={isLoading}
            />
          </View>
        </View>
      </View>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLOR.Primary} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default CreateProductNine;

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
    width: '100%',
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
