import {SafeAreaView, View, Text, TextInput, StyleSheet} from 'react-native';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import IconManager from '../../assets/IconManager';
import {useNavigation} from '@react-navigation/native';
import {FontFamily} from '../../constants/FONT';
import PIXEL from '../../constants/PIXEL';
import COLOR from '../../constants/COLOR';
import {useEffect, useRef, useState} from 'react';
import ActionButton from '../../components/Button/ActionButton';
import {
  setEndDate,
  setEndTime,
  setEventDescription,
  setEventLocation,
  setEventName,
  setEventPhoto,
  setStartDate,
  setStartTime,
} from '../../stores/slices/CreateEventSlice';
import {useDispatch, useSelector} from 'react-redux';
import {submitCreateEvent} from '../../helper/ApiModel';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {retrieveStringData, storeKeys} from '../../helper/AsyncStorage';

const CreateEventSix = () => {
  const navigation = useNavigation();
  const [isFocused, setIsFocused] = useState(false);
  // const textInputRef = useRef(null);
  const eventName = useSelector(state => state.CreateEventSlice.eventName);
  const eventDescription = useSelector(
    state => state.CreateEventSlice.eventDescription,
  );
  const eventLocation = useSelector(
    state => state.CreateEventSlice.eventLocation,
  );
  const eventPhoto = useSelector(state => state.CreateEventSlice.eventPhoto);
  const startDate = useSelector(state => state.CreateEventSlice.startDate);
  const startTime = useSelector(state => state.CreateEventSlice.startTime);
  const endDate = useSelector(state => state.CreateEventSlice.endDate);
  const endTime = useSelector(state => state.CreateEventSlice.endTime);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState('');
  const [darkMode, setDarkMode] = useState(null);
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);

  const handleEventDescriptionChange = text => {
    dispatch(setEventDescription(text));
    setErrorMessage('');
  };

  const handleClearEventInputData = () => {
    dispatch(setEventName(''));
    dispatch(setEventLocation(''));
    dispatch(setEventPhoto(''));
    dispatch(setEventDescription(''));
    dispatch(setStartDate(''));
    dispatch(setEndDate(''));
    dispatch(setStartTime(''));
    dispatch(setEndTime(''));
  };

  const handleCreateEvent = () => {
    if (eventDescription != '' && eventDescription.length >= 10) {
      submitCreateEvent(
        eventName,
        startDate,
        startTime,
        endDate,
        endTime,
        eventPhoto,
        eventLocation,
        eventDescription,
      )
        .then(value => {
          if (value.api_status === 200) {
            handleClearEventInputData();
            navigation.navigate('Event');
          } else {
            console.error('Error create event:', value);
          }
        })
        .catch(error => {
          // Handle the error
          console.error('Error create event:', error);
        });
    } else if (eventDescription.length < 10) {
      setErrorMessage('Description should be more than 10 characters.');
    }
  };

  // Description should be more than 32 characters
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
    handleClearEventInputData();
    navigation.pop(6)
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
        <View style={styles.stepContainer}>
          <Text
            style={[
              styles.stepText,
              darkMode == 'enable'
                ? {color: COLOR.White}
                : {color: COLOR.Grey500},
            ]}>
            Step 6/6
          </Text>
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
            <View style={styles.progressBarForeground} />
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text
            style={[
              styles.descriptionTitle,
              darkMode == 'enable'
                ? {color: COLOR.White}
                : {color: COLOR.Grey500},
            ]}>
            Event Description
          </Text>
          <View>
            <TextInput
              // ref={textInputRef}
              style={[
                styles.textInput,
                // {
                //     borderColor: errorMessage ? 'red' : (isFocused ? COLOR.Primary : COLOR.Grey200)
                // }
                {
                  borderColor: errorMessage
                    ? 'red'
                    : isFocused
                    ? COLOR.Primary
                    : darkMode == 'enable'
                    ? COLOR.Grey1000
                    : COLOR.Grey200,
                  backgroundColor:
                    darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White,
                  color: darkMode == 'enable' ? COLOR.White : COLOR.Grey500,
                },
              ]}
              value={eventDescription}
              placeholder="Enter Description Here"
              placeholderTextColor={
                darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
              }
              onChangeText={handleEventDescriptionChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              multiline={true}
            />
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
          </View>
          <View style={{marginTop: 5}}>
            <ActionButton text="Create" onPress={handleCreateEvent} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

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
  stepContainer: {
    rowGap: 10,
  },
  stepText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: PIXEL.px15,
  },
  progressBarBackground: {
    backgroundColor: COLOR.Grey50,
    height: 6,
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR.Grey50,
  },
  progressBarForeground: {
    width: '100%',
    height: '100%',
    backgroundColor: COLOR.Primary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR.Primary,
  },
  descriptionContainer: {
    rowGap: 10,
  },
  descriptionTitle: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: 19,
  },
  textInput: {
    height: 150,
    // backgroundColor: COLOR.White,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: PIXEL.px15,
    textAlignVertical: 'top',
  },
  errorText: {
    color: 'red',
    fontFamily: FontFamily.PoppinRegular,
    fontSize: 13,
    marginTop: 5,
  },
});

export default CreateEventSix;
