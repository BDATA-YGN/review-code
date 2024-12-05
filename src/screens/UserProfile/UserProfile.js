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
  Alert,
} from 'react-native';
import AppBar from '../../components/AppBar';
import IconPic from '../../components/Icon/IconPic';
import IconManager from '../../assets/IconManager';
import SPACING from '../../constants/SPACING';
import COLOR from '../../constants/COLOR';
import PIXEL from '../../constants/PIXEL';
import CoverVsAvatar from '../../commonComponent/CoverVsAvatar';
import SizedBox from '../../commonComponent/SizedBox';
import ActionButton from '../../components/Button/ActionButton';
import en from '../../i18n/en';
import {FontFamily, fontSizes} from '../../constants/FONT';
import RADIUS from '../../constants/RADIUS';
import {
  clearData,
  retrieveJsonData,
  retrieveStringData,
  storeJsonData,
  storeKeys,
} from '../../helper/AsyncStorage';
import {
  getUserInfoData,
  requestFollowersAndFollowingList,
  updateAvatarOreCover,
} from '../../helper/ApiModel';
import ProfileAvatar from '../../components/Icon/ProfileAvatar';
import ImagePicker from 'react-native-image-crop-picker';
import Story from '../Story/Story';
import CreatePost from '../Post/CreatePost';
import {useDispatch, useSelector} from 'react-redux';
import PostingStatusBar from '../../components/Post/PostStatusBar';
import Post from '../Post/Post';
import PostUserProfile from '../Post/PostUserProfile';
import {useNavigation, useRoute} from '@react-navigation/native';
import {stringKey} from '../../constants/StringKey';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {userProfileOption} from '../../constants/CONSTANT_ARRAY';
import MoreOptionsModal from './MoreOptionsModal';
import {setFetchUserInfo} from '../../stores/slices/UserInfoSlice';

