import React, {useState, useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Modal,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {retrieveStringData, storeKeys} from '../../helper/AsyncStorage';
import {setUserInfoData} from '../../stores/slices/market_slice';
import {retrieveJsonData} from '../../helper/AsyncStorage';
import COLOR from '../../constants/COLOR';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import IconManager from '../../assets/IconManager';
import RADIUS from '../../constants/RADIUS';
import SPACING from '../../constants/SPACING';
import {FontFamily, fontSizes, fontWeight} from '../../constants/FONT';
import SizedBox from '../../commonComponent/SizedBox';
import ActionButton from '../../components/Button/ActionButton';
import {Dimensions} from 'react-native';
import {
  getUserInfoData,
  requestFollowersAndFollowingList,
  submitSendMoney,
} from '../../helper/ApiModel';
import {Alert} from 'react-native';
import {useRef} from 'react';
import MandatoryTextInput from '../../components/TextInputBox/MandatoryTextInput';
import i18n from '../../i18n';
import ProfileAvatar from '../../components/Icon/ProfileAvatar';
import IconPic from '../../components/Icon/IconPic';
import PIXEL from '../../constants/PIXEL';
import AppLoading from '../../commonComponent/Loading';
import { useFocusEffect } from '@react-navigation/native';

const SendMoney = ({route}) => {
  const navigation = useNavigation();
  const {userInfoData ,darkMode} = route.params;;
  const dispatch = useDispatch();
  const textInputRefs = useRef([]);
  const [modalFilterVisible, setModalFilterVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(0))[0];
  const layout = useWindowDimensions();
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const [following, setFollowing] = useState([]);
  const [filteredFollowing, setFilteredFollowing] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [amount, setAmount] = useState('');
  const [note , setNote] = useState('');
  const [isLoading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selected, setSelected] = useState(false);
  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight /2.5;
  // const [userInfoData, setUserInfoData] = useState([]);
  // Open modal and animate
  const openModalTransaction = () => {
    setModalFilterVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  // Close modal and reset animation
  const closeModalTransaction = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setModalFilterVisible(false);
      // if (inputRef.current) {
      //   inputRef.current.blur(); // Blur the input to reset focus state
      // }
    });
  };

  const handleUserSelect = user => {
    setSelectedUser(user.name); // Set the selected user's username
    setSelectedUserId(user.user_id); // Store user_id separately
    closeModalTransaction(); // Close the modal after selection
  };



  // Handle search input and filter following list
  const handleSearch = text => {
    setSearchText(text);
    if (text === '') {
      setFilteredFollowing(following);
    } else {
      setFilteredFollowing(
        following.filter(
          user =>
            user.first_name.toLowerCase().includes(text.toLowerCase()) ||
            user.last_name.toLowerCase().includes(text.toLowerCase()),
        ),
      );
    }
  };

  const fetchData = async () => {
    try {
      
      const user_id = userInfoData.user_id;
      const userDataResponse = await requestFollowersAndFollowingList(
        'followers,following',
        user_id,
      );

      const followingData = userDataResponse.data.following;
      if (followingData) {
        const filteredData = userDataResponse.data.following.filter(
          item => item.user_id !== user_id,
        );
        setFollowing(filteredData);
        setFilteredFollowing(filteredData);
      } else {
        console.error('Failed getting followers and followings');
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  // Initial data fetch and dark mode theme fetch
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      dispatch(setUserInfoData(userInfoData));
    }, []),
  );



  const handleSendMoney = () => {
    const validAmount = amount >= 1;
    const validUser = selectedUser !== '';

    if (validAmount && validUser) {
      setLoading(true);

      submitSendMoney('send', note, amount, selectedUserId)
        .then(response => {
          setLoading(false);

          if (response.api_status === 200) {
            Alert.alert(
              'Success',
              response.message,
              [{ text: 'OK', onPress: () => navigation.pop(1) }],
              { cancelable: false }
            );
          } else {
            const errorMessage = response.errors?.error_text || 'An unknown error occurred.';
            Alert.alert(
              'Error',
              errorMessage,
              [{ text: 'OK' }],
              { cancelable: false }
            );
          }
        })
        .catch(() => {
          setLoading(false);
          Alert.alert(
            'Error',
            'Something went wrong. Please try again later.',
            [{ text: 'OK' }],
            { cancelable: false }
          );
        });
    } else {
      Alert.alert('Error', 'Please enter a valid amount greater than 1ks.');
    }
  };
  
  return (
    <SafeAreaView style={ darkMode == 'enable' ? styles.DsafeAreaView :styles.safeAreaView}>
      <ActionAppBar
        appBarText="Send Money"
        source={IconManager.back_light}
        backpress={() => navigation.pop()}
        darkMode ={darkMode}
      />
         <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
      <View style= { darkMode == 'enable' ? styles.Dcard : styles.card}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{marginEnd: SPACING.sp5}}>
            <Image
              resizeMode="contain"
              source={darkMode == 'enable' ? IconManager.send_arrow_dark :IconManager.send_arrow_light}
              style={{width: 25, height: 25}}
            />
          </View>
          <Text style={darkMode == 'enable' ? styles.DsendText :styles.sendText}>Send money to friends</Text>
        </View>
        <SizedBox height={SPACING.md} />
        <Text style={darkMode == 'enable' ? styles.DsendSmallText :styles.sendSmallText}>
          You can send money to your friends, acquaintances, or anyone.
        </Text>
        <SizedBox height={SPACING.lg} />
        <View>
          <Text style={darkMode == 'enable' ? styles.DsendSmallText :styles.sendSmallText}>To whom do you want to send?</Text>
          <SizedBox height={SPACING.sp10} />
          <TouchableOpacity style={darkMode == 'enable' ? styles.DtimeCard :styles.timeCard} activeOpacity={0.8}>
            <TextInput
              ref={inputRef}
              placeholder="Username or email"
              style={[
                {
                  fontSize: fontSizes.size15,
                  color: darkMode == 'enable' ? COLOR.White100 :COLOR.Grey300,
                  flex: 1,
                  fontFamily: FontFamily.PoppinRegular,
                  backgroundColor : darkMode == 'enable' && COLOR.DarkThemLight,
                  paddingVertical : 14,
                },
              ]}
              onFocus={openModalTransaction}
              value={selectedUser}
              onChangeText={(text) => setSelectedUser(text)}
              placeholderTextColor={ darkMode == 'enable' ? COLOR.White100 :COLOR.Grey300}
            />
          </TouchableOpacity>
          <SizedBox height={SPACING.sp10} />

          <TouchableOpacity style={darkMode == 'enable' ? styles.DtimeCard :styles.timeCard} activeOpacity={0.8}>
            <TextInput
              editable={true}
              placeholder="Amount"
              style={[
                {
                  fontSize: fontSizes.size15,
                  color: darkMode == 'enable' ? COLOR.White100 :COLOR.Grey300,
                  flex: 1,
                  fontFamily: FontFamily.PoppinRegular,
                  paddingVertical : 14,
                },
              ]}
              keyboardType='numeric'
              placeholderTextColor={ darkMode == 'enable' ? COLOR.White100 :COLOR.Grey300}
              value={amount}
              onChangeText={text => setAmount(text)} // Add this line to update the amount state
            />
          </TouchableOpacity>
          <SizedBox height={SPACING.sp10} />
          <TouchableOpacity style={ darkMode == 'enable' ? styles.DnoteCard :styles.noteCard} activeOpacity={0.8}>
            <TextInput
              editable={true}
              placeholder="Note"
              multiline={true}
              style={[
                {
                  fontSize: fontSizes.size15,
                  color: darkMode == 'enable' ? COLOR.White100 :COLOR.Grey300,
                  // flex: 1,
                  fontFamily: FontFamily.PoppinRegular,
                  paddingVertical : 14,
                 
                },
              ]}
              placeholderTextColor={ darkMode == 'enable' ? COLOR.White100 :COLOR.Grey300}
              value={note}
              onChangeText={text => setNote(text)} // Add this line to update the amount state
            />
          </TouchableOpacity>
        </View>
        <SizedBox height={SPACING.md} />
        {isLoading && <AppLoading />}
        <ActionButton text="Submit" onPress={handleSendMoney} />
      </View>
      </ScrollView>
      </KeyboardAvoidingView>
      <Modal
        transparent={true}
        visible={modalFilterVisible}
        onRequestClose={closeModalTransaction}>
        <TouchableWithoutFeedback onPress={closeModalTransaction}>
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
                    backgroundColor:
                      darkMode === 'enable'
                        ? COLOR.DarkThemLight
                        : COLOR.White100,
                  },
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
              
              
                </View>
                <SizedBox height={SPACING.sp10} />
                <TouchableOpacity style={ darkMode == 'enable' ? styles.DtimeCard :styles.timeCard} activeOpacity={0.8}>
                  <Image
                    source={IconManager.search_light}
                    style={{width: 16, height: 16 , marginRight : 5}}
                  />
                  <TextInput
                    editable={true}
                    placeholder="Search"
                    value={searchText}
                    onChangeText={handleSearch}
                    style={[
                      {
                        fontSize: fontSizes.size15,
                        color:
                          darkMode === 'enable' ? COLOR.White : COLOR.Grey300,
                        fontFamily: FontFamily.PoppinRegular,
                        flex: 1,
                        paddingVertical : 14,
                      },
                    ]}
                    placeholderTextColor={
                      darkMode === 'enable' ? COLOR.White : COLOR.Grey300
                    }
                  />
                      <TouchableOpacity
                    style={{flex: 0.1}}
                    onPress={closeModalTransaction}>
                    <Image
                      source={
                        darkMode == 'enable'
                          ? IconManager.close_dark
                          : IconManager.close_light
                      }
                      resizeMode="contain"
                      style={{width: 20, height: 20}}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
                <SizedBox height={SPACING.sp10} />
                <View style={{ height:modalHeight }}>
                <FlatList
                  data={filteredFollowing}
                  keyExtractor={item => item.user_id.toString()}
                  renderItem={({item}) => (
                    <View style={ darkMode == 'enable' ? styles.DprofileHolder : styles.profileHolder}>
                      <TouchableOpacity
                        // onPress={() => {
                        //   navigation.navigate('OtherUserProfile', {
                        //     otherUserData: item,
                        //     userId: item.user_id,
                        //   });
                        // }}

                        // activeOpacity={0.8}
                        style={[
                          darkMode == 'enable' ? styles.Dprofile :styles.profile,
                          {
                            backgroundColor:
                              darkMode == 'enable'
                                ? COLOR.DarkThemLight
                                : COLOR.White100,
                          },
                        ]}>
                        <TouchableOpacity
                          style={ darkMode == 'enable' ? styles.DprofileContentHandle :styles.profileContentHandle}
                          // onPress={() => {
                          //   navigation.navigate('OtherUserProfile', {
                          //     otherUserData: item,
                          //     userId: item.user_id,
                          //   });
                          // }}
                          onPress={() => handleUserSelect(item)}
                          activeOpacity={0.8}>
                          <ProfileAvatar src={item.avatar} />
                          <SizedBox width={SPACING.xs} />
                          <View style={{flex: 1}}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                width: '90%',
                              }}>
                              <Text
                                numberOfLines={1}
                                style={[
                                  styles.username,
                                  {
                                    color:
                                      darkMode == 'enable'
                                        ? COLOR.White50
                                        : COLOR.Grey500,
                                  },
                                ]}>
                                {/* {item.first_name} {item.last_name} */}
                                {item.first_name !== '' ? `${item.first_name} ${item.last_name}` : item.username}
                              </Text>
                              <SizedBox width={SPACING.sp4} />
                              {item.is_verified == 1 && (
                                <IconPic
                                  source={IconManager.user_type_light_dark}
                                />
                              )}
                            </View>
                            <Text
                              style={[
                                styles.viewProfile,
                                {
                                  color:
                                    darkMode == 'enable'
                                      ? COLOR.White500
                                      : COLOR.Grey500,
                                },
                              ]}>
                              {item.lastseen_time_text}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleUserSelect(item)}>
                          <View style={ darkMode == 'enable' ? styles.Dselectbg :styles.selectbg}>
                            {item.user_id === selectedUserId && (
                              <View style={styles.select} />
                            )}
                          </View>
                        </TouchableOpacity>
                      </TouchableOpacity>
                      <SizedBox />
                    </View>
                  )}
                />
                </View>
                
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};



