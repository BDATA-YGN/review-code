import React, {useRef, useState} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import assets from '../../assets/IconManager';
import en from '../../i18n/en';
import AppBar from '../../components/AppBar';
import MandatoryTextInput from '../../components/TextInputBox/MandatoryTextInput';
import SPACING from '../../constants/SPACING';
import {useNavigation} from '@react-navigation/native';
import COLOR from '../../constants/COLOR';
import {StatusBar} from 'react-native';
import SizedBox from '../../commonComponent/SizedBox';
import PIXEL from '../../constants/PIXEL';
import {FontFamily} from '../../constants/FONT';
import {fontSizes} from '../../constants/FONT';
import {fontWeight} from '../../constants/FONT';
import IconManager from '../../assets/IconManager';
import CustomCheckBox from '../../components/Button/CustomCheckBox';
import ActionButton from '../../components/Button/ActionButton';
import IconPic from '../../components/Icon/IconPic';
import RADIUS from '../../constants/RADIUS';
import {getRegisterConfig, submitRegisteration} from '../../helper/ApiModel';
import AppLoading from '../../commonComponent/Loading';
import {Alert} from 'react-native';
import i18n from '../../i18n';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {retrieveStringData} from '../../helper/AsyncStorage';
import {storeKeys} from '../../helper/AsyncStorage';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import WebView from 'react-native-webview';
import {NativeWebViewWindows} from 'react-native-webview/lib/WebViewTypes';
import SelectDropdown from 'react-native-select-dropdown';
import {Picker} from '@react-native-picker/picker';
import ModalSelector from 'react-native-modal-selector';
const Registeration = () => {
  const navigation = useNavigation();
  // const textInputRefs = useRef([]);
  const textInputRefs = useRef([]);
  const [secureText, setSecureText] = useState(true);
  const [secureEye, setSecureEye] = useState(true);
  const [isRemenber, setRemenber] = useState(false);
  const [valuesMandatory, setValueMandatory] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [darkMode, setDarkMode] = useState(null);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [gender, setGender] = useState('');
  const [male, setMale] = useState('male');
  const [female, setFemale] = useState('female');
  const [config, setConfig] = useState(null);
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const [errorMessage , setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const handleGenderFemale = () => {
    setGender(female);
    setGenderModalVisible(false);
  };
  const handleGenderMale = () => {
    setGender(male);
    setGenderModalVisible(false);
  };

  useEffect(() => {
    getDarkModeTheme();
    getSettingConfig();
  }, []);
  const getSettingConfig = async () => {
    try {
      const data = await getRegisterConfig();
      if (data.api_status === 200) {
        setConfig(data);
      }
    } catch (error) {
      console.error(error);
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

  const secureTextChange = () => {
    setSecureText(!secureText);
  };
  const secureTextControl = () => {
    setSecureEye(!secureEye);
  };
  const checkboxOnOf = () => {
    setRemenber(!isRemenber);
    return isRemenber;
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
    const inputFieldsEmpty = !checkInputAreValid(mandatoryValues);
    const checkboxNotSelected = !isRemenber;
    const genderNotSelected = !gender;

    // Show error message if any mandatory field is empty or checkbox is not selected
    if (inputFieldsEmpty || checkboxNotSelected || genderNotSelected) {
      let errorMessage = '';
      if ((inputFieldsEmpty && checkboxNotSelected) || genderNotSelected) {
        errorMessage = i18n.t(`translation:register_error_message_all_filelds`);
      } else if (inputFieldsEmpty) {
        errorMessage = i18n.t(
          `translation:register_error_message_require_all_fields`,
        );
      } else {
        errorMessage = i18n.t(
          `translation:register_error_message_terms_of_service`,
        );
      }

      // Alert.alert(
      //   'Error',
      //   errorMessage,
      //   [
      //     {
      //       text: i18n.t(`translation:OK`),
      //       onPress: () => {},
      //     },
      //   ],
      //   {cancelable: true},
      // );
      setErrorMessage(errorMessage)
      return; // Return early if any condition fails
    }
    onPessRegister(mandatoryValues);
  };
  const checkInputAreValid = data => {
    return data.every(value => value && value.trim() !== '');
  };

  const onPessRegister = async mandatoryValues => {
    setLoading(true);
    try {
      // Check if password and confirm password match
      if (mandatoryValues[3] !== mandatoryValues[4]) {
        // Alert.alert(
        //   'Error',
        //   i18n.t(`translation:passwordMismatchError`),
        //   [
        //     {
        //       text: i18n.t(`translation:OK`),
        //       onPress: () => {},
        //     },
        //   ],
        //   {cancelable: true},
        // );
        setErrorMessage(i18n.t(`translation:passwordMismatchError`))
        setLoading(false);
        return; // Return early if passwords don't match
      }

      // Proceed with registration if passwords match
      console.log( mandatoryValues[6]);
      
      const data = await submitRegisteration({
        first_name: config?.auto_username == "1" ? mandatoryValues[0] : null,
        last_name: config?.auto_username == "1" ? mandatoryValues[1] : null,
        username : config?.auto_username != "1" ? mandatoryValues[6] : null,
        email: mandatoryValues[2],
        phone: config?.validation_method == 'sms' || config?.validation_method == 'both' ? mandatoryValues[5] : null,
        password: mandatoryValues[3],
        comfirmPassword: mandatoryValues[4],
        gender: gender,
      });
      console.log('dd',data);
      if (data.api_status === 220) {
       
        
        // Success operation
        // storeJsonData({ key: storeKeys.loginCredential, data: data });
        setLoading(false);
        // setIsSuccess(true);
        navigation.navigate('Activation', {register: true , phone : mandatoryValues[5] , email_address : mandatoryValues[2]});
      } else {
        // Alert.alert('Error', `${data.errors.error_text}`, [
        //   {
        //     text: i18n.t(`translation:OK`),
        //     onPress: () => {},
        //   },
        // ]);
        setErrorMessage(data.errors.error_text);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage(error)
      throw error;
    }
  };

  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <SafeAreaView
        style={
          darkMode == 'enable' ? styles.darkThemeContainer : styles.container
        }>

          
        {isSuccess ? (
          <View style={styles.registerSuccess}>
            <Image
              source={assets.registeration_successful_light}
              style={styles.imageHeader}
              resizeMode="contain"
            />
            <View style={styles.success}>
              <View style={{marginBottom: 10}}>
                <Text
                  style={
                    darkMode == 'enable'
                      ? styles.DtextSuccess
                      : styles.textSuccess
                  }>
                  {i18n.t(`translation:success`)}
                </Text>
              </View>
              <View style={{paddingHorizontal: 10}}>
                <Text
                  style={
                    darkMode == 'enable'
                      ? styles.Dcongratulation
                      : styles.congratulation
                  }>
                  {i18n.t(`translation:registeration_successful`)}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Login');
              }}
              activeOpacity={0.9}
              style={styles.goToButton}>
              <Text style={[styles.textStyle]}>
                {i18n.t(`translation:goToLogin`)}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <SafeAreaView
            style={
              darkMode == 'enable'
                ? styles.darkThemeContainer
                : styles.container
            }>
             {/* <StatusBar animated={true} backgroundColor={darkMode == 'enable' ? COLOR.Dar : COLOR.White} /> */}
            {/* <AppBar
            isbackArrow
            onPressBack={() => navigation.goBack()}
            darkMode={darkMode}
          /> */}
            <ScrollView showsHorizontalScrollIndicator={false} width={'100%'}>
              <View
                style={
                  darkMode == 'enable'
                    ? styles.darkThemeContainer
                    : styles.container
                }>
                <SizedBox height={PIXEL.px30} />
                <Image
                  resizeMode="contain"
                  source={
                    darkMode == 'enable'
                      ? assets.registeration_dark
                      : assets.registeration_light
                  }
                  style={styles.imageHeader}
                />
                <Text
                  style={
                    darkMode == 'enable' ? styles.DarkThemetitle : styles.title
                  }>
                  {i18n.t(`translation:register`)}
                </Text>
                {/* <SizedBox height={PIXEL.px4} />
                <Text
                  style={
                    darkMode == 'enable'
                      ? styles.DarkThemesubtitle
                      : styles.subtitle
                  }>
                  {i18n.t(`translation:register_please`)}
                </Text> */}
                <SizedBox height={PIXEL.px20} />
                {errorMessage && 
                <View style = {{backgroundColor : '#D9534F', width : '90%', padding : 14 , marginBottom : 10 , borderRadius : 8}}>
                    <Text style = {{color : COLOR.White100, fontFamily : FontFamily.PoppinRegular, fontSize  : 12}}>{errorMessage}</Text>
                </View>
                }
                {config?.auto_username === "1" ?
                <View style={{flexDirection: 'row', ...styles.textInputHolder}}>
                  <View style={{flex: 1, paddingRight: SPACING.sp15}}>
                    <MandatoryTextInput
                      ref={ref => (textInputRefs.current[0] = ref)}
                      placeholder={i18n.t(`translation:placeholderFirstName`)}
                      prefix={true}
                      prefixIcon={IconManager.user_light}
                    />
                  </View>
                  <View style={{flex: 1}}>
                    <MandatoryTextInput
                      ref={ref => (textInputRefs.current[1] = ref)}
                      placeholder={i18n.t(`translation:placeholderLastName`)}
                      // prefix={true}
                      // prefixIcon={IconManager.email_light}
                    />
                  </View>
                </View>

                  :
                <View style={styles.textInputHolder}>
                  <MandatoryTextInput
                    ref={ref => (textInputRefs.current[6] = ref)}
                    placeholder={i18n.t(`translation:username`)}
                    prefix={true}
                    prefixIcon={IconManager.user_light}
                  />
                </View>
                  }
                <View style={styles.textInputHolder}>
                  <MandatoryTextInput
                    ref={ref => (textInputRefs.current[2] = ref)}
                    placeholder={i18n.t(`translation:placeholderEmail`)}
                    prefix={true}
                    prefixIcon={IconManager.email_light}
                  />
                </View>
                {(config?.validation_method == 'sms' || config?.validation_method == 'both') && (
                  <View style={styles.textInputHolder}>
                    <MandatoryTextInput
                      ref={ref => (textInputRefs.current[5] = ref)}
                      placeholder={i18n.t(`translation:mobileNumber`)}
                      prefix={true}
                      prefixIcon={IconManager.phone_light}
                    />
                  </View>
                )}
                <View style={styles.textInputHolder}>
                  <MandatoryTextInput
                    ref={ref => (textInputRefs.current[3] = ref)}
                    placeholder={i18n.t(`translation:password`)}
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
                <View style={styles.textInputHolder}>
                  <MandatoryTextInput
                    ref={ref => (textInputRefs.current[4] = ref)}
                    placeholder={i18n.t(`translation:comfirm_password`)}
                    prefix={true}
                    prefixIcon={IconManager.password_light}
                    postfix={true}
                    postfixIcon={
                      secureEye
                        ? IconManager.secureCloseEye
                        : IconManager.secureOpenEye
                    }
                    secureText={secureEye}
                    secureTextChange={secureTextControl}
                  />
                </View>

                <View style={styles.gender}>
                  {/* <Text style={styles.label}>Gender</Text> */}
                  {/* <ModalSelector
                    data={data}
                    initValue="Select Gender"
                    onChange={(option) => handleGenderChange(option.key)}
                    style={styles.modalSelector}
                    cancelText="Cancel"
                    cancelStyle={styles.cancelButton}
                  >
                    <View style={styles.selectorContainer}>
                    <Image
                        source={IconManager.gender_light}
                        style={{ width: 18, height: 18, marginRight: 4, tintColor: COLOR.Grey200,}}
                        resizeMode='contain'
                        
                      />
                      <Text style={styles.selectedGender}>{selectedGender ? data.find(item => item.key === selectedGender)?.label : 'Select Gender'}</Text>
                      <View style={{  }}>
                      <Image
                        source={IconManager.downArrow_light}
                        style={{ width: 16, height: 16, tintColor: COLOR.Grey200,}}
                        resizeMode='contain'  
                      />
                      </View>
                    </View>
                  </ModalSelector> */}

                  <TouchableOpacity
                    style={
                      darkMode == 'enable'
                        ? styles.DtextInputBorderStyle
                        : styles.textInputBorderStyle
                    }
                    onPress={() => setGenderModalVisible(true)}>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingStart: 10,
                        marginRight: 5,
                      }}>
                      <Image
                        source={
                          darkMode == 'enable'
                            ? IconManager.gender_dark
                            : IconManager.gender_light
                        }
                        style={{width: 20, height: 16}}
                        tintColor={ darkMode == 'enable' ? COLOR.White700 : COLOR.Grey500}
                        resizeMode="contain"
                      />
                    </View>
                    <TextInput
                      editable={false}
                      value={gender}
                      onChangeText={setGender}
                      number={false}
                      placeholder="Gender"
                      secureTextEntry={false}
                      placeholderTextColor={
                        darkMode == 'enable' ? COLOR.White700 : COLOR.Grey300
                      }
                      style={{
                        fontSize: fontSizes.size16,
                        fontFamily: FontFamily.PoppinRegular,
                        width: '80%',
                        color:
                          darkMode == 'enable' ? COLOR.White : COLOR.Grey500,
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => setGenderModalVisible(true)}
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginEnd: 10,
                      }}>
                      <Image
                        source={
                          darkMode == 'enable'
                            ? IconManager.downArrow_dark
                            : IconManager.downArrow_light
                        }
                        style={{width: 17, height: 17}}
                        tintColor={ darkMode == 'enable' ? COLOR.White700 : COLOR.Grey500}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>

                  <Modal
                    animationType="fade"
                    transparent={true}
                    visible={genderModalVisible}
                    onRequestClose={() => setGenderModalVisible(false)}>
                    <View style={[styles.modalBox, {flex: 0.91}]}>
                      <View
                        style={[
                          darkMode == 'enable'
                            ? styles.DmodalInnerBox
                            : styles.modalInnerBox,
                          {width: '70%'},
                        ]}>
                        <View
                          style={{
                            width: '100%',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginTop: 'auto',
                            marginBottom: 'auto',
                            alignItems: 'flex-start',
                          }}>
                          <View style={styles.closeButtonContainer}>
                            <Text
                              style={{
                                fontSize: fontSizes.size19,
                                fontWeight: fontWeight.weight600,
                                color:
                                  darkMode == 'enable'
                                    ? COLOR.White100
                                    : COLOR.Grey500,
                                fontFamily: FontFamily.PoppinRegular,
                              }}>
                              Gender
                            </Text>
                            <TouchableOpacity
                              onPress={() => setGenderModalVisible(false)}>
                              <Image
                                source={
                                  darkMode == 'enable'
                                    ? IconManager.close_dark
                                    : IconManager.close_light
                                }
                                style={{width: 20, height: 20}}
                                resizeMode="contain"
                              />
                            </TouchableOpacity>
                          </View>
                          <View
                            style={{
                              width: '100%',
                              height: 1,
                              marginBottom: 8,
                              marginTop: 8,
                              backgroundColor: 'gray',
                            }}></View>
                          <TouchableOpacity
                            style={{width: '100%'}}
                            onPress={handleGenderFemale}>
                            <Text
                              style={[
                                styles.txt16,
                                darkMode == 'enable'
                                  ? styles.txtWhite
                                  : styles.txtBlack,
                                styles.paddingAll,
                              ]}>
                              Female
                            </Text>
                          </TouchableOpacity>
                          <Pressable
                            style={{width: '100%'}}
                            onPress={handleGenderMale}>
                            <Text
                              style={[
                                styles.txt16,
                                darkMode == 'enable'
                                  ? styles.txtWhite
                                  : styles.txtBlack,
                                styles.paddingAll,
                              ]}>
                              Male
                            </Text>
                          </Pressable>
                          <View style={{width: 10, height: 10}}></View>
                        </View>
                      </View>
                    </View>
                  </Modal>
                </View>

                <View style={styles.checkBoxHolder}>
                  <View style={styles.checkbox}>
                    <CustomCheckBox
                      value={isRemenber}
                      onValueChange={checkboxOnOf}
                      tintColorTrue={COLOR.Primary}
                      tintColorFalse={COLOR.Primary}
                    />
                    <SizedBox width={PIXEL.px10} />
                    <Text
                      style={
                        darkMode == 'enable'
                          ? styles.DrememberMe
                          : styles.rememberMe
                      }>
                      {i18n.t(`translation:agreement`) + ' '}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        // googleLogin()
                        navigation.navigate('TermsWebView');
                      }}>
                      <Text style={styles.termsOfService}>
                        {i18n.t('translation:termsOfService')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                

                <SizedBox height={PIXEL.px8} />
                <View style={styles.textInputHolder}>
                  {/* {isLoading && <ActivityIndicator style={{ marginTop: 10 }} color={COLOR.Primary} />} */}
                  <ActionButton
                    text={i18n.t(`translation:register`)}
                    onPress={() => callMakeAction()}
                  />
                </View>
                <SizedBox height={PIXEL.px10} />
                <View style={styles.footercontainer}>
                  {/* <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      // facebookLogin()
                      navigation.navigate('CommingSoon');
                    }}
                    style={styles.socialIconShape}>
                    <IconPic
                      source={IconManager.facebook_logo}
                      width={PIXEL.px35}
                      height={PIXEL.px35}
                    />
                  </TouchableOpacity>
                  <SizedBox width={24} height={0} />
                  <TouchableOpacity
                    onPress={() => {
                      // googleLogin()
                      navigation.navigate('CommingSoon');
                    }}
                    style={styles.socialIconShape}>
                    <IconPic
                      source={IconManager.google_logo}
                      width={PIXEL.px35}
                      height={PIXEL.px35}
                    />
                  </TouchableOpacity>
                </View> */}
                  <View style={styles.footer}>
                    <Text
                      style={
                        darkMode == 'enable'
                          ? styles.Dfootertext
                          : styles.footertext
                      }>
                      {i18n.t(`translation:noUserAccount`) + ' '}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('Login');
                      }}>
                      <Text style={styles.logoin}>
                        {i18n.t(`translation:login`)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <SizedBox height={PIXEL.px10} />
                </View>
              </View>
            </ScrollView>
            {isLoading && <AppLoading />}
          </SafeAreaView>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Registeration;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White100,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  darkThemeContainer: {
    flex: 1,
    backgroundColor: COLOR.DarkTheme,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  imageHeader: {
    width: PIXEL.px250,
    height: PIXEL.px250,
  },
  title: {
    fontFamily: FontFamily.PoppinBold,
    color: COLOR.Grey500,
    fontSize: fontSizes.size29,
    fontWeight: fontWeight.weight700,
  },
  DarkThemetitle: {
    fontFamily: FontFamily.PoppinBold,
    color: COLOR.White,
    fontSize: fontSizes.size29,
    fontWeight: fontWeight.weight700,
  },
  subtitle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.Grey400,
    fontWeight: fontWeight.weight400,
    textAlign: 'center',
  },
  DarkThemesubtitle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.White,
    fontWeight: fontWeight.weight400,
    textAlign: 'center',
  },
  textInputHolder: {
    width: '100%',
    paddingHorizontal: SPACING.sp15,
  },
  textInputHolderUsername: {
    width: '100%',
    paddingHorizontal: SPACING.sp10,
    flexDirection: 'row',
  },
  checkBoxHolder: {
    width: '100%',
    paddingHorizontal: SPACING.sp19,
    paddingVertical : SPACING.sp4,
    flexDirection: 'row',
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
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: SPACING.sp5,
  },
  DrememberMe: {
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: SPACING.sp5,
  },
  termsOfService: {
    color: COLOR.Primary,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: SPACING.sp5,
  },
  logoin: {
    color: COLOR.Primary,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.sp5,
  },
  footertext: {
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Grey400,
    fontSize: fontSizes.size15,
  },
  Dfootertext: {
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.White100,
    fontSize: fontSizes.size15,
  },

  socialIconShape: {
    backgroundColor: COLOR.SocialBakcground,
    width: PIXEL.px55,
    height: PIXEL.px55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.rd15,
  },
  footercontainer: {
    flex: 1,
    flexDirection: 'column',
  },
  imageHeader: {
    width: PIXEL.px170,
    height: PIXEL.px170,
  },
  textStyle: {
    color: COLOR.Grey50,
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  registerSuccess: {
    alignItems: 'center',
    top: '20%',
    flex: 1,
  },
  textSuccess: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size29,
    textAlign: 'center',
    fontWeight: fontWeight.weight700,
    color: COLOR.Grey500,
  },
  DtextSuccess: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size29,
    textAlign: 'center',
    fontWeight: fontWeight.weight700,
    color: COLOR.White100,
  },
  congratulation: {
    textAlign: 'center',
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.Grey500,
    fontWeight: fontWeight.weight400,
  },
  Dcongratulation: {
    textAlign: 'center',
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.White100,
    fontWeight: fontWeight.weight400,
  },
  success: {
    width: '95%',
    marginVertical: 10,
  },
  goToButton: {
    backgroundColor: COLOR.Primary,
    padding: SPACING.sp10,
    borderRadius: RADIUS.rd10,
  },
  webContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webView: {
    flex: 1,
    width: '100%',
  },
  webViewContainer: {
    flex: 1,
    width: '100%',
  },

  modalBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalInnerBox: {
    margin: 10,
    backgroundColor: COLOR.White100,
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
  },
  DmodalInnerBox: {
    margin: 10,
    backgroundColor: COLOR.DarkTheme,
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
  },
  txt16: {
    fontSize: 16,
    fontFamily: FontFamily.PoppinRegular,
  },
  textGray: {
    color: COLOR.Grey300,
  },
  fontWeight700: {
    fontWeight: fontWeight.weight700,
  },
  paddingAll: {
    padding: SPACING.sp10,
  },
  inputContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
    padding: 10,
  },
  textInputBorderStyle: {
    width: '95%',
    flexDirection: 'row',
    borderRadius: RADIUS.rd8,
    backgroundColor: COLOR.White100,
    borderColor: COLOR.Grey1000,
    borderWidth: 1,
    paddingVertical: Platform.OS == 'ios' ? SPACING.sp10 : 0,
  },
  DtextInputBorderStyle: {
    width: '95%',
    flexDirection: 'row',
    borderRadius: RADIUS.rd8,
    backgroundColor: COLOR.DarkTheme,
    borderColor: COLOR.White,
    borderWidth: 1,
    paddingVertical: Platform.OS == 'ios' ? SPACING.sp10 : 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: 'blue',
  },
  txtBlack: {
    color: COLOR.Grey500,
  },
  txtWhite: {
    color: COLOR.White100,
  },
  closeButtonContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
  },
  textInputStyle: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '65%',
  },
  marginTop: {
    marginTop: 24,
  },
  // container: {
  //   flex: 1,
  //   backgroundColor: '#F5FCFF',
  // },
});