const UserProfile = () => {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [userData, setUserData] = useState({});
  const {width} = Dimensions.get('window');
  const navigation = useNavigation();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [userId, setUserId] = useState(0);
  const dispatch = useDispatch();
  const route = useRoute();
  const {backDisable, myNavigatedId, canPost} = route.params;
  const [moreOptionsModalVisible, setMoreOptionsModalVisble] = useState(false);

  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const fetchUserInfoData = useSelector(
    state => state.UserInfoSlice.fetchUserInfoData,
  );

  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme

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

  const fetchLoginCredentialData = async () => {
    const userInfoData = await retrieveJsonData({key: storeKeys.userInfoData});
    if (userInfoData !== null) {
      setUserInfo(userInfoData);
      setUserId(userInfoData.user_id);
      fetchData(userInfoData.user_id);
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

  // Simulate fetching data from an API
  const fetchData = async user_id => {
    try {
      const userDataResponse = await requestFollowersAndFollowingList(
        'followers,following',
        user_id,
      );
      if (userDataResponse.api_status == 200) {
        setFollowing(
          userDataResponse.data.following.filter(
            item => item.user_id !== userInfo?.user_id,
          ),
        );
        setLoading(false);
        setRefreshing(false);
        // dispatch(setFetchUserInfo(false));
      } else {
      }
    } catch (error) {
      fetchData();
    }
    return;
  };

  useEffect(() => {
    fetchLoginCredentialData();
    fetchUserInfo();
  }, []);
  useEffect(() => {
    if (fetchUserInfoData) {
      fetchUserInfo();
    }
  }, [fetchUserInfoData]);
  // useEffect(() => {
  //   fetchData();
  // }, [userInfo]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
    fetchUserInfo();
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    // Simulating loading more data
  };

  const handleSelectMoreOptions = option => {
    if (option == 1) {
      // setMoreOptionsModalVisble(false);
      onPressCover();
      // handleBlockUser(userInfo.user_id);
    }
    if (option == 2) {
      // setMoreOptionsModalVisble(false);
      onPressAvatar();
      // setReportUserModalVisible(true);
    }
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

  const fetchUserInfo = async () => {
    try {
      const userDataResponse = await getUserInfoData();
      clearData({key: storeKeys.userInfoData});
      storeJsonData({
        key: storeKeys.userInfoData,
        data: userDataResponse.user_data,
      });
      setUserInfo(userDataResponse.user_data);
      dispatch(setFetchUserInfo(false));
    } catch (error) {
      fetchUserInfo();
    }
  };
  const handleFriendClick = item => {
    // Handle click on friend item, you can navigate or perform any other action here
    navigation.navigate('OtherUserProfile', {
      userId: item?.user_id,
      otherUserData: item,
      canPost: stringKey.canPost,
    });
  };

  const renderFriendList = ({item, index}) => (
    <TouchableOpacity
      activeOpacity={0.6}
      key={index}
      onPress={() => handleFriendClick(item)}>
      <View
        style={{
          marginLeft: index === 0 ? 0 : -10,
          borderRadius: RADIUS.rd25,
          borderWidth: 4,
          borderColor: COLOR.White50,
        }}>
        <ProfileAvatar src={item.avatar} backgroundColor={COLOR.Grey100} />
      </View>
    </TouchableOpacity>
  );

  const submitPhoto = (userId, type, image) => {
    return new Promise((resolve, reject) => {
      updateAvatarOreCover(userId, type, image)
        .then(data => {
          if (data.api_status == 200) {
            // setLoading(false)
            fetchUserInfo();
            resolve(`Success`);
          } else {
            // setLoading(false)
            // reject(`Failed to upload ${type}`);
            Alert.alert('Error', `Failed to upload ${type}`);
          }
        })
        .catch(error => {
          // reject(`Failed to upload ${type}`);
          Alert.alert('Error', `Failed to upload ${type}`);
        });
    });
  };

  const pickImage = type => {
    return new Promise((resolve, reject) => {
      ImagePicker.openPicker({
        width: 400,
        height: 300,
        cropping: true,
      })
        .then(image => {
          setMoreOptionsModalVisble(false);

          // resolve(image.path); // Resolve with the image path
          resolve(submitPhoto(userInfo?.user_id, type, image.path));
        })
        .catch(error => {
          // Alert.alert('Error', 'Failed to pick an image');
        });
    });
  };

  const onPressAvatar = () => {
    pickImage('avatar');
  };

  const onPressCover = () => {
    pickImage('cover');
  };

  const dataDummy = [{type: 'CreatePost'}, {type: 'Post'}];

  const loadingPosting = useSelector(
    state => state.AddPostSlice.loadingPosting,
  );
  const successPosting = useSelector(
    state => state.AddPostSlice.successPosting,
  );
  const errorPosting = useSelector(state => state.AddPostSlice.errorPosting);
  const renderListItem = ({item}) => {
    switch (item.type) {
      case 'CreatePost':
        return <CreatePost userData={userInfo} />;
      case 'Post':
        return <Post postType={'Userprofile'} userData={userInfo} />;
      default:
        return null;
    }
  };

  const renderParentItem = ({item}) => (
    <View
      style={
        darkMode == 'enable'
          ? {marginBottom: 20, backgroundColor: COLOR.DarkThemLight}
          : {marginBottom: 20, backgroundColor: COLOR.White100}
      }>
      <CoverVsAvatar
        largerImageWidth={width}
        largerImageHeight={165}
        userInfo={userInfo}
        // onPressCover={() => onPressCover()}
        // onPressAvatar={() => onPressAvatar()}
      />
      {/* <SizedBox height={PIXEL.pxMinus32} /> */}
      <View style={styles.userInfoHolder}>
        <View style={styles.userInfoStyle}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text
              style={[
                styles.userName,
                darkMode == 'enable'
                  ? {color: COLOR.White}
                  : {color: COLOR.Grey500},
              ]}>
              {userInfo.first_name !== ''
                ? `${userInfo.first_name} ${userInfo.last_name}`
                : userInfo.username}
            </Text>
            <SizedBox width={SPACING.sm} />
            {userInfo?.verified === '1' ? (
              <IconPic
                width={PIXEL.px22}
                height={PIXEL.px22}
                source={IconManager.user_type_light_dark}
              />
            ) : null}
          </View>
          {/* <Text
            style={[
              styles.narmalText,
              darkMode == 'enable'
                ? {color: COLOR.White}
                : {color: COLOR.Grey500},
            ]}>
            {userInfo.working}
          </Text> */}
          <SizedBox height={SPACING.sm} />
          <View style={{width: '90%', flexDirection: 'row'}}>
            <View style={{width: '82%'}}>
              <ActionButton
                text={en.edit}
                onPress={() => navigation.navigate('EditProfile')}
              />
            </View>
            <SizedBox width={'4%'} />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setMoreOptionsModalVisble(true)}
              style={
                darkMode == 'enable'
                  ? {
                      width: '14%',
                      backgroundColor: COLOR.DarkFadeLight,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: RADIUS.sm,
                    }
                  : {
                      width: '14%',
                      backgroundColor: COLOR.SocialBakcground,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: RADIUS.sm,
                    }
              }>
              <IconPic source={IconManager.more_light} />
            </TouchableOpacity>
          </View>
          <SizedBox height={SPACING.sm} />
          <View
            style={{
              width: '90%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={styles.centerAll}>
              <Text
                style={[
                  styles.thickText,
                  darkMode == 'enable'
                    ? {color: COLOR.White}
                    : {color: COLOR.Grey500},
                ]}>
                {userInfo?.details?.followers_count}
              </Text>
              <Text
                style={[
                  styles.smaillText,
                  darkMode == 'enable'
                    ? {color: COLOR.White}
                    : {color: COLOR.Grey400},
                ]}>
                {en.followers}
              </Text>
            </View>
            <View style={styles.centerAll}>
              <Text
                style={[
                  styles.thickText,
                  darkMode == 'enable'
                    ? {color: COLOR.White}
                    : {color: COLOR.Grey500},
                ]}>
                {userInfo?.details?.following_count}
              </Text>
              <Text
                style={[
                  styles.smaillText,
                  darkMode == 'enable'
                    ? {color: COLOR.White}
                    : {color: COLOR.Grey400},
                ]}>
                {en.following}
              </Text>
            </View>
            <View style={styles.centerAll}>
              <Text
                style={[
                  styles.thickText,
                  darkMode == 'enable'
                    ? {color: COLOR.White}
                    : {color: COLOR.Grey500},
                ]}>
                {userInfo?.details?.likes_count}
              </Text>
              <Text
                style={[
                  styles.smaillText,
                  darkMode == 'enable'
                    ? {color: COLOR.White}
                    : {color: COLOR.Grey400},
                ]}>
                {en.likes}
              </Text>
            </View>
            <View style={styles.centerAll}>
              <Text
                style={[
                  styles.thickText,
                  darkMode == 'enable'
                    ? {color: COLOR.White}
                    : {color: COLOR.Grey500},
                ]}>
                {userInfo?.points}
              </Text>
              <Text
                style={[
                  styles.smaillText,
                  darkMode == 'enable'
                    ? {color: COLOR.White}
                    : {color: COLOR.Grey400},
                ]}>
                {en.points}
              </Text>
            </View>
          </View>
          <SizedBox height={SPACING.sm} />
          <SizedBox height={0.5} width={'90%'} color={COLOR.Grey100} />
          {userInfo.working === '' &&
          userInfo.address === '' &&
          userInfo.working_link === '' ? null : userInfo.working === null &&
            userInfo.address === null &&
            userInfo.working_link === null ? null : (
            <SizedBox height={SPACING.sm} />
          )}
          <View style={{width: '90%', justifyContent: 'flex-start'}}>
            {userInfo?.working !== '' && (
              <View style={styles.userInfoProfileContent}>
                <IconPic
                  source={
                    darkMode == 'enable'
                      ? IconManager.job_dark
                      : IconManager.jobs_light
                  }
                  width={PIXEL.px22}
                  height={PIXEL.px22}
                />
                <SizedBox width={SPACING.xxs} />
                <Text
                  style={[
                    styles.mediumText,
                    darkMode == 'enable'
                      ? {color: COLOR.White}
                      : {color: COLOR.Grey500},
                  ]}>
                  {userInfo?.working}
                </Text>
              </View>
            )}
            {userInfo?.address !== '' && <SizedBox height={SPACING.sm} />}
            {userInfo?.address !== '' && (
              <View style={styles.userInfoProfileContent}>
                <IconPic
                  source={
                    darkMode == 'enable'
                      ? IconManager.home_address_dark
                      : IconManager.home_address_light
                  }
                  width={PIXEL.px22}
                  height={PIXEL.px22}
                />
                <SizedBox width={SPACING.xxs} />
                <Text
                  style={[
                    styles.mediumText,
                    darkMode == 'enable'
                      ? {color: COLOR.White}
                      : {color: COLOR.Grey500},
                  ]}>
                  {userInfo?.address}
                </Text>
              </View>
            )}
            {userInfo?.working_link !== '' && <SizedBox height={SPACING.sm} />}
            {userInfo?.working_link !== '' && (
              <View style={styles.userInfoProfileContent}>
                <IconPic
                  source={
                    darkMode == 'enable'
                      ? IconManager.user_link_dark
                      : IconManager.user_link_light
                  }
                  width={PIXEL.px22}
                  height={PIXEL.px22}
                />
                <SizedBox width={SPACING.xxs} />
                <Text
                  style={[
                    styles.mediumText,
                    darkMode == 'enable'
                      ? {color: COLOR.White}
                      : {color: COLOR.Grey500},
                  ]}>
                  {userInfo?.working_link}
                </Text>
              </View>
            )}
            {userInfo?.about && <SizedBox height={SPACING.sm} />}
            {userInfo?.about && (
              <View style={styles.userInfoProfileContent}>
                <IconPic
                  source={
                    darkMode == 'enable'
                      ? IconManager.my_info_dark
                      : IconManager.my_info_light
                  }
                  width={PIXEL.px22}
                  height={PIXEL.px22}
                />
                <SizedBox width={SPACING.xxs} />
                <Text
                  style={[
                    styles.mediumText,
                    darkMode == 'enable'
                      ? {color: COLOR.White}
                      : {color: COLOR.Grey500},
                  ]}>
                  {userInfo?.about}
                </Text>
              </View>
            )}
            {userInfo.working === '' &&
            userInfo.address === '' &&
            userInfo.working_link === '' ? (
              <Text
                style={[
                  styles.mediumText,
                  darkMode == 'enable'
                    ? {color: COLOR.White}
                    : {color: COLOR.Grey500},
                ]}>
                No User Information Unavailable!
              </Text>
            ) : userInfo.working === null &&
              userInfo.address === null &&
              userInfo.working_link === null ? (
              <Text
                style={[
                  styles.mediumText,
                  darkMode == 'enable'
                    ? {color: COLOR.White}
                    : {color: COLOR.Grey500},
                ]}>
                No User Information Unavailable!
              </Text>
            ) : null}
          </View>
          <SizedBox height={SPACING.sm} />
          <SizedBox height={0.5} width={'90%'} color={COLOR.Grey100} />
          <SizedBox height={SPACING.sm} />
        </View>
      </View>
      {following.length > 0 && (
        <View style={styles.friendListStyle}>
          <FlatList
            data={following}
            // backgroundColor={COLOR.Primary}
            showsHorizontalScrollIndicator={false}
            renderItem={renderFriendList}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            horizontal={true}
            contentContainerStyle={{}}
          />
          {!isLoading && (
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: SPACING.xxxxs,
                paddingLeft: SPACING.sp16,
                borderRadius: RADIUS.sm,
              }}
              onPress={() => {
                navigation.navigate('SeeAllFriends', {userId});
              }}>
              <Text
                style={
                  darkMode == 'enable'
                    ? {
                        fontFamily: FontFamily.PoppinSemiBold,
                        fontSize: fontSizes.size14,
                        color: COLOR.White,
                      }
                    : {
                        fontFamily: FontFamily.PoppinSemiBold,
                        fontSize: fontSizes.size14,
                        color: COLOR.Grey300,
                      }
                }>
                See All
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {/* 
      <SizedBox
        height={SPACING.sp12}
        width={'100%'}
        color={darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White50}
      /> */}

      {/* {canPost === stringKey.canPost && (
        <View>
          <CreatePost userData={userInfo} darkMode={darkMode} />
        </View>
      )} */}

      <SizedBox
        height={SPACING.sp12}
        width={'100%'}
        color={darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White50}
      />

      <View
        style={{
          backgroundColor:
            darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
        }}>
        <PostUserProfile
          postType={stringKey.navigateToUserProfile}
          userId={myNavigatedId}
          userData={userInfo}
          darkMode={darkMode}
          canPost={canPost}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={
        darkMode == 'enable'
          ? {flex: 1, backgroundColor: COLOR.DarkThemLight}
          : {flex: 1, backgroundColor: COLOR.White100}
      }>
      <View style={{position: 'relative'}}>
        {backDisable === 'enable' && (
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
        )}
        <FlatList
          data={[{id: 'parent', title: 'Parent'}]} // Dummy data for the parent FlatList
          showsVerticalScrollIndicator={false}
          renderItem={renderParentItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
        />
      </View>
      <MoreOptionsModal
        visible={moreOptionsModalVisible}
        onClose={() => setMoreOptionsModalVisble(false)}
        data={userProfileOption}
        action={handleSelectMoreOptions}
        darkMode={darkMode}
      />
    </SafeAreaView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  gapStyle: {
    width: '100%',
    height: PIXEL.px10,
    backgroundColor: COLOR.Grey50,
    marginVertical: SPACING.sp15,
  },
  darkModegapStyle: {
    width: '100%',
    height: PIXEL.px10,
    backgroundColor: COLOR.DarkTheme,
    marginVertical: SPACING.sp15,
  },
  homeContainer: {
    flex: 1,
    backgroundColor: COLOR.White100,
  },
  darkModehomeContainer: {
    flex: 1,
    backgroundColor: COLOR.DarkThemLight,
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
    paddingBottom: SPACING.sp12,
    // backgroundColor: COLOR.Blue100
  },
  userInfoHolder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfoStyle: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontFamily: FontFamily.PoppinBold,
    fontSize: fontSizes.size23,
  },
  thickText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
  },
  mediumText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
  },
  smaillText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
  },
  narmalText: {
    fontFamily: FontFamily.PoppinRegular,
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
