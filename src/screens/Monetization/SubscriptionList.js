import { SafeAreaView, StyleSheet, Text, View ,FlatList,TouchableOpacity,Image} from 'react-native'
import React from 'react'
import { requestSubscribed, requestSubScriptionList, requestUnSubscribed } from '../../helper/Monetization/MonetizationModel';
import { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSubscriptionList } from '../../stores/slices/monetization_slice';
import { getUserInfoData } from '../../helper/ApiModel';
import COLOR from '../../constants/COLOR';
import SPACING from '../../constants/SPACING';
import PIXEL from '../../constants/PIXEL';
import RADIUS from '../../constants/RADIUS';
import { FontFamily } from '../../constants/FONT';
import { fontSizes } from '../../constants/FONT';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import { useNavigation } from '@react-navigation/native';
import IconManager from '../../assets/IconManager';
import SizedBox from '../../commonComponent/SizedBox';
import { Dimensions } from 'react-native';
import IconPic from '../../components/Icon/IconPic';
import ActionButton from '../../components/Button/ActionButton';
import { Alert } from 'react-native';
const SubscriptionList = ({route}) => {
  const subscriptionList = useSelector(state => state.MonetizedSlice.subscriptions);
  const dispatch = useDispatch();
  const {darkMode} = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userInfoData,setUserInfoData] = useState([]);
  const navigation = useNavigation();

  const getSubscripionList = async () => {
    setIsLoading(true);
    try {
      const data = await requestSubScriptionList();
      if (data.api_status === 200) {
        dispatch(setSubscriptionList(data.data)); // Dispatching Redux action

      }
    } catch (error) {
      console.error('Error fetching payment list:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false); // Stop refreshing when the fetch is complete
    }
  };

  const getUnSubscribed = async (id) => {
    setIsLoading(true);
    try {
      const data = await requestUnSubscribed(id);
      if (data.api_status === 200) {
        Alert.alert('Success', `${data.data}`, [{text: 'OK'}], {
          cancelable: false,
        });
        getSubscripionList();
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSubscripionList();

  }, []);
  const SubscriptionEmpty = () => {
    const { width } = Dimensions.get('window');
    const iconSize = width * 0.3;

    return (
      <View style={styles.emptyContainer}>
        <IconPic
          width={iconSize}
          height={iconSize}
          source={IconManager.no_subscription}
        />

        <SizedBox height={PIXEL.px4} />
        <Text style={[styles.emptySubText,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>
        You didn't subscribe to any users yet.
        </Text>
        <SizedBox height={PIXEL.px30} />
      </View>
    );
  };
  const renderItem = ({ item }) => {
    const getCurrencyText = (currency) => {
      switch (currency) {
        case "0":
          return "Ks";
        case "1":
          return "USD";
        case "2":
          return "SGD";
        case "3":
          return "Thai Baht";
        default:
          return "";
      }
    };

    return (
      <TouchableOpacity
        style={[
    
            styles.itemCart,
          {
            backgroundColor:
              darkMode === "enable" ? COLOR.DarkFadeLight : COLOR.White100,
          },
        ]}
       
      >
        <View style={styles.profileInfo}>
        <Image
                source={{uri:item.user_img}}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 20,
                  resizeMode: 'contain',
                }}
              />
        <View style={{ marginStart : 10  }}>
        <Text style={[styles.workText,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>{item.user_f_name}</Text>
        <Text style={[styles.chooseText,{color : darkMode == 'enable' ? COLOR.White50 : COLOR.Grey300}]}>@{item.user_name}</Text>
        </View>
        </View>
        <SizedBox height={SPACING.sp15} />
        <View style={{ height : 0.5,backgroundColor:COLOR.Grey100 }} />
        <View style={styles.itemHeader}>
          <Text style={[styles.itemTitle,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>{item.monetization_data.title}</Text>
        </View>
        <View style={styles.itemContent}>
        <View style={{ flexDirection:'row' ,alignItems:"center" }}>
         
          <Text style={[styles.itemPrice,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>
            {getCurrencyText(item.monetization_data.currency)} {item.monetization_data.price}
         
          </Text> 
          <Text style={[styles.itemPeriod,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>{''} /</Text>
          <Text style={[styles.itemPeriod,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>{''} {item.monetization_data.period}</Text>
          </View>
        
     
        </View>
        <SizedBox height = {SPACING.sp10} />
        <ActionButton text="Unsubscribe" onPress={() => getUnSubscribed(item.id)}/>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={darkMode == 'enable' ? styles.dsafeAreaView :styles.safeAreaView}>
      <ActionAppBar
        appBarText="My Subscription"
        source={IconManager.back_light}
        backpress={() => navigation.pop()}
        darkMode={darkMode}
      />
      <View style={styles.listContainer}>
        {subscriptionList.length > 0 ?
        (
          <FlatList
          data={subscriptionList}
          keyExtractor={(item, index) => `${item.id}_${index}`}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
        ) : (<SubscriptionEmpty/>)}
       </View>
    </SafeAreaView>
  )
}

export default SubscriptionList

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: COLOR.White100,
  },
  dsafeAreaView: {
    flex: 1,
    backgroundColor: COLOR.DarkThemLight,
  },
  itemCart: {
    flex: 1,
    borderRadius: RADIUS.rd8,
    padding: 10,
    borderWidth: 1,
    borderColor: COLOR.Primary,
    marginBottom: 15,
  },
  selecteditemCart: {
    flex: 1,
    borderRadius: RADIUS.rd8,
    padding: 10,
    borderWidth: 1,
    borderColor: 'red',
    marginBottom: 15,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.sp16,
    paddingTop : SPACING.sp16
  },
  itemTitle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
    color: COLOR.Grey500,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    margin: 4,
  },
  itemContent: {
    justifyContent: 'center',
    paddingHorizontal: SPACING.sp16,
  },
  itemPrice: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size18,
    color: COLOR.Grey500,
  },
  itemPeriod: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.Grey500,
  },
  itemDescription: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    color: COLOR.Grey500,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex : 1
  },
  emptyText: {
    fontSize: fontSizes.size22,
    color: COLOR.Black900,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  emptySubText: {
    fontSize: fontSizes.size18,
    color: COLOR.Grey600,
    fontFamily: FontFamily.PoppinRegular,
  },
  container: {
    flex: 1,
    padding: SPACING.sp15,
  },
  listContainer: {
    flex: 1,
    padding: SPACING.sp20,
  },
  pleaseChoose : {
    backgroundColor : COLOR.Primary,
    width : 300,
    height : 50,
    alignItems : 'center',
    justifyContent : 'center',
    alignSelf : 'center',
    borderRadius : RADIUS.rd10
  },
  chooseText : {
    color : COLOR.Grey300,
    fontFamily : FontFamily.PoppinRegular
  },
  profileName : {
    color : COLOR.Grey500,
    fontFamily : FontFamily.PoppinSemiBold,
    // alignSelf : 'center',
    fontSize : fontSizes.size29
},
workText : {
    color : COLOR.Grey500,
    fontFamily : FontFamily.PoppinSemiBold,
    // alignSelf : 'center',
    fontSize : fontSizes.size16
},
profileInfo : {
  flexDirection : 'row'
}
})