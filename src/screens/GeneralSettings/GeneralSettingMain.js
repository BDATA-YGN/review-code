import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import COLOR from '../../constants/COLOR';
import IconPic from '../../components/Icon/IconPic';
import IconManager from '../../assets/IconManager';
import PIXEL from '../../constants/PIXEL';
import SPACING from '../../constants/SPACING';
import RADIUS from '../../constants/RADIUS';
import AppBar from '../../components/AppBar';
import ProfileAvatar from '../../components/Icon/ProfileAvatar';
import SizedBox from '../../commonComponent/SizedBox';
import {FontFamily, fontSizes} from '../../constants/FONT';
import {
  clearData,
  retrieveJsonData,
  storeKeys,
} from '../../helper/AsyncStorage';
import {useNavigation} from '@react-navigation/native';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import i18n from '../../i18n';
import {retrieveStringData} from '../../helper/AsyncStorage';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {useDispatch, useSelector} from 'react-redux';

const GeneralAcctontMain = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [verified , setVerified]= useState('');
  const [isTwoFactorOn , setTwoFactorOn] = useState('');
  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const dispatch = useDispatch();

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
    fetchLoginCredentialData();
  }, [isTwoFactorOn]);
  useEffect(() => {
    getDarkModeTheme();
  }, []);
  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);

  const fetchLoginCredentialData = async () => {
    const userInfoData = await retrieveJsonData({key: storeKeys.userInfoData});
    if (userInfoData !== null) {
      setFirstName(userInfoData.first_name);
      setLastName(userInfoData.last_name);
      setAvatar(userInfoData.avatar);
      setTwoFactorOn(userInfoData.two_factor)
      setVerified(userInfoData.verified)
    } else {
      Alert.alert(
        'Invalid',
        `No credential!`,
        [
          {
            text: 'Ok',
            onPress: () => {},
          },
        ],
        {cancelable: true},
      );
    }
  };

  // const handleNavigateTwoFactor = () => {
  //   if(isTwoFactorOn == "1"){
  //     navigation.navigate('TwoFactorSettingEnabled')
  //   }else if(isTwoFactorOn == "0")
  //   navigation.navigate('TwoFactorAuth')
  // }
  return (
    <SafeAreaView
      style={darkMode == 'enable' ? styles.DsafeAreaView : styles.safeAreaView}>
      <ActionAppBar
        appBarText={i18n.t(`translation:setting`)}
        source={IconManager.back_light}
        backpress={() => {
          navigation.goBack();
        }}
        darkMode={darkMode}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.generalHolder}>
          <View style={styles.generalHeader}>
            <Text
              style={
                darkMode == 'enable'
                  ? styles.DheaderTextStyle
                  : styles.headerTextStyle
              }>
              {i18n.t(`translation:general`)}
            </Text>
          </View>
          <View
            style={
              darkMode == 'enable' ? styles.DarkModegeneral : styles.general
            }>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}
              activeOpacity={0.7}
              style={styles.genralContentStyle}>
              <View style={styles.generalContentHolder}>
                <View style={styles.generalIconAndText}>
                  <IconPic
                    source={
                      darkMode == 'enable'
                        ? IconManager.edit_dark
                        : IconManager.edit_light
                    }
                  />
                  <SizedBox width={SPACING.sm} />
                  <Text
                    style={
                      darkMode == 'enable' ? styles.DcardText : styles.cardText
                    }>
                    {i18n.t(`translation:editProfile`)}
                  </Text>
                </View>
                <IconPic
                  source={
                    darkMode == 'enable'
                      ? IconManager.next_dark
                      : IconManager.next_light
                  }
                  width={PIXEL.px12}
                  height={PIXEL.px12}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('MyAccount')}
              activeOpacity={0.7}
              style={styles.genralContentStyle}>
              <View style={styles.generalContentHolder}>
                <View style={styles.generalIconAndText}>
                  <IconPic
                    source={
                      darkMode == 'enable'
                        ? IconManager.user_dark
                        : IconManager.user_light
                    }
                  />
                  <SizedBox width={SPACING.sm} />
                  <Text
                    style={
                      darkMode == 'enable' ? styles.DcardText : styles.cardText
                    }>
                    {i18n.t(`translation:myAccount`)}
                  </Text>
                </View>
                <IconPic
                  source={
                    darkMode == 'enable'
                      ? IconManager.next_dark
                      : IconManager.next_light
                  }
                  width={PIXEL.px12}
                  height={PIXEL.px12}
                />
              </View>
            </TouchableOpacity>
            {/* <TouchableOpacity
                            activeOpacity={0.7}
                            style={styles.genralContentStyle}>
                            <View style={styles.generalContentHolder}>
                                <View style={styles.generalIconAndText}>
                                    <IconPic source={IconManager.location_light} />
                                    <SizedBox width={SPACING.sm} />
                                    <Text style={styles.cardText}>{i18n.t(`translation:myAddress`)}</Text>
                                </View>
                                <IconPic
                                    source={IconManager.next_light}
                                    width={PIXEL.px12}
                                    height={PIXEL.px12}
                                />
                            </View>
                        </TouchableOpacity> */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('BlockedList')}
              style={styles.genralContentStyle}>
              <View style={styles.generalContentHolder}>
                <View style={styles.generalIconAndText}>
                  <IconPic
                    source={
                      darkMode == 'enable'
                        ? IconManager.block_user_dark
                        : IconManager.block_user_light
                    }
                  />
                  <SizedBox width={SPACING.sm} />
                  <Text
                    style={
                      darkMode == 'enable' ? styles.DcardText : styles.cardText
                    }>
                    {i18n.t(`translation:blockedUsers`)}
                  </Text>
                </View>
                <IconPic
                  source={
                    darkMode == 'enable'
                      ? IconManager.next_dark
                      : IconManager.next_light
                  }
                  width={PIXEL.px12}
                  height={PIXEL.px12}
                />
              </View>
            </TouchableOpacity>
            {
              verified === '0' ? (
                <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Verification')}
                style={styles.genralContentStyle}>
                <View style={styles.generalContentHolder}>
                  <View style={styles.generalIconAndText}>
                    <IconPic
                      source={
                        darkMode == 'enable'
                          ? IconManager.verification_dark
                          : IconManager.verification_light
                      }
                    />
                    <SizedBox width={SPACING.sm} />
                    <Text
                      style={
                        darkMode == 'enable' ? styles.DcardText : styles.cardText
                      }>
                      {i18n.t(`translation:verification`)}
                    </Text>
                  </View>
                  <IconPic
                    source={
                      darkMode == 'enable'
                        ? IconManager.next_dark
                        : IconManager.next_light
                    }
                    width={PIXEL.px12}
                    height={PIXEL.px12}
                  />
                </View>
              </TouchableOpacity>
              ) : null
            }
          </View>
          <View style={styles.generalHeader}>
            <Text
              style={
                darkMode == 'enable'
                  ? styles.DheaderTextStyle
                  : styles.headerTextStyle
              }>
              {i18n.t(`translation:security`)}
            </Text>
          </View>
          <View
            style={
              darkMode == 'enable' ? styles.DarkModegeneral : styles.general
            }>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('ChangePassword')}
              style={styles.genralContentStyle}>
              <View style={styles.generalContentHolder}>
                <View style={styles.generalIconAndText}>
                  <IconPic
                    source={
                      darkMode == 'enable'
                        ? IconManager.password_dark
                        : IconManager.password_light
                    }
                  />
                  <SizedBox width={SPACING.sm} />
                  <Text
                    style={
                      darkMode == 'enable' ? styles.DcardText : styles.cardText
                    }>
                    {i18n.t(`translation:password`)}
                  </Text>
                </View>
                <IconPic
                  source={
                    darkMode == 'enable'
                      ? IconManager.next_dark
                      : IconManager.next_light
                  }
                  width={PIXEL.px12}
                  height={PIXEL.px12}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('TwoFactorAuth', {darkMode : darkMode})}
              style={styles.genralContentStyle}>
              <View style={styles.generalContentHolder}>
                <View style={styles.generalIconAndText}>
                  <IconPic source={darkMode == 'enable' ? IconManager.two_factor_dark : IconManager.two_factor_light} />
                  <SizedBox width={SPACING.sm} />
                  <Text
                    style={
                      darkMode == 'enable' ? styles.DcardText : styles.cardText
                    }>
                    {i18n.t(`translation:twoFactorAuthentication`)}
                  </Text>
                </View>
                <IconPic
                  source={darkMode == 'enable' ? IconManager.next_dark :IconManager.next_light}
                  width={PIXEL.px12}
                  height={PIXEL.px12}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('ManageSession')}
              style={styles.genralContentStyle}>
              <View style={styles.generalContentHolder}>
                <View style={styles.generalIconAndText}>
                  <IconPic
                    source={
                      darkMode == 'enable'
                        ? IconManager.sessions_dark
                        : IconManager.sessions_light
                    }
                  />
                  <SizedBox width={SPACING.sm} />
                  <Text
                    style={
                      darkMode == 'enable' ? styles.DcardText : styles.cardText
                    }>
                    {i18n.t(`translation:manageSessions`)}
                  </Text>
                </View>
                <IconPic
                  source={
                    darkMode == 'enable'
                      ? IconManager.next_dark
                      : IconManager.next_light
                  }
                  width={PIXEL.px12}
                  height={PIXEL.px12}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('DeactivateAccount')}
              style={styles.genralContentStyle}>
              <View style={styles.generalContentHolder}>
                <View style={styles.generalIconAndText}>
                  <IconPic
                    source={
                      darkMode == 'enable'
                        ? IconManager.deactivate_dark
                        : IconManager.deactivate_light
                    }
                  />
                  <SizedBox width={SPACING.sm} />
                  <Text
                    style={
                      darkMode == 'enable' ? styles.DcardText : styles.cardText
                    }>
                    {i18n.t(`translation:deactivateAccount`)}
                  </Text>
                </View>
                <IconPic
                  source={
                    darkMode == 'enable'
                      ? IconManager.next_dark
                      : IconManager.next_light
                  }
                  width={PIXEL.px12}
                  height={PIXEL.px12}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GeneralAcctontMain;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: COLOR.White50,
  },
  DsafeAreaView: {
    flex: 1,
    backgroundColor: COLOR.DarkThemLight,
  },
  headerTextStyle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.Grey400,
    // fontWeight: '650'
  },
  DheaderTextStyle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.White100,
    // fontWeight: '650'
  },
  otherSettingTextStyle: {
    color: COLOR.Grey300,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
  },
  DotherSettingTextStyle: {
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
  },
  generalContentHolder: {
    flexDirection: 'row',
    paddingVertical: SPACING.sm,
  },
  generalIconAndText: {
    flex: 1,
    flexDirection: 'row',
  },
  genralContentStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.xxxxs,
    marginVertical: SPACING.xxxxxs,
  },
  generalHolder: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  general: {
    width: '94%',
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.White100,
    paddingHorizontal: SPACING.sp12,
    // paddingVertical: SPACING.sp4
  },
  DarkModegeneral: {
    width: '94%',
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.DarkThemLight,
    paddingHorizontal: SPACING.sp12,
    // paddingVertical: SPACING.sp4
  },
  generalHeader: {
    width: '90%',
    borderRadius: RADIUS.xs,
    paddingBottom: SPACING.sp4,
    paddingTop: SPACING.sp14,
    paddingHorizontal: SPACING.sp6,
  },
  cardContentContiner: {
    paddingVertical: SPACING.xl,
    flexDirection: 'row',
  },
  cardText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.Grey500,
  },
  DcardText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.White100,
  },
  cardContiner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardView: {
    width: '47.5%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: COLOR.Blue50,
    gap: SPACING.sm,
    paddingLeft: SPACING.lg,
    borderRadius: RADIUS.xs,
  },
  seeAll: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.Grey500,
  },
  shortcutHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shortcutHolder: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  shortcut: {
    width: '90%',
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.White100,
    padding: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    margin: SPACING.lg,
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
});
