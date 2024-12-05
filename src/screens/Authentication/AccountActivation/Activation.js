import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import ActionAppBar from "../../../commonComponent/ActionAppBar";
import { useNavigation } from "@react-navigation/native";
import IconManager from "../../../assets/IconManager";
import { fontSizes, FontFamily } from "../../../constants/FONT";
import COLOR from "../../../constants/COLOR";
import ActionButton from '../../../components/Button/ActionButton';
import { requestResendEmailActivation, requestResendSMSActivation, submitActivateAccount } from '../../../helper/ApiModel';
import { storeJsonData,storeKeys , retrieveJsonData, retrieveStringData, } from '../../../helper/AsyncStorage';
import { useDispatch, useSelector } from 'react-redux';
import { setFetchDarkMode } from '../../../stores/slices/DarkModeSlice';

const Activation = (props) => {
    const navigation = useNavigation();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [otpCode , setOtpCode] = useState("");
    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const dispatch = useDispatch();
    
    const [darkMode, setDarkMode] = useState(null);
    const fetchDarkMode = useSelector((state) => state.DarkModeSlice.fetchDarkMode);
    // Timer-related state
    const [timer, setTimer] = useState(60); // Initial timer value set to 60 seconds
    const [canResend, setCanResend] = useState(false); // State to enable/disable the resend button
      

    useEffect(() => {
   
        // Timer countdown logic
        const interval = setInterval(() => {
          if (timer > 0) {
            setTimer(prev => prev - 1);
          } else {
            setCanResend(true); // Enable resend button when timer hits 0
            clearInterval(interval);
          }
        }, 1000);
    
        return () => clearInterval(interval); // Clear interval on component unmount
      }, [timer]);

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

    const handleChangeText = (text, index) => {
        // Update the OTP value in the state
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Move to the next input if the current input has a value
        if (text.length === 1 && index < 5) {
            inputRefs[index + 1].current.focus();
        }

        // Optionally, handle the OTP code submission here if all inputs are filled
        if (newOtp.every(value => value !== "")) {
            const otpCode = newOtp.join("");
            setOtpCode(otpCode);
            setIsButtonDisabled(false); // Enable the button
        } else {
            setIsButtonDisabled(true); // Disable the button
        }

       
    };

    useEffect(() => {
       
        if (inputRefs[0].current) {
            inputRefs[0].current.focus();
        }
    }, []);


    const handleActivateAccount = async () => {
        console.log('log', otpCode);
    
        try {
            const value = await submitActivateAccount(props.route.params.phone_no || props.route.params.email || props.route.params.email_address || props.route.params.phone, otpCode);
            console.log(value.api_status);
            
            if (value.api_status === 200 && !value.type) {
                await storeJsonData({ key: storeKeys.loginCredential, data: value });
                await storeJsonData({ key: storeKeys.userInfoData, data: value });
    
                const isOnboardingComplete = await retrieveJsonData({ key: storeKeys.isOnBoarding });
    
                setTimeout(() => {
                    navigation.navigate(isOnboardingComplete ? 'BottomTabNavigator' : 'Onboarding');
                }, 1000);
            } else {
                Alert.alert('Error', `${value.errors.error_text}`, [
                    {
                        text: 'OK',
                        onPress: () => {},
                    },
                ]);
            }
        } catch (error) {
            Alert.alert('Error', `${error}`, [
                {
                    text: 'OK',
                    onPress: () => {},
                },
            ]);
        }
    };
    


    const handleResendOtp = async () => {

        if(props.route.params.phone_no || props.route.params.phone){
            try {
            
                const data = await requestResendSMSActivation(props.route.params.phone_no || props.route.params.phone);
          

            
            
            
            // console.log('data!!!', data);
            if (data.api_status === 200) {
              console.log('success');
              setTimer(60); // Reset the timer to 60 seconds after resending
              setCanResend(false); // Disable the resend button again
            //   navigation.navigate('Activation',{ phone_no : phone_num})
              
            } else {
            //   setLoading(false);
            }
          } catch (error) {
            // setLoading(false);
        
          }
        }

        if(props.route.params.email || props.route.params.email_address){

        try {
            
           
                const data = await requestResendEmailActivation(props.route.params.email || props.route.params.email_address);
          
           
            
            // console.log('data!!!', data);
            if (data.api_status === 200) {
              console.log('success');
              setTimer(60); // Reset the timer to 60 seconds after resending
              setCanResend(false); // Disable the resend button again
            //   navigation.navigate('Activation',{ phone_no : phone_num})
              
            } else {
            //   setLoading(false);
            }
          } catch (error) {
            // setLoading(false);
        
          }
        }
    }

   

    return (
        <SafeAreaView style={{ flex: 1 , backgroundColor:
            darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,}}>
            <ActionAppBar
                source={IconManager.back_light}
                darkMode = {darkMode}
                backpress={() => navigation.goBack()}
            />
            <View style={{ padding: 16 , backgroundColor:
            darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White100, flex : 1}}>
                <View>
                                    <Text 
                    style={[
                        styles.headerText, 
                        { color: darkMode === 'enable' ? COLOR.White : COLOR.Grey500 }
                    ]}
                    >
                    {props.route.params?.register 
                        ? 'Confirm your account' 
                        : props.route.params?.phone_no 
                        ? 'Confirm your mobile' 
                        : props.route.params?.email  
                        ? 'Confirm your email' 
                        : ''
                    }
                    </Text>

                </View>
                <View>
                    <Text style={[styles.subText, darkMode == 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500 }]}>
                        Please enter the 6-digit code sent to:{props.route.params.register && ' your email and phone number.'}

                        {props.route.params?.phone_no && 
                            <Text style={[styles.phoneNumber,darkMode == 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500 }]}> {props.route.params?.phone_no}</Text>
                        }

                            {props.route.params?.email && 
                            <Text style={[styles.phoneNumber,darkMode == 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500 }]}> {props.route.params?.email}</Text>
                        }
                    </Text>
                </View>
                <View style={styles.otpContainer}>
                    {inputRefs.map((ref, index) => (
                        <TextInput
                            key={index}
                            ref={ref}
                            style={[styles.otpInput,{ color : darkMode == 'enable' ? COLOR.White : COLOR.Grey500 }]}
                            keyboardType="number-pad"
                            maxLength={1}
                            // placeholderTextColor={COLOR.White}
                            onChangeText={(text) => handleChangeText(text, index)}
                        />
                    ))}
                </View>

                <View style={{ marginTop: 32, gap: 8 }}>
                    <ActionButton text="Verify" onPress = {isButtonDisabled ? null : handleActivateAccount}
                         />
                 <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            {canResend ? (
              <View style = {{ flexDirection : 'row'}}>

                <Text style = {[styles.resendText,{color : darkMode == 'enable' ? COLOR.White : COLOR.Grey300}]}>Didn't get the code?</Text>
                <TouchableOpacity onPress={handleResendOtp} >
                <Text style={styles.resendLink}> Resend Code</Text>
                </TouchableOpacity>
            </View>
            ) : (
              <Text style={[styles.timerText,{color : darkMode == 'enable' ? COLOR.White : COLOR.Grey150}]}>{timer}</Text>
            )}
          </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    headerText: {
        fontSize: fontSizes.size23,
        fontFamily: FontFamily.PoppinSemiBold,
        // color: COLOR.Grey150,
    },
    subText: {
        fontSize: fontSizes.size15,
        fontFamily: FontFamily.PoppinRegular,
        color: COLOR.Grey300,
        marginTop: 10,
    },
    phoneNumber: {
        fontSize: fontSizes.size15,
        fontFamily: FontFamily.PoppinRegular,
        // color: COLOR.Grey500,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    otpInput: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: COLOR.Grey200,
        borderRadius: 10,
        textAlign: 'center',
        fontSize: fontSizes.size18,
        fontFamily: FontFamily.PoppinSemiBold,
        color: COLOR.Grey800,
    },
    resendText: {
        fontSize: fontSizes.size15,
        fontFamily: FontFamily.PoppinRegular,
        // color: COLOR.Grey300,
    },
    timerText : {
        fontSize: fontSizes.size23,
        fontFamily: FontFamily.PoppinSemiBold,
        // color: COLOR.Grey150,
      },
    resendLink: {
        color: COLOR.Primary,
        fontSize: fontSizes.size15,
        fontFamily: FontFamily.PoppinRegular,
        
    },
});

export default Activation;