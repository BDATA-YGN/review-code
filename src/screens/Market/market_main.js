import React, {useEffect, useState} from 'react';
import {
  View,
  useWindowDimensions,
  Text,
  SafeAreaView,
  TextInput,
  Image,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import IconManager from '../../assets/IconManager';
import COLOR from '../../constants/COLOR';
import SizedBox from '../../commonComponent/SizedBox';
import SPACING from '../../constants/SPACING';
import {FontFamily, fontSizes} from '../../constants/FONT';
import {useDispatch, useSelector} from 'react-redux';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {retrieveStringData, storeKeys} from '../../helper/AsyncStorage';
import {useNavigation} from '@react-navigation/native';
import MyMarket from './my_market';
import MyProduct from './my_product';
import MyPurchased from './my_purchased';
import RADIUS from '../../constants/RADIUS';
import {
  categoriesList,
  categoryList,
  marketCategory,
} from '../../constants/CONSTANT_ARRAY';
import {
  filterProduct,
  requestAddress,
  requestMyProduct,
  requestProduct,
  requestPurchase,
} from '../../helper/ApiModel';
import {
  addMarketItem,
  setAddressList,
  setFetchAddressData,
  setFetchMarketData,
  setFetchMyProductsData,
  setFetchPurchasedData,
  setMarketList,
  setMyProductsList,
  setPurchasedList,
} from '../../stores/slices/market_slice';
import {
  fetchAddress,
  fetchCredentialData,
  fetchJoinedGroup,
  fetchMyPage,
  getChekcoutCartList,
  getGoingEventList,
  getLoggingData,
  getMarket,
  getMyProduct,
  getPurchased,
} from '../../helper/Market/MarketHelper';

const MarketMain = () => {
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

  useEffect(() => {
    getLoggingData(dispatch);
    getMarket(dispatch);
    getMyProduct(dispatch);
    getPurchased(dispatch);
    fetchAddress(dispatch);
    getChekcoutCartList(dispatch);
    fetchMyPage(dispatch);
    fetchJoinedGroup(dispatch);
  }, [dispatch]);

  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
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
    getDarkModeTheme();
  }, []);
  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);

  const [routes] = useState([
    {key: 'market', title: 'Market'},
    {key: 'my_products', title: 'My Products'},
    {key: 'purchased', title: 'Purchased'},
  ]);
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [modalCategoryVisible, setModalCategoryVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(0))[0]; // Initial value for opacity: 0
  const [distance, setDistance] = useState(0); // Initial distance value

  const screenHeight = Dimensions.get('window').height;
  const flatListHeight = screenHeight / 1.5;
  const [contentHeight, setContentHeight] = useState(0);

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'market':
        return <MyMarket darkMode={darkMode} />;
      case 'my_products':
        return <MyProduct darkMode={darkMode} />;
      case 'purchased':
        return <MyPurchased darkMode={darkMode} />;
      default:
        return null;
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleClear = () => {
    setSearchText('');
    setIsFocused(false);
    Keyboard.dismiss();
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const openModalCategory = () => {
    setModalCategoryVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      handleDone();
      setModalVisible(false);
    });
  };

  const closeModalCategory = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      handleDone();
      setModalCategoryVisible(false);
    });
  };

  const filterProductList = async () => {
    try {
      dispatch(setFetchMarketData(true));
      const response = await filterProduct(
        handleCategory(),
        searchText,
        distance,
      );

      if (response.api_status === 200) {
        dispatch(setMarketList(response.products));
        dispatch(setFetchMarketData(false)); // Update fetch status
      } else {
        Alert.alert('Warning!', 'Getting unknown status.');
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        Alert.alert('Error!', 'Internal server error. Please try again later.');
      } else {
        Alert.alert('Error!', 'An error occurred. Please try again.');
      }
      dispatch(setFetchMarketData(false)); // Ensure to update fetch status in case of error
    }
  };

  const handleDone = () => {
    filterProductList();
    Keyboard.dismiss();
  };

  const handleCategory = () => {
    if (selectedCategory) {
      const selectedCategoryId = selectedCategory.category_id;
      // Log the selected category ID
      // Return the selected category ID
      return selectedCategoryId;
    } else {
      // Return null or any other appropriate value if no category is selected
      return 0;
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
      }}>
      <TouchableWithoutFeedback onPress={handleClear}>
        <View
          style={{
            backgroundColor:
              darkMode == 'enable' ? COLOR.DarkThemLight : COLOR.White100,
            paddingHorizontal: SPACING.sp12,
            paddingVertical: SPACING.sp10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.goBack();
              }}>
              <Image
                style={{
                  width: SPACING.sp16,
                  height: SPACING.sp16,
                  resizeMode: 'contain',
                }}
                source={
                  darkMode === 'enable'
                    ? IconManager.back_dark
                    : IconManager.back_light
                }
              />
            </TouchableOpacity>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                placeholder="Search"
                placeholderTextColor={
                  darkMode === 'enable' ? COLOR.White300 : COLOR.Grey300
                }
                style={{
                  flex: 1,
                  color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                  marginLeft: SPACING.sp10,
                  marginRight: SPACING.sp10,
                  paddingLeft: isFocused ? SPACING.sp10 : SPACING.sp32, // Space for prefix image
                  paddingRight: SPACING.sp32, // Space for postfix image
                  paddingVertical:
                    Platform.OS === 'ios' ? SPACING.sp12 : SPACING.sp8, // Adjust padding for iOS and Android
                  borderRadius: SPACING.sp8,
                  borderColor: COLOR.Primary, // Highlight border if text is not empty
                  borderWidth: 1,
                  height: SPACING.sp40, // Set explicit height
                }}
                value={searchText}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChangeText={text => setSearchText(text)}
                onSubmitEditing={handleDone} // Add this line
                returnKeyType="done" // Add this line to show the "done" button on the keyboard
              />

              {isFocused && (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: COLOR.Grey50,
                    position: 'absolute',
                    right: SPACING.sp20,
                    borderRadius: SPACING.sp2,
                  }}>
                  <View
                    style={{
                      width: SPACING.sp8,
                      height: SPACING.sp8,
                      margin: SPACING.sp4,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{
                        width: SPACING.sp8,
                        height: SPACING.sp8,
                        resizeMode: 'contain',
                      }}
                      source={IconManager.close_light}
                    />
                  </View>
                </View>
              )}
              {!isFocused && (
                <Image
                  style={{
                    width: SPACING.sp16,
                    height: SPACING.sp16,
                    position: 'absolute',
                    left: SPACING.sp20,
                    resizeMode: 'contain',
                  }}
                  source={
                    darkMode === 'enable'
                      ? IconManager.search_dark
                      : IconManager.search_light
                  }
                  //   tintColor={COLOR.Grey300}
                />
              )}
            </View>
            {/* <TouchableOpacity activeOpacity={0.7} onPress={openModal}>
              <Image
                style={{
                  width: SPACING.sp23,
                  height: SPACING.sp23,
                  resizeMode: 'contain',
                }}
                source={
                  darkMode === 'enable'
                    ? IconManager.traveling_dark
                    : IconManager.traveling_light
                }
              />
            </TouchableOpacity> */}
            {/* <SizedBox width={SPACING.sp8} /> */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('ShoppingCart', {darkMode: darkMode})
              }>
              <View style={{position: 'relative'}}>
                <Image
                  style={{
                    width: SPACING.sp23,
                    height: SPACING.sp23,
                    resizeMode: 'contain',
                  }}
                  source={
                    darkMode === 'enable'
                      ? IconManager.market_dark
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
                          darkMode === 'enable'
                            ? COLOR.White100
                            : COLOR.White100, // Adjust as needed
                      }}>
                      {`${checkoutCartList.length}`}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <SizedBox height={SPACING.sp8} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: SPACING.sp12,
          backgroundColor:
            darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
        }}>
        <TouchableOpacity
          onPress={
            userInfoData.is_verified === 1
              ? () =>
                  navigation.navigate('CreateProductOne', {darkMode: darkMode})
              : null
          }
          activeOpacity={0.8}
          style={[
            styles.buttonLight,
            {
              backgroundColor:
                userInfoData.is_verified === 1 ? COLOR.Primary : COLOR.Grey200,
            },
          ]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{
                width: SPACING.sp18,
                height: SPACING.sp18,
                resizeMode: 'contain',
              }}
              source={IconManager.add_product_white}
            />
            <SizedBox width={SPACING.sp8} />
            <Text style={styles.buttonTextLight}>Add Product</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={openModalCategory}
          activeOpacity={0.8}
          style={styles.buttonLight}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{
                width: SPACING.sp18,
                height: SPACING.sp18,
                resizeMode: 'contain',
              }}
              source={IconManager.category_white}
            />
            <SizedBox width={SPACING.sp8} />
            <Text style={styles.buttonTextLight}>Categories</Text>
          </View>
        </TouchableOpacity>
      </View>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        renderTabBar={props => (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TabBar
              {...props}
              indicatorStyle={{
                backgroundColor:
                  darkMode === 'enable' ? COLOR.White100 : COLOR.Primary,
              }}
              style={{
                backgroundColor:
                  darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
                flex: 1,
              }}
              renderLabel={({route, focused, color}) => (
                <Text
                  style={{
                    color: focused
                      ? darkMode === 'enable'
                        ? COLOR.White100
                        : COLOR.Grey500
                      : darkMode === 'enable'
                      ? COLOR.White300
                      : COLOR.Grey300,
                    margin: SPACING.sp8,
                  }}>
                  {route.title}
                </Text>
              )}
            />
          </View>
        )}
      />
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={[styles.modalOverlay]}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.modalContainer,
                  {
                    transform: [
                      {
                        translateY: slideAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [layout.height, 0],
                        }),
                      },
                    ],
                  },
                  {
                    backgroundColor:
                      darkMode === 'enable'
                        ? COLOR.DarkThemLight
                        : COLOR.White100,
                  },
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={[
                      styles.modalText,
                      {
                        color:
                          darkMode === 'enable'
                            ? COLOR.White100
                            : COLOR.Grey500,
                      },
                    ]}>
                    Distance
                  </Text>
                  <Text
                    style={[
                      styles.modalText,
                      {
                        color:
                          darkMode === 'enable'
                            ? COLOR.White100
                            : COLOR.Grey500,
                      },
                    ]}>
                    {distance} km
                  </Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={500}
                    step={1}
                    value={distance}
                    onValueChange={setDistance}
                    minimumTrackTintColor={COLOR.Primary}
                    maximumTrackTintColor={COLOR.Grey300}
                    thumbTintColor={COLOR.Primary}
                  />
                </View>
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: SPACING.sp10,
                  }}>
                  <TouchableOpacity
                    onPress={closeModal}
                    style={{
                      width: '100%',
                      backgroundColor: COLOR.Primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: RADIUS.rd8,
                    }}>
                    <Text
                      style={[
                        styles.modalCloseButton,
                        {
                          margin: SPACING.sp14,
                          color:
                            darkMode === 'enable'
                              ? COLOR.White100
                              : COLOR.White100,
                        },
                      ]}>
                      Apply Filter
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        transparent={true}
        visible={modalCategoryVisible}
        onRequestClose={closeModalCategory}>
        <TouchableWithoutFeedback onPress={closeModalCategory}>
          <View style={[styles.modalOverlay]}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.modalContainer,
                  {
                    transform: [
                      {
                        translateY: slideAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [layout.height, 0],
                        }),
                      },
                    ],
                  },
                  {
                    backgroundColor:
                      darkMode === 'enable'
                        ? COLOR.DarkThemLight
                        : COLOR.White100,
                  },
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <Image
                      source={
                        darkMode === 'enable'
                          ? IconManager.filter_dark
                          : IconManager.filter_light
                      }
                      style={{width: 16, height: 16, resizeMode: 'contain'}}
                    />
                    <SizedBox width={SPACING.sp8} />
                    <Text
                      style={{
                        fontSize: fontSizes.size19,
                        fontFamily: FontFamily.PoppinSemiBold,
                        color:
                          darkMode === 'enable'
                            ? COLOR.White100
                            : COLOR.Grey500,
                      }}>
                      Filter By Category
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={closeModalCategory}
                    activeOpacity={0.7}>
                    <Image
                      source={
                        darkMode === 'enable'
                          ? IconManager.close_dark
                          : IconManager.close_light
                      }
                      style={{width: 16, height: 16, resizeMode: 'contain'}}
                    />
                  </TouchableOpacity>
                </View>
                <SizedBox height={SPACING.sp12} />
                <View
                  style={{
                    width: '100%',
                    height: 0.5,
                    backgroundColor:
                      darkMode === 'enable' ? COLOR.White100 : COLOR.Grey200,
                  }}
                />
                <View style={{height: flatListHeight}}>
                  <FlatList
                    data={marketCategory}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item}) => (
                      <View
                        style={{
                          backgroundColor:
                            darkMode === 'enable'
                              ? COLOR.White100
                              : COLOR.Grey200,
                        }}>
                        <TouchableOpacity
                          style={{
                            marginBottom: 0.5,
                            backgroundColor:
                              item === selectedCategory
                                ? COLOR.PrimaryBlue50
                                : darkMode === 'enable'
                                ? COLOR.DarkThemLight
                                : COLOR.White100,
                          }}
                          activeOpacity={0.9}
                          onPress={() => {
                            setSelectedCategory(item);
                            closeModalCategory();
                          }}>
                          <Text
                            style={{
                              paddingVertical: SPACING.sp12,
                              fontFamily: FontFamily.PoppinRegular,
                              fontSize: fontSizes.size16,
                              color:
                                item === selectedCategory
                                  ? COLOR.White100
                                  : darkMode === 'enable'
                                  ? COLOR.White100
                                  : COLOR.Grey600,
                            }}>
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    style={{
                      maxHeight: flatListHeight,
                    }}
                  />
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default MarketMain;

const styles = StyleSheet.create({
  buttonLight: {
    backgroundColor: COLOR.Primary,
    borderRadius: SPACING.sp8,
    width: '48%',
    height: SPACING.sp40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextLight: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size12,
    color: COLOR.White,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLOR.White100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalText: {
    fontSize: fontSizes.size16,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  slider: {
    width: Platform.OS === 'android' ? '107%' : '100%',
    height: Platform.OS === 'android' ? 50 : 40, // Adjust height for Android
    marginVertical: 20, // Add vertical margin for spacing
  },
  sliderValueText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  modalCloseButton: {
    textAlign: 'center',
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size16,
  },
});
