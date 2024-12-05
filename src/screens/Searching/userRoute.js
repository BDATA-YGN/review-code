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
  getAcceptFollowUser,
  submitFollowRequest,
} from '../../helper/ApiModel';
import {
  setGroupList,
  setPageList,
  setUserList,
} from '../../stores/slices/searchSlice';
import {calculateTimeDifference} from '../../helper/Formatter';
import {useNavigation} from '@react-navigation/native';
import SearchEmpty from './SearchEmpty';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {retrieveStringData, storeKeys} from '../../helper/AsyncStorage';
import COLOR from '../../constants/COLOR';
import {FontFamily, fontSizes} from '../../constants/FONT';

const UsersRoute = () => {
  const [clickedIndex, setClickedIndex] = useState(null); // Track clicked button index
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null); // Create ref for FlatList
  const dispatch = useDispatch();
  const userList = useSelector(state => state.SearchSlice.userList);
  console.log(userList)
  const darkMode = useSelector(state => state.SearchSlice.isDarkMode);
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

  const handleMakeButtonClick = async (index, item) => {
    try {
      setClickedIndex(index); // Save clicked button index
      await onSubmitFollow(item.user_id);

      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index,
          animated: true,
        });
      }
    } catch (error) {
      console.error('Error in handleMakeButtonClick:', error);
    }
  };

  const onSubmitFollow = async user_id => {
    await submitFollowRequest(user_id).then(async data => {
      if (data.api_status == 200) {
        console.log('Success floower request');
        await getApiData(searchText);
      } else {
        // setLoading(true)
        await getApiData(searchText);
      }
    });
  };

  const handleSearch = () => {
    getApiData(searchText);
  };

  const acceptRejectFriend = async (item, type) => {
    const user_id = item.user_id;
    try {
      const data = await getAcceptFollowUser(type, user_id);
      if (data.api_status === 200) {
        // Alert.alert('Alert');
        await getApiData(searchText);
      }
    } catch (error) {
      console.error(
        'Error while processing follow request action:',
        error.message,
      );
    }
  };

  return (
    <>
      {userList.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={userList}
          initialScrollIndex={clickedIndex}
          keyExtractor={item => item.user_id}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('OtherUserProfile', {
                  otherUserData: item,
                  userId: item.user_id,
                });
              }}
              activeOpacity={0.8}
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
                  gap: 8,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: 8,
                    width: '65%',
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
                        
                        {/* {`${item.first_name} ${item.last_name}`} */}
                        {item.first_name !== '' ? `${item.first_name} ${item.last_name}` : item.username}
                        </Text>
                    {/* <Text>{`is request to me : ${item.is_requst_to_me}`}</Text>
                    <Text>{`is friend to me : ${item.is_friend_to_me}`}</Text> */}
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
                      {calculateTimeDifference(item.lastseen)}
                    </Text>
                  </View>
                </View>
                {item.is_requst_to_me ? (
                  <TouchableOpacity
                    onPress={() => {
                      acceptRejectFriend(item, 'accept');
                    }}
                    style={{
                      width: '32%',
                      paddingVertical: 6,
                      borderWidth: 1,
                      borderColor:
                        item.is_friend_confirm === 0
                          ? COLOR.Primary
                          : item.is_friend_confirm === 1
                          ? darkMode === 'enable'
                            ? COLOR.Primary
                            : COLOR.Grey100
                          : item.is_friend_confirm === 2
                          ? darkMode === 'enable'
                            ? COLOR.DarkFadeLight
                            : COLOR.Primary
                          : 'red',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 16,
                      backgroundColor:
                        darkMode === 'enable'
                          ? COLOR.DarkFadeLight
                          : COLOR.AcceptFriend,
                    }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: fontSizes.size12,
                        fontFamily: FontFamily.PoppinSemiBold,
                        color:
                          darkMode === 'enable'
                            ? COLOR.White100
                            : item.is_friend_confirm === 0
                            ? COLOR.White100
                            : COLOR.Grey500,
                      }}>
                      {'Accept'}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    {item.is_friend_to_me ? (
                      <TouchableOpacity
                        onPress={() => handleMakeButtonClick(index, item)}
                        style={{
                          width: '32%',
                          paddingVertical: 6,
                          borderWidth: 1,
                          borderColor:
                            item.is_friend_confirm === 0
                              ? COLOR.Primary
                              : item.is_friend_confirm === 1
                              ? darkMode === 'enable'
                                ? COLOR.Primary
                                : COLOR.Grey100
                              : item.is_friend_confirm === 2
                              ? darkMode === 'enable'
                                ? COLOR.DarkFadeLight
                                : COLOR.Primary
                              : 'red',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 16,
                          backgroundColor:
                            darkMode === 'enable'
                              ? COLOR.DarkFadeLight
                              : COLOR.Grey50,
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
                          {'Unfriend'}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => handleMakeButtonClick(index, item)}
                        style={{
                          width: '32%',
                          paddingVertical: 6,
                          borderWidth: 1,
                          borderColor:
                            item.is_friend_confirm === 0
                              ? COLOR.Primary
                              : item.is_friend_confirm === 1
                              ? darkMode === 'enable'
                                ? COLOR.Primary
                                : COLOR.Grey100
                              : item.is_friend_confirm === 2
                              ? darkMode === 'enable'
                                ? COLOR.DarkFadeLight
                                : COLOR.Primary
                              : 'red',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 16,
                          backgroundColor:
                            item.is_friend_confirm === 0
                              ? COLOR.Primary
                              : item.is_friend_confirm === 1
                              ? darkMode === 'enable'
                                ? COLOR.DarkFadeLight
                                : COLOR.Grey50
                              : item.is_friend_confirm === 2
                              ? darkMode === 'enable'
                                ? COLOR.DarkFadeLight
                                : COLOR.White100
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
                                : item.is_friend_confirm === 0
                                ? COLOR.White100
                                : COLOR.Grey500,
                          }}>
                          {item.is_friend_confirm === 0
                            ? 'Add'
                            : item.is_friend_confirm === 1
                            ? 'Requested'
                            : item.is_friend_confirm === 2
                            ? 'Unfreind'
                            : 'Error'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
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
  footerLoader: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#CED0CE',
  },
});

export default UsersRoute;
