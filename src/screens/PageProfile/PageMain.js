import React, {useEffect, useState} from 'react';
import {
  FlatList,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import IconPic from '../../components/Icon/IconPic';
import PIXEL from '../../constants/PIXEL';
import IconManager from '../../assets/IconManager';
import COLOR from '../../constants/COLOR';
import SizedBox from '../../commonComponent/SizedBox';
import {FontFamily, fontSizes} from '../../constants/FONT';
import RADIUS from '../../constants/RADIUS';
import DualAvater from '../../components/DualAvater';
import SPACING from '../../constants/SPACING';
import en from '../../i18n/en';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import {useNavigation} from '@react-navigation/native';
import {
  getLikedPageList,
  getMyPageList,
  getRecommentedGroupOrPageList,
  getUserInfoData,
  likeUnlineAction,
} from '../../helper/ApiModel';
import PageSimmer from './PageShimmer';
import {stringKey} from '../../constants/StringKey';
import {useDispatch, useSelector} from 'react-redux';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {retrieveStringData, storeKeys} from '../../helper/AsyncStorage';
import {
  setFetchPageList,
  setMyPagePostList,
} from '../../stores/slices/PostSlice';
// import { useSelector, useDispatch } from 'react-redux';
// import { setIsRefreshing, setMyPageList, setIsLoading, setLikePageList, setRecommendedList } from './PageRedux/PageSlice'; // Update the path as needed

const PageMain = ({route}) => {
  const verified = route.params;
  const [isRefreshing, setRefreshing] = useState(false);
  const [showAllMyPage, setShowAllMyPage] = useState(false);
  const navigation = useNavigation();
  const [myPageList, setMyPageList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [likePageList, setLikePageList] = useState([]);
  const [recommendedList, setRecommendetList] = useState([]);
  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const fetchPageList = useSelector(state => state.PostSlice.fetchPageList);
  const dispatch = useDispatch();
  const [userInfoData, setUserInfoData] = useState([]);
  const fetchUserInfo = async () => {
    try {
      const userDataResponse = await getUserInfoData();
      setUserInfoData(userDataResponse.user_data);
      console.log('balance', userDataResponse.user_data.balance);
    } catch (error) {
      fetchUserInfo();
    }
  };
  useEffect(() => {
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

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMyPage(true);
    fetchLikedPage();
    fetchRecommendedPages();
  };

  const handleLoadMore = () => {};

  const fetchMyPage = isRefresh => {
    !isRefresh && setLoading(true);
    getMyPageList('my_pages').then(data => {
      if (data.api_status == 200) {
        setMyPageList(data.data);
        dispatch(setFetchPageList(false));
        setLoading(false);
        setRefreshing(false);
      } else {
        setLoading(false);
        setRefreshing(false);
      }
    });
  };

  const fetchLikedPage = () => {
    getLikedPageList('liked_pages').then(data => {
      if (data.api_status == 200) {
        setLikePageList(data.data);
        setLoading(false);
        setRefreshing(false);
      } else {
        setLoading(false);
        setRefreshing(false);
      }
    });
  };

  const fetchRecommendedPages = () => {
    getRecommentedGroupOrPageList('pages').then(data => {
      if (data.api_status == 200) {
        setLoading(false);
        setRecommendetList(data.data);
        setRefreshing(false);
      } else {
        setLoading(false);
        setRefreshing(false);
      }
    });
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

  useEffect(() => {
    fetchMyPage(false);
    fetchLikedPage();
    fetchRecommendedPages();
  }, []);

  useEffect(() => {
    if (fetchPageList) {
      fetchLikedPage();
      fetchRecommendedPages();
      fetchMyPage(false);
    }
  }, [fetchPageList]);

  const joinpage = (item, index) => {
    const updatedList = [...recommendedList];
    if (index >= 0 && index < updatedList.length) {
      likeUnlineAction(item.page_id).then(data => {
        if (data.api_status == 200) {
          if (data.like_status == 'liked') {
            updatedList[index].is_liked = true;
            setRecommendetList(updatedList);
          } else {
            updatedList[index].is_liked = false;
            setRecommendetList(updatedList);
          }
        } else {
        }
      });
    } else {
      console.error('Invalid index to remove');
    }
  };

  const unjoinpage = (item, index) => {
    const updatedList = [...likePageList];
    if (index >= 0 && index < updatedList.length) {
      likeUnlineAction(item.page_id).then(data => {
        if (data.api_status == 200) {
          if (data.like_status == 'liked') {
            updatedList[index].is_liked = true;
            setLikePageList(updatedList);
          } else {
            updatedList[index].is_liked = false;
            setLikePageList(updatedList);
          }
        } else {
        }
      });
    } else {
      console.error('Invalid index to remove');
    }
  };

  const renderMyPage = ({item, index}) => (
    <TouchableOpacity
      key={index}
      style={{padding: SPACING.xxxxs}}
      activeOpacity={0.7}
      onPress={() => {
        dispatch(setMyPagePostList([]));
        navigation.navigate('ViewMyPage', {
          // pageData: item,
          myNavigatedId: item.page_id,
          canPost: stringKey.canPost,
        });
      }}>
      <View style={styles.myPageItemCard}>
        <View>
          <DualAvater
            largerImageWidth={55}
            largerImageHeight={55}
            src={item.avatar}
            iconBadgeEnable={true}
            smallIcon={IconManager.page_line_white}
          />
        </View>
        <View style={{flex: 1, marginLeft: SPACING.sp12}}>
          <Text
            numberOfLines={1}
            style={
              darkMode === 'enable' ? styles.darkHeaderText : styles.headerText
            }>
            {item.page_title}
          </Text>
          <Text
            numberOfLines={1}
            style={
              darkMode === 'enable' ? styles.darkBodyText : styles.bodyText
            }>
            {item.category}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderLikePage = ({item, index}) => (
    <TouchableOpacity
      onPress={() => {
        dispatch(setMyPagePostList([]));
        navigation.navigate('ViewLikedPage', {
          pageData: item,
          myNavigatedId: item.page_id,
          canPost: stringKey.canPost,
        });
      }}
      activeOpacity={0.8}
      style={styles.rectangleGroup}>
      <Image
        style={[styles.frameChild4, styles.frameChildLayout]}
        resizeMode="cover"
        src={item.cover}
      />
      <View
        style={[
          styles.frameParent3,
          darkMode === 'enable'
            ? styles.darkFrameSpaceBlock
            : styles.frameSpaceBlock,
        ]}>
        <View
          style={[
            styles.instanceParent,
            {
              backgroundColor:
                darkMode == 'enable' ? COLOR.DarkFadeLight : COLOR.Blue50,
            },
          ]}>
          <Image
            style={styles.frameItem}
            resizeMode="cover"
            src={item.avatar}
          />
          <View
            style={[
              styles.textParent,
              {
                backgroundColor:
                  darkMode == 'enable' ? COLOR.DarkFadeLight : COLOR.Blue50,
              },
            ]}>
            <Text
              numberOfLines={1}
              style={
                darkMode === 'enable' ? styles.darkAirStyle : styles.airStyle
              }>
              {item.page_title}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                darkMode === 'enable' ? styles.darkGaming : styles.gaming,
                styles.textTypo,
              ]}>
              @{item.category}
            </Text>
          </View>
        </View>
        {/* <TouchableOpacity style={[styles.buttonStyle, { borderWidth: 1, borderColor: Color.Primary, backgroundColor: item.is_liked ? Color.Grey50 : Color.Primary }]} onPress={() => unjoinpage(item, index)}>
                    <Text style={[styles.buttonText, { color: item.is_liked ? Color.Grey500 : Color.Grey50 }]}>{item.is_liked ? 'Unlike' : 'Like'}</Text>
                </TouchableOpacity> */}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => unjoinpage(item, index)}>
          <View
            style={
              item.is_liked
                ? darkMode === 'enable'
                  ? styles.darkButtonStyle2
                  : styles.buttonStyle2
                : styles.buttonStyle1
            }>
            <Text
              style={[item.is_liked ? styles.pages1Typo1 : styles.pages1Typo]}>
              {item.is_liked ? en.unLike : en.like}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderDiscoverPage = ({item, index}) => (
    <TouchableOpacity
      onPress={() => {
        dispatch(setMyPagePostList([]));
        navigation.navigate('ViewDiscoverPage', {
          pageData: item,
          myNavigatedId: item.page_id,
          canPost: stringKey.canPost,
        });
      }}
      activeOpacity={0.8}
      style={styles.rectangleGroup}>
      <Image
        style={[styles.frameChild4, styles.frameChildLayout]}
        resizeMode="cover"
        src={item.cover}
      />
      <View
        style={[
          styles.frameParent3,
          darkMode === 'enable'
            ? styles.darkFrameSpaceBlock
            : styles.frameSpaceBlock,
        ]}>
        <View
          style={[
            styles.instanceParent,
            {
              backgroundColor:
                darkMode == 'enable' ? COLOR.DarkFadeLight : COLOR.Blue50,
            },
          ]}>
          <Image
            style={styles.frameItem}
            resizeMode="cover"
            src={item.avatar}
          />
          <View
            style={[
              styles.textParent,
              {
                backgroundColor:
                  darkMode == 'enable' ? COLOR.DarkFadeLight : COLOR.Blue50,
              },
            ]}>
            <Text
              numberOfLines={1}
              style={
                darkMode === 'enable' ? styles.darkAirStyle : styles.airStyle
              }>
              {item.page_title}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                darkMode === 'enable' ? styles.darkGaming : styles.gaming,
                styles.textTypo,
              ]}>
              @{item.category}
            </Text>
          </View>
        </View>
        {/* <TouchableOpacity style={[styles.buttonStyle, { borderWidth: 1, borderColor: Color.Primary, backgroundColor: item.is_liked ? Color.Grey50 : Color.Primary }]} onPress={() => joinpage(item, index)}>
                    <Text style={[styles.buttonText, { color: item.is_liked ? Color.Grey500 : Color.Grey50 }]}>{item.is_liked ? 'Unlike' : 'Like'}</Text>
                </TouchableOpacity> */}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => joinpage(item, index)}>
          <View
            style={
              item.is_liked
                ? darkMode === 'enable'
                  ? styles.darkButtonStyle2
                  : styles.buttonStyle2
                : styles.buttonStyle1
            }>
            <Text
              style={[item.is_liked ? styles.pages1Typo1 : styles.pages1Typo]}>
              {item.is_liked ? en.unLike : en.like}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const dummyData = [
    {
      user_id: 1,
      user_name: 'Dummy 1',
    },
    {
      user_id: 2,
      user_name: 'Dummy 2',
    },
  ];

  const renderParentItem = ({item}) => (
    <View style={{}}>
      {userInfoData.verified === '1' ? (
        <View
          style={
            darkMode == 'enable' ? styles.darkCardStyle : styles.cardStyle
          }>
          <View style={styles.cardSpacing}>
            <View style={styles.headerAndSeeAll}>
              <Text
                style={
                  darkMode == 'enable' ? styles.darkTitleText : styles.titleText
                }>
                {en.yourPages}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  dispatch(setMyPagePostList([]));
                  navigation.navigate('MyPageList');
                }}>
                <Text
                  style={
                    darkMode == 'enable' ? styles.darkSeeAll : styles.seeAll
                  }>
                  {en.seeAll}
                </Text>
              </TouchableOpacity>
            </View>
            {myPageList.length === 0 ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor:
                    darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
                  borderRadius: RADIUS.rd8,
                  marginRight: PIXEL.px10,
                  width: '100%',
                  marginVertical: PIXEL.px8,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    width: '100%',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      navigation.navigate('CreatePage');
                    }}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: PIXEL.px145,
                      backgroundColor:
                        darkMode === 'enable'
                          ? COLOR.DarkFadeLight
                          : COLOR.Primary,
                      width: '30%',
                      borderRadius: PIXEL.px15,
                    }}>
                    <IconPic
                      source={IconManager.create_post_line_white}
                      width={PIXEL.px30}
                      height={PIXEL.px30}
                    />
                    <Text
                      style={{
                        fontFamily: FontFamily.PoppinRegular,
                        fontSize: fontSizes.size14,
                        color: COLOR.White100,
                      }}>
                      Create
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      marginLeft: PIXEL.px12,
                      backgroundColor:
                        darkMode == 'enable'
                          ? COLOR.DarkThemLight
                          : COLOR.Blue50,
                      height: PIXEL.px145,
                      width: '62%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: RADIUS.rd15,
                    }}>
                    <IconPic
                      source={
                        darkMode == 'enable'
                          ? IconManager.page_dark
                          : IconManager.page_light
                      }
                    />
                    <Text
                      style={{
                        fontFamily: FontFamily.PoppinRegular,
                        fontSize: fontSizes.size14,
                        color:
                          darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500,
                      }}>
                      No Page To Show
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <FlatList
                data={!showAllMyPage && myPageList.slice(0, 3)}
                showsHorizontalScrollIndicator={false}
                renderItem={renderMyPage}
                keyExtractor={item => item.id}
                horizontal={false}
              />
            )}
          </View>
        </View>
      ) : null}
      <SizedBox height={PIXEL.px12} />
      <View
        style={darkMode == 'enable' ? styles.darkCardStyle : styles.cardStyle}>
        <View style={styles.cardSpacing}>
          <View style={styles.headerAndSeeAll}>
            <Text
              style={
                darkMode == 'enable' ? styles.darkTitleText : styles.titleText
              }>
              {en.likedPages}
            </Text>
            <TouchableOpacity
              onPress={() => {
                dispatch(setMyPagePostList([]));
                navigation.navigate('LikePageList');
              }}>
              <Text
                style={
                  darkMode == 'enable' ? styles.darkSeeAll : styles.seeAll
                }>
                {en.seeAll}
              </Text>
            </TouchableOpacity>
          </View>
          {likePageList.length === 0 ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor:
                  darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.Blue50,
                borderRadius: RADIUS.rd8,
                marginRight: PIXEL.px10,
              }}>
              <View style={{paddingVertical: PIXEL.px30}}>
                <IconPic
                  source={IconManager.empty_sad}
                  width={PIXEL.px110}
                  height={PIXEL.px80}
                />
              </View>
            </View>
          ) : (
            <FlatList
              data={likePageList}
              showsHorizontalScrollIndicator={false}
              renderItem={renderLikePage}
              keyExtractor={item => item.id}
              horizontal={true}
            />
          )}
        </View>
      </View>
      <SizedBox height={PIXEL.px12} />
      <View
        style={darkMode == 'enable' ? styles.darkCardStyle : styles.cardStyle}>
        <View style={styles.cardSpacing}>
          <View style={styles.headerAndSeeAll}>
            <Text
              style={
                darkMode == 'enable' ? styles.darkTitleText : styles.titleText
              }>
              {en.discoverPages}
            </Text>
            <TouchableOpacity
              onPress={() => {
                dispatch(setMyPagePostList([]));
                navigation.navigate('RecommendedPageScreen', {
                  recommendedPageList: recommendedList,
                });
              }}>
              <Text
                style={
                  darkMode == 'enable' ? styles.darkSeeAll : styles.seeAll
                }>
                {en.seeAll}
              </Text>
            </TouchableOpacity>
          </View>
          {recommendedList.length === 0 ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor:
                  darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.Grey50,
                borderRadius: RADIUS.rd8,
                marginRight: PIXEL.px10,
              }}>
              <View style={{paddingVertical: PIXEL.px30}}>
                <IconPic
                  source={IconManager.empty_sad}
                  width={PIXEL.px110}
                  height={PIXEL.px80}
                />
              </View>
            </View>
          ) : (
            <FlatList
              data={recommendedList}
              showsHorizontalScrollIndicator={false}
              renderItem={renderDiscoverPage}
              keyExtractor={item => item.id}
              // onRefresh={handleRefresh}
              refreshing={isRefreshing}
              horizontal={true}
              // onEndReached={handleLoadMore}
              // onEndReachedThreshold={0.5}
              // ListFooterComponent={() => (
              //     <View style={{ paddingVertical: 20 }}>
              //         <ActivityIndicator size="small" color={COLOR.Primary} />
              //     </View>
              // )}
            />
          )}
        </View>
      </View>
      <SizedBox height={PIXEL.px12} />
    </View>
  );

  return (
    <SafeAreaView
      style={
        darkMode == 'enable' ? styles.darkSafeAraView : styles.safeAraView
      }>
      <ActionAppBar
        appBarText={en.page}
        darkMode={darkMode === 'enable' ? 'enable' : null}
        source={IconManager.back_light}
        backpress={() => {
          navigation.goBack();
        }}
        // Conditionally render the action button if the user is verified
        actionButtonPress={
          userInfoData.verified === '1'
            ? () => {
                navigation.navigate('CreatePage');
              }
            : null
        }
        actionButtonText={userInfoData.verified === '1' ? en.create : null}
        actionButtonType={userInfoData.verified === '1' ? 'text-button' : null}
      />

      <SizedBox height={PIXEL.px12} />
      {isLoading ? (
        <PageSimmer darkMode={darkMode} />
      ) : (
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
      )}
    </SafeAreaView>
  );
};

