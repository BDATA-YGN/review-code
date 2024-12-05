import React, {useState, useEffect, useId} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  RefreshControl,
  Image,
} from 'react-native';
import AppBar from '../../../components/AppBar';
import IconPic from '../../../components/Icon/IconPic';
import IconManager from '../../../assets/IconManager';
import SPACING from '../../../constants/SPACING';
import COLOR from '../../../constants/COLOR';
import PIXEL from '../../../constants/PIXEL';
import CoverVsAvatar from '../../../commonComponent/CoverVsAvatar';
import SizedBox from '../../../commonComponent/SizedBox';
import ActionButton from '../../../components/Button/ActionButton';
import en from '../../../i18n/en';
import {FontFamily, fontSizes} from '../../../constants/FONT';
import RADIUS from '../../../constants/RADIUS';
import {useNavigation} from '@react-navigation/native';
import {
  clearData,
  retrieveJsonData,
  retrieveStringData,
  storeJsonData,
  storeKeys,
} from '../../../helper/AsyncStorage';
import {
  filterSearchList,
  getGroupInfoById,
  getUserInfoData,
  gettingGroupPostById,
  joinUnjionGroupAction,
  likeUnlineAction,
  requestFollowersAndFollowingList,
} from '../../../helper/ApiModel';
import ProfileAvatar from '../../../components/Icon/ProfileAvatar';
import DualAvater from '../../../components/DualAvater';
import PostUserProfile from '../../Post/PostUserProfile';
import {stringKey} from '../../../constants/StringKey';
import CreatePost from '../../Post/CreatePost';

import {useDispatch, useSelector} from 'react-redux';
import {setFetchDarkMode} from '../../../stores/slices/DarkModeSlice';
import {
  setFetchPGData,
  setMyPagePostList,
} from '../../../stores/slices/PostSlice';
import {
  setGroupList,
  setPageList,
  setUserList,
} from '../../../stores/slices/searchSlice';

