import {SafeAreaView, StyleSheet, Text, View, Pressable} from 'react-native';
import React, {useState} from 'react';
import COLOR from '../../../constants/COLOR';
import ActionAppBar from '../../../commonComponent/ActionAppBar';
import {useNavigation} from '@react-navigation/native';
import IconManager from '../../../assets/IconManager';
import PIXEL from '../../../constants/PIXEL';
import {FontFamily, fontSizes, fontWeight} from '../../../constants/FONT';
import {useDispatch, useSelector} from 'react-redux';
import {setProductCategory} from '../../../stores/slices/CreateProductSlice';
import ActionButton from '../../../components/Button/ActionButton';
import {productCategories} from '../../../constants/CONSTANT_ARRAY'; // Assuming this is an array of category names
import RADIUS from '../../../constants/RADIUS';

const CreateProductFour = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {darkMode} = route.params;
  const productCategory = useSelector(
    state => state.CreateProductSlice.productCategory,
  );
  const [errorMessage, setErrorMessage] = useState('');

  const handleProductCategoryChange = category => {
    dispatch(setProductCategory(category.category_id)); // Use category_id to set the category
    setErrorMessage('');
  };

  const handleNavigate = () => {
    if (productCategory) {
      // Check if productCategory is selected
      navigation.navigate('CreateProductFive', {darkMode: darkMode});
    } else {
      setErrorMessage('Please select a category.');
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
        backpress={() => navigation.pop(4)}
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
              Step 4/9
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
              Select a category
            </Text>
          </View>
          <View style={styles.flexRowWrap}>
            {productCategories.map((item, index) => {
              let isActive = productCategory === item.category_id;
              let backgroundColor = isActive
                ? COLOR.Primary
                : darkMode === 'enable'
                ? COLOR.DarkFadeLight
                : COLOR.Blue50;
              let color = isActive
                ? COLOR.White
                : darkMode === 'enable'
                ? COLOR.White100
                : COLOR.Grey500;
              return (
                <Pressable
                  key={index}
                  onPress={() => handleProductCategoryChange(item)}
                  style={[styles.outlineButton, {backgroundColor}]}>
                  <Text style={[styles.outlineButtonText, {color}]}>
                    {item.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
          <View style={{marginTop: 5}}>
            <ActionButton text="Next" onPress={handleNavigate} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateProductFour;

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
    width: '44.44%',
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
    fontWeight: fontWeight.weight600,
  },
  errorText: {
    color: 'red',
    fontFamily: FontFamily.PoppinRegular,
    fontSize: 13,
    marginTop: 5,
  },
  outlineButton: {
    padding: 5,
    paddingHorizontal: PIXEL.px12,
    borderRadius: RADIUS.rd10,
    borderCurve: 'continuous',
  },
  outlineButtonText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: PIXEL.px15,
  },
  flexRowWrap: {
    gap: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
