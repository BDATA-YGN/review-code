import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconManager from '../../../assets/IconManager';
import DualAvater from '../../../components/DualAvater';
import COLOR from '../../../constants/COLOR';
import { FontFamily, fontSizes } from '../../../constants/FONT';
import en from '../../../i18n/en';
import ActionAppBar from '../../../commonComponent/ActionAppBar';
import { retrieveStringData } from '../../../helper/AsyncStorage';
import { storeKeys } from '../../../helper/AsyncStorage';
import { useDispatch, useSelector } from 'react-redux';
import { setFetchDarkMode } from '../../../stores/slices/DarkModeSlice';
import { setGroupInfoData } from '../../../stores/slices/PageSlice';
import { getGroupInfoById } from '../../../helper/ApiModel';

const GroupSetttingMain = ({route}) => {
    const {data} = route.params;
    const navigationAppBar = useNavigation();
    const [darkMode, setDarkMode] = useState(null);
    const dispatch = useDispatch();
    const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
    const fetchGroupInfoList = useSelector(
        state => state.PageSlice.fetchGroupInfoList,
      );
      const [groupInfo, setGroupInfo] = useState([]);

      useEffect(() => {
  
        fetchGroupInfo(data.group_id);
      }, []);
   
      useEffect(() => {
        if (fetchGroupInfoList) {
          fetchGroupInfo(data.group_id);
        }
      }, [fetchGroupInfoList]);
      
      const fetchGroupInfo = group_id => {
        // setLoading(true);
        getGroupInfoById(group_id).then(data => {
          if (data.api_status == 200) {
            setGroupInfo(data.group_data);
            // setRefreshing(false);
            dispatch(setGroupInfoData(true));
          } else {
            // setRefreshing(false);
            dispatch(setGroupInfoData(true));
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
        <SafeAreaView style={{ flex: 1, backgroundColor: darkMode == 'enable' ? COLOR.DarkTheme :COLOR.White100 }}>
            <ActionAppBar
                appBarText={en.groupSetting}
                source={IconManager.back_light}
                backpress={() => { navigationAppBar.goBack() }} 
                darkMode={darkMode}/>
            <View style={{ margin: 8 }}>
                <TouchableOpacity activeOpacity={0.7} onPress={() => { navigationAppBar.navigate('EditGroupData', { data: groupInfo }) }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 8, marginVertical: 10 }}>
                        <DualAvater largerImageWidth={20} largerImageHeight={20} source={darkMode == 'enable' ? IconManager.setting_dark :IconManager.setting_light} iconBadgeEnable={false} backgroundColor={darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100} />
                        <Text style={[darkMode == 'enable' ? styles.DbodyText : styles.bodyText, { marginLeft: 6 }]}>General</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={() => { navigationAppBar.navigate('GroupPrivacy', { data: groupInfo, darkMode : darkMode }) }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 8, marginVertical: 10 }}>
                        <DualAvater largerImageWidth={20} largerImageHeight={20} source={darkMode == 'enable' ? IconManager.setting_dark :IconManager.group_privacy_light} iconBadgeEnable={false} backgroundColor={darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100} />
                        <Text style={[darkMode == 'enable' ? styles.DbodyText : styles.bodyText, { marginLeft: 6 }]}>Privacy</Text>
                    </View>
                </TouchableOpacity>
                {/* <TouchableOpacity activeOpacity={0.7} onPress={()=>{navigationAppBar.navigate('EidtGroupPrivacy', {data: props.data})}}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 8, marginVertical: 6 }}>
                    <DualAvater largerImageWidth={20} largerImageHeight={20} source={assetsManager.privacy_primary_dark} iconBadgeEnable={false} backgroundColor={Color.White100} />
                    <Text style={[styles.bodyText, { marginLeft: 6 }]}>Privacy</Text>
                </View>
            </TouchableOpacity> */}
                <TouchableOpacity activeOpacity={0.7} onPress={() => { navigationAppBar.navigate('EditGroupMember', { data: groupInfo }) }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 8, marginVertical: 10}}>
                        <DualAvater largerImageWidth={20} largerImageHeight={20}  source={darkMode == 'enable' ? IconManager.my_info_dark :IconManager.members_light} iconBadgeEnable={false} backgroundColor={darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100} />
                        <Text style={[darkMode == 'enable' ? styles.DbodyText : styles.bodyText, { marginLeft: 6 }]}>Members</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={() => { navigationAppBar.navigate('EditGroupDelete', { data: groupInfo }) }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 8, marginVertical: 10 }}>
                        <DualAvater largerImageWidth={20} largerImageHeight={20} source={darkMode == 'enable' ? IconManager.delete_dark :IconManager.delete_light} iconBadgeEnable={false} backgroundColor={darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100} />
                        <Text style={[darkMode == 'enable' ? styles.DbodyText : styles.bodyText, { marginLeft: 6 }]}>Delete Group</Text>
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
        color: COLOR.White,
        fontFamily: FontFamily.PoppinRegular,
        fontSize: fontSizes.size16
    }
});

export default GroupSetttingMain;