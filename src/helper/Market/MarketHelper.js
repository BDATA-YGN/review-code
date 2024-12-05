// marketActions.js

import {
  buyRequest,
  deleteAddress,
  deleteProduct,
  fetchAllPurchased,
  filterProduct,
  filterPurchased,
  getFilterOrderList,
  getJoinedGroupList,
  getMyProductList,
  getOrderedList,
  getPageList,
  getReactionTypeList,
  requestAddToCart,
  requestAddress,
  requestChangeAddToCartQty,
  requestChangeProductQty,
  requestCheckoutCartList,
  requestMyProduct,
  requestPost,
  requestProduct,
  requestPurchase,
  requestSendInvoice,
  submitAddress,
  submitDeleteCart,
  updateAddress,
  updateProduct,
} from './MarketModal';
import {retrieveJsonData, retrieveStringData, storeKeys} from '../AsyncStorage';
import {setLoading} from '../../stores/slices/MydaySlice';
import {
  setFetchMarketData,
  setMarketList,
  setFetchMyProductsData,
  setMyProductsList,
  setFetchPurchasedData,
  setPurchasedList,
  setFetchAddressData,
  setAddressList,
  setFetchCheckoutCartData,
  setCheckoutCartList,
  setCartTotalPrice,
  setUnitList,
  setEmojiList,
  setFetchEmojiList,
  setFetchPostById,
  setPostData,
  setFetchGroupList,
  setGroupList,
  setFetchPageList,
  setPageList,
  setUserInfoData,
  setCheckedItem,
  setDarkTheme,
  setFetchOrderedList,
  setOrderedList,
  setEmptyMessage,
  setIsSendInvoiceMail,
  filteredMarketList,
} from '../../stores/slices/market_slice';
import {Alert, Linking, Platform} from 'react-native';
import RNFS from 'react-native-fs';
import {logJsonData} from '../LiveStream/logFile';



export const getMarket = async (dispatch, limit , offset = 0) => {
  try {

    dispatch(setFetchMarketData(true));
    const response = await requestProduct(limit , offset);
    if (response.api_status === 200) {
      dispatch(setMarketList(response.products));
      dispatch(setFetchMarketData(false)); // Update fetch status after delay
    } else {
      Alert.alert('Warning!', 'Getting unknown status.');
    }
  } catch (error) {
    dispatch(setFetchMarketData(false));
    dispatch(setEmptyMessage('Network Error!.Please try again.'));
  } finally {
    dispatch(setFetchMarketData(false)); // Ensure to update fetch status in case of error
  }
};

export const getMyProduct = async dispatch => {
  try {
    dispatch(setFetchMyProductsData(true));
    const response = await requestMyProduct();
    if (response.api_status === 200) {
      dispatch(setMyProductsList(response.products));
      dispatch(setFetchMyProductsData(false)); // Update fetch status after delay
    } else {
      Alert.alert('Warning!', 'Getting unknown status.');
    }
  } catch (error) {
    dispatch(setFetchMyProductsData(false)); // Ensure to update fetch status in case of error
    dispatch(setEmptyMessage('Network Error!.Please try again.'));
  } finally {
    dispatch(setFetchMyProductsData(false)); // Ensure to update fetch status in case of error
  }
};

export const getPurchased = async dispatch => {
  try {
    dispatch(setFetchPurchasedData(true));
    const response = await requestPurchase();
    if (response.api_status === 200) {
      dispatch(setPurchasedList(response.data));

      dispatch(setFetchPurchasedData(false)); // Update fetch status after delay
    } else {
      Alert.alert('Warning!', 'Getting unknown status.');
    }
  } catch (error) {
    dispatch(setFetchPurchasedData(false)); // Ensure to update fetch status in case of error
    dispatch(setEmptyMessage('Network Error!.Please try again.'));
  } finally {
    dispatch(setFetchPurchasedData(false)); // Ensure to update fetch status in case of error
  }
};

