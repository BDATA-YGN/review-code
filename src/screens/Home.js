import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  FlatList,
  View,
  StyleSheet,
  Text,
  BackHandler,
} from 'react-native';
import AppBar from '../components/AppBar';
import COLOR from '../constants/COLOR';
import CreatePost from './Post/CreatePost';
import Story from './Story/Story';
import CreateStory from './Story/CreateStory';
import Post from './Post/Post';
import {getPostsData, getStories, getUserInfoData} from '../helper/ApiModel';
import PIXEL from '../constants/PIXEL';
import SPACING from '../constants/SPACING';
import {RefreshControl} from 'react-native-gesture-handler';
import {store} from '../stores/store';
import {setFetchNewFeedData} from '../stores/slices/PostSlice';
import ActionAppBar from '../commonComponent/ActionAppBar';
import {retrieveStringData, storeKeys} from '../helper/AsyncStorage';
import {setFetchDarkMode} from '../stores/slices/DarkModeSlice';
import {useDispatch, useSelector} from 'react-redux';
import PostingStatusBar from '../components/Post/PostStatusBar';
import {stringKey} from '../constants/StringKey';
import {
  setSuccessPosting,
  setErrorPosting,
} from '../stores/slices/AddPostSlice';
import {useFocusEffect, useScrollToTop} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';

const Home = () => {
  const [userData, setUserData] = useState({});
  const [stories, setStories] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const scrollRef = useRef(null);
  const navigationAppBar = useNavigation();
  useScrollToTop(scrollRef);
  const [userId, setUserId] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
    getDarkModeTheme();
  }, []);
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
  const fetchData = async () => {
    try {
      const userDataResponse = await getUserInfoData();
      if (userDataResponse.api_status == 404) {
        console.log('user not found');
        navigationAppBar.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
        return; // Stop further processing
      }
      setUserData(userDataResponse.user_data);
      setUserId(userDataResponse?.user_data?.user_id);

      const storyDataResponse = await getStories('get-user-stories');
      setStories(storyDataResponse.stories);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const data = [
    // {type: 'CreatePost'},
    // {type: 'gap'},
    // {type: 'Story'},
    // {type: 'CreateStory'},
    // {type: 'gap'},
    // {type: 'PostingStatus'},
    // {type: 'gap'},
    // {type: 'Post'},
  ];

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
        return null;
      // return <CreatePost userData={userData} darkMode={darkMode} />;
      case 'gap':
        return (
          <View
            style={
              darkMode == 'enable' ? styles.darkModegapStyle : styles.gapStyle
            }
          />
        );
      case 'Story':
        return <Story stories={stories} userData={userData} />;
      case 'PostingStatus':
        return loadingPosting || successPosting || errorPosting ? (
          <View>
            <View
              style={
                darkMode == 'enable' ? styles.darkModegapStyle : styles.gapStyle
              }
            />
            <PostingStatusBar
              postingStatus={
                loadingPosting
                  ? 'loading'
                  : successPosting
                  ? 'success'
                  : errorPosting
                  ? 'error'
                  : ''
              }
              darkMode={darkMode}
            />
          </View>
        ) : null;
      // case 'CreateStory':
      //   return <CreateStory />;
      case 'Post':
        return (
          <Post
            postType={stringKey.navigateToNewFeeds}
            userId={0}
            userData={userData}
            darkMode={darkMode}
          />
        );
      default:
        return null;
    }
  };

  const onPressAppBarIcon = screen => {
    navigationAppBar.navigate(screen, {userId: userId});
  };
  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(setFetchNewFeedData(true));
    fetchData();

    setRefreshing(false);
  };
  return (
    <SafeAreaView
      style={
        darkMode == 'enable'
          ? styles.darkModehomeContainer
          : styles.homeContainer
      }>
      {/* <StatusBar animated={true} backgroundColor={darkMode == 'enable' ? COLOR.DarkThemLight : COLOR.White} barStyle={darkMode === 'enable' ? "light-content" : 'dark-content'}/> */}
      <AppBar
        onPressSearch={() => onPressAppBarIcon('SearchMain')}
        isAppLogo
        isHome
        darkMode={darkMode}
      />
      {/* <FlatList
        data={data}
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        renderItem={renderListItem}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLOR.Primary]}
            progressBackgroundColor={
              darkMode == 'enable' ? COLOR.DarkThemLight : COLOR.White100
            }
          />
        }
      /> */}
      <Post
        postType={stringKey.navigateToNewFeeds}
        userId={0}
        userData={userData}
        darkMode={darkMode}
      />
    </SafeAreaView>
  );
};

export default Home;
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
});
