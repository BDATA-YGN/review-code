import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Image,
  RefreshControl,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FontFamily, fontSizes} from '../../constants/FONT';
import COLOR from '../../constants/COLOR';
import ListShimmer from './ListShimmer';
import IconManager from '../../assets/IconManager';
import DualAvater from '../../components/DualAvater';
import {
  addInvitee,
  getNotGroupMembers,
  getNotPageMembers,
} from '../../helper/ApiModel';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import en from '../../i18n/en';
import SizedBox from '../../commonComponent/SizedBox';
import PIXEL from '../../constants/PIXEL';
import SPACING from '../../constants/SPACING';
import IconPic from '../../components/Icon/IconPic';
import {useSelector, useDispatch} from 'react-redux';
import {storeKeys, retrieveStringData} from '../../helper/AsyncStorage';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';

const GroupInviteeList = ({route}) => {
  const {groupId} = route.params;
  const navigationAppBar = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [yourFriendList, setFriendList] = useState([]);
  const onRefresh = () => {};
  const [shimmer, setShimmer] = useState(true);
  const [loading, setLoading] = useState(false);
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

  const fetchFriendList = async group_id => {
    setLoading(true);
    const data = await getNotGroupMembers(group_id);
    if (data.api_status === 200) {
      setFriendList(data.users);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const onPressInvitee = async (group_id, user_id, index) => {
    const updatedList = [...yourFriendList];
    await addInvitee(group_id, user_id).then(data => {
      if (data.api_status == 200) {
        // Remove the element at the specified index
        updatedList.splice(index, 1);
        // Update the state with the new array
        setFriendList(updatedList);
      } else {
      }
    });
  };

  const renderFriendList = ({item, index}) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginVertical: 4,
        marginHorizontal: 8,
        borderRadius: 8,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <DualAvater
          borderRadius={25}
          largerImageWidth={55}
          largerImageHeight={55}
          src={item.avatar}
          iconBadgeEnable={false}
        />
        <View style={{marginLeft: 8, flex: 1}}>
          <Text
            style={
              darkMode == 'enable' ? styles.DheaderText : styles.headerText
            }>
             {item.first_name !== '' ? `${item.first_name} ${item.last_name}` : item.username}
          </Text>
          <Text
            style={darkMode == 'enable' ? styles.DbodyText : styles.bodyText}>
            @{item.username}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onPressInvitee(groupId, item.user_id, index)}>
          <IconPic
            source={
              darkMode == 'enable'
                ? IconManager.add_user_dark
                : IconManager.add_user_light
            }
            width={PIXEL.px20}
            height={PIXEL.px20}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  useEffect(() => {
    fetchFriendList(groupId);
    setTimeout(() => {
      setShimmer(false);
    }, 500);
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White,
      }}>
      <ActionAppBar
        appBarText={en.inviteFriends}
        source={IconManager.back_light}
        backpress={() => {
          navigationAppBar.goBack();
        }}
        darkMode={darkMode}
      />
      <View
        style={{
          backgroundColor:
            darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
          borderRadius: 4,
          flex: 1,
          borderColor: COLOR.Grey500,
          paddingTop: SPACING.sp8,
        }}>
        {
          shimmer ? (
            <ListShimmer isActionEnable={true} />
          ) : (
            <FlatList
              data={yourFriendList}
              renderItem={renderFriendList}
              keyExtractor={(item, index) => index}
              horizontal={false}
            />
          )
          // </ScrollView>
        }
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size15,
    color: COLOR.Grey500,
  },
  DheaderText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size15,
    color: COLOR.White100,
  },
  bodyText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    color: COLOR.Grey300,
  },
  DbodyText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    color: COLOR.White100,
  },
});

export default GroupInviteeList;