export const fetchAddress = async dispatch => {
  try {
    dispatch(setFetchAddressData(true));
    const response = await requestAddress('get');
    if (response.api_status === 200) {
      dispatch(setAddressList(response.data));
      dispatch(setFetchAddressData(false)); // Update fetch status after delay
      response.data.length > 0
        ? dispatch(setCheckedItem(response.data[0]))
        : dispatch(setCheckedItem(null));
    } else {
      Alert.alert('Warning!', 'Getting unknown status.');
    }
  } catch (error) {
    dispatch(setFetchAddressData(false)); // Ensure to update fetch status in case of error
    dispatch(setEmptyMessage('Network Error!.Please try again.'));
  } finally {
    dispatch(setFetchAddressData(false)); // Ensure to update fetch status in case of error
  }
};

export const makeDeteteAddress = async (dispatch, id) => {
  try {
    const response = await deleteAddress('delete', id);
    if (response.api_status === 200) {
      await fetchAddress(dispatch);
    } else {
      Alert.alert('Warning!', 'Getting unknown status.');
    }
  } catch (error) {
    console.error('Error fetching address:', error);
  } finally {
    // console.error('Reached finally:');
  }
};

export const removeFromCart = async (dispatch, productId) => {
  try {
    const response = await submitDeleteCart('remove_cart', productId);
    if (response.api_status === 200) {
      await getChekcoutCartList(dispatch);
    } else if (response.api_status === 400) {
    } else {
      Alert.alert('Warning!', 'Getting unknown status.');
    }
  } catch (error) {
    console.error('Error fetching address:', error);
  } finally {
    // console.error('Reached finally:');
  }
};

export const getChekcoutCartList = async dispatch => {
  try {
    dispatch(setFetchCheckoutCartData(true));
    const response = await requestCheckoutCartList('checkout');
    if (response.api_status === 200) {
      dispatch(setCheckoutCartList(response.data));
      dispatch(setUnitList(response.units));
      dispatch(setCartTotalPrice(response.total));
      dispatch(setFetchCheckoutCartData(false)); // Update fetch status after delay
    } else {
      Alert.alert('Warning!', 'Getting unknown status.');
    }
  } catch (error) {
    dispatch(setFetchCheckoutCartData(false)); // Ensure to update fetch status in case of error
    dispatch(setEmptyMessage('Network Error!.Please try again.'));
  } finally {
    dispatch(setFetchCheckoutCartData(false)); // Ensure to update fetch status in case of error
  }
};

export const addToCart = async (
  dispatch,
  productId,
  quantity,
  setDialogVisible,
  setBackToShopVisible,
) => {
  try {
    const response = await requestAddToCart('add_cart', productId, quantity);
    if (response.api_status === 200) {
      await getChekcoutCartList(dispatch);
      setBackToShopVisible(true);
    } else if (response.api_status === 400) {
      setDialogVisible(true);
    } else {
      Alert.alert('Warning!', 'Getting unknown status.');
    }
  } catch (error) {
    console.error('Error fetching checkout carts:', error);
  } finally {
    // dispatch(setFetchCheckoutCartData(false)); // Ensure to update fetch status in case of error
  }
};

export const changeAddToCartQty = async (dispatch, productId, quantity) => {
  try {
    const response = await requestChangeAddToCartQty(
      'change_qty',
      productId,
      quantity,
    );
    if (response.api_status === 200) {
      await getChekcoutCartList(dispatch);
    } else if (response.api_status === 400) {
    } else {
      Alert.alert('Warning!', 'Getting unknown status.');
    }
  } catch (error) {
    console.error('Error fetching checkout carts:', error);
  } finally {
    // dispatch(setFetchCheckoutCartData(false)); // Ensure to update fetch status in case of error
  }
};

