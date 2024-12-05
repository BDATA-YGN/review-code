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

import AppLoading from '../../../commonComponent/Loading';
import MandatoryTextInput from '../../../components/TextInputBox/MandatoryTextInput';
import i18n from '../../../i18n';
import {submitForgotPasswordUpdate} from '../../../helper/ApiModel';

const ResetPassword = props => {
  const navigation = useNavigation();
  const textInputRefs = useRef([]);
  const [isLoading, setLoading] = useState(false);
  const [secureEye, setSecureEye] = useState(true);

  const secureTextControl = () => {
    setSecureEye(!secureEye);
  };

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
    handelResetPassword(mandatoryValues);
  };

  const handelResetPassword = async mandatoryValues => {
    const phone_num = props.route.params.phone_num || null;
    const email = props.route.params.email || null;
    const code = props.route.params.code;
    const new_password = mandatoryValues[0];
    setLoading(true);
    try {
      const data = await submitForgotPasswordUpdate({
        new_password,
        phone_num,
        email,
        code,
      });

      if (data.api_status === 200) {
        setLoading(false);

        Alert.alert('Success', `Reset passowrd successfully.`, [
          {
            text: 'OK',
            onPress: () => {
              // navigation.navigate('Login');
              navigation.reset({
                index: 0,
                routes: [
                  { name: 'Login' },
                ],
              });
            },
          },
        ]);
        // setTimeout(() => {
        //   navigation.navigate('VerifyCodeEmail', { email }); // Pass email to the next screen
        // }, 1000);
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
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          props.route.params.darkMode === 'enable'
            ? COLOR.DarkThemLight
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
            Reset your password
          </Text>
        </View>
      </View>

      <View style={{flexDirection: 'column', alignItems: 'center', gap: 16}}>
        <View style={{width: '90%'}}>
          <MandatoryTextInput
            ref={ref => (textInputRefs.current[0] = ref)}
            placeholder={i18n.t(`translation:enterNewPassword`)}
            prefix={true}
            prefixIcon={IconManager.password_light}
            postfix={true}
            postfixIcon={
              secureEye ? IconManager.secureCloseEye : IconManager.secureOpenEye
            }
            secureText={secureEye}
            secureTextChange={secureTextControl}
          />
          <ActionButton text="Reset" onPress={callMakeAction} />
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
    color: COLOR.Grey300,
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
    borderColor: COLOR.Grey200,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: fontSizes.size18,
    fontFamily: FontFamily.PoppinSemiBold,
    color: COLOR.Grey800,
  },
  resendText: {
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Grey300,
  },
  resendLink: {
    color: COLOR.Primary,
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
  },
});

export default ResetPassword;
