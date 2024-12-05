import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import React, {useRef, useState} from 'react';
import COLOR from '../../../constants/COLOR';
import AppBar from '../../../components/AppBar';
import assets from '../../../assets/IconManager';
import PIXEL from '../../../constants/PIXEL';
import SizedBox from '../../../commonComponent/SizedBox';
import en from '../../../i18n/en';
import {FontFamily} from '../../../constants/FONT';
import {fontSizes} from '../../../constants/FONT';
import {fontWeight} from '../../../constants/FONT';
import {useNavigation} from '@react-navigation/native';
import MandatoryTextInput from '../../../components/TextInputBox/MandatoryTextInput';
import SPACING from '../../../constants/SPACING';
import IconManager from '../../../assets/IconManager';
import RADIUS from '../../../constants/RADIUS';
import ActionButton from '../../../components/Button/ActionButton';
import {submitForgotPasswordEmail} from '../../../helper/ApiModel';
import AppLoading from '../../../commonComponent/Loading';
import {Alert} from 'react-native';
import i18n from '../../../i18n';
import {useEffect} from 'react';
import {setFetchDarkMode} from '../../../stores/slices/DarkModeSlice';
import {useSelector} from 'react-redux';
import {retrieveStringData} from '../../../helper/AsyncStorage';
import {storeKeys} from '../../../helper/AsyncStorage';

const ForgotPassword = () => {
  const navigation = useNavigation();
  const textInputRefs = useRef([]);
  const [valuesMandatory, setValueMandatory] = useState([]);
  const [isLoading, setLoading] = useState(false);
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
      ForgotPasswordEmail(mandatoryValues);
  };

  //validate the user input are not null or empty inside of mandatoryTextInput
  const checkInputAreValid = data => {
    return data.every(value => value && value.trim() !== '');
  };

  const ForgotPasswordEmail = async mandatoryValues => {
    const email = mandatoryValues[0]; // Extract the email from mandatoryValues

    // Logging the email to check its value

    setLoading(true);
    try {
      const data = await submitForgotPasswordEmail({email});

      if (data.api_status === 200) {
        setLoading(false);
        Alert.alert('Success', `${i18n.t(`translation:emailSuccess`)}`, [
          {
            text: 'OK',
            onPress: () => {},
          },
        ]);
        setTimeout(() => {
          navigation.navigate('VerifyCode', {email}); // Pass email to the next screen
        }, 1000);
      } else {
        Alert.alert('Error', `${data.errors.error_text}`, [
          {
            text: 'OK',
            onPress: () => {},
          },
        ]);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error in forgot password request:', error);
      Alert.alert('Error', 'Failed to send reset email. Please try again.');
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
      <StatusBar animated={true} backgroundColor={COLOR.Primary} />
      <AppBar
        isbackArrow
        onPressBack={() => navigation.goBack()}
        darkMode={darkMode}
      />
      <ScrollView showsHorizontalScrollIndicator={false} width={'100%'}>
        <View
          style={
            darkMode == 'enable' ? styles.darkThemeContainer : styles.container
          }>
          <Image
            source={
              darkMode == 'enable'
                ? assets.forgotpw_dark
                : assets.forgotpw_light
            }
            style={styles.imageHeader}
            resizeMode="contain"
          />
          <SizedBox height={PIXEL.px4} />
          <Text
            style={darkMode == 'enable' ? styles.darkThemetitle : styles.title}>
            {i18n.t(`translation:forgotPassword`)}
          </Text>
          <SizedBox height={PIXEL.px4} />
          <Text
            style={
              darkMode == 'enable' ? styles.darkThemesubtitle : styles.subtitle
            }>
            {i18n.t(`translation:forgotPassword_please`)}
          </Text>
          <SizedBox height={PIXEL.px20} />
        </View>
        <SizedBox height={PIXEL.px20} />
        <View style={styles.textInputHolder}>
          <MandatoryTextInput
            ref={ref => (textInputRefs.current[0] = ref)}
            placeholder={i18n.t(`translation:placeholderEmailAndPhone`)}
            prefix={true}
            prefixIcon={IconManager.email_light}
          />
        </View>
        <SizedBox height={PIXEL.px8} />
        <View style={styles.textInputHolder}>
          {/* {isLoading && <ActivityIndicator style={{ marginTop: 10 }} color={COLOR.Primary} />} */}
          <ActionButton
            text={i18n.t(`translation:email_reset`)}
            onPress={() => callMakeAction()}
          />
        </View>
      </ScrollView>
      {isLoading && <AppLoading />}
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White100,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  darkThemeContainer: {
    flex: 1,
    backgroundColor: COLOR.DarkTheme,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  imageHeader: {
    width: PIXEL.px200,
    height: PIXEL.px200,
  },
  title: {
    fontFamily: FontFamily.PoppinBold,
    color: COLOR.Grey500,
    fontSize: fontSizes.size23,
    fontWeight: fontWeight.weight800,
  },

  darkThemetitle: {
    fontFamily: FontFamily.PoppinBold,
    color: COLOR.White,
    fontSize: fontSizes.size23,
    fontWeight: fontWeight.weight800,
  },
  subtitle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
    color: COLOR.Grey400,
    fontWeight: fontWeight.weight400,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
    color: COLOR.Grey400,
    fontWeight: fontWeight.weight400,
    textAlign: 'center',
  },
  darkThemesubtitle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
    color: COLOR.White,
    fontWeight: fontWeight.weight400,
    textAlign: 'center',
  },
  textInputHolder: {
    width: '100%',
    paddingHorizontal: SPACING.sp15,
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
});
