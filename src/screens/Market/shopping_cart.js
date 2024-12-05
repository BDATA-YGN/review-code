import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import COLOR from '../../constants/COLOR';
import RADIUS from '../../constants/RADIUS';
import IconManager from '../../assets/IconManager';
import {FontFamily, fontSizes} from '../../constants/FONT';
import SPACING from '../../constants/SPACING';
import SizedBox from '../../commonComponent/SizedBox';
import CustomCheckBox from '../../components/Button/CustomCheckBox';
import CustomRadioButton from '../../components/Radio/CustomRadioButton';
import {useDispatch, useSelector} from 'react-redux';
import {
  buyProduct,
  changeProductQuantity,
  fetchAddress,
  getMarket,
  getMyProduct,
  getPurchased,
  removeFromCart,
} from '../../helper/Market/MarketHelper';
import {formatPrice} from '../../helper/PriceFormat';
import ConfirmationDialog from './MarketHelper/confirmation_dialog';
import SuccessedDialog from './MarketHelper/success_dialog';
import {marketCategory} from '../../constants/CONSTANT_ARRAY';
import AppLoading from '../../commonComponent/Loading';

const ShoppingCart = ({route}) => {
  const navigation = useNavigation();
  const {darkMode} = route.params;
  const [isChecked, setChecked] = useState(false);
  const [codChecked, setCodChecked] = useState(false);
  // Initialize state for quantity with initial value 1
  // const [quantity, setQuantity] = useState(1);
  const [quantities, setQuantities] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false); // State for dialog visibility
  const [isBuyProductDialog, setBuyProductDialog] = useState(false);
  const [successBuyProduct, setSuccessBuyProduct] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isLoading , setLoading] = useState(false);

  const addressList = useSelector(state => state.MarketSlice.addressList);
  const dispatch = useDispatch();

  const checkoutCartList = useSelector(
    state => state.MarketSlice.checkoutCartList,
  );
  const checkedItem = useSelector(state => state.MarketSlice.checkedItem);
  const unitList = useSelector(state => state.MarketSlice.unitList);
  const cartTotalPrice = useSelector(state => state.MarketSlice.cartTotalPrice);
  const fetchCheckoutCartData = useSelector(
    state => state.MarketSlice.fetchCheckoutCartData,
  );

  const findCategoryName = categoryId => {
    const category = marketCategory.find(cat => cat.category_id === categoryId);
    return category ? category.name : null;
  };

  const dummyData = [{data: 'Dummy', id: 1101}];

  const confirmDelete = () => {
    removeFromCart(dispatch, selectedProductId);
    setDialogVisible(false);
  };

  const goToHome = () => {
    setSuccessBuyProduct(false);
    navigation.pop(2);
  };
  const backToShop = () => {
    setSuccessBuyProduct(false);
    navigation.pop(2);
  };

  const confirmBuyProduct = () => {
    // removeFromCart(dispatch, selectedProductId);
    buyProduct(
      dispatch,
      checkedItem.id,
      setBuyProductDialog,
      setSuccessBuyProduct,
      codChecked ? 1 : 0,
      setLoading,
    );
    // setBuyProductDialog(false);
  };

  // Function to handle the increase of quantity
  const increaseQuantity = (item, index) => {
    // setQuantities(prevQuantities => {
    //   const currentQuantity = prevQuantities[item.id] || 1;
    //   if (currentQuantity < item.units) {
    //     const newQuantities = {
    //       ...prevQuantities,
    //       [item.id]: currentQuantity + 1,
    //     };
    //     changeProductQuantity(dispatch, item.id, newQuantities[item.id]);
    //     return newQuantities;
    //   }
    //   return prevQuantities;
    // });
    changeProductQuantity(dispatch, item.id, unitList[index] + 1);
  };

  // Function to handle the decrease of quantity
  const decreaseQuantity = (item, index) => {
    // setQuantities(prevQuantities => {
    //   const newQuantities = {
    //     ...prevQuantities,
    //     [item.id]: prevQuantities[item.id] > 1 ? prevQuantities[item.id] - 1 : 1,
    //   };
    //   // Call the API with the new quantities
    //   changeProductQuantity(dispatch, item.id, newQuantities[item.id]);
    //   return newQuantities;
    // });
    changeProductQuantity(dispatch, item.id, unitList[index] - 1);
  };

  const handleCodPress = () => {
    setCodChecked(!codChecked);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a network request
    // getMarket(dispatch);
    // getMyProduct(dispatch);
    // getPurchased(dispatch);
    fetchAddress(dispatch);
    setTimeout(() => {
      setRefreshing(false);
      // Optionally update your data here
    }, 2000);
  };

  const numColumns = 1;
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = (screenWidth - (numColumns + 1) * 16) / numColumns; // subtracting gaps between items
  const itemWidthEdit = (screenWidth - (numColumns + 1) * 18) / numColumns; // subtracting gaps between items
  const heightToWidthRatio = 175 / 171;
  const itemHeight = itemWidth * heightToWidthRatio;
  const itemHeightEdit = itemWidthEdit * heightToWidthRatio;
  const extractHeight = itemHeight / 2.5;
  const extractHeightEdit = itemHeightEdit / 2.5;

  const renderItem = item => (
    <View
      style={[
        styles.itemCart,
        {
          width: '91%',
          marginHorizontal: 16,
          marginTop: 16,
          height: itemHeight / 3,
          backfaceVisibility: COLOR.Blue50,
          backgroundColor:
            darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White100,
        },
      ]}>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          height: extractHeightEdit / 4,
          //   backgroundColor: 'red',
          backgroundCoalor:
            darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White100,
          borderTopLeftRadius: RADIUS.rd8,
          borderTopRightRadius: RADIUS.rd8,
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: SPACING.sp16,
        }}>
        <Text
          style={{
            fontFamily: FontFamily.PoppinSemiBold,
            fontSize: fontSizes.size16,
            color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
          }}>
          {item.name}
        </Text>
        {/* <View>
          <CustomCheckBox
            value={checkedItemId === item.id}
            darkMode={darkMode}
            onValueChange={() => handleCheckBox(item.id)}
            tintColorTrue={COLOR.Primary}
            tintColorFalse={COLOR.Primary}
          />
        </View> */}
      </View>
      <View
        style={{
          //   flexDirection: 'row',
          width: '100%',
          height: extractHeightEdit / 1.8,
          borderBottomRightRadius: RADIUS.rd8,
          borderBottomLeftRadius: RADIUS.rd8,
          //   backgroundColor: 'pink',
          backgroundColor:
            darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White100,
          justifyContent: 'center',
          paddingHorizontal: SPACING.sp16,
        }}>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: FontFamily.PoppinRegular,
            fontSize: fontSizes.size14,
            color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
          }}>
          {item.phone}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: FontFamily.PoppinRegular,
            fontSize: fontSizes.size14,
            color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
          }}>
          {item.address}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: FontFamily.PoppinRegular,
            fontSize: fontSizes.size14,
            color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
          }}>
          {`${item.country}/${item.city}`}
        </Text>
      </View>
    </View>
  );
  const renderEmptyCartItem = ({item}) => (
    <View
      style={[
        styles.item,
        {
          width: itemWidth,
          height: itemHeight / 3,
          backfaceVisibility: COLOR.Blue50,
        },
      ]}></View>
  );

  const renderScreen = () => (
    <View>
      <View
        style={{
          //if you want full widith and full contents uncomment this
          // height: itemHeight / 2.2,
          //if you want to use square card use this
          // height: itemHeight / 1.82,
          //   borderBottomColor: COLOR.Grey300,
          //   borderBottomWidth: 0.3,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        {checkoutCartList.length > 0 ? (
          <FlatList
            data={checkoutCartList}
            showsHorizontalScrollIndicator={false}
            renderItem={renderCartItem}
            keyExtractor={item => item.id}
            // contentContainerStyle={{paddingLeft: 16}}
          />
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: SPACING.sp16,
            }}>
            <View
              style={{
                width: itemWidth,
                height: itemHeight / 3,
                borderRadius: RADIUS.rd8,
                borderStyle: 'dashed',
                borderWidth: 1.5,
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: COLOR.Primary,
              }}>
              <Image
                source={
                  darkMode === 'enable'
                    ? IconManager.empty_cart_dark
                    : IconManager.empty_cart_light
                }
                style={{width: itemWidth / 5, height: itemHeight / 4}}
              />
            </View>
          </View>
        )}
      </View>
      <View
        style={{
          borderBottomColor: COLOR.Grey300,
          borderBottomWidth: 0.5,
          width: '90%',
          marginHorizontal: 16,
          marginTop: 16,
        }}
      />
      <View>
        <View style={{padding: SPACING.sp16}}>
          <CustomRadioButton
            label={'Cash On Delivery'}
            selected={codChecked}
            textSize={fontSizes.size16}
            onPress={handleCodPress}
            darkMode={darkMode}
          />
        </View>
      </View>
      <View
        style={{
          borderBottomColor: COLOR.Grey300,
          borderBottomWidth: 0.3,
          width: '90%',
          marginHorizontal: 16,
        }}
      />
      {/* <Text
        style={{
          fontFamily: FontFamily.PoppinSemiBold,
          marginTop: 16,
          marginHorizontal: 16,
          fontSize: fontSizes.size16,
          color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
        }}>
        Shopping Details
      </Text> */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('AddressList', {darkMode: darkMode});
        }}
        style={{
          marginTop: 16,
          backgroundColor: COLOR.Primary,
          marginHorizontal: 16,
          borderRadius: RADIUS.rd8,
        }}>
        <View
          style={{
            padding: 12,
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
          <Text
            style={{
              fontFamily: FontFamily.PoppinSemiBold,
              fontSize: fontSizes.size17,
              color: COLOR.White100,
            }}>
            {checkedItem !== null ? 'Choose Another Address' : 'Add Address'}
          </Text>
        </View>
      </TouchableOpacity>
      {checkedItem !== null ? renderItem(checkedItem) : null}
    </View>
  );

  const renderCartItem = ({item, index}) => (
    <View
      style={[
        styles.item,
        {
          width: '100%',
          height: itemHeight / 2.8,
          backfaceVisibility: COLOR.Blue50,
        },
      ]}>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          paddingHorizontal: 8,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Image
          source={{
            uri:
              item.images.length > 0
                ? item.images[0].image
                : IconManager.default_cover,
          }}
          style={{
            height: '90%',
            width: '30%',
            resizeMode: 'cover',
            borderRadius: 8,
            borderColor: 'black',
            borderWidth: 0.3,
          }}
        />
        <View
          style={{
            height: itemHeightEdit / 3,
            width: 'itemHeightEdit - itemHeightEdit / 2.88',
            borderRadius: 8,
          }}>
          <View
            style={{
              justifyContent: 'space-between',
              width: itemHeightEdit - itemHeightEdit / 2.88,
              height: itemHeightEdit / 3 / 1.5,
              borderRadius: 8,
              flexDirection: 'row',
            }}>
            <View
              style={{
                // backgroundColor: 'red',
                paddingHorizontal: 4,
                width: (itemHeightEdit - itemHeightEdit / 2.88) / 1.25,
                borderRadius: 8,
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: FontFamily.PoppinRegular,
                  fontSize: fontSizes.size15,
                  color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                }}>
                {item.name}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: FontFamily.PoppinRegular,
                  fontSize: fontSizes.size15,
                  color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                }}>
                {`${findCategoryName(item.category)}`}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: FontFamily.PoppinRegular,
                  fontSize: fontSizes.size12,
                  color: darkMode === 'enable' ? COLOR.Grey100 : COLOR.Grey500,
                }}>
                {`${item.units} items left`}
              </Text>
            </View>
            <View
              style={{
                // backgroundColor: 'red',
                marginTop: 4,
                paddingHorizontal: 4,
                width: (itemHeightEdit - itemHeightEdit / 2.88) / 5,
                borderRadius: 8,
                alignItems: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedProductId(item.id);
                  setDialogVisible(true);
                }}
                activeOpacity={0.7}>
                <Image
                  source={
                    darkMode === 'enable'
                      ? IconManager.delete_dark
                      : IconManager.delete_light
                  }
                  style={{width: 22, height: 22, resizeMode: 'contain'}}
                />
              </TouchableOpacity>
            </View>
            <View></View>
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              width: itemHeightEdit - itemHeightEdit / 2.88,
              height: itemHeightEdit / 3 / 3,
              borderRadius: 8,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <View
              style={{
                // backgroundColor: 'red',
                paddingHorizontal: 4,
                width: (itemHeightEdit - itemHeightEdit / 2.88) / 2,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: FontFamily.PoppinRegular,
                  fontSize: fontSizes.size17,
                  color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                }}>
                {`QTY : `}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={{backgroundColor: COLOR.Primary, borderRadius: 4}}
                  onPress={() => decreaseQuantity(item, index)} // Attach the decrease function
                >
                  <Image
                    source={IconManager.decrease_icon}
                    style={{
                      width: 10,
                      height: 10,
                      margin: 4,
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: FontFamily.PoppinRegular,
                    fontSize: fontSizes.size17,
                    color:
                      darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                  }}>
                  {/* {`  ${quantities[item.id] || 1}  `} */}
                  {`  ${unitList[index]}  `}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={{backgroundColor: COLOR.Primary, borderRadius: 4}}
                  onPress={() => increaseQuantity(item, index)} // Attach the increase function
                >
                  <Image
                    source={IconManager.increase_icon}
                    style={{
                      width: 10,
                      height: 10,
                      margin: 4,
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                paddingHorizontal: 4,
                width: (itemHeightEdit - itemHeightEdit / 2.88) / 2,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'flex-end',
                alignSelf: 'center',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: FontFamily.PoppinRegular,
                    fontSize: fontSizes.size15,
                    color:
                      darkMode === 'enable' ? COLOR.Primary : COLOR.Primary,
                  }}>
                  {`Ks `}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: FontFamily.PoppinRegular,
                    fontSize: fontSizes.size15,
                    color:
                      darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                  }}>
                  {formatPrice(item.price)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
      }}>
      <ConfirmationDialog
        headerLable={'Remove Item'}
        visible={dialogVisible}
        onConfirm={confirmDelete}
        onCancel={() => setDialogVisible(false)}
        darkMode={darkMode}
        lableText={'Are you sure you want to remove this item?'}
        buttonOne={'Cancel'}
        buttonTwo={'Remove'}
      />

      <ConfirmationDialog
        headerLable={'Buy Products'}
        visible={isBuyProductDialog}
        onConfirm={confirmBuyProduct}
        onCancel={() => setBuyProductDialog(false)}
        darkMode={darkMode}
        lableText={'Are you sure you want to buy this products?'}
        buttonOne={'Cancel'}
        buttonTwo={'Buy'}
      />

      <SuccessedDialog
        headerLabel={'Success'}
        visible={successBuyProduct}
        goToHome={goToHome}
        backToShop={backToShop}
        darkMode={darkMode}
        labelText={'Buy Product Successfully'}
        buttonOne={'Home'}
        buttonTwo={'Back To Shop'}
      />
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
          Carts
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          style={{}}
          onPress={
            (checkedItem !== null ? checkedItem.id : null) !== null &&
            // codChecked &&
            checkoutCartList.length > 0
              ? () => {
                  setBuyProductDialog(true);
                }
              : null
          }>
          <Text
            style={{
              margin: SPACING.sp16,
              //   backgroundColor: COLOR.Primary,
              fontFamily: FontFamily.PoppinRegular,
              fontSize: fontSizes.size16,
              color:
                darkMode === 'enable'
                  ? (checkedItem !== null ? checkedItem.id : null) !== null &&
                    codChecked &&
                    checkoutCartList.length > 0
                    ? COLOR.Primary
                    : COLOR.White100
                  : (checkedItem !== null ? checkedItem.id : null) !== null &&
                    codChecked &&
                    checkoutCartList.length > 0
                  ? COLOR.Primary
                  : COLOR.Grey500,
            }}>
            Buy
          </Text>
        </TouchableOpacity>
      </View>
      <SizedBox height={8} />

      <FlatList
        data={dummyData}
        renderItem={renderScreen}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id}
        contentContainerStyle={{paddingBottom: 16}} // Added paddingBottom
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {width: 0, height: -0.1},
          shadowOpacity: 0.3,
          shadowRadius: 2,
          elevation: 5,
          backgroundColor:
            darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White100,
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontFamily: FontFamily.PoppinSemiBold,
              fontSize: fontSizes.size16,
              margin: 16,
              color: darkMode === 'enable' ? COLOR.White100 : COLOR.Primary,
            }}>
            Total
          </Text>
          <Text
            style={{
              fontFamily: FontFamily.PoppinSemiBold,
              fontSize: fontSizes.size16,
              color: darkMode === 'enable' ? COLOR.White100 : COLOR.Primary,
            }}>
            {`${formatPrice(cartTotalPrice)} Ks`}
          </Text>
        </View>
      </View>

      {isLoading &&  <AppLoading/>}
    </SafeAreaView>
  );
};

export default ShoppingCart;

const styles = StyleSheet.create({
  item: {
    // backgroundColor: COLOR.Blue50,
    justifyContent: 'center',
    alignItems: 'center',
    // flex: 1,
    borderRadius: RADIUS.rd8,
    paddingHorizontal: 8,
  },
  itemCart: {
    // backgroundColor: COLOR.Blue50,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderRadius: RADIUS.rd8,
    padding: 8,
    borderWidth: 0.3,
    borderColor: COLOR.Primary,
  },
  title: {
    fontSize: 16,
    color: COLOR.White100,
    textAlign: 'center',
    marginTop: 8,
  },
});
