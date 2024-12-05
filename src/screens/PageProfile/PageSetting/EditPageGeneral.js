import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Image,
  RefreshControl,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import ActionAppBar from '../../../commonComponent/ActionAppBar';
import DualAvater from '../../../components/DualAvater';
import COLOR from '../../../constants/COLOR';
import { FontFamily, fontSizes } from '../../../constants/FONT';
import IconManager from '../../../assets/IconManager';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import SizedBox from '../../../commonComponent/SizedBox';
import { categoriesList, pageActionList } from '../../../constants/CONSTANT_ARRAY';
import IconPic from '../../../components/Icon/IconPic';
import RadioGroup from 'react-native-radio-buttons-group';
import PIXEL from '../../../constants/PIXEL';
import { getPageInfoById, submitVerificationRequest, updatePage } from '../../../helper/ApiModel';
import AppLoading from '../../../commonComponent/Loading';
import { setFetchDarkMode } from '../../../stores/slices/DarkModeSlice';
import { storeKeys, retrieveStringData } from '../../../helper/AsyncStorage';
import { useDispatch, useSelector } from 'react-redux';
import { setPageInfoData } from '../../../stores/slices/PageSlice';
import { setFetchPageList } from '../../../stores/slices/PostSlice';
import i18n from '../../../i18n';
import RADIUS from '../../../constants/RADIUS';
import SPACING from '../../../constants/SPACING';
import { setReadable } from 'react-native-fs';
import { request } from 'react-native-permissions';

