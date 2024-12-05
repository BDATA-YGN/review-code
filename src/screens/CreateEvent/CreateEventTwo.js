import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import IconManager from '../../assets/IconManager';
import {useNavigation} from '@react-navigation/native';
import {FontFamily, fontSizes} from '../../constants/FONT';
import PIXEL from '../../constants/PIXEL';
import COLOR from '../../constants/COLOR';
import {useDispatch, useSelector} from 'react-redux';
import dayjs from 'dayjs';
import {
  setStartDate,
  setStartTime,
  setEventName,
  setFullStartDate,
} from '../../stores/slices/CreateEventSlice';
import RADIUS from '../../constants/RADIUS';
import SPACING from '../../constants/SPACING';
import DateTimePicker from 'react-native-ui-datepicker';
import ActionButton from '../../components/Button/ActionButton';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {retrieveStringData, storeKeys} from '../../helper/AsyncStorage';

const CreateEventTwo = () => {
  const navigation = useNavigation();
  const textInputRef = useRef('');
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [date, setDate] = useState(dayjs());
  const [time, setTime] = useState(dayjs());
  const startDate = useSelector(state => state.CreateEventSlice.startDate);
  const startTime = useSelector(state => state.CreateEventSlice.startTime);
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(null);
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);

  const handleButtonPressOK = () => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD'); // Format selected date using dayjs
    dispatch(setStartDate(formattedDate)); // Dispatch action to update state in Redux store
    dispatch(setFullStartDate(date));
    setDateModalVisible(false);
  };

  const handleTimeButtonPressOK = () => {
    const formattedTime = dayjs(time).format('h:mm A'); // Format selected time using dayjs
    dispatch(setStartTime(formattedTime)); // Dispatch action to update state in Redux store
    setTimeModalVisible(false);
  };

  const handleButtonPressCancel = () => {
    setDateModalVisible(false);
  };

  const handleTimeButtonPressCancel = () => {
    setTimeModalVisible(false);
  };

  // const handelNagivate = () => {
  //   if (startDate !== '' && startTime !== '') {
  //     // Convert the time string to 24-hour format
  //     const [time, modifier] = startTime.split(' '); // split time and AM/PM
  //     let [hours, minutes] = time.split(':');

  //     if (modifier === 'PM' && hours !== '12') {
  //       hours = parseInt(hours, 10) + 12; // Convert PM hours, except 12 PM
  //     } else if (modifier === 'AM' && hours === '12') {
  //       hours = '00'; // Convert 12 AM to midnight
  //     }

  //     // Construct the final date string
  //     const formattedTime = `${hours}:${minutes}`;
  //     const dateString = `${startDate} ${formattedTime}:00`; // Add seconds for completeness

  //     const selectedDate = new Date(dateString);
  //     const currentDate = new Date();

  //     if (!isNaN(selectedDate.getTime())) {
  //       // Alert.alert(`Selected date and time: ${selectedDate}`);

  //       // Check if the selected date and time are in the future
  //       if (selectedDate > currentDate) {
  //         console.log('Success');
  //         // Proceed with navigation
  //         navigation.navigate('CreateEventThree');
  //       } else {
  //         // Handle the case when the date and time are not in the future
  //         Alert.alert('The selected date and time must be in the future.');
  //       }
  //     } else {
  //       Alert.alert('Invalid date or time format.');
  //     }
  //   } else {
  //     Alert.alert('Please select both start date and time.');
  //   }
  // };

  const handelNagivate = () => {
    if (startDate != '' && startTime != '') {
      navigation.navigate('CreateEventThree');
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
    dispatch(setEventName(''));
    dispatch(setStartDate(''));
    dispatch(setStartTime(''));
    navigation.pop(2);
  };

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
              Step 2/6
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
                width: '33.33%',
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
            <View>
              <Text
                style={[
                  styles.labelText,
                  darkMode == 'enable'
                    ? {color: COLOR.White}
                    : {color: COLOR.Grey500},
                ]}>
                Start Date
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setDateModalVisible(true);
              }}>
              <TouchableOpacity
                onPress={() => {
                  setDateModalVisible(true);
                }}>
                <View
                  style={[
                    styles.textInputBorderStyle,
                    // {paddingVertical: SPACING.sp12},
                  ]}>
                  <TextInput
                    editable={false}
                    value={startDate}
                    placeholder="Enter Start Date"
                    style={[
                      {
                        fontSize: fontSizes.size15,
                        paddingHorizontal: 4,
                        paddingVertical: SPACING.sp12,
                        color:
                          darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                      },
                    ]}
                    placeholderTextColor={
                      darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
                    }
                  />
                </View>
              </TouchableOpacity>
              <Modal
                animationType="fade"
                transparent={true}
                visible={dateModalVisible}
                onRequestClose={() => setDateModalVisible(false)}>
                <View style={styles.modalBox}>
                  <View
                    style={[
                      styles.modalInnerBox,
                      darkMode == 'enable'
                        ? {backgroundColor: COLOR.DarkTheme}
                        : {backgroundColor: COLOR.White},
                    ]}>
                    <DateTimePicker
                      value={date}
                      onValueChange={value => setDate(value)}
                      mode="date"
                      minimumDate={dayjs().startOf('day').toDate()}
                      headerButtonColor={
                        darkMode === 'enable' ? COLOR.White : COLOR.Grey500
                      }
                      // headerButtonColor={{ color: darkMode === 'enable' ? COLOR.White : COLOR.Grey500 }}
                      calendarTextStyle={{
                        color:
                          darkMode === 'enable' ? COLOR.White : COLOR.Grey500,
                      }}
                      weekDaysTextStyle={{
                        color:
                          darkMode === 'enable' ? COLOR.White : COLOR.Grey500,
                      }}
                      headerTextStyle={{
                        color:
                          darkMode === 'enable' ? COLOR.White : COLOR.Grey500,
                      }}
                      yearContainerStyle={{
                        backgroundColor:
                          darkMode === 'enable' ? COLOR.Grey500 : COLOR.White,
                      }}
                      monthContainerStyle={{
                        backgroundColor:
                          darkMode === 'enable' ? COLOR.Grey500 : COLOR.White,
                      }}
                    />
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                      }}>
                      <Pressable onPress={handleButtonPressCancel}>
                        <Text
                          style={[
                            styles.txt16,
                            styles.textGray,
                            styles.fontWeight700,
                            styles.paddingAll,
                          ]}>
                          Close
                        </Text>
                      </Pressable>
                      <Pressable onPress={handleButtonPressOK}>
                        <Text
                          style={[
                            styles.txt16,
                            styles.textGray,
                            styles.fontWeight700,
                            styles.paddingAll,
                          ]}>
                          Ok
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </Modal>
            </TouchableOpacity>
          </View>
          <View style={{rowGap: 10}}>
            <View>
              <Text
                style={[
                  styles.labelText,
                  darkMode == 'enable'
                    ? {color: COLOR.White}
                    : {color: COLOR.Grey500},
                ]}>
                Start Time
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setTimeModalVisible(true);
              }}>
              <TouchableOpacity
                onPress={() => {
                  setTimeModalVisible(true);
                }}>
                <View
                  style={[
                    styles.textInputBorderStyle,
                    // {paddingVertical: SPACING.sp12},
                  ]}>
                  <TextInput
                    editable={false}
                    value={startTime}
                    placeholder="Enter Start Time"
                    style={[
                      {
                        fontSize: fontSizes.size15,
                        paddingHorizontal: 4,
                        paddingVertical: SPACING.sp12,
                        color:
                          darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                      },
                    ]}
                    placeholderTextColor={
                      darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
                    }
                  />
                </View>
              </TouchableOpacity>
              <Modal
                animationType="fade"
                transparent={true}
                visible={timeModalVisible}
                onRequestClose={() => setTimeModalVisible(false)}>
                <View style={styles.modalBox}>
                  <View
                    style={[
                      styles.modalInnerBox,
                      darkMode == 'enable'
                        ? {backgroundColor: COLOR.DarkTheme}
                        : {backgroundColor: COLOR.White},
                    ]}>
                    <DateTimePicker
                      value={time}
                      onValueChange={value => setTime(value)}
                      mode="time"
                      // timePickerTextStyle={darkMode === 'enable' ? COLOR.White : COLOR.Grey500}
                      // headerButtonColor={{ color: darkMode === 'enable' ? COLOR.White : COLOR.Grey500 }}
                      timePickerTextStyle={{
                        color:
                          darkMode === 'enable' ? COLOR.White : COLOR.Grey500,
                      }}
                      // weekDaysTextStyle={{ color: darkMode === 'enable' ? COLOR.White : COLOR.Grey500 }}
                      // headerTextStyle={{ color: darkMode === 'enable' ? COLOR.White : COLOR.Grey500 }}
                    />
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                      }}>
                      <Pressable onPress={handleTimeButtonPressCancel}>
                        <Text
                          style={[
                            styles.txt16,
                            styles.textGray,
                            styles.fontWeight700,
                            styles.paddingAll,
                          ]}>
                          Close
                        </Text>
                      </Pressable>
                      <Pressable onPress={handleTimeButtonPressOK}>
                        <Text
                          style={[
                            styles.txt16,
                            styles.textGray,
                            styles.fontWeight700,
                            styles.paddingAll,
                          ]}>
                          Ok
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </Modal>
            </TouchableOpacity>
          </View>
          <ActionButton text="Next" onPress={handelNagivate} />
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
  DsafeAreaView: {
    flex: 1,
    backgroundColor: COLOR.DarkTheme,
  },
  textInputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  stepText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: PIXEL.px15,
  },
  container: {
    padding: PIXEL.px16,
    rowGap: 15,
    flex: 1,
  },
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
  dateInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  textInputBorderStyle: {
    width: '100%',
    borderWidth: 1,
    borderRadius: RADIUS.rd8,
    borderColor: COLOR.Grey200,
    paddingHorizontal: SPACING.sp10,
  },
  modalBox: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalInnerBox: {
    // backgroundColor: COLOR.White,
    width: '90%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  txt16: {
    fontSize: PIXEL.txt16,
  },
  textGray: {
    color: COLOR.Grey200,
  },
  fontWeight700: {
    fontWeight: '700',
  },
  paddingAll: {
    padding: PIXEL.px10,
  },
});

export default CreateEventTwo;
