import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Job from '../screens/Job';
import Notification from '../screens/Notification';
import Setting from '../screens/Setting';
import ShortVideo from '../screens/ShortVideo';
import {useFocusEffect} from '@react-navigation/native';
import {
  Alert,
  BackHandler,
  Image,
  Linking,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import assets from '../assets/IconManager';
import color from '../constants/COLOR';
import {
  retrieveJsonData,
  retrieveStringData,
  storeKeys,
} from '../helper/AsyncStorage';
import COLOR from '../constants/COLOR';
import {useDispatch, useSelector} from 'react-redux';
import {setFetchDarkMode} from '../stores/slices/DarkModeSlice';
import {stringKey} from '../constants/StringKey';
import ShortVideoNew from '../screens/ShortVideo/ShortVideoNew';
import UserProfile from '../screens/UserProfile/UserProfile';
import {getVersionControl} from '../helper/ApiModel';
import DeviceInfo from 'react-native-device-info';
import semver from 'semver';
import {setFetchVersionControl} from '../stores/slices/VersionControlSlice';
import StreamingListMain from '../screens/Market/LiveStream/liveComponent/streamList/streamingListMain';
import {
  setActivePageIndex,
  setIsMyPageVideoPlay,
  setIsMyPopularPostVideoPlay,
  setIsMySavePostVideoPlay,
  setIsVideoPlay,
} from '../stores/slices/PostSlice';

function MyTabBar({state, descriptors, navigation}) {
  const getTabIcon = routeName => {
    switch (routeName) {
      case 'Home':
        return assets.home_light;
      case 'Notification':
        return assets.notification_light;
      // case 'ShortVideoNew':
      //   return assets.short_Video_light;
      case 'StreamingListMain':
        return assets.short_Video_light;
      case 'UserProfile':
        return assets.user_light;
      case 'Setting':
        return assets.setting_light;
      default:
        return null;
    }
  };
  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const [latestVersion, setLatestVersion] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(false);
  const fetchVersionControl = useSelector(
    state => state.VersionControlSlice.fetchVersionControl,
  );

  const dispatch = useDispatch();
  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);
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
    if (fetchVersionControl) {
      fetchVersion();
      dispatch(setFetchVersionControl(false));
    }
  }, []);

  // Helper function to ensure version is semantic
  const ensureSemanticVersion = version => {
    const parts = version.split('.');
    while (parts.length < 3) {
      parts.push('0');
    }
    return parts.join('.');
  };

  const fetchVersion = () => {
    const currentVersion = ensureSemanticVersion(DeviceInfo.getVersion());

    const platform = Platform.OS == 'ios' ? 'ios' : 'android';
    try {
      getVersionControl(currentVersion, platform).then(data => {
        if (data.api_status === 200) {
          setLatestVersion(data.latest_version);
          if (
            semver.lt(
              currentVersion,
              ensureSemanticVersion(data.latest_version),
            )
          ) {
            if (
              semver.lt(
                currentVersion,
                ensureSemanticVersion(data.at_least_version),
              )
            ) {
              // Force update
              setForceUpdate(true);
              showForceUpdateAlert(data.at_least_version);
            } else {
              // Optional update
              showOptionalUpdateAlert(data.latest_version);
            }
          }
        }
      });
    } catch (error) {
      console.error('Error checking for update', error);
      Alert.alert(
        'Error',
        'Something went wrong. Please try again later.',
        [{text: 'OK', onPress: () => {}}],
        {cancelable: true},
      );
    }
  };

  const showForceUpdateAlert = version => {
    Alert.alert(
      'Force Update Required',
      `A new version (${version}) is required to continue using this app.`,
      [
        {
          text: 'Update Now',
          onPress: () => {
            const appStoreUrl = Platform.select({
              ios: 'https://apps.apple.com/us/app/myspace-myanmar/id6482850308',
              android:
                'https://play.google.com/store/apps/details?id=com.myspace.mm&pcampaignid=web_share',
            });
            if (appStoreUrl) {
              Linking.openURL(appStoreUrl);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  const showOptionalUpdateAlert = version => {
    Alert.alert(
      'Update Available',
      `A new version (${version}) is available.`,
      [
        {
          text: 'Update Now',
          onPress: () => {
            const appStoreUrl = Platform.select({
              ios: 'https://apps.apple.com/us/app/myspace-myanmar/id6482850308',
              android:
                'https://play.google.com/store/apps/details?id=com.myspace.mm&pcampaignid=web_share',
            });
            if (appStoreUrl) {
              Linking.openURL(appStoreUrl);
            }
          },
        },
        {text: 'Later', onPress: () => {}},
      ],
      {cancelable: false},
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      if (forceUpdate) {
        showForceUpdateAlert(latestVersion);
      }
      const onBackPress = () => {
        if (forceUpdate) {
          BackHandler.exitApp();
          return true;
        }
        return false;
      };

      const backHandlerListener = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => {
        backHandlerListener.remove();
      };
    }, [forceUpdate, latestVersion]),
  );

  const fetchLoginCredentialData = async () => {
    const userInfoData = await retrieveJsonData({key: storeKeys.userInfoData});
    if (userInfoData !== null) {
      return userInfoData.user_id; // Return user_id if userInfoData is not null
    } else {
      return 0; // Return null if userInfoData is null
    }
  };

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: 60,
        alignItems: 'center',
        backgroundColor: darkMode == 'enable' ? COLOR.DarkThemLight : '#ffffff',
        paddingLeft: 28,
      }}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = async () => {
          dispatch(setIsMyPageVideoPlay(null));
          dispatch(setIsVideoPlay(null));
          dispatch(setActivePageIndex(null));
          dispatch(setIsMySavePostVideoPlay(null));
          dispatch(setIsMyPopularPostVideoPlay(null));
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            if (route.name === 'UserProfile') {
              navigation.navigate(route.name, {
                myNavigatedId: await fetchLoginCredentialData(),
                canPost: stringKey.canPost,
                backDisable: 'disable',
              });
            } else {
              navigation.navigate(route.name);
            }
          }
        };

        // const onPress = async () => {
        //   const event = navigation.emit({
        //     type: 'tabPress',
        //     target: route.key,
        //   });

        //   if (!isFocused && !event.defaultPrevented) {
        //     // Custom logic for each tab touch event
        //     console.log(`${route.name} tab pressed`);
        //     // Example: Trigger a specific action on "Home" tab press
        //     if (route.name === 'Home') {
        //       // Do something when Home tab is pressed
        //       console.log('Home tab touched!');
        //       navigation.navigate(route.name);
        //     } else if (route.name === 'Notification') {
        //       // Do something specific for Notification tab
        //       console.log('Notification tab touched!');
        //       navigation.navigate(route.name);
        //     } else if (route.name === 'UserProfile') {
        //       // Navigate to UserProfile with additional params
        //       navigation.navigate(route.name, {
        //         myNavigatedId: await fetchLoginCredentialData(),
        //         canPost: stringKey.canPost,
        //         backDisable: 'disable',
        //       });
        //     } else {
        //       navigation.navigate(route.name);
        //     }
        //   }
        // };

        const tabIcon = getTabIcon(route.name);
        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={{flex: 1, padding: 10, marginBottom: 10}}>
            <Image
              style={{
                resizeMode: 'contain',
                width: 22,
                height: 22,
                tintColor: isFocused ? color.Primary : color.Grey300,
              }}
              source={tabIcon}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <MyTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: Platform.OS === 'android' ? 5 : 0, // Elevation for Android
          shadowColor: Platform.OS === 'ios' ? 'red' : 'red', // Shadow color for iOS
          shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0,
          shadowOffset:
            Platform.OS === 'ios'
              ? {width: 0, height: 10}
              : {width: 0, height: 0},
          shadowRadius: Platform.OS === 'ios' ? 10 : 0,
          backgroundColor: 'orange',
          borderTopWidth: 0,
          borderTopColor: 'transparent',
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'grey',
      }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Notification" component={Notification} />
      {/* <Tab.Screen
        name="ShortVideoNew"
        component={ShortVideoNew}
        options={{unmountOnBlur: true}}
      /> */}
      <Tab.Screen
        name="StreamingListMain"
        component={StreamingListMain}
        options={{unmountOnBlur: true}}
      />
      <Tab.Screen name="UserProfile" component={UserProfile} />
      <Tab.Screen name="Setting" component={Setting} />
    </Tab.Navigator>
  );
}
