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
  getLikedGroupList,
  getLikedPageList,
  getMyGroupList,
  getMyPageList,
  getRecommentedGroupOrPageList,
  getUserInfoData,
  joinUnjionGroupAction,
  likeUnlineAction,
} from '../../helper/ApiModel';
import PageSimmer from '../PageProfile/PageShimmer';
import {stringKey} from '../../constants/StringKey';
// import { setIsRefreshing, setMyPageList, setIsLoading, setLikePageList, setRecommendedList } from './PageRedux/PageSlice'; // Update the path as needed
import {useDispatch, useSelector} from 'react-redux';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {retrieveStringData, storeKeys} from '../../helper/AsyncStorage';
import {
  setFetchGroupList,
  setMyPagePostList,
} from '../../stores/slices/PostSlice';

const GroupMain = () => {
  const [isRefreshing, setRefreshing] = useState(false);
  const [showAllMyPage, setShowAllMyPage] = useState(false);
  const navigation = useNavigation();
  const [myGroupList, setMyGroupList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [joinedGroupList, setJoinedGroupList] = useState([]);
  const [recommendedList, setRecommendetList] = useState([]);

  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const dispatch = useDispatch();
  const fetchGroupList = useSelector(state => state.PostSlice.fetchGroupList);

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

  const [userInfoData, setUserInfoData] = useState([]);
  const fetchUserInfo = async () => {
    try {
      const userDataResponse = await getUserInfoData();
      setUserInfoData(userDataResponse.user_data);
    } catch (error) {
      fetchUserInfo();
    }
  };
  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    getDarkModeTheme();
  }, []);
  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMyGroup(true);
    fetchLikedGroup();
    fetchRecommendedGroup();
  };

  const handleLoadMore = () => {};

  const fetchMyGroup = isRefresh => {
    !isRefresh && setLoading(true);
    getMyGroupList('my_groups').then(data => {
      if (data.api_status == 200) {
        setMyGroupList(data.data);
        dispatch(setFetchGroupList(false));
        setLoading(false);
        setRefreshing(false);
      } else {
        setLoading(false);
        setRefreshing(false);
      }
    });
  };

  const fetchLikedGroup = () => {
    getLikedGroupList('joined_groups').then(data => {
      if (data.api_status == 200) {
        setJoinedGroupList(data.data);
        setLoading(false);
        setRefreshing(false);
      } else {
        setLoading(false);
        setRefreshing(false);
      }
    });
  };

  const fetchRecommendedGroup = () => {
    getRecommentedGroupOrPageList('groups').then(data => {
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
    fetchMyGroup(false);
    fetchLikedGroup();
    fetchRecommendedGroup();
  }, []);
  useEffect(() => {
    if (fetchGroupList) {
      fetchLikedGroup();
      fetchRecommendedGroup();
      fetchMyGroup(false);
    }
  }, [fetchGroupList]);
  const joinGroup = (item, index) => {
    const updatedList = [...recommendedList];
    if (index >= 0 && index < updatedList.length) {
      joinUnjionGroupAction(item.group_id).then(data => {
        if (data.api_status == 200) {
          if (item.privacy == 2) {
            data.join_status == 'requested'
              ? (updatedList[index].is_group_joined = 2)
              : (updatedList[index].is_group_joined = 0);
            setRecommendetList(updatedList);
            // // Remove the element at the specified index
            // updatedList.splice(index, 1);
            // // Update the state with the new array
            // setRecommendetList(updatedList);
          } else {
            data.join_status == 'joined'
              ? (updatedList[index].is_group_joined = 1)
              : (updatedList[index].is_group_joined = 0);
            setRecommendetList(updatedList);
          }
        } else {
        }
      });
    } else {
      console.error('Invalid index to remove');
    }
  };

  const unjoingroup = (item, index) => {
    const updatedList = [...joinedGroupList];
    if (index >= 0 && index < updatedList.length) {
      joinUnjionGroupAction(item.group_id).then(data => {
        if (data.api_status == 200) {
          data.join_status == 'joined'
            ? (updatedList[index].is_group_joined = 1)
            : (updatedList[index].is_group_joined = 0);
          setJoinedGroupList(updatedList);
        }
      });
    } else {
      console.error('Invalid index to remove');
    }
  };

  const renderMyGroup = ({item, index}) => (
    <TouchableOpacity
      key={index}
      style={{padding: SPACING.xxxxs}}
      activeOpacity={0.7}
      onPress={() => {
        dispatch(setMyPagePostList([]));
        navigation.navigate('ViewMyGroup', {
          pageData: item,
          myNavigatedId: item.group_id,
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
            smallIcon={IconManager.group_line_white}
          />
        </View>
        <View style={{flex: 1, marginLeft: SPACING.sp12}}>
          <Text
            numberOfLines={1}
            style={[
              styles.headerText,
              {color: darkMode === 'enable' && COLOR.White100},
            ]}>
            {item.group_title}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              styles.bodyText,
              {color: darkMode === 'enable' && COLOR.White100},
            ]}>
            {item.category}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderJoinedGroup = ({item, index}) => (
    <TouchableOpacity
      onPress={() => {
        dispatch(setMyPagePostList([]));
        navigation.navigate('ViewJoinedGroup', {
          pageData: item,
          myNavigatedId: item.group_id,
          canPost: stringKey.canPost,
        });
      }}
      activeOpacity={0.8}
      style={styles.rectangleGroup}>
      <Image
        style={[styles.frameChild4, styles.frameChildLayout]}
        resizeMode="cover"
        src={item.cover.trim()}
      />
      <View
        style={[
          styles.frameParent3,
          styles.frameSpaceBlock,
          {
            backgroundColor:
              darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.Blue50,
          },
        ]}>
        <View
          style={[
            styles.instanceParent,
            {
              backgroundColor:
                darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.Blue50,
            },
          ]}>
          <Image
            style={styles.frameItem}
            resizeMode="cover"
            src={item.avatar.trim()}
          />
          <View style={styles.textParent}>
            <Text
              numberOfLines={1}
              style={[
                styles.airStyle,
                {color: darkMode === 'enable' && COLOR.White100},
              ]}>
              {item.group_title}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.gaming,
                styles.textTypo,
                {color: darkMode === 'enable' && COLOR.White100},
              ]}>
              @{item.category}
            </Text>
          </View>
        </View>
        {/* <TouchableOpacity style={[styles.buttonStyle, { borderWidth: 1, borderColor: Color.Primary, backgroundColor: item.is_group_joined == 0 ? Color.Primary : Color.Grey50 }]} onPress={() => unJoinGroup(item, index)} >
                    <Text style={[styles.buttonText, { color: item.is_group_joined == 0 ? Color.Grey50 : Color.Grey500 }]}>{item.is_group_joined == 0 ? 'Join Group' : item.is_group_joined == 2 ? 'Requested' : 'Joined'}</Text>
                </TouchableOpacity> */}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => unjoingroup(item, index)}>
          <View
            style={
              item.is_group_joined == 0
                ? [styles.buttonStyle1]
                : [
                    styles.buttonStyle2,
                    {
                      backgroundColor:
                        darkMode === 'enable'
                          ? COLOR.DarkThemLight
                          : COLOR.Blue50,
                    },
                  ]
            }>
            <Text
              style={[
                item.is_group_joined == 0
                  ? styles.pages1Typo
                  : styles.pages1Typo1,
              ]}>
              {item.is_group_joined == 0
                ? en.joinGroup
                : item.is_group_joined == 2
                ? en.requested
                : en.joined}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderDiscoverGroup = ({item, index}) => (
    <TouchableOpacity
      onPress={() => {
        {
          dispatch(setMyPagePostList([]));
          navigation.navigate('ViewRecommendedGroup', {
            pageData: item,
            myNavigatedId: item.group_id,
            canPost: stringKey.canPost,
          });
        }
      }}
      activeOpacity={0.8}
      style={styles.rectangleGroup}>
      <Image
        style={[styles.frameChild4, styles.frameChildLayout]}
        resizeMode="cover"
        src={item.cover.trim()}
      />
      <View
        style={[
          styles.frameParent3,
          styles.frameSpaceBlock,
          {
            backgroundColor:
              darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.Blue50,
          },
        ]}>
        <View
          style={[
            styles.instanceParent,
            {
              backgroundColor:
                darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.Blue50,
            },
          ]}>
          <Image
            style={styles.frameItem}
            resizeMode="cover"
            src={item.avatar.trim()}
          />
          <View style={styles.textParent}>
            <Text
              numberOfLines={1}
              style={[
                styles.airStyle,
                {color: darkMode === 'enable' && COLOR.White100},
              ]}>
              {item.group_name}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.gaming,
                styles.textTypo,
                {color: darkMode === 'enable' && COLOR.White100},
              ]}>
              @{item.category}
            </Text>
          </View>
        </View>
        {/* <TouchableOpacity style={[styles.buttonStyle, { borderWidth: 1, borderColor: Color.Primary, backgroundColor: item.is_group_joined == 0 ? Color.Primary : Color.Grey50 }]} onPress={() => joinGroup(item, index)}>
                    <Text style={[styles.buttonText, { color: item.is_group_joined == 0 ? Color.Grey50 : Color.Grey500 }]}>{item.is_group_joined == 0 ? 'Join Group' : item.is_group_joined == 2 ? 'Requested' : 'Joined'}</Text>
                </TouchableOpacity> */}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => joinGroup(item, index)}>
          <View
            style={
              item.is_group_joined == 0
                ? [styles.buttonStyle1]
                : [
                    styles.buttonStyle2,
                    {
                      backgroundColor:
                        darkMode === 'enable'
                          ? COLOR.DarkThemLight
                          : COLOR.Blue50,
                    },
                  ]
            }>
            <Text
              style={[
                item.is_group_joined == 0
                  ? [styles.pages1Typo, {}]
                  : [styles.pages1Typo1, {}],
              ]}>
              {item.is_group_joined == 0
                ? en.joinGroup
                : item.is_group_joined == 2
                ? en.requested
                : en.joined}
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
      {userInfoData?.verified === '1' ? (
        <View
          style={[
            styles.cardStyle,
            {
              backgroundColor:
                darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
            },
          ]}>
          <View style={styles.cardSpacing}>
            <View style={styles.headerAndSeeAll}>
              <Text
                style={[
                  styles.titleText,
                  {color: darkMode === 'enable' && COLOR.White100},
                ]}>
                {en.yourGroups}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  dispatch(setMyPagePostList([]));
                  navigation.navigate('MyGroupList');
                }}>
                <Text
                  style={[
                    styles.seeAll,
                    {
                      color:
                        darkMode === 'enable' ? COLOR.White100 : COLOR.Primary,
                    },
                  ]}>
                  {en.seeAll}
                </Text>
              </TouchableOpacity>
            </View>
            {myGroupList.length === 0 ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor:
                    darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White100,
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
                      navigation.navigate('CreateGroup');
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
                        darkMode === 'enable'
                          ? COLOR.DarkFadeLight
                          : COLOR.Blue50,
                      height: PIXEL.px145,
                      width: '62%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: RADIUS.rd15,
                    }}>
                    <IconPic
                      source={
                        darkMode === 'enable'
                          ? IconManager.page_dark
                          : IconManager.page_light
                      }
                    />
                    <Text
                      style={{
                        fontFamily: FontFamily.PoppinRegular,
                        fontSize: fontSizes.size14,
                        color:
                          darkMode === 'enable'
                            ? COLOR.White100
                            : COLOR.Grey300,
                      }}>
                      No Group To Show
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <FlatList
                data={!showAllMyPage && myGroupList.slice(0, 3)}
                showsHorizontalScrollIndicator={false}
                renderItem={renderMyGroup}
                keyExtractor={item => item.id}
                horizontal={false}
              />
            )}
          </View>
        </View>
      ) : null}
      <SizedBox height={PIXEL.px12} />
      <View
        style={[
          styles.cardStyle,
          {
            backgroundColor:
              darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White100,
          },
        ]}>
        <View style={styles.cardSpacing}>
          <View style={styles.headerAndSeeAll}>
            <Text
              style={[
                styles.titleText,
                {color: darkMode === 'enable' && COLOR.White100},
              ]}>
              {en.joinedGroups}
            </Text>
            <TouchableOpacity
              onPress={() => {
                dispatch(setMyPagePostList([]));
                navigation.navigate('JoinedGroupList');
              }}>
              <Text
                style={[
                  styles.seeAll,
                  {
                    color:
                      darkMode === 'enable' ? COLOR.White100 : COLOR.Primary,
                  },
                ]}>
                {en.seeAll}
              </Text>
            </TouchableOpacity>
          </View>
          {joinedGroupList.length === 0 ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor:
                  darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.Grey50,
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
              data={joinedGroupList}
              showsHorizontalScrollIndicator={false}
              renderItem={renderJoinedGroup}
              keyExtractor={item => item.id}
              horizontal={true}
            />
          )}
        </View>
      </View>
      <SizedBox height={PIXEL.px12} />
      <View
        style={[
          styles.cardStyle,
          {
            backgroundColor:
              darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White100,
          },
        ]}>
        <View style={styles.cardSpacing}>
          <View style={styles.headerAndSeeAll}>
            <Text
              style={[
                styles.titleText,
                {color: darkMode === 'enable' && COLOR.White100},
              ]}>
              {en.discoverGroups}
            </Text>
            <TouchableOpacity
              onPress={() => {
                dispatch(setMyPagePostList([]));
                navigation.navigate('RecommendedGroupScreen', {
                  recommendedPageList: recommendedList,
                });
              }}>
              <Text
                style={[
                  styles.seeAll,
                  {
                    color:
                      darkMode === 'enable' ? COLOR.White100 : COLOR.Primary,
                  },
                ]}>
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
                  darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.Grey50,
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
              renderItem={renderDiscoverGroup}
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
      style={{
        backgroundColor:
          darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White100,
        flex: 1,
      }}>
      <ActionAppBar
        appBarText={en.explore_group}
        darkMode={darkMode}
        source={IconManager.back_light}
        backpress={() => {
          navigation.goBack();
        }}
        actionButtonPress={
          userInfoData.verified === '1'
            ? () => navigation.navigate('CreateGroup')
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

export default GroupMain;

const styles = StyleSheet.create({
  bodyText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.Grey300,
  },
  headerText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size19,
    color: COLOR.Grey500,
  },
  seeAll: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.Primary,
  },
  titleText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size19,
    color: COLOR.Grey500,
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
    backgroundColor: COLOR.SocialBakcground,
    alignItems: 'center',
  },
  pages1Typo: {
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
  textParent: {
    height: 42,
    marginLeft: 10,
    width: 101,
    flexWrap: 'wrap',
    flexDirection: 'row',
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
  cardSpacing: {paddingLeft: SPACING.xs, paddingVertical: SPACING.xs},
  headerAndSeeAll: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
    marginBottom: SPACING.xxxs,
  },

  ///////

  DbodyText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.White100,
  },
  DheaderText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size19,
    color: COLOR.White100,
  },
  DseeAll: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.Primary,
  },
  DtitleText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size19,
    color: COLOR.White100,
    flex: 1,
  },
  DmyPageItemCard: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  DiconContainer: {
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
  DtextTypo: {
    fontFamily: FontFamily.PoppinBold,
    textAlign: 'left',
  },
  DframeChildLayout: {
    height: PIXEL.px110,
    width: PIXEL.px150,
  },
  DframeSpaceBlock: {
    padding: SPACING.xxxxs,
    backgroundColor: COLOR.SocialBakcground,
    alignItems: 'center',
  },
  Dpages1Typo: {
    textAlign: 'center',
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.White50,
  },
  Dpages1Typo1: {
    textAlign: 'center',
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Primary,
  },
  DframeItem: {
    width: PIXEL.px30,
    height: PIXEL.px30,
    borderRadius: RADIUS.rd13,
  },
  DairStyle: {
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
    textAlign: 'left',
    color: COLOR.Grey500,
  },
  Dgaming: {
    fontSize: fontSizes.size12,
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Grey300,
    alignItems: 'center',
  },
  DtextParent: {
    height: 42,
    marginLeft: 10,
    width: 101,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  DinstanceParent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Dprimary: {
    color: COLOR.White50,
  },
  DbuttonStyle1: {
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
  DbuttonStyle2: {
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
  DbuttonStyle: {
    marginTop: 10,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLOR.Primary,
    borderRadius: RADIUS.rd12,
  },
  DrectangleGroup: {
    marginRight: SPACING.sm,
    borderWidth: 0.5,
    borderColor: COLOR.Blue50,
    borderRadius: RADIUS.md,
  },
  DframeChild4: {
    borderTopLeftRadius: RADIUS.rd15,
    borderTopRightRadius: RADIUS.rd15,
  },
  DframeParent3: {
    borderBottomRightRadius: RADIUS.rd15,
    borderBottomLeftRadius: RADIUS.rd15,
  },
  DcardStyle: {
    borderWidth: 0,
    borderColor: COLOR.Primary,
    borderRadius: RADIUS.rd8,
    backgroundColor: COLOR.White100,
  },
  DcardSpacing: {paddingLeft: SPACING.xs, paddingVertical: SPACING.xs},
  DheaderAndSeeAll: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
    marginBottom: SPACING.xxxs,
  },
});
