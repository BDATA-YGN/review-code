import React, {useEffect, useState} from 'react';
import {
  View,
  useWindowDimensions,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Button,
  Alert,
} from 'react-native';
import IconManager from '../../assets/IconManager';
import COLOR from '../../constants/COLOR';
import SPACING from '../../constants/SPACING';
import {FontFamily, fontSizes} from '../../constants/FONT';
import {useDispatch, useSelector} from 'react-redux';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {retrieveStringData, storeKeys} from '../../helper/AsyncStorage';
import {useNavigation} from '@react-navigation/native';
import {
  checkNetworkStatus,
  emojiList,
  fetchAddress,
  fetchJoinedGroup,
  fetchMyPage,
  fetchOrderList,
  getChekcoutCartList,
  getLoggingData,
  getMarket,
  getMyProduct,
  getPurchased,
} from '../../helper/Market/MarketHelper';
import NetworkErrorDialog from './MarketHelper/newtwork_error_dialog';
import {setEmptyMessage} from '../../stores/slices/market_slice';
import { submitGetCurrencies } from '../../helper/ApiModel';

const MarketScreen = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const marketList = useSelector(state => state.MarketSlice.marketList);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const checkoutCartList = useSelector(
    state => state.MarketSlice.checkoutCartList,
  );
  const userInfoData = useSelector(state => state.MarketSlice.userInfoData);
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const [currencies, setCurrencies] = useState([]);

  const handleGetCurrencies = async () => {

    try {
      // Trigger the loading state
      const response = await submitGetCurrencies('currencies');
  
      if (response.api_status === 200) {
        setCurrencies(response.data)
      } else {
        console.error('Failed to get currencies:', response);
        // Show an error message to the user
      }
    } catch (error) {
      console.error('Error getting currencies:', error);
      // Handle API errors, show an error message, or retry logic
    }
    
  }

  const getDarkModeTheme = async () => {
    try {
      const darkModeValue = await retrieveStringData({
        key: storeKeys.darkTheme,
      });
      if (darkModeValue !== null || darkModeValue !== undefined) {
        setDarkMode(darkModeValue);
      }
    } catch (error) {
      console.error('Error retrieving dark mode theme:', error);
    }
  };
  useEffect(() => {
    handleGetCurrencies();
    getDarkModeTheme();
  }, []);
  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);

  useEffect(() => {
    checkNetworkStatus().then(isOnline => {
      if (isOnline) {
        getLoggingData(dispatch);
        getMarket(dispatch , 10);
        getMyProduct(dispatch);
        getPurchased(dispatch);
        fetchAddress(dispatch);
        getChekcoutCartList(dispatch);
        fetchMyPage(dispatch);
        fetchJoinedGroup(dispatch);
        fetchOrderList(dispatch);
        emojiList(dispatch);
      } else {
        dispatch(
          setEmptyMessage(
            `Oops! It looks like you're offline. Connect to the internet to continue.`,
          ),
        );
      }
    });
  }, [dispatch]);

  // const [isDialogVisible, setDialogVisible] = useState(false);

  // const showDialog = () => {
  //   setDialogVisible(true);
  // };

  // const hideDialog = () => {
  //   setDialogVisible(false);
  // };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.Grey50,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottomWidth: 0.3,
          borderBottomColor: COLOR.Grey300,
          backgroundColor:
            darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={{}}>
          <Image
            source={
              darkMode === 'enable'
                ? IconManager.back_dark
                : IconManager.back_light
            }
            style={{
              width: SPACING.sp18,
              height: SPACING.sp18,
              resizeMode: 'contain',
              margin: SPACING.sp16,
            }}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: FontFamily.PoppinRegular,
            fontSize: fontSizes.size16,
            color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
          }}>
          Market
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          style={{paddingRight: 16}}
          onPress={() =>
            navigation.navigate('ShoppingCart', {darkMode: darkMode})
          }>
          <View style={{position: 'relative'}}>
            <Image
              style={{
                width: SPACING.sp23,
                height: SPACING.sp23,
                resizeMode: 'contain',
                // tintColor: COLOR.Primary,
              }}
              source={
                darkMode === 'enable'
                  ? IconManager.market_dark_mode
                  : IconManager.market_light
              }
            />
            {checkoutCartList.length > 0 && (
              <View
                style={{
                  position: 'absolute',
                  bottom: -5, // Adjust as needed
                  right: -5, // Adjust as needed
                  borderRadius: 30,
                  width: 18,
                  height: 18,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor:
                    darkMode === 'enable'
                      ? COLOR.PrimaryBlue50
                      : COLOR.PrimaryBlue50,
                }}>
                <Text
                  style={{
                    fontSize: fontSizes.size14, // Adjust as needed
                    color:
                      darkMode === 'enable' ? COLOR.White100 : COLOR.White100, // Adjust as needed
                  }}>
                  {`${checkoutCartList.length}`}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
      {/* <NetworkErrorDialog
        visible={isDialogVisible}
        onRetryPress={hideDialog}
        darkMode="enable" // Change to "disable" for light mode
      /> */}
      <View
        style={{
          gap: 16,
          padding: 16,
          borderRadius: 8,
          backgroundColor:
            darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White100,
          margin: 16,
        }}>
        <View style={{display: 'flex', flexDirection: 'row', gap: 16}}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              flex: 1,
              backgroundColor:
                darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.Grey50,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 8,
            }}
            onPress={() => {
              navigation.navigate('MyMarket', {darkMode: darkMode , currencies : currencies});
            }}>
            <View style={styles.cardHolder}>
              <Image
                source={
                  darkMode === 'enable'
                    ? IconManager.market_dark_mode
                    : IconManager.market_light
                }
                style={[styles.icon]}
              />
              <Text
                numberOfLines={1}
                style={[
                  styles.text,
                  {
                    color:
                      darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                  },
                ]}>
                Market
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              flex: 1,
              backgroundColor:
                darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.Grey50,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 8,
            }}
            onPress={() => {
              navigation.navigate('MyPurchased', {darkMode: darkMode});
            }}>
            <View style={styles.cardHolder}>
              <Image
                source={
                  darkMode === 'enable'
                    ? IconManager.purchase_dark_mode
                    : IconManager.purchase
                }
                style={[styles.icon, {}]}
              />
              <Text
                numberOfLines={1}
                style={[
                  styles.text,
                  {
                    color:
                      darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                  },
                ]}>
                Purchsed
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{display: 'flex', flexDirection: 'row', gap: 16}}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              flex: 1,
              backgroundColor:
                darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.Grey50,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 8,
            }}
            onPress={() => {
              navigation.navigate('OrderedList', {darkMode: darkMode});
            }}>
            <View style={styles.cardHolder}>
              <Image
                source={
                  darkMode === 'enable'
                    ? IconManager.order_dark_mode
                    : IconManager.order
                }
                style={[styles.icon, {}]}
              />
              <Text
                numberOfLines={1}
                style={[
                  styles.text,
                  {
                    color:
                      darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                  },
                ]}>
                Orders
              </Text>
            </View>
          </TouchableOpacity>
          {userInfoData.is_verified === 1 ? (
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                flex: 1,
                backgroundColor:
                  darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.Grey50,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
              }}
              onPress={() => {
                navigation.navigate('MyProduct', {darkMode: darkMode , currencies : currencies});
              }}>
              <View style={styles.cardHolder}>
                <Image
                  source={
                    darkMode === 'enable'
                      ? IconManager.my_product_dark_mode
                      : IconManager.my_product
                  }
                  style={[styles.icon, {}]}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    styles.text,
                    {
                      color:
                        darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    },
                  ]}>
                  My Products
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={{flex: 1}} />
          )}
        </View>
        {userInfoData.is_verified === 1 ? (
          <View style={{display: 'flex', flexDirection: 'row', gap: 16}}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                flex: 1,
                backgroundColor:
                  darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.Grey50,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
              }}
              onPress={() => {
                navigation.navigate('CreateProductOne', {darkMode: darkMode});
              }}>
              <View style={styles.cardHolder}>
                <Image
                  source={
                    darkMode === 'enable'
                      ? IconManager.add_product_dark_mode
                      : IconManager.add_address
                  }
                  style={[styles.icon, {}]}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    styles.text,
                    {
                      color:
                        darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    },
                  ]}>
                  Add Product
                </Text>
              </View>
            </TouchableOpacity>
            <View style={{flex: 1}} />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default MarketScreen;

const styles = StyleSheet.create({
  cardHolder: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  icon: {
    flex: 1,
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 4,
  },
  text: {
    flex: 3,
    fontSize: fontSizes.size14,
    color: COLOR.Grey500,
    fontFamily: FontFamily.PoppinRegular,
  },
});
