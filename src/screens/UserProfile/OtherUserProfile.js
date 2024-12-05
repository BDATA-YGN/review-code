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
import {useNavigation} from '@react-navigation/native';
import {
  clearData,
  retrieveJsonData,
  storeJsonData,
  storeKeys,
  retrieveStringData,
} from '../../helper/AsyncStorage';
import {
  filterSearchList,
  getUserInfoData,
  requestFollowersAndFollowingList,
  submitBlock,
  submitFriendRequest,
  submitReportUser,
} from '../../helper/ApiModel';
import ProfileAvatar from '../../components/Icon/ProfileAvatar';
import PostUserProfile from '../Post/PostUserProfile';
import CreatePost from '../Post/CreatePost';
import {stringKey} from '../../constants/StringKey';
import i18n from '../../i18n';
import {useDispatch, useSelector} from 'react-redux';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import MoreOptionsModal from './MoreOptionsModal';
import {otherUserProfileMoreOptions} from '../../constants/CONSTANT_ARRAY';
import Toast from 'react-native-toast-message';
import ReportUserModal from './ReportUserModal';
import ListModal from '../PWA_Instruction/list_modal';
import {pwaUserActionList} from '../../constants/CONSTANT_ARRAY';
import {
  setGroupList,
  setPageList,
  setUserList,
} from '../../stores/slices/searchSlice';

