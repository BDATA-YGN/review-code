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
import {
  calculateTimeDifference,
  getLastSeenTimestamp,
} from '../../helper/Formatter';
import {submitFollowRequest, submitLikePage} from '../../helper/ApiModel';
import ActionButton from '../../components/Button/ActionButton';
import {stringKey} from '../../constants/StringKey';
import {useNavigation} from '@react-navigation/native';

const PageList = props => {
  const navigation = useNavigation();
  const [watchId, setWatchId] = useState('');
  const [watchIdEnable, setWatchIdEnable] = useState('1');
  const onSubmit = async (page_id, index) => {
    await submitLikePage(page_id).then(data => {
      if (data.api_status == 200) {
        const newData = [...props.pageList];
        {
          data.like_status == 'liked'
            ? (newData[index].is_liked = 'yes')
            : (newData[index].is_liked = 'no');
        }
        props.setPageList(newData);
      } else {
        // setLoading(true)
      }
    });
  };
  useEffect(() => {
    watchId !== '' && props.getApiData();
  }, [watchId !== '' && watchId]);
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
          props.myIdd === item.user_id &&
            navigation.navigate('ViewMyPage', {
              pageData: item,
              myNavigatedId: item.page_id,
              canPost: stringKey.canPost,
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
                {item.page_name}
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
        {props.myIdd === item.user_id ? null : (
          <SizedBox height={SPACING.sp10} />
        )}
        {props.myIdd === item.user_id ? null : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => onSubmit(item.page_id, index)}
              style={
                item.is_liked == 'no'
                  ? styles.buttonStyleLike
                  : [
                      styles.buttonStyleLiked,
                      {
                        backgroundColor:
                          props.darkMode === 'enable' && COLOR.DarkThemLight,
                      },
                    ]
              }>
              <Text
                style={
                  item.is_liked == 'no'
                    ? styles.textStyleLike
                    : styles.textStyleLiked
                }>
                {item.is_liked == 'no' ? 'Like' : 'Liked'}
              </Text>
            </TouchableOpacity>
            <SizedBox width={SPACING.sp8} />
            <TouchableOpacity
              onPress={() => {
                if (item.is_liked == 'no') {
                  navigation.navigate('ViewDiscoverPage', {
                    pageData: item,
                    myNavigatedId: item.page_id,
                    canPost: stringKey.canPost,
                    setWatchId: setWatchId,
                    watchIdEnable: watchIdEnable,
                  });
                } else {
                  navigation.navigate('ViewLikedPage', {
                    pageData: item,
                    myNavigatedId: item.page_id,
                    canPost: stringKey.canPost,
                    setWatchId: setWatchId,
                    watchIdEnable: watchIdEnable,
                  });
                }
              }}
              style={styles.buttonStyleViewPage}>
              <Text style={styles.textStyleViewPage}>View Page</Text>
            </TouchableOpacity>
          </View>
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
          {props.pageList.length > 0 ? (
            <View style={{flex: 1}}>
              <SizedBox
                height={SPACING.sp6}
                color={
                  props.darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White
                }
                width="100%"
              />
              <FlatList
                data={props.pageList}
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

export default PageList;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    backgroundColor : COLOR.White100
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
  buttonStyleLike: {
    borderRadius: RADIUS.rd30,
    backgroundColor: COLOR.Primary,
    borderWidth: 1,
    width: '47%',
    borderColor: COLOR.Primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyleLiked: {
    borderRadius: RADIUS.rd30,
    backgroundColor: COLOR.White100,
    borderWidth: 1,
    width: '47%',
    borderColor: COLOR.Primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyleViewPage: {
    borderRadius: RADIUS.rd30,
    backgroundColor: COLOR.SocialBakcground,
    borderWidth: 1,
    width: '47%',
    borderColor: COLOR.SocialBakcground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyleLike: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.White100,
    paddingVertical: SPACING.sp6,
  },
  textStyleLiked: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.Primary,
    paddingVertical: SPACING.sp6,
  },
  textStyleViewPage: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.Grey500,
    paddingVertical: SPACING.sp6,
  },
  iconAndTextHolder: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.sp6,
    paddingHorizontal: SPACING.sp12,
  },
});
