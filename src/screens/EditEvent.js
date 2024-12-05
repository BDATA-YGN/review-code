import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView,
  Alert,
  RefreshControl,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';

import ActionAppBar from '../commonComponent/ActionAppBar';
import {setFetchDarkMode} from '../stores/slices/DarkModeSlice';
import {retrieveStringData, storeKeys} from '../helper/AsyncStorage';
import IconManager from '../assets/IconManager';
import COLOR from '../constants/COLOR';
import RADIUS from '../constants/RADIUS';
import SPACING from '../constants/SPACING';
import MandatoryTextInput from '../components/TextInputBox/MandatoryTextInput';
import i18n from '../i18n';
import SizedBox from '../commonComponent/SizedBox';
import OptionalTextInput from '../components/TextInputBox/OptionalTextInput';
import {getEventById, updateEvent} from '../helper/ApiModel';
import AppLoading from '../commonComponent/Loading';
import en from '../i18n/en';
import dayjs from 'dayjs';
import {fontSizes} from '../constants/FONT';
import {Modal} from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import {Pressable} from 'react-native';
import PIXEL from '../constants/PIXEL';
import IconPic from '../components/Icon/IconPic';
import {FontFamily} from '../constants/FONT';
import {setEndTime} from '../stores/slices/CreateEventSlice';
import ActionButton from '../components/Button/ActionButton';