export const buyProduct = async (
  dispatch,
  address_id,
  setBuyProductDialog,
  setSuccessBuyProduct,
  payment_type,
  setLoading,
) => {
  console.log('payment', payment_type);

  try {
    setBuyProductDialog(false);
    setLoading(true);
    const response = await buyRequest('buy', address_id, payment_type);
    if (response.api_status === 200) {
      setSuccessBuyProduct(true);
      await getChekcoutCartList(dispatch);
      await getMarket(dispatch);
      await getPurchased(dispatch);
      await getMyProduct(dispatch);
      setLoading(false);
    } else if (response.api_status === 400) {
      setLoading(false);
    } else {
      Alert.alert('Warning!', 'Getting unknown status.');
    }
  } catch (error) {
    setLoading(false);
    console.error('Error fetching checkout carts:', error);
  } finally {
    // dispatch(setFetchCheckoutCartData(false)); // Ensure to update fetch status in case of error
  }
};

export const changeProductQuantity = async (dispatch, product_id, qty) => {
  try {
    // Alert.alert('Haaa', `${product_id} ${qty}`);
    // setBuyProductDialog(false);
    const response = await requestChangeProductQty(
      'change_qty',
      product_id,
      qty,
    );
    if (response.api_status === 200) {
      // setSuccessBuyProduct(true);
      await getChekcoutCartList(dispatch);
    } else if (response.api_status === 400) {
      await getChekcoutCartList(dispatch);
    } else {
      Alert.alert('Warning!', 'Getting unknown status.');
    }
  } catch (error) {
    console.error('Error in change carts:', error);
  } finally {
    // dispatch(setFetchCheckoutCartData(false)); // Ensure to update fetch status in case of error
  }
};

export const createMyAddress = async (
  dispatch,
  mandatoryValues,
  setIsLoading,
  address,
  handleShowDialog,
) => {
  setIsLoading(true);
  try {
    const data = await submitAddress(
      mandatoryValues[0],
      mandatoryValues[1],
      mandatoryValues[2],
      mandatoryValues[3],
      mandatoryValues[4],
      address,
    );

    if (data.api_status === 200) {
      setIsLoading(false);
      await fetchAddress(dispatch);
      handleShowDialog();
    } else {
      setIsLoading(false);
      // Alert.alert('Error', i18n.t('translation:createdAddressError'));
    }
  } catch (error) {
    setIsLoading(false);
    // Check for specific error types
    if (error.message.includes('Network Error')) {
      Alert.alert('Network Error', 'No internet connection');
    } else if (error.message.includes('timeout')) {
      Alert.alert('Timeout Error', 'Connection timout.');
    } else if (error.response && error.response.status) {
      // Handle specific HTTP status codes
      switch (error.response.status) {
        case 400:
          Alert.alert('Bad Request', 'Bad request');
          break;
        case 401:
          Alert.alert('Unauthorized', 'Unautheorized request.');
          break;
        case 403:
          Alert.alert('Forbidden', 'Forbidden');
          break;
        case 404:
          Alert.alert('Not Found', 'Not Found');
          break;
        case 500:
          Alert.alert('Server Error', 'Server Error');
          break;
        default:
          Alert.alert('Error', 'Error');
          break;
      }
    } else {
      // Handle general errors
      Alert.alert('Error', 'Error');
    }

    console.error(error);
  }
};

