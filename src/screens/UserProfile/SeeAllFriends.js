import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import AppBar from '../../components/AppBar';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import IconManager from '../../assets/IconManager';
import COLOR from '../../constants/COLOR';
import RADIUS from '../../constants/RADIUS';
import SPACING from '../../constants/SPACING';
import {FontFamily, fontSizes} from '../../constants/FONT';
import SearchEmpty from '../Searching/SearchEmpty';
import {
  getUserInfoData,
  requestFollowersAndFollowingList,
} from '../../helper/ApiModel';
import {retrieveJsonData, storeKeys} from '../../helper/AsyncStorage';
import ListShimmer from '../GroupProfile/ListShimmer';
import {setFetchUserInfo} from '../../stores/slices/UserInfoSlice';
import SizedBox from '../../commonComponent/SizedBox';
import ProfileAvatar from '../../components/Icon/ProfileAvatar';
import {calculateTimeDifference} from '../../helper/Formatter';
import IconPic from '../../components/Icon/IconPic';
import {submitFollowRequest} from '../../helper/ApiModel';
import {getAcceptFollowUser} from '../../helper/ApiModel';
import {useDispatch, useSelector} from 'react-redux';
import {retrieveStringData} from '../../helper/AsyncStorage';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {useFocusEffect} from '@react-navigation/native';

const SeeAllFriends = () => {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState([]);
  const [filteredFollowing, setFilteredFollowing] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [userId, setUserId] = useState(0);
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const route = useRoute();
  const [darkMode, setDarkMode] = useState(null);
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
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, []),
  );
  const handleSearch = text => {
    setSearchText(text);
    if (text === '') {
      setFilteredFollowing(following);
    } else {
      setFilteredFollowing(
        following.filter(
          user =>
            user.first_name.toLowerCase().includes(text.toLowerCase()) ||
            user.last_name.toLowerCase().includes(text.toLowerCase()),
        ),
      );
    }
  };

  const onSubmitFollow = async (user_id, index) => {
    try {
      const data = await submitFollowRequest(user_id);
      if (data.api_status === 200) {
        const newData = [...following];
        newData[index].is_following =
          data.follow_status === 'requested' ? 2 : 0;
        setFollowing(newData);
        setFilteredFollowing(
          newData.filter(
            user =>
              user.first_name
                .toLowerCase()
                .includes(searchText.toLowerCase()) ||
              user.last_name.toLowerCase().includes(searchText.toLowerCase()),
          ),
        );
      } else {
        console.error('Error updating follow status');
      }
    } catch (error) {
      console.error('Error updating follow status', error);
    }
  };

  const handleClear = () => {
    setSearchText('');
    setFilteredFollowing(following);
  };

  const fetchData = async () => {
    setLoading(true);
    const user_id = route.params.userId;
    try {
      const userDataResponse = await requestFollowersAndFollowingList(
        'followers,following',
        user_id,
      );
      if (userDataResponse.api_status === 200) {
        const filteredData = userDataResponse.data.following.filter(
          item => item.user_id !== user_id,
        );
        setFollowing(filteredData);
        setFilteredFollowing(filteredData);
      } else {
        console.error('Failed getting followers and followings');
      }
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const renderUserItem = ({item, index}) => (
    <View style={styles.profileHolder} key={index}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('OtherUserProfile', {
            otherUserData: item,
            userId: item.user_id,
          });
        }}
        activeOpacity={0.8}
        style={[
          styles.profile,
          {
            backgroundColor:
              darkMode == 'enable' ? COLOR.DarkThemLight : COLOR.White100,
          },
        ]}>
        <View style={styles.profileContentHandle}>
          <ProfileAvatar src={item.avatar} />
          <SizedBox width={SPACING.xs} />
          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '90%',
              }}>
              <Text
                numberOfLines={1}
                style={[
                  styles.username,
                  {color: darkMode == 'enable' ? COLOR.White50 : COLOR.Grey500},
                ]}>
                  {item.first_name !== '' ? `${item.first_name} ${item.last_name}` : item.username}
              </Text>
              <SizedBox width={SPACING.sp4} />
              {item.is_verified == 1 && (
                <IconPic source={IconManager.user_type_light_dark} />
              )}
            </View>
            <Text
              style={[
                styles.viewProfile,
                {color: darkMode == 'enable' ? COLOR.White500 : COLOR.Grey500},
              ]}>
              {item.lastseen_time_text}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => onSubmitFollow(item.user_id, index)}
          style={
            item.is_following == 0
              ? styles.buttonStyle
              : [
                  styles.buttonStyleFriend,
                  {
                    backgroundColor:
                      darkMode === 'enable' && COLOR.DarkThemLight,
                  },
                ]
          }>
          <View style={styles.iconAndTextHolder}>
            {item.is_following == 0 && (
              <IconPic source={IconManager.add_user_white} />
            )}
            <SizedBox width={SPACING.sp6} />
            <Text
              style={
                item.is_following == 1
                  ? styles.textStyle
                  : styles.textStyleFriend
              }>
              {item.is_following == 0
                ? 'Follow'
                : item.is_following == 1
                ? 'Unfriend'
                : 'Requested'}
            </Text>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      style={
        darkMode == 'enable'
          ? {flex: 1, backgroundColor: COLOR.DarkTheme}
          : {flex: 1, backgroundColor: COLOR.White50}
      }>
      <ActionAppBar
        appBarText="Following"
        source={IconManager.back_light}
        backpress={() => navigation.pop()}
        actionButtonType="image-button"
        actionButtonImage={IconManager.search_light}
        actionButtonPress={() => setSearchVisible(true)}
        isSearchVisible={isSearchVisible}
        searchText={searchText}
        setSearchText={handleSearch}
        handleClearInput={handleClear}
        darkMode={darkMode}
      />
      <View
        style={
          darkMode == 'enable'
            ? {flex: 1, backgroundColor: COLOR.DarkTheme}
            : {flex: 1, backgroundColor: COLOR.White50}
        }>
        {loading ? (
          <ListShimmer darkMode={darkMode} />
        ) : (
          <View style={{flex: 1}}>
            {filteredFollowing.length > 0 ? (
              <View style={{flex: 1}}>
                <SizedBox height={SPACING.sp6} width="100%" />
                <FlatList
                  data={filteredFollowing}
                  showsVerticalScrollIndicator={false}
                  renderItem={renderUserItem}
                  keyExtractor={item => item.user_id.toString()}
                  horizontal={false}
                />
              </View>
            ) : (
              <SearchEmpty onPress={fetchData} />
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SeeAllFriends;

const styles = StyleSheet.create({
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
    margin: SPACING.xs,
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
  buttonStyle: {
    borderRadius: RADIUS.rd30,
    backgroundColor: COLOR.Primary,
    borderWidth: 1,
    borderColor: COLOR.Primary,
  },
  buttonStyleFriend: {
    borderRadius: RADIUS.rd30,
    backgroundColor: COLOR.White100,
    borderWidth: 1,
    borderColor: COLOR.Primary,
  },
  textStyle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.Primary,
  },
  textStyleFriend: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.White100,
  },
  iconAndTextHolder: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.sp6,
    paddingHorizontal: SPACING.sp12,
  },
  searchInput: {
    height: 40,
    borderColor: COLOR.Grey300,
    borderWidth: 1,
    borderRadius: RADIUS.rd8,
    paddingHorizontal: SPACING.sp8,
    margin: SPACING.sp4,
  },
});
