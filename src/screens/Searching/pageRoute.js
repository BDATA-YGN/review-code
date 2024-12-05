import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {filterSearchList, submitLikePage} from '../../helper/ApiModel';
import {
  setGroupList,
  setPageList,
  setUserList,
} from '../../stores/slices/searchSlice';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {
  retrieveJsonData,
  retrieveStringData,
  storeKeys,
} from '../../helper/AsyncStorage';
import SearchEmpty from './SearchEmpty';
import {useNavigation} from '@react-navigation/native';
import {stringKey} from '../../constants/StringKey';
import COLOR from '../../constants/COLOR';
import {FontFamily, fontSizes} from '../../constants/FONT';

const PagesRoute = () => {
  const [clickedIndex, setClickedIndex] = useState(null); // Track clicked button index
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null); // Create ref for FlatList
  const dispatch = useDispatch();
  const pageList = useSelector(state => state.SearchSlice.pageList);
  const searchText = useSelector(state => state.SearchSlice.searchText);
  const darkMode = useSelector(state => state.SearchSlice.isDarkMode);
  const [userId, setUserId] = useState('0');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchLoginData = async () => {
      const loginData = await retrieveJsonData({
        key: storeKeys.loginCredential,
      });
      setUserId(loginData.user_id);
      // Alert.alert(userId); // You can use the userId state here if needed
    };

    fetchLoginData();
  }, []);

  const getApiData = async searchText => {
    setLoading(true);
    await filterSearchList(searchText).then(data => {
      if (data.api_status === 200) {
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

  // Load initial data
  useEffect(() => {
    // getApiData(); // Fetch data on component mount
  }, []);

  // Handle button click and scroll to the clicked position
  const handleMakeButtonClick = async (index, item) => {
    setClickedIndex(index); // Save clicked button index
    await onSubmit(item.page_id); // Simulate API call (you can customize the page for specific results)

    // Scroll back to the clicked button after API call completes
    flatListRef.current?.scrollToIndex({index, animated: true});
  };

  const onSubmit = async page_id => {
    await submitLikePage(page_id).then(async data => {
      if (data.api_status == 200) {
        await getApiData(searchText);
      } else {
        // setLoading(true)
      }
    });
  };

  return (
    <>
      {pageList.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={pageList}
          keyExtractor={item => item.page_id}
          renderItem={({item, index}) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                userId === item.user_id &&
                  navigation.navigate('ViewMyPage', {
                    pageData: item,
                    myNavigatedId: item.page_id,
                    canPost: stringKey.canPost,
                  });
              }}
              style={{flexDirection: 'column'}}>
              <View
                style={
                  darkMode === 'enable'
                    ? styles.listItemDark
                    : styles.listItemLight
                }>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: 8,
                      width: '100%',
                    }}>
                    <Image
                      source={{uri: item.avatar}}
                      style={{
                        width: 45,
                        height: 45,
                        resizeMode: 'cover',
                        borderWidth: 0.3,
                        borderRadius: 20,
                      }}
                    />
                    <View>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: fontSizes.size16,
                          fontFamily: FontFamily.PoppinSemiBold,
                          color:
                            darkMode === 'enable'
                              ? COLOR.White100
                              : COLOR.Grey500,
                        }}>
                        {item.page_name}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: fontSizes.size12,
                          fontFamily: FontFamily.PoppinRegular,
                          color:
                            darkMode === 'enable'
                              ? COLOR.White100
                              : COLOR.Grey500,
                        }}>
                        {item.category}
                      </Text>
                    </View>
                  </View>
                </View>
                {userId !== item.user_id && (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                      gap: 16,
                      marginTop: 16,
                    }}>
                    <TouchableOpacity
                      onPress={() => handleMakeButtonClick(index, item)}
                      style={{
                        width: '50%',
                        paddingVertical: 6,
                        borderWidth: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 16,
                        borderColor:
                          item.is_liked === 'no'
                            ? COLOR.Primary
                            : COLOR.Primary,
                        backgroundColor:
                          item.is_liked === 'no'
                            ? COLOR.Primary
                            : darkMode === 'enable'
                            ? COLOR.DarkFadeLight
                            : COLOR.White100,
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: fontSizes.size12,
                          fontFamily: FontFamily.PoppinSemiBold,
                          color:
                            darkMode === 'enable'
                              ? COLOR.White100
                              : item.is_liked == 'no'
                              ? COLOR.White100
                              : COLOR.Grey500,
                        }}>
                        {item.is_liked == 'no' ? 'Like' : 'Liked'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        if (item.is_liked == 'no') {
                          navigation.navigate('ViewDiscoverPage', {
                            pageData: item,
                            myNavigatedId: item.page_id,
                            canPost: stringKey.canPost,
                          });
                        } else {
                          navigation.navigate('ViewLikedPage', {
                            pageData: item,
                            myNavigatedId: item.page_id,
                            canPost: stringKey.canPost,
                          });
                        }
                      }}
                      style={{
                        width: '50%',
                        paddingVertical: 6,
                        borderWidth: 1,
                        backgroundColor:
                          darkMode === 'enable'
                            ? COLOR.DarkFadeLight
                            : COLOR.SocialBakcground,
                        borderColor:
                          darkMode === 'enable'
                            ? COLOR.DarkFadeLight
                            : COLOR.Blue100,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 16,
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: fontSizes.size12,
                          fontFamily: FontFamily.PoppinSemiBold,
                          color:
                            darkMode === 'enable'
                              ? COLOR.White100
                              : COLOR.Grey500,
                        }}>
                        {'View Page'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
          getItemLayout={(data, index) => ({
            length: 70, // Adjust item height if needed
            offset: 70 * index,
            index,
          })}
          contentContainerStyle={{gap: 8}}
        />
      ) : (
        <SearchEmpty onPress={handleSearch} darkMode={darkMode} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  listItemLight: {
    padding: 16,
    borderBottomWidth: 0,
    backgroundColor: COLOR.Blue50,
    borderBottomColor: '#ccc',
    borderRadius: 8,
    marginHorizontal: 12,
  },
  listItemDark: {
    padding: 20,
    borderBottomWidth: 0,
    backgroundColor: COLOR.DarkThemLight,
    borderBottomColor: '#ccc',
    borderRadius: 8,
    marginHorizontal: 12,
  },
  listItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    // flexDirection: 'row',
    gap: 16,
  },
  footerLoader: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#CED0CE',
  },
});

export default PagesRoute;
