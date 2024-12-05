import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import ActionAppBar from "../../../commonComponent/ActionAppBar";
import { useNavigation } from "@react-navigation/native";
import IconManager from "../../../assets/IconManager";
import COLOR from "../../../constants/COLOR";
import PIXEL from "../../../constants/PIXEL";
import { FontFamily, fontSizes } from "../../../constants/FONT";
import { ColorProperties } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import ToggleSwitch from "../../../components/ToggleSwitch";
import { useEffect, useState } from "react";
import { retrieveStringData,storeKeys } from "../../../helper/AsyncStorage";
import { setFetchDarkMode } from "../../../stores/slices/DarkModeSlice";
import { useSelector } from "react-redux";
import SettingPrivacyModal from "../../../components/Setting/Modal/SettingPrivacyModal";
import { retrieveJsonData } from "../../../helper/AsyncStorage";
import { postPrivary, privacySettingType, who_can_follow_me, who_can_message_me, who_can_post_on_my_timeline, who_can_see_my_birthday, who_can_see_my_friends } from "../../../constants/CONSTANT_ARRAY";

const Privacy = () => {
    const navigation = useNavigation();
    const [darkMode, setDarkMode] = useState(null);
    const [isConfirmRequestOn, setIsConfirmRequestOn] = useState(false);
    const [isShowActivitiesOn, setIsShowActivitiesOn] = useState(false);
    const [isShowOnlineUsersOn, setIsShowOnlineUsersOn] = useState(false);
    const [isShareLocationOn, setIsShareLocationOn] = useState(false);
    const [isSettingPrivacyModalVisible , setSettingPrivacyModalVisible]  = useState(false);
    const [modalTitle , setModalTitle]  = useState("");
    const [modalId , setModalId]  = useState();
    const fetchDarkMode = useSelector((state) => state.DarkModeSlice.fetchDarkMode)

    const [privacyTypeData , setPrivacyTypeData] = useState([]);
    // const [privacyTypeTitle , setPrivacyTypeTitle] = useState("Everyone");
    const [whoCanFollowMe , setWhoCanFollowMe] = useState(0);
    const [whoCanMessageMe , setWhoCanMessageMe] = useState(0);
    const [whoCanSeeMyFri , setWhoCanSeeMyFri] = useState(0);
    const [whoCanPostOnMyTimeline , setWhoCanPostOnMyTimeline] = useState(0);
    const [whoCanSeeMyBirthday , setWhoCanSeeMyBirthday] = useState(0);

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
        fetchLoginCredentialData();
    }, []);
    
      useEffect(() => {
        getDarkModeTheme();
      }, []);
      useEffect(() => {
        if (fetchDarkMode) {
          getDarkModeTheme();
          dispatch(setFetchDarkMode(false));
        }
      }, [fetchDarkMode]);
    
    const handleSettingPrivacyModal = ({id , title}) => {
    
       if(id == 1){
        setPrivacyTypeData(who_can_follow_me)
       }
       if(id == 2){
        setPrivacyTypeData(who_can_message_me)
       }

       if(id == 3){
        setPrivacyTypeData(who_can_see_my_friends)
       }

       if(id == 4) {
         setPrivacyTypeData(who_can_post_on_my_timeline)
       }
       if(id == 5) {
        setPrivacyTypeData(who_can_see_my_birthday)
      }
      
       
        setModalTitle(title)
        setModalId(id)
        setSettingPrivacyModalVisible(true)
    }

    const handleSelectSettingPrivacy = (item) => {
        // if(modalId == 1){
        //     setWhoCanFollowMe(item.label)
        // }
        // if(modalId == 2){
        //     setWhoCanMessageMe(item.label)
        // }
        // if(modalId == 3){
        //     setWhoCanSeeMyFri(item.label)
        // }

        // if(modalId == 4){
        //     setWhoCanPostOnMyTimeline(item.label)
        // }

        // if(modalId == 5){
        //     setWhoCanSeeMyBirthday(item.label)
        // }
        setSettingPrivacyModalVisible(false)
    }

    const fetchLoginCredentialData = async () => {
        const userInfoData = await retrieveJsonData({ key: storeKeys.userInfoData });
        if (userInfoData !== null) {
            setWhoCanFollowMe(userInfoData.follow_privacy)
            // setFirstName(userInfoData.first_name);
            // setLastName(userInfoData.last_name);
            // setAvatar(userInfoData.avatar);
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

   return(
    <SafeAreaView style={[styles.container,darkMode == 'enable' ? {backgroundColor: COLOR.DarkThemLight} :  {backgroundColor: COLOR.White}]}>
    <ActionAppBar
    appBarText="Privacy"
    // source={darkMode ? IconManager.back_dark : IconManager.back_light}
    backpress={() => navigation.pop()}
    darkMode = {darkMode}
    />
    <View style = {{backgroundColor : COLOR.White}}>

        <Pressable style = {[styles.contentContainer,darkMode == 'enable' ? {backgroundColor: COLOR.DarkTheme} :  {backgroundColor: COLOR.White}]} onPress={() => handleSettingPrivacyModal({id : 1 , title : 'Who can follow me?'})}>
            <Text style ={[styles.fontStyle, darkMode == 'enable' ? {color : COLOR.White} : {color : COLOR.Grey500}]}>Who can follow me?</Text>
            <Text style ={{fontFamily : FontFamily.PoppinRegular , fontSize : fontSizes.size15 , color : COLOR.Grey100}}>{who_can_follow_me[whoCanFollowMe].label}</Text>
        </Pressable>
         <Pressable style = {[styles.contentContainer,darkMode == 'enable' ? {backgroundColor: COLOR.DarkTheme} :  {backgroundColor: COLOR.White}]} onPress={() => handleSettingPrivacyModal({id : 2 , title : 'Who can message me?'})}>
            <Text style ={[styles.fontStyle, darkMode == 'enable' ? {color : COLOR.White} : {color : COLOR.Grey500}]}>Who can message me?</Text>
            <Text style ={{fontFamily : FontFamily.PoppinRegular , fontSize : fontSizes.size15 , color : COLOR.Grey100}}>{who_can_message_me[whoCanMessageMe].label}</Text>
        </Pressable>
         <Pressable style = {[styles.contentContainer,darkMode == 'enable' ? {backgroundColor: COLOR.DarkTheme} :  {backgroundColor: COLOR.White}]} onPress={() => handleSettingPrivacyModal({id : 3 , title : 'Who can see my friends ?'})}>
            <Text style ={[styles.fontStyle, darkMode == 'enable' ? {color : COLOR.White} : {color : COLOR.Grey500}]}>Who can see my friends ?</Text>
            <Text style ={{fontFamily : FontFamily.PoppinRegular , fontSize : fontSizes.size15 , color : COLOR.Grey100}}>{who_can_see_my_friends[whoCanSeeMyFri].label}</Text>
        </Pressable>
         <Pressable style = {[styles.contentContainer,darkMode == 'enable' ? {backgroundColor: COLOR.DarkTheme} :  {backgroundColor: COLOR.White}]} onPress={() => handleSettingPrivacyModal({id : 4 , title : 'Who can post on my timeline ?'})}>
            <Text style ={[styles.fontStyle, darkMode == 'enable' ? {color : COLOR.White} : {color : COLOR.Grey500}]}>Who can post on my timeline ?</Text>
            <Text style ={{fontFamily : FontFamily.PoppinRegular , fontSize : fontSizes.size15 , color : COLOR.Grey100}}>{who_can_post_on_my_timeline[whoCanPostOnMyTimeline].label}</Text>
        </Pressable>
         <Pressable style = {[styles.contentContainer,darkMode == 'enable' ? {backgroundColor: COLOR.DarkTheme} :  {backgroundColor: COLOR.White}]} onPress={() => handleSettingPrivacyModal({id : 5 , title : 'Who can see my birthday ?'})}>
            <Text style ={[styles.fontStyle, darkMode == 'enable' ? {color : COLOR.White} : {color : COLOR.Grey500}]}>Who can see my birthday ?</Text>
            <Text style ={{fontFamily : FontFamily.PoppinRegular , fontSize : fontSizes.size15 , color : COLOR.Grey100}}>{who_can_see_my_birthday[whoCanSeeMyBirthday].label}</Text>
        </Pressable>

        <Pressable style = {[styles.contentWithToggleContainer,darkMode == 'enable' ? {backgroundColor: COLOR.DarkTheme} :  {backgroundColor: COLOR.White}]} onPress={() => setIsConfirmRequestOn(!isConfirmRequestOn)}>
            <View>
                <Text style ={[styles.fontStyle, darkMode == 'enable' ? {color : COLOR.White} : {color : COLOR.Grey500}]}>Confirm request</Text>
                <Text style ={{fontFamily : FontFamily.PoppinRegular , fontSize : fontSizes.size15 , color : COLOR.Grey100}}>When someone follows me</Text>
            </View>
            <ToggleSwitch isOn={isConfirmRequestOn} onToggle={() => setIsConfirmRequestOn(!isConfirmRequestOn)}/>
        </Pressable>

        <Pressable style = {[styles.contentWithToggleContainer,darkMode == 'enable' ? {backgroundColor: COLOR.DarkTheme} :  {backgroundColor: COLOR.White}]} onPress={() => setIsShowActivitiesOn(!isShowActivitiesOn)}>
            <View>
            <Text style ={[styles.fontStyle, darkMode == 'enable' ? {color : COLOR.White} : {color : COLOR.Grey500}]}> Show my activities</Text>
            <Text style ={{fontFamily : FontFamily.PoppinRegular , fontSize : fontSizes.size15 , color : COLOR.Grey100}}>When someone follows me</Text>
            </View>
            <ToggleSwitch isOn={isShowActivitiesOn} onToggle={() => setIsShowActivitiesOn(!isShowActivitiesOn)}/>
        </Pressable>

        <Pressable style = {[styles.contentWithToggleContainer,darkMode == 'enable' ? {backgroundColor: COLOR.DarkTheme} :  {backgroundColor: COLOR.White}]} onPress={() => setIsShowOnlineUsersOn(!isShowOnlineUsersOn)}>
            <View>
                <Text style ={[styles.fontStyle, darkMode == 'enable' ? {color : COLOR.White} : {color : COLOR.Grey500}]}> Show online users</Text>
                <Text style ={{fontFamily : FontFamily.PoppinRegular , fontSize : fontSizes.size15 , color : COLOR.Grey100}}>Show when users are online</Text>
            </View>
            <ToggleSwitch isOn={isShowOnlineUsersOn} onToggle={() => setIsShowOnlineUsersOn(!isShowOnlineUsersOn)}/>
        </Pressable>

        <Pressable style = {[styles.contentWithToggleContainer,darkMode == 'enable' ? {backgroundColor: COLOR.DarkTheme} :  {backgroundColor: COLOR.White}]} onPress={() => setIsShareLocationOn(!isShareLocationOn)}>
            <View>
            <Text style ={[styles.fontStyle, darkMode == 'enable' ? {color : COLOR.White} : {color : COLOR.Grey500}]}> Share my location with public</Text>
                <Text style ={{fontFamily : FontFamily.PoppinRegular , fontSize : fontSizes.size15 , color : COLOR.Grey100}}></Text>
            </View>
            <ToggleSwitch isOn={isShareLocationOn} onToggle={() => setIsShareLocationOn(!isShareLocationOn)}/>
        </Pressable>
    </View>

    <SettingPrivacyModal
        visible={isSettingPrivacyModalVisible}
        onClose={() => setSettingPrivacyModalVisible(false)}
        title = {modalTitle}
        data={privacyTypeData}
        handleSelectSettingPrivacy={handleSelectSettingPrivacy}
        darkMode={darkMode}
      />
</SafeAreaView>
   )
}

const styles = StyleSheet.create({
    container : {
        flex : 1
    },
    contentContainer : {
        padding : PIXEL.px16 , 
        borderBottomColor : COLOR.Grey250,
         borderBottomWidth : 0.3
    },
    contentWithToggleContainer : {
        padding : PIXEL.px16 , 
        borderBottomColor : COLOR.Grey250,
         borderBottomWidth : 0.3,
         flexDirection : 'row',
         justifyContent : 'space-between'
    },
    fontStyle : {
        fontFamily : FontFamily.PoppinRegular,
        fontSize : PIXEL.px15,
    }
});

export default Privacy;