import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
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
import {submitFollowRequest, submitJoinGroup} from '../../helper/ApiModel';
import {stringKey} from '../../constants/StringKey';
import {useNavigation} from '@react-navigation/native';

const GroupList = props => {
  const navigation = useNavigation();
  const [watchId, setWatchId] = useState('');
  const [watchIdEnable, setWatchIdEnable] = useState('1');
  const onSubmit = async (group_id, index) => {
    await submitJoinGroup(group_id).then(data => {
      if (data.api_status == 200) {
        const newData = [...props.groupList];
        // data.join_status == 'requested' ? [newData[index].is_group_joined = 2,newData[index].is_joined = 'no'] : [newData[index].is_group_joined = 0,newData[index].is_joined = 'no']
        data.join_status == 'joined'
          ? [
              (newData[index].is_group_joined = 1),
              (newData[index].is_joined = 'yes'),
            ]
          : [
              (newData[index].is_group_joined = 0),
              (newData[index].is_joined = 'no'),
            ];
        props.setGroupList(newData);
      } else {
        // setLoading(true)
      }
    });
  };
  useEffect(() => {
    watchId !== '' && props.getApiData();
  }, [watchId !== '' && watchId]);
  const renderUserItem = ({item, index}) => (
    <View style={styles.profileHolder} key={index}>
      <TouchableOpacity
        onPress={() => {
          if (props.myIdd === item.user_id) {
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
                setWatchId: setWatchId,
                watchIdEnable: watchIdEnable,
              });
            } else {
              navigation.navigate('ViewRecommendedGroup', {
                pageData: item,
                myNavigatedId: item.group_id,
                canPost: stringKey.canPost,
                setWatchId: setWatchId,
                watchIdEnable: watchIdEnable,
              });
            }
          }
          // navigation.navigate('UserProile', { myNavigatedId: userId, canPost: stringKey.canPost })
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
                {item.group_name}
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
              {item.category}
            </Text>
          </View>
        </View>
        {props.myIdd !== item.user_id && (
          <TouchableOpacity
            onPress={() => onSubmit(item.id, index)}
            style={
              item.is_group_joined === 0
                ? styles.buttonStyle
                : [
                    styles.buttonStyleNotJoin,
                    {
                      backgroundColor:
                        props.darkMode === 'enable' && COLOR.DarkThemLight,
                    },
                  ]
            }>
            <View style={styles.iconAndTextHolder}>
              {/* {item.is_group_joined == 0 && <IconPic source={IconManager.add_user_white} />} */}
              {/* {item.is_group_joined == 0 && <SizedBox width={SPACING.sp6} />} */}
              <Text
                style={
                  item.is_group_joined === 0
                    ? styles.textStyle
                    : styles.textStyleNotJoin
                }>
                {item.is_group_joined === 0
                  ? 'Join Group'
                  : item.is_group_joined === 1
                  ? '    Joined    '
                  : 'Requested'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
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
          {props.groupList.length > 0 ? (
            <View style={{flex: 1}}>
              <SizedBox
                height={SPACING.sp6}
                color={
                  props.darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White
                }
                width="100%"
              />
              <FlatList
                data={props.groupList}
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

export default GroupList;

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
  },
  buttonStyleNotJoin: {
    borderRadius: RADIUS.rd30,
    backgroundColor: COLOR.White100,
    borderWidth: 1,
    borderColor: COLOR.Primary,
  },
  textStyle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.White100,
  },
  textStyleNotJoin: {
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
