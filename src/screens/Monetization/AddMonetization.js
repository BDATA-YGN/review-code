import React, { useState, useEffect } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import COLOR from '../../constants/COLOR';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import { useNavigation } from '@react-navigation/native';
import IconManager from '../../assets/IconManager';
import { FontFamily, fontSizes, fontWeight } from '../../constants/FONT';
import SPACING from '../../constants/SPACING';
import SizedBox from '../../commonComponent/SizedBox';
import PIXEL from '../../constants/PIXEL';
import RADIUS from '../../constants/RADIUS';
import IconPic from '../../components/Icon/IconPic';
import { requestDeleteMonetization, requestMonetizationList, requestSubscribed } from '../../helper/Monetization/MonetizationModel';
import { setMonetizationList } from '../../stores/slices/monetization_slice';
import { useSelector,useDispatch } from 'react-redux';
import { getUserInfoData } from '../../helper/ApiModel';
import { Alert } from 'react-native';
import { getCurrecyLists } from '../../helper/Monetization/MonetizationModel';

const AddMonetization = ({ route }) => {
  const navigation = useNavigation();
  const {  userId, darkMode } = route.params;
  // const [monetizationList, setMonetizationList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const monetizationList = useSelector(state => state.MonetizedSlice.plans); // Ensure correct path
  const [currencyLists , setCurrencyLists] = useState([]);
  const dispatch = useDispatch();

  const getMonetizationList = async () => {
    setIsLoading(true);
    try {
     
      const data = await requestMonetizationList(userId);
      if (data.api_status === 200) {
        dispatch(setMonetizationList(data.data)); // Dispatching Redux action
        console.log(monetizationList.user_id)
      }
    } catch (error) {
      console.error('Error fetching payment list:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false); // Stop refreshing when the fetch is complete
    }
  };

  const getCurrencies= async () => {
    setIsLoading(true);
    try {
      const data = await getCurrecyLists();
      if (data.api_status === 200) {
        setCurrencyLists(data)
        console.log(data.data)
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMonetizationList();
    getCurrencies();
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    getMonetizationList();
  };

  const handleEdit = (data) => {
    navigation.navigate('EditPlan', { data, darkMode ,currencyLists });
  };

  const handleDeletePress = async (id) => {
    setIsLoading(true);
    try {
      const data = await requestDeleteMonetization(id);
      if (data.api_status === 200) {
        Alert.alert('Success', 'Monetization Delete Successful', [{text: 'OK'}], {
          cancelable: false,
        });
      }
     getMonetizationList()
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const renderItem = ({ item }) => {
    const getCurrencyText = (currency) => {
      switch (currency) {
        case '0':
          return 'MMK (Ks)';
        case '1':
          return 'USD';
        case '2':
          return 'SGD';
        case '3':
          return 'Thai Baht';
        default:
          return '';
      }
    };

   
    return (
      <View
        style={[
          styles.itemCart,
          {
            backgroundColor:
              darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
          },
        ]}
      >
        {/* Your Item Rendering Code Here */}
        <View style={styles.itemHeader}>
          <Text style={[styles.itemTitle,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>{item.title}</Text>
          <View style={styles.itemActions}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleEdit(item)}
            >
              <Image
                source={
                  darkMode === 'enable'
                    ? IconManager.editing_white
                    : IconManager.editing_light
                }
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeletePress(item.id)}
              activeOpacity={0.8}
            >
              <Image
                source={
                  darkMode === 'enable'
                    ? IconManager.delete_white
                    : IconManager.delete_light
                }
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.itemContent}>
        <View style={{ flexDirection:'row' ,alignItems:"center" }}>
        <Text style={[styles.itemPrice,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>
            {getCurrencyText(item.currency)} {item.price}    
          </Text> 
          <Text style={[styles.itemPeriod,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>{''} /</Text>
          <Text style={[styles.itemPeriod,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>{''} {item.period}</Text>
        </View>
        
          
          <Text style={[styles.itemDescription,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>{item.description}</Text>
        </View>
      </View>
    );
  };

  const NotificationEmpty = () => {
    const { width } = Dimensions.get('window');
    const iconSize = width * 0.7;

    return (
      <View style={styles.emptyContainer}>
        <IconPic
          width={iconSize}
          height={iconSize}
          source={IconManager.no_plan_light}
        />
        <Text style={[styles.emptyText,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>No Plan</Text>
        <SizedBox height={PIXEL.px4} />
        <Text style={[styles.emptySubText,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>
          Create to start earnin
        </Text>
        <SizedBox height={PIXEL.px30} />
      </View>
    );
  };

  return (
    <SafeAreaView style={darkMode == 'enable' ? styles.DsafeAreaView :styles.safeAreaView}>
      <ActionAppBar
        appBarText="Monetization"
        source={IconManager.back_light}
        backpress={() => navigation.pop()}
        darkMode={darkMode}
      />
      <View style={styles.container}>
        <View style={styles.header}>
   
     
                 <Image
            source={darkMode == 'enable'? IconManager.dollar_dark :IconManager.dollar_light}
            // resizeMode="contain"
            style={styles.headerIcon}
          /> 
      
          <View style={{flex:1, paddingLeft : SPACING.sp8}}>
          <Text style={[styles.context,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500} ]}>
            Unlock your earning potential today by offering and selling your
            exclusive content and posts.
          </Text>
          </View>
         
        </View>
        <TouchableOpacity
          style={styles.dotCard}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('CreatePlan', {darkMode, currencyLists })}
        >
          <Image
            source={IconManager.add_plan_light}
            resizeMode="contain"
            style={styles.addPlanIcon}
          />
          <SizedBox height={SPACING.sp10} />
          <Text style={styles.addPlan}>Add New Plan</Text>
        </TouchableOpacity>
        <SizedBox height={SPACING.sp15} />
        <View style={styles.listContainer}>
          {monetizationList.length > 0 ? (
            <FlatList
              data={monetizationList}
              keyExtractor={(item, index) => `${item.id}_${index}`}
              renderItem={renderItem}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={onRefresh}
                />
              }
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <NotificationEmpty />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddMonetization;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: COLOR.White100,
  },
  DsafeAreaView: {
    flex: 1,
    backgroundColor: COLOR.DarkThemLight,
  },
  container: {
    flex: 1,
    padding: SPACING.sp15,
  },
  header: {
    width : '100%',
    flexDirection: 'row',
    
  },
  headerIcon: {
    width: 30,
    height: 30,
  
  },
  context: {
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Grey500,
    fontSize: fontSizes.size15,
  },
  dotCard: {
    borderWidth: 1.2,
    borderRadius: 10,
    borderColor: COLOR.Primary,
    borderStyle: 'dashed',
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop : SPACING.sp15
  },
  addPlanIcon: {
    width: 30,
    height: 30,
  },
  addPlan: {
    color: COLOR.Primary,
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size19,
  },
  listContainer: {
    flex: 1,
  },
  itemCart: {
    flex: 1,
    borderRadius: RADIUS.rd8,
    padding: 10,
    paddingVertical : SPACING.sp20,
    borderWidth: 0.3,
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
    marginBottom : SPACING.sp5,
    fontWeight : fontWeight.weight500
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
    fontSize: fontSizes.size15,
    color: COLOR.Grey500,
    marginBottom : SPACING.sp5
  },
  itemPeriod: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
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
  },
  emptyText: {
    fontSize: fontSizes.size23,
    color: COLOR.Black900,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  emptySubText: {
    fontSize: fontSizes.size18,
    color: COLOR.Grey600,
    fontFamily: FontFamily.PoppinRegular,
  },
});
