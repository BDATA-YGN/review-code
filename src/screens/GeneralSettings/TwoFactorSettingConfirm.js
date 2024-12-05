import { SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native"
import ActionAppBar from "../../commonComponent/ActionAppBar";
import i18n from '../../i18n';
import IconManager from "../../assets/IconManager";
import { FontFamily, fontSizes } from "../../constants/FONT";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { retrieveJsonData, retrieveStringData, storeJsonData, storeKeys } from '../../helper/AsyncStorage';
import { useDispatch, useSelector } from 'react-redux';
import { setFetchDarkMode } from '../../stores/slices/DarkModeSlice';
import COLOR from "../../constants/COLOR";
import ActionButton from "../../components/Button/ActionButton";
import AppLoading from "../../commonComponent/Loading";
import { getUserInfoData, submitUpdateTwoFactor } from "../../helper/ApiModel";

const TwoFactorSettingConfrim = () => {

    const [confirmationCode , setConfirmationCode] = useState("");
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [darkMode, setDarkMode] = useState(null);
    const fetchDarkMode = useSelector((state) => state.DarkModeSlice.fetchDarkMode);
    const [isFocused, setIsFocused] = useState(false);
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
      
    }, []);
    useEffect(() => {
        if (fetchDarkMode) {
            getDarkModeTheme();
            dispatch(setFetchDarkMode(false));
        }
    }, [fetchDarkMode]);

    const fetchData = async () => {
        
        try {
          const userDataResponse = await getUserInfoData();
        //   console.log(userDataResponse,'userDataResponse');
          
          storeJsonData({
            key: storeKeys.userInfoData,
            data: userDataResponse.user_data,
          });
        
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };



    const handleVerifyCode = () => {

       
        setLoading(true);
        
        submitUpdateTwoFactor("verify" , "two_factor" , confirmationCode , null).then(value => {
            if(value.api_status === 200){
                fetchData();
                setLoading(false);
                navigation.navigate('TwoFactorAuth')
            }else{
                setLoading(false);
                console.log(value);
            }
         
         
        }).catch(error => {
            setLoading(false);
            // Handle the error
            console.log(value);
           
            
           
          });
        // navigation.navigate('TwoFactorSettingEnabled')
    }

    return(
        <SafeAreaView style = {[styles.container,,{ backgroundColor:
            darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,}]}>
            <ActionAppBar
                appBarText={i18n.t(`translation:twoFactorAuthentication`)}
                darkMode = {darkMode}
                backpress={() => { navigation.goBack() }} />

            <View style = {[styles.bodyContainer,,{ backgroundColor:
            darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White100, flex : 1}]}>
                <View>
                    <Text style = {[styles.headerText,darkMode == 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500 }]}>A confirmation message and email were sent.</Text>
                </View>
                <View>
                    <Text style = {[styles.bodyText,darkMode == 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500 }]}>We have sent a message and an email that contain the confirmation code to enable two-factor authentication.</Text>
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
                    <ActionButton text = "Verify" onPress = {handleVerifyCode}/>
                </View>
            </View>
            {isLoading && <AppLoading />}
        </SafeAreaView>
    )
}


export default TwoFactorSettingConfrim;

const styles = StyleSheet.create({
    container : {
        flex : 1
    },
    bodyContainer : {
        padding : 16,
        gap : 16
    },
    headerText : {
        fontSize : fontSizes.size15,
        fontFamily : FontFamily.PoppinBold,
    },
    bodyText : {
        fontSize : fontSizes.size15,
        fontFamily : FontFamily.PoppinRegular,
    },
    textInput: {
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        fontFamily: FontFamily.PoppinRegular,
        fontSize: 15,
        textAlignVertical: 'top',
    },
})