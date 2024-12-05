import {
  Image,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import IconManager from '../../../assets/IconManager';
import ActionAppBar from '../../../commonComponent/ActionAppBar';
import {useNavigation} from '@react-navigation/native';
import {FontFamily, fontSizes} from '../../../constants/FONT';
import COLOR from '../../../constants/COLOR';
import ActionButton from '../../../components/Button/ActionButton';
import MandatoryTextInput from '../../../components/TextInputBox/MandatoryTextInput';
import {useRef, useState} from 'react';
import AppLoading from '../../../commonComponent/Loading';
import {submitForgotPasswordSMS} from '../../../helper/ApiModel';

const RecoverWithSMS = ({route}) => {
  const navigation = useNavigation();
  const textInputRefs = useRef([]);
  const [isLoading, setLoading] = useState(false);
  const {darkMode} = route.params;

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
    ForgotPasswordSMS(mandatoryValues);
  };

  const ForgotPasswordSMS = async mandatoryValues => {
    const phone_num = mandatoryValues[0]; // Extract the email from mandatoryValues

    setLoading(true);
    try {
      const data = await submitForgotPasswordSMS({phone_num});

      if (data.api_status === 200) {
        setLoading(false);
        Alert.alert('Success', `Sms send successfully.`, [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('VerifyCodeSMS', {
                phone_num: phone_num,
                darkMode: darkMode,
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
        darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White100,
    }}
  >
    <ActionAppBar
      source={IconManager.back_light}
      backpress={() => navigation.goBack()}
      darkMode={darkMode}
    />
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  // Use 'height' for Android
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 60} // Adjust this if necessary
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: '10%',
            paddingBottom: '5%',
          }}
        >
          <Image
            resizeMode="contain"
            source={IconManager.welcomeback}
            style={styles.imageHeader}
          />
        </View>
        <View style={{ marginBottom: 64 }}>
          <Text
            style={{
              fontSize: fontSizes.size29,
              fontFamily: FontFamily.PoppinBold,
              color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
              textAlign: 'center',
            }}
          >
            Password Recovery
          </Text>
        </View>
        <View
          style={[
            styles.curvedView,
            {
              backgroundColor:
                darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.Blue50,
            },
          ]}
        >
          <View style={{ paddingVertical: 32 }}>
            <Text
              style={{
                fontSize: fontSizes.size15,
                fontFamily: FontFamily.PoppinSemiBold,
                color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                textAlign: 'center',
              }}
            >
              Mobile Number (eg.+95......)
            </Text>
          </View>
          <View style={{ flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <View style={{ width: '90%' }}>
              <MandatoryTextInput
                ref={(ref) => (textInputRefs.current[0] = ref)}
                placeholder="Mobile Number"
                prefix={true}
                prefixIcon={IconManager.phone_light}
                keyboardType="number-pad"
              />
              <ActionButton text="Send OTP" onPress={callMakeAction} />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    {isLoading && <AppLoading />}
  </SafeAreaView>
  
    
  );
};

const styles = StyleSheet.create({
  imageHeader: {
    width: 200,
    height: 200,
  },
  curvedView: {
    flex: 1,
    backgroundColor: COLOR.Blue50,
  },
  optionButton: {
    flexDirection: 'row',
    backgroundColor: COLOR.Primary,
    justifyContent: 'space-between',
    width: '90%',
    padding: 16,
    borderRadius: 360,
    alignItems: 'center',
  },
  optionText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size19,
    color: COLOR.White,
  },
  // inputContainer: {
  //     flexDirection: 'row',
  //     alignItems: 'center',
  //     borderColor : COLOR.Grey300,
  //     borderWidth : 1,
  //     borderRadius: 10,
  //     padding: 10,
  // },
  // prefixIcon: {
  //     width: 16,
  //     height: 16,
  //     marginRight: 10,
  //     resizeMode : 'contain'
  // },
  // textInput: {
  //     flex: 1,
  //     fontSize: fontSizes.size15,
  //     fontFamily: FontFamily.PoppinRegular,
  //     color: COLOR.Grey500,
  // },
});

export default RecoverWithSMS;
