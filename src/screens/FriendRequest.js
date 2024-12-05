import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
} from 'react-native';
import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import COLOR from '../constants/COLOR';
import AppBar from '../components/AppBar';
import { TouchableOpacity } from 'react-native';
import RADIUS from '../constants/RADIUS';
import SPACING from '../constants/SPACING';
import DualAvater from '../components/DualAvater';
import { getNotificationList } from '../helper/ApiModel';
import { useEffect, useState, useRo } from 'react';
import { useIsFocused } from '@react-navigation/native';
import AppLoading from '../commonComponent/Loading';
import { ScrollView } from 'react-native';
import assets from '../assets/IconManager';
import { calculateTimeDifference } from '../helper/Formatter';
import { FontFamily } from '../constants/FONT';
import { fontSizes } from '../constants/FONT';
import { getAcceptFollowUser } from '../helper/ApiModel';
import { getFriendRequestList } from '../helper/ApiModel';
import { retrieveStringData } from '../helper/AsyncStorage';
import { storeKeys } from '../helper/AsyncStorage';
import { setFetchDarkMode } from '../stores/slices/DarkModeSlice';
import { useDispatch, useSelector } from 'react-redux';
import SizedBox from '../commonComponent/SizedBox';
import PIXEL from '../constants/PIXEL';
import { fontWeight } from '../constants/FONT';
import i18n from '../i18n';
import ListShimmer from './GroupProfile/ListShimmer';
import FriendRequestShimmer from './FriendRequestShimmer';
import { setFetchFriendRequest } from '../stores/slices/NotificationSlice';
import ActionAppBar from '../commonComponent/ActionAppBar';
import IconManager from '../assets/IconManager';
import ProfileAvatar from '../components/Icon/ProfileAvatar';
const FriendRequest = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  // const route = useRoute();
  const [NotificationData, setNotificationData] = useState('');
  const [loadingNotification, setLoadingNotification] = useState(true);
  const [darkMode, setDarkMode] = useState(null);
  const [shimmer, setShimmer] = useState(true);
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

  const getFriendRequesData = () => {
    setTimeout(() => {
      getFriendRequestList().then(data => {
        if (data.api_status === 200) {
          setNotificationData(data.friend_requests);
          setLoadingNotification(false);
          dispatch(setFetchFriendRequest(true));
        } else {
           setLoadingNotification(false);
        }
      });
    }, 1500);
  };


  const getAcceptFollowData = async (item, index) => {
   
    const user_id = item.user_id

    try {
      const data = await getAcceptFollowUser('accept', user_id);
      
      if (data.api_status === 200) {
        const updatedData = NotificationData.filter(
          (item) => item.user_id !== user_id
        );
        setNotificationData(updatedData);
        dispatch(setFetchFriendRequest(true));
      }
    } catch (error) {
      console.error('Error while processing follow request action:', error.message);
    }
  }

  const getDeclineFollowData = async (item, index) => {
    const user_id = item.user_id

    try {
      const data = await getAcceptFollowUser('decline', user_id);
    
      if (data.api_status === 200) {
        const updatedData = NotificationData.filter(
          (item) => item.user_id !== user_id
        );
        setNotificationData(updatedData);
        dispatch(setFetchFriendRequest(true));
      }
    } catch (error) {
      console.error('Error while processing follow request action:', error.message);
    }
  }


  useEffect(() => {
    getFriendRequesData();
  
  }, [isFocused]);



  const NotificationEmpty = () => {
    const [loading, setLoading] = useState(false);
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}>
        {/* <Icon width={iconSize} height={iconSize} source={assetsManager.notificationEmpty} /> */}
        <Image
          resizeMode="contain"
          style={{ width: 250, height: 250 }}
          source={darkMode == 'enable' ? assets.nouser_show_dark : assets.nouser_show_light}
        />
        <SizedBox height={PIXEL.px40} />
        <Text
          style={{
            fontFamily: FontFamily.PoppinSemiBold,
            fontSize: fontSizes.size23,
            color: darkMode == 'enable' ? COLOR.White : COLOR.Grey500,
            fontWeight: fontWeight.weight700,
          }}>
          {i18n.t(`translation:nouser`)}
        </Text>
        <SizedBox height={PIXEL.px8} />
        <Text
          style={{
            textAlign: 'center',
            marginHorizontal: SPACING.sp24,
            fontFamily: FontFamily.PoppinRegular,
            fontSize: fontSizes.size15,
            color: darkMode == 'enable' ? COLOR.White : COLOR.Grey500,
          }}>
          {i18n.t(`translation:welcome`)}
        </Text>
        <SizedBox height={PIXEL.px30} />
      </View>
    );
  };

  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);
  return (
    <SafeAreaView style={
      darkMode == 'enable'
        ? {flex: 1, backgroundColor: COLOR.DarkTheme}
        : {flex: 1, backgroundColor: COLOR.White50}}>
      <StatusBar animated={true} backgroundColor={COLOR.Primary} />
      <ActionAppBar appBarText="Friend Requests" source={
          darkMode == 'enable' ? IconManager.back_dark : IconManager.back_light
        }
        backpress={() => {
          navigation.goBack();
        }} darkMode={darkMode} />
      {loadingNotification ? (
        <FriendRequestShimmer shimmerCount={4} />
      ) : (
        <View style={{ flex: 1 }}>
          {NotificationData.length > 0 ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}>
              {NotificationData.map((item, index) => (
                <View
                  style={{
                    // paddingHorizontal: SPACING.sp16,
                    flexDirection: 'row',
                    borderBottomColor: darkMode == 'enable' ? COLOR.Grey400 : COLOR.Grey100,
                    borderBottomWidth: 1,
                    marginHorizontal: SPACING.sp16,
                  }}
                  key={index}>
                  <View
                    style={{
                      borderRadius: RADIUS.rd8,
                      flexDirection: 'row',
                      width: '60%',
                      paddingVertical: SPACING.sp16,
                    }}>
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity
                           onPress={() => {
                            navigation.navigate('OtherUserProfile', {
                              otherUserData: item,
                              userId: item.user_id,
                            });
                          }}
                        activeOpacity={0.5}
                        style={{
                          flexDirection: 'row',
                          flex: 1,
                          alignItems: 'center',
                        }}>
                        <ProfileAvatar src={item.avatar} />

                        <View
                          style={{ flex: 1, marginHorizontal: SPACING.sp10 }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View>
                              <Text style={darkMode == 'enable' ? styles.DarkThemeheaderText : styles.headerText}>
                                {item.first_name}{' '}
                                {item.last_name}{' '}
                              </Text>
                              <Text numberOfLines={1} style={darkMode == 'enable' ? styles.DarkThemebodyText : styles.bodyText}>
                                {calculateTimeDifference(item.lastseen_unix_time)}
                              </Text>

                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      justifyContent: 'center',
                      width: '40%',
                      alignItems: 'center',
                      paddingVertical: SPACING.sp16,
                      flexDirection: 'row',
                    }}>
                    <TouchableOpacity
                      style={{ marginEnd: SPACING.sp10 }}
                      onPress={() => getAcceptFollowData(item, index)}>
                      <Image
                        source={assets.mark_blue_light}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: RADIUS.rd100,
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => getDeclineFollowData(item, index)}>
                      <Image
                        source={assets.wrong_mark_light}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: RADIUS.rd100,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <NotificationEmpty />
          )}
        </View>
      )}

    </SafeAreaView>
  );
};

export default FriendRequest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White50,
    // justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  darkModecontainer: {
    flex: 1,
    backgroundColor: COLOR.DarkTheme,
    // justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  headerText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.Grey500,
    flex: 1,
  },
  DarkThemeheaderText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.White,
    flex: 1,
  },
  bodyText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    color: COLOR.Grey300,
    flex: 1,
  },
  DarkThemebodyText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    color: COLOR.White,
    flex: 1,
  },
});
