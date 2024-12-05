import {
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React from 'react';
import { styles } from './WalletStyle';
import SPACING from '../../constants/SPACING';
import IconManager from '../../assets/IconManager';
import SizedBox from '../../commonComponent/SizedBox';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useState,useEffect } from 'react';
import { getUserInfoData } from '../../helper/ApiModel';

const BalanceList = (props) => {
    const navigation = useNavigation();
    const [userInfoData,setUserInfoData] = useState([]);

    const fetchUserInfo = async () => {
      try {
        const userDataResponse = await getUserInfoData();
        setUserInfoData(userDataResponse.user_data)
        console.log('balance',userDataResponse.user_data.balance)
      } catch (error) {
        fetchUserInfo();
      }
    };
    useEffect(() => {
      fetchUserInfo();
    }, []);
    return (
        <View style={props.darkMode == 'enable' ? styles.Dcard : styles.card}>
            <Text style={props.darkMode == 'enable' ? styles.Dcurrent : styles.current}>Current Balance</Text>
            <SizedBox height={SPACING.sp7} />
            <Text style={props.darkMode == 'enable' ? styles.Dbalance : styles.balance}>Ks {props.amt}</Text>
            <SizedBox height={SPACING.sp14} />
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={[props.darkMode == 'enable' ? styles.DiconCard : styles.iconCard,{marginEnd : SPACING.sp8}]} onPress={() => navigation.navigate('SendMoney',{userInfoData, darkMode : props.darkMode})}>
                    <View style={{ flex : 0.5 }}>
                    <Image
                        source={props.darkMode == 'enable' ? IconManager.send_money_dark : IconManager.send_money_light}
                        resizeMode="contain"
                        style={{ width: 30, height: 30 }}
                    />
                    </View>
                    <View style={{ flex : 0.5 }}>
                    <Text style={props.darkMode == 'enable' ? styles.DiconText : styles.iconText}>Send Money</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={[props.darkMode == 'enable' ? styles.DiconCard : styles.iconCard,{marginEnd : SPACING.sp8}]} onPress={() => navigation.navigate('AddFunds',{userInfoData, darkMode : props.darkMode})}>
                    <Image
                        source={props.darkMode == 'enable' ? IconManager.add_funds_dark : IconManager.add_funds_light}
                        resizeMode="contain"
                        style={{ width: 30, height: 30 }}
                    />
                    <Text style={props.darkMode == 'enable' ? styles.DiconText : styles.iconText} >Add Funds</Text>
                </TouchableOpacity>
                <TouchableOpacity style={props.darkMode == 'enable' ? styles.DiconCard : styles.iconCard} onPress={() => navigation.navigate('WithDraw',{userInfoData, darkMode : props.darkMode})}>
                    <Image
                        source={props.darkMode == 'enable' ? IconManager.withdraw_dark : IconManager.withdraw_light}
                        resizeMode="contain"
                        style={{ width: 30, height: 30 }}
                    />
                    <Text style={props.darkMode == 'enable' ? styles.DiconText : styles.iconText}>Withdraw</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
export default BalanceList;