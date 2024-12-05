import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {calculateTimeDifference} from '../../helper/Formatter';
import DualAvater from '../../components/DualAvater';
import IconManager from '../../assets/IconManager';
import {
  LoginUserPostOptions,
  NonLoginUserPostOptions,
  postPrivary,
} from '../../constants/CONSTANT_ARRAY';
import SPACING from '../../constants/SPACING';
import PIXEL from '../../constants/PIXEL';
import {FontFamily, fontSizes} from '../../constants/FONT';
import COLOR from '../../constants/COLOR';
import ModalComponent from '../../commonComponent/ModalComponent';
import {retrieveJsonData, storeKeys} from '../../helper/AsyncStorage';
import {useNavigation} from '@react-navigation/core';
import {stringKey} from '../../constants/StringKey';
import IconPic from '../Icon/IconPic';
import SizedBox from '../../commonComponent/SizedBox';
import {logJsonData} from '../../helper/LiveStream/logFile';

const PostHeader = props => {
  const [openModal, setOpenModal] = useState(false);
  const [options, setOptions] = useState([]);
  const [isLoginUser, setLogInUser] = useState(null);
  const [loginUserId, setLoginUserId] = useState(null);
  const navigation = useNavigation();

  const postPrivacyIndexMap = {
    0: 0, // id: 0 (everyone)
    1: 1, // id: 1 (myfriend)
    6: 2, // id: 6 (monetization)
    3: 3, // id: 3 (onlyme)
    4: 4, // id: 4 (anonymous)
  };

  // Get the correct index using the postPrivacy value
  const postPrivacyIndex = postPrivacyIndexMap[props.data?.postPrivacy];

  const feeling =
    props.data.postFeeling ||
    props.data.postListening ||
    props.data.postTraveling ||
    props.data.postWatching ||
    props.data.postPlaying;
  const feelingIcon = props.data.postFeeling
    ? 'feeling_light'
    : props.data.postListening
    ? 'listening_light'
    : props.data.postTraveling
    ? 'traveling_light'
    : props.data.postWatching
    ? 'watching_light'
    : props.data.postPlaying
    ? 'playing_light'
    : null;
  const feelingType = props.data.postFeeling
    ? 'feeling'
    : props.data.postListening
    ? 'listening to'
    : props.data.postTraveling
    ? 'traveling to'
    : props.data.postWatching
    ? 'watching'
    : props.data.postPlaying
    ? 'playing'
    : null;
  useEffect(() => {
    checkUserType();
    // console.log(props.data?.publisher);
  }, [props.data]);
  const checkUserType = async () => {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const user_id = loginData.user_id;
    setLogInUser(user_id == props.data.publisher.user_id);
    user_id === props.data.publisher.user_id && setLoginUserId(user_id);
  };
  useEffect(() => {
    const newOptions = isLoginUser
      ? LoginUserPostOptions
      : NonLoginUserPostOptions;
    setOptions(newOptions);
  }, [isLoginUser]);
  const goToProfile = async () => {
    if (isLoginUser) {
      if (props.data?.page_id === '0') {
        navigation.navigate('UserProile', {
          myNavigatedId: loginUserId,
          canPost: stringKey.canPost,
          backDisable: 'enable',
        });
      } else {
        navigation.navigate('ViewMyPage', {
          pageData: props.data?.publisher,
          myNavigatedId: props.data?.page_id,
          canPost: stringKey.canPost,
        });
      }
    } else {
      if (props.data?.page_id === '0') {
        navigation.navigate('OtherUserProfile', {
          otherUserData: props.data.publisher,
          userId: props.data.publisher?.user_id,
        });
      } else {
        // ViewLikedPage
        navigation.navigate('ViewLikedPage', {
          pageData: props.data?.publisher,
          myNavigatedId: props.data?.page_id,
          canPost: stringKey.canPost,
        });
      }
    }
  };

  const goToGroup = () => {
    if (props.data?.is_group_post === true) {
      if (props.data?.group_recipient?.is_group_joined === 1) {
        navigation.navigate('ViewJoinedGroup', {
          pageData: props.data?.group_recipient,
          myNavigatedId: props.data?.group_recipient?.id,
          canPost: stringKey.canPost,
        });
      } else {
        navigation.navigate('ViewRecommendedGroup', {
          pageData: props.data?.group_recipient,
          myNavigatedId: props.data?.group_recipient?.id,
        });
      }
    } else {
      navigation.navigate('ViewMyGroup', {
        pageData: props.data?.group_recipient,
        myNavigatedId: props.data?.group_recipient?.id,
        canPost: stringKey.canPost,
      });
    }
  };
  if (isLoginUser == null) return null;
  const feelingImage = IconManager[feeling];
  const feelingActivityImage = IconManager[feelingIcon];
  return (
    <View style={[styles.cardHeader, !props.isShared && {marginTop: 15}]}>
      <View style={styles.headerLeft}>
        {props.isFromShare ? (
          <DualAvater
            largerImageWidth={PIXEL.px55}
            // onPress={goToProfile}
            largerImageHeight={PIXEL.px55}
            source={{uri: props.data?.publisher?.avatar}}
            iconBadgeEnable={false}
          />
        ) : (
          <>
            {props.data?.postPrivacy === '4' && props.data?.shared_info == null ? (
              <DualAvater
                largerImageWidth={PIXEL.px55}
                // onPress={goToProfile}
                largerImageHeight={PIXEL.px55}
                source={IconManager.default_user}
                iconBadgeEnable={false}
              />
            ) :  props.data?.postPrivacy === '4' ? (
              <DualAvater
                largerImageWidth={PIXEL.px55}
                onPress={goToProfile}
                largerImageHeight={PIXEL.px55}
                source={{uri: props.data?.publisher?.avatar}}
                iconBadgeEnable={false}
              />
            ) :(
              <DualAvater
                largerImageWidth={PIXEL.px55}
                onPress={goToProfile}
                largerImageHeight={PIXEL.px55}
                source={{uri: props.data?.publisher?.avatar}}
                iconBadgeEnable={false}
              />
            )}
          </>
        )}

        <View style={styles.userinfo}>
          {props.isFromShare ? (
            <TouchableOpacity
              activeOpacity={props.isFromShare ? 1 : 0.9}
              // onPress={goToProfile}
              style={styles.user}>
              {props.data?.publisher?.first_name ? (
                <Text
                  style={[
                    styles.username,
                    props.darkMode == 'enable'
                      ? {color: COLOR.White}
                      : {color: COLOR.Grey500},
                  ]}>
                  {props.data?.publisher?.first_name}{' '}
                  {props.data?.publisher?.last_name}
                </Text>
              ) : (
                <Text
                  style={[
                    styles.username,
                    props.darkMode == 'enable'
                      ? {color: COLOR.White}
                      : {color: COLOR.Grey500},
                  ]}>
                  {props.data?.publisher?.page_title}
                </Text>
              )}

              {props.data?.postType === 'profile_picture' && (
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[
                      styles.withother,
                      props.darkMode == 'enable'
                        ? {color: COLOR.White}
                        : {color: COLOR.Grey300},
                    ]}>
                    updated{' '}
                  </Text>
                </View>
              )}
              {props.data?.postType === 'profile_cover_picture' && (
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[
                      styles.withother,
                      props.darkMode == 'enable'
                        ? {color: COLOR.White}
                        : {color: COLOR.Grey300},
                    ]}>
                    updated{' '}
                  </Text>
                </View>
              )}

              {feeling && !props.data.shared_info ? (
                <View style={{flexDirection: 'row'}}>
                  {feelingIcon != 'feeling' && (
                    <Image
                      source={feelingActivityImage}
                      resizeMode="contain"
                      style={{
                        width: PIXEL.px15,
                        height: PIXEL.px15,
                        marginRight: SPACING.sp5,
                      }}
                    />
                  )}
                  <Text
                    style={[
                      styles.withother,
                      props.darkMode == 'enable'
                        ? {color: COLOR.White}
                        : {color: COLOR.Grey300},
                    ]}>
                    is {feelingType}
                  </Text>
                  {feelingIcon === 'feeling' && (
                    <Image
                      source={feelingImage}
                      resizeMode="contain"
                      style={{
                        width: PIXEL.px15,
                        height: PIXEL.px15,
                        marginLeft: SPACING.sp5,
                      }}
                    />
                  )}
                </View>
              ) : null}
              {props.data?.group_recipient?.group_name && (
                <>
                  {props.postType === stringKey.navigateToMyGroup ? null : (
                    <>
                      <Image
                        resizeMode="contain"
                        style={{
                          width: PIXEL.px25,
                          height: PIXEL.px25,
                          marginEnd: SPACING.sp5,
                        }}
                        source={
                          props.darkMode == 'enable'
                            ? IconManager.long_arrow_dark
                            : IconManager.long_arrow_light
                        }
                      />
                      <TouchableOpacity onPress={() => goToGroup()}>
                        <Text
                          numberOfLines={1}
                          style={[
                            styles.withotherNew,
                            props.darkMode == 'enable'
                              ? {color: COLOR.White, overflow: 'hidden'}
                              : {color: COLOR.Grey300, overflow: 'hidden'},
                          ]}>
                          {props.data?.group_recipient?.name}
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </>
              )}

              <Text
                style={[
                  styles.withother,
                  props.darkMode == 'enable'
                    ? {color: COLOR.White}
                    : {color: COLOR.Grey300},
                ]}>
                {props.sharedText &&
                  !props.data?.group_recipient?.group_name &&
                  ' shared a post.'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={props.isFromShare ? 1 : 0.9}
              onPress={props.data?.postPrivacy === '4' ? null : goToProfile}
              style={styles.user}>
              {props.data?.publisher?.first_name ? (
                <>
                  {props.data?.postPrivacy === '4' ? (
                    <Text
                      style={[
                        styles.username,
                        props.darkMode == 'enable'
                          ? {color: COLOR.White}
                          : {color: COLOR.Grey500},
                      ]}>
                      Anonymous
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.username,
                        props.darkMode == 'enable'
                          ? {color: COLOR.White}
                          : {color: COLOR.Grey500},
                      ]}>
                      {props.data?.publisher?.first_name}{' '}
                      {props.data?.publisher?.last_name}
                      {/* {props.data?.publisher?.username} */}
                    </Text>
                  )}
                </>
              ) : props.data?.publisher?.first_name === '' ? (
                <Text
                  style={[
                    styles.username,
                    props.darkMode == 'enable'
                      ? {color: COLOR.White}
                      : {color: COLOR.Grey500},
                  ]}>
                  {props.data?.publisher?.username}
                </Text>
              ) : (
                <Text
                  style={[
                    styles.username,
                    props.darkMode == 'enable'
                      ? {color: COLOR.White}
                      : {color: COLOR.Grey500},
                  ]}>
                  {props.data?.publisher?.page_title}
                </Text>
              )}

              {props.data?.postType === 'profile_picture' && (
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[
                      styles.withother,
                      props.darkMode == 'enable'
                        ? {color: COLOR.White}
                        : {color: COLOR.Grey300},
                    ]}>
                    updated{' '}
                  </Text>
                </View>
              )}
              {props.data?.postType === 'profile_cover_picture' && (
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[
                      styles.withother,
                      props.darkMode == 'enable'
                        ? {color: COLOR.White}
                        : {color: COLOR.Grey300},
                    ]}>
                    updated{' '}
                  </Text>
                </View>
              )}

              {feeling && !props.data.shared_info ? (
                <View style={{flexDirection: 'row'}}>
                  {feelingIcon != 'feeling' && (
                    <Image
                      source={feelingActivityImage}
                      resizeMode="contain"
                      style={{
                        width: PIXEL.px15,
                        height: PIXEL.px15,
                        marginRight: SPACING.sp5,
                      }}
                    />
                  )}
                  <Text
                    style={[
                      styles.withother,
                      props.darkMode == 'enable'
                        ? {color: COLOR.White}
                        : {color: COLOR.Grey300},
                    ]}>
                    is {feelingType}
                  </Text>
                  {feelingIcon === 'feeling' && (
                    <Image
                      source={feelingImage}
                      resizeMode="contain"
                      style={{
                        width: PIXEL.px15,
                        height: PIXEL.px15,
                        marginLeft: SPACING.sp5,
                      }}
                    />
                  )}
                </View>
              ) : null}
              {props.data?.group_recipient?.group_name && (
                <>
                  {props.postType === stringKey.navigateToMyGroup ? null : (
                    <>
                      <Image
                        resizeMode="contain"
                        style={{
                          width: PIXEL.px25,
                          height: PIXEL.px25,
                          marginEnd: SPACING.sp5,
                        }}
                        source={
                          props.darkMode == 'enable'
                            ? IconManager.long_arrow_dark
                            : IconManager.long_arrow_light
                        }
                      />
                      <TouchableOpacity onPress={() => goToGroup()}>
                        <Text
                          numberOfLines={1}
                          style={[
                            styles.withotherNew,
                            props.darkMode == 'enable'
                              ? {color: COLOR.White, overflow: 'hidden'}
                              : {color: COLOR.Grey300, overflow: 'hidden'},
                          ]}>
                          {props.data?.group_recipient?.name}
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </>
              )}

              {props.data?.recipient_exists && (
                <>
                  <Image
                    resizeMode="contain"
                    style={{
                      width: PIXEL.px25,
                      height: PIXEL.px25,
                      marginEnd: SPACING.sp5,
                    }}
                    source={
                      props.darkMode == 'enable'
                        ? IconManager.long_arrow_dark
                        : IconManager.long_arrow_light
                    }
                  />

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('OtherUserProfile', {
                        otherUserData: props.data.recipient,
                        userId: props.data.recipient?.user_id,
                      })
                    }>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.withotherNew,
                        props.darkMode == 'enable'
                          ? {color: COLOR.White, overflow: 'hidden'}
                          : {color: COLOR.Grey300, overflow: 'hidden'},
                      ]}>
                      {props.data?.recipient?.first_name}{' '}
                      {props.data?.recipient?.last_name}
                    </Text>
                  </TouchableOpacity>

                  {/* <TouchableOpacity  activeOpacity={props.isFromShare ? 1 : 0.9} style={styles.user}>
                       
                        <Text
                  style={[
                    styles.username,
                    props.darkMode == 'enable'
                      ? {color: COLOR.White}
                      : {color: COLOR.Grey500},
                  ]}>
                  {props.data?.recipient?.first_name}{' '}
                  {props.data?.recipient?.last_name}
                </Text>
                        
                      </TouchableOpacity> */}
                </>
              )}

              {props.data?.event && (
                <>
                  <Image
                    resizeMode="contain"
                    style={{
                      width: PIXEL.px25,
                      height: PIXEL.px25,
                      marginEnd: SPACING.sp5,
                    }}
                    source={
                      props.darkMode == 'enable'
                        ? IconManager.long_arrow_dark
                        : IconManager.long_arrow_light
                    }
                  />
                </>
              )}
            </TouchableOpacity>
          )}

          {/* event post text for share and you */}
          {props.data?.event && (
            <Text
              numberOfLines={1}
              style={[
                styles.withotherNew,
                props.darkMode == 'enable'
                  ? {
                      color: COLOR.White,
                      overflow: 'hidden',
                      top: Platform.OS === 'ios' ? null : 2,
                      paddingLeft: SPACING.sp10,
                    }
                  : {
                      color: COLOR.Grey300,
                      overflow: 'hidden',
                      top: Platform.OS === 'ios' ? null : 2,
                      paddingLeft: SPACING.sp10,
                    },
              ]}>
              {`Created new event ${
                props.sharedText && !props.data?.group_recipient?.group_name
                  ? ' shared a post.'
                  : ''
              }`}
            </Text>
          )}

          {/* feeling post text */}
          {feeling && !props.data.shared_info && (
            <Text
              style={{
                flexDirection: 'row',
                fontSize: Platform.OS === 'ios' ? 12 : 14,
                fontWeight: '500',
                color: Platform.OS === 'ios' ? COLOR.Grey500 : COLOR.Grey500,
                // alignItems: 'center',
                top: Platform.OS === 'ios' ? null : -3,
                paddingLeft: SPACING.sp7,
              }}>
              {' ' + feeling}
            </Text>
          )}

          {/* cover picture updated post of text */}
          {props.data?.postType === 'profile_cover_picture' && (
            <Text
              style={
                props.darkMode == 'enable'
                  ? {
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingLeft: SPACING.sp10,
                      top: -5,
                      fontSize: fontSizes.size12,
                      fontFamily: 'Poppins-Regular',
                      color: COLOR.White,
                    }
                  : {
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingLeft: SPACING.sp10,
                      top: -5,
                      fontSize: fontSizes.size12,
                      fontFamily: 'Poppins-Regular',
                      color: COLOR.Grey300,
                    }
              }>
              {props.data?.publisher?.gender == 'male' ? 'his ' : 'her '}
              cover picture.
            </Text>
          )}

          {/* profile picture updated post of text */}
          {props.data?.postType === 'profile_picture' && (
            <Text
              style={
                props.darkMode == 'enable'
                  ? {
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingLeft: SPACING.sp10,
                      top: -5,
                      fontSize: fontSizes.size12,
                      fontFamily: 'Poppins-Regular',
                      color: COLOR.White,
                    }
                  : {
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingLeft: SPACING.sp10,
                      top: -5,
                      fontSize: fontSizes.size12,
                      fontFamily: 'Poppins-Regular',
                      color: COLOR.Grey300,
                    }
              }>
              {props.data?.publisher?.gender == 'male' ? 'his ' : 'her '}
              profile picture.
            </Text>
          )}

          {/* post time */}
          <View style={styles.public}>
            <View style={styles.publicicon}>
              <Image
                source={
                  props.darkMode == 'enable'
                    ? postPrivary[postPrivacyIndex]?.iconDark
                    : postPrivary[postPrivacyIndex]?.iconLight
                }
                style={styles.privacyIconStyle}
                resizeMode="contain"
              />
            </View>
            <Text
              style={[
                styles.publichour,
                props.darkMode == 'enable'
                  ? {color: COLOR.White}
                  : {color: COLOR.Grey300},
              ]}>
              {calculateTimeDifference(props.data?.time)}
            </Text>
          </View>
        </View>
      </View>
      {!props.isShared && (
        <TouchableOpacity
          style={{
            marginLeft: SPACING.sp10,
            flex: 0.3,
            alignItems: 'flex-end',
          }} // Add margin here
          activeOpacity={props.isFromShare ? 1 : 0.9}
          onPress={() => {
            !props.isFromShare && setOpenModal(true);
          }}>
          <Image
            resizeMode="contain"
            source={
              props.darkMode == 'enable'
                ? IconManager.option_dark
                : IconManager.option_light
            }
            style={styles.imageOptions}
          />
        </TouchableOpacity>
      )}
      <ModalComponent
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
        options={options}
        postid={props.data?.post_id}
        fetchSavedPosts={props.handleRemovePost}
        post={props.data}
        pageInfo={props.pageInfo}
        postType={props?.postType}
        darkMode={props.darkMode}
      />
    </View>
  );
};