export const makeupdateAddress = async (
  dispatch,
  id,
  name,
  phone,
  country,
  city,
  zip,
  address,
) => {
  try {
    const response = await updateAddress(
      id,
      name,
      phone,
      country,
      city,
      zip,
      address,
    );
    if (response.api_status === 200) {
      await fetchAddress(dispatch);
    } else {
      Alert.alert('Warning!', 'Getting unknown status.');
    }
    return response;
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
};

export const fetchCredentialData = async () => {
  const userInfoData = await retrieveJsonData({key: storeKeys.userInfoData});
  const userId = userInfoData.user_id;
  if (userInfoData !== null) {
    return userId;
    // Alert.alert('Not Null');
  } else {
    return 0;
    // Alert.alert('NUll');
  }
};

export const saveImageToStorage = async imageUri => {
  try {
    const fileName = imageUri.split('/').pop();
    const filePath = `${RNFS.ExternalDirectoryPath}/${fileName}`;
    // await RNFS.copyFile(imageUri, filePath);
  } catch (error) {
    console.error('Error saving image:', error);
  }
};

export const makeUpdateProduct = async (
  dispatch,
  id,
  productName,
  productPrice,
  currency,
  productLocation,
  productCategory,
  productItem,
  productDescription,
  condition,
  images,
  imgId,
  handleShowDialog,
  setLoading,
  handleShowDialogWarning,
) => {
  try {
    setLoading(true);
    const response = await updateProduct(
      id,
      productName,
      productPrice,
      currency,
      productLocation,
      productCategory,
      productItem,
      productDescription,
      condition,
      images,
      imgId,
    );

    if (response.api_status === 200) {
      await getMyProduct(dispatch);
      await getMarket(dispatch);
      await getPurchased(dispatch);
      setLoading(false);
      handleShowDialog();
    } else if (response.api_status === 400) {
      await getMyProduct(dispatch);
      await getMarket(dispatch);
      await getPurchased(dispatch);
      setLoading(false);
      handleShowDialogWarning();
    } else {
      setLoading(false);
      Alert.alert('Warning!', 'Getting unknown status.');
    }
  } catch (error) {
    setLoading(false);
    console.error('Error in update product:', error);
  } finally {
    setLoading(false);
    // dispatch(setFetchCheckoutCartData(false)); // Ensure to update fetch status in case of error
  }
};

export const makeDeteteProduct = async (
  dispatch,
  post_id,
  handleCloseDialog,
  navigation,
  startLoading,
  closeLoading,
) => {
  try {
    handleCloseDialog();
    startLoading();
    // Alert.alert('Post ID', `PostID: ${post_id}`);
    const response = await deleteProduct('delete', post_id);
    if (response.api_status === 200) {
      await getMarket(dispatch);
      await getMyProduct(dispatch);
      await getPurchased(dispatch);
      closeLoading();
      navigation.pop(1);
    } else {
      console.log(response);
      closeLoading();

      Alert.alert('Warning!', response.message);
    }
  } catch (error) {
    console.error('Error fetching address:', error);
  } finally {
    // console.error('Reached finally:');
  }
};

export const emojiList = dispatch => {
  dispatch(setFetchEmojiList(true));
  getReactionTypeList().then(data => {
    if (data.api_status === 200) {
      // logJsonData('EMOHJI LIST', data.data);
      dispatch(setEmojiList(data.data));
      dispatch(setFetchEmojiList(false));
      // Alert.alert('Data', `Data : ${data.data.length}`);
    } else {
      Alert.alert('Warning!', 'Getting unknown status.');
    }
  });
};

export const getPostById = async (dispatch, postId) => {
  try {
    dispatch(setFetchPostById(true));
    const response = await requestPost(postId);
    if (response.api_status === 200) {
      dispatch(setPostData(response.post_data));
      dispatch(setFetchPostById(false)); // Update fetch status after delay
    } else {
      Alert.alert('Warning!', 'Getting unknown status.');
    }
  } catch (error) {
    throw error;
  } finally {
    dispatch(setFetchPostById(false)); // Ensure to update fetch status in case of error
  }
};

export const fetchJoinedGroup = dispatch => {
  dispatch(setFetchGroupList(true));
  getJoinedGroupList('my_groups').then(data => {
    if (data.api_status === 200) {
      dispatch(setGroupList(data.data));
      dispatch(setFetchGroupList(false)); // Update fetch status after delay
    }
  });
};

export const fetchMyPage = dispatch => {
  dispatch(setFetchPageList(true));
  getPageList('my_pages').then(data => {
    if (data.api_status === 200) {
      dispatch(setPageList(data.data));
      dispatch(setFetchPageList(false)); // Update fetch status after delay
    }
  });
};

export const getLoggingData = async dispatch => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.userInfoData});
    dispatch(setUserInfoData(loginData));
  } catch (error) {
    throw error;
  }
};

