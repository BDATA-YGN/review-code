import React, {useEffect, useState, useRef} from 'react';
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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import IconManager from '../../../assets/IconManager';
import COLOR from '../../../constants/COLOR';
import IconPic from '../../../components/Icon/IconPic';
import {FontFamily, fontSizes} from '../../../constants/FONT';
import ActionAppBar from '../../../commonComponent/ActionAppBar';
import SizedBox from '../../../commonComponent/SizedBox';
import {updatePageInfo} from '../../../helper/ApiModel';
import AppLoading from '../../../commonComponent/Loading';
import PIXEL from '../../../constants/PIXEL';
import {setFetchDarkMode} from '../../../stores/slices/DarkModeSlice';
import {storeKeys} from '../../../helper/AsyncStorage';
import {retrieveStringData} from '../../../helper/AsyncStorage';
import {useDispatch, useSelector} from 'react-redux';
import {setFetchPageList} from '../../../stores/slices/PostSlice';
import {setPageInfoData} from '../../../stores/slices/PageSlice';

const EditPageInformation = ({route}) => {
  const {data} = route.params;
  const navigationAppBar = useNavigation();
  const [loading, setLoading] = useState(false);

  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [aboutPage, setAboutPage] = useState('');

  const [textEdit1, setTextEdit1] = useState(false);
  const [textEdit2, setTextEdit2] = useState(false);
  const [textEdit3, setTextEdit3] = useState(false);
  const [textEdit4, setTextEdit4] = useState(false);
  const [textEdit5, setTextEdit5] = useState(false);

  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const dispatch = useDispatch();
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
  const onPressCreate = () => {
    setLoading(true);
    
    
    updatePageInfo(
      data?.page_id,
      company,
      phone,
      location,
      website,
      aboutPage,
    ).then(data => {
      if (data.api_status == 200) {
        console.log(data);
        setLoading(false);
        dispatch(setPageInfoData(true));
        navigationAppBar.goBack();
      } else {
        setLoading(false);
        console.log(data);
        //
      }
    });
  };

  useEffect(() => {
    setCompany(data?.company);
    setPhone(data?.phone);
    setLocation(data?.address);
    setWebsite(data?.website);
    setAboutPage(data?.page_description);
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
      }}>
      <ActionAppBar
        appBarText={'Page Information'}
        source={IconManager.back_light}
        backpress={() => navigationAppBar.goBack()}
        actionButtonType={'text-button'}
        actionButtonPress={onPressCreate}
        actionButtonText={'Save'}
        darkMode={darkMode}
      />
      <SizedBox height={8} />
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
            borderColor: textEdit1 ? COLOR.Primary : COLOR.Grey100,
            borderWidth: 1,
            borderRadius: 8,
          }}>
          <View style={{width: '11%', paddingLeft: 16}}>
            <IconPic
              source={
                darkMode == 'enable'
                  ? IconManager.company_dark
                  : IconManager.company_light
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
              color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
            }}
            multiline={false}
            value={company}
            onFocus={() => {
              setTextEdit1(true);
            }}
            onBlur={() => {
              setTextEdit1(false);
            }}
            placeholder="Company"
            placeholderTextColor={
              darkMode == 'enable' ? COLOR.Grey100 : COLOR.Grey300
            }
            onChangeText={text => {
              setCompany(text);
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
      <SizedBox height={8} />
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
            borderColor: textEdit2 ? COLOR.Primary : COLOR.Grey100,
            borderWidth: 1,
            borderRadius: 8,
          }}>
          <View style={{width: '11%', paddingLeft: 16}}>
            <IconPic source={IconManager.phone_light} />
          </View>
          <TextInput
            style={{
              backgroundColor:
                darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
              borderRadius: 8,
              width: '89%',
              paddingLeft: 8,
              paddingRight: 16,
              color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
            }}
            multiline={false}
            value={phone}
            onFocus={() => {
              setTextEdit2(true);
            }}
            onBlur={() => {
              setTextEdit2(false);
            }}
            keyboardType="numeric"
            placeholder="Phone"
            placeholderTextColor={
              darkMode == 'enable' ? COLOR.Grey100 : COLOR.Grey300
            }
            onChangeText={text => {
              setPhone(text);
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
      <SizedBox height={8} />
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
            borderColor: textEdit3 ? COLOR.Primary : COLOR.Grey100,
            borderWidth: 1,
            borderRadius: 8,
          }}>
          <View style={{width: '11%', paddingLeft: 16}}>
            <IconPic
              source={
                darkMode == 'enable'
                  ? IconManager.location_dark
                  : IconManager.location_light
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
              color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
            }}
            multiline={false}
            value={location}
            onFocus={() => {
              setTextEdit3(true);
            }}
            onBlur={() => {
              setTextEdit3(false);
            }}
            placeholder="Location"
            placeholderTextColor={
              darkMode === 'enable' ? COLOR.Grey100 : COLOR.Grey300
            }
            onChangeText={text => {
              setLocation(text);
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
      <SizedBox height={8} />
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
            borderColor: textEdit4 ? COLOR.Primary : COLOR.Grey100,
            borderWidth: 1,
            borderRadius: 8,
          }}>
          <View style={{width: '11%', paddingLeft: 16}}>
            <IconPic source={IconManager.earth_light} />
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
            value={website}
            onFocus={() => {
              setTextEdit4(true);
            }}
            onBlur={() => {
              setTextEdit4(false);
            }}
            placeholder="Website"
            color={darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500}
            placeholderTextColor={
              darkMode === 'enable' ? COLOR.Grey100 : COLOR.Grey300
            }
            onChangeText={text => {
              setWebsite(text);
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
      <SizedBox height={8} />
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignContent: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            alignContent: 'center',
            marginHorizontal: 8,
            justifyContent: 'center',
            borderColor: textEdit5 ? COLOR.Primary : COLOR.Grey100,
            borderWidth: 1,
            borderRadius: 8,
            backgroundColor:
              darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
          }}>
          <View style={{width: '11%', paddingLeft: 16, paddingTop: 14}}>
            <IconPic
              source={
                darkMode == 'enable'
                  ? IconManager.page_dark
                  : IconManager.page_light
              }
            />
          </View>
          <View
            style={{
              width: '89%',
              justifyContent: 'flex-start',
              alignContent: 'center',
              alignItems: 'center',
              height: 120,
              backgroundColor:
                darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
              borderWidth: 0,
              borderRadius: 8,
            }}>
            <TextInput
              style={{
                backgroundColor:
                  darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
                borderRadius: 8,
                width: '100%',
                paddingLeft: 8,
                paddingRight: 16,
              }}
              multiline={true}
              value={aboutPage}
              onFocus={() => {
                setTextEdit5(true);
              }}
              onBlur={() => {
                setTextEdit5(false);
              }}
              placeholder="About Page"
              color={darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500}
              placeholderTextColor={
                darkMode === 'enable' ? COLOR.Grey100 : COLOR.Grey300
              }
              onChangeText={text => {
                setAboutPage(text);
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
  dropdown1DropdownStyle: {borderRadius: 4, padding: 8},
  dropdown1RowStyle: {
    backgroundColor: COLOR.White50,
    borderBottomColor: COLOR.White50,
    height: 40,
  },
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},
});

export default EditPageInformation;
