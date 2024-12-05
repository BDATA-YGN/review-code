import {
  Alert,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import COLOR from '../constants/COLOR';
import IconPic from '../components/Icon/IconPic';
import IconManager from '../assets/IconManager';
import PIXEL from '../constants/PIXEL';
import SPACING from '../constants/SPACING';
import RADIUS from '../constants/RADIUS';
import AppBar from '../components/AppBar';
import ProfileAvatar from '../components/Icon/ProfileAvatar';
import SizedBox from '../commonComponent/SizedBox';
import {FontFamily, fontSizes} from '../constants/FONT';
import en from '../i18n/en';
import {
  clearData,
  retrieveJsonData,
  retrieveStringData,
  storeJsonData,
  storeKeys,
} from '../helper/AsyncStorage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {stringKey} from '../constants/StringKey';
import {useDispatch, useSelector} from 'react-redux';
import {setFetchDarkMode} from '../stores/slices/DarkModeSlice';
import {getUserInfoData, requestProduct} from '../helper/ApiModel';
import {requestWalletAmount} from '../helper/Wallet/WalletModel';
import NormalLive from './Market/LiveStream/StreamerView/normalLive';

const Setting = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [username, setUserName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [userId, setUserId] = useState('');
  const [wallet, setWallet] = useState('');
  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const dispatch = useDispatch();
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const [walletPrice, setWalletPrice] = useState('0');

  //normal live
  const [fullScreen, setFullScreen] = useState(false);
  const handleCloseFullScreen = () => {
    setFullScreen(false);
  };

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

  useFocusEffect(
    useCallback(() => {
      handleGetWalletAmount();
    }, []), // Include dependencies here
  );

  useEffect(() => {
    fetchLoginCredentialData();
    fetchUserInfo();
    handleGetWalletAmount();
  }, []);

  const handleGetWalletAmount = async () => {
    try {
      const data = await requestWalletAmount();
      if (data.api_status === 200) {
        setWalletPrice(data.message);
      }
    } catch (error) {
      console.error('Error fetching wallet amount:', error);
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
      setFirstName(userDataResponse.user_data.first_name);
      setUserName(userDataResponse.user_data.username);
      setLastName(userDataResponse.user_data.last_name);
      setAvatar(userDataResponse.user_data.avatar);
      setUserId(userDataResponse.user_data.user_id);
      setWallet(userDataResponse.user_data.wallet);
    } catch (error) {
      fetchUserInfo();
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
      // console.log(userInfoData);

      setFirstName(userInfoData.first_name);
      setUserName(userInfoData.username);
      setLastName(userInfoData.last_name);
      setAvatar(userInfoData.avatar);
      setUserId(userInfoData.user_id);
      // setWalletPrice(userInfoData.wallet)
    } else {
      // Alert.alert(
      //   'Invalid',
      //   `No credential!`,
      //   [
      //     {
      //       text: 'Ok',
      //       onPress: () => {},
      //     },
      //   ],
      //   {cancelable: true},
      // );
    }
  };

  const newLocal = (
    <TouchableOpacity
      onPress={() => {
        clearData({key: storeKeys.loginCredential});
        clearData({key: storeKeys.userInfoData});
        clearData({key: storeKeys.rememberMe});
        navigation.navigate('Login');
        navigation.reset({
          index: 1,
          routes: [{name: 'Login'}],
        });
      }}
      activeOpacity={0.7}
      style={styles.genralContentStyle}>
      <View style={styles.generalContentHolder}>
        <View style={styles.generalIconAndText}>
          <IconPic
            source={
              darkMode === 'enable'
                ? IconManager.logout_dark
                : IconManager.logout_light
            }
          />
          <SizedBox width={SPACING.sm} />
          <Text
            style={darkMode === 'enable' ? styles.DcardText : styles.cardText}>
            {en.logout}
          </Text>
        </View>
        <IconPic
          source={
            darkMode === 'enable'
              ? IconManager.next_dark
              : IconManager.next_light
          }
          width={PIXEL.px12}
          height={PIXEL.px12}
        />
      </View>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView
      style={
        darkMode === 'enable' ? styles.DsafeAreaView : styles.safeAreaView
      }>
      <AppBar darkMode={darkMode} isAppLogo />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={
            darkMode === 'enable' ? styles.DprofileHolder : styles.profileHolder
          }>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('UserProile', {
                myNavigatedId: userId,
                canPost: stringKey.canPost,
                backDisable: 'enable',
              })
            }
            activeOpacity={0.8}
            style={darkMode === 'enable' ? styles.Dprofile : styles.profile}>
            <View
              style={
                darkMode === 'enable'
                  ? styles.DprofileContentHandle
                  : styles.profileContentHandle
              }>
              <ProfileAvatar src={avatar} />
              <SizedBox width={SPACING.xs} />
              <View>
                <Text
                  numberOfLines={1}
                  style={
                    darkMode === 'enable' ? styles.Dusername : styles.username
                  }>
                  {/* {firstName} {lastName} */}
                  {firstName !== '' ? `${firstName} ${lastName}` : username}
                </Text>
                <Text
                  style={
                    darkMode === 'enable'
                      ? styles.DviewProfile
                      : styles.viewProfile
                  }>
                  View Profile
                </Text>
              </View>
            </View>
            <IconPic
              source={
                darkMode === 'enable'
                  ? IconManager.next_dark
                  : IconManager.next_light
              }
              width={PIXEL.px16}
              height={PIXEL.px16}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 16,
            marginBottom: 16,
          }}>
          <TouchableOpacity
            onPress={() => {
              // Alert.alert('LiveStream');
              // navigation.navigate('LiveAddProduct');
              Platform.OS === 'ios'
                ? navigation.navigate('LiveAddProduct')
                : Alert.alert('Hello', 'Comming soon for Android!');
            }}
            activeOpacity={0.8}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'pink',
              flex: 1,
              padding: 16,
              marginLeft: 16,
              borderRadius: 8,
              backgroundColor: 'rgba(217, 56, 56, 0.7)',
            }}>
            <Text
              style={{
                fontFamily: FontFamily.PoppinSemiBold,
                fontSize: fontSizes.size15,
                color: COLOR.White100,
              }}>
              Live Sale
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // Alert.alert('LiveStream');
              // setFullScreen(true);
              // navigation.navigate('NormalLiveForm');
              Platform.OS === 'ios'
                ? navigation.navigate('NormalLiveForm')
                : Alert.alert('Hello', 'Comming soon for Android!');
            }}
            activeOpacity={0.8}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'pink',
              flex: 1,
              padding: 16,
              marginRight: 16,
              borderRadius: 8,
              backgroundColor: 'rgba(217, 56, 56, 0.7)',
            }}>
            <Text
              style={{
                fontFamily: FontFamily.PoppinSemiBold,
                fontSize: fontSizes.size15,
                color: COLOR.White100,
              }}>
              Normal Live
            </Text>
          </TouchableOpacity>
        </View>
        {/* 
        <View
          style={
            darkMode === 'enable' ? styles.DprofileHolder : styles.profileHolder
          }>
          <TouchableOpacity
            onPress={() => {
              // Alert.alert('LiveStream');
              navigation.navigate('LiveStream');
            }}
            activeOpacity={0.8}
            style={darkMode === 'enable' ? styles.Dwallet : styles.wallet}>
            <Text
              style={{
                fontFamily: FontFamily.PoppinSemiBold,
                fontSize: fontSizes.size15,
                color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
              }}>
              Go Live
            </Text>
          </TouchableOpacity>
        </View> */}
        {/* <View
          style={
            darkMode === 'enable' ? styles.DprofileHolder : styles.profileHolder
          }>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('StreamViewerView');
            }}
            activeOpacity={0.8}
            style={darkMode === 'enable' ? styles.Dwallet : styles.wallet}>
            <Text
              style={{
                fontFamily: FontFamily.PoppinSemiBold,
                fontSize: fontSizes.size15,
                color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
              }}>
              Live Viewer
            </Text>
          </TouchableOpacity>
        </View> */}
        <View
          style={
            darkMode === 'enable' ? styles.DprofileHolder : styles.profileHolder
          }>
          <TouchableOpacity
            onPress={
              () =>
                navigation.navigate('Wallet', {
                  myNavigatedId: userId,
                  canPost: stringKey.canPost,
                  backDisable: 'enable',
                })
              // navigation.navigate('CommingSoon')
            }
            activeOpacity={0.8}
            style={darkMode === 'enable' ? styles.Dwallet : styles.wallet}>
            <View
              style={
                darkMode === 'enable'
                  ? styles.DprofileContentHandle
                  : styles.profileContentHandle
              }>
              <Image
                resizeMode="contain"
                source={
                  darkMode == 'enable'
                    ? IconManager.wallet_dark
                    : IconManager.wallet_light
                }
                style={{width: 50, height: 50}}
              />
              <SizedBox width={SPACING.xs} />
              <View>
                <Text
                  numberOfLines={1}
                  style={
                    darkMode === 'enable'
                      ? styles.DviewProfile
                      : styles.viewProfile
                  }>
                  Wallet
                </Text>
                <Text
                  style={
                    darkMode === 'enable' ? styles.Dusername : styles.username
                  }>
                  Ks {walletPrice}
                  {/* Ks 0 */}
                </Text>
              </View>
            </View>
            <IconPic
              source={
                darkMode === 'enable'
                  ? IconManager.next_dark
                  : IconManager.next_light
              }
              width={PIXEL.px16}
              height={PIXEL.px16}
            />
          </TouchableOpacity>
        </View>
        <View
          style={
            darkMode === 'enable'
              ? styles.DshortcutHolder
              : styles.shortcutHolder
          }>
          <View
            style={darkMode === 'enable' ? styles.Dshortcut : styles.shortcut}>
            <View
              style={
                darkMode === 'enable'
                  ? styles.DshortcutHeaderBar
                  : styles.shortcutHeaderBar
              }>
              <Text
                style={[
                  darkMode === 'enable' ? styles.Dusername : styles.username,
                  {flex: 1},
                ]}>
                {en.shortcut}
              </Text>
              {/* <TouchableOpacity
                onPress={() => navigation.navigate('CommingSoon')}>
                <Text
                  style={
                    darkMode === 'enable' ? styles.DseeAll : styles.seeAll
                  }>
                  {en.seeAll}
                </Text>
              </TouchableOpacity> */}
            </View>

            <View
              style={
                darkMode === 'enable'
                  ? styles.DcardContiner
                  : styles.cardContiner
              }>
              <TouchableOpacity
                style={
                  darkMode === 'enable' ? styles.DcardView : styles.cardView
                }
                onPress={() =>
                  navigation.navigate('SavedPosts', {
                    userId,
                    firstName,
                    lastName,
                  })
                }
                activeOpacity={0.7}>
                <View
                  style={
                    darkMode === 'enable'
                      ? styles.DcardContentContiner
                      : styles.cardContentContiner
                  }>
                  <IconPic
                    source={
                      darkMode === 'enable'
                        ? IconManager.save_dark
                        : IconManager.save_light
                    }
                  />
                  <SizedBox width={SPACING.xxxs} />
                  <Text
                    style={
                      darkMode === 'enable' ? styles.DcardText : styles.cardText
                    }>
                    {en.save}
                  </Text>
                </View>
              </TouchableOpacity>
              <SizedBox width={'5%'} />
              <TouchableOpacity
                style={
                  darkMode === 'enable' ? styles.DcardView : styles.cardView
                }
                onPress={() => navigation.navigate('PageMain')}
                activeOpacity={0.7}>
                <View
                  style={
                    darkMode === 'enable'
                      ? styles.DcardContentContiner
                      : styles.cardContentContiner
                  }>
                  <IconPic
                    source={
                      darkMode === 'enable'
                        ? IconManager.page_dark
                        : IconManager.page_light
                    }
                  />
                  <SizedBox width={SPACING.xxxs} />
                  <Text
                    style={
                      darkMode === 'enable' ? styles.DcardText : styles.cardText
                    }>
                    {en.page}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <SizedBox height={SPACING.sm} />
            <View
              style={
                darkMode === 'enable'
                  ? styles.DcardContiner
                  : styles.cardContiner
              }>
              <TouchableOpacity
                style={
                  darkMode === 'enable' ? styles.DcardView : styles.cardView
                }
                onPress={() => navigation.navigate('GroupMain')}
                activeOpacity={0.7}>
                <View
                  style={
                    darkMode === 'enable'
                      ? styles.DcardContentContiner
                      : styles.cardContentContiner
                  }>
                  <IconPic
                    source={
                      darkMode === 'enable'
                        ? IconManager.group_dark
                        : IconManager.group_light
                    }
                  />
                  <SizedBox width={SPACING.xxxs} />
                  <Text
                    style={
                      darkMode === 'enable' ? styles.DcardText : styles.cardText
                    }>
                    {en.group}
                  </Text>
                </View>
              </TouchableOpacity>
              <SizedBox width={'5%'} />
              {/* <TouchableOpacity
                style={
                  darkMode === 'enable' ? styles.DcardView : styles.cardView
                }
                onPress={() => {}}
                activeOpacity={0.7}>
                <View
                  style={
                    darkMode === 'enable'
                      ? styles.DcardContentContiner
                      : styles.cardContentContiner
                  }>
                  <IconPic
                    source={
                      darkMode === 'enable'
                        ? IconManager.memories_dark
                        : IconManager.memories_light
                    }
                  />
                  <SizedBox width={SPACING.xxxs} />
                  <Text
                    style={
                      darkMode === 'enable' ? styles.DcardText : styles.cardText
                    }>
                    {en.memories}
                  </Text>
                </View>
              </TouchableOpacity> */}
              <TouchableOpacity
                style={
                  darkMode === 'enable' ? styles.DcardView : styles.cardView
                }
                onPress={() => navigation.navigate('Event')}
                activeOpacity={0.7}>
                <View
                  style={
                    darkMode === 'enable'
                      ? styles.DcardContentContiner
                      : styles.cardContentContiner
                  }>
                  <IconPic
                    source={
                      darkMode === 'enable'
                        ? IconManager.event_dark
                        : IconManager.event_light
                    }
                  />
                  <SizedBox width={SPACING.xxxs} />
                  <Text
                    style={
                      darkMode === 'enable' ? styles.DcardText : styles.cardText
                    }>
                    {en.event}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <SizedBox height={SPACING.sm} />
            <View
              style={
                darkMode === 'enable'
                  ? styles.DcardContiner
                  : styles.cardContiner
              }>
              {/* <TouchableOpacity
                style={
                  darkMode === 'enable' ? styles.DcardView : styles.cardView
                }
                onPress={() => {}}
                activeOpacity={0.7}>
                <View
                  style={
                    darkMode === 'enable'
                      ? styles.DcardContentContiner
                      : styles.cardContentContiner
                  }>
                  <IconPic
                    source={
                      darkMode === 'enable'
                        ? IconManager.job_dark
                        : IconManager.jobs_light
                    }
                  />
                  <SizedBox width={SPACING.xxxs} />
                  <Text
                    style={
                      darkMode === 'enable' ? styles.DcardText : styles.cardText
                    }>
                    {en.jobs}
                  </Text>
                </View>
              </TouchableOpacity> */}
              <TouchableOpacity
                style={
                  darkMode === 'enable'
                    ? styles.DcardView
                    : styles.cardViewPosts
                }
                onPress={() => navigation.navigate('MarketScreen')}
                // onPress={() => navigation.navigate('CommingSoon')}
                activeOpacity={0.7}>
                <View
                  style={
                    darkMode === 'enable'
                      ? styles.DcardContentContiner
                      : styles.cardContentContiner
                  }>
                  <IconPic
                    source={
                      darkMode === 'enable'
                        ? IconManager.setting_market_dark
                        : IconManager.setting_market_light
                    }
                  />
                  <SizedBox width={SPACING.xxxs} />
                  <Text
                    style={
                      darkMode === 'enable' ? styles.DcardText : styles.cardText
                    }>
                    Market
                  </Text>
                </View>
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={
                  darkMode === 'enable' ? styles.DcardView : styles.cardView
                }
                onPress={() => navigation.navigate('SeeAllFriends', {userId})}
                activeOpacity={0.7}>
                <View
                  style={
                    darkMode === 'enable'
                      ? styles.DcardContentContiner
                      : styles.cardContentContiner
                  }>
                  <IconPic
                    source={
                      darkMode === 'enable'
                        ? IconManager.friend_dark
                        : IconManager.friend_light
                    }
                  />
                  <SizedBox width={SPACING.xxxs} />
                  <Text
                    style={
                      darkMode === 'enable' ? styles.DcardText : styles.cardText
                    }>
                    {en.friend}
                  </Text>
                </View>
              </TouchableOpacity> */}
              <SizedBox width={'5%'} />
              <TouchableOpacity
                style={
                  darkMode === 'enable'
                    ? styles.DcardView
                    : styles.cardViewPosts
                }
                onPress={() => navigation.navigate('PopularPost', {userId})}
                activeOpacity={0.7}>
                <View
                  style={
                    darkMode === 'enable'
                      ? styles.DcardContentContiner
                      : styles.cardContentContiner
                  }>
                  <IconPic
                    source={
                      darkMode === 'enable'
                        ? IconManager.play_dark
                        : IconManager.popular_posts_light
                    }
                  />
                  <SizedBox width={SPACING.xxxs} />
                  <Text
                    style={
                      darkMode === 'enable' ? styles.DcardText : styles.cardText
                    }>
                    Popular Posts
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <SizedBox height={SPACING.sm} />
            <View
              style={
                darkMode === 'enable'
                  ? styles.DcardContiner
                  : styles.cardContiner
              }>
              {/* <TouchableOpacity
                style={
                  darkMode === 'enable' ? styles.DcardView : styles.cardView
                }
                onPress={() => navigation.navigate('CommingSoon')}
                activeOpacity={0.7}>
                <View
                  style={
                    darkMode === 'enable'
                      ? styles.DcardContentContiner
                      : styles.cardContentContiner
                  }>
                  <IconPic
                    source={
                      darkMode === 'enable'
                        ? IconManager.play_dark
                        : IconManager.play_light
                    }
                  />
                  <SizedBox width={SPACING.xxxs} />
                  <Text
                    style={
                      darkMode === 'enable' ? styles.DcardText : styles.cardText
                    }>
                    {en.video}
                  </Text>
                </View>
              </TouchableOpacity> */}

              <TouchableOpacity
                style={
                  darkMode === 'enable' ? styles.DcardView : styles.cardView
                }
                onPress={() => navigation.navigate('SeeAllFriends', {userId})}
                activeOpacity={0.7}>
                <View
                  style={
                    darkMode === 'enable'
                      ? styles.DcardContentContiner
                      : styles.cardContentContiner
                  }>
                  <IconPic
                    source={
                      darkMode === 'enable'
                        ? IconManager.friend_dark
                        : IconManager.friend_light
                    }
                  />
                  <SizedBox width={SPACING.xxxs} />
                  <Text
                    style={
                      darkMode === 'enable' ? styles.DcardText : styles.cardText
                    }>
                    {en.friend}
                  </Text>
                </View>
              </TouchableOpacity>
              <SizedBox width={'5%'} />

              <TouchableOpacity
                style={
                  darkMode === 'enable' ? styles.DcardView : styles.cardView
                }
                onPress={() => {
                  navigation.navigate('CommingSoon');
                }}
                activeOpacity={0.7}>
                <View
                  style={
                    darkMode === 'enable'
                      ? styles.DcardContentContiner
                      : styles.cardContentContiner
                  }>
                  <IconPic
                    source={
                      darkMode === 'enable'
                        ? IconManager.setting_memories_dark
                        : IconManager.setting_memories_light
                    }
                  />
                  <SizedBox width={SPACING.xxxs} />
                  <Text
                    style={
                      darkMode === 'enable' ? styles.DcardText : styles.cardText
                    }>
                    {en.memories}
                  </Text>
                </View>
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={
                  darkMode === 'enable' ? styles.DcardView : styles.cardView
                }
                onPress={() =>
                  navigation.navigate('JobLists', {
                    darkMode,
                    firstName,
                    lastName,
                    userId,
                  })
                }
                activeOpacity={0.7}>
                <View
                  style={
                    darkMode === 'enable'
                      ? styles.DcardContentContiner
                      : styles.cardContentContiner
                  }>
                  <IconPic
                    source={
                      darkMode === 'enable'
                        ? IconManager.job_dark
                        : IconManager.jobs_light
                    }
                  />
                  <SizedBox width={SPACING.xxxs} />
                  <Text
                    style={
                      darkMode === 'enable' ? styles.DcardText : styles.cardText
                    }>
                    {en.jobs}
                  </Text>
                </View>
              </TouchableOpacity> */}
            </View>

            {/* <SizedBox height={SPACING.sm} /> */}
            {/* <View
              style={
                darkMode === 'enable'
                  ? styles.DcardContiner
                  : styles.cardContiner
              }>
              <TouchableOpacity
                style={
                  darkMode === 'enable'
                    ? styles.DcardView
                    : styles.cardViewPosts
                }
                onPress={() =>
                  navigation.navigate('JobLists', {
                    darkMode,
                    firstName,
                    lastName,
                    userId,
                  })
                }
                activeOpacity={0.7}>
                <View
                  style={
                    darkMode === 'enable'
                      ? styles.DcardContentContiner
                      : styles.cardContentContiner
                  }>
                  <IconPic
                    source={
                      darkMode === 'enable'
                        ? IconManager.setting_album_dark
                        : IconManager.setting_album_light
                    }
                  />
                  <SizedBox width={SPACING.xxxs} />
                  <Text
                    style={
                      darkMode === 'enable' ? styles.DcardText : styles.cardText
                    }>
                    Album
                  </Text>
                </View>
              </TouchableOpacity>
            </View> */}
            <SizedBox height={SPACING.sm} />
            <View
              style={
                darkMode === 'enable'
                  ? styles.DcardContiner
                  : styles.cardContiner
              }>
              <SizedBox width={'5%'} />
              <View style={{flex: 1}} />
              {/* <TouchableOpacity
                style={
                  darkMode === 'enable' ? styles.DcardView : styles.cardView
                }
                onPress={() => navigation.navigate('EditProduct')}
                activeOpacity={0.7}>
                <View
                  style={
                    darkMode === 'enable'
                      ? styles.DcardContentContiner
                      : styles.cardContentContiner
                  }>
                  <IconPic
                    source={
                      darkMode === 'enable'
                        ? IconManager.event_dark
                        : IconManager.event_light
                    }
                  />
                  <SizedBox width={SPACING.xxxs} />
                  <Text
                    style={
                      darkMode === 'enable' ? styles.DcardText : styles.cardText
                    }>
                    Edit Product
                  </Text>
                </View>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
        <SizedBox height={SPACING.lg} />
        <View
          style={
            darkMode === 'enable' ? styles.DgeneralHolder : styles.generalHolder
          }>
          <View
            style={darkMode === 'enable' ? styles.Dgeneral : styles.general}>
            <Text
              style={[
                darkMode === 'enable' ? styles.Dusername : styles.username,
                {flex: 1},
              ]}>
              {en.otherSetting}
            </Text>
            <SizedBox width={'100%'} height={0.5} color={COLOR.Grey100} />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('GeneralAcctontMain')}
              style={
                darkMode === 'enable'
                  ? styles.DgenralContentStyle
                  : styles.genralContentStyle
              }>
              <View
                style={
                  darkMode === 'enable'
                    ? styles.DgeneralContentHolder
                    : styles.generalContentHolder
                }>
                <View
                  style={
                    darkMode === 'enable'
                      ? styles.DgeneralIconAndText
                      : styles.generalIconAndText
                  }>
                  <IconPic
                    source={
                      darkMode === 'enable'
                        ? IconManager.edit_dark
                        : IconManager.edit_light
                    }
                  />
                  <SizedBox width={SPACING.sm} />
                  <Text
                    style={
                      darkMode === 'enable' ? styles.DcardText : styles.cardText
                    }>
                    {en.generalAccount}
                  </Text>
                </View>
                <IconPic
                  source={
                    darkMode === 'enable'
                      ? IconManager.next_dark
                      : IconManager.next_light
                  }
                  width={PIXEL.px12}
                  height={PIXEL.px12}
                />
              </View>
            </TouchableOpacity>
            <SizedBox width={'100%'} height={0.5} color={COLOR.Grey100} />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Privacy');
              }}
              activeOpacity={0.7}
              style={
                darkMode === 'enable'
                  ? styles.DgenralContentStyle
                  : styles.genralContentStyle
              }>
              <View
                style={
                  darkMode === 'enable'
                    ? styles.DgeneralContentHolder
                    : styles.generalContentHolder
                }>
                <View
                  style={
                    darkMode === 'enable'
                      ? styles.DgeneralIconAndText
                      : styles.generalIconAndText
                  }>
                  <IconPic
                    source={
                      darkMode === 'enable'
                        ? IconManager.password_dark
                        : IconManager.password_light
                    }
                  />

                  <SizedBox width={SPACING.sm} />
                  <Text
                    style={
                      darkMode === 'enable' ? styles.DcardText : styles.cardText
                    }>
                    {en.privacy}
                  </Text>
                </View>
                <IconPic
                  source={
                    darkMode === 'enable'
                      ? IconManager.next_dark
                      : IconManager.next_light
                  }
                  width={PIXEL.px12}
                  height={PIXEL.px12}
                />
              </View>
            </TouchableOpacity>

            <SizedBox width={'100%'} height={0.5} color={COLOR.Grey100} />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AddMonetization', {userId, darkMode});
                // navigation.navigate('CommingSoon');
              }}
              activeOpacity={0.7}
              style={
                darkMode === 'enable'
                  ? styles.DgenralContentStyle
                  : styles.genralContentStyle
              }>
              <View
                style={
                  darkMode === 'enable'
                    ? styles.DgeneralContentHolder
                    : styles.generalContentHolder
                }>
                <View
                  style={
                    darkMode === 'enable'
                      ? styles.DgeneralIconAndText
                      : styles.generalIconAndText
                  }>
                  <Image
                    source={
                      darkMode == 'enable'
                        ? IconManager.dollar_dark
                        : IconManager.dollar_light
                    }
                    style={{width: 20, height: 20}}
                  />
                  <SizedBox width={SPACING.sm} />
                  <Text
                    style={
                      darkMode === 'enable' ? styles.DcardText : styles.cardText
                    }>
                    Monetization
                  </Text>
                </View>
                <IconPic
                  source={
                    darkMode === 'enable'
                      ? IconManager.next_dark
                      : IconManager.next_light
                  }
                  width={PIXEL.px12}
                  height={PIXEL.px12}
                />
              </View>
            </TouchableOpacity>
            <SizedBox width={'100%'} height={0.5} color={COLOR.Grey100} />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SubscriptionList', {darkMode: darkMode});
                // navigation.navigate('CommingSoon');
              }}
              activeOpacity={0.7}
              style={
                darkMode === 'enable'
                  ? styles.DgenralContentStyle
                  : styles.genralContentStyle
              }>
              <View
                style={
                  darkMode === 'enable'
                    ? styles.DgeneralContentHolder
                    : styles.generalContentHolder
                }>
                <View
                  style={
                    darkMode === 'enable'
                      ? styles.DgeneralIconAndText
                      : styles.generalIconAndText
                  }>
                  <IconPic
                    source={
                      darkMode === 'enable'
                        ? IconManager.password_dark
                        : IconManager.subscription_light
                    }
                  />
                  <SizedBox width={SPACING.sm} />
                  <Text
                    style={
                      darkMode === 'enable' ? styles.DcardText : styles.cardText
                    }>
                    Subscription
                  </Text>
                </View>
                <IconPic
                  source={
                    darkMode === 'enable'
                      ? IconManager.next_dark
                      : IconManager.next_light
                  }
                  width={PIXEL.px12}
                  height={PIXEL.px12}
                />
              </View>
            </TouchableOpacity>
            <SizedBox width={'100%'} height={0.5} color={COLOR.Grey100} />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('CommingSoon');
              }}
              activeOpacity={0.7}
              style={
                darkMode === 'enable'
                  ? styles.DgenralContentStyle
                  : styles.genralContentStyle
              }>
              <View
                style={
                  darkMode === 'enable'
                    ? styles.generalContentHolder
                    : styles.generalContentHolder
                }>
                <View
                  style={
                    darkMode === 'enable'
                      ? styles.DgeneralIconAndText
                      : styles.generalIconAndText
                  }>
                  <IconPic
                    source={
                      darkMode === 'enable'
                        ? IconManager.notification_dark
                        : IconManager.notification_light
                    }
                  />
                  <SizedBox width={SPACING.sm} />
                  <Text
                    style={
                      darkMode === 'enable' ? styles.DcardText : styles.cardText
                    }>
                    {en.notification}
                  </Text>
                </View>
                <IconPic
                  source={
                    darkMode === 'enable'
                      ? IconManager.next_dark
                      : IconManager.next_light
                  }
                  width={PIXEL.px12}
                  height={PIXEL.px12}
                />
              </View>
            </TouchableOpacity>
            <SizedBox width={'100%'} height={0.5} color={COLOR.Grey100} />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('InvitationLinks');
              }}
              activeOpacity={0.7}
              style={styles.genralContentStyle}>
              <View style={styles.generalContentHolder}>
                <View style={styles.generalIconAndText}>
                  <IconPic
                    source={
                      darkMode === 'enable'
                        ? IconManager.invitation_dark
                        : IconManager.invitation_light
                    }
                  />
                  <SizedBox width={SPACING.sm} />
                  <Text
                    style={
                      darkMode === 'enable' ? styles.DcardText : styles.cardText
                    }>
                    {en.inviationLink}
                  </Text>
                </View>
                <IconPic
                  source={
                    darkMode === 'enable'
                      ? IconManager.next_dark
                      : IconManager.next_light
                  }
                  width={PIXEL.px12}
                  height={PIXEL.px12}
                />
              </View>
            </TouchableOpacity>
            <SizedBox width={'100%'} height={0.5} color={COLOR.Grey100} />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('CommingSoon');
              }}
              activeOpacity={0.7}
              style={styles.genralContentStyle}>
              <View style={styles.generalContentHolder}>
                <View style={styles.generalIconAndText}>
                  <IconPic
                    source={
                      darkMode === 'enable'
                        ? IconManager.my_info_dark
                        : IconManager.my_info_light
                    }
                  />
                  <SizedBox width={SPACING.sm} />
                  <Text
                    style={
                      darkMode === 'enable' ? styles.DcardText : styles.cardText
                    }>
                    {en.myInformation}
                  </Text>
                </View>
                <IconPic
                  source={
                    darkMode === 'enable'
                      ? IconManager.next_dark
                      : IconManager.next_light
                  }
                  width={PIXEL.px12}
                  height={PIXEL.px12}
                />
              </View>
            </TouchableOpacity>
            <SizedBox width={'100%'} height={0.5} color={COLOR.Grey100} />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('MyAddress', {darkMode});
              }}
              activeOpacity={0.7}
              style={styles.genralContentStyle}>
              <View style={styles.generalContentHolder}>
                <View style={styles.generalIconAndText}>
                  <IconPic
                    source={
                      darkMode === 'enable'
                        ? IconManager.location_dark
                        : IconManager.location_light
                    }
                  />
                  <SizedBox width={SPACING.sm} />
                  <Text
                    style={
                      darkMode === 'enable' ? styles.DcardText : styles.cardText
                    }>
                    {en.myAddresses}
                  </Text>
                </View>
                <IconPic
                  source={
                    darkMode === 'enable'
                      ? IconManager.next_dark
                      : IconManager.next_light
                  }
                  width={PIXEL.px12}
                  height={PIXEL.px12}
                />
              </View>
            </TouchableOpacity>
            <SizedBox width={'100%'} height={0.5} color={COLOR.Grey100} />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('CommingSoon');
              }}
              activeOpacity={0.7}
              style={styles.genralContentStyle}>
              <View style={styles.generalContentHolder}>
                <View style={styles.generalIconAndText}>
                  <IconPic
                    source={
                      darkMode === 'enable'
                        ? IconManager.earning_dark
                        : IconManager.earning_light
                    }
                  />
                  <SizedBox width={SPACING.sm} />
                  <Text
                    style={
                      darkMode === 'enable' ? styles.DcardText : styles.cardText
                    }>
                    {en.earnings}
                  </Text>
                </View>
                <IconPic
                  source={
                    darkMode === 'enable'
                      ? IconManager.next_dark
                      : IconManager.next_light
                  }
                  width={PIXEL.px12}
                  height={PIXEL.px12}
                />
              </View>
            </TouchableOpacity>
            <SizedBox width={'100%'} height={0.5} color={COLOR.Grey100} />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('CommingSoon');
              }}
              activeOpacity={0.7}
              style={styles.genralContentStyle}>
              <View style={styles.generalContentHolder}>
                <View style={styles.generalIconAndText}>
                  <IconPic
                    source={
                      darkMode === 'enable'
                        ? IconManager.help_support_dark
                        : IconManager.help_support_light
                    }
                  />
                  <SizedBox width={SPACING.sm} />
                  <Text
                    style={
                      darkMode === 'enable' ? styles.DcardText : styles.cardText
                    }>
                    {en.helpAndSupport}
                  </Text>
                </View>
                <IconPic
                  source={
                    darkMode === 'enable'
                      ? IconManager.next_dark
                      : IconManager.next_light
                  }
                  width={PIXEL.px12}
                  height={PIXEL.px12}
                />
              </View>
            </TouchableOpacity>
            <SizedBox width={'100%'} height={0.5} color={COLOR.Grey100} />
            <TouchableOpacity
              onPress={() => navigation.navigate('Theme')}
              activeOpacity={0.7}
              style={styles.genralContentStyle}>
              <View style={styles.generalContentHolder}>
                <View style={styles.generalIconAndText}>
                  <IconPic
                    source={
                      darkMode === 'enable'
                        ? IconManager.dark_theme
                        : IconManager.light_theme
                    }
                  />
                  <SizedBox width={SPACING.sm} />
                  <Text
                    style={
                      darkMode === 'enable' ? styles.DcardText : styles.cardText
                    }>
                    {en.theme}
                  </Text>
                </View>
                <IconPic
                  source={
                    darkMode === 'enable'
                      ? IconManager.next_dark
                      : IconManager.next_light
                  }
                  width={PIXEL.px12}
                  height={PIXEL.px12}
                />
              </View>
            </TouchableOpacity>
            <SizedBox width={'100%'} height={0.5} color={COLOR.Grey100} />
            {newLocal}
            <SizedBox width={'100%'} height={0.5} color={COLOR.Grey100} />
            {/* <SizedBox width={'100%'} height={8} /> */}
          </View>
        </View>
        <SizedBox height={SPACING.lg} />
      </ScrollView>
      <Modal
        visible={fullScreen}
        supportedOrientations={['landscape', 'portrait']}
        onRequestClose={handleCloseFullScreen}>
        <NormalLive handleCloseFullScreen={handleCloseFullScreen} />
      </Modal>
    </SafeAreaView>
  );
};

