import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import AppLoading from '../../commonComponent/Loading';
import MandatoryTextInput from '../../components/TextInputBox/MandatoryTextInput';
import ActionButton from '../../components/Button/ActionButton';
import {stringText} from '../../constants/StringText';
import COLOR from '../../constants/COLOR';
import IconManager from '../../assets/IconManager';
import SPACING from '../../constants/SPACING';
import {useDispatch, useSelector} from 'react-redux';
import {retrieveStringData, storeKeys} from '../../helper/AsyncStorage';
import {FontFamily, fontSizes, fontWeight} from '../../constants/FONT';
import {requestResendEmailActivation} from '../../helper/ApiModel';
import {assets} from '../../../react-native.config';
import PIXEL from '../../constants/PIXEL';
import {useNavigation} from '@react-navigation/native';

const AccountActivation = () => {
  const textInputRefs = useRef([]);
  const [darkMode, setDarkMode] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const navigation = useNavigation();
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const dispatch = useDispatch();
  useEffect(() => {
    getDarkModeTheme();
  }, []);
  const getValuesMandatory = () => {
    const values = textInputRefs.current.map(ref => {
      if (ref) {
        const value = ref.getValue();
        ref.setButtonPressed(!value || value.trim() === '');
        return value;
      }
      return '';
    });
    return values;
  };
  const callMakeAction = async () => {
    const mandatoryValues = getValuesMandatory(); // Invoke the function to get values
    checkInputAreValid(mandatoryValues) === true &&
      ResendEmail(mandatoryValues);
  };
  const checkInputAreValid = data => {
    return data.every(value => value && value.trim() !== '');
  };

  const ResendEmail = async mandatoryValues => {
    const email = mandatoryValues[0]; // Extract the email from mandatoryValues

    // Logging the email to check its value

    setLoading(true);
    try {
      const data = await requestResendEmailActivation(email);
      if (data.api_status === 200) {
        Alert.alert(
          'Success',
          'We have sent you an email, Please check your inbox/spam to verify your email.',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('Login');
              },
            },
          ],
        );
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
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <SafeAreaView
        style={darkMode == 'enable' ? styles.Dcontainer : styles.container}>
        <Image
          source={IconManager.resendIcon}
          style={styles.imageHeader}
          resizeMode="contain"
        />

        <Text style={darkMode == 'enable' ? styles.Dtitle : styles.title}>
          {stringText.loginScreenHeader}
        </Text>
        <Text style={darkMode == 'enable' ? styles.Dsubtitle : styles.subtitle}>
          {stringText.resendText}
        </Text>
        <View style={styles.textInputHolder}>
          <MandatoryTextInput
            ref={ref => (textInputRefs.current[0] = ref)}
            placeholder={stringText.placeholderEmailAndPhone}
            prefix={true}
            prefixIcon={IconManager.email_light}
          />
        </View>
        <View style={styles.textInputHolder}>
          <ActionButton text={'Resend'} onPress={() => callMakeAction()} />
        </View>
        {isLoading && <AppLoading />}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default AccountActivation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
    alignItems: 'center',
    width: '100%',
  },
  Dcontainer: {
    flex: 1,
    backgroundColor: COLOR.DarkTheme,
    alignItems: 'center',

    width: '100%',
  },
  textInputHolder: {
    width: '100%',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sp10,
    paddingVertical: 5,
  },
  title: {
    fontFamily: FontFamily.PoppinBold,
    color: COLOR.Grey500,
    fontSize: fontSizes.size23,
    fontWeight: fontWeight.weight800,
    marginBottom: SPACING.sp30,
  },
  Dtitle: {
    fontFamily: FontFamily.PoppinBold,
    color: COLOR.White100,
    fontSize: fontSizes.size23,
    fontWeight: fontWeight.weight800,
    marginBottom: SPACING.sp30,
  },
  imageHeader: {
    width: PIXEL.px200,
    height: PIXEL.px200,
    marginTop: '30%',
    marginBottom: '10%',
  },
  subtitle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
    color: COLOR.Grey400,
    fontWeight: fontWeight.weight400,
    textAlign: 'center',
    marginHorizontal: '10%',
    marginBottom: '5%',
  },
  Dsubtitle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
    color: COLOR.White100,
    fontWeight: fontWeight.weight400,
    textAlign: 'center',
    marginHorizontal: '10%',
    marginBottom: '5%',
  },
});
