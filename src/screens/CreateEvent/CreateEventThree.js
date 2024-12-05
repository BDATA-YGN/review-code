import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Modal,
  Pressable,
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
import dayjs from 'dayjs';
import {useDispatch, useSelector} from 'react-redux';
import {
  retrieveJsonData,
  retrieveStringData,
  storeKeys,
} from '../../helper/AsyncStorage';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import RADIUS from '../../constants/RADIUS';
import SPACING from '../../constants/SPACING';
import DateTimePicker from 'react-native-ui-datepicker';
import {
  setEndTime,
  setEndDate,
  setEventName,
  setStartDate,
  setStartTime,
} from '../../stores/slices/CreateEventSlice';

const CreateEventThree = () => {
  const navigation = useNavigation();
  const textInputRef = useRef('');
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [date, setDate] = useState(dayjs());
  const [time, setTime] = useState(dayjs());
  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const endDate = useSelector(state => state.CreateEventSlice.endDate);
  const endTime = useSelector(state => state.CreateEventSlice.endTime);
  const fullStartDate = useSelector(
    state => state.CreateEventSlice.fullStartDate,
  );
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
    getDarkModeTheme();
  }, []);
  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);

  const handleButtonPressOK = () => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD'); // Format selected date using dayjs
    dispatch(setEndDate(formattedDate)); // Update birthday state with formatted date
    setDateModalVisible(false);
  };
  const handleButtonPressCancel = () => {
    setDateModalVisible(false);
  };

  const handleTimeButtonPressOK = () => {
    const formattedTime = dayjs(time).format('h:mm A');
    dispatch(setEndTime(formattedTime));
    setTimeModalVisible(false);
  };
  const handleTimeButtonPressCancel = () => {
    setTimeModalVisible(false);
  };

  const handelNagivate = () => {
    if (endDate != '' && endTime != '') {
      navigation.navigate('CreateEventFour');
    }
  };

  const handleBack = () => {
    dispatch(setEventName(''));
    dispatch(setStartDate(''));
    dispatch(setStartTime(''));
    dispatch(setEndDate(''));
    dispatch(setEndTime(''));
    navigation.pop(3);
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
        //  source={IconManager.back_light}
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
              Step 3/6
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
                width: '50%',
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
                End Date
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
                    darkMode === 'enable'
                      ? styles.DtextInputBorderStyle
                      : styles.textInputBorderStyle,
                    // {paddingVertical: SPACING.sp12},
                  ]}>
                  <TextInput
                    editable={false}
                    value={endDate}
                    // onChangeText={() => setDate(true)}
                    number={false}
                    placeholder="Enter End Date"
                    secureTextEntry={false}
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
                      value={dayjs(fullStartDate).add(0, 'day').toDate()}
                      onValueChange={value => setDate(value)}
                      mode="date"
                      minimumDate={dayjs(fullStartDate)
                        .add(0, 'day')
                        .startOf('day')
                        .toDate()}
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
                End Time
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
                    darkMode === 'enable'
                      ? styles.DtextInputBorderStyle
                      : styles.textInputBorderStyle,
                    // {paddingVertical: SPACING.sp12},
                  ]}>
                  <TextInput
                    editable={false}
                    value={endTime}
                    // onChangeText={() => setEndTime(true)}
                    number={false}
                    placeholder="Enter End Time"
                    secureTextEntry={false}
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

export default CreateEventThree;

const styles = StyleSheet.create({
  safeAreaView: {
    // backgroundColor: COLOR.White100,
    flex: 1,
  },
  stepText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: PIXEL.px15,
  },
  progressBarBackground: {
    // backgroundColor: COLOR.Grey50,
    height: 6,
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    // borderColor: COLOR.Grey50
  },
  labelText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: 19,
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
  container: {
    padding: PIXEL.px16,
    rowGap: 15,
    flex: 1,
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
    alignItems: 'center',
  },
  dropdown1BtnTxtStyle: {
    color: COLOR.Grey500,
    textAlign: 'left',
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
  },
  Ddropdown1BtnTxtStyle: {
    color: COLOR.White100,
    textAlign: 'left',
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
  },
  dropdown1DropdownStyle: {borderRadius: 4, padding: 8},
  Ddropdown1DropdownStyle: {
    borderRadius: 4,
    padding: 8,
    backgroundColor: COLOR.DarkTheme,
  },
  dropdown1RowStyle: {
    backgroundColor: COLOR.White50,
    borderBottomColor: COLOR.White50,
    height: 40,
  },
  Ddropdown1RowStyle: {
    backgroundColor: COLOR.DarkTheme,
    borderBottomColor: COLOR.White50,
    height: 40,
  },
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},
  dateAndGender: {
    flexDirection: 'row',
  },
  modalBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalInnerBox: {
    margin: 10,
    backgroundColor: COLOR.White100,
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

    // width:'100%'
  },
  DmodalInnerBox: {
    margin: 10,
    backgroundColor: COLOR.DarkTheme,
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // width:'100%'
  },
  txt16: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  textGray: {
    color: COLOR.Grey300,
  },
  textWhite: {
    color: COLOR.White100,
  },
  fontWeight700: {
    fontWeight: 700,
  },
  paddingAll: {
    padding: 10,
  },
  inputContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
    padding: 10,
  },
  textInputBorderStyle: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: RADIUS.rd8,
    backgroundColor: COLOR.White100,
    borderColor: COLOR.Grey200,
    padding: 1,
    borderWidth: 1,
  },
  DtextInputBorderStyle: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: RADIUS.rd8,
    backgroundColor: COLOR.DarkTheme,
    borderColor: COLOR.Grey200,
    padding: 1,
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: 'blue',
  },
  txtBlack: {
    color: COLOR.Grey300,
  },
  txtWhite: {
    color: COLOR.White100,
  },
  closeButtonContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
  },
  textInputStyle: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '65%',
  },
  marginTop: {
    marginTop: 24,
  },
});
