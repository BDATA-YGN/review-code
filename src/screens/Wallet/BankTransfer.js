import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Pressable,
  Alert
} from 'react-native';
import React from 'react';
import COLOR from '../../constants/COLOR';
import SPACING from '../../constants/SPACING';
import {fontSizes} from '../../constants/FONT';
import {FontFamily} from '../../constants/FONT';
import RADIUS from '../../constants/RADIUS';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import IconManager from '../../assets/IconManager';
import IconPic from '../../components/Icon/IconPic';
import {useState, useEffect} from 'react';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {retrieveStringData, storeKeys} from '../../helper/AsyncStorage';
import {useDispatch, useSelector} from 'react-redux';
import SizedBox from '../../commonComponent/SizedBox';
import PIXEL from '../../constants/PIXEL';
import {useNavigation} from '@react-navigation/native';
import ActionButton from '../../components/Button/ActionButton';
import {Modal} from 'react-native';
import {Animated} from 'react-native';
import {useWindowDimensions} from 'react-native';
import {paymentType} from '../../constants/CONSTANT_ARRAY';
import ImagePicker from 'react-native-image-crop-picker';
import { submitBankTransfer } from '../../helper/ApiModel';
import AppLoading from '../../commonComponent/Loading';

const BankTransfer = ({route}) => {

  const navigation = useNavigation();
  const {amount,darkMode} = route.params;
  const [modalFilterVisible, setModalFilterVisible] = useState(false);
  const [modalFilterAbankVisible, setModalFilterAbankVisible] = useState(false);
  const [modalFilterAYAVisible, setModalFilterAYAVisible] = useState(false);
  const screenHeight = Dimensions.get('window').height;
  const flatListHeight = screenHeight / 10;
  const layout = useWindowDimensions();
  const slideAnim = useState(new Animated.Value(0))[0]; // Initial value for opacity: 0
  const [photoIsNull, setPhotoValidate] = useState(false);
  const [photo ,setPhoto] = useState('');
  const [isLoading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 400,
        height: 300,
        cropping: true,
      });
      setPhoto(image.path);
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };
  const openModalTransaction = () => {
    setModalFilterVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const closeModalTransaction = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalFilterVisible(false); // Close the modal by setting the visibility to false
      // navigation.navigate('BankTransfer')
    });
  };
  const openModalABank = () => {
    setModalFilterAbankVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const closeModalABank = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalFilterAbankVisible(false); // Close the modal by setting the visibility to false
      // navigation.navigate('BankTransfer')
    });
  };
  const openModalAYA = () => {
    setModalFilterAYAVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const closeModalAYA = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalFilterAYAVisible(false); // Close the modal by setting the visibility to false
      // navigation.navigate('BankTransfer')
    });
  };

  const handleRequestTransfer = () => {
    // Validate that both selectedUser and amount are not empty
    console.log('Selected Photo:', photo); // Log photo path for debugging
    console.log('Amount:', amount); // Log amount for debugging
  
    if (!amount || !photo) {
      Alert.alert('Validation Error', 'Please select a photo and enter an amount.');
      return;
    }
  
    setLoading(true);
  
    submitBankTransfer('wallet', amount, photo)
      .then(value => {
        setLoading(false); // Stop loading after response is received
  
        if (value.api_status === 200) {
          Alert.alert(
            'Success',
            `${value?.message }`,
            [{
              text: 'OK',
              onPress: () => {
                navigation.pop(2)
              },
            },],
            { cancelable: false }
          );
      
        } else {
          // Handle unsuccessful response
          console.error('Error response:', value);
          Alert.alert(
            'Error',
            value.errors.error_text || 'An error occurred while sending money. Please try again.',
            [{ text: 'OK' }],
            { cancelable: false }
          );
        }
      })
      .catch(error => {
        setLoading(false); // Stop loading if there's an error
        console.error('Caught Error:', error); // Log error for debugging
  
        // Check if the error object has a message, otherwise provide a default message
        const errorMessage = error?.response?.data?.error_text || 'An unexpected error occurred. Please try again later.';
        Alert.alert(
          'Error',
          errorMessage,
          [{ text: 'OK' }],
          { cancelable: false }
        );
      });
  };
  
  // const handleRequestTransfer = () => {
  //   setLoading(true);
  //   submitBankTransfer(
  //     'wallet', amount, photo
  //   )
  //     .then(value => {
  //       setLoading(false); 
  //       if (value.api_status === 200) {
  //         // handleClearEventInputData();
  //         setLoading(false);
  //         Alert.alert(
  //           'Success',
  //           'Money sent successfully!',
  //           [
  //             {
  //               text: 'OK',
  //             },
  //           ],
  //           { cancelable: false }
  //         );
  //         console.log('Success:', value); // Log success respo
  //       } else {
  //         setLoading(false);
  //         console.error('Error updating event:', value);
  //       }
  //     })
  //     .catch(error => {
  //       // Handle the error with detailed logging
  //       if (error.response) {
  //         // The request was made and the server responded with a status code outside of the range of 2xx
  //         console.error('Error response data:', error.response.data);
  //         console.error('Error response status:', error.response.status);
  //         console.error('Error response headers:', error.response.headers);
  //       } else if (error.request) {
  //         // The request was made but no response was received
  //         console.error('Error request data:', error.request);
  //       } else {
  //         // Something happened in setting up the request that triggered an Error
  //         console.error('Error message:', error.message);
  //       }
  //       console.error('Error config:', error.config);
  //     });
  // };
  return (
    <SafeAreaView style={darkMode == 'enable' ? styles.DsafeAreaView :styles.safeAreaView}>
      <ActionAppBar
        appBarText="Bank Transfer"
        source={IconManager.back_light}
        backpress={() => navigation.pop()}
        darkMode={darkMode}
      />
      <View style={{padding: SPACING.sp12}}>
      
        <TouchableOpacity
          activeOpacity={0.7}
          style={darkMode == 'enable' ? styles.DgenralContentStyle :styles.genralContentStyle}
          onPress={openModalTransaction}>
          <View style={styles.generalContentHolder}>
            <View style={styles.generalIconAndText}>
              <Image
                resizeMode="contain"
                style={{width: 30, height: 30}}
                source={
                  darkMode === 'enable'
                    ? IconManager.wave_tranfer
                    : IconManager.wave_tranfer
                }
              />
              <SizedBox width={SPACING.sm} />
              <Text
                style={
                  darkMode === 'enable' ? styles.Dcurrent : styles.current
                }>
                Wave Money
              </Text>
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <IconPic
                source={
                  darkMode === 'enable'
                    ? IconManager.next_dark
                    : IconManager.next_light
                }
                width={PIXEL.px12}
                height={PIXEL.px12}
              />
            </View>
          </View>
        </TouchableOpacity>
        <SizedBox height={SPACING.sp15} />
        <TouchableOpacity activeOpacity={0.7} style={darkMode == 'enable' ? styles.DgenralContentStyle :styles.genralContentStyle} onPress={openModalABank}>
          <View style={styles.generalContentHolder}>
            <View style={styles.generalIconAndText}>
              <Image
                resizeMode="contain"
                style={{width: 30, height: 30}}
                source={
                  darkMode === 'enable'
                    ? IconManager.abank_tranfer
                    : IconManager.abank_tranfer
                }
              />
              <SizedBox width={SPACING.sm} />
              <Text
                style={
                  darkMode === 'enable' ? styles.Dcurrent : styles.current
                }>
                A Bank
              </Text>
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <IconPic
                source={
                  darkMode === 'enable'
                    ? IconManager.next_dark
                    : IconManager.next_light
                }
                width={PIXEL.px12}
                height={PIXEL.px12}
              />
            </View>
          </View>
          <SizedBox height={SPACING.sp15} />
        </TouchableOpacity>
        <SizedBox height={SPACING.sp15} />
        <TouchableOpacity activeOpacity={0.7} style={darkMode == 'enable' ? styles.DgenralContentStyle :styles.genralContentStyle} onPress={openModalAYA}>
          <View style={styles.generalContentHolder}>
            <View style={styles.generalIconAndText}>
              <Image
                resizeMode="contain"
                style={{width: 30, height: 30}}
                source={
                  darkMode === 'enable'
                    ? IconManager.aya_transfer
                    : IconManager.aya_transfer
                }
              />
              <SizedBox width={SPACING.sm} />
              <Text
                style={
                  darkMode === 'enable' ? styles.Dcurrent : styles.current
                }>
                AYA Pay
              </Text>
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <IconPic
                source={
                  darkMode === 'enable'
                    ? IconManager.next_dark
                    : IconManager.next_light
                }
                width={PIXEL.px12}
                height={PIXEL.px12}
              />
            </View>
          </View>
          <SizedBox height={SPACING.sp15} />
        </TouchableOpacity>
        <SizedBox height={SPACING.sp15} />
        <View style={darkMode == 'enable' ? styles.Dcard :styles.card}>
          <View style={{flexDirection: 'row'}}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image
                source={darkMode == 'enable' ? IconManager.alert_dark : IconManager.alert_light}
                resizeMode="contain"
                style={{width: 30, height: 30}}
              />
            </View>

            <View
              style={{
                justifyContent: 'center',
                alignSelf: 'center',
                paddingLeft: SPACING.sp5,
              }}>
              <Text style={darkMode == 'enable'? styles.Dcurrent :styles.current}>Notice</Text>
            </View>
          </View>
          <SizedBox height={SPACING.sp15} />
          <Text style={ darkMode == 'enable' ? styles.DnoteText :styles.noteText}>
            In order to confirm the bank transfer, you will need to upload a
            receipt or take a screenshot of your transfer within 1 day from your
            payment date. If a bank transfer is made but no receipt is uploaded
            within this period, your order will be cancelled. We will verify and
            confirm your receipt within 3 working days from the date you upload
            it.
          </Text>
          <SizedBox height={SPACING.sp15} />
          <TouchableOpacity activeOpacity={0.7} onPress={() => pickImage('photo')}>
              <View
                style={[
                  styles.dottedCardStyle,
                  photoIsNull && {borderColor: COLOR.Warning},
                ]}>
                {(photo && (
                  <Image
                    resizeMode="stretch"
                    source={{uri: photo}}
                    style={[styles.croppedImageStyle]}
                  />
                )) || (
                  <TouchableOpacity onPress={() => pickImage('photo')}>
                    <View
                      style={{justifyContent: 'center', alignItems: 'center'}}>
                      <IconPic
                        source={
                          darkMode == 'enable'
                            ? IconManager.uploadphoto_light
                            : IconManager.uploadphoto_light
                        }
                        width={SPACING.sp20}
                        height={SPACING.sp20}
                      />
                      <Text style={[styles.textStylePrimary]}>
                        Upload
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          <SizedBox height={SPACING.sp15} />
          {isLoading && <AppLoading />}
          <ActionButton text="Submit" onPress={handleRequestTransfer}  />
        </View>
      </View>
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
                  },
                 
                ]}>
                <View style={{ overflow:'hidden', borderRadius:RADIUS.rd8  }}>
                  <Image
                    source={IconManager.wave_animation}
                    resizeMode="contain"
                  />
                  <TouchableOpacity style={styles.overlay} onPress={closeModalTransaction}>
                    <Image
                      source={IconManager.close_dark}
                      style = {{ width : 15, height : 15 }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        transparent={true}
        visible={modalFilterAbankVisible}
        onRequestClose={closeModalABank}>
        <TouchableWithoutFeedback onPress={closeModalABank}>
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
                
                ]}>
                <View style={{ overflow:'hidden', borderRadius:RADIUS.rd8  }}>
                  <Image
                    source={IconManager.abank_animation}
                    resizeMode="contain"
                  />
                  <TouchableOpacity style={styles.overlay} onPress={closeModalABank}>
                    <Image
                      source={IconManager.close_dark}
                      style = {{ width : 15, height : 15 }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        transparent={true}
        visible={modalFilterAYAVisible}
        onRequestClose={closeModalAYA}>
        <TouchableWithoutFeedback onPress={closeModalAYA}>
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
                  
                ]}>
                <View style={{ overflow:'hidden', borderRadius:RADIUS.rd8 }}>
                  <Image
                    source={IconManager.aya_animation}
                    resizeMode="contain"
             
                  />
                  <TouchableOpacity style={styles.overlay} onPress={closeModalABank}>
                    <Image
                      source={IconManager.close_dark}
                      style = {{ width : 15, height : 15 }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default BankTransfer;

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
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.White,
    padding: SPACING.md,
  },
  Dcard: {
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.DarkThemLight,
    padding: SPACING.md,
  },
  current: {
    color: COLOR.Grey500,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
  },
  Dcurrent: {
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
  },
  generalContentHolder: {
    flexDirection: 'row',
    // paddingVertical: SPACING.sm,
  },
  generalIconAndText: {
    flex: 1,
    flexDirection: 'row',
  },
  genralContentStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.White,

    padding: SPACING.md,
  },
  DgenralContentStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.DarkThemLight,
    padding: SPACING.md,
  },
  noteText: {
    color: COLOR.Grey500,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    paddingHorizontal: SPACING.sp5,
  },
  DnoteText: {
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    paddingHorizontal: SPACING.sp5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    // justifyContent: 'flex-end',

  },
  modalContainer: {
    
    justifyContent: 'center',
    alignItems:"center",
    overflow: 'hidden',
  },
  modalText: {
    fontSize: fontSizes.size16,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  outlineButtonText: {
    color: COLOR.Primary,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
  },
  overlay: {

    position: 'absolute',
    paddingHorizontal: 10,
    margin : SPACING.sp10,
    // top: '%',
    borderRadius : RADIUS.rd10,
    right: 0,
    alignContent : 'center',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
   
  },
  croppedImageStyle: {width: '100%', height: '100%', borderRadius: RADIUS.rd12},
  dottedCardStyle: {
    borderRadius: RADIUS.rd10,
    height: 80,
    width : 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor : COLOR.Grey20,
    
  },
  textStylePrimary: {
    fontSize: 12,
    color: COLOR.Grey500,
    fontFamily: FontFamily.PoppinRegular,
  },
});
