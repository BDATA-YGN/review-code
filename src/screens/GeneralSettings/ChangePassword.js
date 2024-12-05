import {Alert, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import COLOR from '../../constants/COLOR';
import PIXEL from '../../constants/PIXEL';
import {FontFamily, fontSizes, fontWeight} from '../../constants/FONT';
import MandatoryTextInput from '../../components/TextInputBox/MandatoryTextInput';
import SPACING from '../../constants/SPACING';
import RADIUS from '../../constants/RADIUS';
import IconManager from '../../assets/IconManager';
import {stringText} from '../../constants/StringText';
import AppLoading from '../../commonComponent/Loading';
import {useNavigation} from '@react-navigation/native';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import i18n from '../../i18n';
import SizedBox from '../../commonComponent/SizedBox';
import ActionButton from '../../components/Button/ActionButton';
import {changePassword} from '../../helper/ApiModel';
import {useDispatch, useSelector} from 'react-redux';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {retrieveStringData} from '../../helper/AsyncStorage';
import {storeKeys} from '../../helper/AsyncStorage';

const ChangePassword = () => {
  // References to hold TextInputComponent instances
  const navigation = useNavigation();
  const textInputRefs = useRef([]);
  const [valuesMandatory, setValueMandatory] = useState([]);
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
  useEffect(() => {
    getDarkModeTheme();
  }, []);
  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);
  //uses of mandatoryTextInput
  // Function to get values from each mandatory TextInputComponent
 
  // Function to get values from each mandatory TextInputComponent
const getValuesMandatory = () => {
  textInputRefs.current.forEach(ref => {
    const value = ref.getValue().trim(); // Trim whitespace from the input
    if (!value || value === '') {
      ref.setButtonPressed(true);
    } else {
      ref.setButtonPressed(false);
    }
  });
  
  const textInputValues = textInputRefs.current.map(ref => ref.getValue().trim()); // Trim all values
  return textInputValues;
};


  //action required
 
  const callMakeAction = async () => {
    const mandatoryValues = getValuesMandatory(); // Get the trimmed values
    setValueMandatory(mandatoryValues); // Set state with the obtained values
    submitChangePasswordAction(mandatoryValues); // Pass the trimmed values for submission
  };
  

  const submitChangePasswordAction = data => {
    if (data[0] !== '' && data[1] !== '' && data[2] !== '') {
      if (data[1] === data[2]) {
        setLoading(true);
        changePassword(data[1], data[0]).then(value => {
          if (value.api_status == 200) {
            Alert.alert(
              `${i18n.t(`translation:warning`)}`,
              `${value?.message}`,
            );
            setLoading(false);
          } else {
            Alert.alert(
              `${i18n.t(`translation:warning`)}`,
              `${value?.errors?.error_text}`,
            );
            setLoading(false);
          }
        });
      } else {
        Alert.alert(
          `${i18n.t(`translation:warning`)}`,
          `${i18n.t(`translation:passwordNotMatch`)}`,
        );
      }
    } else {
    }
  };

  return (
    <SafeAreaView
      style={darkMode == 'enable' ? styles.Dcontainer : styles.container}>
      <ActionAppBar
        appBarText={i18n.t(`translation:changePassword`)}
        source={IconManager.back_light}
        backpress={() => {
          navigation.goBack();
        }}
        darkMode={darkMode}
      />
      <View style={styles.textInputHolder}>
        <SizedBox height={SPACING.sp12} />
        <MandatoryTextInput
          ref={ref => (textInputRefs.current[0] = ref)}
          placeholder={i18n.t(`translation:currentPassword`)}
          prefix={true}
          prefixIcon={IconManager.password_light}
          postfix={true}
          postfixIcon={
            secureText ? IconManager.secureCloseEye : IconManager.secureOpenEye
          }
          secureText={secureText}
          secureTextChange={secureTextChange}
        />
        <MandatoryTextInput
          ref={ref => (textInputRefs.current[1] = ref)}
          placeholder={i18n.t(`translation:newPassword`)}
          prefix={true}
          prefixIcon={IconManager.password_light}
          postfix={true}
          postfixIcon={
            secureText ? IconManager.secureCloseEye : IconManager.secureOpenEye
          }
          secureText={secureText}
          secureTextChange={secureTextChange}
        />
        <MandatoryTextInput
          ref={ref => (textInputRefs.current[2] = ref)}
          placeholder={i18n.t(`translation:confirmNewPassword`)}
          prefix={true}
          prefixIcon={IconManager.password_light}
          postfix={true}
          postfixIcon={
            secureText ? IconManager.secureCloseEye : IconManager.secureOpenEye
          }
          secureText={secureText}
          secureTextChange={secureTextChange}
        />

        <SizedBox height={SPACING.sp16} />

        <View style={{width: '100%', alignSelf: 'center'}}>
          <ActionButton text="Save" onPress={() => callMakeAction()} />
        </View>
      </View>
      {isLoading && <AppLoading />}
    </SafeAreaView>
  );
};

export default ChangePassword;

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
  forgot: {
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Primary,
    fontSize: fontSizes.size15,
  },
});