export default PageMain;

const styles = StyleSheet.create({
  safeAraView: {backgroundColor: COLOR.White100, flex: 1},
  darkSafeAraView: {backgroundColor: COLOR.DarkTheme, flex: 1},
  bodyText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    color: COLOR.Grey300,
  },
  headerText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size15,
    color: COLOR.Grey500,
  },
  seeAll: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.Primary,
  },
  titleText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size19,
    color: COLOR.Grey500,
    flex: 1,
  },

  darkBodyText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    color: COLOR.White100,
  },
  darkHeaderText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size15,
    color: COLOR.White100,
  },
  darkSeeAll: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.White100,
  },
  darkTitleText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size19,
    color: COLOR.White100,
    flex: 1,
  },
  myPageItemCard: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 10,
    width: PIXEL.px50,
    height: PIXEL.px50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure the icon is above other content
  },
  textTypo: {
    fontFamily: FontFamily.PoppinBold,
    textAlign: 'left',
  },
  frameChildLayout: {
    height: PIXEL.px110,
    width: PIXEL.px150,
  },
  frameSpaceBlock: {
    padding: SPACING.xxxxs,
    backgroundColor: COLOR.Blue50,
    alignItems: 'center',
  },
  darkFrameSpaceBlock: {
    padding: SPACING.xxxxs,
    backgroundColor: COLOR.DarkFadeLight,
    alignItems: 'center',
  },
  pages1Typo: {
    textAlign: 'center',
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.White50,
  },
  darkPages1Typo: {
    textAlign: 'center',
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.White50,
  },
  pages1Typo1: {
    textAlign: 'center',
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Primary,
  },
  darkPages1Typo1: {
    textAlign: 'center',
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Primary,
  },
  frameItem: {
    width: PIXEL.px30,
    height: PIXEL.px30,
    borderRadius: RADIUS.rd13,
  },
  airStyle: {
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
    textAlign: 'left',
    color: COLOR.Grey500,
  },
  gaming: {
    fontSize: fontSizes.size12,
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Grey300,
    alignItems: 'center',
  },
  darkAirStyle: {
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
    textAlign: 'left',
    color: COLOR.White100,
  },
  darkGaming: {
    fontSize: fontSizes.size12,
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.White100,
    alignItems: 'center',
  },
  textParent: {
    height: 50,
    // marginLeft: 10,
    width: 101,
    flexWrap: 'wrap',
    flexDirection: 'row',
    backgroundColor: COLOR.Blue50,
  },
  instanceParent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.Blue50,
  },
  primary: {
    color: COLOR.White50,
  },
  buttonStyle1: {
    borderRadius: RADIUS.rd10,
    backgroundColor: COLOR.Primary,
    width: PIXEL.px140,
    height: PIXEL.px35,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: COLOR.Primary,
    borderWidth: 1,
  },
  darkButtonStyle1: {
    borderRadius: RADIUS.rd10,
    backgroundColor: COLOR.Primary,
    width: PIXEL.px140,
    height: PIXEL.px35,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: COLOR.Primary,
    borderWidth: 1,
  },
  buttonStyle2: {
    borderRadius: RADIUS.rd10,
    backgroundColor: COLOR.Blue50,
    width: PIXEL.px140,
    height: PIXEL.px35,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: COLOR.Primary,
    borderWidth: 1,
  },
  darkButtonStyle2: {
    borderRadius: RADIUS.rd10,
    backgroundColor: COLOR.DarkFadeLight,
    width: PIXEL.px140,
    height: PIXEL.px35,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: COLOR.Primary,
    borderWidth: 1,
  },
  buttonStyle: {
    marginTop: 10,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLOR.Primary,
    borderRadius: RADIUS.rd12,
  },
  rectangleGroup: {
    marginRight: SPACING.sm,
    borderWidth: 0,
    borderColor: COLOR.Blue50,
    borderRadius: RADIUS.md,
  },
  frameChild4: {
    borderTopLeftRadius: RADIUS.rd15,
    borderTopRightRadius: RADIUS.rd15,
  },
  frameParent3: {
    borderBottomRightRadius: RADIUS.rd15,
    borderBottomLeftRadius: RADIUS.rd15,
  },
  cardStyle: {
    borderWidth: 0,
    borderColor: COLOR.Primary,
    borderRadius: RADIUS.rd8,
    backgroundColor: COLOR.White100,
  },
  darkCardStyle: {
    borderWidth: 0,
    borderColor: COLOR.Primary,
    borderRadius: RADIUS.rd8,
    backgroundColor: COLOR.DarkThemLight,
  },
  cardSpacing: {paddingLeft: SPACING.xs, paddingVertical: SPACING.xs},
  headerAndSeeAll: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
    marginBottom: SPACING.xxxs,
  },
});
