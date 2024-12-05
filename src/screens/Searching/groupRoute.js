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
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  filterSearchList,
  getUserInfoData,
  submitJoinGroup,
} from '../../helper/ApiModel';
import {
  setGroupList,
  setPageList,
  setUserList,
} from '../../stores/slices/searchSlice';
import {
  retrieveJsonData,
  retrieveStringData,
  storeKeys,
} from '../../helper/AsyncStorage';
import {useNavigation} from '@react-navigation/native';
import {stringKey} from '../../constants/StringKey';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import SearchEmpty from './SearchEmpty';
import {FontFamily, fontSizes} from '../../constants/FONT';
import COLOR from '../../constants/COLOR';

const GroupsRoute = () => {
  const [clickedIndex, setClickedIndex] = useState(null); // Track clicked button index
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  // const [page, setPage] = useState(1); // Track current page (commented out pagination)
  // const [loadingMore, setLoadingMore] = useState(false); // Track loading more data state
  const flatListRef = useRef(null); // Create ref for FlatList
  const dispatch = useDispatch();
  const groupList = useSelector(state => state.SearchSlice.groupList);
  const darkMode = useSelector(state => state.SearchSlice.isDarkMode);
  const [userId, setUserId] = useState('0');

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

  // Handle button click and scroll to the clicked position
  const handleMakeButtonClick = async (index, item) => {
    setClickedIndex(index); // Save clicked button index
    await onSubmit(item.id);

    // Scroll back to the clicked button after API call completes
    flatListRef.current?.scrollToIndex({index, animated: true});
  };

  const onSubmit = async group_id => {
    await submitJoinGroup(group_id).then(async data => {
      if (data.api_status == 200) {
        await getApiData(searchText);
      } else {
        // setLoading(true)
      }
    });
  };
  const searchText = useSelector(state => state.SearchSlice.searchText);

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

  return (
    <>
      {groupList.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={groupList}
          keyExtractor={item => item.group_id}
          renderItem={({item, index}) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (userId === item.user_id) {
                  navigation.navigate('ViewMyGroup', {
                    pageData: item,
                    myNavigatedId: item.group_id,
                    canPost: stringKey.canPost,
                  });
                } else {
                  if (item.is_group_joined === 1) {
                    navigation.navigate('ViewJoinedGroup', {
                      pageData: item,
                      myNavigatedId: item.group_id,
                      canPost: stringKey.canPost,
                    });
                  } else {
                    navigation.navigate('ViewRecommendedGroup', {
                      pageData: item,
                      myNavigatedId: item.group_id,
                      canPost: stringKey.canPost,
                    });
                  }
                }
              }}
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
                    width: '68%',
                    overflow: 'hidden',
                  }}>
                  <Image
                    source={{uri: item.avatar}}
                    style={{
                      width: 45,
                      height: 45,
                      resizeMode: 'contain',
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
                      {item.group_title}
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
                {userId !== item.user_id && (
                  <TouchableOpacity
                    onPress={() => {
                      handleMakeButtonClick(index, item);
                      // Alert.alert('a', userId);
                    }}
                    style={{
                      width: '32%',
                      paddingVertical: 6,
                      borderWidth: 1,
                      borderColor:
                        item.is_group_joined === 0
                          ? COLOR.Primary
                          : item.is_group_joined === 1
                          ? COLOR.Primary
                          : item.is_group_joined === 2
                          ? COLOR.Grey100
                          : 'red',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 16,
                      backgroundColor:
                        item.is_group_joined === 0
                          ? COLOR.Primary
                          : item.is_group_joined === 1
                          ? darkMode === 'enable'
                            ? COLOR.DarkFadeLight
                            : COLOR.White100
                          : item.is_group_joined === 2
                          ? darkMode === 'enable'
                            ? COLOR.DarkFadeLight
                            : COLOR.Grey50
                          : 'red',
                    }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: fontSizes.size12,
                        fontFamily: FontFamily.PoppinSemiBold,
                        color:
                          darkMode === 'enable'
                            ? COLOR.White100
                            : item.is_group_joined === 0
                            ? COLOR.White100
                            : COLOR.Grey500,
                      }}>
                      {item.is_group_joined === 0
                        ? 'Join Group'
                        : item.is_group_joined === 1
                        ? 'Joined'
                        : item.is_group_joined === 2
                        ? 'Requested'
                        : 'Error'}
                    </Text>
                  </TouchableOpacity>
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
          // onEndReached={loadMoreData} // Commented out pagination event
          // onEndReachedThreshold={0.5} // Commented out pagination trigger
          // ListFooterComponent={renderFooter} // Commented out footer component
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
    flexDirection: 'row',
    borderRadius: 8,
    marginHorizontal: 12,
  },
  listItemDark: {
    padding: 20,
    borderBottomWidth: 0,
    backgroundColor: COLOR.DarkThemLight,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    borderRadius: 8,
    marginHorizontal: 12,
  },
  listItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
  },
  footerLoader: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#CED0CE',
  },
});

export default GroupsRoute;
