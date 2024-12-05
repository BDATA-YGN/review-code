import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import IconManager from '../../assets/IconManager';
import i18n from '../../i18n';
import DualAvater from '../../components/DualAvater';
// import {
//   retrieveJsonData,
//   retrieveStringData,
//   storeKeys,
// } from '../../helper/AsyncStorage';
import COLOR from '../../constants/COLOR';
import {FontFamily, fontSizes} from '../../constants/FONT';
import SPACING from '../../constants/SPACING';
import PIXEL from '../../constants/PIXEL';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
// import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import SizedBox from '../../commonComponent/SizedBox';

const CreatePost = props => {
  const navigation = useNavigation();
  // const [darkMode, setDarkMode] = useState(false);
  // const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const dispatch = useDispatch();
  // useEffect(() => {
  //   getDarkModeTheme();
  // }, []);
  // useEffect(() => {
  //   if (fetchDarkMode) {
  //     getDarkModeTheme();
  //     dispatch(setFetchDarkMode(false));
  //   }
  // }, [fetchDarkMode]);
  // const getDarkModeTheme = async () => {
  //   try {
  //     const darkModeValue = await retrieveStringData({
  //       key: storeKeys.darkTheme,
  //     });
  //     if (darkModeValue !== null || undefined) {
  //       setDarkMode(darkModeValue);
  //     }
  //   } catch (error) {
  //     console.error('Error retrieving dark mode theme:', error);
  //   }
  // };
  return (
    <View
      style={[
        styles.container,
        props.darkMode == 'enable'
          ? {backgroundColor: COLOR.DarkThemLight}
          : {backgroundColor: COLOR.White100},
      ]}>
      <SizedBox height={SPACING.sp8} />
      <TouchableOpacity
        style={styles.userInfo}
        onPress={() =>
          navigation.navigate('AddPost', {
            userInfoData: props.userData,
            postType: props.postType,
            userId: props.userId,
            pageInfo: props.userData,
          })
        }>
        {props.userData.avatar && (
          <DualAvater
            largerImageWidth={55}
            largerImageHeight={55}
            src={props.userData.avatar}
            iconBadgeEnable={false}
          />
        )}

        <View style={styles.userInfoText}>
          <Text
            style={[
              styles.userName,
              props.darkMode == 'enable'
                ? {color: COLOR.White}
                : {color: COLOR.Grey500},
            ]}>
            {i18n.t(`translation:whatgoingon`)}
          </Text>
          <Text
            style={[
              styles.userDescription,
              props.darkMode == 'enable'
                ? {color: COLOR.White}
                : {color: COLOR.Grey400},
            ]}>
            {i18n.t(`translation:typeSomething`)}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('AddPost', {
              isUploadImgModalVisible: true,
              userInfoData: props.userData,
              postType: props.postType,
              userId: props.userId,
              pageInfo: props.userData,
            })
          }
          style={[styles.action, {flex: 0.25, justifyContent: 'flex-start'}]}>
          <Image
            source={
              props.darkMode == 'enable'
                ? IconManager.gallery_dark
                : IconManager.gallery_light
            }
            style={styles.iconStyle}
            resizeMode="contain"
          />
          <Text
            style={[
              styles.textStyle,
              props.darkMode == 'enable'
                ? {color: COLOR.White}
                : {color: COLOR.Grey500},
            ]}>
            {i18n.t(`translation:gallery`)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('AddPost', {
              isMentionNavigate: true,
              userInfoData: props.userData,
              postType: props.postType,
              userId: props.userId,
              pageInfo: props.userData,
            })
          }
          style={[
            styles.action,
            {
              justifyContent: 'center',
              flex: 0.3,
            },
          ]}>
          <Image
            source={
              props.darkMode == 'enable'
                ? IconManager.tagfriend_dark
                : IconManager.tagfriend_light
            }
            style={styles.iconStyle}
            resizeMode="contain"
          />
          <Text
            style={[
              styles.textStyle,
              props.darkMode == 'enable'
                ? {color: COLOR.White}
                : {color: COLOR.Grey500},
            ]}>
            {i18n.t(`translation:tagFriend`)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.action, {justifyContent: 'center', flex: 0.3}]}
          onPress={() =>
            navigation.navigate('AddPost', {
              isFeelingModalVisible: true,
              userInfoData: props.userData,
              postType: props.postType,
              userId: props.userId,
              pageInfo: props.userData,
            })
          }>
          <Image
            source={
              props.darkMode == 'enable'
                ? IconManager.feeling_dark
                : IconManager.feeling_light
            }
            style={styles.iconStyle}
            resizeMode="contain"
          />
          <Text
            style={[
              styles.textStyle,
              props.darkMode == 'enable'
                ? {color: COLOR.White}
                : {color: COLOR.Grey500},
            ]}>
            {i18n.t(`translation:feeling`)}
          </Text>
        </TouchableOpacity>
        <View style={[styles.action, {justifyContent: 'center', flex: 0.2}]}>
          <Image
            source={
              props.darkMode == 'enable'
                ? IconManager.live_dark
                : IconManager.live_light
            }
            style={[styles.iconStyle, {width: PIXEL.px18, height: PIXEL.px18}]}
            resizeMode="contain"
          />
          <Text
            style={[
              styles.textStyle,
              props.darkMode == 'enable'
                ? {color: COLOR.White}
                : {color: COLOR.Grey500},
            ]}>
            {i18n.t(`translation:live`)}
          </Text>
        </View>
      </View>
      {/* <SizedBox height={SPACING.sp8} /> */}
      {/* <View style={styles.shadow} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    width: '200%',
    left: -30,
    top: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1, // Bottom border
    borderBottomColor: '#ccc', // Border color
    shadowColor: '#CCCCCC', // Shadow color
    shadowOffset: {
      width: 0, // No horizontal shadow
      height: 5, // Vertical shadow to create a bottom shadow effect
    },
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 5, // Shadow blur
    elevation: 5,
  },
  container: {
    paddingHorizontal: SPACING.sp10,
    paddingBottom: SPACING.sp10,
    backgroundColor: COLOR.White100,
    width: '100%',
    // borderWidth: 1,
    // height: 118,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sp20,
  },
  userInfoText: {
    marginLeft: SPACING.sp10,
  },
  userName: {
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
  },
  userDescription: {
    fontSize: fontSizes.size10,
    fontFamily: FontFamily.PoppinRegular,
  },
  actions: {
    // flex: 1,
    flexDirection: 'row',
  },
  action: {
    flex: 0.25,
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconStyle: {
    width: PIXEL.px16,
    height: PIXEL.px16,
    marginEnd: SPACING.sp5,
  },
  textStyle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
  },
});

export default CreatePost;
