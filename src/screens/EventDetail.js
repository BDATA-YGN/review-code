import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  useWindowDimensions,
  Modal,
  FlatList,
  TouchableHighlight,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import COLOR from '../constants/COLOR';
import IconManager from '../assets/IconManager';
import { FontFamily, fontWeight } from '../constants/FONT';
import { fontSizes } from '../constants/FONT';
import SPACING from '../constants/SPACING';
import PIXEL from '../constants/PIXEL';
import RADIUS from '../constants/RADIUS';
import i18n from '../i18n';
import AppBar from '../components/AppBar';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  getEventById,
  getEventGoing,
  getEventInterested,
  submitDeleteEvent,
  submitEventInvite,
  submitGetFriends,
  submitGetNotInEventMember,
  toggleEventInterest,
} from '../helper/ApiModel';
import SizedBox from '../commonComponent/SizedBox';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import ModalComponent from '../commonComponent/ModalComponent';
import {
  LoginUserEventOptions,
  LoginUserPostOptions,
  NonOwnerEventOptions,
  NonOwnerPostOptions,
  OwnerPostOptions,
} from '../constants/CONSTANT_ARRAY';
import PostShimmer from '../components/Post/PostShimmer';
import ListShimmer from './GroupProfile/ListShimmer';
import AppLoading from '../commonComponent/Loading';
import { setFetchDarkMode } from '../stores/slices/DarkModeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { retrieveStringData } from '../helper/AsyncStorage';
import { storeKeys } from '../helper/AsyncStorage';
import WebView from 'react-native-webview';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import { Alert } from 'react-native';
import { setFetchDeleteEvent } from '../stores/slices/DeleteEventSlice';
import SearchTextInput from '../components/TextInputBox/SearchTextInput';
import DualAvater from '../components/DualAvater';
const EventDetail = props => {
  const navigation = useNavigation();
  const [data, setData] = useState(null); // Initialize with null
  const route = useRoute();
  const { eventId } = route.params;
  const [openModal, setOpenModal] = useState(false);
  const [interestStatus, setInterestStatus] = useState(null);
  const [goStatus, setGoStatus] = useState(null);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme

  const slideAnim = useState(new Animated.Value(0))[0];
  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight / 2;
  const layout = useWindowDimensions();
  const [userModalVisible, setModalUserVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [friendList, setFriendList] = useState([]);



  
  const getNotInEventMember = () => {
    // console.log('gg');
    
    submitGetNotInEventMember(eventId).then(value => {
      console.log('eeeeeeeeeeee',value);
      
      if (value.api_status === 200) {
        // console.log('niem', value.data);
        setFriendList(value.users)
        
      
      } else {
      }
    });
  };

  const handleClearInput = () => {
    setSearchText("");

  }

  const handleEventInvite = (user_id) => {
    console.log(user_id);
    
    submitEventInvite(user_id, eventId).then(value => {
      console.log(value);
      if (value.api_status === 200) {
        // setFriendList(value.data.followers);
        console.log(value);
        getNotInEventMember();
        
      } else {
      }
    });
  }

  

  // const getFriendList = () => {
  //   submitGetFriends('followers,following').then(value => {
  //     if (value.api_status === 200) {
  //       // console.log('frilist', value.data);
        
  //       setFriendList(value.data.followers);
  //     } else {
  //     }
  //   });
  // };

  const openUserModal = () => {
    setModalUserVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const closeUserModal = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalUserVisible(false);
      // filterMyProductList(dispatch, handleCategory());
    });
  };

  const handleEdit = () => {
    navigation.navigate('EditEvent', { eventId });
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
    // getFriendList();
    getNotInEventMember();
    getDarkModeTheme();
  }, []);
  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);

  const fetchEventDetails = async () => {
    try {
      const response = await getEventById(eventId);
      if (response.status === 200) {
        setData(response.event_data);
        setOptions(
          response.event_data.is_owner
            ? LoginUserEventOptions
            : NonOwnerEventOptions,
        );  
        setInterestStatus(
          response.event_data.is_interested ? 'interested' : 'not_interested',
        );
        setGoStatus(response.event_data.is_going ? 'going' : 'not_going');
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
    fetchEventDetails();
  }, [eventId]);

  const handleInterestToggle = async () => {
    try {
      const response = await getEventInterested(eventId);
      if (response.api_status === 200) {
        setInterestStatus(response.interest_status);
      } else {
        console.error('Failed to update interest status');
      }
    } catch (error) {
      console.error('Error updating interest status:', error);
    }
  };

  const handleGoingToggle = async () => {
    try {
      const response = await getEventGoing(eventId);
      if (response.api_status === 200) {
        setGoStatus(response.go_status);
      } else {
        console.error('Failed to update interest status');
      }
    } catch (error) {
      console.error('Error updating interest status:', error);
    }
  };
  const DeleteEvent = async () => {
    try {
      const response = await submitDeleteEvent(eventId);
      if (response.api_status === 200) {
        navigation.goBack();
        dispatch(setFetchDeleteEvent(true));
      } else {
        console.error('Failed to update interest status');
      }
    } catch (error) {
      console.error('Error updating interest status:', error);
    }
  };

  const renderMap = () => {
    const mapUrl = `https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(
      data.location,
    )}&key=AIzaSyA99bxTNkibka6lyd2N6oCYVt6maJfsa1E&zoom=18`;

    return (
      <WebView
        originWhitelist={['*']}
        source={{
          html: `
                <html>
                    <body style="margin:0;padding:0;">
                        <iframe width="100%" height="100%" frameborder="0" style="border:0"
                            src= ${mapUrl}
                            allowfullscreen>
                        </iframe>
                    </body>
                </html>`,
        }}
        style={styles.map}
      />
    );
  };

  return (
    <SafeAreaView
      style={darkMode == 'enable' ? styles.DSafeAreaView : styles.SafeAreaView}>
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
          <View>
            {data && (
              <ScrollView>
                <ImageBackground
                  source={
                    data.cover
                      ? { uri: data.cover }
                      : IconManager.notificationBg_light
                  }
                  resizeMode="cover"
                  style={styles.image}>
                  <View
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={{ flex: 1, justifyContent: 'space-between' }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.goBack}>
                        <Image
                          source={IconManager.back_dark}
                          resizeMode="contain"
                          style={styles.HeaderBackButton}
                        />
                      </TouchableOpacity>
                      <View style={{ flex: 1 }} />
                      <TouchableOpacity
                        onPress={() => {
                          !props.isFromShare && setOpenModal(true);
                        }}
                        style={{ ...styles.goBack, marginRight: 20 }}>
                        <Image
                          source={IconManager.dot_light}
                          resizeMode="contain"
                          style={styles.HeaderBackButton}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.dateContainer}>
                      <View style={{ marginRight: SPACING.sp10 }}>
                        <Text style={styles.date}>Start Date</Text>
                        <Text style={styles.dateText}>{data.start_date}</Text>
                      </View>
                      <View>
                        <Text style={styles.date}>End Date</Text>
                        <Text style={styles.dateText}>{data.end_date}</Text>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
                <View
                  style={{
                    padding: SPACING.sp18,
                    backgroundColor:
                      darkMode == 'enable'
                        ? COLOR.DarkThemLight
                        : COLOR.White100,
                  }}>
                  <Text
                    style={{
                      fontSize: fontSizes.size23,
                      fontFamily: FontFamily.PoppinSemiBold,
                      fontWeight: fontWeight.weight600,
                      color:
                        darkMode == 'enable'
                          ? COLOR.White100
                          : COLOR.DarkThemLight,
                    }}
                    numberOfLines={2}>
                    {data?.name}
                  </Text>
                  <SizedBox height={SPACING.sp10} />
                  <View>
                    {data.is_owner ? (
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom: SPACING.sp15,
                        }}>
                        <TouchableOpacity
                          style={styles.button}
                          onPress={handleEdit}>
                          <Text
                            style={
                              // darkMode == 'enable'
                              styles.DbuttonTextWhite
                              // : styles.buttonText
                            }>
                            Edit
                          </Text>
                        </TouchableOpacity>
                        <SizedBox width={SPACING.sp15} />
                        <TouchableOpacity
                          style={styles.button}
                          onPress={() => {
                            DeleteEvent('delete');
                          }}>
                          <Text
                            style={

                              styles.DbuttonTextWhite

                            }>
                            Delete
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom: SPACING.sp15,
                        }}>
                        {/* {props.eventType !== 'past' && ( */}
                        <TouchableOpacity
                          style={
                            goStatus == 'going'
                              ? darkMode == 'enable'
                                ? styles.DbuttonWhite
                                : styles.buttonWhite
                              : styles.button
                          }
                          onPress={handleGoingToggle}>
                          <Text
                            style={
                              goStatus == 'going'
                                ? darkMode == 'enable'
                                  ? styles.DbuttonTextWhite
                                  : styles.buttonText
                                : styles.buttonTextWhite
                            }>
                            {goStatus == 'going' ? 'Going' : 'Go'}
                          </Text>
                        </TouchableOpacity>
                        {/* )} */}
                        <SizedBox width={SPACING.sp15} />
                        <TouchableOpacity
                          style={
                            interestStatus == 'interested'
                              ? darkMode == 'enable'
                                ? styles.DbuttonWhite
                                : styles.buttonWhite
                              : styles.button
                          }
                          onPress={handleInterestToggle}>
                          <Text
                            style={
                              interestStatus == 'interested'
                                ? darkMode == 'enable'
                                  ? styles.DbuttonTextWhite
                                  : styles.buttonText
                                : styles.buttonTextWhite
                            }>
                            Interested
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  <SizedBox height={SPACING.sp1} color={COLOR.Grey50} />
                  <View style={styles.peopleInfoContainer}>
                    <View style={styles.peopleInfo}>
                      <Text
                        style={
                          darkMode == 'enable'
                            ? styles.DtextPeople
                            : styles.textPeople
                        }>
                        People Going
                      </Text>
                      <Text
                        style={
                          darkMode == 'enable'
                            ? styles.DtextNum
                            : styles.textNum
                        }>
                        {data.going_count}
                      </Text>
                    </View>
                    <View style={styles.peopleInfo}>
                      <Text
                        style={
                          darkMode == 'enable'
                            ? styles.DtextPeople
                            : styles.textPeople
                        }>
                        People Interested
                      </Text>
                      <Text
                        style={
                          darkMode == 'enable'
                            ? styles.DtextNum
                            : styles.textNum
                        }>
                        {data.interested_count}
                      </Text>
                    </View>


                  </View>

                  {data.is_owner ? (
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginTop: 16 }} onPress={openUserModal}>
                      <Image
                        source={IconManager.add_user_light}
                        resizeMode="contain"
                        style={{ width: 20, height: 20, marginRight: 10 }}
                      />
                      <Text style={{ fontFamily: FontFamily.PoppinRegular, color: COLOR.Grey500 }}>Invite friends to join this event</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
                <SizedBox height={SPACING.sp10} />
                <View
                  style={{
                    padding: SPACING.sp18,
                    backgroundColor:
                      darkMode == 'enable'
                        ? COLOR.DarkThemLight
                        : COLOR.White100,
                  }}>
                  <Text
                    style={
                      darkMode == 'enable'
                        ? styles.DeventTitle
                        : styles.eventTitle
                    }>
                    Event Description
                  </Text>
                  <Text
                    style={
                      darkMode == 'enable' ? styles.DeventDes : styles.eventDes
                    }>
                    {data?.description}
                  </Text>
                </View>
                <SizedBox height={SPACING.sp10} />
                <View
                  style={{
                    padding: SPACING.sp18,
                    backgroundColor:
                      darkMode == 'enable'
                        ? COLOR.DarkThemLight
                        : COLOR.White100,
                  }}>
                  <Text
                    style={
                      darkMode == 'enable'
                        ? styles.DeventTitle
                        : styles.eventTitle
                    }>
                    Location
                  </Text>
                  <Text
                    style={
                      darkMode == 'enable' ? styles.DeventDes : styles.eventDes
                    }>
                    {data.location}
                  </Text>
                  {renderMap()}
                </View>
              </ScrollView>
            )}
          </View>
        </ScrollView>
      )}

      <ModalComponent
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
        options={options}
        eventId={eventId}
        eventData={data}
      />







