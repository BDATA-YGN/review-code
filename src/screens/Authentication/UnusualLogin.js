import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import React, {useRef} from 'react';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {useDispatch, useSelector} from 'react-redux';
import {useState, useEffect} from 'react';
import {StatusBar} from 'react-native';
import COLOR from '../../constants/COLOR';
import AppBar from '../../components/AppBar';
import {useNavigation} from '@react-navigation/native';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import IconManager from '../../assets/IconManager';
import {retrieveStringData, storeKeys} from '../../helper/AsyncStorage';
import PIXEL from '../../constants/PIXEL';
import SizedBox from '../../commonComponent/SizedBox';
import {FontFamily, fontSizes, fontWeight} from '../../constants/FONT';
import MandatoryTextInput from '../../components/TextInputBox/MandatoryTextInput';
import i18n from '../../i18n';
import SPACING from '../../constants/SPACING';
import ActionButton from '../../components/Button/ActionButton';
import {submitConfirmCodeUnusual} from '../../helper/ApiModel';
import {storeJsonData, retrieveJsonData} from '../../helper/AsyncStorage';
const UnusualLogin = props => {
  const [darkMode, setDarkMode] = useState(null);
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // const textInputRefs = useRef([])
  const [isFocused, setIsFocused] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');

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

  const handleInputChange = text => {
    setConfirmationCode(text);
  };

  const handleConfrimAccount = async () => {
    submitConfirmCodeUnusual(
      props.route.params?.unusual_username,
      confirmationCode,
    )
      .then(value => {
        if (value.api_status === 200) {
          storeJsonData({key: storeKeys.loginCredential, data: value});
          storeJsonData({key: storeKeys.userInfoData, data: value});

          const isOnboardingComplete = retrieveJsonData({
            key: storeKeys.isOnBoarding,
          });
          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [
                { name: isOnboardingComplete ? 'BottomTabNavigator' : 'Onboarding' },
              ],
            });
          }, 1000);
        } else if (value.api_status === 400) {
          Alert.alert(
            'Error',
            value.errors.error_text || 'An unexpected error occurred',
          );
        } else {
          console.error('Error confirmation:', value);
        }
      })
      .catch(error => {
        console.error('Error confirm code :', error);
      });
  };
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <SafeAreaView
        style={darkMode == 'enable' ? styles.Dcontainer : styles.container}>
        <StatusBar animated={true} backgroundColor={COLOR.Primary} />
        <ActionAppBar
          source={IconManager.back_light}
          backpress={() => navigation.goBack()}
          darkMode={darkMode}
        />
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsHorizontalScrollIndicator={false}>
          <SizedBox height={PIXEL.px30} />
          <View style={{marginBottom: PIXEL.px20}}>
            <Image
              source={IconManager.unusual_light}
              style={styles.imageHeader}
            />
          </View>
          <View style={{paddingHorizontal: PIXEL.px30}}>
            <Text style={darkMode == 'enable' ? styles.dmConfirm  : styles.confirm}>Confirm your account</Text>
            <Text style={darkMode == 'enable' ? styles.dmText2 :styles.text2}>
              Your sign in attempt seems a little different than usual, This
              could be because you are signing in from a different device or a
              different location.
            </Text>
            <SizedBox height={PIXEL.px15} />
            <Text style={darkMode == 'enable' ? styles.dmText2 :styles.text2}>
              We have sent you an email with the confirmation code. previous
              ones for security
            </Text>
          </View>
          <SizedBox height={PIXEL.px40} />
          <View style={styles.textInputHolder}>
            {/* <MandatoryTextInput
                ref={ref => (textInputRefs.current[1] = ref)}
                placeholder={i18n.t(`translation:confirmCode`)}
               
              /> */}

            <TextInput
              style={[
                styles.textInput,
                // { borderColor: isFocused ? COLOR.Primary : COLOR.Grey200 },
                {
                  borderColor: isFocused
                    ? COLOR.Primary
                    : darkMode == 'enable'
                    ? COLOR.Grey1000
                    : COLOR.Grey200,
                  backgroundColor:
                    darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White,
                  color: darkMode == 'enable' ? COLOR.White : COLOR.Grey500,
                },
              ]}
              placeholderTextColor={
                darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
              }
              value={confirmationCode}
              placeholder={i18n.t(`translation:confirmCode`)}
              onChangeText={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              keyboardType="number-pad"
            />
          </View>
          <SizedBox height={PIXEL.px10} />
          <View style={styles.textInputHolder}>
            <ActionButton
              text={i18n.t(`translation:confirm`)}
              onPress={handleConfrimAccount}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default UnusualLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White100,
    width: '100%',
  },
  textInput: {
    // backgroundColor: COLOR.White,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: PIXEL.px15,
    textAlignVertical: 'top',
  },
  Dcontainer: {
    flex: 1,
    backgroundColor: COLOR.DarkTheme,
    width: '100%',
  },
  scroll: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageHeader: {
    width: PIXEL.px200,
    height: PIXEL.px200,
  },
  confirm: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size23,
    fontWeight: fontWeight.weight600,
    color: COLOR.Grye150,
    textAlign: 'center',
  },
  dmConfirm: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size23,
    fontWeight: fontWeight.weight600,
    color: COLOR.White100,
    textAlign: 'center',
  },
  text2: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    fontWeight: fontWeight.weight500,
    color: COLOR.Grey500,
    textAlign: 'center',
  },
  dmText2: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    fontWeight: fontWeight.weight500,
    color: COLOR.White100,
    textAlign: 'center',
  },
  textInputHolder: {
    width: '100%',
    paddingHorizontal: SPACING.sp20,
  },
});
