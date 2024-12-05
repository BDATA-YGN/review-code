import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import ActionAppBar from '../../../commonComponent/ActionAppBar';
import {useNavigation} from '@react-navigation/native';
import IconManager from '../../../assets/IconManager';
import {fontSizes, FontFamily} from '../../../constants/FONT';
import COLOR from '../../../constants/COLOR';
import ActionButton from '../../../components/Button/ActionButton';
import {
  submitForgotPasswordSMS,
  submitForgotPasswordSmsCode,
} from '../../../helper/ApiModel';
import AppLoading from '../../../commonComponent/Loading';
import i18n from '../../../i18n';

const VerifyCodeSMS = props => {
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
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isLoading, setLoading] = useState(false);
  
  // Timer-related state
  const [timer, setTimer] = useState(60); // Initial timer value set to 60 seconds
  const [canResend, setCanResend] = useState(false); // State to enable/disable the resend button

  const handleChangeText = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // if (text.length === 1 && index < 5) {
    //   inputRefs[index + 1].current.focus();
    // }
    if (text.length === 1 && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  
    // If the text is cleared and the current index is greater than 0, move to the previous input
    if (text.length === 0 && index > 0) {
      inputRefs[index - 1].current.focus();
    }

    if (newOtp.every(value => value !== '')) {
      const otpCode = newOtp.join('');
      setOtpCode(otpCode);
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  };

  useEffect(() => {
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }

   
  }, []);

  useEffect(() => {
   
    // Timer countdown logic
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(prev => prev - 1);
      } else {
        setCanResend(true); // Enable resend button when timer hits 0
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [timer]);

  const handleForgotPasswordCode = async () => {
    setLoading(true);
    try {
      const data = await submitForgotPasswordSmsCode({
        phone_num: props.route.params.phone_num,
        code: otpCode,
      });

      if (data.api_status === 200) {
        setLoading(false);
        Alert.alert('Success', `${i18n.t(`translation:successCode`)}`, [
          {
            text: i18n.t(`translation:OK`),
            onPress: () => {
              navigation.navigate('ResetPassword', {
                phone_num: props.route.params.phone_num,
                code: otpCode,
                darkMode: props.route.params.darkMode,
              });
            },
          },
        ]);
      } else {
       setOtp(['', '', '', '', '', '']); // Reset the OTP array
      setOtpCode(''); // Clear the OTP code
      inputRefs[0].current.focus(); // Set focus back to the first input field
      setIsButtonDisabled(true); // Disable the button
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

  const handleResendSMS = async () => {
    const phone_num = props.route.params.phone_num;
     setOtp(['', '', '', '', '', '']); // Reset the OTP array
      setOtpCode(''); // Clear the OTP code
      inputRefs[0].current.focus(); // Set focus back to the first input field
      setIsButtonDisabled(true); 

    setLoading(true);
    try {
      const data = await submitForgotPasswordSMS({phone_num});

      if (data.api_status === 200) {
        setLoading(false);
        Alert.alert('Success', `SMS sent successfully`, [
          {text: 'OK', onPress: () => {}},
        ]);
        setTimer(60); // Reset the timer to 60 seconds after resending
        setCanResend(false); // Disable the resend button again
      } else {
        Alert.alert('Error', `${data.errors.error_text}`, [
          {text: 'OK', onPress: () => {}},
        ]);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error in forgot password request:', error);
      Alert.alert('Error', 'Failed to send reset SMS. Please try again.');
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          props.route.params.darkMode === 'enable'
            ? COLOR.DarkTheme
            : COLOR.White100,
      }}>
      <ActionAppBar
        source={IconManager.back_light}
        backpress={() => navigation.goBack()}
        darkMode={props.route.params.darkMode}
      />
      <View style={{padding: 16}}>
        <View>
          <Text
            style={[
              styles.headerText,
              {
                color:
                  props.route.params.darkMode === 'enable'
                    ? COLOR.White100
                    : COLOR.Grey500,
              },
            ]}>
            Verify your mobile
          </Text>
        </View>
        <View>
          <Text style={[styles.subText, { color : props.route.params.darkMode === 'enable'
                ? COLOR.White100
                : COLOR.Grey300}]}>
            Please enter the 6-digit code sent to:
            <Text
              style={[
                styles.phoneNumber,
                {
                  color:
                    props.route.params.darkMode === 'enable'
                      ? '#A9A9A9'
                      : COLOR.Grey500,
                },
              ]}>
              {' '}
              {props.route.params?.phone_num}
            </Text>
          </Text>
        </View>
        <View style={styles.otpContainer}>
          {inputRefs.map((ref, index) => (
            <TextInput
              key={index}
              ref={ref}
              style={[
                styles.otpInput,
                {
                  color:
                    props.route.params.darkMode === 'enable'
                      ? COLOR.White100
                      : COLOR.Grey500,
                },
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={otp[index]}
              onChangeText={text => handleChangeText(text, index)}
            />
          ))}
        </View>

        <View style={{marginTop: 32, gap: 8}}>
          <ActionButton text="Verify" onPress={handleForgotPasswordCode} />
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            {canResend ? (
              <TouchableOpacity onPress={handleResendSMS} style = {{ flexDirection : 'row'}}>
                <Text style = {[styles.resendText, { color : props.route.params.darkMode === 'enable'
                ? COLOR.White100
                : COLOR.Grey300}]}>Didn't get the code?</Text>
                <Text style={styles.resendLink}> Resend Code</Text>
              </TouchableOpacity>
            ) : (
              <Text style={[styles.timerText, { color : props.route.params.darkMode === 'enable'
                ? COLOR.White100
                : COLOR.Grey300}]}>{timer}</Text>
            )}
          </View>
        </View>
      </View>
      {isLoading && <AppLoading />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: fontSizes.size23,
    fontFamily: FontFamily.PoppinSemiBold,
    color: COLOR.Grey150,
  },
  subText: {
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
    // color: COLOR.Grey300,
    marginTop: 10,
  },
  phoneNumber: {
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Grey500,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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
  resendText: {
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
    // color: COLOR.Grey300,
  },
  timerText : {
    fontSize: fontSizes.size23,
    fontFamily: FontFamily.PoppinSemiBold,
    // color: COLOR.Grey150,
  },
  resendLink: {
    color: COLOR.Primary,
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
  },
});

export default VerifyCodeSMS;
