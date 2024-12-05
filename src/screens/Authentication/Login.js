import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import assets from '../../assets/IconManager';
import COLOR from '../../constants/COLOR';
import PIXEL from '../../constants/PIXEL';
import {FontFamily, fontSizes, fontWeight} from '../../constants/FONT';
import SizedBox from '../../commonComponent/SizedBox';
import MandatoryTextInput from '../../components/TextInputBox/MandatoryTextInput';
import SPACING from '../../constants/SPACING';
import RADIUS from '../../constants/RADIUS';
import IconManager from '../../assets/IconManager';
import ActionButton from '../../components/Button/ActionButton';
import CustomCheckBox from '../../components/Button/CustomCheckBox';
import IconPic from '../../components/Icon/IconPic';
import {stringText} from '../../constants/StringText';
import AppLoading from '../../commonComponent/Loading';
import {submitLoginData} from '../../helper/ApiModel';
import {
  storeKeys,
  storeJsonData,
  storeStringData,
  clearData,
  retrieveKey,
  retrieveStringData,
  retrieveJsonData,
} from '../../helper/AsyncStorage';
import {useNavigation} from '@react-navigation/native';
import {getData} from '../../helper/Controller';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {useSelector, useDispatch} from 'react-redux';
import AccountActivation from './AccountActivation';

