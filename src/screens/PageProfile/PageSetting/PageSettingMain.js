import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconManager from '../../../assets/IconManager';
import DualAvater from '../../../components/DualAvater';
import COLOR from '../../../constants/COLOR';
import { FontFamily, fontSizes } from '../../../constants/FONT';
import en from '../../../i18n/en';
import ActionAppBar from '../../../commonComponent/ActionAppBar';
import { storeKeys } from '../../../helper/AsyncStorage';
import { retrieveStringData } from '../../../helper/AsyncStorage';
import { useDispatch, useSelector } from 'react-redux';
import { setFetchDarkMode } from '../../../stores/slices/DarkModeSlice';
import { setPageInfoData, setPageSocailLinks } from '../../../stores/slices/PageSlice';
import { getPageInfoById, submitVerficationRequest } from '../../../helper/ApiModel';
import { useDeviceName } from 'react-native-device-info';

const PageSetttingMain = ({route}) => {
    const {data} = route.params;
    const navigationAppBar = useNavigation();
    const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
    const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
    const fetchPageInfoList = useSelector(
      state => state.PageSlice.fetchPageInfoList,
    );
    const [pageInfo, setPageInfo] = useState([]);
    const dispatch = useDispatch();

    console.log(data.verified_status);
    useEffect(() => {
  
      fetchPageInfo(data.page_id);
    }, []);
 
    useEffect(() => {
      if (fetchPageInfoList) {
        fetchPageInfo(data.page_id);
      }
    }, [fetchPageInfoList]);
    
    const fetchPageInfo = page_id => {
      // setLoading(true);
      getPageInfoById(page_id).then(data => {
        if (data.api_status == 200) {
          setPageInfo(data.page_data);
          // setRefreshing(false);
          dispatch(setPageInfoData(false));
   
        } else {
          // setRefreshing(false);
          dispatch(setPageInfoData(false));

        }
      });
    };



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
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: darkMode == 'enable' ? COLOR.DarkTheme :
        COLOR.White100 }}>
        <ActionAppBar
            appBarText={en.pageSetting}
            source={IconManager.back_light}
            backpress={() => { navigationAppBar.goBack() }} darkMode = {darkMode} />
        <View style={{ margin: 8 }}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => { navigationAppBar.navigate('EditPageGeneral', { data: pageInfo }) }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 8, marginVertical: 6 }}>
                    <DualAvater largerImageWidth={20} largerImageHeight={20} source={darkMode == 'enable' ? IconManager.setting_dark : IconManager.setting_light} iconBadgeEnable={false} backgroundColor={darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100} />
                    <Text style={[darkMode == 'enable' ? styles.DbodyText : styles.bodyText, { marginLeft: 6 }]}>General</Text>
                </View>
            </TouchableOpacity>
            {/* <TouchableOpacity activeOpacity={0.7} onPress={()=>{navigationAppBar.navigate('EidtGroupPrivacy', {data: props.data})}}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 8, marginVertical: 6 }}>
                <DualAvater largerImageWidth={20} largerImageHeight={20} source={assetsManager.privacy_primary_dark} iconBadgeEnable={false} backgroundColor={Color.White100} />
                <Text style={[styles.bodyText, { marginLeft: 6 }]}>Privacy</Text>
            </View>
        </TouchableOpacity> */}
            <TouchableOpacity activeOpacity={0.7} onPress={() => { navigationAppBar.navigate('EditPageInformation', { data: pageInfo }) }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 8, marginVertical: 10  }}>
                    <DualAvater largerImageWidth={20} largerImageHeight={20} source={darkMode == 'enable' ? IconManager.my_info_dark :IconManager.my_info_light} iconBadgeEnable={false} backgroundColor={darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100} />
                    <Text style={[darkMode == 'enable' ? styles.DbodyText : styles.bodyText, { marginLeft: 6 }]}>Page Information</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => { navigationAppBar.navigate('EditPageSocialLinks', { data: pageInfo , darkMode : darkMode}) }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 8, marginVertical: 10 }}>
                    <DualAvater largerImageWidth={20} largerImageHeight={20} source={darkMode == 'enable' ? IconManager.user_link_dark :IconManager.user_link_light} iconBadgeEnable={false} backgroundColor={darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100} />
                    <Text style={[darkMode == 'enable' ? styles.DbodyText : styles.bodyText, { marginLeft: 6 }]}>Social Links</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => { navigationAppBar.navigate('EditPageAdmin', { data: pageInfo , darkMode : darkMode}) }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center',  marginHorizontal: 8, marginVertical: 10 }}>
                    <DualAvater largerImageWidth={20} largerImageHeight={20} source={darkMode == 'enable' ?IconManager.user_dark : IconManager.user_light} iconBadgeEnable={false} backgroundColor={darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100} />
                    <Text style={[darkMode == 'enable' ? styles.DbodyText : styles.bodyText, { marginLeft: 6 }]}>Admin</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => { navigationAppBar.navigate('EditDeletePage', { data: pageInfo }) }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 8, marginVertical: 10 }}>
                    <DualAvater largerImageWidth={20} largerImageHeight={20} source={darkMode == 'enable' ? IconManager.delete_dark : IconManager.delete_light} iconBadgeEnable={false} backgroundColor={darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100} />
                    <Text style={[darkMode == 'enable' ? styles.DbodyText : styles.bodyText, { marginLeft: 6 }]}>Delete Page</Text>
                </View>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    bodyText: {
        color: COLOR.Grey500,
        fontFamily: FontFamily.PoppinRegular,
        fontSize: fontSizes.size16
    },
    DbodyText: {
        color: COLOR.White100,
        fontFamily: FontFamily.PoppinRegular,
        fontSize: fontSizes.size16
    }
});

export default PageSetttingMain;