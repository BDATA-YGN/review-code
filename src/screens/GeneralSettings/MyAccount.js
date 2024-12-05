import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Image,
  TouchableHighlight,
  Pressable,
  Platform,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import OptionalTextInput from '../../components/TextInputBox/OptionalTextInput';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import i18n from '../../i18n';
import IconManager from '../../assets/IconManager';
import SizedBox from '../../commonComponent/SizedBox';
import SPACING from '../../constants/SPACING';
import ActionButton from '../../components/Button/ActionButton';
import {retrieveJsonData} from '../../helper/AsyncStorage';
import {getUserInfoData, submitUpdateMyAccount} from '../../helper/ApiModel';
import Toast from 'react-native-toast-message';
import {storeKeys} from '../../helper/AsyncStorage';
import {country, relationship} from '../../constants/CONSTANT_ARRAY';
import {Alert} from 'react-native';
import {storeJsonData} from '../../helper/AsyncStorage';
import AppLoading from '../../commonComponent/Loading';
import {clearData} from '../../helper/AsyncStorage';
import {TouchableOpacity} from 'react-native-gesture-handler';
import moment from 'moment';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import {Modal} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import COLOR from '../../constants/COLOR';
import {FontFamily, fontWeight} from '../../constants/FONT';
import {fontSizes} from '../../constants/FONT';
import RADIUS from '../../constants/RADIUS';
import ModalSelector from 'react-native-modal-selector';
import PIXEL from '../../constants/PIXEL';
import ModalComponent from '../../commonComponent/ModalComponent';
import {RadioGroup} from 'react-native-radio-buttons-group';
import {retrieveStringData} from '../../helper/AsyncStorage';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {useDispatch, useSelector} from 'react-redux';
import {logJsonData} from '../../helper/LiveStream/logFile';