const Login = () => {
  // References to hold TextInputComponent instances
  const navigation = useNavigation();
  const textInputRefs = useRef([]);
  const [valuesMandatory, setValueMandatory] = useState([]);
  const [secureText, setSecureText] = useState(true);
  const [isRemenber, setRemenber] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(null);
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const [errorMessage , setErrorMessage] = useState('');
  const dispatch = useDispatch();
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
  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);
  const secureTextChange = () => {
    setSecureText(!secureText);
  };

  const checkboxOnOf = () => {
    setRemenber(!isRemenber);
    return isRemenber;
  };

  const handleRememberMeChange = () => {
    try {
      if (checkboxOnOf() === true) {
        clearData({key: storeKeys.rememberMe});
      } else {
        storeStringData({
          key: storeKeys.rememberMe,
          data: stringText.rememberMeCredentialEnable,
        });
      }
    } catch (e) {
      throw e;
    }
  };

  //uses of mandatoryTextInput
  // Function to get values from each mandatory TextInputComponent
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

  //action required
  const callMakeAction = async () => {
    const mandatoryValues = getValuesMandatory(); // Invoke the function to get values
    setValueMandatory(mandatoryValues); // Set state with the obtained values
    checkInputAreValid(mandatoryValues) === true && loggingIn(mandatoryValues);
  };

  //validate the user input are not null or empty inside of mandatoryTextInput
  const checkInputAreValid = data => {
    return data.every(value => value && value.trim() !== '');
  };

  const loggingIn = async mandatoryValues => {
    setLoading(true);
    try {
      const data = await submitLoginData({
        username: mandatoryValues[0],
        password: mandatoryValues[1],
      });
     
      if (data.api_status === 200 && !data.type) {
        // Store login user data in AsyncStorage

        await storeJsonData({key: storeKeys.loginCredential, data: data});
        await storeJsonData({key: storeKeys.userInfoData, data: data});

        const isOnboardingComplete = await retrieveJsonData({
          key: storeKeys.isOnBoarding,
        });
        // setTimeout(() => {
        //   navigation.navigate(
        //     isOnboardingComplete ? 'BottomTabNavigator' : 'Onboarding',
        //   );
        // }, 1000);
        setTimeout(() => {
        // Use reset to clear the navigation stack and prevent going back to login
        navigation.reset({
          index: 0,
          routes: [
            { name: isOnboardingComplete ? 'BottomTabNavigator' : 'Onboarding' },
          ],
        });
      }, 1000);

      } else if (data.api_status === 200 && data.type == 'two-factor') {
        navigation.navigate('TwoFactor', {email_or_phone: mandatoryValues[0]});
      } else if (data.api_status === 600 && data.type == 'user-activation') {
        navigation.navigate('ActivationOptions');
      } else if (data.api_status === 600 && data.type == 'unusual-login') {
        navigation.navigate('UnusualLogin', {
          unusual_username: mandatoryValues[0],
        });
      } else if (data.api_status === 400) {
        // Alert.alert(
        //   'Error',
        //   data.errors.error_text || 'An unexpected error occurred',
        // );
        setErrorMessage(data.errors.error_text || 'An unexpected error occurred')
      } else {
        throw new Error(data.errors.error_text);
      }
    } catch (error) {
      // console.error('An error occurred:', error);
      setErrorMessage('An error occurred:', error)
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <SafeAreaView
        style={darkMode == 'enable' ? styles.Dcontainer : styles.container}>
        {/* <StatusBar animated={true} backgroundColor={darkMode == 'enable' ? COLOR.DarkThemLight : COLOR.White} barStyle={darkMode === 'enable' ? "light-content" : 'dark-content'}/> */}
        <ScrollView showsHorizontalScrollIndicator={false} width={'100%'}>
          <View
            style={darkMode == 'enable' ? styles.Dcontainer : styles.container}>
            <SizedBox height={PIXEL.px70} />
            <Image
              resizeMode="contain"
              source={
                darkMode == 'enable'
                  ? assets.welcomeback_dark
                  : assets.welcomeback_light
              }
              style={styles.imageHeader}
            />
            <SizedBox height={PIXEL.px10} />
            <Text style={darkMode == 'enable' ? styles.Dtitle : styles.title}>
              {stringText.loginScreenHeader}
            </Text>
            {/* <SizedBox height={PIXEL.px4} />
            <Text
              style={darkMode == 'enable' ? styles.Dsubtitle : styles.subtitle}>
              {stringText.loginScreenTitle}
            </Text> */}
            <SizedBox height={PIXEL.px50} />
            {errorMessage && 
                <View style = {{backgroundColor : '#D9534F', width : '90%', padding : 14 , marginBottom : 10 , borderRadius : 8}}>
                    <Text style = {{color : COLOR.White100, fontFamily : FontFamily.PoppinRegular, fontSize  : 12}}>{errorMessage}</Text>
                </View>
                }
            <View style={styles.textInputHolder}>
              <MandatoryTextInput
                ref={ref => (textInputRefs.current[0] = ref)}
                placeholder={stringText.placeholderEmailAndPhone}
                prefix={true}
                prefixIcon={IconManager.email_light}
              />
            </View>
            {/* <SizedBox height={PIXEL.px6} /> */}
            <View style={styles.textInputHolder}>
              <MandatoryTextInput
                ref={ref => (textInputRefs.current[1] = ref)}
                placeholder={stringText.password}
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
            <View style={styles.checkBoxHolder}>
              <View style={styles.checkbox}>
                <CustomCheckBox
                  value={isRemenber}
                  onValueChange={handleRememberMeChange}
                  tintColorTrue={COLOR.Primary}
                  tintColorFalse={COLOR.Primary}
                />
                <SizedBox width={PIXEL.px10} />
                <Text
                  style={
                    darkMode == 'enable'
                      ? styles.DrememberMe
                      : styles.rememberMe
                  }>
                  {stringText.rememberMe}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('RecoverOptions', {darkMode: darkMode});
                  // navigation.navigate('ActivationSuccess');
                  // Alert.alert(
                  //     'Forgot password',
                  //     'Please send email to <support@myspace.com.mm> to request new password.',
                  //     [
                  //         {
                  //             text: 'Ok',
                  //             onPress: () => {
                  //             },
                  //         }
                  //     ],
                  //     { cancelable: true }
                  // );
                }}>
                <Text style={darkMode == 'enable' ? styles.Dforgot : styles.forgot}>{stringText.forgotPassword}</Text>
              </TouchableOpacity>
            </View>
            <SizedBox height={PIXEL.px16} />
            <View style={styles.textInputHolder}>
              {/* {isLoading && <ActivityIndicator style={{ marginTop: 10 }} color={COLOR.Primary} />} */}
              <ActionButton
                text={stringText.login}
                onPress={() => callMakeAction()}
              />
            </View>
            <SizedBox height={PIXEL.px16} />
            <View style={styles.footercontainer}>
              {/* <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  // facebookLogin()
                  navigation.navigate('CommingSoon');
                }}
                style={styles.socialIconShape}>
                <IconPic
                  source={IconManager.facebook_logo}
                  width={PIXEL.px35}
                  height={PIXEL.px35}
                />
              </TouchableOpacity>
              <SizedBox width={24} height={0} />
              <TouchableOpacity
                onPress={() => {
                  // googleLogin()
                  navigation.navigate('CommingSoon');
                }}
                style={styles.socialIconShape}>
                <IconPic
                  source={IconManager.google_logo}
                  width={PIXEL.px35}
                  height={PIXEL.px35}
                />
              </TouchableOpacity>
            </View> */}

              <View style={styles.footer}>
                <Text
                  style={
                    darkMode == 'enable'
                      ? styles.Dfootertext
                      : styles.footertext
                  }>
                  {stringText.noUserAccount + ' '}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Registeration');
                  }}>
                  <Text style={styles.signup}>{stringText.signUp}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
        {isLoading && <AppLoading />}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  signup: {
    color: COLOR.Primary,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  footertext: {
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Grey400,
    fontSize: fontSizes.size15,
  },
  Dfootertext: {
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.White100,
    fontSize: fontSizes.size15,
  },
  socialIconShape: {
    backgroundColor: COLOR.SocialBakcground,
    width: PIXEL.px55,
    height: PIXEL.px55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.lg,
  },
  footercontainer: {
    flex: 1,
    flexDirection: 'column',
  },
  imageHeader: {
    width: PIXEL.px200,
    height: PIXEL.px200,
  },
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  Dcontainer: {
    flex: 1,
    backgroundColor: COLOR.DarkTheme,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  loginPhoto: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FontFamily.PoppinBold,
    color: COLOR.Grey500,
    fontSize: fontSizes.size29,
    fontWeight: fontWeight.weight800,
  },
  Dtitle: {
    fontFamily: FontFamily.PoppinBold,
    color: COLOR.White100,
    fontSize: fontSizes.size29,
    fontWeight: fontWeight.weight800,
  },
  subtitle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
    color: COLOR.Grey400,
    fontWeight: fontWeight.weight400,
    textAlign: 'center',
  },
  Dsubtitle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
    color: COLOR.White100,
    fontWeight: fontWeight.weight400,
    textAlign: 'center',
  },
  checkBoxHolder: {
    width: '100%',
    paddingHorizontal: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputHolder: {
    width: '100%',
    paddingHorizontal: SPACING.lg,
  },
  buttonStyle: {
    backgroundColor: COLOR.Primary,
    padding: SPACING.lg,
    borderRadius: RADIUS.xxs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  rememberMe: {
    color: COLOR.Grey500,
    fontFamily: 'Poppins-Regular',
    fontSize: fontSizes.size15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: SPACING.xxxxs,
  },
  DrememberMe: {
    color: COLOR.White100,
    fontFamily: 'Poppins-Regular',
    fontSize: fontSizes.size15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: SPACING.xxxxs,
  },
  forgot: {
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Grey500,
    fontSize: fontSizes.size15,
  },
  Dforgot: {
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.White,
    fontSize: fontSizes.size15,
  },
});
