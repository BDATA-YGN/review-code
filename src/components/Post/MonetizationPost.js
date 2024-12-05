import { SafeAreaView, StyleSheet, Text, View,Image } from 'react-native'
import React from 'react'
import { useState,useEffect } from 'react'
import COLOR from '../../constants/COLOR'
import RADIUS from '../../constants/RADIUS'
import { FontFamily, fontSizes } from '../../constants/FONT'
import ActionButton from '../Button/ActionButton'
import SizedBox from '../../commonComponent/SizedBox'
import SPACING from '../../constants/SPACING'
import { useNavigation } from '@react-navigation/native'
import { fetchCredentialData } from '../../helper/Market/MarketHelper'
import { stringKey } from '../../constants/StringKey'
import { retrieveJsonData,storeKeys } from '../../helper/AsyncStorage'
import IconManager from '../../assets/IconManager'
const MonetizationPost = ({data,darkMode}) => {
  const navigation =  useNavigation();
  const [isLoginUser, setLogInUser] = useState(null);
  const [loginUserId, setLoginUserId] = useState(null);
  const [user_id, setUserId] = useState(0);

  const getUserId = async () => {
    const userId = await fetchCredentialData();
    return userId; // Ensure this is the correct value
  };

  const setId = async () => {
    const id = await getUserId();
    setUserId(id);
  };
  useEffect(() => {
    checkUserType();
  }, [data]);
  const checkUserType = async () => {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const user_id = loginData.user_id;
    setLogInUser(user_id == data.publisher.user_id);
    user_id === data.publisher.user_id && setLoginUserId(user_id);
  };
  useEffect(() => {
    setId();
  }, []);
  const  goToProfile = () => {
    data?.user_id !== user_id
     && navigation.navigate('MonetizedUserProfile', {
        otherUserData: data.publisher,
        userId: data.publisher?.user_id,
        darkMode : darkMode
        });
  };
  return (
    <View>
        <View style={[
          styles.container,
          {
            backgroundColor:
              darkMode === 'enable' ? COLOR.DarkThemLight : '#D9D9D9',
          },
        ]}>
        <Image source={IconManager.monetize_light} />
       <Text style={styles.monetizedText}>This post is monetized.</Text>
       <Text style={styles.monetizedText}>Please subscribe to access the content.</Text>
    </View>
    <SizedBox height={SPACING.sp10} />
    <ActionButton text="Subscribe" onPress = {goToProfile} />
    </View>
  
  )
}

export default MonetizationPost

const styles = StyleSheet.create({
  container : {
      borderColor : COLOR.Primary,
      borderWidth : 1,
      width : '100%',
      height : 120,
      backgroundColor : '#D9D9D9',
      borderCurve : 'continuous',
      borderRadius : RADIUS.rd8,
      alignItems : 'center',
      justifyContent : 'center'

  },
  monetizedText : {
    color : COLOR.Primary,
    fontFamily : FontFamily.PoppinRegular,
    fontSize : fontSizes.size15
  }
})