export default Setting;

const styles = StyleSheet.create({
  otherSettingTextStyle: {
    color: COLOR.Grey300,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
  },
  generalContentHolder: {
    flexDirection: 'row',
    paddingVertical: SPACING.sm,
  },
  generalIconAndText: {
    flex: 1,
    flexDirection: 'row',
  },
  genralContentStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.xxxxs,
    marginVertical: SPACING.xxxxxs,
  },
  generalHolder: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  general: {
    width: '90%',
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.White100,
    padding: SPACING.sm,
  },
  cardContentContiner: {
    paddingVertical: SPACING.xl,
    flexDirection: 'row',
  },
  cardText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.Grey500,
  },
  cardContiner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop : SPACING.xxs
  },

  cardView: {
    width: '47.5%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: COLOR.Blue50,
    gap: SPACING.sm,
    paddingLeft: SPACING.lg,
    borderRadius: RADIUS.xs,
  },
  seeAll: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.Grey500,
  },
  shortcutHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shortcutHolder: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  shortcut: {
    width: '90%',
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.White100,
    padding: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHolder: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  profile: {
    width: '90%',
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.White100,
    margin: SPACING.lg,
    padding: SPACING.sm,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wallet: {
    width: '90%',
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.White100,
    marginBottom: SPACING.lg,
    padding: SPACING.sm,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContentHandle: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  username: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size19,
    color: COLOR.Grey500,
  },
  viewProfile: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.Grey300,
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: COLOR.White50,
  },
  DsafeAreaView: {
    flex: 1,
    backgroundColor: COLOR.DarkTheme,
  },
  DotherSettingTextStyle: {
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
  },
  DgeneralContentHolder: {
    flexDirection: 'row',
    paddingVertical: SPACING.sm,
  },
  DgeneralIconAndText: {
    flex: 1,
    flexDirection: 'row',
  },
  DgenralContentStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.xxxxs,
    marginVertical: SPACING.xxxxxs,
  },
  DgeneralHolder: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  Dgeneral: {
    width: '90%',
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.DarkThemLight,
    padding: SPACING.sm,
  },
  DcardContentContiner: {
    paddingVertical: SPACING.xl,
    flexDirection: 'row',
  },
  DcardText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.White100,
  },
  DcardContiner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardViewPosts: {
    width: '47.5%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // alignItems: 'center',
    backgroundColor: COLOR.Blue50,
    gap: SPACING.sm,
    paddingLeft: SPACING.lg,
    borderRadius: RADIUS.xs,
    // marginRight: 150,
    alignSelf: 'flex-start',
  },

  DcardView: {
    width: '47.5%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // alignItems: 'center',
    backgroundColor: COLOR.DarkFadeLight,
    gap: SPACING.sm,
    paddingLeft: SPACING.lg,
    borderRadius: RADIUS.xs,
    alignSelf: 'flex-start',
  },

  DseeAll: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.White100,
  },
  DshortcutHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  DshortcutHolder: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  Dshortcut: {
    width: '90%',
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.DarkThemLight,
    padding: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  DprofileHolder: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  Dprofile: {
    width: '90%',
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.DarkThemLight,
    margin: SPACING.lg,
    padding: SPACING.sm,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Dwallet: {
    width: '90%',
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.DarkThemLight,
    marginBottom: SPACING.lg,
    padding: SPACING.sm,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  DprofileContentHandle: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  Dusername: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size19,
    color: COLOR.White100,
  },
  DviewProfile: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.White100,
  },
});
