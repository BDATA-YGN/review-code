import {
  Alert,
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
import IconPic from '../../components/Icon/IconPic';
import IconManager from '../../assets/IconManager';
import PIXEL from '../../constants/PIXEL';
import SPACING from '../../constants/SPACING';
import RADIUS from '../../constants/RADIUS';
import AppBar from '../../components/AppBar';
import ProfileAvatar from '../../components/Icon/ProfileAvatar';
import SizedBox from '../../commonComponent/SizedBox';
import {FontFamily, fontSizes} from '../../constants/FONT';
import {
  clearData,
  retrieveJsonData,
  storeJsonData,
  storeKeys,
} from '../../helper/AsyncStorage';
import {useNavigation} from '@react-navigation/native';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import OptionalTextInput from '../../components/TextInputBox/OptionalTextInput';
import i18n from '../../i18n';
import SelectDropdown from 'react-native-select-dropdown';
import {categoriesList, relationship} from '../../constants/CONSTANT_ARRAY';
import ActionButton from '../../components/Button/ActionButton';
import {getUserInfoData, submitUpdateMyProfile} from '../../helper/ApiModel';
import AppLoading from '../../commonComponent/Loading';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {retrieveStringData} from '../../helper/AsyncStorage';
import {setFetchUserInfo} from '../../stores/slices/UserInfoSlice';

const EditProfile = () => {
  const navigation = useNavigation();
  const optionalTextInputRefs = useRef([]);
  const [valuesOptional, setValueOptional] = useState([]);
  const [defaultSelector, setDefaultSelector] = useState(0);
  const [defaultText, setDefaultText] = useState('Group Category');
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
    fetchLoginCredentialData();
  }, []);

  useEffect(() => {
    getDarkModeTheme();
  }, []);
  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);

  const isIdExist = idToCheck => {
    const foundItem = relationship.find(item => item.id === idToCheck);
    if (foundItem) {
      if (foundItem.id === '1') {
        setDefaultSelector(1);
      }
      if (foundItem.id === '2') {
        setDefaultSelector(2);
      }
      if (foundItem.id === '3') {
        setDefaultSelector(3);
      }
      if (foundItem.id === '4') {
        setDefaultSelector(4);
      }
    } else {
      setDefaultSelector(0);
    }
  };

  const fetchLoginCredentialData = async () => {
    const userInfoData = await retrieveJsonData({key: storeKeys.userInfoData});
    if (userInfoData !== null) {
      fetchDataAndSetValues(userInfoData);
      isIdExist(userInfoData?.relationship_id);
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

  const fetchDataAndSetValues = async userInfoData => {
    try {
      // Iterate through optionalTextInputRefs and set initial data
      optionalTextInputRefs.current.forEach((ref, index) => {
        if (index === 0) {
          ref.setValue(userInfoData.first_name);
        }
        if (index === 1) {
          ref.setValue(userInfoData.last_name);
        }
        if (index === 2) {
          ref.setValue(userInfoData.address);
        }
        if (index === 3) {
          ref.setValue(userInfoData?.about);
        }
        if (index === 4) {
          ref.setValue(userInfoData.website);
        }
        if (index === 5) {
          ref.setValue(userInfoData.working);
        }
        if (index === 6) {
          ref.setValue(userInfoData.school);
        }
      });
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  //uses of optionalTextInput
  // Function to get values from each optional TextInputComponent
  const getValuesOptional = () => {
    optionalTextInputRefs.current.forEach(ref => {
      const value = ref.getValue();
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
      submitUpdateMyProfile(getValuesOptional(), defaultSelector).then(
        value => {
          setLoading(true);
          if (value.api_status == 200) {
            // setLoading(false)
            dispatch(setFetchUserInfo(true));
            fetchUserInfo();
            handleToast(value.message);
          } else {
            handleToast(`${i18n.t(`translation:sometingWrong`)}`);
            setLoading(false);
          }
        },
      );
    } catch (e) {
      throw e;
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
      //   fetchUserInfo();
      Alert.alert('Error', 'Error call user info data.');
      setLoading(false);
    }
  };
  return (
    <SafeAreaView
      style={darkMode == 'enable' ? styles.DsafeAreaView : styles.safeAreaView}>
      <ActionAppBar
        appBarText={i18n.t(`translation:editProfile`)}
        source={
          darkMode == 'enable' ? IconManager.back_dark : IconManager.back_light
        }
        backpress={() => {
          navigation.goBack();
        }}
        darkMode={darkMode}
      />

      <ScrollView
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <SizedBox height={SPACING.sp12} />
        <View style={styles.textInputRow}>
          <View style={{width: '45%'}}>
            <OptionalTextInput
              ref={ref => (optionalTextInputRefs.current[0] = ref)}
              placeholder={i18n.t(`translation:firstName`)}
              prefix={true}
              prefixIcon={IconManager.user_light}
            />
          </View>
          <View style={{width: '4%'}} />
          <View style={{width: '45%'}}>
            <OptionalTextInput
              ref={ref => (optionalTextInputRefs.current[1] = ref)}
              placeholder={i18n.t(`translation:lastName`)}
              prefix={false}
              prefixIcon={IconManager.location_light}
            />
          </View>
        </View>
        <View style={{width: '94%'}}>
          <OptionalTextInput
            ref={ref => (optionalTextInputRefs.current[2] = ref)}
            placeholder={i18n.t(`translation:location`)}
            prefix={true}
            prefixIcon={IconManager.location_light}
          />
        </View>
        <View style={{width: '94%'}}>
          <OptionalTextInput
            ref={ref => (optionalTextInputRefs.current[3] = ref)}
            placeholder={i18n.t(`translation:about`)}
            prefix={true}
            prefixIcon={IconManager.my_info_light}
          />
        </View>
        <View style={{width: '94%'}}>
          <OptionalTextInput
            ref={ref => (optionalTextInputRefs.current[4] = ref)}
            placeholder={i18n.t(`translation:website`)}
            prefix={true}
            prefixIcon={IconManager.user_link_light}
          />
        </View>
        <View style={{width: '94%'}}>
          <OptionalTextInput
            ref={ref => (optionalTextInputRefs.current[5] = ref)}
            placeholder={i18n.t(`translation:jobName`)}
            prefix={true}
            prefixIcon={IconManager.jobs_light}
          />
        </View>
        <View style={{width: '94%'}}>
          <OptionalTextInput
            ref={ref => (optionalTextInputRefs.current[6] = ref)}
            placeholder={i18n.t(`translation:school`)}
            prefix={true}
            prefixIcon={IconManager.building_light}
          />
        </View>
        {/* <View style={{ width: '94%' }}>
                    <OptionalTextInput ref={ref => optionalTextInputRefs.current[7] = ref}
                        placeholder={i18n.t(`translation:relationship`)} prefix={true} prefixIcon={IconManager.relationship_light} />
                </View> */}
        <View
          style={{
            width: '100%',
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <SelectDropdown
            data={relationship}
            defaultValueByIndex={defaultSelector}
            showsVerticalScrollIndicator={false}
            selectedRowStyle={{
              borderRadius: 4,
              borderColor: COLOR.Primary,
              borderWidth: 1,
            }}
            // defaultValue={'Egypt'}
            onSelect={(selectedItem, index) => {
              setDefaultSelector(selectedItem.id);
            }}
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
                    source={IconManager.menu_light}
                    style={{
                      width: 16,
                      height: 16,
                      marginRight: 4,
                      tintColor: COLOR.Grey200,
                    }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      color: darkMode == 'enable' ? COLOR.White : COLOR.Grey500,
                      fontFamily: FontFamily.PoppinRegular,
                      fontSize: fontSizes.size16,
                      paddingLeft: 8,
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
                    color: darkMode == 'enable' ? COLOR.White : COLOR.Grey500,
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
                darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: COLOR.Grey200,
              height: SPACING.sp52,
            }}
            buttonTextStyle={styles.dropdown1BtnTxtStyle}
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
        <SizedBox height={SPACING.sp24} />
        <View style={{width: '94%', alignSelf: 'center'}}>
          <ActionButton text="Update" onPress={() => callMakeAction()} />
        </View>
      </ScrollView>
      {isLoading && <AppLoading />}
      <Toast ref={ref => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: COLOR.White100,
    flex: 1,
  },
  DsafeAreaView: {
    flex: 1,
    backgroundColor: COLOR.DarkThemLight,
  },
  textInputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  dropdown1BtnTxtStyle: {
    color: COLOR.Grey500,
    textAlign: 'left',
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
  },
  dropdown1DropdownStyle: {borderRadius: 4, padding: 8},
  Ddropdown1DropdownStyle: {
    borderRadius: 4,
    padding: 8,
    backgroundColor: COLOR.DarkThemLight,
  },
  dropdown1RowStyle: {
    backgroundColor: COLOR.White50,
    borderBottomColor: COLOR.White50,
    height: 40,
  },
  Ddropdown1RowStyle: {
    backgroundColor: COLOR.DarkThemLight,
    borderBottomColor: COLOR.White50,
    height: 40,
  },
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},
});