const EditPageGeneral = ({ route }) => {
  const { data } = route.params;
  const navigationAppBar = useNavigation();
  const [focusOne, setFoucsOne] = useState(false);
  const [focusTwo, setFoucsTwo] = useState(false);
  const [focusThree, setFocusThree] = useState(false);
  const [gunameFocus, setGunameFocus] = useState(false);
  const [categoryName, setCategory] = useState('Page Category');
  const [description, setDescription] = useState('');
  const [pageName, setPageName] = useState('');
  const [pageUsername, setPageUsername] = useState('');
  const [actionLink, setActionLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);
  const [pageColor, setPageColor] = useState(false);
  const [pageUsernameColor, setPageUsernameColor] = useState(false);
  const [pageActionColor, setPageActionColor] = useState(false);
  const [descriptionColor, setDescriptionColor] = useState(false);
  const [checked, setChecked] = useState('Disable');
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [selectedId, setSelectedId] = useState('');
  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const [pageActionIndex, setPageActionIndex] = useState('');
  const [pageAction, setPageAction] = useState('Page Call Action');
  const [pageId, setpageId] = useState('');
  const [pageData, setPageData] = useState(data);
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const dispatch = useDispatch();
  const [pageInfo, setPageInfo] = useState([]);
  const fetchPageInfoList = useSelector(
    state => state.PageSlice.fetchPageInfoList,
  );

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

  const handleGunameFocusOne = () => {
    setPageUsernameColor(false);
    setGunameFocus(true);
  };

  const handleGunameBlurOne = () => {
    setGunameFocus(false);
  };

  const handleFocusOne = () => {
    setPageColor(false);
    setFoucsOne(true);
  };

  const handleBlurOne = () => {
    setFoucsOne(false);
  };

  const handleFocusTwo = () => {
    setDescriptionColor(false);
    setFoucsTwo(true);
  };

  const handleBlurTwo = () => {
    setFoucsTwo(false);
  };

  const handleFocusThree = () => {
    setPageColor(false);
    setFocusThree(true);
  }

  const handleBlurThree = () => {
    setFocusThree(false);
  }

  const handleButtonPress = () => {
    if (pageName == '' || pageUsername == '') {
      if (pageName == '') {
        setPageColor(true);
      }
      if (description == '') {
        setDescriptionColor(true);
      }
      if (pageUsername == '') {
        setPageUsernameColor(true);
      }
    } else {
      onPressCreate(
        data.page_id,
        pageName,
        pageUsername,
        categoryName,
        selectedId,
        pageAction,
        actionLink
      );
    }
  };

  const onPressCreate = (
    page_id,
    page_title,
    page_name,
    category,
    users_post,
    pageAction,
    actionLink
  ) => {
    setLoading(true);
    updatePage(page_id, page_title, page_name, category, users_post, pageAction, actionLink).then(
      data => {
        if (data.api_status == 200) {
          dispatch(setPageInfoData(true));
          dispatch(setFetchPageList(true));
          navigationAppBar.goBack();
        } else {
          setLoading(false);
          Alert.alert('Error', `${data.errors.error_text}`, [
            {
              text: i18n.t(`translation:OK`),
              onPress: () => { },
            },
          ]);

        }
      },
    );
  };
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(0);
  const hasRequested = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (data && !hasRequested.current) {
        if (data.verified_status) {
          setVerificationStatus(1); // Set to "Pending"
          dispatch(setPageInfoData(true));
        } else {
          setVerificationStatus(data.is_verified === 1 ? 2 : 0); // 2 for "Verified", 0 for "Request"
          dispatch(setPageInfoData(true));
        }
      }
    }, [data])
  );
  const handleVerification = async () => {
    try {
      setIsLoading(true);
      const response = await submitVerificationRequest(pageId);
      if (response.api_status === 200) {
        if (response.code === 1) {
          
          setVerificationStatus(1); // Set to "Pending"
          hasRequested.current = false; // Reset flag when pending
          dispatch(setPageInfoData(true));
 
        } else if (response.code === 0) {
          setVerificationStatus(0); // Set to "Request"
          hasRequested.current = true; // Prevent useEffect from resetting to Pending
          dispatch(setPageInfoData(true));

        }
        console.log("Verification Status:", response.code);
      } else {
        console.error("Failed to update verification status");
      }
    } catch (error) {
      console.error("Error updating verification status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPageName(data.page_title);
    setPageUsername(data.page_name);
    setActionLink(data.call_action_type_url);
    setpageId(data.page_id);
    data.users_post === '1'
      ? setSelectedId('1')
      : data.users_post === '0'
        ? setSelectedId('0')
        : setSelectedId('');
    const index = categoriesList.findIndex(
      category => category.id === data.page_category,
    );
    setCategoryIndex(index);
    const pageindex = pageActionList.findIndex(
      action => action.id === data.call_action_type,
    );
    setPageActionIndex(pageindex)

    
  }, []);

  const navigateToProfilePage = item => {
    // Handle click on friend item, you can navigate or perform any other action here
    navigationAppBar.navigate('GroupScreen', { data: item });
  };

  const radioButtons = useMemo(
    () => [
      {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: 'Enable',
        value: 'enable',
        borderColor: COLOR.Primary,
        color: COLOR.Primary,
      },
      {
        id: '0',
        label: 'Disable',
        value: 'disable',
        borderColor: COLOR.Primary,
        color: COLOR.Primary,
      },
    ],
    [],
  );


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
      }}>
      <ActionAppBar
        appBarText={'Genearl'}
        source={IconManager.back_light}
        backpress={() => navigationAppBar.goBack()}
        actionButtonType={'text-button'}
        actionButtonPress={handleButtonPress}
        actionButtonText={'Save'}
        darkMode={darkMode}
      />
      <SizedBox height={10} />
      <View
        style={{
          width: '100%',
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            height: PIXEL.px50,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            backgroundColor:
              darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
            borderColor: pageColor
              ? 'red'
              : focusOne
                ? COLOR.Primary
                : COLOR.Grey100,
            borderWidth: 1,
            borderRadius: 8,
          }}>
          <View style={{ width: '11%', paddingLeft: 16 }}>
            <IconPic
              source={
                darkMode == 'enable'
                  ? IconManager.page_dark
                  : IconManager.page_light
              }
            />
          </View>
          <TextInput
            style={{
              backgroundColor:
                darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
              borderRadius: 8,
              width: '89%',
              paddingLeft: 8,
              paddingRight: 16,
            }}
            multiline={false}
            value={pageName}
            onFocus={handleFocusOne}
            onBlur={handleBlurOne}
            placeholder="Page Title"
            color={darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500}
            placeholderTextColor={
              darkMode === 'enable' ? COLOR.Grey100 : COLOR.Grey300
            }
            onChangeText={text => {
              setPageColor(false);
              setPageName(text);
            }}
            textInputStyle={{
              color: COLOR.Grey500,
              fontFamily: FontFamily.PoppinRegular,
              width: '100%',
              backgroundColor: COLOR.White100,
              fontSize: fontSizes.size14,
            }}
          />
        </View>
      </View>
      <SizedBox height={10} />
      <View
        style={{
          width: '100%',
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            height: PIXEL.px50,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            backgroundColor:
              darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
            borderColor: pageUsernameColor
              ? 'red'
              : focusTwo
                ? COLOR.Primary
                : COLOR.Grey100,
            borderWidth: 1,
            borderRadius: 8,
          }}>
          <View style={{ width: '11%', paddingLeft: 16 }}>
            <IconPic
              source={
                darkMode == 'enable'
                  ? IconManager.friend_dark
                  : IconManager.friend_light
              }
            />
          </View>
          <TextInput
            style={{
              backgroundColor:
                darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
              borderRadius: 8,
              width: '89%',
              paddingLeft: 8,
              paddingRight: 16,
            }}
            multiline={false}
            value={pageUsername}
            onFocus={handleFocusTwo}
            onBlur={handleBlurTwo}
            placeholder="Page Username"
            color={darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500}
            placeholderTextColor={
              darkMode === 'enable' ? COLOR.Grey100 : COLOR.Grey300
            }
            onChangeText={text => {
              setPageUsernameColor(false);
              setPageUsername(text);
            }}
            textInputStyle={{
              color: COLOR.Grey500,
              fontFamily: FontFamily.PoppinRegular,
              width: '100%',
              backgroundColor: COLOR.White100,
              fontSize: fontSizes.size14,
            }}
          />
        </View>
      </View>

      <SizedBox height={10} />
      <View
        style={{
          width: '100%',
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <SelectDropdown
          data={categoriesList}
          defaultValueByIndex={categoryIndex}
          disabled={false}
          showsVerticalScrollIndicator={false}
          selectedRowStyle={{
            borderRadius: 1,
            borderColor: COLOR.Primary,
            borderWidth: 1,
          }}
          // defaultValue={'Egypt'}
          onSelect={(selectedItem, index) => {
            setCategory(selectedItem.id);
          }}
          defaultButtonText={categoryName}
          buttonTextAfterSelection={(selectedItem, index) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <IconPic
                  source={
                    darkMode == 'enable'
                      ? IconManager.menu_dark
                      : IconManager.menu_light
                  }
                />
                <Text
                  style={{
                    color:
                      darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500,
                    fontFamily: FontFamily.PoppinRegular,
                    fontSize: fontSizes.size14,
                    paddingLeft: 8,
                  }}>
                  {selectedItem.category_name}
                </Text>
              </View>
            );
          }}
          rowTextForSelection={(item, index) => {
            return (
              <Text
                style={{
                  color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500,
                  fontFamily: FontFamily.PoppinRegular,
                  fontSize: fontSizes.size14,
                }}>
                {item.category_name}
              </Text>
            );
          }}
          buttonStyle={{
            width: '90%',
            backgroundColor:
              darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: COLOR.Grey100,
          }}
          buttonTextStyle={styles.dropdown1BtnTxtStyle}
          renderDropdownIcon={isOpened => {
            return (
              <Image
                resizeMode="contain"
                style={{ width: 15, height: 15, marginRight: 8 }}
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

      <SizedBox height={10} />
      <View
        style={{
          width: '100%',
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <SelectDropdown
          data={pageActionList}
          defaultValueByIndex={pageActionIndex}
          disabled={false}
          showsVerticalScrollIndicator={false}
          selectedRowStyle={{
            borderRadius: 1,
            borderColor: COLOR.Primary,
            borderWidth: 1,
          }}
          // defaultValue={'Egypt'}
          onSelect={(selectedItem, index) => {
            setPageAction(selectedItem.id);
          }}
          defaultButtonText={pageAction}
          buttonTextAfterSelection={(selectedItem, index) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <IconPic
                  source={
                    darkMode == 'enable'
                      ? IconManager.page_action_light
                      : IconManager.page_action_light
                  }
                />
                <Text
                  style={{
                    color:
                      darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500,
                    fontFamily: FontFamily.PoppinRegular,
                    fontSize: fontSizes.size14,
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
                  color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500,
                  fontFamily: FontFamily.PoppinRegular,
                  fontSize: fontSizes.size14,
                }}>
                {item.name}
              </Text>
            );
          }}
          buttonStyle={{
            width: '90%',
            backgroundColor:
              darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: COLOR.Grey100,
          }}
          buttonTextStyle={styles.dropdown1BtnTxtStyle}
          renderDropdownIcon={isOpened => {
            return (
              <Image
                resizeMode="contain"
                style={{ width: 15, height: 15, marginRight: 8 }}
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
      <SizedBox height={10} />
      <View
        style={{
          width: '100%',
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            height: PIXEL.px50,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            backgroundColor:
              darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
            borderColor: pageActionColor
              ? 'red'
              : focusThree
                ? COLOR.Primary
                : COLOR.Grey100,
            borderWidth: 1,
            borderRadius: 8,
          }}>
          <View style={{ width: '11%', paddingLeft: 16 }}>
            <IconPic
              source={
                darkMode == 'enable'
                  ? IconManager.page_action_light
                  : IconManager.page_action_light
              }
            />
          </View>
          <TextInput
            style={{
              backgroundColor:
                darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
              borderRadius: 8,
              width: '89%',
              paddingLeft: 8,
              paddingRight: 16,
            }}
            multiline={false}
            value={actionLink}
            onFocus={handleFocusThree}
            onBlur={handleBlurThree}
            placeholder="Call to targe url"
            color={darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500}
            placeholderTextColor={
              darkMode === 'enable' ? COLOR.Grey100 : COLOR.Grey300
            }
            onChangeText={text => {
              setPageActionColor(false);
              setActionLink(text);
            }}
            textInputStyle={{
              color: COLOR.Grey500,
              fontFamily: FontFamily.PoppinRegular,
              width: '100%',
              backgroundColor: COLOR.White100,
              fontSize: fontSizes.size14,
            }}
          />
        </View>
      </View>

      <SizedBox height={10} />
      <View style={{ marginHorizontal: 26 }}>
        <Text style={{ fontFamily: FontFamily.PoppinRegular, fontSize: fontSizes.size14, color: COLOR.Grey400 }}>
          Verification
        </Text>
        <TouchableOpacity
          style={
            verificationStatus === 0
              ? styles.buttonStyle // Style for "Request"
              : verificationStatus === 1
                ? styles.buttonPending // Style for "Pending"
                : styles.buttonVerified // Style for "Verified"
          }
          onPress={() => {
            handleVerification();
          }}
          disabled={verificationStatus === 2 || isLoading} // Disable if "Verified" or loading
        >
          <IconPic
            source={
              darkMode === "enable"
                ? IconManager.page_verification_light
                : IconManager.page_verification_light
            }
          />
          <Text style={{ color: "white", marginStart: 5 }}>
            {verificationStatus === 0
              ? "Request"
              : verificationStatus === 1
                ? "Pending"
                : "Verified"}
          </Text>
        </TouchableOpacity>
      </View>
      {loading && <AppLoading />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dropdown1BtnTxtStyle: {
    color: COLOR.Grey500,
    textAlign: 'left',
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
  },
  dropdown1DropdownStyle: { borderRadius: 4, padding: 8 },
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
  dropdown1RowTxtStyle: { color: '#444', textAlign: 'left' },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButtonContainer: {
    marginRight: 16,
  },
  text: {
    color: COLOR.Grey300,
    fontFamily: FontFamily.PoppinRegular
  },
  textDark: {
    color: COLOR.White100,
  },
  buttonStyle: {
    flexDirection: 'row',
    backgroundColor: 'green',
    // height: 45,
    paddingVertical: SPACING.sp10,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.rd5,
    marginTop: 8,
  },
  buttonPending: {
    flexDirection: 'row',
    backgroundColor: COLOR.Warning,
    // height: 45,
    paddingVertical: SPACING.sp10,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.rd5,
    marginTop: 8,
  },
  buttonVerified: {
    flexDirection: 'row',
    backgroundColor: COLOR.Primary,
    // height: 45,
    paddingVertical: SPACING.sp10,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.rd5,
    marginTop: 8,
  },

});

export default EditPageGeneral;
