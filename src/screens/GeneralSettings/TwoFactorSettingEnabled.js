// import { Alert, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
// import ActionAppBar from "../../commonComponent/ActionAppBar";
// import i18n from '../../i18n';
// import IconManager from "../../assets/IconManager";
// import { FontFamily, fontSizes } from "../../constants/FONT";
// import { useEffect, useState } from "react";
// import { useNavigation } from "@react-navigation/native";
// import { retrieveJsonData, retrieveStringData, storeKeys } from '../../helper/AsyncStorage';
// import { useDispatch, useSelector } from 'react-redux';
// import { setFetchDarkMode } from '../../stores/slices/DarkModeSlice';
// import COLOR from "../../constants/COLOR";
// import ActionButton from "../../components/Button/ActionButton";
// import SPACING from "../../constants/SPACING";
// import RADIUS from "../../constants/RADIUS";
// import { submitUpdateTwoFactor } from "../../helper/ApiModel";
// import AppLoading from "../../commonComponent/Loading";

// const TwoFactorSettingEnabled = () => {

//     const [phoneNo , setPhoneNo] = useState("");
//     const navigation = useNavigation();
//     const dispatch = useDispatch();
//     const [darkMode, setDarkMode] = useState(null);
//     const fetchDarkMode = useSelector((state) => state.DarkModeSlice.fetchDarkMode);
//     const [isFocused, setIsFocused] = useState(false);
//     const [isConfirmModalVisible , setConfirmModalVisible] = useState(false);
//     const [isLoading , setLoading] = useState(false);



//     const getDarkModeTheme = async () => {
//         try {
//             const darkModeValue = await retrieveStringData({
//                 key: storeKeys.darkTheme,
//             });
//             if (darkModeValue !== null || undefined) {
//                 setDarkMode(darkModeValue);
//             }
//         } catch (error) {
//             console.error('Error retrieving dark mode theme:', error);
//         }
//     };

//     useEffect(() => {
//         getDarkModeTheme();
//         fetchLoginCredentialData();
      
//     }, []);
//     useEffect(() => {
//         if (fetchDarkMode) {
//             getDarkModeTheme();
//             dispatch(setFetchDarkMode(false));
//         }
//     }, [fetchDarkMode]);

//     const fetchLoginCredentialData = async () => {
        
//         const userInfoData = await retrieveJsonData({key: storeKeys.userInfoData});
//         // console.log('Retrieved onboarding status:', userInfoData);
//         if (userInfoData !== null) {
//             console.log(userInfoData.phone_number);
//             setPhoneNo(userInfoData.phone_number);
//         } else {
//           Alert.alert(
//             'Invalid',
//             `No credential!`,
//             [
//               {
//                 text: 'Ok',
//                 onPress: () => {},
//               },
//             ],
//             {cancelable: true},
//           );
//         }
//       };

//       const handleDeactivateTwoFactor = () => {

//             setConfirmModalVisible(false);
//             setLoading(true)
//             submitUpdateTwoFactor().then(value => {
//                 // console.log(value);
//                 if(value.api_status === 200){
//                     setLoading(false)
//                     navigation.navigate('TwoFactorAuth')
//                     console.log(value);
                    
//                 }else{
//                     setLoading(false)
//                     console.log(value);
//                 }
                
//             }).catch(error => {
//                 setLoading(false)
//                 console.log(error);
//             })
//       }




//     return(
//         <SafeAreaView style = {[styles.container,,{ backgroundColor:
//             darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,}]}>
//             <ActionAppBar
//                 appBarText={i18n.t(`translation:twoFactorAuthentication`)}
//                 darkMode = {darkMode}
//                 backpress={() => { navigation.goBack() }} />

//             <View style = {[styles.bodyContainer,,{ backgroundColor:
//             darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White100, flex : 1}]}>
//                 {/* <View>
//                     <Text style = {styles.headerText}>A confirmation message and email were sent.</Text>
//                 </View> */}
//                 <View>
//                     <Text style = {[styles.headerText,darkMode == 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500 }]}>Two-factor authentication is currently enabled using Email SMS.</Text>
//                 </View>
//                 <View>
//                     <TextInput
//                         style={[
//                             styles.textInput,
//                             {
//                                 borderColor: (isFocused ? COLOR.Primary : (darkMode == 'enable' ? COLOR.Grey1000 : COLOR.Grey200)),
//                                 backgroundColor: darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White,
//                                 color: darkMode == 'enable' ? COLOR.White : COLOR.Grey500,

