import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import IconManager from '../../assets/IconManager';
import {useNavigation} from '@react-navigation/native';
import {FontFamily, fontSizes} from '../../constants/FONT';
import PIXEL from '../../constants/PIXEL';
import COLOR from '../../constants/COLOR';
import MandatoryTextInput from '../../components/TextInputBox/MandatoryTextInput';
import {useEffect, useRef, useState} from 'react';
import ActionButton from '../../components/Button/ActionButton';
import RADIUS from '../../constants/RADIUS';
import SPACING from '../../constants/SPACING';
import IconPic from '../../components/Icon/IconPic';
import ImagePicker from 'react-native-image-crop-picker';
import {setEventPhoto , setStartDate , setStartTime , setEndDate , setEndTime , setEventName} from '../../stores/slices/CreateEventSlice';
import {useDispatch, useSelector} from 'react-redux';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {retrieveStringData, storeKeys} from '../../helper/AsyncStorage';

const CreateEventFour = () => {
  const navigation = useNavigation();
  const textInputRef = useRef('');
  const [photoIsNull, setPhotoValidate] = useState(false);
  // const [eventPhoto , setEventPhoto] = useState("")
  const dispatch = useDispatch();
  const eventPhoto = useSelector(state => state.CreateEventSlice.eventPhoto);
  const [darkMode, setDarkMode] = useState(null);
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);

  const pickImage = () => {
    return new Promise((resolve, reject) => {
      ImagePicker.openPicker({
        width: 400,
        height: 300,
        forceJpg: true,
        cropping: true,
      })
        .then(image => {
          dispatch(setEventPhoto(image.path));
          setPhotoValidate(false);
        })
        .catch(error => {
          // Alert.alert('Error', 'Failed to pick an image');
          throw error;
        });
    });
  };

  const handelNagivate = () => {
    if (eventPhoto != null) {
      navigation.navigate('CreateEventFive');
    }
  };

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
    getDarkModeTheme();
  }, []);
  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);

  const handleBack = () => {
    dispatch(setEventName(''))
    dispatch(setStartDate(''));
    dispatch(setStartTime(''));
    dispatch(setEndDate(''));
    dispatch(setEndTime(''));
    dispatch(setEventPhoto(null));
    navigation.pop(4)
  }

  return (
    <SafeAreaView
      style={[
        styles.safeAreaView,
        darkMode == 'enable'
          ? {backgroundColor: COLOR.DarkThemLight}
          : {backgroundColor: COLOR.White},
      ]}>
      <ActionAppBar
        appBarText="Create Event"
        // source={IconManager.back_light}
        backpress={handleBack}
        darkMode={darkMode}
      />
      <View
        style={[
          styles.container,
          darkMode == 'enable'
            ? {backgroundColor: COLOR.DarkTheme}
            : {backgroundColor: COLOR.White},
        ]}>
        <View style={{rowGap: 10}}>
          <View>
            <Text
              style={[
                styles.stepText,
                darkMode == 'enable'
                  ? {color: COLOR.White}
                  : {color: COLOR.Grey500},
              ]}>
              Step 4/6
            </Text>
          </View>
          <View
            style={[
              styles.progressBarBackground,
              darkMode == 'enable'
                ? {
                    backgroundColor: COLOR.DarkFadeLight,
                    borderColor: COLOR.DarkFadeLight,
                  }
                : {backgroundColor: COLOR.Grey50, borderColor: COLOR.Grey50},
            ]}>
            <View
              style={{
                width: '66.66%',
                height: '100%',
                backgroundColor: COLOR.Primary,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: COLOR.Primary,
              }}
            />
          </View>
        </View>

        <View style={{rowGap: 20}}>
          <View style={{rowGap: 10}}>
            <View style={[{marginBottom: 8}]}>
              <Text
                style={[
                  styles.labelText,
                  darkMode == 'enable'
                    ? {color: COLOR.White}
                    : {color: COLOR.Grey500},
                ]}>
                Event Photo
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={() => pickImage()}>
              <View
                style={[
                  styles.dottedCardStyle,
                  photoIsNull && {borderColor: COLOR.Warning},
                ]}>
                {(eventPhoto && (
                  <Image
                    resizeMode="stretch"
                    source={{uri: eventPhoto}}
                    style={[styles.croppedImageStyle]}
                  />
                )) || (
                  <TouchableOpacity onPress={() => pickImage()}>
                    <View
                      style={{justifyContent: 'center', alignItems: 'center'}}>
                      <IconPic
                        source={
                          darkMode == 'enable'
                            ? IconManager.gallery_dark
                            : IconManager.gallery_light
                        }
                        width={SPACING.sp40}
                        height={SPACING.sp40}
                      />
                      <Text style={[styles.textStylePrimary]}>
                        Choose Image
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          </View>
          <ActionButton text="Next" onPress={handelNagivate} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateEventFour;

const styles = StyleSheet.create({
  safeAreaView: {
    // backgroundColor: COLOR.White100,
    flex: 1,
  },
  container: {
    padding: PIXEL.px16,
    rowGap: 15,
    flex: 1,
  },
  dottedCardStyle: {
    borderWidth: 2,
    borderRadius: 12,
    borderColor: COLOR.Grey200,
    borderStyle: 'dashed',
    height: 230,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStylePrimary: {
    fontSize: 12,
    color: COLOR.Grey300,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  DtextStylePrimary: {
    fontSize: 12,
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  textStyleBlack: {
    fontSize: fontSizes.size15,
    color: COLOR.Grey500,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  DtextStyleBlack: {
    fontSize: fontSizes.size15,
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  croppedImageStyle: {width: '100%', height: '100%', borderRadius: RADIUS.rd12},
  labelText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: 19,
  },
  progressBarBackground: {
    // backgroundColor: COLOR.Grey50,
    height: 6,
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    // borderColor: COLOR.Grey50
  },
  stepText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: PIXEL.px15,
  },
});
