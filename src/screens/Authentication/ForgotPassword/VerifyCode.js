import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TextInput,
} from 'react-native';
import React from 'react';
import {useRef, useState} from 'react';
import AppBar from '../../../components/AppBar';
import {useNavigation, useRoute} from '@react-navigation/native';
import COLOR from '../../../constants/COLOR';
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
import {
  submitForgotPasswordCode,
  submitForgotPasswordEmail,
} from '../../../helper/ApiModel';
import AppLoading from '../../../commonComponent/Loading';
import {Alert} from 'react-native';
import i18n from '../../../i18n';
import {setFetchDarkMode} from '../../../stores/slices/DarkModeSlice';
import {retrieveStringData} from '../../../helper/AsyncStorage';
import {storeKeys} from '../../../helper/AsyncStorage';
import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {TouchableOpacity} from 'react-native-gesture-handler';

const VerifyCode = () => {
  const navigation = useNavigation();
  const textInputRefs = useRef([]);
  const route = useRoute();
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
      ForgotPasswordCode(mandatoryValues);
  };

  const checkInputAreValid = data => {
    return data.every(value => value && value.trim() !== '');
  };

  const ForgotPasswordCode = async mandatoryValues => {
    setLoading(true);
    try {
      const data = await submitForgotPasswordCode({
        email: route.params.email,
        code: mandatoryValues[0],
      });

      if (data.api_status === 200) {
        setLoading(false);
        Alert.alert('Success', `${i18n.t(`translation:successCode`)}`, [
          {
            text: i18n.t(`translation:OK`),
            onPress: () => {},
          },
        ]);
        setTimeout(() => {
          navigation.navigate('UpdatePassword', {
            email: route.params.email,
            code: mandatoryValues[0],
          });
        }, 1000);
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
  const ForgotPasswordEmail = async mandatoryValues => {
    const email = route.params.email; // Extract the email from mandatoryValues

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
        darkMode == 'enable' ? styles.darkThemecontainer : styles.container
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
            style={darkMode == 'enable' ? styles.darkThemetitle : styles.title}>
            {i18n.t(`translation:checkEmail`)}
          </Text>
          <SizedBox height={PIXEL.px4} />
          <Text
            style={
              darkMode == 'enable' ? styles.darkThemesubtitle : styles.subtitle
            }>
            {i18n.t(`translation:enterCode`) + route?.params?.email}
          </Text>
          <SizedBox height={PIXEL.px20} />
          <View style={styles.textInputHolder}>
            <MandatoryTextInput
              ref={ref => (textInputRefs.current[0] = ref)}
              placeholder={i18n.t(`translation:submitCode`)}
              prefix={true}
              prefixIcon={IconManager.email_light}
            />
          </View>
          <SizedBox height={PIXEL.px70} />
          <View style={styles.textInputHolder}>
            {/* {isLoading && <ActivityIndicator style={{ marginTop: 10 }} color={COLOR.Primary} />} */}
            <ActionButton
              text={i18n.t(`translation:verify`)}
              onPress={() => callMakeAction()}
            />
          </View>
          <SizedBox height={PIXEL.px10} />
          <View style={{flexDirection: 'row', marginStart: PIXEL.px20}}>
            <Text
              style={{
                fontFamily: FontFamily.PoppinRegular,
                marginEnd: PIXEL.px4,
              }}>
              Haven’t got the email yet?
            </Text>
            <TouchableOpacity onPress={ForgotPasswordEmail}>
              <Text
                style={{
                  color: COLOR.Primary,
                  fontFamily: FontFamily.PoppinRegular,
                }}>
                Resend email
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {isLoading && <AppLoading />}
    </SafeAreaView>
  );
};

export default VerifyCode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White50,
    justifyContent: 'center',
    width: '100%',
  },
  darkThemecontainer: {
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
  darkThemetitle: {
    fontFamily: FontFamily.PoppinBold,
    color: COLOR.White,
    fontSize: fontSizes.size23,
    fontWeight: fontWeight.weight600,
  },
  subtitle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.Grey300,
    fontWeight: fontWeight.weight400,
  },
  darkThemesubtitle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.White,
    fontWeight: fontWeight.weight400,
  },
  textInputHolder: {
    width: '90%',
    // paddingHorizontal: SPACING.sp15,
  },
});