const MyAccount = () => {
  const navigation = useNavigation();
  const optionalTextInputRefs = useRef([]);
  const [isLoading, setLoading] = useState(false);
  const [valuesOptional, setValueOptional] = useState([]);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [birthday, setBirthday] = useState('');
  const [date, setDate] = useState(dayjs());
  const [defaultSelector, setDefaultSelector] = useState(0);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [gender, setGender] = useState('');
  const [male, setMale] = useState('male');
  const [female, setFemale] = useState('female');
  const [defaultText, setDefaultText] = useState('Select Country');
  const [countryData, setCountryData] = useState(country);
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

  const onSelectCountry = selectedItem => {
    setDefaultSelector(selectedItem.id);
    setDefaultText(selectedItem.name);
  };

  const handleButtonPressOK = () => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD'); // Format selected date using dayjs
    setBirthday(formattedDate); // Update birthday state with formatted date
    setDateModalVisible(false);
  };
  const handleButtonPressCancel = () => {
    setDateModalVisible(false);
  };
  const handleGenderFemale = () => {
    setGender(female);
    setGenderModalVisible(false);
  };
  const handleGenderMale = () => {
    setGender(male);
    setGenderModalVisible(false);
  };
  const fetchLoginCredentialData = async () => {
    const userInfoData = await retrieveJsonData({key: storeKeys.userInfoData});
    if (userInfoData !== null) {
      fetchDataAndSetValues(userInfoData);
      const selectedCountry = country.find(
        item => item.id === userInfoData.country_id,
      );
      if (selectedCountry) {
        setDefaultSelector(selectedCountry.id);
        setDefaultText(selectedCountry.name);
      }
      setValueOptional(userInfoData);
      setBirthday(userInfoData.birthday);
      setGender(userInfoData.gender);
      setDefaultSelector(userInfoData.county_id);
    } else {
      Alert.alert(
        'Invalid',
        `No credential!`,
        [
          {
            text: 'Ok',
            onPress: () => {},
          },
        ],
        {cancelable: true},
      );
    }
  };
  useEffect(() => {
    fetchLoginCredentialData();
    setBirthday(birthday);
  }, []);

  const fetchDataAndSetValues = async userInfoData => {
    try {
      // logJsonData('User info data ===>', userInfoData);
      // Iterate through optionalTextInputRefs and set initial data
      optionalTextInputRefs.current.forEach((ref, index) => {
        switch (index) {
          case 0:
            ref.setValue(userInfoData.username);
            break;
          case 1:
            ref.setValue(userInfoData.email);
            break;
          case 2:
            ref.setValue(userInfoData.phone_number);
            break;
        }
      });
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };
  const getValuesOptional = () => {
    optionalTextInputRefs.current.forEach(ref => {
      const value = ref.getValue();
      if (!value || value.trim() === '') {
        ref.setButtonPressed(true);
      } else {
        ref.setButtonPressed(false);
      }
    });
    const textInputValues = optionalTextInputRefs.current.map(ref =>
      ref.getValue(),
    );
    return textInputValues;
  };

  const handleToast = message => {
    showToast(message);
  };

  const showToast = msg => {
    Toast.show({
      type: 'success',
      text1: msg,
      visibilityTime: 4000,
      position: 'bottom',
    });
  };

  const callMakeAction = () => {
    try {
      const optionalValues = getValuesOptional(); // Invoke the function to get values
      setValueOptional(optionalValues); // Set state with the obtained values
      submitUpdateMyAccount(
        getValuesOptional(),
        defaultSelector,
        birthday,
        gender,
      ).then(value => {
        setLoading(true);
        if (value.api_status == 200) {
          setLoading(false);
          fetchUserInfo();
          handleToast(value.message);
        } else {
          handleToast('Something Wrong');
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Error occurred during API call:', error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const userDataResponse = await getUserInfoData();
      clearData({key: storeKeys.userInfoData});
      storeJsonData({
        key: storeKeys.userInfoData,
        data: userDataResponse.user_data,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user info data:', error);
      setLoading(false);
      Alert.alert('Error', 'Error call user info data.');
      cons;
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={darkMode == 'enable' ? styles.DsafeAreaView : styles.safeAreaView}>
      <ActionAppBar
        appBarText={i18n.t(`translation:myAccount`)}
        source={
          darkMode == 'enable' ? IconManager.back_dark : IconManager.back_light
        }
        backpress={() => {
          navigation.goBack();
        }}
        darkMode={darkMode}
      />

      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <SizedBox height={SPACING.sp12} />
        <View style={{width: '94%'}}>
          <OptionalTextInput
            ref={ref => (optionalTextInputRefs.current[0] = ref)}
            placeholder={i18n.t(`translation:username`)}
            prefix={true}
            prefixIcon={IconManager.user_light}
          />
        </View>
        <View style={{width: '94%'}}>
          <OptionalTextInput
            ref={ref => (optionalTextInputRefs.current[1] = ref)}
            placeholder={i18n.t(`translation:email`)}
            prefix={true}
            prefixIcon={IconManager.email_light}
          />
        </View>
        <View style={{width: '94%'}}>
          <OptionalTextInput
            ref={ref => (optionalTextInputRefs.current[2] = ref)}
            placeholder={'Phone Number'}
            prefix={true}
            prefixIcon={IconManager.phone_light}
            inputMode={true}
          />
        </View>

        <View>
          <SelectDropdown
            data={countryData}
            defaultValueByIndex={defaultSelector}
            showsVerticalScrollIndicator={false}
            selectedRowStyle={{
              borderRadius: 4,
              borderColor: COLOR.Primary,
              borderWidth: 1,
            }}
            // defaultValue={'Egypt'}
            onSelect={(selectedItem, index) => onSelectCountry(selectedItem)}
            defaultButtonText={defaultText}
            buttonTextAfterSelection={(selectedItem, index) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={
                      darkMode == 'enable'
                        ? IconManager.country_dark
                        : IconManager.country_light
                    }
                    style={{
                      width: 15,
                      height: 15,
                      tintColor: COLOR.Grey200,
                    }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      color:
                        darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500,
                      fontFamily: FontFamily.PoppinRegular,
                      fontSize: fontSizes.size16,
                      paddingLeft: 5,
                    }}>
                    {selectedItem.name}
                  </Text>
                </View>
              );
            }}
            rowTextForSelection={(item, index) => {
              return (
                <Text
                  style={{
                    color:
                      darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500,
                    fontFamily: FontFamily.PoppinRegular,
                    fontSize: fontSizes.size14,
                  }}>
                  {item.name}
                </Text>
              );
            }}
            buttonStyle={{
              width: '94%',
              backgroundColor:
                darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: COLOR.Grey200,
              height: SPACING.sp52,
            }}
            buttonTextStyle={
              darkMode == 'enable'
                ? styles.Ddropdown1BtnTxtStyle
                : styles.dropdown1BtnTxtStyle
            }
            renderDropdownIcon={isOpened => {
              return (
                <Image
                  resizeMode="contain"
                  style={{width: 15, height: 15, marginRight: 8}}
                  source={IconManager.downArrow_light}
                />
              );
            }}
            dropdownIconPosition={'right'}
            dropdownStyle={
              darkMode == 'enable'
                ? styles.Ddropdown1DropdownStyle
                : styles.dropdown1DropdownStyle
            }
            rowStyle={
              darkMode == 'enable'
                ? styles.Ddropdown1RowStyle
                : styles.dropdown1RowStyle
            }
            rowTextStyle={styles.dropdown1RowTxtStyle}
          />
        </View>
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <View style={{width: '46%', marginEnd: 10}}>
            <TouchableOpacity onPress={() => setDateModalVisible(true)}>
              <View
                style={
                  darkMode == 'enable'
                    ? styles.DtextInputBorderStyle
                    : styles.textInputBorderStyle
                }>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingStart: 10,
                    marginRight: 5,
                    paddingVertical: SPACING.sp12,
                  }}>
                  <Image
                    source={
                      darkMode == 'enable'
                        ? IconManager.birthday_dark
                        : IconManager.birthday_light
                    }
                    style={{width: 17, height: 17}}
                    tintColor={COLOR.Grey200}
                    resizeMode="contain"
                  />
                </View>

                <TextInput
                  editable={false}
                  value={birthday}
                  onChangeText={() => setBirthday(true)}
                  number={false}
                  placeholder={i18n.t(`translation:birthday`)}
                  secureTextEntry={false}
                  style={[
                    {
                      fontSize: fontSizes.size15,
                      color:
                        darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                    },
                  ]}
                  placeholderTextColor={
                    darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
                  }
                />
              </View>
            </TouchableOpacity>
            <Modal
              animationType="fade"
              transparent={true}
              visible={dateModalVisible}
              onRequestClose={() => setDateModalVisible(false)}>
              <View style={styles.modalBox}>
                <View style={[styles.modalInnerBox, {width: '90%'}]}>
                  <DateTimePicker
                    value={date}
                    onValueChange={value => setDate(value)}
                    mode="date"
                  />
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}>
                    <Pressable onPress={handleButtonPressCancel}>
                      <Text
                        style={[
                          styles.txt16,
                          styles.textGray,
                          styles.fontWeight700,
                          styles.paddingAll,
                        ]}>
                        Close
                      </Text>
                    </Pressable>
                    <Pressable onPress={handleButtonPressOK}>
                      <Text
                        style={[
                          styles.txt16,
                          styles.textGray,
                          styles.fontWeight700,
                          styles.paddingAll,
                        ]}>
                        Ok
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
          <View style={{width: '46%'}}>
            <TouchableOpacity onPress={() => setGenderModalVisible(true)}>
              <View
                style={
                  darkMode == 'enable'
                    ? styles.DtextInputBorderStyle
                    : styles.textInputBorderStyle
                }>
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
                    style={{width: 17, height: 17}}
                    tintColor={COLOR.Grey200}
                    resizeMode="contain"
                  />
                </View>
                <TextInput
                  editable={false}
                  value={gender}
                  onChangeText={setGender}
                  number={false}
                  placeholder={i18n.t(`translation:gender`)}
                  secureTextEntry={false}
                  style={[
                    {
                      fontSize: fontSizes.size16,
                      paddingVertical: SPACING.sp10,
                      color:
                        darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                    },
                  ]}
                  placeholderTextColor={
                    darkMode == 'enable' ? COLOR.Grey100 : COLOR.Grey300
                  }
                />
              </View>
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
                              : COLOR.Grey300,
                          fontFamily: FontFamily.PoppinRegular,
                        }}>
                        Gender
                      </Text>
                      <Pressable onPress={() => setGenderModalVisible(false)}>
                        <Image
                          source={
                            darkMode == 'enable'
                              ? IconManager.close_dark
                              : IconManager.close_light
                          }
                          style={{width: 20, height: 20}}
                          resizeMode="contain"
                        />
                      </Pressable>
                    </View>
                    <View
                      style={{
                        width: '100%',
                        height: 1,
                        marginBottom: 8,
                        marginTop: 8,
                        backgroundColor: COLOR.Grey300,
                      }}></View>
                    <Pressable
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
                    </Pressable>
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
        </View>

        <SizedBox height={SPACING.sp24} />
        <View style={{width: '94%', alignSelf: 'center'}}>
          <ActionButton text="Update" onPress={() => callMakeAction()} />
        </View>
      </View>
      {isLoading && <AppLoading />}
      <Toast ref={ref => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

export default MyAccount;

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: COLOR.White100,
    flex: 1,
  },
  DsafeAreaView: {
    flex: 1,
    backgroundColor: COLOR.DarkTheme,
  },
  textInputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  dropdown1BtnTxtStyle: {
    color: COLOR.Grey500,
    textAlign: 'left',
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
  },
  Ddropdown1BtnTxtStyle: {
    color: COLOR.White100,
    textAlign: 'left',
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
  },
  dropdown1DropdownStyle: {borderRadius: 4, padding: 8},
  Ddropdown1DropdownStyle: {
    borderRadius: 4,
    padding: 8,
    backgroundColor: COLOR.DarkTheme,
  },
  dropdown1RowStyle: {
    backgroundColor: COLOR.White50,
    borderBottomColor: COLOR.White50,
    height: 40,
  },
  Ddropdown1RowStyle: {
    backgroundColor: COLOR.DarkTheme,
    borderBottomColor: COLOR.White50,
    height: 40,
  },
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},
  dateAndGender: {
    flexDirection: 'row',
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

    // width:'100%'
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
    // width:'100%'
  },
  txt16: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  textGray: {
    color: COLOR.Grey300,
  },
  textWhite: {
    color: COLOR.White100,
  },
  fontWeight700: {
    fontWeight: 700,
  },
  paddingAll: {
    padding: 10,
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
    width: '100%',
    flexDirection: 'row',
    borderRadius: RADIUS.rd10,
    backgroundColor: COLOR.White100,
    borderColor: COLOR.Grey200,
    padding: 1,
    borderWidth: 1,
  },
  DtextInputBorderStyle: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: RADIUS.rd10,
    backgroundColor: COLOR.DarkTheme,
    borderColor: COLOR.Grey200,
    padding: 1,
    borderWidth: 1,
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
    color: COLOR.Grey300,
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
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});
