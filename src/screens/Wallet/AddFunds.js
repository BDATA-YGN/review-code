import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Pressable,
} from 'react-native';
import React from 'react';
import COLOR from '../../constants/COLOR';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import IconManager from '../../assets/IconManager';
import { useNavigation } from '@react-navigation/native';
import RADIUS from '../../constants/RADIUS';
import SPACING from '../../constants/SPACING';
import { FontFamily } from '../../constants/FONT';
import { fontSizes } from '../../constants/FONT';
import SizedBox from '../../commonComponent/SizedBox';
import { fontWeight } from '../../constants/FONT';
import AppLoading from '../../commonComponent/Loading';
import ActionButton from '../../components/Button/ActionButton';
import i18n from '../../i18n';
import { Animated } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { setFetchDarkMode } from '../../stores/slices/DarkModeSlice';
import { retrieveStringData, storeKeys } from '../../helper/AsyncStorage';
import { useDispatch, useSelector } from 'react-redux';
import { paymentType } from '../../constants/CONSTANT_ARRAY';

const AddFunds = ({ route }) => {
  const navigation = useNavigation();
  const { darkMode } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [modalFilterVisible, setModalFilterVisible] = useState(false);
  const screenHeight = Dimensions.get('window').height;
  const flatListHeight = screenHeight / 10;
  const layout = useWindowDimensions();
  const transactionListHeight = screenHeight / 1.8;
  const slideAnim = useState(new Animated.Value(0))[0]; // Initial value for opacity: 0
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [amount, setAmount] = useState('');


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
      // navigation.navigate('BankTransfer' , {amount})
    });
  };
  return (
    <SafeAreaView style={darkMode == 'enable' ? styles.DsafeAreaView : styles.safeAreaView}>
      <ActionAppBar
        appBarText="Add Funds"
        source={IconManager.back_light}
        backpress={() => navigation.pop()}
        darkMode={darkMode}
      />
      <ScrollView contentContainerStyle={{ padding: SPACING.sp10 }}>
        <View style={darkMode == 'enable' ? styles.Dcard : styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ marginEnd: SPACING.sp5 }}>
              <Image
                resizeMode="contain"
                source={darkMode == 'enable' ? IconManager.send_arrow_dark : IconManager.send_arrow_light}
                style={{ width: 25, height: 25 }}
              />
            </View>
            <View>
              <Text style={darkMode == 'enable' ? styles.Dcurrent : styles.current}>Replenish my balance</Text>
              <View></View>
            </View>
          </View>
          <SizedBox height={SPACING.lg} />
          <Text style={darkMode == 'enable' ? styles.DenterAmount : styles.enterAmount}>
            Please enter the amount you want to replenish
          </Text>
          <SizedBox height={SPACING.lg} />
          <TouchableOpacity style={darkMode == 'enable' ? styles.DtimeCard : styles.timeCard} activeOpacity={0.8}>
            <TextInput
              editable={true}
              placeholder="Amount"
              style={[
                {
                  fontSize: fontSizes.size15,
                  color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                  flex: 1,
                  fontFamily: FontFamily.PoppinRegular,
                  paddingVertical: 14,
                },
              ]}
              placeholderTextColor={darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300}
              keyboardType='numeric'
              value={amount}
              onChangeText={text => setAmount(text)} // Add this line to update the amount state
            />
          </TouchableOpacity>

          <SizedBox height={SPACING.sp20} />
          <View style={styles.textInputHolder}>
            {isLoading && <AppLoading />}
            <ActionButton
              text="Continue"
              onPress={openModalTransaction}
              disabled={!amount.trim() || parseFloat(amount) < 1}
            />
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
                    {
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
                    {/* Rest of the modal content */}
                  </View>
                  <SizedBox height={SPACING.sp10} />
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 0.9, alignItems: 'center' }}>
                      <Text
                        style={
                          darkMode == 'enable'
                            ? styles.Dcurrent
                            : styles.current
                        }>
                        Choose a payment method
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{ flex: 0.1 }}
                      onPress={closeModalTransaction}>
                      <Image
                        source={
                          darkMode == 'enable'
                            ? IconManager.close_dark
                            : IconManager.close_light
                        }
                        resizeMode="contain"
                        style={{ width: 15, height: 15 }}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={{ height: flatListHeight }}>

                    <SizedBox height={SPACING.sp10} />
                    {paymentType.map((item, index) => {
                      return (
                        <Pressable
                          key={index}
                          activeOpacity={0.9}
                          onPress={() => {
                            navigation.navigate('BankTransfer', { amount, darkMode })
                            setModalFilterVisible(false);
                          }}
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View style={{ marginEnd: SPACING.sp5 }}>
                              <Image
                                resizeMode="contain"
                                source={darkMode == 'enable' ? IconManager.bank_dark : IconManager.bank_light}
                                style={{ width: 25, height: 25 }}
                              />
                            </View>
                            <View>
                              <Text style={darkMode == 'enable' ? styles.DoutlineButtonText : styles.outlineButtonText}>
                                Bank Transfer
                              </Text>
                              <View></View>
                            </View>
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>


                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddFunds;

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
    width: '95%',
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.White,
    margin: SPACING.sp10,
    padding: SPACING.md,
    // flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  Dcard: {
    width: '95%',
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.DarkThemLight,
    margin: SPACING.sp10,
    padding: SPACING.md,
    // flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
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
  enterAmount: {
    color: COLOR.Grey500,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
  },
  DenterAmount: {
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
  },
  timeCard: {
    borderRadius: RADIUS.rd7,
    backgroundColor: COLOR.White,
    borderColor: COLOR.Grey100,
    borderWidth: 1,

    // paddingVertical: SPACING.sp5,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  DtimeCard: {
    borderRadius: RADIUS.rd7,
    backgroundColor: COLOR.DarkThemLight,
    borderColor: COLOR.Grey100,
    borderWidth: 1,

    // paddingVertical: SPACING.sp5,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  sendText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.Grey500,
    fontWeight: fontWeight.weight500,
  },
  sendSmallText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size13,
    color: COLOR.Grey500,
    fontWeight: fontWeight.weight500,
  },
  textInputHolder: {
    width: '100%',
    paddingVertical: SPACING.sp5,
  },
  descriptionContainer: {
    // alignItems: 'center',
    paddingHorizontal: SPACING.sp10,
    borderWidth: 1,
    borderRadius: RADIUS.rd10,
    height: 120,
  },
  textInput: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLOR.White100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
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
  DoutlineButtonText: {
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
  },
});
