import {
    Alert,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import COLOR from '../../constants/COLOR';

import IconManager from '../../assets/IconManager';

import { useNavigation } from '@react-navigation/native';
import ActionAppBar from '../../commonComponent/ActionAppBar';

import i18n from '../../i18n';
import { retrieveJsonData, retrieveStringData, storeKeys } from '../../helper/AsyncStorage';
import { useDispatch, useSelector } from 'react-redux';
import { setFetchDarkMode } from '../../stores/slices/DarkModeSlice';
import { FontFamily, fontSizes } from '../../constants/FONT';
import ActionButton from '../../components/Button/ActionButton';
import SPACING from '../../constants/SPACING';
import RADIUS from '../../constants/RADIUS';
import { submitTwoFactorSetting, submitUpdateTwoFactor } from '../../helper/ApiModel';
import AppLoading from '../../commonComponent/Loading';

const TwoFactorAuth = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [darkMode, setDarkMode] = useState(null);
    const fetchDarkMode = useSelector((state) => state.DarkModeSlice.fetchDarkMode);
    const [isFocused, setIsFocused] = useState(false);
    const [phoneNo, setPhoneNo] = useState("");
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState("E-mail SMS");
    const [isConfirmModalVisible , setConfirmModalVisible] = useState(false);
    const [isAuthySetting,setAuthySetting] = useState("");
    const [isGoogleAuthenticatorSetting,setGoogleAuthenticatorSetting] = useState("");
    const [isTwoFactorSetting,setTwoFactorSetting] = useState("");
    const [isLoading , setLoading] = useState(false);

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
        fetchLoginCredentialData();
        fetchTwoFactorSetting();
    }, []);
    useEffect(() => {
        if (fetchDarkMode) {
            getDarkModeTheme();
            dispatch(setFetchDarkMode(false));
        }
    }, [fetchDarkMode]);

    const handlePhoneNoChange = (text) => {
        setPhoneNo(text);
    }

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    }

    const handleSelectMethod = (method) => {
        setSelectedMethod(method);
        setDropdownVisible(false);
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

    const fetchLoginCredentialData = async () => {
        
        const userInfoData = await retrieveJsonData({key: storeKeys.userInfoData});
        // console.log('Retrieved onboarding status:', userInfoData);
        if (userInfoData !== null) {
            console.log(userInfoData.phone_number);
            setPhoneNo(userInfoData.phone_number)
      
        } else {
          Alert.alert(
            'Invalid',
            `No credential!`,
            [
              {
                text: 'Ok',
                onPress: () => {},
              },
            ],
            {cancelable: true},
          );
        }
      };


    const handleConfirmChangeNo = () => {

       
        setConfirmModalVisible(false);
        setLoading(true);
        submitUpdateTwoFactor("verify" , "two_factor" , null , phoneNo).then(value => {
            if(value.api_status === 200){
                setLoading(false);
                navigation.navigate('TwoFactorSettingConfrim')
            }else{
                setLoading(false);
                console.log(value);
            }
         
         
        }).catch(error => {
            setLoading(false);
            // Handle the error
            console.log(value);
           
            
           
          });
        // navigation.navigate('TwoFactorSettingConfrim')
    }

    return (
        <SafeAreaView style={[styles.safeAreaView,{ backgroundColor:
            darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,}]}>
            <ActionAppBar
                appBarText={i18n.t(`translation:twoFactorAuthentication`)}
                darkMode = {darkMode}
                backpress={() => { navigation.goBack() }} />

            <View style={{ padding: 16, gap: 16 , backgroundColor:
            darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White100, flex : 1}}>
                <View style={{ gap: 4 }}>
                    <View>
                        <Text style={[styles.labelText, darkMode == 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500 }]}>Two-factor authentication method</Text>
                    </View>
                    <TouchableOpacity onPress={toggleDropdown} style={[styles.dropdown, darkMode == 'enable' ? { backgroundColor: COLOR.DarkTheme } : { backgroundColor: COLOR.White }]}>
                        <Text style={[styles.dropdownText, darkMode == 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500 }]}>
                            {selectedMethod}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ gap: 4 }}>
                    <View>
                        <Text style={[styles.labelText, darkMode == 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500 }]}>Phone</Text>
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
                            placeholder="Enter Phone number"
                            onChangeText={handlePhoneNoChange}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            keyboardType="number-pad"
                        />
                    </View>
                </View>
                <View>
                    <ActionButton text="Save" onPress = {() => setConfirmModalVisible(true)}/>
                </View>
            </View>



            <Modal
                animationType="fade"
                transparent={true}
                visible={dropdownVisible}
                onRequestClose={toggleDropdown}>
                <TouchableOpacity style={styles.modalContainer} onPress={toggleDropdown}>
                    <TouchableOpacity activeOpacity={1} style={[styles.modalContent, darkMode == 'enable' ? { backgroundColor: COLOR.DarkThemLight } : { backgroundColor: COLOR.White }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalHeaderText, darkMode == 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500, }]}>Authentication method</Text>
                            <TouchableOpacity onPress={toggleDropdown} style={styles.iconWrapper}>
                                <Image source={darkMode == 'enable' ? IconManager.close_dark : IconManager.close_light} style={styles.closeIcon} resizeMode='contain' />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.modalHeaderBottomBorder, darkMode == 'enable' ? { borderBottomColor: COLOR.White } : { borderBottomColor: COLOR.Grey100 }]} />
                        <View style={{ padding: 16, rowGap: 16 }}>
                            {isTwoFactorSetting != "0" && 
                            <TouchableOpacity
                                onPress={() => handleSelectMethod("E-mail SMS")}
                            >
                                <View style={styles.itemContent}>
                                    <Text style={[styles.itemContentText, darkMode == 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500 }]}>E-mail SMS</Text>
                                </View>
                            </TouchableOpacity>
                            }
                             {isGoogleAuthenticatorSetting != "0" && 
                            <TouchableOpacity
                                onPress={() => handleSelectMethod("Google Authenticator")}
                            >
                                <View style={styles.itemContent}>
                                    <Text style={[styles.itemContentText, darkMode == 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500 }]}>Google Authenticator</Text>
                                </View>
                            </TouchableOpacity>
                                }
                                {isAuthySetting != "0" && 
                            <TouchableOpacity
                                onPress={() => handleSelectMethod("Authy")}
                            >
                                <View style={styles.itemContent}>
                                    <Text style={[styles.itemContentText, darkMode == 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500 }]}>Authy</Text>
                                </View>
                            </TouchableOpacity>
                            }
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>


            {/* confirm modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isConfirmModalVisible}
                onRequestClose={() => setConfirmModalVisible(false)}>
                <TouchableOpacity style={styles.modalContainer} onPress={() => setConfirmModalVisible(false)}>
                    <TouchableOpacity activeOpacity={1} style={[styles.modalContent, darkMode == 'enable' ? { backgroundColor: COLOR.DarkThemLight } : { backgroundColor: COLOR.White }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalHeaderText, darkMode == 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500, }]}>Change Phone No. ?</Text>
                            {/* <TouchableOpacity onPress={() => setConfirmModalVisible(false)}style={styles.iconWrapper}>
                                <Image source={darkMode == 'enable' ? IconManager.close_dark : IconManager.close_light} style={styles.closeIcon} resizeMode='contain' />
                            </TouchableOpacity> */}
                        </View>
                        <View style={[styles.modalHeaderBottomBorder, darkMode == 'enable' ? { borderBottomColor: COLOR.White } : { borderBottomColor: COLOR.Grey100 }]} />
                        <View style={{ padding: 16, rowGap: 16 }}>
                            <Text style = {[styles.itemContentText, darkMode == 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500, }]}>Are you sure you want to change your phone number?</Text>
                            <View style = {{flexDirection : 'row', justifyContent : 'space-between' , gap : 10}}>
                                <TouchableOpacity  activeOpacity={0.85} style={styles.cancelButtonStyle} onPress={() => setConfirmModalVisible(false)}>
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </TouchableOpacity>
                                <ActionButton text = "Confirm" myStyle = {{width : '50%'}} onPress ={handleConfirmChangeNo}/>
                            </View>
                        </View>
                        
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
            {isLoading && <AppLoading />}
        </SafeAreaView>
    );
};

