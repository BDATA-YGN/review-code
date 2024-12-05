import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import COLOR from '../../../constants/COLOR';
import {StatusBar} from 'react-native';
import AppBar from '../../../components/AppBar';
import {useRef, useState, useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import PIXEL from '../../../constants/PIXEL';
import {FontFamily} from '../../../constants/FONT';
import {fontSizes} from '../../../constants/FONT';
import {fontWeight} from '../../../constants/FONT';
import SizedBox from '../../../commonComponent/SizedBox';
import {Image} from 'react-native';
import assets from '../../../assets/IconManager';
import en from '../../../i18n/en';
import SPACING from '../../../constants/SPACING';
import MandatoryTextInput from '../../../components/TextInputBox/MandatoryTextInput';
import IconManager from '../../../assets/IconManager';
import ActionButton from '../../../components/Button/ActionButton';
import {submitForgotPasswordUpdate} from '../../../helper/ApiModel';
import {Alert} from 'react-native';
import AppLoading from '../../../commonComponent/Loading';
import RADIUS from '../../../constants/RADIUS';
import {TouchableOpacity} from 'react-native';
import i18n from '../../../i18n';
import {useSelector} from 'react-redux';
import {retrieveStringData} from '../../../helper/AsyncStorage';
import {storeKeys} from '../../../helper/AsyncStorage';
import {setFetchDarkMode} from '../../../stores/slices/DarkModeSlice';

export default function UpdatePassword() {
  const navigation = useNavigation();
  const textInputRefs = useRef([]);
  const route = useRoute();
  const [valuesMandatory, setValueMandatory] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const [secureEye, setSecureEye] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const {code, email} = route.params || {};

  const [darkMode, setDarkMode] = useState(null);
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  useEffect(() => {
    getDarkModeTheme();
  }, []);
  const getDarkModeTheme = async () => {
    try {
      const darkModeValue = await retrieveStringData({
        key: storeKeys.darkTheme,
      });
      if (darkModeValue !== null || undefined) {
        setDarkMode(darkModeValue);
      }
    } catch (error) {
      console.error('Error retrieving dark mode theme:', error);
    }
  };

  const secureTextChange = () => {
    setSecureText(!secureText);
  };
  const secureTextControl = () => {
    setSecureEye(!secureEye);
  };
  const getValuesMandatory = () => {
    textInputRefs.current.forEach(ref => {
      const value = ref.getValue();
      if (!value || value.trim() === '') {
        ref.setButtonPressed(true);
      } else {
        ref.setButtonPressed(false);
      }
    });
    const textInputValues = textInputRefs.current.map(ref => ref.getValue());
    return textInputValues;
  };

  const callMakeAction = async () => {
    const mandatoryValues = getValuesMandatory(); // Invoke the function to get values
    setValueMandatory(mandatoryValues); // Set state with the obtained values
    checkInputAreValid(mandatoryValues) === true &&
      ForgotPasswordUpdate(mandatoryValues);
  };

  const checkInputAreValid = data => {
    return data.every(value => value && value.trim() !== '');
  };
  const ForgotPasswordUpdate = async mandatoryValues => {
    setLoading(true);
    try {
      // Check if password and confirm password match
      if (mandatoryValues[0] !== mandatoryValues[1]) {
        Alert.alert(
          'Error',
          i18n.t(`translation:passwordMismatchError`),
          [
            {
              text: i18n.t(`translation:OK`),
              onPress: () => {},
            },
          ],
          {cancelable: true},
        );
        setLoading(false);
        return; // Return early if passwords don't match
      }

      // Proceed with registration if passwords match
      const data = await submitForgotPasswordUpdate({
        new_password: mandatoryValues[0],
        code: code,
        email: email,
      });
      if (data.api_status === 200) {
        // Success operation
        // storeJsonData({ key: storeKeys.loginCredential, data: data });
        setLoading(false);
        setIsSuccess(true);
      } else {
        Alert.alert('Error', `${data.errors.error_text}`, [
          {
            text: i18n.t(`translation:OK`),
            onPress: () => {},
          },
        ]);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);

  return (
    <SafeAreaView
      style={
        darkMode == 'enable' ? styles.darkThemeContainer : styles.container
      }>
      {isSuccess ? (
        <View style={styles.registerSuccess}>
          <Image
            source={assets.registeration_successful_light}
            style={styles.imageHeader}
            resizeMode="contain"
          />

          <View style={styles.success}>
            <View style={{marginBottom: 10}}>
              <Text
                style={
                  darkMode == 'enable'
                    ? styles.DtextSuccess
                    : styles.textSuccess
                }>
                {i18n.t(`translation:success`)}
              </Text>
            </View>
            <Text
              style={
                darkMode == 'enable'
                  ? styles.Dcongratulation
                  : styles.congratulation
              }>
              {i18n.t(`translation:forgotPasswordSuccessful`)}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Login');
            }}
            activeOpacity={0.9}
            style={styles.goToButton}>
            <Text style={[styles.textStyle]}>
              {i18n.t(`translation:goToLogin`)}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <SafeAreaView
          style={
            darkMode == 'enable' ? styles.darkThemeContainer : styles.container
          }>
          <StatusBar animated={true} backgroundColor={COLOR.Primary} />
          <AppBar
            isbackArrow
            onPressBack={() => navigation.goBack()}
            darkMode={darkMode}
          />
          <ScrollView owsHorizontalScrollIndicator={false} width={'100%'}>
            <View
              style={
                darkMode == 'enable'
                  ? styles.darkThemetextContainer
                  : styles.textContainer
              }>
              <SizedBox height={PIXEL.px20} />
              <Text
                style={
                  darkMode == 'enable' ? styles.DarkThemetitle : styles.title
                }>
                {i18n.t(`translation:setNewPassword`)}
              </Text>
              <SizedBox height={PIXEL.px4} />
              <Text
                style={
                  darkMode == 'enable'
                    ? styles.DarkThemesubtitle
                    : styles.subtitle
                }>
                {i18n.t(`translation:createPassword`)}
              </Text>
              <SizedBox height={PIXEL.px20} />
              <View style={styles.textInputHolder}>
                <MandatoryTextInput
                  ref={ref => (textInputRefs.current[0] = ref)}
                  placeholder={i18n.t(`translation:enterNewPassword`)}
                  prefix={true}
                  prefixIcon={IconManager.password_light}
                  postfix={true}
                  postfixIcon={
                    secureEye
                      ? IconManager.secureCloseEye
                      : IconManager.secureOpenEye
                  }
                  secureText={secureEye}
                  secureTextChange={secureTextControl}
                />
              </View>
              <SizedBox height={PIXEL.px2} />
              <View style={styles.textInputHolder}>
                <MandatoryTextInput
                  ref={ref => (textInputRefs.current[1] = ref)}
                  placeholder={i18n.t(`translation:enterNewPassword`)}
                  prefix={true}
                  prefixIcon={IconManager.password_light}
                  postfix={true}
                  postfixIcon={
                    secureText
                      ? IconManager.secureCloseEye
                      : IconManager.secureOpenEye
                  }
                  secureText={secureText}
                  secureTextChange={secureTextChange}
                />
              </View>
              <SizedBox height={PIXEL.px30} />
              <View style={styles.textInputHolder}>
                {/* {isLoading && <ActivityIndicator style={{ marginTop: 10 }} color={COLOR.Primary} />} */}
                <ActionButton
                  text={i18n.t(`translation:verify`)}
                  onPress={() => callMakeAction()}
                />
              </View>
            </View>
          </ScrollView>
          {isLoading && <AppLoading />}
        </SafeAreaView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White50,
    justifyContent: 'center',
    width: '100%',
  },
  darkThemeContainer: {
    flex: 1,
    backgroundColor: COLOR.DarkTheme,
    justifyContent: 'center',
    width: '100%',
  },
  textContainer: {
    flex: 1,
    backgroundColor: COLOR.White50,
    justifyContent: 'center',
    width: '100%',
    marginLeft: SPACING.sp20,
  },
  darkThemetextContainer: {
    flex: 1,
    backgroundColor: COLOR.DarkTheme,
    justifyContent: 'center',
    width: '100%',
    marginLeft: SPACING.sp20,
  },
  imageHeader: {
    width: PIXEL.px170,
    height: PIXEL.px170,
  },
  title: {
    fontFamily: FontFamily.PoppinBold,
    color: COLOR.Grey500,
    fontSize: fontSizes.size23,
    fontWeight: fontWeight.weight600,
  },
  DarkThemetitle: {
    fontFamily: FontFamily.PoppinBold,
    color: COLOR.White,
    fontSize: fontSizes.size23,
    fontWeight: fontWeight.weight600,
  },
  subtitle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.Grey300,
    fontWeight: fontWeight.weight400,
  },
  DarkThemesubtitle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.White,
    fontWeight: fontWeight.weight400,
  },
  textInputHolder: {
    width: '90%',
    // paddingHorizontal: SPACING.sp15,
  },
  textStyle: {
    color: COLOR.Grey50,
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  registerSuccess: {
    alignItems: 'center',
    // justifyContent: 'center',
    top: '20%',
    flex: 1,
  },
  success: {
    width: '95%',
    marginVertical: 15,
  },
  textSuccess: {
    fontFamily: FontFamily.PoppinBold,
    fontSize: fontSizes.size29,
    textAlign: 'center',
    fontWeight: fontWeight.weight700,
    color: COLOR.Grey500,
  },
  DtextSuccess: {
    fontFamily: FontFamily.PoppinBold,
    fontSize: fontSizes.size29,
    textAlign: 'center',
    fontWeight: fontWeight.weight700,
    color: COLOR.White100,
  },
  congratulation: {
    textAlign: 'center',
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.Grey500,
    fontWeight: fontWeight.weight400,
  },
  Dcongratulation: {
    textAlign: 'center',
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.White100,
    fontWeight: fontWeight.weight400,
  },
  goToButton: {
    backgroundColor: COLOR.Primary,
    padding: SPACING.sp10,
    borderRadius: RADIUS.rd7,
  },
});
