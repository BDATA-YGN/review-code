import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import COLOR from '../../constants/COLOR';
import IconManager from '../../assets/IconManager';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {retrieveStringData, storeKeys} from '../../helper/AsyncStorage';
import {filterSearchList} from '../../helper/ApiModel';
import SearchEmpty from './SearchEmpty';
import {
  setGroupList,
  setPageList,
  setSearchDarkMode,
  setSearchText,
  setUserList,
} from '../../stores/slices/searchSlice';
import UsersRoute from './userRoute';
import PagesRoute from './pageRoute';
import GroupsRoute from './groupRoute';
import {FontFamily} from '../../constants/FONT';

const SearchMain = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const isDarkMode = useSelector(state => state.DarkModeSlice.isDarkMode);
  const [text, setText] = useState('');

  const dispatch = useDispatch();
  const userList = useSelector(state => state.SearchSlice.userList);
  const pageList = useSelector(state => state.SearchSlice.pageList);
  const groupList = useSelector(state => state.SearchSlice.groupList);
  const searchText = useSelector(state => state.SearchSlice.searchText);

  const handleSetText = val => {
    dispatch(setSearchText(val));
    setText(val);
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

  const getDarkModeTheme = async () => {
    try {
      const darkModeValue = await retrieveStringData({
        key: storeKeys.darkTheme,
      });
      if (darkModeValue !== null || undefined) {
        setDarkMode(darkModeValue);
        dispatch(setSearchDarkMode(darkModeValue));
      }
    } catch (error) {
      console.error('Error retrieving dark mode theme:', error);
    }
  };

  const getApiData = async search_key => {
    setLoading(true);
    await filterSearchList(search_key).then(data => {
      if (data.api_status == 200) {
        dispatch(setUserList(data.users));
        dispatch(setPageList(data.pages));
        dispatch(setGroupList(data.groups));
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  };

  const handleSearch = () => {
    getApiData(searchText);
  };

  const handleClear = () => {
    dispatch(setSearchText(''));
    setText('');
  };

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'users', title: 'Users'},
    {key: 'groups', title: 'Groups'},
    {key: 'pages', title: 'Pages'},
  ]);

  const renderScene = SceneMap({
    users: UsersRoute,
    groups: GroupsRoute,
    pages: PagesRoute,
  });

  const renderCustomTabBar = props => (
    <TabBar
      {...props}
      renderLabel={({route, focused}) => (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            borderWidth: 0,
            width: 110,
            height: 40,
            marginBottom: 8,
            backgroundColor: focused
              ? COLOR.Primary
              : darkMode === 'enable'
              ? COLOR.DarkFadeLight
              : COLOR.Grey50,
          }}>
          <Text
            style={
              focused
                ? [
                    styles.activeTabText,
                    darkMode === 'enable' && {color: COLOR.White100},
                  ]
                : [
                    styles.inactiveTabText,
                    darkMode === 'enable' && {color: COLOR.White100},
                  ]
            }>
            {route.title}
          </Text>
        </View>
      )}
      indicatorStyle={
        darkMode === 'enable' ? styles.darkIndicator : styles.indicator
      }
      style={darkMode === 'enable' ? styles.darkTabBar : styles.tabBar}
    />
  );

  return (
    <SafeAreaView
      style={
        darkMode === 'enable'
          ? {flex: 1, backgroundColor: COLOR.DarkTheme}
          : {flex: 1, backgroundColor: COLOR.White100}
      }>
      <ActionAppBar
        appBarText="Search"
        source={
          darkMode === 'enable' ? IconManager.back_dark : IconManager.back_light
        }
        backpress={() => navigation.pop()}
        actionButtonType="image-button"
        actionButtonImage={
          darkMode === 'enable'
            ? IconManager.search_dark
            : IconManager.search_light
        }
        actionButtonPress={() => setSearchVisible(true)}
        isSearchVisible={isSearchVisible}
        searchText={text}
        setSearchText={handleSetText}
        handleSearch={handleSearch}
        handleClearInput={handleClear}
        darkMode={darkMode}
        borderBottom="enable"
      />
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: 300}} // Adjust the width based on your layout
        renderTabBar={renderCustomTabBar} // Custom TabBar
        style={{marginBottom: 0, gap: 8}}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLOR.White100, // TabBar background color
    shadowOpacity: 0.1,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd', // Border color below TabBar
  },
  darkTabBar: {
    backgroundColor: COLOR.DarkTheme, // TabBar background color
    shadowOpacity: 0.1,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.DarkThemLight, // Border color below TabBar
  },
  activeTabText: {
    fontSize: 16,
    color: COLOR.White100, // Active tab text color
    fontFamily: FontFamily.PoppinSemiBold, // Customize active tab font
  },
  inactiveTabText: {
    fontSize: 16,
    color: COLOR.Grey500, // Inactive tab text color
    fontFamily: FontFamily.PoppinRegular, // Customize inactive tab font
  },
  indicator: {
    backgroundColor: COLOR.White100, // Color of the bottom indicator
    height: '100%', // Height of the indicator
    borderRadius: 5,
  },
  darkIndicator: {
    backgroundColor: COLOR.DarkTheme, // Color of the bottom indicator
    height: '100%', // Height of the indicator
    borderRadius: 5,
  },
  listItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
  },
  listText: {
    fontSize: 16,
  },
});

export default SearchMain;
