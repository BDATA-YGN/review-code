import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import COLOR from '../../constants/COLOR';
import PIXEL from '../../constants/PIXEL';
import { FontFamily, fontSizes, fontWeight } from '../../constants/FONT';
import SizedBox from '../../commonComponent/SizedBox';
import MandatoryTextInput from '../../components/TextInputBox/MandatoryTextInput';
import SPACING from '../../constants/SPACING';
import RADIUS from '../../constants/RADIUS';
import IconManager from '../../assets/IconManager';
import ActionButton from '../../components/Button/ActionButton';
import { stringText } from '../../constants/StringText';
import AppLoading from '../../commonComponent/Loading';
import { useNavigation } from '@react-navigation/native';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import i18n from '../../i18n';
import { accountDelete } from '../../helper/ApiModel';
import { clearData, storeKeys } from '../../helper/AsyncStorage';
import { useDispatch, useSelector } from 'react-redux';
import { setFetchDarkMode } from '../../stores/slices/DarkModeSlice';
import { retrieveStringData } from '../../helper/AsyncStorage';

const DeactivateAccount = () => {
  const navigation = useNavigation();
  const textInputRefs = useRef([]);
  const [secureText, setSecureText] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const dispatch = useDispatch();

  const getDarkModeTheme = async () => {
    try {
      const darkModeValue = await retrieveStringData({
        key: storeKeys.darkTheme,
      });
      if (darkModeValue !== null && darkModeValue !== undefined) {
        setDarkMode(darkModeValue);
      }
    } catch (error) {
      console.error('Error retrieving dark mode theme:', error);
    }
  };

  const secureTextChange = () => {
    setSecureText(!secureText);
  };

  useEffect(() => {
    getDarkModeTheme();
  }, []);

  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);

  const getValuesMandatory = () => {
    textInputRefs.current.forEach(ref => {
      const value = ref?.getValue();
      if (!value || value.trim() === '') {
        ref?.setButtonPressed(true);
      } else {
        ref?.setButtonPressed(false);
      }
    });
    const textInputValues = textInputRefs.current.map(ref => ref?.getValue());
    return textInputValues;
  };

  const callMakeAction = async () => {
    const mandatoryValues = getValuesMandatory();
    if (mandatoryValues[0]) {
      handleButtonPress(mandatoryValues);
    } else {
      Alert.alert('Error', 'Please enter your password.');
    }
  };

  const handleButtonPress = async mandatoryValues => {
    try {
      setLoading(true);
  
      const data = await accountDelete(mandatoryValues[0]);
  
      if (data.api_status === 200) {
        await clearData({ key: storeKeys.loginCredential });
        await clearData({ key: storeKeys.rememberMe });
        navigation.reset({
          index: 1,
          routes: [{ name: 'Login' }],
        });
      } else {
        Alert.alert(
          i18n.t('translation:deactivateAccount'),
          data.errors?.error_text || 'An error occurred'
        );
      }
    } catch (error) {
      console.error('An error occurred:', error);
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={darkMode == 'enable' ? styles.Dcontainer : styles.container}>
      <ActionAppBar
        appBarText={i18n.t(`translation:deactivateAccount`)}
        source={IconManager.back_light}
        backpress={() => {
          navigation.goBack();
        }}
        darkMode={darkMode}
      />
      <SizedBox height={SPACING.sp16} />
      <View style={darkMode == 'enable' ? styles.Dcontainer : styles.container}>
        <View style={styles.textInputHolder}>
          <MandatoryTextInput
            ref={ref => (textInputRefs.current[0] = ref)}
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
        <SizedBox height={PIXEL.px8} />
        <View style={styles.textInputHolder}>
          <ActionButton
            text={stringText.delete}
            onPress={callMakeAction}
          />
        </View>
        <SizedBox height={PIXEL.px16} />
      </View>
      {isLoading && <AppLoading />}
    </SafeAreaView>
  );
};

export default DeactivateAccount;

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
    color: COLOR.Grey300,
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
    width: PIXEL.px170,
    height: PIXEL.px170,
  },
  container: {
    flex: 1,
    backgroundColor: COLOR.White100,
  },
  Dcontainer: {
    flex: 1,
    backgroundColor: COLOR.DarkTheme,
  },
  loginPhoto: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FontFamily.PoppinBold,
    color: COLOR.Grey500,
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
    color: COLOR.White50,
    fontFamily: 'Poppins-Regular',
    fontSize: fontSizes.size15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: SPACING.xxxxs,
  },
  forgot: {
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Primary,
    fontSize: fontSizes.size15,
  },
});
