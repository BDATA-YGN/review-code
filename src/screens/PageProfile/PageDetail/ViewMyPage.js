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
import ImagePicker from 'react-native-image-crop-picker';

import {
  clearData,
  retrieveJsonData,
  retrieveStringData,
  storeJsonData,
  storeKeys,
} from '../../../helper/AsyncStorage';
import {
  getPageInfoById,
  getUserInfoData,
  requestFollowersAndFollowingList,
  updatePageAvatar,
  updatePageCover,
} from '../../../helper/ApiModel';
import ProfileAvatar from '../../../components/Icon/ProfileAvatar';
import DualAvater from '../../../components/DualAvater';
import CreatePost from '../../Post/CreatePost';
import PostUserProfile from '../../Post/PostUserProfile';
import {stringKey} from '../../../constants/StringKey';
import {useDispatch, useSelector} from 'react-redux';
import {setFetchDarkMode} from '../../../stores/slices/DarkModeSlice';
import {
  setFetchPGData,
  setFetchPageList,
  setMyPagePostList,
} from '../../../stores/slices/PostSlice';
import {
  setPageInfoData,
  setPageSocailLinks,
} from '../../../stores/slices/PageSlice';

const ViewMyPage = ({route}) => {
  const {myNavigatedId, canPost} = route.params;
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

  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const fetchPageInfoList = useSelector(
    state => state.PageSlice.fetchPageInfoList,
  );
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
    fetchPageInfo(myNavigatedId);
  }, []);
  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);
  useEffect(() => {
    if (fetchPageInfoList) {
      fetchPageInfo(myNavigatedId);
    }
  }, [fetchPageInfoList]);
  const fetchPageInfo = page_id => {
    setLoading(true);
    getPageInfoById(page_id).then(data => {
      if (data.api_status == 200) {
        setPageInfo(data.page_data);
        setRefreshing(false);
        dispatch(setPageInfoData(false));
      } else {
        setRefreshing(false);
        dispatch(setPageInfoData(false));
      }
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPageInfo(pageInfo.page_id);
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

  const submitPhoto = (pageId, type, image) => {
    return new Promise((resolve, reject) => {
      type === 'cover'
        ? updatePageCover(pageId, image)
            .then(data => {
              if (data.api_status == 200) {
                // setLoading(false)
                dispatch(setFetchPageList(true));
                fetchPageInfo(pageInfo?.page_id);
                resolve(`Success`);
              } else {
                // setLoading(false)
                Alert.alert('Error', `Failed to upload ${type}`);
              }
            })
            .catch(error => {
              Alert.alert('Error', `Failed to upload ${type}`);
            })
        : type === 'avatar'
        ? updatePageAvatar(pageId, image)
            .then(data => {
              if (data.api_status == 200) {
                // setLoading(false)
                dispatch(setFetchPageList(true));
                fetchPageInfo(pageInfo?.page_id);
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
            })
        : // reject(`Failed to upload ${type}`)
          Alert.alert('Error', `Failed to upload ${type}`);
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
          // resolve(image.path); // Resolve with the image path
          resolve(submitPhoto(pageInfo?.page_id, type, image.path));
        })
        .catch(error => {
          // reject('Failed to pick an image');
          // Alert.alert('Error', `Failed to pick an image`);
        });
    });
  };

  const onPressAvatar = () => {
    pickImage('avatar');
  };

  const onPressCover = () => {
    pickImage('cover');
  };

  const renderParentItem = ({item}) => (
    <View style={{marginBottom: 0}}>
      <TouchableOpacity activeOpacity={0.9} onPress={() => onPressCover()}>
        <IconPic
          resizeMode={true}
          src={pageInfo?.cover}
          width={'100%'}
          height={200}
        />
      </TouchableOpacity>
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
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onPressAvatar()}>
              <IconPic
                resizeMode={true}
                src={pageInfo?.avatar}
                width={PIXEL.px55}
                height={PIXEL.px55}
                borderRadius={RADIUS.rd25}
              />
            </TouchableOpacity>
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
              <Text
                numberOfLines={1}
                style={
                  darkMode === 'enable' ? styles.DmediumText : styles.mediumText
                }>
                {pageInfo?.likes} People like this.
              </Text>
            </View>
          </View>
          <SizedBox height={PIXEL.px12} />
          <View
            style={{
              flexDirection: 'row',
              width: '90%',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', width: '68%'}}>
              <TouchableOpacity
                style={{width: '38%'}}
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate('PageSetttingMain', {data: pageInfo})
                }>
                <View style={styles.textButonEdit}>
                  <IconPic
                    width={20}
                    height={18}
                    source={IconManager.pencil_line_white}
                  />
                  <SizedBox width={10} />
                  <Text style={styles.buttonEditTextStyle}>{en.edit}</Text>
                </View>
              </TouchableOpacity>
              <SizedBox width={8} />
              <TouchableOpacity
                style={{width: '58%'}}
                onPress={() => {
                  navigation.navigate('MyJobLists', {
                    darkMode,
                    cover: pageInfo?.cover,
                    id: pageData?.page_id,
                  });
                }}>
                <View
                  style={
                    darkMode === 'enable'
                      ? styles.DtextButonCreateJob
                      : styles.textButonCreateJob
                  }>
                  <IconPic
                    width={20}
                    height={20}
                    source={
                      darkMode === 'enable'
                        ? IconManager.job_dark
                        : IconManager.jobs_light
                    }
                  />
                  <SizedBox width={10} />
                  <Text
                    style={
                      darkMode === 'enable'
                        ? styles.DbuttonTextStyle
                        : styles.buttonTextStyle
                    }>
                    Create Job
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{width: '30%'}}
              onPress={() => {
                navigation.navigate('CommingSoon');
              }}>
              <View
                style={
                  darkMode === 'enable'
                    ? styles.DtextButonOffer
                    : styles.textButonOffer
                }>
                <IconPic
                  width={20}
                  height={20}
                  source={
                    darkMode === 'enable'
                      ? IconManager.offer_icon_dark
                      : IconManager.offer_icon_light
                  }
                />
                <SizedBox width={10} />
                <Text
                  style={
                    darkMode === 'enable'
                      ? styles.DbuttonTextStyle
                      : styles.buttonTextStyle
                  }>
                  Offer
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <SizedBox height={PIXEL.px12} />
          <SizedBox height={0.5} width={'90%'} color={COLOR.Grey100} />
          <SizedBox height={SPACING.sm} />
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
            {pageInfo?.post_count !== '' && <SizedBox height={SPACING.sm} />}
            {pageInfo?.post_count !== '' && (
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
                  {pageInfo?.post_count} Posts.
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

      <SizedBox
        height={SPACING.sp12}
        width={'100%'}
        color={darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White50}
      />

      <View>
        <CreatePost
          darkMode={darkMode}
          postType={stringKey.navigateToMyPage}
          userId={myNavigatedId}
          userData={pageInfo}
        />
      </View>

      {/* <SizedBox
        height={SPACING.sp8}
        width={'100%'}
        color={darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White50}
      /> */}

      <View
        style={{
          backgroundColor:
            darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
        }}>
        <PostUserProfile
          darkMode={darkMode}
          postType={stringKey.navigateToMyPage}
          userId={myNavigatedId}
          userData={pageInfo}
          canPost={stringKey.canPost}
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

export default ViewMyPage;

const styles = StyleSheet.create({
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
  textButonOffer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sp8,
    borderRadius: RADIUS.rd8,
    backgroundColor: COLOR.SocialBakcground,
    flex: 1,
  },
  textButonCreateJob: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sp8,
    borderRadius: RADIUS.rd8,
    backgroundColor: COLOR.SocialBakcground,
    flex: 1.5,
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
    paddingBottom: SPACING.sp12,
  },
  DuserInfoHolder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.DarkThemLight,
    paddingBottom: SPACING.sp12,
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
  buttonEditTextStyle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.White100,
  },
  buttonTextStyle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.Grey500,
  },
  DbuttonTextStyle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.White100,
  },
});
