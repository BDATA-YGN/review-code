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
import { retrieveStringData,storeJsonData,storeKeys } from "../../../helper/AsyncStorage";
import { setFetchDarkMode } from "../../../stores/slices/DarkModeSlice";
import { useSelector } from "react-redux";
import SettingPrivacyModal from "../../../components/Setting/Modal/SettingPrivacyModal";
import { retrieveJsonData } from "../../../helper/AsyncStorage";
import { online_status, postPrivary, privacySettingType, who_can_follow_me, who_can_message_me, who_can_post_on_my_timeline, who_can_see_my_birthday, who_can_see_my_friends } from "../../../constants/CONSTANT_ARRAY";
import { getUserInfoData, submitUpdatePrivacySetting } from "../../../helper/ApiModel";

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
    const [whoCanPostOnMyTimeline , setWhoCanPostOnMyTimeline] = useState("everyone");
    const [whoCanSeeMyBirthday , setWhoCanSeeMyBirthday] = useState(0);
    const [onlineStatus, setOnlineStatus] = useState(0);

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
    
      //  if(id == 1){
      //   setPrivacyTypeData(who_can_follow_me)
      //  }
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
      if(id == 6) {
        setPrivacyTypeData(online_status)
      }
      
       
        setModalTitle(title)
        // setModalId(id)
        setSettingPrivacyModalVisible(true)
        
    }

//     const [triggerSubmit, setTriggerSubmit] = useState(false);

const handleSelectSettingPrivacy = (item) => {

    handleUpdatePrivacySetting(item.type, item.type === 'post_privacy' ? item.value : item.id)
    setSettingPrivacyModalVisible(false);

    // setTriggerSubmit(true);
}

const handleToggleSettingPrivacy = (type, value) => {
    const newValue = !value ? "1" : "0";
    handleUpdatePrivacySetting(type, newValue);

    if (type === 'confirm_followers') {
        setIsConfirmRequestOn(!value);
    } else if (type === 'show_activities_privacy') {
        setIsShowActivitiesOn(!value);
    } else if (type === 'share_my_location') {
        setIsShareLocationOn(!value);
    }
}


const handleUpdatePrivacySetting = (type , value) => {
            submitUpdatePrivacySetting(
            type, 
            value,
        )
        .then(value => {
            if (value.api_status === 200) {
                fetchData();
                
            } else {
            }
        })
        .catch(error => {
        });
    }

// const handleUpdatePrivacySetting = async (type, value) => {
//     try {
//         const response = await submitUpdatePrivacySetting(type, value);
//         if (response.api_status === 200) {
//             const updatedUserInfoData = { ...userInfoData, [type]: value };
//             // setUserInfoData(updatedUserInfoData);
//             await storeJsonData({ key: storeKeys.userInfoData, value: updatedUserInfoData });
//         } else {
//         }
//     } catch (error) {
//     }
// }