const ViewRecommendedGroup = ({route}) => {
  const {pageData, myNavigatedId, canPost, setWatchId, watchIdEnable} =
    route.params;
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const {width} = Dimensions.get('window');
  const navigation = useNavigation();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [groupInfo, setGroupInfo] = useState([]);
  const [liked, setLiked] = useState(en.unLike);
  const [joinStatus, setJoinStatus] = useState('0');
  const [joined, setJoined] = useState(en.joinGroup);

  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const searchText = useSelector(state => state.SearchSlice.searchText);
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
    dispatch(setMyPagePostList([]));
    getDarkModeTheme();
  }, []);
  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);

  useEffect(() => {
    setGroupInfo(pageData);
    getGroupPost(myNavigatedId);
  }, []);

  const getGroupPost = id => {
    gettingGroupPostById(id).then(data => {
      if (data.api_status == 200) {
        data.group_data?.is_group_joined === 1
          ? setJoinStatus('1')
          : data.group_data?.is_group_joined === 0
          ? setJoinStatus('0')
          : setJoinStatus('2');
        setGroupInfo(data.group_data);
      }
    });
  };

  const getApiData = async () => {
    await filterSearchList(searchText).then(data => {
      if (data.api_status === 200) {
        dispatch(setUserList(data.users)); // Load user list
        dispatch(setPageList(data.pages));
        dispatch(setGroupList(data.groups));
      } else {
      }
    });
  };

  const joinUnjoinGroup = group_id => {
    // const updatedList = [...recommendedList];
    // if (index >= 0 && index < updatedList.length) {
    joinUnjionGroupAction(group_id).then(async data => {
      if (data.api_status == 200) {
        if (data.join_status == 'requested') {
          setJoinStatus('2');
          setJoined('Requested');
          watchIdEnable === '1' && setWatchId('Requested');
          getGroupPost(myNavigatedId);
        } else if (data.join_status == 'joined') {
          setJoinStatus('1');
          setJoined('Joined');
          watchIdEnable === '1' && setWatchId('Joined');
          getGroupPost(myNavigatedId);
        } else {
          setJoinStatus('0');
          setJoined('Join Group');
          watchIdEnable === '1' && setWatchId('Join Group');
          getGroupPost(myNavigatedId);
        }
        await getApiData();
      } else {
        await getApiData();
      }
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // fetchData();
    getGroupPost(myNavigatedId);
    setRefreshing(false);
    dispatch(setFetchPGData(true));
  };

  const handleLoadMore = () => {
    // Simulating loading more data
  };

  const renderItem = ({item, index}) => (
    <TouchableOpacity
      key={index}
      style={{
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      }}
      onPress={() => handleItemPress(item.id)}>
      <Text>{item.title}</Text>
    </TouchableOpacity>
  );

  const handleItemPress = itemId => {
    // Toggle selection of items
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const renderParentItem = ({item}) => (
    <View>
      <IconPic
        resizeMode={true}
        src={groupInfo?.cover}
        width={'100%'}
        height={200}
      />
      <View
        style={[
          styles.userInfoHolder,
          {backgroundColor: darkMode === 'enable' && COLOR.DarkThemLight},
        ]}>
        <View style={styles.userInfoStyle}>
          <SizedBox height={SPACING.sm} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '90%',
            }}>
            <IconPic
              resizeMode={true}
              src={groupInfo?.avatar}
              width={PIXEL.px55}
              height={PIXEL.px55}
              borderRadius={RADIUS.rd25}
            />
            <SizedBox width={PIXEL.px12} />
            <View style={{flex: 1}}>
              <Text
                numberOfLines={1}
                style={[
                  styles.thickText,
                  {color: darkMode === 'enable' && COLOR.White100},
                ]}>
                {groupInfo?.group_name}
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.mediumText,
                  {color: darkMode === 'enable' && COLOR.White100},
                ]}>
                @{groupInfo?.username}
              </Text>
            </View>
          </View>
          <SizedBox height={PIXEL.px12} />
          <TouchableOpacity
            onPress={() => joinUnjoinGroup(groupInfo?.group_id)}
            style={{
              borderRadius: 8,
              borderWidth: 0,
              borderColor: COLOR.Primary,
              width: '90%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={[
                  styles.textButonEdit,
                  {
                    backgroundColor:
                      joinStatus == 0
                        ? COLOR.Primary
                        : joinStatus == 1
                        ? darkMode === 'enable'
                          ? COLOR.DarkThemLight
                          : COLOR.Grey50
                        : COLOR.Grey50,
                  },
                ]}>
                <IconPic
                  width={20}
                  height={18}
                  source={
                    joinStatus == 0
                      ? IconManager.group_line_white
                      : joinStatus == 1
                      ? darkMode === 'enable'
                        ? IconManager.group_line_white
                        : IconManager.group_line_dark
                      : IconManager.group_line_dark
                  }
                />
                <SizedBox width={10} />
                <Text
                  style={[
                    styles.buttonWhiteTextStyle,
                    {
                      color:
                        joinStatus == 0
                          ? COLOR.White100
                          : joinStatus == 1
                          ? darkMode === 'enable'
                            ? COLOR.White100
                            : COLOR.Grey500
                          : COLOR.Grey500,
                    },
                  ]}>
                  {joined}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <SizedBox height={PIXEL.px12} />
          <SizedBox height={0.5} width={'90%'} color={COLOR.Grey100} />
          <SizedBox height={PIXEL.px12} />
          <View style={{width: '90%'}}>
            <Text
              style={[
                styles.pageAboutHeader,
                {color: darkMode === 'enable' && COLOR.White100},
              ]}>
              {en.about}
            </Text>
            <Text
              style={[
                styles.pageAboutHeaderBody,
                {color: darkMode === 'enable' && COLOR.White100},
              ]}>
              {groupInfo?.about}
            </Text>
          </View>
          <SizedBox height={PIXEL.px12} />
          <SizedBox height={0.5} width={'90%'} color={COLOR.Grey100} />
          <SizedBox height={PIXEL.px12} />
          <View style={{width: '90%', justifyContent: 'flex-start'}}>
            {groupInfo?.likes !== '' && (
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.userInfoProfileContent}>
                <IconPic
                  source={
                    darkMode === 'enable'
                      ? IconManager.group_dark
                      : IconManager.group_light
                  }
                  width={PIXEL.px22}
                  height={PIXEL.px22}
                />
                <SizedBox width={SPACING.xxs} />
                <Text
                  style={[
                    styles.mediumText,
                    {color: darkMode === 'enable' && COLOR.White100},
                  ]}>
                  {groupInfo?.members_count} Members
                </Text>
              </TouchableOpacity>
            )}
            {groupInfo?.users_post !== '' && <SizedBox height={SPACING.sm} />}
            {groupInfo?.users_post !== '' && (
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.userInfoProfileContent}>
                <IconPic
                  source={
                    darkMode === 'enable'
                      ? IconManager.earth_dark
                      : IconManager.earth_light
                  }
                  width={PIXEL.px22}
                  height={PIXEL.px22}
                />
                <SizedBox width={SPACING.xxs} />
                <Text
                  style={[
                    styles.mediumText,
                    {color: darkMode === 'enable' && COLOR.White100},
                  ]}>{`${
                  groupInfo?.privacy === '2' ? 'Private' : 'Public'
                }`}</Text>
              </TouchableOpacity>
            )}
            {groupInfo?.company !== '' && <SizedBox height={SPACING.sm} />}
            {groupInfo?.company !== '' && (
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.userInfoProfileContent}>
                <IconPic
                  source={
                    darkMode === 'enable'
                      ? IconManager.compass_dark
                      : IconManager.compass_light
                  }
                  width={PIXEL.px22}
                  height={PIXEL.px22}
                />
                <SizedBox width={SPACING.xxs} />
                <Text
                  style={[
                    styles.mediumText,
                    {color: darkMode === 'enable' && COLOR.White100},
                  ]}>
                  {groupInfo?.category}
                </Text>
              </TouchableOpacity>
            )}
            {groupInfo?.company !== '' && <SizedBox height={SPACING.sm} />}
            {groupInfo?.website !== '' && (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() =>
                  navigation.navigate('GroupInviteeList', {
                    groupId: groupInfo?.group_id,
                  })
                }
                style={styles.userInfoProfileContent}>
                <IconPic
                  source={
                    darkMode === 'enable'
                      ? IconManager.add_user_dark
                      : IconManager.add_user_light
                  }
                  width={PIXEL.px22}
                  height={PIXEL.px22}
                />
                <SizedBox width={SPACING.xxs} />
                <Text
                  style={[
                    styles.mediumText,
                    {color: darkMode === 'enable' && COLOR.White100},
                  ]}>
                  Invite Friends
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <SizedBox height={SPACING.sm} />
          <SizedBox height={0.5} width={'90%'} color={COLOR.Grey100} />
        </View>
        <SizedBox height={SPACING.sp12} />
      </View>
      {/* <FlatList
        data={followers}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          <View style={{paddingVertical: 20}}>
            <ActivityIndicator size="small" color={COLOR.Primary} />
          </View>
        )}
      /> */}
      {groupInfo?.is_group_joined === 1 && (
        <SizedBox
          height={SPACING.sp12}
          width={'100%'}
          color={darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White50}
        />
      )}

      {/* <Text>{myNavigatedId}</Text> */}

      {groupInfo?.is_group_joined === 1 && (
        <View>
          <CreatePost
            darkMode={darkMode}
            postType={stringKey.navigateToMyGroup}
            userId={myNavigatedId}
            userData={groupInfo}
          />
        </View>
      )}
      <SizedBox
        height={SPACING.sp12}
        width={'100%'}
        color={darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White50}
      />

      <View>
        <PostUserProfile
          darkMode={darkMode}
          postType={stringKey.navigateToMyGroup}
          userId={myNavigatedId}
          userData={groupInfo}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={{
        backgroundColor:
          darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
        flex: 1,
      }}>
      <View style={{position: 'relative'}}>
        <View style={styles.appBarIconWrapper}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.goBack()}>
            <IconPic
              width={24}
              height={24}
              source={IconManager.light_dark_back}
            />
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.moreIconContainer}
            onPress={() => {}}>
            <IconPic width={24} height={24} source={IconManager.more_dark} />
          </TouchableOpacity> */}
        </View>
        <FlatList
          data={[{id: 'parent', title: 'Parent'}]} // Dummy data for the parent FlatList
          showsVerticalScrollIndicator={false}
          renderItem={renderParentItem}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default ViewRecommendedGroup;