export default SendMoney;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: COLOR.Grey50,
  },
  DsafeAreaView: {
    flex: 1,
    backgroundColor: COLOR.DarkTheme,
  },
  card: {
    backgroundColor: COLOR.White200,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
  },
  Dcard: {
    backgroundColor: COLOR.DarkThemLight,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
  },
  sendText: {
    fontSize: fontSizes.size18,
    fontWeight: fontWeight.bold,
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Grey500,
  },
  DsendText: {
    fontSize: fontSizes.size18,
    fontWeight: fontWeight.bold,
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.White,
  },
  sendSmallText: {
    fontSize: fontSizes.size14,
    color: COLOR.Grey500,
    fontFamily: FontFamily.PoppinRegular,
  },
  DsendSmallText: {
    fontSize: fontSizes.size14,
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinRegular,
  },
  timeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.xxs,
    backgroundColor: COLOR.White100,
    borderWidth: 1,
    borderColor: COLOR.Grey100,
  },
  DtimeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.xxs,
    backgroundColor: COLOR.DarkThemLight,
    borderWidth: 1,
    borderColor: COLOR.Grey100,
  },
  noteCard: {
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.xxs,
    backgroundColor: COLOR.White100,
    borderWidth: 1,
    height : 100,
    borderColor: COLOR.Grey100,
  },
  DnoteCard: {
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.xxs,
    backgroundColor: COLOR.DarkThemLight,
    borderWidth: 1,
    height : 150,
    borderColor: COLOR.Grey100,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',

  },
  modalContainer: {
    
    borderTopLeftRadius: RADIUS.sm,
    borderTopRightRadius: RADIUS.sm,
    padding: SPACING.md,
  },
  current: {
    fontSize: fontSizes.size16,
    color: COLOR.Dark100,
    fontFamily: FontFamily.PoppinRegular,
  },
  friendCard: {
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    marginVertical: SPACING.sp5,
  },
  profileHolder: {
    flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
    width: '100%',
    backgroundColor: COLOR.White100,
    borderBottomColor: COLOR.Grey50,
    borderBottomWidth: 1,
  },
  DprofileHolder: {
    flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
    width: '100%',
    backgroundColor: COLOR.DarkThemLight,
   
    borderBottomWidth: 1,
  },
  profile: {
    width: '90%',
    borderRadius: RADIUS.xs,
    backgroundColor: 'red',
    margin: SPACING.xs,
    paddingVertical: SPACING.sp5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Dprofile: {
    width: '90%',
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.DarkThemLight,
    margin: SPACING.xs,
    paddingVertical: SPACING.sp5,
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
  DprofileContentHandle: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor : COLOR.DarkThemLight
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
  select: {
    width: 10,
    height: 10,
    backgroundColor: COLOR.Primary,
    borderRadius: RADIUS.rd50,
  },
  selectbg: {
    width: 20,
    height: 20,
    backgroundColor: COLOR.Blue50,
    borderRadius: RADIUS.rd50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Dselectbg: {
    width: 20,
    height: 20,
    backgroundColor: COLOR.DarkFadeLight,
    borderRadius: RADIUS.rd50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