export default PostHeader;
const styles = StyleSheet.create({
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    // borderWidth: 1,
  },
  userinfo: {
    flexDirection: 'column',
    // justifyContent: 'flex-start',
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: SPACING.sp10,
    flex: 1,
    flexWrap: 'wrap',
  },
  username: {
    fontSize: fontSizes.size19,
    fontFamily: 'Poppins-SemiBold',
    marginRight: SPACING.sp10,

    flexWrap: 'wrap',

    maxWidth: '100%',
  },
  withotherNew: {
    fontSize: fontSizes.size12,
    fontFamily: 'Poppins-Regular',
    overflow: 'hidden',
    flexShrink: 1,
    maxWidth: '100%',
    flexWrap: 'wrap',
    // width: PIXEL.px75,
  },
  withother: {
    fontSize: fontSizes.size12,
    fontFamily: 'Poppins-Regular',
    flexShrink: 1,
    maxWidth: '100%',
    flexWrap: 'wrap',
  },
  public: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: SPACING.sp10,
    top: -5,
  },
  publicicon: {},
  publichour: {
    fontSize: fontSizes.size10,
    fontFamily: 'Poppins-Regular',
    marginLeft: SPACING.sp5,
    marginTop: SPACING.sp2,
  },
  imageOptions: {
    width: PIXEL.px40,
    height: PIXEL.px40,
  },
  cardHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '2.5%',
    // marginTop : 15,
    // borderWidth: 3,

    // paddingVertical: SPACING.sp16,
  },
  privacyIconStyle: {
    width: PIXEL.px10,
    height: PIXEL.px10,
  },
});
