import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React from 'react';
import {useState, useEffect} from 'react';
import CoverVsAvatar from '../../commonComponent/CoverVsAvatar';
import COLOR from '../../constants/COLOR';
import {getUserInfoData} from '../../helper/ApiModel';
import {
  requestMonetizationList,
  requestSubscribed,
  requestSubScriptionList,
} from '../../helper/Monetization/MonetizationModel';
import RADIUS from '../../constants/RADIUS';
import SPACING from '../../constants/SPACING';
import {FontFamily} from '../../constants/FONT';
import {fontSizes} from '../../constants/FONT';
import IconManager from '../../assets/IconManager';
import {useDispatch, useSelector} from 'react-redux';
import {setMonetizationList} from '../../stores/slices/monetization_slice';
import ActionButton from '../../components/Button/ActionButton';
import SizedBox from '../../commonComponent/SizedBox';
import PIXEL from '../../constants/PIXEL';
import IconPic from '../../components/Icon/IconPic';
import { useNavigation } from '@react-navigation/native';

const MonetizedUserProfile = ({ route }) => {
  const { otherUserData, userId, darkMode } = route.params;
  const [userInfoData, setUserInfoData] = useState([]);
  const { width } = Dimensions.get('window');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedId, setSelectedId] = useState(null); // Track selected item ID
  const navigation = useNavigation();
  const monetizationList = useSelector((state) => state.MonetizedSlice.plans); // Ensure correct path
  const dispatch = useDispatch();

  const getMonetizationList = async () => {
    setIsLoading(true);
    try {
      const data = await requestMonetizationList(userId);
      if (data.api_status === 200) {
        dispatch(setMonetizationList(data.data)); // Dispatching Redux action
        
      }
    } catch (error) {
      console.error("Error fetching monetization list:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false); // Stop refreshing when the fetch is complete
    }
  };

  const getSubscribed = async () => {
    setIsLoading(true);
    try {
      const data = await requestSubscribed(selectedId);
      if (data.api_status === 200) {
        Alert.alert('Success', `${data.data.message}`, [{text: 'OK'}], {
          cancelable: false,
        });
      }
      setTimeout(() => {
        navigation.pop(); // Navigate back to the previous screen
      }, 1000); 
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSelect = (id) => {
    setSelectedId(id); // Set the selected item's ID

  };

  useEffect(() => {
    getMonetizationList();
  }, []);

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
          selectedId === item.id
            ? styles.selecteditemCart
            : styles.itemCart,
          {
            backgroundColor:
              darkMode === "enable" ? COLOR.DarkFadeLight : COLOR.White100,
          },
        ]}
        onPress={() => onSelect(item.id)}
      >
        <View style={styles.itemHeader}>
          <Text style={[styles.itemTitle,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>{item.title}</Text>
        </View>
        <View style={styles.itemContent}>
          <Text style={[styles.itemPrice,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>
            {getCurrencyText(item.currency)} {item.price}
         
          </Text>
          <Text style={[styles.itemPeriod,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300}]}>{item.period}</Text>
          <Text style={[styles.itemDescription,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>{item.description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={darkMode == 'eanble' ? styles.DsafeAreaView :styles.safeAreaView}>
      <View style={{ position : 'relative' , backgroundColor : darkMode == 'enable' ? COLOR.DarkFadeLight  :  COLOR.White100}}>
      <View style={[{backgroundColor : darkMode == 'enable' ? COLOR.DarkFadeLight : COLOR.White100},styles.appBarIconWrapper]}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.goBack()}>
            <IconPic
              width={24}
              height={24}
              source={IconManager.light_dark_back}
            />
          </TouchableOpacity>
       
        </View>
        <CoverVsAvatar
          largerImageWidth={width}
          largerImageHeight={165}
          // darkMode = {darkMode}
          userInfo={otherUserData}
        />
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <Text style={[styles.profileName,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>{otherUserData.name}</Text>
          {otherUserData.is_pro === "0" ? <SizedBox width={SPACING.sm} /> : null}
          {otherUserData.is_pro === "0" ? (
            <IconPic
              width={PIXEL.px22}
              height={PIXEL.px22}
              source={IconManager.user_type_light_dark}
            />
          ) : null}
        </View>
        <Text style={[styles.workText,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>{otherUserData?.working}</Text>
        <SizedBox height={SPACING.sp10} />
        <View style={styles.pleaseChoose}>
          <Text style={styles.chooseText}>Please choose a plan to see the contents.</Text>
        </View>
      </View> 
      <View style={[{backgroundColor : darkMode == 'enable' ? COLOR.DarkFadeLight : COLOR.White100},styles.listContainer]}>
        <FlatList
          data={monetizationList}
          keyExtractor={(item, index) => `${item.id}_${index}`}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
        {/* Conditionally render Subscribe button */}
       {selectedId &&
       <ActionButton text="Subscribe" onPress={getSubscribed} />
      }
          
      </View>
    </SafeAreaView>
  );
};


export default MonetizedUserProfile;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: COLOR.White100,
  },
  DsafeAreaView: {
    flex: 1,
    backgroundColor: COLOR.DarkFadeLight,
  },
  itemCart: {
    flex: 1,
    borderRadius: RADIUS.rd8,
    padding: 10,
    paddingVertical : SPACING.sp20,
    borderWidth: 1,
    borderColor: COLOR.Grey300,
    marginBottom: 15,
  },
  selecteditemCart: {
    flex: 1,
    borderRadius: RADIUS.rd8,
    padding: 10,
    paddingVertical : SPACING.sp20, 
    borderWidth: 1,
    borderColor: COLOR.Primary,
    marginBottom: 15,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.sp16,
  },
  itemTitle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
    color: COLOR.Grey500,
    marginBottom : SPACING.sp5
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
    marginBottom : SPACING.sp5
  },
  itemPeriod: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size14,
    color: COLOR.Grey200,
    marginBottom : SPACING.sp5
  },
  itemDescription: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.Grey500,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
    color : COLOR.White100,
    fontFamily : FontFamily.PoppinRegular
  },
  profileName : {
    color : COLOR.Grey500,
    fontFamily : FontFamily.PoppinSemiBold,
    alignSelf : 'center',
    fontSize : fontSizes.size29
},
workText : {
    color : COLOR.Grey500,
    fontFamily : FontFamily.PoppinRegular,
    alignSelf : 'center',
    fontSize : fontSizes.size16
},
appBarIconWrapper: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  height: 48,
  padding: 10,
  // alignItems : 'center',
  backgroundColor: 'rgba(0,0,0,0)',
  position: 'absolute',
  top: 0,
  zIndex: 1,
},
iconContainer: {
  // position: 'absolute',
  // top: SPACING.sp32,
  // left: 0,
  // padding: 10,
  width: PIXEL.px50,
  height: PIXEL.px50,
  // backgroundColor:COLOR.Primary,
  justifyContent: 'center',
  alignItems: 'flex-start',
  // zIndex: 1, // Ensure the icon is above other content
},
})