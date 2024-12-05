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
  getPageInfoById,
  getUserInfoData,
  likeUnlineAction,
  requestFollowersAndFollowingList,
} from '../../../helper/ApiModel';
import ProfileAvatar from '../../../components/Icon/ProfileAvatar';
import DualAvater from '../../../components/DualAvater';
import PostUserProfile from '../../Post/PostUserProfile';
import {stringKey} from '../../../constants/StringKey';
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
import ListModal from '../../PWA_Instruction/list_modal';
import {pwaUserActionList} from '../../../constants/CONSTANT_ARRAY';
import CreatePost from '../../Post/CreatePost';

const ViewDiscoverPage = ({route}) => {
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
  const [pageInfo, setPageInfo] = useState([]);
  const [liked, setLiked] = useState(en.like);

  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const dispatch = useDispatch();
  const [modalListVisible, setModalListVisible] = useState(false);

  const [userInfoData, setUserInfoData] = useState([]);

  const fetchUserInfo = async () => {
    try {
      const userDataResponse = await getUserInfoData();
      setUserInfoData(userDataResponse.user_data);
      console.log(userDataResponse.user_data.user_id);
    } catch (error) {
      fetchUserInfo();
    }
  };
  useEffect(() => {
    dispatch(setMyPagePostList([]));
    fetchUserInfo();
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
    getDarkModeTheme();
  }, []);
  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);

  // useEffect(() => {
  //   setPageInfo(pageData);
  // }, []);

  useEffect(() => {
    fetchPageInfo(pageData.page_id);
    console.log('pageInfo', pageInfo);
  }, []);
  const fetchPageInfo = page_id => {
    setLoading(true);

    getPageInfoById(page_id).then(data => {
      if (data.api_status == 200) {
        setPageInfo(data.page_data);
        setRefreshing(false);
        // dispatch(setPageInfoData(false));
      } else {
        setRefreshing(false);
        // dispatch(setPageInfoData(false));
      }
    });
  };
  const handleRefresh = () => {
    dispatch(setFetchPGData(true));
    // setRefreshing(true);
    // fetchData();
  };

  const handleLoadMore = () => {
    // Simulating loading more data
  };
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

  const likeUnlike = page_id => {
    likeUnlineAction(page_id).then(async data => {
      if (data.api_status == 200) {
        if (data.like_status == 'liked') {
          setLiked(en.unLike);
          watchIdEnable === '1' && setWatchId('unlike');
        } else {
          setLiked(en.like);
          watchIdEnable === '1' && setWatchId('like');
        }
        await getApiData();
      } else {
        await getApiData();
      }
    });
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
    <View style={{marginBottom: 20}}>
      <IconPic
        resizeMode={true}
        src={pageInfo.cover}
        width={'100%'}
        height={200}
      />
      <View style={styles.userInfoHolder}>
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
              src={pageInfo.avatar}
              width={PIXEL.px55}
              height={PIXEL.px55}
              borderRadius={RADIUS.rd25}
            />
            <SizedBox width={PIXEL.px12} />
            <View style={{flex: 1}}>
              <Text
                numberOfLines={1}
                style={
                  darkMode === 'enable' ? styles.DthickText : styles.thickText
                }>
                {pageInfo.page_title}
              </Text>
              <Text
                numberOfLines={1}
                style={
                  darkMode === 'enable' ? styles.DmediumText : styles.mediumText
                }>
                @{pageInfo.username}
              </Text>
            </View>
          </View>
          <SizedBox height={PIXEL.px12} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '90%',
            }}>
            <TouchableOpacity
              onPress={() => likeUnlike(pageInfo?.page_id)}
              style={{
                flex: 1,
                borderWidth: 0,
                borderColor: COLOR.Primary,
                width: '45%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={[
                  styles.textButonEdit,
                  {
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor:
                      liked == en.like
                        ? COLOR.Primary
                        : darkMode === 'enable'
                        ? COLOR.DarkThemLight
                        : COLOR.Grey50,
                    borderWidth: 1,
                    borderColor: COLOR.Primary,
                  },
                ]}>
                <IconPic
                  width={20}
                  height={18}
                  source={
                    liked == en.like
                      ? IconManager.like_line_white
                      : IconManager.like_line_light
                  }
                />
                <SizedBox width={10} />
                <Text
                  style={[
                    styles.buttonWhiteTextStyle,
                    {
                      color:
                        liked == en.like
                          ? COLOR.White100
                          : darkMode === 'enable'
                          ? COLOR.White100
                          : COLOR.Grey500,
                    },
                  ]}>
                  {liked}
                </Text>
              </View>
            </TouchableOpacity>
            <SizedBox width={16} />
            <TouchableOpacity
              style={{width: '45%'}}
              onPress={() => setModalListVisible(true)}>
              <View
                style={[
                  darkMode === 'enable'
                    ? styles.DtextButonOffer
                    : styles.textButonOffer,
                  {justifyContent: 'center', alignItems: 'center'},
                ]}>
                <IconPic
                  width={20}
                  height={20}
                  source={
                    darkMode === 'enable'
                      ? IconManager.message_dark
                      : IconManager.message_light
                  }
                />
                <SizedBox width={10} />
                <Text
                  style={
                    darkMode === 'enable'
                      ? styles.buttonWhiteTextStyle
                      : styles.buttonTextStyle
                  }>
                  {en.message}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <SizedBox height={PIXEL.px12} />
          <SizedBox height={0.5} width={'90%'} color={COLOR.Grey100} />
          <SizedBox height={PIXEL.px12} />
          <View style={{width: '90%'}}>
            <Text
              style={
                darkMode === 'enable'
                  ? styles.DpageAboutHeader
                  : styles.pageAboutHeader
              }>
              {en.about}
            </Text>
            <Text
              style={
                darkMode === 'enable'
                  ? styles.DpageAboutHeaderBody
                  : styles.pageAboutHeaderBody
              }>
              {pageInfo?.about}
            </Text>
          </View>
          <SizedBox height={PIXEL.px12} />
          <SizedBox height={0.5} width={'90%'} color={COLOR.Grey100} />
          <SizedBox height={PIXEL.px12} />
          <View style={{width: '90%'}}>
            <Text
              style={
                darkMode === 'enable'
                  ? styles.DpageAboutHeader
                  : styles.pageAboutHeader
              }>
              {en.ratings}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <IconPic source={IconManager.rating_light_fill} />
              <SizedBox width={PIXEL.px12} />
              <IconPic source={IconManager.rating_light_fill} />
              <SizedBox width={PIXEL.px12} />
              <IconPic source={IconManager.rating_light_line} />
              <SizedBox width={PIXEL.px12} />
              <IconPic source={IconManager.rating_light_line} />
              <SizedBox width={PIXEL.px12} />
              <IconPic source={IconManager.rating_light_line} />
            </View>
          </View>
          <SizedBox height={PIXEL.px12} />
          <SizedBox height={0.5} width={'90%'} color={COLOR.Grey100} />
          <SizedBox height={PIXEL.px12} />
          <View style={{width: '90%', justifyContent: 'flex-start'}}>
            {pageInfo?.likes !== '' && (
              <View style={styles.userInfoProfileContent}>
                <IconPic
                  source={
                    darkMode === 'enable'
                      ? IconManager.like_line_white
                      : IconManager.like_line_light
                  }
                  width={PIXEL.px22}
                  height={PIXEL.px22}
                />
                <SizedBox width={SPACING.xxs} />
                <Text
                  style={
                    darkMode === 'enable'
                      ? styles.DmediumText
                      : styles.mediumText
                  }>
                  {pageInfo?.likes} People like this.
                </Text>
              </View>
            )}
            {pageInfo?.users_post !== '' && <SizedBox height={SPACING.sm} />}
            {pageInfo?.users_post !== '' && (
              <View style={styles.userInfoProfileContent}>
                <IconPic
                  source={
                    darkMode === 'enable'
                      ? IconManager.album_dark
                      : IconManager.album_light
                  }
                  width={PIXEL.px22}
                  height={PIXEL.px22}
                />
                <SizedBox width={SPACING.xxs} />
                <Text
                  style={
                    darkMode === 'enable'
                      ? styles.DmediumText
                      : styles.mediumText
                  }>
                  {pageInfo?.users_post} Posts.
                </Text>
              </View>
            )}
            {pageInfo?.company !== '' && <SizedBox height={SPACING.sm} />}
            {pageInfo?.company !== '' && (
              <View style={styles.userInfoProfileContent}>
                <IconPic
                  source={
                    darkMode === 'enable'
                      ? IconManager.job_dark
                      : IconManager.jobs_light
                  }
                  width={PIXEL.px22}
                  height={PIXEL.px22}
                />
                <SizedBox width={SPACING.xxs} />
                <Text
                  style={
                    darkMode === 'enable'
                      ? styles.DmediumText
                      : styles.mediumText
                  }>
                  {pageInfo?.company}
                </Text>
              </View>
            )}
            {pageInfo?.website !== '' && <SizedBox height={SPACING.sm} />}
            {pageInfo?.website !== '' && (
              <View style={styles.userInfoProfileContent}>
                <IconPic
                  source={
                    darkMode === 'enable'
                      ? IconManager.user_link_dark
                      : IconManager.user_link_light
                  }
                  width={PIXEL.px22}
                  height={PIXEL.px22}
                />
                <SizedBox width={SPACING.xxs} />
                <Text
                  style={
                    darkMode === 'enable'
                      ? styles.DmediumText
                      : styles.mediumText
                  }>
                  {pageInfo?.website}
                </Text>
              </View>
            )}
            <SizedBox height={SPACING.sm} />
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() =>
                navigation.navigate('PageInviteeList', {
                  pageId: pageInfo?.page_id,
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
                style={
                  darkMode === 'enable' ? styles.DmediumText : styles.mediumText
                }>
                Invite Friends
              </Text>
            </TouchableOpacity>
          </View>
          <SizedBox height={SPACING.sm} />
          <SizedBox height={0.5} width={'90%'} color={COLOR.Grey100} />
          <SizedBox height={SPACING.sm} />
        </View>
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
      {/* <SizedBox
        height={SPACING.sp12}
        width={'100%'}
        color={darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White50}
      /> */}
      {pageInfo?.users_post === '1' ? (
        <View>
          <CreatePost
            darkMode={darkMode}
            postType={stringKey.navigateToMyPage}
            userId={myNavigatedId}
            userData={pageInfo}
          />
          <SizedBox
            height={SPACING.sp12}
            width={'100%'}
            color={darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White50}
          />
        </View>
      ) : null}

      <View>
        <PostUserProfile
          darkMode={darkMode}
          postType={stringKey.navigateToMyPage}
          userId={myNavigatedId}
          userData={pageInfo}
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

      <ListModal
        dataList={pwaUserActionList}
        darkMode={darkMode}
        modalVisible={modalListVisible}
        setModalVisible={setModalListVisible}
      />
    </SafeAreaView>
  );
};

