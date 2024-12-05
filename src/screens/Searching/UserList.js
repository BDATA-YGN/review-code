import React, {useEffect, useState, useRef, useCallback, memo} from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import COLOR from '../../constants/COLOR';
import FriendRequestShimmer from '../FriendRequestShimmer';
import SearchEmpty from './SearchEmpty';
import ListShimmer from '../GroupProfile/ListShimmer';
import {FontFamily, fontSizes} from '../../constants/FONT';
import SPACING from '../../constants/SPACING';
import RADIUS from '../../constants/RADIUS';
import ProfileAvatar from '../../components/Icon/ProfileAvatar';
import IconManager from '../../assets/IconManager';
import SizedBox from '../../commonComponent/SizedBox';
import PIXEL from '../../constants/PIXEL';
import IconPic from '../../components/Icon/IconPic';
import {calculateTimeDifference} from '../../helper/Formatter';
import {submitFollowRequest} from '../../helper/ApiModel';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {stringKey} from '../../constants/StringKey';

const UserList = props => {
  const [deletedIndex, setDeletedIndex] = useState(null);
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const [userList, setUserList] = useState([]);
  const onSubmitFollow = async (user_id, index, item) => {
    await submitFollowRequest(user_id).then(data => {
      if (data.api_status == 200) {
        const newData = [...userList];
        {
          data.follow_status == 'requested'
            ? (newData[index].is_friend_confirm = 1)
            : data.follow_status == 'unfollowed'
            ? (newData[index].is_friend_confirm = 0)
            : null;
          // setUserList(newData);
          props.setUserList(newData);
        }
        // Alert.alert('This is alert!!!',`${userList[index].is_following}`)
        // data.follow_status === 'requested' ? userList[index].is_following = 2 : userList[index].is_following = 0;
      } else {
        // setLoading(true)
      }
    });
  };

  useEffect(() => {
    // Alert.alert("Asdf",`===>${userList.length}`)

    setUserList(props.userList);
  }, []);

  // const momotized = useCallback((userId, index) => {
  //   onSubmitFollow(userId, index);
  // }, []);

  const renderUserItem = ({item, index}) => (
    <View
      style={[
        styles.profileHolder,
        props.darkMode == 'enable'
          ? {backgroundColor: COLOR.DarkTheme}
          : {backgroundColor: COLOR.White},
      ]}
      key={index}>
      <TouchableOpacity
        onPress={() => {
          // navigation.navigate('UserProile', { myNavigatedId: userId, canPost: stringKey.canPost })
          navigation.navigate('OtherUserProfile', {
            otherUserData: item,
            userId: item.user_id,
          });
        }}
        activeOpacity={0.8}
        style={[
          styles.profile,
          props.darkMode == 'enable'
            ? {backgroundColor: COLOR.DarkThemLight}
            : {backgroundColor: COLOR.White100},
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
                  props.darkMode == 'enable'
                    ? {color: COLOR.White}
                    : {color: COLOR.Grey500},
                ]}>
                {item.first_name} {item.last_name}
              </Text>
              <SizedBox width={SPACING.sp4} />
              {item.is_verified == 1 && (
                <IconPic source={IconManager.user_type_light_dark} />
              )}
            </View>
            <Text
              style={[
                styles.viewProfile,
                props.darkMode == 'enable'
                  ? {color: COLOR.White}
                  : {color: COLOR.Grey300},
              ]}>
              {calculateTimeDifference(item.lastseen)}
            </Text>
          </View>
        </View>
        {/* <Text>`{item.is_friend_confirm} {item.is_following} {item.is_following_me}`</Text> */}
        <TouchableOpacity
          onPress={() => onSubmitFollow(item.user_id, index, item)}
          style={
            item.is_friend_confirm == 0
              ? styles.buttonStyle
              : [
                  styles.buttonStyleFriend,
                  {
                    backgroundColor:
                      props.darkMode === 'enable' && COLOR.DarkThemLight,
                  },
                ]
          }>
          <View style={styles.iconAndTextHolder}>
            {item.is_friend_confirm == 0 && (
              <IconPic source={IconManager.add_user_white} />
            )}
            <SizedBox width={SPACING.sp6} />
            <Text
              style={
                item.is_friend_confirm == 0
                  ? styles.textStyle
                  : styles.textStyleFriend
              }>
              {item.is_friend_confirm == 0
                ? 'Add'
                : item.is_friend_confirm == 1
                ? 'Requested'
                : 'Unfriend'}
            </Text>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
  return (
    <View
      style={
        props.darkMode == 'enable'
          ? {flex: 1, backgroundColor: COLOR.DarkTheme}
          : {flex: 1, backgroundColor: COLOR.White50}
      }>
      {props.loading ? (
        <ListShimmer darkMode={props.darkMode} />
      ) : (
        <View style={{flex: 1}}>
          {props.userList.length > 0 ? (
            <View style={{flex: 1}}>
              <SizedBox
                height={SPACING.sp6}
                color={
                  props.darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White
                }
                width="100%"
              />
              <FlatList
                data={props.userList}
                showsVerticalScrollIndicator={false}
                renderItem={renderUserItem}
                keyExtractor={item => item.id}
                horizontal={false}
              />
            </View>
          ) : (
            <SearchEmpty onPress={props.getApiData} darkMode={props.darkMode} />
          )}
        </View>
      )}
    </View>
  );
};

export default UserList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
  },
  tabItem: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
  },
  textColor: {
    color: 'white',
  },
  profileHolder: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  profile: {
    width: '94%',
    borderRadius: RADIUS.rd8,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sp6,
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
    width: '85%',
  },
  viewProfile: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
  },
  buttonStyle: {
    borderRadius: RADIUS.rd30,
    backgroundColor: COLOR.Primary,
    borderWidth: 1,
    borderColor: COLOR.Primary,
    width: '35%',
  },
  buttonStyleFriend: {
    borderRadius: RADIUS.rd30,
    backgroundColor: COLOR.White100,
    borderWidth: 1,
    borderColor: COLOR.Primary,
    width: '35%',
  },
  textStyle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.White100,
  },
  textStyleFriend: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.Primary,
  },
  iconAndTextHolder: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.sp6,
    paddingHorizontal: SPACING.sp12,
  },
});
