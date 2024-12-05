import {SafeAreaView, View, Text, TextInput, StyleSheet} from 'react-native';
import ActionAppBar from '../../../commonComponent/ActionAppBar';
import IconManager from '../../../assets/IconManager';
import {useNavigation} from '@react-navigation/native';
import {FontFamily} from '../../../constants/FONT';
import PIXEL from '../../../constants/PIXEL';
import COLOR from '../../../constants/COLOR';
import {useRef, useState} from 'react';
import ActionButton from '../../../components/Button/ActionButton';
import {useDispatch, useSelector} from 'react-redux';
import {setProductDescription} from '../../../stores/slices/CreateProductSlice';

const CreateProductFive = ({route}) => {
  const navigation = useNavigation();
  const [isFocused, setIsFocused] = useState(false);
  const {darkMode} = route.params;

  const productDescription = useSelector(
    state => state.CreateProductSlice.productDescription,
  );

  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState('');

  const handleProductDescriptionChange = text => {
    dispatch(setProductDescription(text));
    // if(text.length >= 10 || text != ''){
    setErrorMessage('');
    // }
  };

  const handelNagivate = () => {
    if (productDescription.length != '' && productDescription.length >= 10) {
      // setErrorMessage('');
      navigation.navigate('CreateProductSix', {darkMode: darkMode});
    } else if (productDescription.length < 10) {
      setErrorMessage('Description should be more than 10 characters.');
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor:
          darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
        flex: 1,
      }}>
      <ActionAppBar
        appBarText="Create New Product"
        source={IconManager.back_light}
        backpress={() => navigation.pop(5)}
        darkMode={darkMode}
      />
      <View style={styles.container}>
        <View style={styles.stepContainer}>
          <Text
            style={[
              styles.stepText,
              {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500},
            ]}>
            Step 5/9
          </Text>
          <View style={styles.progressBarBackground}>
            <View style={styles.progressBarForeground} />
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text
            style={[
              styles.descriptionTitle,
              {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500},
            ]}>
            Product Description
          </Text>
          <View>
            <TextInput
              // ref={textInputRef}
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
              value={productDescription}
              placeholder="Enter Product Description"
              placeholderTextColor={
                darkMode === 'enable' ? COLOR.Grey50 : COLOR.Grey300
              }
              onChangeText={handleProductDescriptionChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              multiline={true}
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

const styles = StyleSheet.create({
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
    width: '55.55%',
    height: '100%',
    backgroundColor: COLOR.Primary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR.Primary,
  },
  descriptionContainer: {
    rowGap: 10,
  },
  descriptionTitle: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: 19,
    color: COLOR.Grey150,
  },
  textInput: {
    height: 150,
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

export default CreateProductFive;