const OtherUserProfile = ({route}) => {
  const {userId, otherUserData, canPost} = route.params;
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const {width} = Dimensions.get('window');
  const navigation = useNavigation();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followOrNot, setFollowOrNot] = useState(null);
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const [moreOptionsModalVisible, setMoreOptionsModalVisble] = useState(false);
  const [reportUserModalVisible, setReportUserModalVisible] = useState(false);
  const [reportText, setReportText] = useState('');
  const userInfoData = useSelector(state => state.MarketSlice.userInfoData);
  const [modalListVisible, setModalListVisible] = useState(false);
  const dispatch = useDispatch();

  console.log('user_id', userInfo.user_id);
  console.log('userid', userInfoData.user_id);
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

  const handleSelectMoreOptions = option => {
    if (option == 3) {
      setMoreOptionsModalVisble(false);
      handleBlockUser(userInfo.user_id);
    }
    if (option == 4) {
      setMoreOptionsModalVisble(false);
      setReportUserModalVisible(true);
    }
  };

  const handleReportUser = () => {
    setReportUserModalVisible(false);
    submitReportUser(userInfo.user_id, reportText).then(value => {
      if (value.api_status === 200) {
        setReportText('');
        showToast('Report Successfully');
      } else {
      }
    });
  };

  const showToast = msg => {
    Toast.show({
      type: 'success',
      text1: msg,
      visibilityTime: 2000,
      position: 'bottom',
    });
  };

  const handleBlockUser = user_id => {
    submitBlock(user_id, 'block').then(value => {
      if (value.api_status === 200) {
        showToast('Block Successfully');
      } else {
      }
    });
  };

  // Simulate fetching data from an API
  const fetchData = async () => {
    try {
      const loginData = await retrieveJsonData({
        key: storeKeys.loginCredential,
      });
      const userDataResponse = await requestFollowersAndFollowingList(
        'followers,following',
        userId,
      );
      if (userDataResponse.api_status == 200) {
        // setData(newData);
        setFollowers(
          userDataResponse.data.followers.filter(
            item => item.user_id !== loginData?.user_id,
          ),
        );
        setFollowing(
          userDataResponse.data.following.filter(
            item => item.user_id !== loginData?.user_id,
          ),
        );
        setLoading(false);
        setRefreshing(false);
      } else {
      }
    } catch (error) {
      fetchData();
    }
    return;
  };

  useEffect(() => {
    setUserInfo(otherUserData);
  }, []);

  useEffect(() => {
    fetchData();
  }, [userInfo]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
    fetchUserInfo();
  };

  const handleLoadMore = () => {
    // Simulating loading more data
  };

  // const handleMoreOptionsModal = () => {

  // }

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
      const userDataResponse = await getUserInfoData(userId);
      setUserInfo(userDataResponse.user_data);
    } catch (error) {
      fetchUserInfo();
    }
  };

  const handleFriendClick = item => {
    // Handle click on friend item, you can navigate or perform any other action here
    navigation.navigate('OtherUserProfile', {
      userId: item?.user_id,
      otherUserData: item,
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
  const searchText = useSelector(state => state.SearchSlice.searchText);

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

  const friendRequest = async userId => {
    const response = await submitFriendRequest(userId);

    if (response.api_status) {
      if (response.follow_status === 'requested') {
        setFollowOrNot(true);
      }
      if (response.follow_status === 'unfollowed') {
        setFollowOrNot(false);
      }
      await getApiData();
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
      />
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
              {/* {userInfo.first_name} {userInfo.last_name} */}
              {/* {userInfo.first_name && userInfo.last_name ? userInfo.first_name+''+userInfo.last_name: userInfo.username}  */}
              {/* {userInfo.first_name && userInfo.first_name}  {userInfo.last_name && userInfo.last_name} {userInfo.username && userInfo.username} */}
              {userInfo.first_name !== ''
                ? `${userInfo.first_name} ${userInfo.last_name}`
                : userInfo.username}
            </Text>
            {userInfo.verified === '1' ? <SizedBox width={SPACING.sm} /> : null}
            {userInfo.verified === '1' ? (
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
          {userInfo.message_privacy === '0' ? (
            <View style={{width: '90%', flexDirection: 'row'}}>
              {/* {
              userInfo.friend_privacy === "1"?<View><Text>People I Follow</Text></View> : <Text>{userInfo.friend_privacy}</Text>
            } */}
              <View style={{width: '64%'}}>
                <ActionButton
                  text={
                    followOrNot === true
                      ? `${i18n.t(`translation:requested`)}`
                      : followOrNot === false
                      ? `${i18n.t(`translation:addFriend`)}`
                      : userInfo.is_friend_confirm === 2
                      ? `${i18n.t(`translation:friend`)}`
                      : userInfo.is_friend_confirm === 1
                      ? `${i18n.t(`translation:requested`)}`
                      : `${i18n.t(`translation:addFriend`)}`
                  }
                  onPress={() => friendRequest(userInfo?.user_id)}
                  myStyle={
                    userInfo.is_friend_confirm === 2
                      ? styles.myStyle
                      : userInfo.is_friend_confirm === 1 && styles.myStyle
                  }
                  myText={
                    userInfo.is_friend_confirm === 2
                      ? styles.myText
                      : userInfo.is_friend_confirm === 1 && styles.myText
                  }
                />
              </View>
              <SizedBox width={'4%'} />
              <TouchableOpacity
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
                }
                onPress={() => {
                  setModalListVisible(true);
                }}>
                <IconPic source={IconManager.message_light} />
              </TouchableOpacity>
              <SizedBox width={'4%'} />
              <TouchableOpacity
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
                }
                onPress={() => setMoreOptionsModalVisble(true)}>
                <IconPic source={IconManager.more_light} />
              </TouchableOpacity>
            </View>
          ) : userInfo.message_privacy === '1' ? (
            <>
              {userInfo.is_friend_confirm === 2 ? (
                <View style={{width: '90%', flexDirection: 'row'}}>
                  {/* {
              userInfo.friend_privacy === "1"?<View><Text>People I Follow</Text></View> : <Text>{userInfo.friend_privacy}</Text>
            } */}
                  <View style={{width: '64%'}}>
                    <ActionButton
                      text={
                        followOrNot === true
                          ? `${i18n.t(`translation:requested`)}`
                          : followOrNot === false
                          ? `${i18n.t(`translation:addFriend`)}`
                          : userInfo.is_friend_confirm === 2
                          ? `${i18n.t(`translation:friend`)}`
                          : userInfo.is_friend_confirm === 1
                          ? `${i18n.t(`translation:requested`)}`
                          : `${i18n.t(`translation:addFriend`)}`
                      }
                      onPress={() => friendRequest(userInfo?.user_id)}
                      myStyle={
                        userInfo.is_friend_confirm === 2
                          ? styles.myStyle
                          : userInfo.is_friend_confirm === 1 && styles.myStyle
                      }
                      myText={
                        userInfo.is_friend_confirm === 2
                          ? styles.myText
                          : userInfo.is_friend_confirm === 1 && styles.myText
                      }
                    />
                  </View>
                  <SizedBox width={'4%'} />
                  <TouchableOpacity
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
                    }
                    onPress={() => {
                      setModalListVisible(true);
                    }}>
                    <IconPic source={IconManager.message_light} />
                  </TouchableOpacity>
                  <SizedBox width={'4%'} />
                  <TouchableOpacity
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
                    }
                    onPress={() => setMoreOptionsModalVisble(true)}>
                    <IconPic source={IconManager.more_light} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{width: '90%', flexDirection: 'row'}}>
                  {/* {
              userInfo.friend_privacy === "1"?<View><Text>People I Follow</Text></View> : <Text>{userInfo.friend_privacy}</Text>
            } */}
                  <View style={{width: '82%'}}>
                    <ActionButton
                      text={
                        followOrNot === true
                          ? `${i18n.t(`translation:requested`)}`
                          : followOrNot === false
                          ? `${i18n.t(`translation:addFriend`)}`
                          : userInfo.is_friend_confirm === 2
                          ? `${i18n.t(`translation:friend`)}`
                          : userInfo.is_friend_confirm === 1
                          ? `${i18n.t(`translation:requested`)}`
                          : `${i18n.t(`translation:addFriend`)}`
                      }
                      onPress={() => friendRequest(userInfo?.user_id)}
                      myStyle={
                        userInfo.is_friend_confirm === 2
                          ? styles.myStyle
                          : userInfo.is_friend_confirm === 1 && styles.myStyle
                      }
                      myText={
                        userInfo.is_friend_confirm === 2
                          ? styles.myText
                          : userInfo.is_friend_confirm === 1 && styles.myText
                      }
                    />
                  </View>
                  <SizedBox width={'4%'} />
                  <TouchableOpacity
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
                    }
                    onPress={() => setMoreOptionsModalVisble(true)}>
                    <IconPic source={IconManager.more_light} />
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : (
            <View style={{width: '90%', flexDirection: 'row'}}>
              {/* {
              userInfo.friend_privacy === "1"?<View><Text>People I Follow</Text></View> : <Text>{userInfo.friend_privacy}</Text>
            } */}
              <View style={{width: '82%'}}>
                <ActionButton
                  text={
                    followOrNot === true
                      ? `${i18n.t(`translation:requested`)}`
                      : followOrNot === false
                      ? `${i18n.t(`translation:addFriend`)}`
                      : userInfo.is_friend_confirm === 2
                      ? `${i18n.t(`translation:friend`)}`
                      : userInfo.is_friend_confirm === 1
                      ? `${i18n.t(`translation:requested`)}`
                      : `${i18n.t(`translation:addFriend`)}`
                  }
                  onPress={() => friendRequest(userInfo?.user_id)}
                  myStyle={
                    userInfo.is_friend_confirm === 2
                      ? styles.myStyle
                      : userInfo.is_friend_confirm === 1 && styles.myStyle
                  }
                  myText={
                    userInfo.is_friend_confirm === 2
                      ? styles.myText
                      : userInfo.is_friend_confirm === 1 && styles.myText
                  }
                />
              </View>
              <SizedBox width={'4%'} />
              <TouchableOpacity
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
                }
                onPress={() => setMoreOptionsModalVisble(true)}>
                <IconPic source={IconManager.more_light} />
              </TouchableOpacity>
            </View>
          )}
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
          userInfo.working_link === '' &&
          userInfo.about === '' ? null : userInfo.working === '' &&
            userInfo.address === '' &&
            userInfo.working_link === '' &&
            userInfo.about === null ? null : (
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
              <>
                {userInfo.share_my_location === '1' ? (
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
                ) : null}
              </>
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
            {userInfo?.about !== '' && <SizedBox height={SPACING.sm} />}
            {userInfo?.about !== '' ||
              (userInfo.about === null && (
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
              ))}
            {userInfo?.birthday !== '0000-00-00' && (
              <SizedBox height={SPACING.sm} />
            )}
            {userInfo?.birthday !== '0000-00-00' && (
              <>
                {userInfo.birth_privacy === '0' ? (
                  <View style={styles.userInfoProfileContent}>
                    <IconPic
                      source={
                        darkMode == 'enable'
                          ? IconManager.birthday_light
                          : IconManager.birthday_light
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
                      {userInfo?.birthday}
                    </Text>
                  </View>
                ) : userInfo.birth_privacy === '1' ? (
                  <>
                    {userInfo.is_friend_confirm === 2 ? (
                      <View style={styles.userInfoProfileContent}>
                        <IconPic
                          source={
                            darkMode == 'enable'
                              ? IconManager.birthday_light
                              : IconManager.birthday_light
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
                          {userInfo?.birthday}
                        </Text>
                      </View>
                    ) : null}
                  </>
                ) : null}
              </>
            )}
            {userInfo.working === '' &&
            userInfo.address === '' &&
            userInfo.working_link === '' &&
            userInfo.about === '' &&
            userInfo.birthday === '0000-00-00' ? (
              <Text
                style={[
                  styles.mediumText,
                  darkMode == 'enable'
                    ? {color: COLOR.White}
                    : {color: COLOR.Grey500},
                ]}>
                No User Information Unavailable!
              </Text>
            ) : userInfo.working === '' &&
              userInfo.address === '' &&
              userInfo.working_link === '' &&
              userInfo.about === null ? (
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
          {userInfo.friend_privacy === '1' ? (
            <>
              {(userInfo.is_friend_confirm === 2 ||
                userInfo.is_friend_confirm === 1) && (
                <FlatList
                  data={following}
                  // backgroundColor={COLOR.Primary}
                  showsHorizontalScrollIndicator={false}
                  renderItem={renderFriendList}
                  keyExtractor={(item, index) => `${item.id}-${index}`}
                  horizontal={true}
                  contentContainerStyle={{}}
                />
              )}
            </>
          ) : userInfo.friend_privacy === '2' ? (
            <>
              {(userInfo.is_friend_confirm === 2 ||
                userInfo.is_friend_confirm === 1) && (
                <FlatList
                  data={following}
                  // backgroundColor={COLOR.Primary}
                  showsHorizontalScrollIndicator={false}
                  renderItem={renderFriendList}
                  keyExtractor={(item, index) => `${item.id}-${index}`}
                  horizontal={true}
                  contentContainerStyle={{}}
                />
              )}
            </>
          ) : userInfo.friend_privacy === '3' ? null : (
            <FlatList
              data={following}
              // backgroundColor={COLOR.Primary}
              showsHorizontalScrollIndicator={false}
              renderItem={renderFriendList}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              horizontal={true}
              contentContainerStyle={{}}
            />
          )}
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
                navigation.navigate('OtherSeeAll', {userId});
              }}>
              {userInfo.friend_privacy === '1' ? (
                <>
                  {(userInfo.is_friend_confirm === 2 ||
                    userInfo.is_friend_confirm === 1) && (
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
                  )}
                </>
              ) : userInfo.friend_privacy === '2' ? (
                <>
                  {(userInfo.is_friend_confirm === 2 ||
                    userInfo.is_friend_confirm === 1) && (
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
                  )}
                </>
              ) : userInfo.friend_privacy === '3' ? (
                <>
                  {userInfo.is_friend_confirm === 2 ||
                  userInfo.is_friend_confirm === 1 ? null : (
                    <Text></Text>
                  )}
                </>
              ) : (
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
              )}
              {/* <Text
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
              </Text> */}
            </TouchableOpacity>
          )}
        </View>
      )}
      {/* <FlatList
        data={followers}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator size="small" color={COLOR.Primary} />
          </View>
        )}
      /> */}

      <SizedBox
        height={SPACING.sp12}
        width={'100%'}
        color={darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White50}
      />

      {userInfo.post_privacy === 'everyone' ? (
        <View>
          <CreatePost userData={userInfo} darkMode={darkMode} />
        </View>
      ) : userInfo.post_privacy === 'ifollow' ? (
        <>
          {userInfo.is_friend_confirm === 2 && (
            <View>
              <CreatePost userData={userInfo} darkMode={darkMode} />
            </View>
          )}
        </>
      ) : null}

      {userInfo.post_privacy === 'everyone' ? (
        <SizedBox
          height={SPACING.sp12}
          width={'100%'}
          color={darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White50}
        />
      ) : userInfo.post_privacy === 'ifollow' ? (
        <>
          {userInfo.is_friend_confirm === 2 && (
            <SizedBox
              height={SPACING.sp12}
              width={'100%'}
              color={darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White50}
            />
          )}
        </>
      ) : null}

      <View>
        <PostUserProfile
          postType={stringKey.navigateToUserProfile}
          userId={userId}
          userData={userInfo}
          darkMode={darkMode}
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
        data={otherUserProfileMoreOptions}
        action={handleSelectMoreOptions}
        darkMode={darkMode}
      />
      <ReportUserModal
        visible={reportUserModalVisible}
        onClose={() => setReportUserModalVisible(false)}
        action={handleReportUser}
        setReportText={setReportText}
        reportText={reportText}
        darkMode={darkMode}
      />
      {/* <Toast ref={ref => Toast.setRef(ref)} /> */}
      <Toast />

      <ListModal
        dataList={pwaUserActionList}
        darkMode={darkMode}
        modalVisible={modalListVisible}
        setModalVisible={setModalListVisible}
      />
    </SafeAreaView>
  );
};

export default OtherUserProfile;

const styles = StyleSheet.create({
  myStyle: {
    backgroundColor: COLOR.White100,
    borderWidth: 1,
    borderColor: COLOR.Primary,
  },
  myText: {
    color: COLOR.Primary,
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
