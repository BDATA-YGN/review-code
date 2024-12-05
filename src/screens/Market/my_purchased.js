import React, {useRef, useEffect, useState, useCallback} from 'react';
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
  Modal,
  Platform,
  Alert,
  useWindowDimensions,
  RefreshControl,
  ActivityIndicator, // Import Modal from react-native
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import COLOR from '../../constants/COLOR';
import RADIUS from '../../constants/RADIUS';
import IconManager from '../../assets/IconManager';
import {FontFamily, fontSizes} from '../../constants/FONT';
import SPACING from '../../constants/SPACING';
import ProductEmptyScreen from './product_empty_screen';
import {useDispatch, useSelector} from 'react-redux';
import {formatPrice} from '../../helper/PriceFormat';
import SizedBox from '../../commonComponent/SizedBox';
import {timeFormat} from '../../helper/Formatter';
import InvoiceViewShot from './invoice_view_shot';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';
import CustomToast from './MarketHelper/custom_toast';
import SuccessedDialogNoAction from './MarketHelper/success_dialog_no_action';
import {
  fetchAddress,
  filetrMarketList,
  filterPurchasedList,
  getChekcoutCartList,
  getPurchased,
  sendInvoice,
} from '../../helper/Market/MarketHelper';
import CustomListModal from './MarketHelper/custom_list_modal';
import {marketCategory} from '../../constants/CONSTANT_ARRAY';
import LoadingDots from './MarketHelper/loading_dots';
import {
  setFetchMyProductsData,
  setFetchPurchasedData,
} from '../../stores/slices/market_slice';
import SearchTextInput from '../../components/TextInputBox/SearchTextInput';

