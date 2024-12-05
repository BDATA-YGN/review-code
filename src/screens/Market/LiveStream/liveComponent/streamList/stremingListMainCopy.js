import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import COLOR from '../../../../../constants/COLOR';
import StreamingListRoute from './streamingList';
import VideoReelRoute from './videoList';
import {FontFamily} from '../../../../../constants/FONT';
import {getActiveLive} from '../../../../../helper/LiveStream/liveStreamHelper';
import IconManager from '../../../../../assets/IconManager';
import {useDispatch, useSelector} from 'react-redux';
import {setActivePageIndex} from '../../../../../stores/slices/PostSlice';
import {setFetchDarkMode} from '../../../../../stores/slices/DarkModeSlice';
import {
  retrieveStringData,
  storeKeys,
} from '../../../../../helper/AsyncStorage';

const StreamingListMain = () => {
  const layout = Dimensions.get('window');
  const dispatch = useDispatch();
  const activePageIndex = useSelector(state => state.PostSlice.activePageIndex);
  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const activePageIndexCopy = useSelector(
    state => state.PostSlice.activePageIndexCopy,
  );
  const [index, setIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false); // Refreshing state
  const [routes] = useState([
    {key: 'live', title: 'Lives'},
    {key: 'videos', title: 'Videos'},
  ]);
  const renderScene = SceneMap({
    live: StreamingListRoute,
    videos: VideoReelRoute,
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await getActiveLive(dispath); // Fetch new data
    setRefreshing(false); // Stop refreshing once done
  };
  const dispath = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      await getActiveLive(dispath);
    };
    fetchData();
  }, []);

  const handleIndexChange = newIndex => {
    setIndex(newIndex);
    console.log(`Tab changed to index: ${newIndex}`); // Log the tab change
    newIndex === 0
      ? dispath(setActivePageIndex(null))
      : dispath(setActivePageIndex(activePageIndexCopy));
  };

  const handleSwipeStart = () => {
    console.log('Swipe gesture started'); // Log or handle the swipe start event
  };

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
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea]}>
      <View style={[styles.tabViewContainer]}>
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={handleIndexChange} // Use handleIndexChange to log
          initialLayout={{width: layout.width}}
          onSwipeStart={handleSwipeStart} // Listen for swipe start
          swipeEnabled={false}
          renderTabBar={props => (
            <View style={[styles.tabBarContainer]}>
              <TabBar
                {...props}
                style={[
                  styles.tabBar,
                  {
                    backgroundColor:
                      darkMode === 'enable'
                        ? COLOR.DarkThemLight
                        : activePageIndex !== null
                        ? 'rgba(0,0,0,0)'
                        : COLOR.White100,
                  },
                ]}
                labelStyle={styles.tabLabel}
                indicatorStyle={[styles.tabIndicator]}
                tabStyle={[
                  styles.tabStyle,
                  {
                    backgroundColor:
                      darkMode === 'enable'
                        ? COLOR.DarkThemLight
                        : activePageIndex !== null
                        ? 'rgba(0,0,0,0)'
                        : COLOR.White100,
                  },
                ]}
                renderLabel={({route, focused}) => (
                  <View
                    style={[
                      styles.tabLabelContainer,
                      {
                        backgroundColor: focused
                          ? COLOR.PrimaryBlue50
                          : darkMode === 'enable'
                          ? COLOR.DarkFadeLight
                          : COLOR.Blue50,
                      },
                    ]}>
                    <Text
                      style={
                        focused
                          ? [styles.activeTabText]
                          : [
                              styles.inactiveTabText,
                              {
                                color:
                                  darkMode === 'enable'
                                    ? COLOR.White100
                                    : COLOR.Grey500,
                              },
                            ]
                      }>
                      {route.title}
                    </Text>
                  </View>
                )}
              />
              {/* Add refresh button to the right of the tab bar */}
              {/* <TouchableOpacity
                onPress={handleRefresh}
                style={styles.refreshButton}>
                <Image
                  source={IconManager.reload_live}
                  style={{width: 24, height: 24, resizeMode: 'contain'}}
                />
              </TouchableOpacity> */}
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default StreamingListMain;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLOR.White,
    // backgroundColor: 'red',
  },
  tabViewContainer: {
    flex: 1,
    backgroundColor: COLOR.White,
    // marginHorizontal: 12,
    // backgroundColor: 'red',
  },
  tabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Ensure refresh button is on the right
    backgroundColor: COLOR.White,
  },
  tabBar: {
    flex: 1,
    // backgroundColor: COLOR.White,
    elevation: 0,
    // backgroundColor: 'red',
  },
  tabLabelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    // paddingHorizontal: 20,
    marginRight: 8,
    paddingVertical: 8,
    // borderWidth: 1,
    // borderColor: COLOR.Primary,
    width: 100,
  },
  activeTabText: {
    fontSize: 16,
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  inactiveTabText: {
    fontSize: 16,
    color: COLOR.Grey500,
    fontFamily: FontFamily.PoppinRegular,
  },
  tabLabel: {
    fontSize: 16,
    color: COLOR.Grey500,
  },
  tabIndicator: {
    backgroundColor: 'white',
    height: 2,
  },
  tabStyle: {
    width: 'auto',
    paddingHorizontal: 12,
  },
  refreshButton: {
    padding: 8,
    marginRight: 12,
    // backgroundColor: COLOR.Primary,
    borderRadius: 30,
  },
});