export default TwoFactorAuth;

const styles = StyleSheet.create({
    safeAreaView: {
        backgroundColor: COLOR.White100,
        flex: 1,
    },
    labelText: {
        fontFamily: FontFamily.PoppinSemiBold,
        fontSize: 19
    },
    textInput: {
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        fontFamily: FontFamily.PoppinRegular,
        fontSize: 15,
        textAlignVertical: 'top',
    },
    dropdown: {
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        justifyContent: 'center',
        height: 40,
        borderColor : COLOR.Grey200
    },
    dropdownText: {
        fontSize: 15,
        fontFamily: FontFamily.PoppinRegular,
    },
    // modalOverlay: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     backgroundColor: 'rgba(0,0,0,0.5)',
    // },
    // modalContainer: {
    //     width: '80%',
    //     padding: 20,
    //     borderRadius: 10,
    //     alignItems: 'center',
    // },
    // modalText: {
    //     fontSize: 18,
    //     padding: 10,
    //     fontFamily: FontFamily.PoppinRegular,
    // }
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
    iconWrapper: {
        padding: SPACING.xs,
    },
    closeIcon: {
        width: 16,
        height: 16,
    },
    icon: {
        width: 24,
        height: 24,
    },
    itemContent: {
        flexDirection: 'row',
        columnGap: 10,
        alignItems: 'center'
    },
    itemContentText: {
        fontSize: fontSizes.size15,
        fontFamily: FontFamily.PoppinRegular,
    },
    cancelButtonStyle: { 
        // backgroundColor: COLOR.Primary,
        width : '50%', 
        borderColor : COLOR.Primary,
        borderWidth : 1,
        padding: SPACING.xxs, 
        borderRadius: RADIUS.xxs,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelText: {
        fontFamily: FontFamily.PoppinSemiBold,
        color: COLOR.Primary,
        fontSize: fontSizes.size19
    }
});


