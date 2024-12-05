import React, {useEffect, useRef, useState} from 'react';
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
  useWindowDimensions,
  RefreshControl,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import COLOR from '../../constants/COLOR';
import RADIUS from '../../constants/RADIUS';
import IconManager from '../../assets/IconManager';
import {FontFamily, fontSizes} from '../../constants/FONT';
import SPACING from '../../constants/SPACING';
import ProductEmptyScreen from './product_empty_screen';
import {useDispatch, useSelector} from 'react-redux';
import {
  addMarketItem,
  setFetchMyProductsData,
} from '../../stores/slices/market_slice';
import {formatPrice} from '../../helper/PriceFormat';
import CustomListModal from './MarketHelper/custom_list_modal';
import {marketCategory} from '../../constants/CONSTANT_ARRAY';
import {
  fetchAddress,
  filetrMarketList,
  filterMyProductList,
  getChekcoutCartList,
  getMyProduct,
} from '../../helper/Market/MarketHelper';
import LoadingDots from './MarketHelper/loading_dots';
import { getMarket } from '../../helper/Market/MarketHelper';
import SearchTextInput from '../../components/TextInputBox/SearchTextInput';
import { submitGetCurrencies } from '../../helper/ApiModel';


const MyProduct = ({route}) => {
  const navigation = useNavigation();
  const {darkMode , currencies} = route.params;

  const dispatch = useDispatch();

  const layout = useWindowDimensions();
  const [modalCategoryVisible, setModalCategoryVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const slideAnim = useState(new Animated.Value(0))[0];
  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight / 1.5;
  const emptyMessage = useSelector(state => state.MarketSlice.emptyMessage);
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
      // filterMyProductList(dispatch, handleCategory());
    });
  };


 
  


  const handleSearch = () => {
 
    filterMyProductList(dispatch, selectedCategory?.category_id , searchText)
    // filetrMarketList(dispatch, selectedCategory?.category_id  , searchText)
  }

  const handleClearInput = () => {
    setSearchText("");
    // filetrMarketList(dispatch, selectedCategory?.category_id  , "")
    filterMyProductList(dispatch, selectedCategory.category_id , "")
  }
  const onRefresh = () => {
    if(selectedCategory) {
      filterMyProductList(dispatch, selectedCategory.category_id, searchText)
     }else {
       getMyProduct(dispatch)
     }
    fetchAddress(dispatch);
    getChekcoutCartList(dispatch);
    setTimeout(() => {}, 2000); // Simulated delay for refreshing
  };

  const myProductsList = useSelector(state => state.MarketSlice.myProductsList);
  const checkoutCartList = useSelector(
    state => state.MarketSlice.checkoutCartList,
  );
  const fetchMyProductsData = useSelector(
    state => state.MarketSlice.fetchMyProductsData,
  );



  const numColumns = 2;
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = (screenWidth - (numColumns + 1) * 16) / numColumns; // subtracting gaps between items
  const heightToWidthRatio = 175 / 171;
  const itemHeight = itemWidth * heightToWidthRatio;

  const adjustedMyProductList =
    myProductsList.length % 2 !== 0
      ? [...myProductsList, {id: 'disable_container'}]
      : myProductsList;

  const renderItem = ({item, index}) => {
    if (item.id === 'disable_container') {
      return (
        <View
          style={{
            width: itemWidth,
            height: itemHeight,
            backgroundColor: 'transparent',
          }}
        />
      );
    }

    const isLastItem =
      index === adjustedMyProductList.length - 2 &&
      myProductsList.length % 2 !== 0;

    const itemStyle = isLastItem
      ? {width: itemWidth, height: itemHeight}
      : {width: itemWidth, height: itemHeight};

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          navigation.navigate('ProductDetails', {
            darkMode: darkMode,
            product: item,
            currencies : currencies,
          });
        }}>
        <View style={[styles.item, itemStyle]}>
          <Image
            source={{uri: item.images[0].image}}
            style={{
              width: itemStyle.width,
              height: itemStyle.height - itemStyle.height / 3,
              borderTopLeftRadius: RADIUS.rd16,
              borderTopRightRadius: RADIUS.rd16,
            }}
          />
          <View
            style={{
              width: itemStyle.width,
              height: itemStyle.height / 3,
              backgroundColor: COLOR.Primary,
              borderBottomLeftRadius: RADIUS.rd16,
              borderBottomRightRadius: RADIUS.rd16,
              justifyContent: 'center',
            }}>
            <View style={{marginHorizontal: SPACING.sp8}}>
              <Text
                numberOfLines={1}
                style={{
                  color: COLOR.White100,
                  fontFamily: FontFamily.PoppinRegular,
                  fontSize: fontSizes.size14,
                }}>
                {item.name}
              </Text>
              <Text
                style={{
                  color: COLOR.White100,
                  fontFamily: FontFamily.PoppinRegular,
                  fontSize: fontSizes.size12,
                }}>
                {currencies?.[item?.currency]?.currency ? `${formatPrice(item?.price)} ${currencies[item?.currency].currency}` : ''}

              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
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
          Products
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
          {selectedCategory ? (<Image
          source={
            darkMode === 'enable'
              ? IconManager.filtered_light
              : IconManager.filtered_light
          }
          style={styles.icon}
        />) :  (<Image
          source={
            darkMode === 'enable'
              ? IconManager.filter_dark
              : IconManager.filter_light
          }
          style={styles.icon}
        />)}
        
      </TouchableOpacity>
       
      </View>
      
      {fetchMyProductsData ? (
        <LoadingDots darkMode={darkMode} />
      ) : myProductsList.length > 0 ? (
        <FlatList
          data={adjustedMyProductList}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{gap: 16, padding: 16}}
          columnWrapperStyle={{gap: 16}}
          numColumns={numColumns}
          refreshControl={
            <RefreshControl
              refreshing={fetchMyProductsData}
              onRefresh={onRefresh}
            />
          }
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
        filerType={'MY_MARKET'}
        keyword={searchText}
      />
    </SafeAreaView>
  );
};

export default MyProduct;

const styles = StyleSheet.create({
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
