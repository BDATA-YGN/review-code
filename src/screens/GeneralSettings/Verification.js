import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import COLOR from '../../constants/COLOR';
import IconManager from '../../assets/IconManager';
import {FontFamily, fontSizes} from '../../constants/FONT';
import {useNavigation} from '@react-navigation/native';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import i18n from '../../i18n';
import AppLoading from '../../commonComponent/Loading';
import {
  getBlockedList,
  submitBlock,
  submitVerficationRequest,
} from '../../helper/ApiModel';
import RADIUS from '../../constants/RADIUS';
import SPACING from '../../constants/SPACING';
import ProfileAvatar from '../../components/Icon/ProfileAvatar';
import SizedBox from '../../commonComponent/SizedBox';
import {calculateTimeDifference} from '../../helper/Formatter';
import ListShimmer from '../GroupProfile/ListShimmer';
import LefendFieldMandatory from '../../components/TextInputBox/LefendFieldMandatory';
import IconPic from '../../components/Icon/IconPic';
import ImagePicker from 'react-native-image-crop-picker';
import ActionButton from '../../components/Button/ActionButton';
import {useDispatch, useSelector} from 'react-redux';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {retrieveStringData} from '../../helper/AsyncStorage';
import {storeKeys} from '../../helper/AsyncStorage';