const EditEvent = () => {
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const [darkMode, setDarkMode] = useState(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const [photo, setPhoto] = useState(null);
  const eventId = route.params.eventId;
  const [data, setData] = useState(null);
  const optionalTextInputRefs = useRef([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [startdateModalVisible, setStartDateModalVisible] = useState(false);
  const [enddateModalVisible, setEndDateModalVisible] = useState(false);
  const [starttimeModalVisible, setstartTimeModalVisible] = useState(false);
  const [endtimeModalVisible, setendTimeModalVisible] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [starttime, setStartTime] = useState('');
  const [endtime, setEndTime] = useState('');
  const [date, setDate] = useState(dayjs());
  const [time, setTime] = useState(dayjs());
  const [textEdit1, setTextEdit1] = useState(false);
  const [textEdit2, setTextEdit2] = useState(false);
  const [textEdit3, setTextEdit3] = useState(false);
  const [eventName, seteventName] = useState('');
  const [location, setLocation] = useState('');
  const [descript, setDescript] = useState('');
  const navigationAppBar = useNavigation();
  useEffect(() => {
    getDarkModeTheme();
  }, []);

  const getDarkModeTheme = async () => {
    try {
      const darkModeValue = await retrieveStringData({
        key: storeKeys.darkTheme,
      });
      if (darkModeValue !== null) {
        setDarkMode(darkModeValue);
      }
    } catch (error) {
      console.error('Error retrieving dark mode theme:', error);
    }
  };

  const fetchEventDetails = async () => {
    try {
      const response = await getEventById(eventId);
      if (response.status === 200) {
        const eventData = response.event_data; // Destructure the response to get the event data
        setData(eventData);
        seteventName(eventData?.name);
        setStartDate(eventData?.start_date);
        setStartTime(eventData?.start_time);
        setEndDate(eventData?.end_date);
        setEndTime(eventData?.end_time);
        setLocation(eventData?.location);
        setDescript(eventData?.description);
      } else {
        console.error('Failed to fetch event details');
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchEventDetails();
  }, [eventId]);

  const handleEditEvent = () => {
    updateEvent(
      eventId,
      eventName,
      startDate,
      starttime,
      endDate,
      endtime,
      photo,
      location,
      descript,
    )
      .then(value => {
        if (value.api_status === 200) {
          // handleClearEventInputData();
          navigationAppBar.goBack();
        } else {
          console.error('Error updating event:', value);
        }
      })
      .catch(error => {
        // Handle the error with detailed logging
        if (error.response) {
          // The request was made and the server responded with a status code outside of the range of 2xx
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Error request data:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', error.message);
        }
        console.error('Error config:', error.config);
      });
  };

  useEffect(() => {
    setLoading(true);
    fetchEventDetails();
  }, [eventId]);

  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);

  const pickImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 400,
        height: 300,
        cropping: true,
      });
      setPhoto(image.path);
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleButtonPressOK = () => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD'); // Format selected date using dayjs
    setStartDate(formattedDate); // Update birthday state with formatted date
    setStartDateModalVisible(false);
  };
  const handleButtonOK = () => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD'); // Format selected date using dayjs
    setEndDate(formattedDate); // Update birthday state with formatted date
    setEndDateModalVisible(false);
  };
  const handleButtonPressCancel = () => {
    setStartDateModalVisible(false);
  };

  const handleButtonCancel = () => {
    setEndDateModalVisible(false);
  };

  const handleStartTimeButtonPressOK = () => {
    const formattedTime = dayjs(time).format('h:mm A'); // Format selected time using dayjs
    setStartTime(formattedTime); // Dispatch action to update state in Redux store
    setstartTimeModalVisible(false);
  };

  const handleStartTimeButtonPressCancel = () => {
    setstartTimeModalVisible(false);
  };

  const handleEndTimeButtonPressOK = () => {
    const formattedTime = dayjs(time).format('h:mm A'); // Format selected time using dayjs
    setEndTime(formattedTime); // Dispatch action to update state in Redux store
    setendTimeModalVisible(false);
  };

  const handleEndTimeButtonPressCancel = () => {
    setendTimeModalVisible(false);
  };

  return (
    <SafeAreaView
      style={darkMode === 'enable' ? styles.DsafeArea : styles.safeArea}>
      {loading ? (
        <AppLoading />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchEventDetails();
              }}
            />
          }>
          <ActionAppBar
            appBarText="Edit Events"
            source={
              darkMode === 'enable'
                ? IconManager.back_dark
                : IconManager.back_light
            }
            backpress={() => navigation.goBack()}
            darkMode={darkMode}
            actionButtonType={'text-button'}
            actionButtonPress={handleEditEvent}
            actionButtonText={'Save'}
          />
          {data && (
            <ScrollView>
              <TouchableOpacity activeOpacity={0.8} style={styles.img}>
                <ImageBackground
                  style={styles.img}
                  source={{uri: photo || data.cover}}
                  resizeMode="cover">
                  <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <Text style={styles.text}>Select Image</Text>
                  </TouchableOpacity>
                </ImageBackground>
              </TouchableOpacity>
              <SizedBox height={SPACING.sp17} />
              {/* EventName */}
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  alignContent: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '91%',
                    alignContent: 'center',
                    marginHorizontal: 8,
                    justifyContent: 'center',
                    borderColor: textEdit1 ? COLOR.Primary : COLOR.Grey100,
                    borderWidth: 1,
                    borderRadius: 8,
                    backgroundColor:
                      darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
                  }}>
                  <View
                    style={{
                      width: '95%',
                      justifyContent: 'flex-start',
                      alignContent: 'center',
                      alignItems: 'center',
                      height: 50,
                      backgroundColor:
                        darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
                      borderWidth: 0,
                      borderRadius: 8,
                    }}>
                    <TextInput
                      style={{
                        backgroundColor:
                          darkMode == 'enable'
                            ? COLOR.DarkTheme
                            : COLOR.White100,
                        borderRadius: 8,
                        width: '100%',
                        paddingLeft: 8,
                        paddingRight: 16,
                      }}
                      multiline={true}
                      value={eventName}
                      onFocus={() => {
                        setTextEdit1(true);
                      }}
                      onBlur={() => {
                        setTextEdit1(false);
                      }}
                      // placeholder="About Page"
                      color={
                        darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500
                      }
                      placeholderTextColor={
                        darkMode === 'enable' ? COLOR.Grey100 : COLOR.Grey300
                      }
                      onChangeText={text => {
                        seteventName(text);
                      }}
                      textInputStyle={{
                        color: COLOR.Grey500,
                        fontFamily: FontFamily.PoppinRegular,
                        width: '100%',
                        backgroundColor: COLOR.White100,
                        fontSize: fontSizes.size14,
                      }}
                    />
                  </View>
                </View>
              </View>
              <SizedBox height={SPACING.sp17} />
              {/* EventStartDate */}
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: SPACING.sp15,
                }}>
                <View style={{flex: 0.5}}>
                  <TouchableOpacity
                    onPress={() => setStartDateModalVisible(true)}>
                    <View
                      style={
                        darkMode == 'enable'
                          ? styles.DtextInputBorderStyle
                          : styles.textInputBorderStyle
                      }>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingStart: 10,
                          marginRight: 5,
                          paddingVertical: SPACING.sp12,
                        }}>
                        <Image
                          source={
                            darkMode == 'enable'
                              ? IconManager.date_light
                              : IconManager.date_light
                          }
                          style={{width: 17, height: 17}}
                          tintColor={COLOR.Grey200}
                          resizeMode="contain"
                        />
                      </View>

                      <TextInput
                        editable={false}
                        value={startDate}
                        onChangeText={() => setStartDate(true)}
                        number={false}
                        placeholder={i18n.t(`translation:birthday`)}
                        secureTextEntry={false}
                        style={[
                          {
                            fontSize: fontSizes.size15,
                            color:
                              darkMode == 'enable'
                                ? COLOR.White100
                                : COLOR.Grey300,
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
                    visible={startdateModalVisible}
                    onRequestClose={() => setStartDateModalVisible(false)}>
                    <View style={styles.modalBox}>
                      <View style={[darkMode == 'enable' ? styles.DmodalInnerBox :styles.modalInnerBox, {width: '90%'}]}>
                        <DateTimePicker
                          value={date}
                          onValueChange={value => setDate(value)}
                          mode="date"
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
                </View>

                <SizedBox width={SPACING.sp10} />
                {/* EventStartTime */}
                <View style={{flex: 0.5}}>
                  <TouchableOpacity
                    onPress={() => setstartTimeModalVisible(true)}>
                    <View
                      style={
                        darkMode == 'enable'
                          ? styles.DtextInputBorderStyle
                          : styles.textInputBorderStyle
                      }>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingStart: 10,
                          marginRight: 5,
                          paddingVertical: SPACING.sp12,
                        }}>
                        <Image
                          source={
                            darkMode == 'enable'
                              ? IconManager.time_light
                              : IconManager.time_light
                          }
                          style={{width: 17, height: 17}}
                          tintColor={COLOR.Grey200}
                          resizeMode="contain"
                        />
                      </View>

                      <TextInput
                        editable={false}
                        value={starttime}
                        onChangeText={() => setStartTime(true)}
                        number={false}
                        placeholder={i18n.t(`translation:birthday`)}
                        secureTextEntry={false}
                        style={[
                          {
                            fontSize: fontSizes.size15,
                            color:
                              darkMode == 'enable'
                                ? COLOR.White100
                                : COLOR.Grey300,
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
                    visible={starttimeModalVisible}
                    onRequestClose={() => setstartTimeModalVisible(false)}>
                    <View style={styles.modalBox}>
                      <View style={[darkMode == 'enable' ? styles.DmodalInnerBox :styles.modalInnerBox, {width: '90%'}]}>
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
                          <Pressable onPress={handleStartTimeButtonPressCancel}>
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
                          <Pressable onPress={handleStartTimeButtonPressOK}>
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
                </View>
              </View>
              <SizedBox height={SPACING.sp17} />
              {/* EventEndDate */}
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: SPACING.sp15,
                }}>
                <View style={{flex: 0.5}}>
                  <TouchableOpacity
                    onPress={() => setEndDateModalVisible(true)}>
                    <View
                      style={
                        darkMode == 'enable'
                          ? styles.DtextInputBorderStyle
                          : styles.textInputBorderStyle
                      }>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingStart: 10,
                          marginRight: 5,
                          paddingVertical: SPACING.sp12,
                        }}>
                        <Image
                          source={
                            darkMode == 'enable'
                              ? IconManager.date_light
                              : IconManager.date_light
                          }
                          style={{width: 17, height: 17}}
                          tintColor={COLOR.Grey200}
                          resizeMode="contain"
                        />
                      </View>

                      <TextInput
                        editable={false}
                        value={endDate}
                        onChangeText={() => setEndDate(true)}
                        number={false}
                        placeholder={i18n.t(`translation:birthday`)}
                        secureTextEntry={false}
                        style={[
                          {
                            fontSize: fontSizes.size15,
                            color:
                              darkMode == 'enable'
                                ? COLOR.White100
                                : COLOR.Grey300,
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
                    visible={enddateModalVisible}
                    onRequestClose={() => setEndDateModalVisible(false)}>
                    <View style={styles.modalBox}>
                      <View style={[darkMode == 'enable' ? styles.DmodalInnerBox :styles.modalInnerBox, {width: '90%'}]}>
                        <DateTimePicker
                          value={date}
                          onValueChange={value => setDate(value)}
                          mode="date"
                        />
                        <View
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                          }}>
                          <Pressable onPress={handleButtonCancel}>
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
                          <Pressable onPress={handleButtonOK}>
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
                </View>

                <SizedBox width={SPACING.sp10} />
                {/* EventEndTime */}
                <View style={{flex: 0.5}}>
                  <TouchableOpacity
                    onPress={() => setendTimeModalVisible(true)}>
                    <View
                      style={
                        darkMode == 'enable'
                          ? styles.DtextInputBorderStyle
                          : styles.textInputBorderStyle
                      }>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingStart: 10,
                          marginRight: 5,
                          paddingVertical: SPACING.sp12,
                        }}>
                        <Image
                          source={
                            darkMode == 'enable'
                              ? IconManager.time_light
                              : IconManager.time_light
                          }
                          style={{width: 17, height: 17}}
                          tintColor={COLOR.Grey200}
                          resizeMode="contain"
                        />
                      </View>

                      <TextInput
                        editable={false}
                        value={endtime}
                        onChangeText={() => setEndTime(true)}
                        number={false}
                        placeholder={i18n.t(`translation:birthday`)}
                        secureTextEntry={false}
                        style={[
                          {
                            fontSize: fontSizes.size15,
                            color:
                              darkMode == 'enable'
                                ? COLOR.White100
                                : COLOR.Grey300,
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
                    visible={endtimeModalVisible}
                    onRequestClose={() => setendTimeModalVisible(false)}>
                    <View style={styles.modalBox}>
                      <View style={[darkMode == 'enable' ? styles.DmodalInnerBox :styles.modalInnerBox, {width: '90%'}]}>
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
                          <Pressable onPress={handleEndTimeButtonPressCancel}>
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
                          <Pressable onPress={handleEndTimeButtonPressOK}>
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
                </View>
              </View>
              <SizedBox height={SPACING.sp17} />
              {/* EventLocation */}
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignContent: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '91%',
                    alignContent: 'center',
                    marginHorizontal: 8,
                    justifyContent: 'center',
                    borderColor: textEdit2 ? COLOR.Primary : COLOR.Grey100,
                    borderWidth: 1,
                    borderRadius: 8,
                    backgroundColor:
                      darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
                  }}>
                  <View style={{width: '11%', paddingLeft: 10, paddingTop: 16}}>
                    <IconPic
                      source={
                        darkMode == 'enable'
                          ? IconManager.event_location_dark
                          : IconManager.event_location_light
                      }
                    />
                  </View>
                  <View
                    style={{
                      width: '89%',
                      justifyContent: 'flex-start',
                      alignContent: 'center',
                      alignItems: 'center',
                      height: 80,
                      backgroundColor:
                        darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
                      borderWidth: 0,
                      borderRadius: 8,
                    }}>
                    <TextInput
                      style={{
                        backgroundColor:
                          darkMode == 'enable'
                            ? COLOR.DarkTheme
                            : COLOR.White100,
                        borderRadius: 8,
                        width: '100%',
                        // paddingLeft: 8,
                        paddingRight: 16,
                      }}
                      multiline={true}
                      value={location}
                      onFocus={() => {
                        setTextEdit2(true);
                      }}
                      onBlur={() => {
                        setTextEdit2(false);
                      }}
                      placeholder="Location"
                      color={
                        darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500
                      }
                      placeholderTextColor={
                        darkMode === 'enable' ? COLOR.Grey100 : COLOR.Grey300
                      }
                      onChangeText={text => {
                        setLocation(text);
                      }}
                      textInputStyle={{
                        color: COLOR.Grey500,
                        fontFamily: FontFamily.PoppinRegular,
                        width: '100%',
                        backgroundColor: COLOR.White100,
                        fontSize: fontSizes.size14,
                      }}
                    />
                  </View>
                </View>
              </View>

              <SizedBox height={SPACING.sp17} />
              {/* EventDescription */}
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  alignContent: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '91%',
                    alignContent: 'center',
                    marginHorizontal: 8,
                    justifyContent: 'center',
                    borderColor: textEdit3 ? COLOR.Primary : COLOR.Grey100,
                    borderWidth: 1,
                    borderRadius: 8,
                    backgroundColor:
                      darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
                  }}>
                  <View
                    style={{
                      width: '95%',
                      justifyContent: 'flex-start',
                      alignContent: 'center',
                      alignItems: 'center',
                      height: 120,
                      backgroundColor:
                        darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
                      borderWidth: 0,
                      borderRadius: 8,
                    }}>
                    <TextInput
                      style={{
                        backgroundColor:
                          darkMode == 'enable'
                            ? COLOR.DarkTheme
                            : COLOR.White100,
                        borderRadius: 8,
                        width: '100%',
                        paddingLeft: 8,
                        paddingRight: 16,
                      }}
                      placeholder="Description"
                      multiline={true}
                      value={descript}
                      onFocus={() => {
                        setTextEdit3(true);
                      }}
                      onBlur={() => {
                        setTextEdit3(false);
                      }}
                      color={
                        darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500
                      }
                      placeholderTextColor={
                        darkMode === 'enable' ? COLOR.Grey100 : COLOR.Grey300
                      }
                      onChangeText={text => {
                        setDescript(text);
                      }}
                      textInputStyle={{
                        color: COLOR.Grey500,
                        fontFamily: FontFamily.PoppinRegular,
                        width: '100%',
                        backgroundColor: COLOR.White100,
                        fontSize: fontSizes.size14,
                      }}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default EditEvent;

const styles = StyleSheet.create({
  DsafeArea: {
    backgroundColor: COLOR.DarkThemLight,
    flex: 1,
  },
  safeArea: {
    backgroundColor: COLOR.White100,
    flex: 1,
  },
  img: {
    width: '100%',
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderRadius: RADIUS.rd100,
    borderWidth: 2,
    borderColor: COLOR.Primary,
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    paddingVertical: SPACING.sp10,
    paddingHorizontal: SPACING.sp10,
  },
  gradient: {
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textInputHolder: {
    width: '100%',
    paddingHorizontal: SPACING.lg,
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
    backgroundColor: COLOR.DarkThemLight,
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
  textInputBorderStyle: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: RADIUS.rd10,
    backgroundColor: COLOR.White100,
    borderColor: COLOR.Grey200,
    padding: 1,
    borderWidth: 1,
  },
  DtextInputBorderStyle: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: RADIUS.rd10,
    backgroundColor: COLOR.DarkTheme,
    borderColor: COLOR.Grey200,
    padding: 1,
    borderWidth: 1,
  },
  txt16: {
    fontSize: PIXEL.px16,
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
