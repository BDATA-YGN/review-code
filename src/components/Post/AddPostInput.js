import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Keyboard,
  TextInput,
} from 'react-native';
import COLOR from '../../constants/COLOR';
import i18n from '../../i18n';
import { fontSizes, FontFamily } from '../../constants/FONT';
import Avater from '../Avater/Avater';
import IconManager from '../../assets/IconManager';
import { useSelector, useDispatch } from 'react-redux';
import { setPostText } from '../../stores/slices/AddPostSlice';
import { stringKey } from '../../constants/StringKey';
import DualAvater from '../DualAvater';

const AddPostInput = props => {
  const dispatch = useDispatch();
  const postText = useSelector(state => state.AddPostSlice.postText);
 
  // const handleTextChange = (text) => {
  //   dispatch(setPostText(text))
  // }

  // const handleTextChange = (text) => {

  //   dispatch(setPostText(text))
  //   if (text.includes('@')) {

  //     const words = text.split(' ');

  //     const lastWord = words[words.length - 1];
  //     if (lastWord.endsWith('@')) {
  //       setMentionListLoader(true);
  //       getFriendList();
  //       setMentionFriendListVisible(true);
  //     }

  //     const search_key = lastWord.substring(lastWord.indexOf('@') + 1);

  //     if (lastWord.endsWith(`@${search_key}`)) {
  //       setMentionListLoader(true);
  //       if (search_key.trim() !== '') {
  //         getApiData(search_key);
  //       }
  //     }

  //   } else {
  //     setMentionFriendListVisible(false);
  //   }
  // }

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={styles.profileWrapper}>
          {/* <Avater
            source={{uri: props?.postType === stringKey.navigateToMyPage ? props?.pageInfo?.avatar : props?.postType === stringKey.navigateToMyGroup ? props?.pageInfo?.avatar : props.userInfoData?.avatar}}
            width={45}
            height={45}
            borderRadius={20}
          /> */}
          <DualAvater
            largerImageWidth={45}
            largerImageHeight={45}
            // src={props.userData.avatar}
            src={
              props?.postType === stringKey.navigateToMyPage
                ? props?.pageInfo?.avatar
                : props?.postType === stringKey.navigateToMyGroup && props?.editPost 
                ? props.userInfoData?.avatar
                : props?.postType === stringKey.navigateToMyGroup
                  ? props?.pageInfo?.avatar
                  : props.userInfoData?.avatar
            }
            iconBadgeEnable={false}
          />
          <View>
      
            <Text
              style={[
                styles.titleText,
                props.darkMode == 'enable'
                  ? { color: COLOR.White }
                  : { color: COLOR.Grey500 },
              ]}>
              {props?.postType === stringKey.navigateToMyPage
              ? `${props?.pageInfo?.page_title}`
              : props?.postType === stringKey.navigateToMyGroup
              ? props?.editPost && props.userInfoData?.first_name !== ""
                ? `${props.userInfoData?.first_name} ${props.userInfoData?.last_name}`
                : `${props?.pageInfo?.group_title}`
              : props.userInfoData?.first_name !== ""
              ? `${props.userInfoData?.first_name} ${props.userInfoData?.last_name}`
              : `${props.userInfoData?.username}`}

                
                
                
                  {/* {firstName !== "" ? `${firstName} ${lastName}` : username} */}
            </Text>
            <Text
              style={[
                styles.subTitleText,
                props.darkMode == 'enable'
                  ? { color: COLOR.White }
                  : { color: COLOR.Grey400 },
              ]}>
              {i18n.t(`translation:typeSomething`)}
            </Text>
          </View>
        </View>
        {!props.sharePost && (
          <>
            {props.postType ===
            stringKey.navigateToMyGroup ? null : props.postType ===
              stringKey.navigateToMyPage ? (
              <TouchableOpacity
                onPress={() => props?.setPostPrivacyModalVisible(true)}>
                <View
                  style={[
                    styles.postPrivacyContainer,
                    props.darkMode == 'enable'
                      ? {backgroundColor: COLOR.DarkFadeLight}
                      : {backgroundColor: COLOR.Blue50},
                  ]}>
                  <Image
                    source={
                      props.darkMode == 'enable'
                        ? props?.selectedPostPrivacy?.iconDark
                        : props?.selectedPostPrivacy?.iconLight
                    }
                    style={styles.privacyIcon}
                    resizeMode="contain"
                  />
                  <Text
                    style={[
                      styles.postPrivacyText,
                      props.darkMode == 'enable'
                        ? {color: COLOR.White}
                        : {color: COLOR.Grey500},
                    ]}>
                    {props?.selectedPostPrivacy?.label}
                  </Text>
                  <Image
                    source={
                      props.darkMode == 'enable'
                        ? IconManager.downArrow_dark
                        : IconManager.downArrow_light
                    }
                    style={styles.downArrowIcon}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => props?.setPostPrivacyModalVisible(true)}>
                <View
                  style={[
                    styles.postPrivacyContainer,
                    props.darkMode == 'enable'
                      ? {backgroundColor: COLOR.DarkFadeLight}
                      : {backgroundColor: COLOR.Blue50},
                  ]}>
                  <Image
                    source={
                      props.darkMode == 'enable'
                        ? props?.selectedPostPrivacy?.iconDark
                        : props?.selectedPostPrivacy?.iconLight
                    }
                    style={styles.privacyIcon}
                    resizeMode="contain"
                  />
                  <Text
                    style={[
                      styles.postPrivacyText,
                      props.darkMode == 'enable'
                        ? {color: COLOR.White}
                        : {color: COLOR.Grey500},
                    ]}>
                    {props?.selectedPostPrivacy?.label}
                  </Text>
                  <Image
                    source={
                      props.darkMode == 'enable'
                        ? IconManager.downArrow_dark
                        : IconManager.downArrow_light
                    }
                    style={styles.downArrowIcon}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            )}
          </>
        )}
        {/* {
          !props.editPost ? (
            // Show the privacy modal if it's not an edit post
            <TouchableOpacity onPress={() => props?.setPostPrivacyModalVisible(true)}>
              <View
                style={[
                  styles.postPrivacyContainer,
                  props.darkMode === 'enable'
                    ? { backgroundColor: COLOR.DarkFadeLight }
                    : { backgroundColor: COLOR.Blue50 },
                ]}
              >
                <Image
                  source={
                    props.darkMode === 'enable'
                      ? props?.selectedPostPrivacy?.iconDark
                      : props?.selectedPostPrivacy?.iconLight
                  }
                  style={styles.privacyIcon}
                  resizeMode="contain"
                />
                <Text
                  style={[
                    styles.postPrivacyText,
                    props.darkMode === 'enable'
                      ? { color: COLOR.White }
                      : { color: COLOR.Grey500 },
                  ]}
                >
                  {props?.selectedPostPrivacy?.label}
                </Text>
                <Image
                  source={
                    props.darkMode === 'enable'
                      ? IconManager.downArrow_dark
                      : IconManager.downArrow_light
                  }
                  style={styles.downArrowIcon}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          ) : props.postType === stringKey.navigateToMyGroup ? null : props.postType ===
          stringKey.navigateToMyPage ? (
          <TouchableOpacity
            onPress={() => props?.setPostPrivacyModalVisible(true)}>
            <View
              style={[
                styles.postPrivacyContainer,
                props.darkMode == 'enable'
                  ? {backgroundColor: COLOR.DarkFadeLight}
                  : {backgroundColor: COLOR.Blue50},
              ]}>
              <Image
                source={
                  props.darkMode == 'enable'
                    ? props?.selectedPostPrivacy?.iconDark
                    : props?.selectedPostPrivacy?.iconLight
                }
                style={styles.privacyIcon}
                resizeMode="contain"
              />
              <Text
                style={[
                  styles.postPrivacyText,
                  props.darkMode == 'enable'
                    ? {color: COLOR.White}
                    : {color: COLOR.Grey500},
                ]}>
                {props?.selectedPostPrivacy?.label}
              </Text>
              <Image
                source={
                  props.darkMode == 'enable'
                    ? IconManager.downArrow_dark
                    : IconManager.downArrow_light
                }
                style={styles.downArrowIcon}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => props?.setPostPrivacyModalVisible(true)}>
            <View
              style={[
                styles.postPrivacyContainer,
                props.darkMode == 'enable'
                  ? {backgroundColor: COLOR.DarkFadeLight}
                  : {backgroundColor: COLOR.Blue50},
              ]}>
              <Image
                source={
                  props.darkMode == 'enable'
                    ? props?.selectedPostPrivacy?.iconDark
                    : props?.selectedPostPrivacy?.iconLight
                }
                style={styles.privacyIcon}
                resizeMode="contain"
              />
              <Text
                style={[
                  styles.postPrivacyText,
                  props.darkMode == 'enable'
                    ? {color: COLOR.White}
                    : {color: COLOR.Grey500},
                ]}>
                {props?.selectedPostPrivacy?.label}
              </Text>
              <Image
                source={
                  props.darkMode == 'enable'
                    ? IconManager.downArrow_dark
                    : IconManager.downArrow_light
                }
                style={styles.downArrowIcon}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        )} */}
      </View>
      <View>
        <TextInput
          placeholder={i18n.t(`translation:whatgoingon`)}
          placeholderTextColor={
            props.darkMode == 'enable' ? COLOR.White : COLOR.Grey400
          }
          color={props.darkMode == 'enable' ? COLOR.White : COLOR.Grey400}
          style={styles.placeholderStyle}
          // numberOfLines={2}
          multiline
          value={postText}
          onChangeText={props.handleTextChange}
          onFocus={() => {
            props?.setSnapPoint ? props?.setSnapPoint(0) : '';
          }}
          onBlur={() => { }}
          // blurOnSubmit={true}

          textAlignVertical="top"
          // onSubmitEditing={() => {

          //   Keyboard.dismiss();
          // }}
          // onKeyPress={({nativeEvent}) => {
          //   if (nativeEvent.key === 'Enter') {
          //     Keyboard.dismiss();
          //   }
          // }}
          // onTouchEnd={}
          scrollEnabled={false}
        // keyboardAppearance=''
        />

        {/* <TextInput
          placeholder={i18n.t(`translation:whatgoingon`)}
          placeholderTextColor={COLOR.Grey400}
          style={styles.placeholderStyle}
          numberOfLines={2}
          multiline
          value={postText}
          // onChangeText={(text) => dispatch(setPostText(text))}
          onChangeText={props.handleTextChange}
          // onFocus={() => props.setSnapPoints(0)}
          onFocus={() => {
            props.focusOrBlur(true);
          }}
          onBlur={() => {
            props.focusOrBlur(false);
            Keyboard.dismiss();
          }}
          returnKeyType="done"
        /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 32,
    padding: 16,
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileWrapper: {
    flexDirection: 'row',
    gap: 10,
  },
  titleText: {
    fontSize: fontSizes.size19,
    fontFamily: FontFamily.PoppinSemiBold,
    lineHeight: 23,
  },
  subTitleText: {
    fontSize: fontSizes.size10,
    fontFamily: FontFamily.PoppinRegular,
  },
  placeholderStyle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    padding: 0,
  },
  postPrivacyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
    padding: 10,
    borderRadius: 100,
  },
  postPrivacyText: {
    fontSize: fontSizes.size10,
    fontFamily: FontFamily.PoppinRegular,
  },
  privacyIcon: {
    width: 16,
    height: 16,
  },
  downArrowIcon: {
    width: 8,
    height: 11,
  },
});

export default AddPostInput;