export const getDarkTheme = async dispatch => {
  try {
    const darkModeValue = await retrieveStringData({
      key: storeKeys.darkTheme,
    });
    if (darkModeValue !== null || darkModeValue !== undefined) {
      dispatch(setDarkTheme('enable'));
    }
  } catch (error) {
    console.error('Error retrieving dark mode theme:', error);
  }
};

export const filetrMarketList = async (dispatch, category_id, keyword) => {
  try {
    dispatch(setFetchMarketData(true));
    const response = await filterProduct(category_id, keyword, 0);

    if (response.api_status === 200) {
      console.log('filter result',response.products);
      
      dispatch(filteredMarketList(response.products));
      dispatch(setFetchMarketData(false)); // Update fetch status
    } else {
      Alert.alert('Warning!', 'Getting unknown status.');
    }
  } catch (error) {
    if (error.response && error.response.status === 500) {
      dispatch(setFetchMarketData(false));
      // Alert.alert('Error!', 'Internal server error. Please try again later.');
      dispatch(
        setEmptyMessage('Internal server error. Please try again later.'),
      );
    } else {
      dispatch(setFetchMarketData(false));
      // Alert.alert('Error!', 'Network Error.');
      dispatch(setEmptyMessage('Network Error. Please try again.'));
    }
    dispatch(setFetchMarketData(false)); // Ensure to update fetch status in case of error
  }
};

export const filterMyProductList = async (dispatch, category_id, keyword) => {
  try {
    dispatch(setFetchMyProductsData(true));
    const response = await getMyProductList(category_id, keyword);
    console.log('pppp', response.products);

    if (response.api_status === 200) {
      dispatch(setMyProductsList(response.products));
      dispatch(setFetchMyProductsData(false)); // Update fetch status
    } else {
      Alert.alert('Warning!', 'Getting unknown status.');
    }
  } catch (error) {
    if (error.response && error.response.status === 500) {
      // Alert.alert('Error!', 'Internal server error. Please try again later.');
      dispatch(
        setEmptyMessage('Internal server error. Please try again later.'),
      );
      dispatch(setFetchMyProductsData(false));
    } else {
      // Alert.alert('Error!', 'Network Error.');
      dispatch(setEmptyMessage('Network Error. Please try again.'));
      dispatch(setFetchMyProductsData(false));
    }
    dispatch(setFetchMyProductsData(false)); // Ensure to update fetch status in case of error
  }
};

export const fetchOrderList = async dispatch => {
  try {
    dispatch(setFetchOrderedList(true));
    const response = await getOrderedList();

    if (response.api_status === 200) {
      dispatch(setOrderedList(response.order));
      dispatch(setFetchOrderedList(false)); // Update fetch status
      // Alert.alert('Alwert', `Alwer${response.data.length}`);
    } else {
      Alert.alert('Warning!', 'Getting unknown status.');
    }
  } catch (error) {
    if (error.response && error.response.status === 500) {
      // Alert.alert('Error!', 'Internal server error. Please try again later.');
      dispatch(setFetchOrderedList(false));
      dispatch(
        setEmptyMessage('Internal server error. Please try again later.'),
      );
    } else {
      dispatch(setFetchOrderedList(false));
      dispatch(setEmptyMessage('Network Error. Please try again.'));
      // Alert.alert('Error!', 'Network Error.');
    }
    dispatch(setFetchOrderedList(false)); // Ensure to update fetch status in case of error
  }
};

