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
import {useEffect, useRef, useState} from 'react';
import AppLoading from '../../../commonComponent/Loading';
import {requestResendEmailActivation} from '../../../helper/ApiModel';
import { useDispatch, useSelector } from 'react-redux';
import { retrieveStringData, storeKeys } from '../../../helper/AsyncStorage';
import { setFetchDarkMode } from '../../../stores/slices/DarkModeSlice';

const ActivationWithEmail = () => {
  const navigation = useNavigation();
  const textInputRefs = useRef([]);
  const [isLoading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const [darkMode, setDarkMode] = useState(null);
  const fetchDarkMode = useSelector((state) => state.DarkModeSlice.fetchDarkMode);

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
      getDarkModeTheme();
  }, []);
  useEffect(() => {
      if (fetchDarkMode) {
          getDarkModeTheme();
          dispatch(setFetchDarkMode(false));
      }
  }, [fetchDarkMode]);

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
    handleSendOTP(mandatoryValues);
  };

  const handleSendOTP = async mandatoryValues => {
    const email = mandatoryValues[0]; // Extract the email from mandatoryValues

    setLoading(true);
    try {
      const data = await requestResendEmailActivation(email);
      if (data.api_status === 200) {
        setLoading(false);
        navigation.navigate('Activation',{ email : email});
      } else {
        setLoading(false);
        Alert.alert('Error', `${data.errors.error_text}`, [
          {
            text: 'OK',
            onPress: () => {},
          },
        ]);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 , backgroundColor:
      darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,}}>
      <ActionAppBar
        source={IconManager.back_light}
        darkMode = {darkMode}
        backpress={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
            }}>
            <Image
              resizeMode="contain"
              source={IconManager.welcomeback}
              style={styles.imageHeader}
            />
          </View>
          <View style={{marginBottom: 64}}>
            <Text
              style={{
                fontSize: fontSizes.size29,
                fontFamily: FontFamily.PoppinBold,
                color: darkMode == 'enable' ? COLOR.White : COLOR.Grey500,
                textAlign: 'center',
              }}>
              Email
            </Text>
          </View>
          <View style = {[styles.curvedView,{
                backgroundColor:
                  darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.Blue50,
              },]}>
            <View style={{paddingVertical: 32}}>
              <Text
                style={{
                  fontSize: fontSizes.size15,
                  fontFamily: FontFamily.PoppinSemiBold,
                  color: COLOR.Grey500,
                  textAlign: 'center',
                }}>
                Please write your email address
              </Text>
            </View>

            <View style={{flexDirection: 'column', alignItems: 'center', gap: 16}}>
              <View style={{width: '90%'}}>
                <MandatoryTextInput
                  ref={ref => (textInputRefs.current[0] = ref)}
                  placeholder="Enter your email address"
                  prefix={true}
                  prefixIcon={IconManager.email_light}
                />
                <ActionButton text="Send Confirmation" onPress={callMakeAction} />
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
    paddingBottom: 20,  // Add padding to prevent the content from being covered
  },
});

export default ActivationWithEmail;
