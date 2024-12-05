import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Image,
  Dimensions,
  FlatList,
  RefreshControl,
} from 'react-native';
import React from 'react';
import COLOR from '../constants/COLOR';
import {clearData, storeKeys} from '../helper/AsyncStorage';
import {StatusBar} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import assets from '../assets/IconManager';
import {useIsFocused} from '@react-navigation/native';
import {useState, useMemo, useEffect} from 'react';
import {FontFamily, fontSizes, fontWeight} from '../constants/FONT';
import RADIUS from '../constants/RADIUS';
import SPACING from '../constants/SPACING';
import DualAvater from '../components/DualAvater';
import {calculateTimeDifference} from '../helper/Formatter';
import AppLoading from '../commonComponent/Loading';
import {ActivityIndicator} from 'react-native';

import {
  getNotificationList,
  getFriBirthdayList,
  getActivitiesList,
  getFriendRequestList,
} from '../helper/ApiModel';
import {useDispatch, useSelector} from 'react-redux';
import {setFetchDarkMode} from '../stores/slices/DarkModeSlice';
import {TabView, SceneMap} from 'react-native-tab-view';
import {ScrollView} from 'react-native';
import SizedBox from '../commonComponent/SizedBox';
import PIXEL from '../constants/PIXEL';
import i18n from '../i18n';
import {retrieveStringData} from '../helper/AsyncStorage';
import PageSimmer from './PageProfile/PageShimmer';
import ListShimmer from './GroupProfile/ListShimmer';
import PageItemListShimmer from './PageProfile/PageItemsListShimmer';
import RecommendedPageScreenShimmer from './PageProfile/RecommendedPageScreenShimmer';
import IconManager from '../assets/IconManager';
import PostShimmer from '../components/Post/PostShimmer';
import Notishimmer from './Notishimmer';
import {setIsLoading} from '../stores/slices/PageSlice';
import FriendRequestShimmer from './FriendRequestShimmer';
import {setFetchFriendRequest} from '../stores/slices/NotificationSlice';
import IconPic from '../components/Icon/IconPic';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import {useWindowDimensions} from 'react-native';
import { stringKey } from '../constants/StringKey';
const Notification = () => {
  const layout = useWindowDimensions();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [NotificationData, setNotificationData] = useState('');
  const [NotificationRequestData, setNotificationRequestData] = useState([]);
  const [ActivityData, setActivityData] = useState('');
  const [FriBirthdayData, setFriBirthdayData] = useState('');
  const [loadingNotification, setLoadingNotification] = useState(true);
  const [loadingRequestNotification, setLoadingRequestNotification] =
    useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [loadingFriBirthday, setLoadingFriBirthday] = useState(true);
  const [index, setIndex] = useState(0);
  const [notiCount, setNotiCount] = useState(0);
  const [darkMode, setDarkMode] = useState(null);
  const [isloading, setIsLoading] = useState(true);
  const [shimmer, setShimmer] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const fetchFriendRequest = useSelector(
    state => state.NotificationSlice.fetchFriendRequest,
  );

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

  useEffect(() => {
    setShimmer(false);
  }, []);

  //   useEffect(() => {
  //   const timer = setTimeout(() => {
  //     fetchFriendRequests();
  //   }, 7000);

  //   return () => clearTimeout(timer); // Cleanup the timer on component unmount or dependency change
  // }, [isFocused]);

  const getActivityData = () => {
    getActivitiesList().then(data => {
   
      if (data.api_status === 200 && data.activities !== ActivityData) {
        setActivityData(data.activities);
       
        setLoadingActivity(false);
      } else {
        setLoadingActivity(true);
      }
    });
  };
  const getFriBirthdayData = () => {
    getFriBirthdayList().then(data => {
      if (data.api_status === 200 && data.data !== FriBirthdayData) {
        setFriBirthdayData(data.data);
        setLoadingFriBirthday(false);
      } else {
        setLoadingFriBirthday(true);
      }
    });
  };
  const getGeneralData = () => {
    getNotificationList().then(data => {
      if (data.api_status === 200 && data.notifications !== NotificationData) {
        setNotificationData(data.notifications);
   
        
        setLoadingNotification(false);
      } else {
        setLoadingNotification(true);
      }
    });
  };

  useEffect(() => {
    if (isFocused) {
      getGeneralData();
      getActivityData();
      getFriBirthdayData();
      refreshData();
    }
  }, [isFocused]);

  useEffect(() => {
    if (fetchFriendRequest) {
      refreshData();
    }
  }, [fetchFriendRequest]);

  const refreshData = () => {
    // setRefreshing(true);
    getFriendRequestList()
      .then(data => {
        if (data.api_status === 200) {
          setNotificationRequestData(data.friend_requests || []);
          setNotiCount(data.new_friend_requests_count || 0);
        }
       
        setLoadingRequestNotification(false);
        setRefreshing(false);
        dispatch(setFetchFriendRequest(false));
      })
      .catch(error => {
        console.error('Error fetching friend requests:', error);
        setLoadingRequestNotification(false);
        setRefreshing(false);
      });
  };

  const handleRefresh = () => {
    setRefreshing(true); // Set refreshing state to true
    refreshData(); // Fetch friend requests again
  };

  const navigateToNotiDetail = (item) => {
    // console.log(item.type);

    // Need to update later 'type' are (gift,added_u_as,poke)
    
      if(item.type === 'liked_page' || item.type === 'page_admin'){
        navigation.navigate('ViewMyPage', { myNavigatedId : item.page_id})
      }else if(item.type === 'invited_page' ){
        navigation.navigate('ViewDiscoverPage', {pageData: {page_id : item.page_id} , myNavigatedId : item.page_id})
      }else if(item.type === 'subscribed_to_you' || item.type === 'sent_u_money' || (item.type === 'admin_notification' && item.post_id == "0")){
        navigation.navigate('Wallet', {
          myNavigatedId: item.recipient_id,
          canPost: stringKey.canPost,
          backDisable: 'enable',
        })
      }else if(item.type === 'joined_group' || item.type === 'group_admin'){
        navigation.navigate('ViewMyGroup', {
          pageData: {group_id : item.group_id},
          myNavigatedId: item.group_id,
          canPost: stringKey.canPost,
        })
    
      }else if(item.type === 'added_you_to_group'){
        navigation.navigate('ViewRecommendedGroup', {
          pageData: item,
          myNavigatedId: item.group_id,
          canPost: stringKey.canPost,
        });
      // {
      //   added_you_to_group
      // }
      }else if(item.type === 'new_orders'){
        navigation.navigate('OrderedList', {darkMode: darkMode});
      }else if(item.type === 'comment' ||
         item.type === 'shared_your_post' || 
         item.type === 'reaction' || 
         item.type === 'comment_mention' || 
         item.type === 'post_mention' || 
         (item.type === 'admin_notification' && item.post_id != "0")
        ){
        navigation.navigate('PostDetail', {
          postId: item.post_id,
          darkMode: darkMode,
        });
      }else if(item.type === 'friends_request'){
          navigation.navigate('Home')
      }else if(item.type === 'invited_event'){
        navigation.navigate('EventDetail', { eventId: item.event_id })
      }
      
  }

  const [routes] = useState([
    {
      key: 'all',
      title: 'All',
      colorId: COLOR.White100,
      iconColorID: COLOR.White100,
    },
    {
      key: 'last_activities',
      title: 'Last Activities',
      colorId: COLOR.Primary,
      iconColorID: COLOR.Primary,
    },
    {
      key: 'friends_birthday',
      title: 'Friends Birthday',
      colorId: COLOR.Primary,
      iconColorID: COLOR.Primary,
    },
  ]);

  const NotificationEmpty = () => {
    const [loading, setLoading] = useState(false);

    // Get screen dimensions
    const {width} = Dimensions.get('window');

    // Calculate the icon size
    const iconSize = width * 0.5;

    return (
      <View
        style={{
          flex: 1,
          // justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}>
        {/* <IconPic width={iconSize} height={iconSize} source={IconManager.notificationEmpty_light} /> */}
        <Image
          resizeMode="contain"
          style={{
            width: WINDOW_WIDTH - 80,
            height: undefined,
            aspectRatio: 1,
            marginTop: '15%',
          }}
          source={
            darkMode == 'enable'
              ? assets.notificationEmpty_dark
              : assets.notificationEmpty_light
          }
        />
        <SizedBox height={PIXEL.px20} />
        <Text
          style={{
            fontFamily: FontFamily.PoppinSemiBold,
            fontSize: fontSizes.size23,
            color: darkMode == 'enable' ? COLOR.White : COLOR.Grey500,
            fontWeight: fontWeight.weight700,
          }}>
          {i18n.t(`translation:no_notification`)}
        </Text>
        <SizedBox height={PIXEL.px8} />
        <Text
          style={{
            textAlign: 'center',
            marginHorizontal: SPACING.sp24,
            fontFamily: FontFamily.PoppinRegular,
            fontSize: fontSizes.size15,
            color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500,
          }}>
          {i18n.t(`translation:stay_tune`)}
        </Text>
        <SizedBox height={PIXEL.px30} />
      </View>
    );
  };
  // const _handleIndexChange = selectedIndex => setIndex(selectedIndex);
  const _handleIndexChange = selectedIndex => {
    setIndex(selectedIndex);

    const baseColor = darkMode == 'enable' ? COLOR.Primary : COLOR.Grey500;
    const baseIconColor = COLOR.Primary;

    routes.forEach((route, index) => {
      route.colorId = index === selectedIndex ? COLOR.White100 : baseColor;
      route.iconColorID =
        index === selectedIndex ? COLOR.White100 : baseIconColor;
    });
  };

  const _renderTabBar = props => {
    const inputRange = props.navigationState.routes.map((x, i) => i);

    return (
      <View style={styles.tabBar}>
        <ScrollView
          style={{borderBottomWidth: 0.3, borderColor: COLOR.Grey100}}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal={true}>
          {props.navigationState.routes.map((route, i) => {
            // const backgroundColor = props.position.interpolate({
            //   inputRange,
            //   outputRange: inputRange.map(inputIndex =>
            //     inputIndex === i ?  COLOR.Primary : COLOR.Blue50
            //   ),
            // });

            // const textColor =
            //   darkMode == 'enable' ? COLOR.White : COLOR.Grey400;

            const opacity = props.position.interpolate({
              inputRange,
              outputRange: inputRange.map(inputIndex =>
                inputIndex === i ? 1 : 2,
              ),
            });
            const backgroundColor = props.position.interpolate({
              inputRange,
              outputRange: inputRange.map(inputIndex =>
                inputIndex === i
                  ? COLOR.Primary
                  : darkMode === 'enable'
                  ? COLOR.DarkFadeLight
                  : COLOR.Blue50,
              ),
            });

            return (
              <TouchableOpacity
                activeOpacity={opacity}
                style={[
                  styles.tabItem,
                  {
                    backgroundColor: backgroundColor,
                    borderRadius: RADIUS.rd100,
                    marginHorizontal: SPACING.sp8,
                    marginVertical: SPACING.sp10,
                    minWidth: 68,
                  },
                ]}
                onPress={() => {
                  _handleIndexChange(i);
                  // props.jumpTo(route.key);
                }}
                key={route.key}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Animated.Text
                      style={{
                        textAlign: 'center',
                        fontSize: fontSizes.size15,
                        color: routes[i].colorId,
                        fontFamily: FontFamily.PoppinRegular,
                        paddingHorizontal: SPACING.sp25,
                      }}>
                      {route.title}
                    </Animated.Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const _renderScene = useMemo(
    () =>
      SceneMap({
        all: () => (
          <View style={{flex: 1}}>
            {loadingNotification ? (
              <PostShimmer darkMode={darkMode} />
            ) : (
              <View style={{flex: 1}}>
                {NotificationData.length > 0 ? (
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}>
                    {NotificationData.map((item, index) => (
                      <View
                        style={{
                          paddingHorizontal: SPACING.sp20,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        key={index}>
                        <View
                          style={{
                            borderRadius: RADIUS.rd8,
                            flexDirection: 'row',
                            width: '100%',
                            borderBottomColor:
                              darkMode == 'enable'
                                ? COLOR.Grey400
                                : COLOR.Grey50,
                            borderBottomWidth: 1,
                            paddingVertical: SPACING.sp16,
                          }}>
                          <View
                            style={{
                              width: '100%',
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <TouchableOpacity
                              activeOpacity={0.5}
                              style={{
                                flexDirection: 'row',
                                flex: 1,
                                alignSelf: 'center',
                                justifyContent: 'center',
                              }}
                              onPress={ () => navigateToNotiDetail(item)
                              //   item.page_id != "0" ? 
                              //  () => navigation.navigate('ViewMyPage', {pageData: {page_id : item.page_id}}) : null
                              }
                              >
                              <View
                                style={{
                                  width: '100%',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                {item.type === 'admin_notification' ? (
                                  <DualAvater
                                    largerImageWidth={55}
                                    largerImageHeight={55}
                                    source={IconManager.logo_light}
                                    iconBadgeEnable={true}
                                    isIconColor={true}
                                    isActive={true}
                                  />
                                ) : (
                                  <DualAvater
                                    largerImageWidth={55}
                                    largerImageHeight={55}
                                    src={item.notifier.avatar}
                                    iconBadgeEnable={true}
                                    isIconColor={true}
                                    isActive={true}
                                    smallIcon={
                                      assets[item.icon.replace('-', '')]
                                    }
                                  />
                                )}

                                <View
                                  style={{
                                    flex: 1,
                                    marginLeft: SPACING.sp10,
                                    // alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      // alignSelf:'center',
                                      justifyContent: 'center',
                                    }}>
                                    {item.type === 'admin_notification' ? (
                                      <Text
                                        style={
                                          darkMode == 'enable'
                                            ? styles.DarkThemeHeaderText
                                            : styles.headerText
                                        }>
                                        {' '}
                                        {item.text}
                                      </Text>
                                    ) : (
                                      <Text
                                        style={
                                          darkMode == 'enable'
                                            ? styles.DarkThemeHeaderText
                                            : styles.headerText
                                        }>
                                        
                                        {item.notifier.name} {''}
                                        {item.type === 'friends_request'
                                          ? 'sent you a friend request'
                                          : item.type_text}
                                      </Text>
                                    )}
                                  </View>
                                  <Text
                                    numberOfLines={1}
                                    style={
                                      darkMode == 'enable'
                                        ? styles.DarkThemebodyText
                                        : styles.bodyText
                                    }>
                                    {calculateTimeDifference(item.time)}
                                  </Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                ) : (
                  <NotificationEmpty />
                )}
              </View>
            )}
          </View>
        ),
        last_activities: () => (
          <View style={{flex: 1}}>
            {loadingActivity ? (
              <Notishimmer darkMode={darkMode} />
            ) : (
              <View style={{flex: 1, paddingHorizontal: SPACING.sp15}}>
                {ActivityData?.length > 0 ? (
                  <FlatList
                    data={ActivityData}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item, index}) => (
                      <View style={{paddingHorizontal: 10}} key={index}>
                        <View
                          style={{
                            borderRadius: 8,
                            flexDirection: 'row',
                            width: '100%',
                            borderBottomColor:
                              darkMode == 'enable'
                                ? COLOR.Grey400
                                : COLOR.Grey50,
                            borderBottomWidth: 1,
                            paddingVertical: 16,
                          }}>
                          <View
                            style={{
                              width: '100%',
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <TouchableOpacity
                              activeOpacity={0.5}
                              style={{
                                flexDirection: 'row',
                                flex: 1,
                                alignItems: 'center',
                              }}>
                              <DualAvater
                                largerImageWidth={55}
                                largerImageHeight={55}
                                src={item.activator.avatar}
                                iconBadgeEnable={true}
                                // isIconColor={true}
                                isActive={true}
                              />
                              <View
                                style={{
                                  flex: 1,
                                  marginLeft: SPACING.sp10,
                                  paddingVertical: SPACING.sp5,
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <Text
                                    style={
                                      darkMode == 'enable'
                                        ? styles.DarkThemeHeaderText
                                        : styles.headerText
                                    }>
                                    {item.activity_text}
                                  </Text>
                                </View>
                                <Text
                                  numberOfLines={1}
                                  style={
                                    darkMode == 'enable'
                                      ? styles.DarkThemebodyText
                                      : styles.bodyText
                                  }>
                                  {calculateTimeDifference(item.time)}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    )}
                  />
                ) : (
                  <NotificationEmpty />
                )}
              </View>
            )}
          </View>
        ),
        friends_birthday: () => (
          <View style={{flex: 1}}>
            {loadingFriBirthday ? (
              <Notishimmer darkMode={darkMode} />
            ) : (
              <View style={{flex: 1}}>
                {FriBirthdayData > 0 ? (
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}>
                    <View style={{paddingHorizontal: 16}}>
                      <View
                        style={{
                          borderBottomColor: COLOR.Grey50,
                          borderBottomWidth: 1,
                          paddingVertical: SPACING.sp10,
                        }}>
                        <Text style={{fontSize: 15}}>
                          {i18n.t(`translation:today`)}
                        </Text>
                      </View>
                      {FriBirthdayData.map((item, index) => (
                        <View
                          style={{
                            borderRadius: RADIUS.rd8,
                            flexDirection: 'row',
                            width: '100%',
                            borderBottomColor: COLOR.Grey50,
                            borderBottomWidth: 1,
                            paddingVertical: SPACING.sp16,
                          }}
                          key={index}>
                          <View
                            style={{
                              width: '100%',
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <TouchableOpacity
                              activeOpacity={0.5}
                              style={{
                                flexDirection: 'row',
                                flex: 1,
                                alignItems: 'center',
                              }}>
                              <DualAvater
                                largerImageWidth={45}
                                largerImageHeight={45}
                                src={item.avatar}
                                // source={IconManager.notificationDefaultImg}
                                isIconColor={true}
                                isActive={true}
                              />
                              <View
                                style={{
                                  flex: 1,
                                  marginHorizontal: SPACING.sp10,
                                }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <Text
                                    style={styles.headerText}
                                    numberOfLines={1}>
                                    {item.first_name} {item.last_name}
                                  </Text>
                                </View>
                                <Text
                                  numberOfLines={1}
                                  style={
                                    darkMode == 'enable'
                                      ? styles.DarkThemebodyText
                                      : styles.bodyText
                                  }>
                                  {formatBirthday(item.birthday)}
                                </Text>
                              </View>
                              <View>
                                <TouchableOpacity activeOpacity={0.5}>
                                  <Icon
                                    width={40}
                                    height={36}
                                    source={IconManager.messageImg}
                                  />
                                </TouchableOpacity>
                              </View>
                              <View>
                                <TouchableOpacity
                                  activeOpacity={0.5}
                                  style={[
                                    styles.tabItem,
                                    {
                                      backgroundColor: COLOR.Primary,
                                      borderRadius: RADIUS.rd100,
                                      marginHorizontal: 16,
                                      width: 77,
                                      height: 34,
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    },
                                  ]}>
                                  <View>
                                    {/* <Icon
                                      width={16}
                                      height={16}
                                      source={IconManager.postImg}
                                    /> */}
                                    <Image
                                      style={{width: 16, height: 16}}
                                      source={assets.postImg_light}
                                    />
                                  </View>
                                  <View style={{marginLeft: SPACING.sp8}}>
                                    <Animated.Text style={{color: COLOR.White}}>
                                      {i18n.t(`translation:post`)}
                                    </Animated.Text>
                                  </View>
                                </TouchableOpacity>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                ) : (
                  <NotificationEmpty />
              
                )}
              </View>
            )}
          </View>               
        ),
      }),
    [
      loadingNotification,
      setLoadingNotification,
      NotificationData,
      loadingActivity,
      setLoadingActivity,
      ActivityData,
      loadingFriBirthday,
      setLoadingFriBirthday,
      FriBirthdayData,
    ],
  );

  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);

  return (
    <SafeAreaView
      style={
        darkMode == 'enable' ? styles.DarkThemecontainer : styles.container
      }>
      <View
        style={
          darkMode == 'enable' ? styles.DarkThemecontainer : styles.container
        }>
        <StatusBar animated={true} backgroundColor={COLOR.Primary} />

        <ImageBackground
          source={assets.notificationBg_light}
          resizeMode="cover"
          style={styles.image}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }>
            <View style={styles.overlay}>
              <View style={styles.content}>
                <Text style={styles.heading}>
                  {i18n.t(`translation:announcement`)}
                </Text>
                <Text style={styles.paragraph}>
                  {i18n.t(`translation:inform`)}
                </Text>
                <TouchableOpacity style={styles.button} onPress={() => {}}>
                  <Text style={styles.buttonText}>
                    {i18n.t(`translation:open`)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
        {NotificationRequestData.length > 0 ? (
          loadingRequestNotification ? (
            <FriendRequestShimmer />
          ) : (
            <TouchableOpacity
              style={{
                height: '12%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: RADIUS.rd8,
                width: '100%',
                borderBottomColor:
                  darkMode == 'enable' ? COLOR.Grey400 : COLOR.Grey50,
                borderBottomWidth: 1,
                paddingVertical: SPACING.sp16,
                paddingHorizontal: SPACING.sp10,
              }}
              onPress={() => navigation.navigate('FriendRequest')}>
              <View style={{flex: 0.8, flexDirection: 'row'}}>
                <View>
                  <DualAvater
                    largerImageWidth={55}
                    largerImageHeight={55}
                    src={NotificationRequestData[0].avatar || ''}
                    iconBadgeEnable={true}
                  />
                </View>
                <View
                  style={{
                    marginHorizontal: SPACING.sp10,
                    justifyContent: 'center',
                    paddingVertical: SPACING.sp5,
                  }}>
                  <Text
                    style={
                      darkMode === 'enable'
                        ? styles.DarkThemeHeaderText
                        : styles.headerText
                    }>
                    {i18n.t('translation:friend_request')}
                  </Text>
                  {NotificationRequestData.length > 1 ? (
                    <Text
                      numberOfLines={1}
                      style={
                        darkMode === 'enable'
                          ? styles.DarkThemebodyText
                          : styles.bodyText
                      }>
                      {`${NotificationRequestData[0].first_name} ${
                        NotificationRequestData[0].last_name
                      } and ${NotificationRequestData.length - 1} others`}
                    </Text>
                  ) : (
                    <Text
                      numberOfLines={1}
                      style={
                        darkMode === 'enable'
                          ? styles.DarkThemebodyText
                          : styles.bodyText
                      }>
                      {`${NotificationRequestData[0].first_name} ${NotificationRequestData[0].last_name}`}
                    </Text>
                  )}
                </View>
              </View>
              <View
                style={{
                  flex: 0.2,
                  justifyContent: 'center',
                  width: '20%',
                  alignItems: 'center',
                }}>
                {notiCount > 0 && (
                  <View
                    style={{
                      backgroundColor: COLOR.Primary,
                      width: 30,
                      height: 30,
                      borderRadius: RADIUS.rd15,
                      justifyContent: 'center',
                    }}>
                    <Text style={{textAlign: 'center', color: COLOR.White}}>
                      {notiCount}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )
        ) : null}
        <View style={{flex: 4.5}}>
          <TabView
            navigationState={{index, routes}}
            renderScene={_renderScene}
            renderTabBar={_renderTabBar}
            onIndexChange={_handleIndexChange}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
    // justifyContent: 'center',
    // alignItems: 'center',
    // width: '100%',
  },
  DarkThemecontainer: {
    flex: 1,
    backgroundColor: COLOR.DarkTheme,
    // justifyContent: 'center',
    // alignItems: 'center',
    // width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: COLOR.White100,
  },
  darkContainer: {
    flex: 1,
    backgroundColor: COLOR.DarkTheme,
  },
  image: {
    flex: 1.5,
    width: '100%',
  },
  overlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align content to the right
  },
  content: {
    fontFamily: FontFamily.PoppinRegular,
    // padding: 20,
    fontSize: fontSizes.size12,
    paddingVertical: SPACING.sp15,
    width: '47%', // Adjusted width as needed
  },
  heading: {
    fontSize: fontSizes.size19,
    fontFamily: 'Poppins-SemiBold',
    color: COLOR.White,
  },
  paragraph: {
    fontSize: fontSizes.size15,
    marginBottom: SPACING.sp10,
    color: COLOR.White,
  },
  button: {
    width: PIXEL.px65,
    height: PIXEL.px25,
    backgroundColor: COLOR.White100, // Set the button background color
    borderRadius: RADIUS.rd4,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: fontSizes.size12,
    paddingVertical: 3,
    color: COLOR.Grey500,
    fontFamily: FontFamily.PoppinRegular,
  },
  headerText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.Grey500,
    flex: 1,
  },
  DarkThemeHeaderText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.White,
    flex: 1,
  },
  DarkThemebodyText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    color: COLOR.White,
    flex: 1,
  },
  bodyText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    color: COLOR.Grey300,
    flex: 1,
  },
  bottomImageContainer: {
    position: 'absolute',
    bottom: 0,
    left: 37,
    right: 0,
    alignItems: 'center',
    backgroundColor: COLOR.White,
    borderRadius: 100,
    width: 18,
    height: 18,
    justifyContent: 'center',
  },
  smallIconShape: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F57F17',
    borderRadius: 100,
  },
  tabBar: {
    flexDirection: 'row',
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: SPACING.sp10,
    paddingHorizontal: SPACING.sp10,
    // paddingHorizontal: 16,
    borderRadius: RADIUS.rd100,
  },
  friendRequest: {
    height: '12%',
    flex: 1,
  },
});