export default ViewDiscoverPage;

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
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size15,
    color: COLOR.Grey500,
  },
  pageAboutHeaderBody: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    color: COLOR.Grey300,
  },
  DpageAboutHeader: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.White100,
  },
  DpageAboutHeaderBody: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    color: COLOR.White100,
  },
  textButonEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sp8,
    borderRadius: RADIUS.rd8,
    backgroundColor: COLOR.Primary,
    flex: 1,
  },
  DtextButonOffer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sp8,
    borderRadius: RADIUS.rd8,
    backgroundColor: COLOR.DarkFadeLight,
    flex: 1,
  },
  DtextButonCreateJob: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sp8,
    borderRadius: RADIUS.rd8,
    backgroundColor: COLOR.DarkFadeLight,
    flex: 1.5,
  },
  textButonOffer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sp8,
    borderRadius: RADIUS.rd8,
    backgroundColor: COLOR.Blue50,
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

  DuserName: {
    fontFamily: FontFamily.PoppinBold,
    color: COLOR.White100,
    fontSize: fontSizes.size23,
  },
  DthickText: {
    fontFamily: FontFamily.PoppinSemiBold,
    color: COLOR.White100,
    fontSize: fontSizes.size19,
  },
  DmediumText: {
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.White100,
    fontSize: fontSizes.size14,
  },
  DsmaillText: {
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.White100,
    fontSize: fontSizes.size12,
  },
  DnarmalText: {
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.White100,
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
