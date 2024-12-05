import React, {useCallback, useEffect, useId, useRef, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  View,
  Text,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
  RefreshControl,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import COLOR from '../../constants/COLOR';
import RADIUS from '../../constants/RADIUS';
import IconManager from '../../assets/IconManager';
import {FontFamily, fontSizes} from '../../constants/FONT';
import SPACING from '../../constants/SPACING';
import ProductEmptyScreen from './product_empty_screen';
import {useDispatch, useSelector} from 'react-redux';
import {
  addMarketItem,
  setFetchOrderedList,
} from '../../stores/slices/market_slice';
import {formatPrice} from '../../helper/PriceFormat';
import {
  fetchAddress,
  fetchCredentialData,
  fetchOrderList,
  filetrMarketList,
  filterOrderedList,
  getChekcoutCartList,
} from '../../helper/Market/MarketHelper';
import CustomListModal from './MarketHelper/custom_list_modal';
import {marketCategory} from '../../constants/CONSTANT_ARRAY';
import LoadingDots from './MarketHelper/loading_dots';
import {timeFormat} from '../../helper/Formatter';
import SearchTextInput from '../../components/TextInputBox/SearchTextInput';

const OrderedList = ({route}) => {
  const navigation = useNavigation();
  const {darkMode} = route.params;
  const dispatch = useDispatch();
  const orderedList = useSelector(state => state.MarketSlice.orderedList);
  const emptyMessage = useSelector(state => state.MarketSlice.emptyMessage);
  const fetchOrderedList = useSelector(
    state => state.MarketSlice.fetchOrderedList,
  );
  const checkoutCartList = useSelector(
    state => state.MarketSlice.checkoutCartList,
  );
  const layout = useWindowDimensions();
  const [modalCategoryVisible, setModalCategoryVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const slideAnim = useState(new Animated.Value(0))[0];
  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight / 1.5;
  const numColumns = 1;
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = (screenWidth - (numColumns + 1) * 16) / numColumns; // subtracting gaps between items
  const heightToWidthRatio = 175 / 171;
  const itemHeight = itemWidth * heightToWidthRatio;
  const extractHeight = itemHeight / 1.7;
  const [searchText , setSearchText] = useState("");
  
  const openModal = () => {
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
      setModalCategoryVisible(false);
      // filetrMarketList(dispatch, handleCategory());
    });
  };

  const handleSearch = () => {
  
    filterOrderedList(dispatch, selectedCategory?.category_id  , searchText)
  }

  useFocusEffect(
    
    useCallback(() => {
      // Call your API or dispatch your action to refresh the data
      fetchOrderList(dispatch); // Assuming fetchOrders is your action to load orders

      // Optionally clean up any listeners or other side effects when the screen loses focus
      return () => {
        // Cleanup if necessary
      };
    }, [dispatch]) // Adding dispatch as a dependency ensures it doesn't recreate the function unnecessarily
  );

  const handleClearInput = () => {
    setSearchText("");
    filterOrderedList(dispatch, selectedCategory?.category_id  , "")
  }
  const onRefresh = () => {
 
    if (selectedCategory) {
      filterOrderedList(dispatch, selectedCategory.category_id , searchText);
    } else {
      fetchOrderList(dispatch);
    }
    fetchAddress(dispatch);
    getChekcoutCartList(dispatch);
    setTimeout(() => {}, 2000); // Simulated delay for refreshing
  };

  // useEffect(() => {
  //   fetchOrderList(dispatch);
  // }, []);

  const renderItem = ({item, index}) => {
    console.log(item);
    
    return (
      <View
        style={[
          styles.card_view,
          {
            backgroundColor:
              darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White100,
          },
        ]}>
        <View style={{gap: 8}}>
          <Text
            style={[
              styles.invoiceNoStyle,
              {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Primary},
            ]}>{`#${item.order_hash_id}`}</Text>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Image
              source={{
                uri: item.orders[0].product.images[0].image,
              }}
              style={[
                styles.image,
                {flex: 1, marginRight: 8, resizeMode: 'contain'},
              ]}
            />
            <View
              style={{
                flex: 3.2,
                gap: 4,
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}>
              <Text
                style={[
                  styles.header,
                  {
                    color:
                      darkMode === 'enable' ? COLOR.White100 : COLOR.Grey900,
                  },
                ]}>
                {item.orders[0].product.name}
              </Text>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Text
                  style={[
                    styles.body,
                    {
                      flex: 0.9,
                      color:
                        darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    },
                  ]}>
                  Price
                </Text>
                <Text
                  style={[
                    styles.body,
                    {
                      flex: 0.5,
                      color:
                        darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    },
                  ]}>
                  :
                </Text>
                <Text
                  style={[
                    styles.body,
                    {
                      flex: 3,
                      color:
                        darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    },
                  ]}>
                  {formatPrice(item.price)}
                </Text>
              </View>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Text
                  style={[
                    styles.body,
                    {
                      flex: 0.9,
                      color:
                        darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    },
                  ]}>
                  Time
                </Text>
                <Text
                  style={[
                    styles.body,
                    {
                      flex: 0.5,
                      color:
                        darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    },
                  ]}>
                  :
                </Text>
                <Text
                  style={[
                    styles.body,
                    {
                      flex: 3,
                      color:
                        darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    },
                  ]}>
                  {timeFormat(item.time)}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('OrderedDetails', {
                darkMode: darkMode,
                data: item,
              });
            }}
            activeOpacity={0.8}
            style={styles.button}>
            <Text style={[styles.header, {color: COLOR.White100}]}>Detail</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
          Orders
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
                      darkMode === 'enable' ? COLOR.White100 : COLOR.White100, // Adjust as needed
                  }}>
                  {`${checkoutCartList.length}`}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row' , justifyContent : 'space-between' , gap : 12 , marginTop  : 8 , paddingHorizontal : 16}}>

        <View style = {{flex : 1}}>
          <SearchTextInput 
          searchText={searchText}
          setSearchText={setSearchText}
          handleSearch={handleSearch}
          handleClearInput={handleClearInput}
          darkMode={darkMode}
          />
        </View>

        <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          openModal();
        }}
        style={{
          // justifyContent: 'flex-end',
          // alignItems: 'flex-end',
          // width: '100%',
          backgroundColor:
            darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.Grey50,
        }}>
        {selectedCategory ? (
          <Image
            source={
              darkMode === 'enable'
                ? IconManager.filtered_light
                : IconManager.filtered_light
            }
            style={styles.icon}
          />
        ) : (
          <Image
            source={
              darkMode === 'enable'
                ? IconManager.filter_dark
                : IconManager.filter_light
            }
            style={styles.icon}
          />
        )}
      </TouchableOpacity>
      </View>
      
      {fetchOrderedList ? (
        <LoadingDots darkMode={darkMode} />
      ) : orderedList === null ? (
        <ProductEmptyScreen
          darkMode={darkMode}
          image={
            darkMode === 'enable'
              ? IconManager.product_empty_dark
              : IconManager.product_empty_light
          }
          header=""
          body="No items found for the selected category."
          onReload={onRefresh}
        />
      ) : orderedList.length > 0 ? (
        <FlatList
          data={orderedList}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{gap: 16, padding: 16}}
          refreshControl={
            <RefreshControl
              refreshing={fetchOrderedList}
              onRefresh={onRefresh}
            />
          }
          //   columnWrapperStyle={{gap: 16}}
        />
      ) : (
        <ProductEmptyScreen
          darkMode={darkMode}
          image={
            darkMode === 'enable'
              ? IconManager.product_empty_dark
              : IconManager.product_empty_light
          }
          header=""
          body={emptyMessage}
          onReload={onRefresh}
        />
      )}
       <CustomListModal
        visible={modalCategoryVisible}
        closeModal={closeModal}
        darkMode={darkMode}
        marketCategory={marketCategory}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        flatListHeight={modalHeight} // You can adjust this as needed
        slideAnim={slideAnim}
        layout={layout}
        iconPrefixDark={IconManager.filter_dark}
        iconPrefixLight={IconManager.filter_light}
        iconPostfixDark={IconManager.close_dark}
        iconPostfixLight={IconManager.close_light}
        title={'Filter By Category'}
        dispatch={dispatch}
        filerType={'MY_ORDER'}
        keyword={searchText}
      />
    </SafeAreaView>
  );
};

export default OrderedList;

const styles = StyleSheet.create({
  button: {
    padding: 6,
    backgroundColor: COLOR.Primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  header: {
    fontSize: fontSizes.size14,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  body: {
    fontSize: fontSizes.size14,
    fontFamily: FontFamily.PoppinRegular,
  },
  image: {
    width: 75,
    height: 75,
    borderWidth: 0.3,
    borderColor: COLOR.Primary,
  },
  card_view: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 0.3,
    borderColor: COLOR.Primary,
  },
  invoiceNoStyle: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size12,
    color: COLOR.Primary,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginTop: 8,
    marginRight: 16,
  },
  item: {
    backgroundColor: COLOR.Primary,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderRadius: RADIUS.rd16,
    padding: 8,
  },
  title: {
    fontSize: 16,
    color: COLOR.White100,
    textAlign: 'center',
    marginTop: 8,
  },
});

