import { Image, SafeAreaView, StyleSheet, View , Text, TouchableOpacity} from "react-native";
import IconManager from "../../../assets/IconManager";
import ActionAppBar from "../../../commonComponent/ActionAppBar";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, fontSizes } from "../../../constants/FONT";
import COLOR from "../../../constants/COLOR";
import { useDispatch, useSelector } from "react-redux";
import { retrieveStringData, storeKeys } from "../../../helper/AsyncStorage";
import { setFetchDarkMode } from "../../../stores/slices/DarkModeSlice";
import { useEffect, useState } from "react";


const ActivationOptions = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [darkMode, setDarkMode] = useState(null);
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

    // 09427691659
    return(
        <SafeAreaView style={{ flex: 1 , backgroundColor:
            darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,}}>
           <ActionAppBar
                source={IconManager.back_light}
                darkMode = {darkMode}
                backpress={() => navigation.goBack()}
            />
           <View style={{ flex: 1 , backgroundColor:
            darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White100,}}>
           <View style = {{flexDirection : 'row', justifyContent : 'center', alignItems : 'center', paddingTop : '10%' , paddingBottom : '5%'}}>
                <Image
                resizeMode="contain"
                source={
                    IconManager.need_activation_light
                }
                style={styles.imageHeader}
                />
            </View>
            <View style = {{marginBottom : 64}}>
                <Text style = {{fontSize : fontSizes.size29 , fontFamily: FontFamily.PoppinBold, color :   darkMode === 'enable' ? COLOR.White : COLOR.Grey500, textAlign : 'center'}}>Oops!</Text>
                <Text style ={{fontSize : fontSizes.size15 , fontFamily: FontFamily.PoppinRegular, color : darkMode === 'enable' ? COLOR.White : COLOR.Grey500 , textAlign : 'center', marginTop : 8}}>Your account is not activated yet.</Text>
            </View>
            <View style = {[styles.curvedView,{
            backgroundColor:
              darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.Blue50,
          },]}>
                <View style = {{paddingVertical : 32}}>
                    <Text style = {{fontSize : fontSizes.size15 , fontFamily: FontFamily.PoppinSemiBold, color : COLOR.Grey500, textAlign : 'center'}}>Activate your account with</Text>
                </View>

                <View style = {{flexDirection : 'column' , alignItems : 'center', gap : 16}}>
                    <TouchableOpacity style = {styles.optionButton} onPress={() => navigation.navigate('ActivationWithSMS')}>
                            <View style = {{flexDirection : 'row', gap : 10, alignItems : 'center'}}>
                                <Image resizeMode="contain"
                                source={
                                    IconManager.message_white
                                }
                                style = {{width : 24 , height : 24}}
                                />
                                <Text style = {styles.optionText}>SMS</Text>
                            </View>
                            <Image resizeMode="contain"
                            source={
                                IconManager.next_dark
                            }
                            style = {{width : 12 , height : 12}}
                            />
                    </TouchableOpacity>

                    <TouchableOpacity style = {styles.optionButton} onPress={() => navigation.navigate('ActivationWithEmail')}>
                            <View style = {{flexDirection : 'row', gap : 10, alignItems : 'center'}}>
                                <Image resizeMode="contain"
                                source={
                                    IconManager.email_white                              }
                                style = {{width : 24 , height : 24}}
                                />
                                <Text style = {styles.optionText}>Email Address</Text>
                            </View>
                            <Image resizeMode="contain"
                            source={
                                IconManager.next_dark
                            }
                            style = {{width : 12 , height : 12}}
                            />
                    </TouchableOpacity>
                </View>
            </View>
           </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    imageHeader : {
        width : 200,
        height : 200,
    },
    curvedView: {
        flex: 1,
        // backgroundColor: COLOR.Blue50,
       
    },
    optionButton : {
        flexDirection : 'row' , 
        backgroundColor : COLOR.Primary , 
        justifyContent : 'space-between' , 
        width : '90%',
        padding : 16 ,
        borderRadius : 360 ,
        alignItems : 'center'
    },
    optionText : {
        fontFamily : FontFamily.PoppinSemiBold ,
         fontSize : fontSizes.size19,
          color : COLOR.White
    }
    
})

export default ActivationOptions;