const MyPurchased = ({route}) => {
  const navigation = useNavigation();
  const {darkMode} = route.params;
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const viewShotRef = useRef();
  const dispatch = useDispatch();

  const purchasedList = useSelector(state => state.MarketSlice.purchasedList);
  const isSendInvoiceMail = useSelector(
    state => state.MarketSlice.isSendInvoiceMail,
  );
  const checkoutCartList = useSelector(
    state => state.MarketSlice.checkoutCartList,
  );
  const fetchPurchasedData = useSelector(
    state => state.MarketSlice.fetchPurchasedData,
  );

  const [toastVisible, setToastVisible] = useState(false);
  const [loadingStates, setLoadingStates] = useState({}); // Track loading state for each item
  const [isDialogVisible, setDialogVisible] = useState(false);
  const layout = useWindowDimensions();
  const [modalCategoryVisible, setModalCategoryVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchText , setSearchText] = useState("");
  const slideAnim = useState(new Animated.Value(0))[0];
  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight / 1.5;
  const handleShowDialog = () => {
    setDialogVisible(true);
  };
  const handleCloseDialog = () => {
    setDialogVisible(false);
    // navigation.goBack();
  };
  const sendInvoiceToMail = async orderHashId => {
    try {
      setLoadingStates(prev => ({...prev, [orderHashId]: true})); // Start loading
      await sendInvoice(dispatch, orderHashId, handleShowDialog); // Assuming sendInvoice returns a Promise
    } finally {
      setLoadingStates(prev => ({...prev, [orderHashId]: false})); // Stop loading
    }
  };

  const handleClearInput = () => {
    setSearchText("");
    filterPurchasedList(dispatch, selectedCategory?.category_id  , "")
  }

  const handleSearch = () => {
    filterPurchasedList(dispatch, selectedCategory?.category_id , searchText);
  }

  useFocusEffect(
    
    useCallback(() => {
      // Call your API or dispatch your action to refresh the data
      console.log('useFoucs');
      
      getPurchased(dispatch); // Assuming fetchOrders is your action to load orders

      // Optionally clean up any listeners or other side effects when the screen loses focus
      return () => {
        // Cleanup if necessary
      };
    }, [dispatch]) // Adding dispatch as a dependency ensures it doesn't recreate the function unnecessarily
  );

  const onRefresh = () => {
    if (selectedCategory) {
      console.log(selectedCategory.category_id , searchText);
      
      filterPurchasedList(dispatch, selectedCategory.category_id , searchText);
    } else {
      getPurchased(dispatch);
    }
    fetchAddress(dispatch);
    getChekcoutCartList(dispatch);
    setTimeout(() => {}, 2000); // Simulated delay for refreshing
  };

  const showToast = () => {
    setToastVisible(true);
    // Hide the toast after the duration
    setTimeout(() => {
      setToastVisible(false);
    }, 2000); // Match this with the duration prop if needed
  };
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
  useEffect(() => {
    // Alert.alert('My Market', `My Market Length => ${marketList.length}`);
  }, []);

  const numColumns = 1;
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = (screenWidth - (numColumns + 1) * 16) / numColumns; // subtracting gaps between items
  const heightToWidthRatio = 175 / 171;
  const itemHeight = itemWidth * heightToWidthRatio;
  const extractHeight = itemHeight / 1.7;
  const emptyMessage = useSelector(state => state.MarketSlice.emptyMessage);

  const openInvoiceModal = product => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const closeInvoiceModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const saveScreenShot = () => {
    captureScreen();
  };

  const captureScreen = () => {
    // setIsSaving(true);
    viewShotRef.current.capture().then(uri => {
      saveToGallery(uri).then(value => {
        setModalVisible(false);
        setSelectedProduct(null);
        showToast();
      });
    });
  };

  const saveToGallery = async uri => {
    try {
      if (Platform.OS === 'ios') {
        const result = await CameraRoll.save(uri, {type: 'photo'});
        return result;
      } else {
        const dirPath = `${RNFS.PicturesDirectoryPath}/MySpace`;
        const timestamp = new Date().getTime();
        const newPath = `${dirPath}/invoice_${timestamp}.jpg`;
        const dirExists = await RNFS.exists(dirPath);
        if (!dirExists) {
          await RNFS.mkdir(dirPath);
        }
        await RNFS.moveFile(uri, newPath);
        return newPath;
      }
    } catch (error) {
      // setIsSaving(false);
      console.error('Failed to save the screenshot:', error);
      // handleOpenWarning();
    }
  };

  const renderItem = ({item}) => {
    
    const isLoading = loadingStates[item.order_hash_id];
    return (
      <View style={[styles.item, {width: itemWidth, height: extractHeight}]}>
        <View
          style={{
            width: itemWidth,
            height: extractHeight / 6,
            backgroundColor: COLOR.Primary,
            borderTopLeftRadius: RADIUS.rd8,
            borderTopRightRadius: RADIUS.rd8,
            justifyContent: 'center',
          }}>
          <View style={{marginHorizontal: SPACING.sp16}}>
            <Text
              numberOfLines={1}
              style={{
                color: COLOR.White100,
                fontFamily: FontFamily.PoppinSemiBold,
                fontSize: fontSizes.size16,
              }}>
              {item.data.name}
            </Text>
          </View>
        </View>
        <View
          style={{
            width: itemWidth,
            height: (extractHeight / 6) * 3.5,
            backgroundColor: COLOR.Primary,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}>
          <Image
            source={{
              uri:
                item.orders.length > 0 &&
                item.orders[0].product.images.length > 0
                  ? item.orders[0].product.images[0].image
                  : null,
            }}
            style={{
              width: itemWidth - 32,
              borderWidth: 0.5,
              borderColor: COLOR.White100,
              height: (extractHeight / 6) * 3.5,
              borderRadius: RADIUS.rd8,
            }}
          />
          <Text
            style={{
              position: 'absolute',
              bottom: 8,
              left: itemWidth - (itemWidth - 24),
              color: COLOR.White100,
              fontFamily: FontFamily.PoppinRegular,
              textAlign: 'center',
              fontSize: fontSizes.size14,
              backgroundColor: 'rgba(0, 0, 0, 0.3)', // To make the text more readable
              padding: 4, // To add some padding around the text
              borderRadius: RADIUS.rd6, // To give rounded corners to the text background
              overflow: 'hidden', // Ensures borderRadius is applied correctly
            }}>
            {`Ks ${item.price}`}
          </Text>
        </View>
        <View
          style={{
            width: itemWidth,
            height: (extractHeight / 6) * 1.5,
            backgroundColor: COLOR.Primary,
            justifyContent: 'center',
            borderBottomLeftRadius: RADIUS.rd8,
            borderBottomRightRadius: RADIUS.rd8,
          }}>
          <View
            style={{
              marginHorizontal: SPACING.sp16,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                width: '55%',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  color: COLOR.White100,
                  fontFamily: FontFamily.PoppinRegular,
                  fontSize: fontSizes.size14,
                  width: '55%',
                }}>
                {`#${item.order_hash_id}`}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  color: COLOR.White100,
                  fontFamily: FontFamily.PoppinRegular,
                  fontSize: fontSizes.size14,
                  width: '45%',
                  textAlign: 'right',
                }}>
                {timeFormat(item.time)}
              </Text>
            </View>
            <View
              style={{
                width: '40%',
                alignItems: 'center',
                justifyContent: 'flex-end',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                // onPress={() => {
                //   navigation.navigate('ProductInvoice', {
                //     product: item,
                //     darkMode: darkMode,
                //   });
                // }}

                onPress={() => {
                  navigation.navigate('PurchasedDetail', {
                    data: item,
                    darkMode: darkMode,
                  });
                }}
                activeOpacity={0.7}
                style={{
                  backgroundColor: COLOR.PrimaryBlue50,
                  height: extractHeight / 9,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: RADIUS.rd6,
                  shadowColor: COLOR.Grey500,
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}>
                <Text
                  style={{
                    marginHorizontal: 8,
                    color: COLOR.White100,
                    fontSize: fontSizes.size14,
                    fontFamily: FontFamily.PoppinRegular,
                  }}>
                  View
                </Text>
              </TouchableOpacity>

              <SizedBox width={8} />
              <TouchableOpacity
                activeOpacity={0.7}
                // onPress={() => {
                //   sendInvoiceToMail(item.order_hash_id);
                // }}
                onPress={() => {
                  navigation.navigate('ProductInvoice', {
                    product: item,
                    darkMode: darkMode,
                  });
                }}
                style={{
                  backgroundColor: COLOR.PrimaryBlue50,
                  height: extractHeight / 9,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: RADIUS.rd6,
                }}>
                {isLoading ? (
                  <View style={{paddingHorizontal: 10}}>
                    <ActivityIndicator
                      color={
                        darkMode === 'enable' ? COLOR.White100 : COLOR.White100
                      }
                    />
                  </View>
                ) : (
                  <Image
                    source={IconManager.invoiceIcon}
                    style={{
                      width: extractHeight / 14,
                      height: extractHeight / 14,
                      marginHorizontal: 12,
                      resizeMode: 'contain',
                    }}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
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
      <SuccessedDialogNoAction
        headerLabel="Invoice"
        visible={isDialogVisible}
        onButtonPress={handleCloseDialog}
        darkMode={darkMode}
        labelText="We have sent you an email, Please check your inbox/spam."
        buttonText="OK"
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
          Purchased
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
    
      {/* <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          openModal();
        }}
        style={{
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          width: '100%',
          backgroundColor:
            darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.Grey50,
        }}>
        <Image
          source={
            darkMode === 'enable'
              ? IconManager.filter_dark
              : IconManager.filter_light
          }
          style={styles.icon}
        />
      </TouchableOpacity> */}
      <CustomToast
        message="Successfully saved."
        visible={toastVisible}
        onHide={() => {}}
        duration={2000} // Optional, default is 2000ms
      />
      {fetchPurchasedData ? (
        <LoadingDots darkMode={darkMode} />
      ) : purchasedList === null ? (
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
      ) : purchasedList.length > 0 ? (
        <FlatList
          data={purchasedList}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{gap: 16, padding: 16}}
          refreshControl={
            <RefreshControl
              refreshing={fetchPurchasedData}
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

      {/* Modal to display InvoiceViewShot */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeInvoiceModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <InvoiceViewShot
              ref={viewShotRef}
              darkMode={darkMode}
              product={selectedProduct}
              isAdjust={true}
              onClose={closeInvoiceModal}
            />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                onPress={closeInvoiceModal}
                style={{
                  width: '50%',
                  backgroundColor: COLOR.PrimaryBlue50,
                  borderBottomLeftRadius: RADIUS.rd16,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: COLOR.White100,
                    fontSize: fontSizes.size14,
                    fontFamily: FontFamily.PoppinRegular,
                    paddingVertical: SPACING.sp12,
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={saveScreenShot}
                style={{
                  width: '50%',
                  backgroundColor: COLOR.Primary,
                  borderBottomRightRadius: RADIUS.rd16,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: COLOR.White100,
                    fontSize: fontSizes.size14,
                    fontFamily: FontFamily.PoppinRegular,
                    paddingVertical: SPACING.sp12,
                  }}>
                  Send
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
        filerType={'MY_PURCHASED'}
        keyword={searchText}
      />
    </SafeAreaView>
  );
};

export default MyPurchased;

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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    height: '60%',
    backgroundColor: COLOR.White100,
    borderRadius: RADIUS.rd16,
    // borderTopLeftRadius: RADIUS.rd16,
    // borderTopRightRadius: RADIUS.rd16,
    // padding: 16,
    alignItems: 'center',
  },
});