<Modal transparent={true} visible={userModalVisible} onRequestClose={closeUserModal}>
  <TouchableWithoutFeedback onPress={closeUserModal}>
    <View style={[styles.modalOverlay]}>
      <TouchableWithoutFeedback>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layout.height, 0],
                  }),
                },
              ],
            },
            {
              backgroundColor:
                darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
            },
          ]}
        >
          {/* Search Input Component */}
          <SearchTextInput
            searchText={searchText}
            setSearchText={setSearchText}
            // handleSearch={handleSearch}
            handleClearInput={handleClearInput}
            darkMode={darkMode}
          />

          {/* Divider */}
          <View
            style={{
              width: '100%',
              backgroundColor:
                darkMode === 'enable' ? COLOR.White100 : COLOR.Grey200,
            }}
          />

          {/* Modal Content */}
          <View style={{ height: modalHeight }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableHighlight>
                <View style={{ gap: 20, marginTop: 30 }}>
                  {/* Filtering the friendList based on the searchText */}
                  {friendList
                    .filter((item) => 
                      item.name.toLowerCase().includes(searchText.toLowerCase())
                    ) // Filter friendList by name
                    .map((item, index) => (
                      <View
                        style={[
                          styles.contentItem,
                          darkMode === 'enable'
                            ? { backgroundColor: COLOR.DarkFadeLight }
                            : { backgroundColor: COLOR.White },
                        ]}
                        key={index} // Ensure key is properly set for each item
                      >
                        {/* Friend Avatar and Name */}
                        <View style={styles.profileContent}>
                          <DualAvater
                            largerImageWidth={45}
                            largerImageHeight={45}
                            src={item.avatar}
                            iconBadgeEnable={false}
                          />
                          <Text
                            style={[
                              styles.profileText,
                              darkMode === 'enable'
                                ? { color: COLOR.White }
                                : { color: COLOR.Grey500 },
                            ]}
                          >
                            {item.name}
                          </Text>
                        </View>

                        {/* Invite Button */}
                        <TouchableOpacity
                          style={{
                            backgroundColor: COLOR.Blue50,
                            borderRadius: 15,
                            width: 70,
                            height: 20,
                          }}
                          onPress={() => handleEventInvite(item.user_id)}
                        >
                          <Text
                            style={{
                              fontFamily: FontFamily.PoppinSemiBold,
                              fontSize: fontSizes.size13,
                              textAlign: 'center',
                            }}
                          >
                            Invite
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                </View>
              </TouchableHighlight>
            </ScrollView>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
</Modal>


    </SafeAreaView>
  );
};

export default EventDetail;

const styles = StyleSheet.create({
  contentItem: {
    padding: SPACING.xxs,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileContent: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  profileText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size19,
  },
  SafeAreaView: {
    flex: 1,
    width: '100%',
    // backgroundColor:'red',
  },
  DSafeAreaView: {
    flex: 1,
    width: '100%',
    backgroundColor: COLOR.DarkTheme,
  },
  goBack: {
    paddingTop: 20,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
  },
  button: {
    // width: PIXEL.px150,
    flex: 0.5,
    height: PIXEL.px50,
    backgroundColor: COLOR.Primary,
    borderRadius: RADIUS.rd8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWhite: {
    // width: PIXEL.px150,
    flex: 0.5,
    height: PIXEL.px50,
    backgroundColor: COLOR.Blue50,
    borderRadius: RADIUS.rd8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  DbuttonWhite: {
    // width: PIXEL.px150,
    flex: 0.5,
    height: PIXEL.px50,
    backgroundColor: COLOR.DarkFadeLight,
    borderRadius: RADIUS.rd8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: fontSizes.size16,
    color: COLOR.Grey500,
    fontFamily: FontFamily.PoppinRegular,
  },
  buttonTextWhite: {
    textAlign: 'center',
    fontSize: fontSizes.size16,
    color: COLOR.White,
    fontFamily: FontFamily.PoppinRegular,
  },
  DbuttonTextWhite: {
    textAlign: 'center',
    fontSize: fontSizes.size16,
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinRegular,
  },
  HeaderBackButton: {
    width: 20,
    height: 15,
    marginLeft: 10,
  },
  peopleInfoContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    paddingHorizontal: SPACING.sp20,
    marginTop: SPACING.sp15,
  },
  peopleInfo: {
    marginEnd: SPACING.sp30,
  },
  textPeople: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    fontWeight: fontWeight.weight400,
    color: COLOR.Grey500,
  },
  DtextPeople: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    fontWeight: fontWeight.weight400,
    color: COLOR.White100,
  },
  textNum: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    fontWeight: fontWeight.weight400,
    color: COLOR.Grey500,
  },
  DtextNum: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    fontWeight: fontWeight.weight400,
    color: COLOR.White100,
  },
  eventTitle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    fontWeight: fontWeight.weight400,
    color: COLOR.Grey500,
  },
  DeventTitle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    fontWeight: fontWeight.weight400,
    color: COLOR.White100,
  },
  eventDes: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    fontWeight: fontWeight.weight400,
    color: COLOR.Grey500,
  },
  DeventDes: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    fontWeight: fontWeight.weight400,
    color: COLOR.White100,
  },
  map: {
    width: '100%',
    height: 300,
    marginTop: SPACING.sp20,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    // alignItems:'center',
    // position: 'absolute',
    // paddingTop:'35%',
    width: '100%',
    paddingBottom: SPACING.sp10,
  },
  dateText: {
    fontSize: fontSizes.size19,
    color: COLOR.White,
    fontWeight: fontWeight.weight600,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  date: {
    textAlign: 'center',
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    // flex : 1,
    width: '100%',
    borderRadius: 10,
    padding: 16,
    justifyContent: 'center',
  },
});