const fetchData = async () => {
    try {
      const userDataResponse = await getUserInfoData();
      storeJsonData({
        key: storeKeys.userInfoData,
        data: userDataResponse.user_data,
      });
      updateStateFromUserData(userDataResponse.user_data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateStateFromUserData = (userData) => {
    setWhoCanFollowMe(userData.follow_privacy);
    setWhoCanMessageMe(userData.message_privacy);
    setWhoCanSeeMyFri(userData.friend_privacy);
    setWhoCanPostOnMyTimeline(userData.post_privacy);
    setWhoCanSeeMyBirthday(userData.birth_privacy);
    setIsShowActivitiesOn(userData.show_activities_privacy == 1 ? true : false);
    setIsShareLocationOn(userData.share_my_location == 1 ? true : false);
    setIsConfirmRequestOn(userData.confirm_followers == 1 ? true : false);
    setOnlineStatus(userData.status);
  };

  const fetchLoginCredentialData = async () => {
    const userInfoData = await retrieveJsonData({ key: storeKeys.userInfoData });

    if (userInfoData !== null) {
      updateStateFromUserData(userInfoData);
    } else {
      Alert.alert(
        "Invalid",
        `No credential!`,
        [
          {
            text: "Ok",
            onPress: () => {},
          },
        ],
        { cancelable: true }
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

        {/* <Pressable style = {[styles.contentContainer,darkMode == 'enable' ? {backgroundColor: COLOR.DarkTheme} :  {backgroundColor: COLOR.White}]} onPress={() => handleSettingPrivacyModal({id : 1 , title : 'Who can follow me?'})}>
            <Text style ={[styles.fontStyle, darkMode == 'enable' ? {color : COLOR.White} : {color : COLOR.Grey500}]}>Who can follow me?</Text>
            <Text style ={{fontFamily : FontFamily.PoppinRegular , fontSize : fontSizes.size15 , color : COLOR.Grey100}}>{who_can_follow_me[whoCanFollowMe].label}</Text>
        </Pressable> */}
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
            <Text style ={{fontFamily : FontFamily.PoppinRegular , fontSize : fontSizes.size15 , color : COLOR.Grey100}}>{whoCanPostOnMyTimeline == 'nobody' ? 'No body' : whoCanPostOnMyTimeline == 'ifollow' ?  'People i follow' : 'Everyone'}</Text>
        </Pressable>
         <Pressable style = {[styles.contentContainer,darkMode == 'enable' ? {backgroundColor: COLOR.DarkTheme} :  {backgroundColor: COLOR.White}]} onPress={() => handleSettingPrivacyModal({id : 5 , title : 'Who can see my birthday ?'})}>
            <Text style ={[styles.fontStyle, darkMode == 'enable' ? {color : COLOR.White} : {color : COLOR.Grey500}]}>Who can see my birthday ?</Text>
            <Text style ={{fontFamily : FontFamily.PoppinRegular , fontSize : fontSizes.size15 , color : COLOR.Grey100}}>{who_can_see_my_birthday[whoCanSeeMyBirthday].label}</Text>
        </Pressable>

        <Pressable style = {[styles.contentContainer,darkMode == 'enable' ? {backgroundColor: COLOR.DarkTheme} :  {backgroundColor: COLOR.White}]} onPress={() => handleSettingPrivacyModal({id : 6 , title : 'Status'})}>
            <Text style ={[styles.fontStyle, darkMode == 'enable' ? {color : COLOR.White} : {color : COLOR.Grey500}]}>Status</Text>
            <Text style ={{fontFamily : FontFamily.PoppinRegular , fontSize : fontSizes.size15 , color : COLOR.Grey100}}>{online_status[onlineStatus].label}</Text>
        </Pressable>


        {/* <Pressable style = {[styles.contentWithToggleContainer,darkMode == 'enable' ? {backgroundColor: COLOR.DarkTheme} :  {backgroundColor: COLOR.White}]} onPress={() => handleToggleSettingPrivacy('confirm_followers',isConfirmRequestOn )}>
            <View>
                <Text style ={[styles.fontStyle, darkMode == 'enable' ? {color : COLOR.White} : {color : COLOR.Grey500}]}>Confirm request</Text>
                <Text style ={{fontFamily : FontFamily.PoppinRegular , fontSize : fontSizes.size15 , color : COLOR.Grey100}}>When someone follows me</Text>
            </View>
            <ToggleSwitch isOn={isConfirmRequestOn} onToggle={() => handleToggleSettingPrivacy('confirm_followers',isConfirmRequestOn )}/>
        </Pressable> */}
       
        <Pressable style = {[styles.contentWithToggleContainer,darkMode == 'enable' ? {backgroundColor: COLOR.DarkTheme} :  {backgroundColor: COLOR.White}]} onPress={() => handleToggleSettingPrivacy('show_activities_privacy',isShowActivitiesOn )}>
            <View>
            <Text style ={[styles.fontStyle, darkMode == 'enable' ? {color : COLOR.White} : {color : COLOR.Grey500}]}> Show my activities</Text>
            <Text style ={{fontFamily : FontFamily.PoppinRegular , fontSize : fontSizes.size15 , color : COLOR.Grey100}}>When someone follows me</Text>
            </View>
            <ToggleSwitch isOn={isShowActivitiesOn} onToggle={() => handleToggleSettingPrivacy('show_activities_privacy',isShowActivitiesOn )}/>
        </Pressable>


      
        {/* <Pressable style = {[styles.contentWithToggleContainer,darkMode == 'enable' ? {backgroundColor: COLOR.DarkTheme} :  {backgroundColor: COLOR.White}]} onPress={() => setIsShowOnlineUsersOn(!isShowOnlineUsersOn)}>
            <View>
                <Text style ={[styles.fontStyle, darkMode == 'enable' ? {color : COLOR.White} : {color : COLOR.Grey500}]}> Show online users</Text>
                <Text style ={{fontFamily : FontFamily.PoppinRegular , fontSize : fontSizes.size15 , color : COLOR.Grey100}}>Show when users are online</Text>
            </View>
            <ToggleSwitch isOn={isShowOnlineUsersOn} onToggle={() => setIsShowOnlineUsersOn(!isShowOnlineUsersOn)}/>
        </Pressable> */}
        
        

        <Pressable style = {[styles.contentWithToggleContainer,darkMode == 'enable' ? {backgroundColor: COLOR.DarkTheme} :  {backgroundColor: COLOR.White}]} onPress={() =>  handleToggleSettingPrivacy('share_my_location',isShareLocationOn )}>
            <View>
            <Text style ={[styles.fontStyle, darkMode == 'enable' ? {color : COLOR.White} : {color : COLOR.Grey500}]}> Share my location with public</Text>
                <Text style ={{fontFamily : FontFamily.PoppinRegular , fontSize : fontSizes.size15 , color : COLOR.Grey100}}></Text>
            </View>
            <ToggleSwitch isOn={isShareLocationOn} onToggle={() =>  handleToggleSettingPrivacy('share_my_location',isShareLocationOn )}/>
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