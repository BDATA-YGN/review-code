import {Alert, Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react'; // Correct import
import {onBoradingList} from '../../constants/CONSTANT_ARRAY';
import {
  storeJsonData,
  storeKeys,
  storeStringData,
} from '../../helper/AsyncStorage';
import SPACING from '../../constants/SPACING';
import {FontFamily, fontSizes} from '../../constants/FONT';
import COLOR from '../../constants/COLOR';
import AppBar from '../../components/AppBar';
import AppIntroSlider from 'react-native-app-intro-slider';
import SizedBox from '../../commonComponent/SizedBox';
import PIXEL from '../../constants/PIXEL';
import {Button} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  requestLocationPermission,
  requestContactPermission,
  requestContactPermissionPhoneCall,
  requestStoragePermission,
  requestRecordingPermission,
  requestStoragePermissionCamera,
} from './Permissions';
import {useNavigation} from '@react-navigation/native';
import i18n from '../../i18n';
import {useDispatch, useSelector} from 'react-redux';
import {retrieveStringData} from '../../helper/AsyncStorage';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';

const OnBoarding = () => {
  const [showRealApp, setShowRealApp] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [darkMode, setDarkMode] = useState(null);
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
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
  const requestPermissions = async index => {
    // Proceed to the next step in the onboarding process
    switch (index) {
      case 0:
        await requestLocationPermission();
        break;
      case 1:
        await requestContactPermission();
        // await requestContactPermissionPhoneCall();
        break;
      case 2:
        await requestStoragePermission();
        await requestStoragePermissionCamera();
        break;
      case 3:
        await requestRecordingPermission();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    requestPermissions(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);
  const RenderItem = ({item}) => {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          // backgroundColor: item.backgroundColor,
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        <SizedBox height={PIXEL.px60} />
        <Image
          resizeMode="contain"
          source={item.image.uri}
          style={styles.imageHeader}
        />
        <SizedBox height={16} />
        <View style={{width: '90%'}}>
          <Text
            style={
              darkMode == 'enable'
                ? styles.darkThmeintroTitleStyle
                : styles.introTitleStyle
            }>
            {item.title}
          </Text>
          <Text
            style={
              darkMode == 'enable'
                ? styles.darkThmeintroTextStyle
                : styles.introTextStyle
            }>
            {item.text}
          </Text>
        </View>
      </SafeAreaView>
    );
  };

  const onDone = async () => {
    // storeJsonData({key: storeKeys.loginCredential, data: data});
    storeJsonData({key: storeKeys.isOnBoarding, data: 'Complete'});
   
      navigation.reset({
        index: 0,
        routes: [
          { name:  'BottomTabNavigator'},
        ],
      });
  
    // navigation.navigate('BottomTabNavigator');
    // setShowRealApp(true);
  };

  const onSkip = () => {
    setTimeout(() => {
      onDone();
    }, 1000);
  };
  const RenderNextButton = () => {
    return (
      <TouchableOpacity style={styles.onBoardingAction}>
        <Text
          style={
            darkMode == 'enable'
              ? styles.darkThemeonBoardingActionText
              : styles.onBoardingActionText
          }>
          {i18n.t(`translation:next`)}
        </Text>
      </TouchableOpacity>
    );
  };

  const onSlideChange = () => {
    setCurrentIndex(prevIndex => prevIndex + 1);
  };

  const RenderDoneButton = () => {
    return (
      <View style={styles.onBoardingAction}>
        <Text
          style={
            darkMode == 'enable'
              ? styles.darkThemeonBoardingActionText
              : styles.onBoardingActionText
          }>
          {i18n.t(`translation:done`)}
        </Text>
      </View>
    );
  };
  const RenderSkipButton = () => {
    return (
      <View style={styles.onBoardingAction}>
        <Text
          style={
            darkMode == 'enable'
              ? styles.darkThemeonBoardingActionText
              : styles.onBoardingActionText
          }>
          {i18n.t(`translation:skip`)}
        </Text>
      </View>
    );
  };

  return (
    <>
      {showRealApp ? (
        <SafeAreaView style={styles.container}>
          <View style={styles.container}>
            <Button
              title={i18n.t(`translation:showIntroSlide`)}
              onPress={() => setShowRealApp(false)}
            />
          </View>
        </SafeAreaView>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor:
              darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White,
          }}>
          <AppIntroSlider
            data={onBoradingList}
            renderItem={RenderItem}
            onDone={onDone}
            onSkip={onSkip}
            showSkipButton={true}
            renderDoneButton={RenderDoneButton}
            renderNextButton={RenderNextButton}
            renderSkipButton={RenderSkipButton}
            dotStyle={{backgroundColor: '#CFCFCF'}}
            onSlideChange={onSlideChange}
            activeDotStyle={{backgroundColor: COLOR.Primary}}
          />
        </View>
      )}
    </>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White50,
    alignItems: 'center',
    // padding: 10,
    justifyContent: 'center',
  },
  darkThemeConatiner: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
  },
  titleStyle: {
    padding: SPACING.sp12,
    textAlign: 'center',
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinBold,
  },
  paragraphStyle: {
    padding: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  introImageStyle: {
    width: '85%',
    height: 400,
  },
  introTextStyle: {
    fontSize: fontSizes.size15,
    color: COLOR.Grey500,
    textAlign: 'center',
    fontFamily: FontFamily.PoppinRegular,
    paddingHorizontal: SPACING.sp16,
  },
  darkThmeintroTextStyle: {
    fontSize: fontSizes.size15,
    color: COLOR.White,
    textAlign: 'center',
    fontFamily: FontFamily.PoppinRegular,
    paddingHorizontal: SPACING.sp16,
  },
  darkThmeintroTitleStyle: {
    fontSize: fontSizes.size29,
    color: COLOR.White,
    textAlign: 'center',
    fontFamily: FontFamily.PoppinBold,
  },
  introTitleStyle: {
    fontSize: fontSizes.size29,
    color: COLOR.Grey500,
    textAlign: 'center',
    fontFamily: FontFamily.PoppinBold,
  },
  onBoardingAction: {
    width: 60,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onBoardingActionText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.Grey500,
  },
  darkThemeonBoardingActionText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.White,
  },
  imageHeader: {
    width: PIXEL.px250,
    height: PIXEL.px250,
  },
});