const Verification = () => {
  const navigation = useNavigation();
  const textInputRefs = useRef([]);
  const [yourPhoto, setYourPhoto] = useState('');
  const [yourPassport, setYourPassport] = useState('');
  const [valuesMandatory, setValueMandatory] = useState([]);
  const [passportIsNull, setPassportValidate] = useState(false);
  const [photoIsNull, setPhotoValidate] = useState(false);
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
  useEffect(() => {
    getDarkModeTheme();
  }, []);
  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);
  const pickImage = type => {
    return new Promise((resolve, reject) => {
      ImagePicker.openPicker({
        width: 400,
        height: 300,
        cropping: true,
      })
        .then(image => {
          if (type === 'your_photo') {
            setYourPhoto(image.path);
            setPhotoValidate(false);
          }
          if (type === 'your_passport') {
            setYourPassport(image.path);
            setPassportValidate(false);
          }
        })
        .catch(error => {
          // Alert.alert('Error', 'Failed to pick an image');
          throw error;
        });
    });
  };

  //uses of optionalTextInput
  // Function to get values from each optional TextInputComponent
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

  const checkPhotosValidate = data => {
    if (yourPassport !== '' && yourPhoto !== '') {
      if (data[0] !== '' && data[1] !== '') {
        submit(data, yourPhoto, yourPassport);
      }
    } else {
      if (yourPassport === '') {
        setPassportValidate(true);
      } else {
        setPassportValidate(false);
      }
      if (yourPhoto === '') {
        setPhotoValidate(true);
      } else {
        setPhotoValidate(false);
      }
    }
    return true;
  };

  const callMakeAction = () => {
    try {
      const mandatoryValues = getValuesMandatory(); // Invoke the function to get values
      setValueMandatory(mandatoryValues); // Set state with the obtained values
      checkPhotosValidate(getValuesMandatory());
      // submitUpdateMyProfile(getValuesMandatory(), defaultSelector).then((value) => {
      //     setLoading(true)
      //     if (value.api_status == 200) {
      //         // setLoading(false)
      //         fetchUserInfo()
      //     }else{
      //         setLoading(false)
      //     }
      // })
    } catch (e) {
      throw e;
    }
  };

  const submit = (data, photo, passport) => {
    setLoading(true);
    submitVerficationRequest(data, photo, passport).then(data => {
      if (data.api_status == 200) {
        Alert.alert('Success', data.message);
        setLoading(false);
        navigation.goBack();
      } else {
        Alert.alert('Error', `${data.errors.error_text}`, [
          {
            text: i18n.t(`translation:OK`),
            onPress: () => {},
          },
        ]);
        setLoading(false);
      }
      setLoading(false);
    });
  };

  return (
    <SafeAreaView
      style={darkMode == 'enable' ? styles.DsafeAreaView : styles.safeAreaView}>
      <ActionAppBar
        appBarText={i18n.t(`translation:verification`)}
        source={IconManager.back_light}
        backpress={() => {
          navigation.goBack();
        }}
        darkMode={darkMode}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: COLOR.SocialBakcground}}>
        <View
          style={{
            marginHorizontal: SPACING.sp14,
            marginVertical: SPACING.sp16,
          }}>
          <Text style={[styles.headerStyle]}>
            {i18n.t(`translation:applyForVerification`)}
          </Text>
          <SizedBox height={SPACING.sp16} />
          <Text style={styles.bodyTextStyle}>
            {i18n.t(`translation:verificationMessage`)}
          </Text>
          <SizedBox height={SPACING.sp16} />
        </View>
        <View
          style={{
            backgroundColor:
              darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
            borderTopLeftRadius: RADIUS.rd16,
            borderTopRightRadius: RADIUS.rd16,
            flex: 1,
          }}>
          <View style={{marginHorizontal: SPACING.sp14}}>
            <SizedBox height={SPACING.sp32} />
            <LefendFieldMandatory
              ref={ref => (textInputRefs.current[0] = ref)}
              placeholder={i18n.t(`translation:password`)}
              legendName={i18n.t(`translation:yourName`)}
              isMultiline={false}
              secureText={false}
              secureTextChange={() => {}}
              darkMode={darkMode}
            />
            <SizedBox height={SPACING.sp16} />
            <LefendFieldMandatory
              ref={ref => (textInputRefs.current[1] = ref)}
              placeholder={i18n.t(`translation:password`)}
              legendName={i18n.t(`translation:yourMessage`)}
              isMultiline={true}
              secureText={false}
              secureTextChange={() => {}}
              legendBoxHeight={{
                flex: 1,
                fontSize: fontSizes.size16,
                fontFamily: FontFamily.PoppinRegular,
                paddingVertical: SPACING.sp10,
                textAlignVertical: 'top',
                height: 145,
              }}
            />
            <SizedBox height={SPACING.sp8} />
            <View>
              <View style={[{marginBottom: 8, marginHorizontal: 18}]}>
                <Text
                  style={[
                    darkMode == 'enable'
                      ? styles.DtextStyleBlack
                      : styles.textStyleBlack,
                  ]}>
                  {i18n.t(`translation:yourPhoto`)}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => pickImage('your_photo')}>
                <View
                  style={[
                    styles.dottedCardStyle,
                    photoIsNull && {borderColor: COLOR.Warning},
                  ]}>
                  {(yourPhoto && (
                    <Image
                      resizeMode="stretch"
                      source={{uri: yourPhoto}}
                      style={[styles.croppedImageStyle]}
                    />
                  )) || (
                    <TouchableOpacity onPress={() => pickImage('your_photo')}>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <IconPic
                          source={
                            darkMode == 'enable'
                              ? IconManager.gallery_dark
                              : IconManager.gallery_light
                          }
                          width={SPACING.sp40}
                          height={SPACING.sp40}
                        />
                        <Text
                          style={[
                            darkMode == 'enable'
                              ? styles.DtextStylePrimary
                              : styles.textStylePrimary,
                          ]}>
                          Upload Image
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            </View>
            <SizedBox height={SPACING.sp16} />
            <View>
              <View style={[{marginBottom: 8, marginHorizontal: 18}]}>
                <Text
                  style={[
                    darkMode == 'enable'
                      ? styles.DtextStyleBlack
                      : styles.textStyleBlack,
                  ]}>
                  {i18n.t(`translation:yourPassport`)}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => pickImage('your_passport')}>
                <View
                  style={[
                    styles.dottedCardStyle,
                    passportIsNull && {borderColor: COLOR.Warning},
                  ]}>
                  {(yourPassport && (
                    <Image
                      resizeMode="stretch"
                      source={{uri: yourPassport}}
                      style={[styles.croppedImageStyle]}
                    />
                  )) || (
                    <TouchableOpacity
                      onPress={() => pickImage('your_passport')}>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <IconPic
                          source={
                            darkMode == 'enable'
                              ? IconManager.gallery_dark
                              : IconManager.gallery_light
                          }
                          width={SPACING.sp40}
                          height={SPACING.sp40}
                        />
                        <Text
                          style={[
                            darkMode == 'enable'
                              ? styles.DtextStylePrimary
                              : styles.textStylePrimary,
                          ]}>
                          {i18n.t(`translation:uploadImage`)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            </View>
            <SizedBox height={SPACING.sp32} />
            <View style={{width: '100%', alignSelf: 'center'}}>
              <ActionButton text="Update" onPress={callMakeAction} />
            </View>
            <SizedBox height={SPACING.sp16} />
          </View>
        </View>
      </ScrollView>
      {isLoading && <AppLoading />}
    </SafeAreaView>
  );
};

export default Verification;

const styles = StyleSheet.create({
  dottedCardStyle: {
    borderWidth: 2,
    borderRadius: 12,
    borderColor: COLOR.Grey200,
    borderStyle: 'dashed',
    height: 230,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStylePrimary: {
    fontSize: 12,
    color: COLOR.Grey300,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  DtextStylePrimary: {
    fontSize: 12,
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  textStyleBlack: {
    fontSize: fontSizes.size15,
    color: COLOR.Grey500,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  DtextStyleBlack: {
    fontSize: fontSizes.size15,
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  croppedImageStyle: {width: '100%', height: '100%', borderRadius: RADIUS.rd12},
  profileContentHandle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  username: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size19,
    color: COLOR.Grey500,
  },
  viewProfile: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.Grey300,
  },
  unblock: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.Primary,
    paddingHorizontal: SPACING.sp12,
    paddingVertical: SPACING.sp4,
  },
  profile: {
    borderRadius: RADIUS.xs,
    margin: SPACING.sp12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  safeAreaView: {
    backgroundColor: COLOR.White100,
    flex: 1,
  },
  DsafeAreaView: {
    backgroundColor: COLOR.DarkTheme,
    flex: 1,
  },
  blockedListTextView: {
    marginLeft: '3%',
    marginRight: 'auto',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 4,
    paddingRight: 4,
    alignContent: 'center',
    flex: 1,
  },
  cardElementHolder: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 100,
    borderColor: 'red',
    borderWidth: 0,
  },
  card: {
    flexDirection: 'row',
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 4,
    paddingBottom: 16,
    // borderWidth: 2,
    // borderColor: 'red'
  },
  avatarSession: {
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLOR.Primary,
    borderRadius: 100,
  },
  imageSession: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  textSession: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerStyle: {
    fontFamily: FontFamily.PoppinBold,
    fontSize: fontSizes.size19,
    color: COLOR.Grey500,
  },
  bodyTextStyle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.Grey500,
    textAlign: 'justify',
  },
});