export const checkNetworkStatus = async () => {
  try {
    const response = await fetch('https://www.google.com', {
      method: 'HEAD',
      timeout: 5000,
    });

    if (response.ok) {
      return true; // Network is online
    } else {
      return false; // Network request failed, but the device may still be online
    }
  } catch (error) {
    return false; // Network request failed, likely offline
  }
};

export const sendInvoice = async (dispatch, orderHashId, handleShowDialog) => {
  try {
    dispatch(setIsSendInvoiceMail(true));
    const response = await requestSendInvoice(orderHashId);
    if (response.api_status === 200) {
      handleShowDialog();
      dispatch(setIsSendInvoiceMail(false));
    } else {
      Alert.alert('Warning!', 'Getting unknown status.');
    }
  } catch (error) {
    dispatch(setIsSendInvoiceMail(false));
    dispatch(setEmptyMessage('Network Error!.Please try again.'));
  } finally {
    dispatch(setIsSendInvoiceMail(false));
  }
};

export const handleDownloadPWA = () => {
  const pwaUrl = 'https://msg.myspace.com.mm/login';

  if (Platform.OS === 'ios') {
    Alert.alert(
      'Open PWA',
      'Please open the PWA from your home screen for a better experience.',
      [
        {text: 'OK', onPress: () => Linking.openURL(pwaUrl)},
        {text: 'Cancel', style: 'cancel'},
      ],
    );
  } else {
    Linking.openURL(pwaUrl).catch(err =>
      console.error('Failed to open URL: ', err),
    );
  }
};
export const filterPurchasedList = async (dispatch, category, keyword) => {
  // console.log(category_id, );
  try {
    dispatch(setFetchPurchasedData(true));
    const response = await fetchAllPurchased(category, keyword);

    if (response.api_status === 200) {
      console.log('purhcased', response);

      // Filter data based on the category_id
      // const filteredData = response.data.filter(item =>
      //   item.orders.some(order =>
      //     order.product.category === category_id &
      //     order.product.name.toLowerCase().includes(searchText.toLowerCase())
      //   )
      // );
      // console.log('ress',response.data);

      // Dispatch actions based on whether there are filtered items
      dispatch(setPurchasedList(response.data));
      // if (filteredData.length > 0) {
      //   dispatch(setPurchasedList(filteredData));
      // } else {
      //   dispatch(setPurchasedList(null)); // Handle no items found
      // }

      dispatch(setFetchPurchasedData(false));
    } else {
      Alert.alert('Warning!', 'Getting unknown status.');
      dispatch(setFetchPurchasedData(false));
    }
  } catch (error) {
    if (error.response && error.response.status === 500) {
      dispatch(
        setEmptyMessage('Internal server error. Please try again later.'),
      );
    } else {
      dispatch(setEmptyMessage('Network Error. Please try again.'));
    }
    dispatch(setFetchPurchasedData(false));
  }
};

export const filterOrderedList = async (dispatch, category, keyword) => {
  try {
    dispatch(setFetchOrderedList(true));

    const response = await getFilterOrderList(category, keyword);

    if (response.api_status === 200) {
      // Filter data based on the category_id
      // const filteredData = response.order.filter(item =>
      //   item.orders.some(order =>
      //     order.product.category === category_id

      //   )
      // );

      // // Dispatch actions based on whether there are filtered items
      // if (filteredData.length > 0) {
      //   dispatch(setOrderedList(filteredData));
      // } else {
      //   dispatch(setOrderedList(null)); // Handle no items found
      // }
      dispatch(setOrderedList(response.order));

      dispatch(setFetchOrderedList(false));
    } else {
      Alert.alert('Warning!', 'Getting unknown status.');
      dispatch(setFetchOrderedList(false));
    }
  } catch (error) {
    if (error.response && error.response.status === 500) {
      dispatch(
        setEmptyMessage('Internal server error. Please try again later.'),
      );
    } else {
      dispatch(setEmptyMessage('Network Error. Please try again.'));
    }
    dispatch(setFetchOrderedList(false));
  }
};
