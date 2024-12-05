import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Modal, Image, TextInput, Alert } from "react-native";
import COLOR from "../../constants/COLOR";
import ActionAppBar from "../../commonComponent/ActionAppBar";
import { useNavigation } from "@react-navigation/native";
import i18n from '../../i18n';
import { FontFamily, fontSizes } from "../../constants/FONT";
import SPACING from "../../constants/SPACING";
import { useEffect, useState } from "react";
import IconManager from "../../assets/IconManager";
import { getUserInfoData, submitTwoFactorSetting, submitUpdateTwoFactor, twoFactorON } from "../../helper/ApiModel";
import ActionButton from "../../components/Button/ActionButton";
import { retrieveJsonData, retrieveStringData, storeJsonData, storeKeys } from "../../helper/AsyncStorage";
import RADIUS from "../../constants/RADIUS";
import AppLoading from "../../commonComponent/Loading";
import { useDispatch, useSelector } from "react-redux";
import { setFetchDarkMode } from "../../stores/slices/DarkModeSlice";

const TwoFactorAuth = () => {


  const navigation = useNavigation();
  const [selectedMethod, setSelectedMethod] = useState("E-mail SMS");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isAuthySetting, setAuthySetting] = useState("");
  const [isGoogleAuthenticatorSetting, setGoogleAuthenticatorSetting] = useState("");
  const [isTwoFactorSetting, setTwoFactorSetting] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [phoneNo, setPhoneNo] = useState("");
  const [originalPhoneNo, setOriginalPhoneNo] = useState("");
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isTwoFactorOn, setTwoFactorOn] = useState("0");
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(null);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [showTwoFactorConfirm, setShowTwoFactorConfirm] = useState(false);


  const fetchDarkMode = useSelector((state) => state.DarkModeSlice.fetchDarkMode);


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

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  }
  const fetchTwoFactorSetting = () => {
    submitTwoFactorSetting().then(value => {
      setAuthySetting(value.authy_settings)
      setGoogleAuthenticatorSetting(value.google_authenticator_setting)
      setTwoFactorSetting(value.two_factor_setting)
    }).catch(error => {
      // Handle the error
      console.log(value);
    });
  }

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    setDropdownVisible(false);
  }
  const handlePhoneNoChange = (text) => {
    setPhoneNo(text);
  }

  const fetchLoginCredentialData = async () => {

    const userInfoData = await retrieveJsonData({ key: storeKeys.userInfoData });
    console.log('Retrieved onboarding status:', userInfoData);
    if (userInfoData !== null) {
      console.log(userInfoData.phone_number);
      setPhoneNo(userInfoData.phone_number)
      setOriginalPhoneNo(userInfoData.phone_number)
      setTwoFactorOn(userInfoData.two_factor)

    } else {
      Alert.alert(
        'Invalid',
        `No credential!`,
        [
          {
            text: 'Ok',
            onPress: () => { },
          },
        ],
        { cancelable: true },
      );
    }
  };



  const handleConfirmChangeNo = () => {


    setConfirmModalVisible(false);
    setLoading(true);

  submitUpdateTwoFactor("verify", "two_factor", null, phoneNo).then(value => {
    console.log(value , 'value');
    
      if (value.api_status === 200) {
        setLoading(false);
        fetchData();
        // navigation.navigate('TwoFactorSettingConfrim')
        setShowTwoFactorConfirm(true);
      } else {
        setLoading(false);
        console.log(value);
        Alert.alert('Error', `${value.errors.error_text}`, [
          {
            text: 'OK',
            onPress: () => {},
          },
        ]);
      }


    }).catch(error => {
      setLoading(false);
      // Handle the error
      console.log(value);



    });
    // navigation.navigate('TwoFactorSettingConfrim')
  }

  const handleSave = () => {
    if (phoneNo !== originalPhoneNo) {
      setConfirmModalVisible(true);
    } else {
      handleConfirmChangeNo(); // Directly submit if phone number hasn't changed
    }
  }

  const fetchData = async () => {

    try {
      const userDataResponse = await getUserInfoData();
      //   console.log(userDataResponse,'userDataResponse');
      setTwoFactorOn(userDataResponse.two_factor)
      storeJsonData({
        key: storeKeys.userInfoData,
        data: userDataResponse.user_data,
      });



    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeactivateTwoFactor = () => {

    setConfirmModalVisible(false);
    setLoading(true)
    submitUpdateTwoFactor().then(value => {
      // console.log(value);
      if (value.api_status === 200) {
        setLoading(false)
        // setTwoFactorOn("0")
        fetchData();
        console.log(value);

      } else {
        setLoading(false)
        console.log(value);
      }

    }).catch(error => {
      setLoading(false)
      console.log(error);
    })
  }

  const handleVerifyCode = () => {


    setLoading(true);

    submitUpdateTwoFactor("verify", "two_factor", confirmationCode, null).then(value => {
      if (value.api_status === 200) {
        fetchData();
        setLoading(false);
        // navigation.navigate('TwoFactorAuth')
        setShowTwoFactorConfirm(false);
      } else {
        setLoading(false);
        console.log(value);
        Alert.alert(
          'Error',
          `${value.message}`,
          [
            {
              text: 'Ok',
              onPress: () => { },
            },
          ],
          { cancelable: true },
        );
      }


    }).catch(error => {
      setLoading(false);
      // Handle the error
      Alert.alert('Error', `${error}`, [
        {
          text: 'OK',
          onPress: () => {},
        },
      ]);



    });
    // navigation.navigate('TwoFactorSettingEnabled')
  }




  useEffect(() => {
    fetchLoginCredentialData();
    fetchTwoFactorSetting();
  }, [isTwoFactorOn]);



  return (
    <SafeAreaView style={darkMode === 'enable' ? styles.safeAreaViewDark : styles.safeAreaViewLight}>
      <ActionAppBar
        appBarText={i18n.t(`translation:twoFactorAuthentication`)}
        darkMode={darkMode}
        backpress={() => { navigation.goBack() }} />

      {/* TwoFactor On */}

      {isTwoFactorOn === "0" && !showTwoFactorConfirm && (
        <View style={darkMode === 'enable' ? styles.containerDark : styles.containerLight}>
          <View style={{ gap: 4 }}>
            <View>
              <Text style={darkMode === 'enable' ? styles.labelTextDark : styles.labelTextLight}>
                Two-factor authentication method
              </Text>
            </View>

            <TouchableOpacity
              onPress={toggleDropdown}
              style={[
                styles.dropdown,
                darkMode === 'enable' ? { backgroundColor: COLOR.DarkTheme } : { backgroundColor: COLOR.White }
              ]}
            >
              <Text style={[
                styles.dropdownText,
                darkMode === 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500 }
              ]}>
                {selectedMethod}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ gap: 4 }}>
            <View>
              <Text style={darkMode === 'enable' ? styles.labelTextDark : styles.labelTextLight}>
                Phone
              </Text>
            </View>
            <View>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    borderColor: isFocused ? COLOR.Primary : (darkMode === 'enable' ? COLOR.Grey1000 : COLOR.Grey200),
                    backgroundColor: darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White,
                    color: darkMode === 'enable' ? COLOR.White : COLOR.Grey500,
                  }
                ]}
                placeholderTextColor={darkMode === 'enable' ? COLOR.White100 : COLOR.Grey300}
                value={phoneNo}
                placeholder="Enter Phone number"
                onChangeText={handlePhoneNoChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View>
            <ActionButton text="Save" onPress={handleSave} />
          </View>

          <Modal
            animationType="fade"
            transparent={true}
            visible={dropdownVisible}
            onRequestClose={toggleDropdown}
          >
            <TouchableOpacity style={styles.modalContainer} onPress={toggleDropdown}>
              <TouchableOpacity
                activeOpacity={1}
                style={[
                  styles.modalContent,
                  darkMode === 'enable' ? { backgroundColor: COLOR.DarkThemLight } : { backgroundColor: COLOR.White }
                ]}
              >
                <View style={styles.modalHeader}>
                  <Text style={[
                    styles.modalHeaderText,
                    darkMode === 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500 }
                  ]}>
                    Authentication method
                  </Text>
                  <TouchableOpacity onPress={toggleDropdown} style={styles.iconWrapper}>
                    <Image
                      source={darkMode === 'enable' ? IconManager.close_dark : IconManager.close_light}
                      style={styles.closeIcon}
                      resizeMode='contain'
                    />
                  </TouchableOpacity>
                </View>
                <View style={[
                  styles.modalHeaderBottomBorder,
                  darkMode === 'enable' ? { borderBottomColor: COLOR.White } : { borderBottomColor: COLOR.Grey100 }
                ]} />
                <View style={{ padding: 16, rowGap: 16 }}>
                  {isTwoFactorSetting !== "0" && (
                    <TouchableOpacity onPress={() => handleSelectMethod("E-mail SMS")}>
                      <View style={styles.itemContent}>
                        <Text style={[
                          styles.itemContentText,
                          darkMode === 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500 }
                        ]}>
                          E-mail SMS
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  {isGoogleAuthenticatorSetting !== "0" && (
                    <TouchableOpacity onPress={() => handleSelectMethod("Google Authenticator")}>
                      <View style={styles.itemContent}>
                        <Text style={[
                          styles.itemContentText,
                          darkMode === 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500 }
                        ]}>
                          Google Authenticator
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  {isAuthySetting !== "0" && (
                    <TouchableOpacity onPress={() => handleSelectMethod("Authy")}>
                      <View style={styles.itemContent}>
                        <Text style={[
                          styles.itemContentText,
                          darkMode === 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500 }
                        ]}>
                          Authy
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>

          <Modal
            animationType="fade"
            transparent={true}
            visible={isConfirmModalVisible}
            onRequestClose={() => setConfirmModalVisible(false)}
          >
            <TouchableOpacity style={styles.modalContainer} onPress={() => setConfirmModalVisible(false)}>
              <TouchableOpacity
                activeOpacity={1}
                style={[
                  styles.modalContent,
                  darkMode === 'enable' ? { backgroundColor: COLOR.DarkThemLight } : { backgroundColor: COLOR.White }
                ]}
              >
                <View style={styles.modalHeader}>
                  <Text style={[
                    styles.modalHeaderText,
                    darkMode === 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500 }
                  ]}>
                    Change Phone No. ?
                  </Text>
                </View>
                <View style={[
                  styles.modalHeaderBottomBorder,
                  darkMode === 'enable' ? { borderBottomColor: COLOR.White } : { borderBottomColor: COLOR.Grey100 }
                ]} />
                <View style={{ padding: 16, rowGap: 16 }}>
                  <Text style={[
                    styles.itemContentText,
                    darkMode === 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500 }
                  ]}>
                    Are you sure you want to change your phone number?
                  </Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.cancelButtonStyle}
                      onPress={() => setConfirmModalVisible(false)}
                    >
                      <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <ActionButton
                      text="Confirm"
                      myStyle={{ width: '50%' }}
                      onPress={handleConfirmChangeNo}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        </View>
      )}



      {isTwoFactorOn === "1" && !showTwoFactorConfirm && (

        <View style={[styles.bodyContainer, , {
          backgroundColor:
            darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White100, flex: 1
        }]}>
          {/* <View>
                <Text style = {styles.headerText}>A confirmation message and email were sent.</Text>
            </View> */}
          <View>
            <Text style={[styles.headerText, darkMode == 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500 }]}>Two-factor authentication is currently enabled using Email SMS.</Text>
          </View>
          <View>
            <TextInput
              style={[
                styles.textInput,
                {
                  borderColor: (isFocused ? COLOR.Primary : (darkMode == 'enable' ? COLOR.Grey1000 : COLOR.Grey200)),
                  backgroundColor: darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White,
                  color: darkMode == 'enable' ? COLOR.White : COLOR.Grey500,

                }
              ]}
              placeholderTextColor={
                darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
              }
              value={phoneNo}
              placeholder="Phone Number"
              onChangeText={(no) => setPhoneNo(no)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              keyboardType="number-pad"
            />
          </View>
          <View>
            <ActionButton text="Deactivate" onPress={() => setConfirmModalVisible(true)} />
          </View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={isConfirmModalVisible}
            onRequestClose={() => setConfirmModalVisible(false)}>
            <TouchableOpacity style={styles.modalContainer} onPress={() => setConfirmModalVisible(false)}>
              <TouchableOpacity activeOpacity={1} style={[styles.modalContent, darkMode == 'enable' ? { backgroundColor: COLOR.DarkThemLight } : { backgroundColor: COLOR.White }]}>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalHeaderText, darkMode == 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500, }]}>Deactivate ?</Text>
                  {/* <TouchableOpacity onPress={() => setConfirmModalVisible(false)}style={styles.iconWrapper}>
                            <Image source={darkMode == 'enable' ? IconManager.close_dark : IconManager.close_light} style={styles.closeIcon} resizeMode='contain' />
                        </TouchableOpacity> */}
                </View>
                <View style={[styles.modalHeaderBottomBorder, darkMode == 'enable' ? { borderBottomColor: COLOR.White } : { borderBottomColor: COLOR.Grey100 }]} />
                <View style={{ padding: 16, rowGap: 16 }}>
                  <Text style={[styles.itemContentText, darkMode == 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500 }]}>Are you sure you want to deactivate two factor?</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                    <TouchableOpacity activeOpacity={0.85} style={styles.cancelButtonStyle} onPress={() => setConfirmModalVisible(false)}>
                      <Text style={styles.cancelText} >Cancel</Text>
                    </TouchableOpacity>
                    <ActionButton text="Confirm" myStyle={{ width: '50%' }} onPress={handleDeactivateTwoFactor} />
                  </View>
                </View>

              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
        </View>




      )}


      {showTwoFactorConfirm &&

        <View style={[styles.bodyContainer, , {
          backgroundColor:
            darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White100, flex: 1
        }]}>
          <View>
            <Text style={[styles.headerText, darkMode == 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500 }]}>A confirmation message and email were sent.</Text>
          </View>
          <View>
            <Text style={[styles.bodyText, darkMode == 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500 }]}>We have sent a message and an email that contain the confirmation code to enable two-factor authentication.</Text>
          </View>
          <View>
            <TextInput
              style={[
                styles.textInput,
                {
                  borderColor: (isFocused ? COLOR.Primary : (darkMode == 'enable' ? COLOR.Grey1000 : COLOR.Grey200)),
                  backgroundColor: darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White,
                  color: darkMode == 'enable' ? COLOR.White : COLOR.Grey500,

                }
              ]}
              placeholderTextColor={
                darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
              }
              value={confirmationCode}
              placeholder="Confirmation code"
              onChangeText={(code) => setConfirmationCode(code)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              keyboardType="number-pad"
            />
          </View>
          <View>
            <ActionButton text="Verify" onPress={handleVerifyCode} />
          </View>
        </View>
      }


      {/* TwoFactor On */}

      {/* TwoFactor Confirmation */}

      {/* TwoFactor Confirmation */}

      {/* TwoFactor off */}

      {/* TwoFactor off */}



      {isLoading && <AppLoading />}

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeAreaViewLight: {
    flex: 1,
    backgroundColor: COLOR.White100,
  },
  safeAreaViewDark: {
    flex: 1,
    backgroundColor: COLOR.DarkThemLight,
  },
  labelTextLight: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: 19,
    color: COLOR.Grey500,
  },
  labelTextDark: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: 19,
    color: COLOR.White100,
  },
  containerLight: {
    padding: 16,
    gap: 16,
    backgroundColor: COLOR.White100,
    flex: 1,
  },
  containerDark: {
    padding: 16,
    gap: 16,
    backgroundColor: COLOR.DarkTheme,
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderRadius: 15,
    width: '82.31%',
  },
  modalContentText: {
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Grey500
  },
  modalHeader: {
    padding: SPACING.lg,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalHeaderBottomBorder: {
    borderBottomWidth: 1,
  },
  modalHeaderText: {
    fontSize: fontSizes.size19,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  itemContentText: {
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
  },
  dropdown: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    height: 40,
    borderColor: COLOR.Grey200
  },
  dropdownText: {
    fontSize: 15,
    fontFamily: FontFamily.PoppinRegular,
  },
  iconWrapper: {
    padding: SPACING.xs,
  },
  closeIcon: {
    width: 16,
    height: 16,
  },
  textInput: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  cancelButtonStyle: {
    // backgroundColor: COLOR.Primary,
    width: '50%',
    borderColor: COLOR.Primary,
    borderWidth: 1,
    padding: SPACING.xxs,
    borderRadius: RADIUS.xxs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontFamily: FontFamily.PoppinSemiBold,
    color: COLOR.Primary,
    fontSize: fontSizes.size19
  },
  bodyContainer: {
    padding: 16,
    gap: 16
  },
  headerText: {
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinBold,
  },
  bodyText: {
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
  },
});

export default TwoFactorAuth;