import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
} from 'react-native';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import IconManager from '../../assets/IconManager';
import COLOR from '../../constants/COLOR';
import {FontFamily, fontSizes} from '../../constants/FONT';
import {useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  retrieveJsonData,
  retrieveStringData,
  storeJsonData,
  storeKeys,
} from '../../helper/AsyncStorage';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import ActionButton from '../../components/Button/ActionButton';
import i18n from '../../i18n';
import {submitTwoFactorConfirm} from '../../helper/ApiModel';

// myintmyathein.mmh1996@gmail.com

const TwoFactor = props => {
  const [isFocused, setIsFocused] = useState(false);
  // const [confirmationCode, setConfirmationCode] = useState("");
  const [darkMode, setDarkMode] = useState(null);
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpCode, setOtpCode] = useState('');
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

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

  // const handleInputChange = (text) => {
  //     setConfirmationCode(text)
  //     console.log(text);
  // }

  const handleChangeText = (text, index) => {
    // Update the OTP value in the state
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to the next input if the current input has a value
    if (text.length === 1 && index < 5) {
      inputRefs[index + 1].current.focus();
    }

    if (text.length === 0 && index > 0) {
      inputRefs[index - 1].current.focus();
    }

    // Optionally, handle the OTP code submission here if all inputs are filled
    if (newOtp.every(value => value !== '')) {
      const otpCode = newOtp.join('');
      setOtpCode(otpCode);
      // setIsButtonDisabled(false); // Enable the button
    } else {
      // setIsButtonDisabled(true); // Disable the button
    }
  };

  useEffect(() => {
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, []);

  // const handleConfrimAccount = async () => {
    
  //   submitTwoFactorConfirm(props.route.params?.email_or_phone, otpCode)
  //     .then(value => {
  //       console.log(value);
  //       if (value.api_status === 200) {
  //         storeJsonData({key: storeKeys.loginCredential, data: value});
  //         storeJsonData({key: storeKeys.userInfoData, data: value});

  //         const isOnboardingComplete = retrieveJsonData({
  //           key: storeKeys.isOnBoarding,
  //         });
  //         setTimeout(() => {
  //           navigation.navigate(
  //             isOnboardingComplete ? 'BottomTabNavigator' : 'Onboarding',
  //           );
  //         }, 1000);
  //       } else if (value.api_status === 400) {
  //         Alert.alert(
  //           'Error',
  //           value.errors.error_text || 'An unexpected error occurred',
  //         );
  //       } else {
  //         console.error('Error confirmation:', value);
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error confirm code :', error);
  //     });
  // };

  const handleConfrimAccount = async () => {
    try {
      const value = await submitTwoFactorConfirm(props.route.params?.email_or_phone, otpCode);
  
      console.log(value);
      
      if (value.api_status === 200) {
        // Await the storeJsonData calls to ensure data is stored before continuing
        await storeJsonData({ key: storeKeys.loginCredential, data: value });
        await storeJsonData({ key: storeKeys.userInfoData, data: value });
  
        const isOnboardingComplete = await retrieveJsonData({
          key: storeKeys.isOnBoarding,
        });
  
        setTimeout(() => {
          // Navigate after a delay of 1 second
          navigation.reset({
            index: 0,
            routes: [
              { name: isOnboardingComplete ? 'BottomTabNavigator' : 'Onboarding' },
            ],
          });
        }, 1000);
      } else if (value.api_status === 400) {
        // Handle error scenario when api_status is 400
        Alert.alert(
          'Error',
          value.errors.error_text || 'An unexpected error occurred'
        );
      } else {
        console.error('Error confirmation:', value);
      }
    } catch (error) {
      // Catch and log errors from submitTwoFactorConfirm
      console.error('Error confirm code :', error);
    }
  };
  

  return (
    <SafeAreaView style={darkMode == 'enable' ? styles.dmContainer :styles.container}>
      <ActionAppBar
        source={IconManager.back_light}
        backpress={() => navigation.goBack()}
        darkMode = {darkMode}
      />
      <View style={styles.contentContainer}>
        <View>
          <Text style={darkMode == 'enable' ? styles.dmTextHeader :styles.textHeader}>Two-factor authentication</Text>
          <Text style={darkMode == 'enable' ? styles.dmTextContent :styles.textContent}>
            To log in, you need to verify your identity. We have sent you the
            confirmation code to your phone and to your email address.
          </Text>
        </View>

        <View style={styles.otpContainer}>
          {/* <TextInput
                        style={[
                            styles.textInput,
                            {
                                borderColor: (isFocused ? COLOR.Primary : (darkMode == 'enable' ? COLOR.Grey1000 : COLOR.Grey200)),
                                backgroundColor: darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White,
                                color: darkMode == 'enable' ? COLOR.White : COLOR.Grey500,

                            }
                        ]}
                        placeholderTextColor={
                            darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
                        }
                        value={confirmationCode}
                        placeholder="Enter Confirmation code"
                        onChangeText={handleInputChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        keyboardType="number-pad"
                    /> */}
          {inputRefs.map((ref, index) => (
            <TextInput
              key={index}
              ref={ref}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              onChangeText={text => handleChangeText(text, index)}
              color = {darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}
            />
          ))}
        </View>

        <View>
          <ActionButton
            text={i18n.t(`translation:confirm`)}
            onPress={handleConfrimAccount}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
  },
  dmContainer: {
    flex: 1,
    backgroundColor: COLOR.DarkTheme,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  textHeader: {
    fontSize: 23,
    fontFamily: FontFamily.PoppinSemiBold,
    color: COLOR.Grey150,
  },
  dmTextHeader: {
    fontSize: 23,
    fontFamily: FontFamily.PoppinSemiBold,
    color: COLOR.White100,
  },
  textContent: {
    fontSize: 15,
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Grey300,
  },
  dmTextContent: {
    fontSize: 15,
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.White100,
  },
  textInput: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: 15,
    textAlignVertical: 'top',
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginTop: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: COLOR.Grey1000,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: fontSizes.size18,
    fontFamily: FontFamily.PoppinSemiBold,
    color: COLOR.Grey500,
  },
});

export default TwoFactor;