const styles = StyleSheet.create({
  buttonTextStyle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.Grey500,
    marginTop: 3,
  },
  buttonWhiteTextStyle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.White100,
    marginTop: 3,
  },
  pageAboutHeader: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.Grey500,
  },
  pageAboutHeaderBody: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    color: COLOR.Grey300,
  },
  textButonEdit: {
    borderWidth: 1,
    borderColor: COLOR.Primary,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sp8,
    borderRadius: RADIUS.rd8,
    backgroundColor: COLOR.Primary,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButonOffer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sp8,
    borderRadius: RADIUS.rd8,
    backgroundColor: COLOR.Grey50,
    flex: 1,
  },
  textButonCreateJob: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sp8,
    borderRadius: RADIUS.rd8,
    backgroundColor: COLOR.Grey50,
    flex: 1.5,
  },

  appBarIconWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 48,
    padding: 10,
    // alignItems : 'center',
    backgroundColor: 'rgba(0,0,0,0)',
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  iconContainer: {
    // position: 'absolute',
    // top: SPACING.sp32,
    // left: 0,
    // padding: 10,
    width: PIXEL.px50,
    height: PIXEL.px50,
    // backgroundColor:COLOR.Primary,
    justifyContent: 'center',
    alignItems: 'flex-start',
    // zIndex: 1, // Ensure the icon is above other content
  },
  moreIconContainer: {
    // position: 'absolute',
    // top: SPACING.sp32,
    // right: 4,
    // padding: 10,
    width: PIXEL.px50,
    height: PIXEL.px50,
    // backgroundColor:COLOR.Primary,
    justifyContent: 'center',
    alignItems: 'center',
    // zIndex: 1, // Ensure the icon is above other content
  },
  friendListStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.lg,
    // backgroundColor: COLOR.Blue100
  },
  userInfoHolder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.White100,
  },
  userInfoStyle: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontFamily: FontFamily.PoppinBold,
    color: COLOR.Grey500,
    fontSize: fontSizes.size23,
  },
  thickText: {
    fontFamily: FontFamily.PoppinSemiBold,
    color: COLOR.Grey500,
    fontSize: fontSizes.size19,
  },
  mediumText: {
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Grey500,
    fontSize: fontSizes.size14,
  },
  smaillText: {
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Grey400,
    fontSize: fontSizes.size12,
  },
  narmalText: {
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Grey500,
    fontSize: fontSizes.size15,
  },
  centerAll: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfoProfileContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
});