//                             }
//                         ]}
//                         placeholderTextColor={
//                             darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
//                         }
//                         value={phoneNo}
//                         placeholder="Phone Number"
//                         onChangeText={(no) => setPhoneNo(no)}
//                         onFocus={() => setIsFocused(true)}
//                         onBlur={() => setIsFocused(false)}
//                         keyboardType="number-pad"
//                     />
//                 </View>
//                 <View>
//                     <ActionButton text = "Deactivate" onPress = {() => setConfirmModalVisible(true)}/>
//                 </View>
//             </View>



//             <Modal
//                 animationType="fade"
//                 transparent={true}
//                 visible={isConfirmModalVisible}
//                 onRequestClose={() => setConfirmModalVisible(false)}>
//                 <TouchableOpacity style={styles.modalContainer} onPress={() => setConfirmModalVisible(false)}>
//                     <TouchableOpacity activeOpacity={1} style={[styles.modalContent, darkMode == 'enable' ? { backgroundColor: COLOR.DarkThemLight } : { backgroundColor: COLOR.White }]}>
//                         <View style={styles.modalHeader}>
//                             <Text style={[styles.modalHeaderText, darkMode == 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500, }]}>Deactivate ?</Text>
//                             {/* <TouchableOpacity onPress={() => setConfirmModalVisible(false)}style={styles.iconWrapper}>
//                                 <Image source={darkMode == 'enable' ? IconManager.close_dark : IconManager.close_light} style={styles.closeIcon} resizeMode='contain' />
//                             </TouchableOpacity> */}
//                         </View>
//                         <View style={[styles.modalHeaderBottomBorder, darkMode == 'enable' ? { borderBottomColor: COLOR.White } : { borderBottomColor: COLOR.Grey100 }]} />
//                         <View style={{ padding: 16, rowGap: 16 }}>
//                             <Text style={[styles.itemContentText, darkMode == 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500 }]}>Are you sure you want to deactivate two factor?</Text>
//                             <View style = {{flexDirection : 'row', justifyContent : 'space-between' , gap : 10}}>
//                                 <TouchableOpacity  activeOpacity={0.85} style={styles.cancelButtonStyle} onPress={() => setConfirmModalVisible(false)}>
//                                     <Text style={styles.cancelText} >Cancel</Text>
//                                 </TouchableOpacity>
//                                 <ActionButton text = "Confirm" myStyle = {{width : '50%'}} onPress ={handleDeactivateTwoFactor}/>
//                             </View>
//                         </View>
                        
//                     </TouchableOpacity>
//                 </TouchableOpacity>
//             </Modal>
//             {isLoading && <AppLoading/>}
//         </SafeAreaView>
//     )
// }



// export default TwoFactorSettingEnabled;

// const styles = StyleSheet.create({
//     container : {
//         flex : 1
//     },
//     bodyContainer : {
//         padding : 16,
//         gap : 16
//     },
//     headerText : {
//         fontSize : fontSizes.size15,
//         fontFamily : FontFamily.PoppinBold,
//     },
//     bodyText : {
//         fontSize : fontSizes.size15,
//         fontFamily : FontFamily.PoppinRegular,
//     },
//     textInput: {
//         padding: 10,
//         borderRadius: 8,
//         borderWidth: 1,
//         fontFamily: FontFamily.PoppinRegular,
//         fontSize: 15,
//         textAlignVertical: 'top',
//     },
//     modalContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     },
//     modalContent: {
//         borderRadius: 15,
//         width: '82.31%',
//     },
//     modalContentText: {
//         fontSize: fontSizes.size15,
//         fontFamily: FontFamily.PoppinRegular,
//         color: COLOR.Grey500
//     },
//     modalHeader: {
//         padding: SPACING.lg,
//         justifyContent: 'space-between',
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     modalHeaderBottomBorder: {
//         borderBottomWidth: 1,
//     },
//     modalHeaderText: {
//         fontSize: fontSizes.size19,
//         fontFamily: FontFamily.PoppinSemiBold,
//     },cancelButtonStyle: { 
//         // backgroundColor: COLOR.Primary,
//         width : '50%', 
//         borderColor : COLOR.Primary,
//         borderWidth : 1,
//         padding: SPACING.xxs, 
//         borderRadius: RADIUS.xxs,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     cancelText: {
//         fontFamily: FontFamily.PoppinSemiBold,
//         color: COLOR.Primary,
//         fontSize: fontSizes.size19
//     },
//     itemContentText: {
//         fontSize: fontSizes.size15,
//         fontFamily: FontFamily.PoppinRegular,
//     },

// })