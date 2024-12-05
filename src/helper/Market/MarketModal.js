import {retrieveJsonData, storeKeys} from '../AsyncStorage';
import {
  filterMyProduct,
  filterProductList,
  getCheckoutList,
  getData,
  getFiletrPurchasedList,
  getMyProduct,
  getOrdersFilterListed,
  getOrdersListed,
  getProduct,
  getPurchased,
  requestAddressList,
  requestCreateAddress,
  requestDelete,
  requestDeleteCart,
  requestJoinedGroupList,
  requestPageList,
  requestPostDetail,
  requestProductDelete,
  requestReactionTypeList,
  requestUpdateAddress,
  requestUpdateProduct,
  sendInvoiceEmail,
  submitAddToCart,
  submitBuyProduct,
  submitChangeAddToCartQty,
  submitChangeProductQty,
} from './MarketController';

export const requestProduct = async (limit , offset) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await getProduct(accessTokenValue,limit , offset);
    if (response.data.api_status == 200) {
      // Alert.alert('Success Loading Market');
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const requestMyProduct = async () => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const user_id = loginData.user_id;
    const response = await getMyProduct(user_id, accessTokenValue);
    if (response.data.api_status == 200) {
      // Alert.alert('Success Loading Market');
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const requestPurchase = async () => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await getPurchased(accessTokenValue);
    if (response.data.api_status == 200) {
      // Alert.alert('Success Loading Market');
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const requestAddress = async type => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestAddressList(accessTokenValue, type);

    if (response.data.api_status == 200) {
      // Success logic here
      // Alert.alert('Success');
    } else {
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made, and the server responded with a status code that falls out of the range of 2xx
    } else if (error.request) {
      // The request was made but no response was received
    } else {
      // Something happened in setting up the request that triggered an Error
    }
    throw error;
  }
};

export const deleteAddress = async (type, id) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestDelete(accessTokenValue, type, id);

    if (response.data.api_status == 200) {
      // Success logic here
      // Alert.alert('Success');
    } else {
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made, and the server responded with a status code that falls out of the range of 2xx
    } else if (error.request) {
      // The request was made but no response was received
    } else {
      // Something happened in setting up the request that triggered an Error
    }
    throw error;
  }
};

export const submitDeleteCart = async (type, productId) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestDeleteCart(accessTokenValue, type, productId);

    if (response.data.api_status == 200) {
      // Success logic here
      // Alert.alert('Success');
    } else {
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made, and the server responded with a status code that falls out of the range of 2xx
    } else if (error.request) {
      // The request was made but no response was received
    } else {
      // Something happened in setting up the request that triggered an Error
    }
    throw error;
  }
};

export const requestCheckoutCartList = async type => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await getCheckoutList(accessTokenValue, type);

    if (response.data.api_status == 200) {
      // Success logic here
      // Alert.alert('Success');
    } else {
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made, and the server responded with a status code that falls out of the range of 2xx
    } else if (error.request) {
      // The request was made but no response was received
    } else {
      // Something happened in setting up the request that triggered an Error
    }
    throw error;
  }
};

export const requestAddToCart = async (type, productId, quantity) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await submitAddToCart(
      accessTokenValue,
      type,
      productId,
      quantity,
    );

    if (response.data.api_status == 200) {
      // Success logic here
      // Alert.alert('Success');
    } else {
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made, and the server responded with a status code that falls out of the range of 2xx
    } else if (error.request) {
      // The request was made but no response was received
    } else {
      // Something happened in setting up the request that triggered an Error
    }
    throw error;
  }
};

export const requestChangeAddToCartQty = async (type, productId, quantity) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await submitChangeAddToCartQty(
      accessTokenValue,
      type,
      productId,
      quantity,
    );

    if (response.data.api_status == 200) {
      // Success logic here
      // Alert.alert('Success');
    } else {
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made, and the server responded with a status code that falls out of the range of 2xx
    } else if (error.request) {
      // The request was made but no response was received
    } else {
      // Something happened in setting up the request that triggered an Error
    }
    throw error;
  }
};

export const buyRequest = async (type, address_id , payment_type) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await submitBuyProduct(accessTokenValue, type, address_id , payment_type);

    if (response.data.api_status == 200) {
      // Success logic here
      // Alert.alert('Success');
    } else {
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made, and the server responded with a status code that falls out of the range of 2xx
    } else if (error.request) {
      // The request was made but no response was received
    } else {
      // Something happened in setting up the request that triggered an Error
    }
    throw error;
  }
};

export const requestChangeProductQty = async (type, product_id, qty) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await submitChangeProductQty(
      accessTokenValue,
      type,
      product_id,
      qty,
    );

    if (response.data.api_status == 200) {
      // Success logic here
      // Alert.alert('Success');
    } else {
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made, and the server responded with a status code that falls out of the range of 2xx
    } else if (error.request) {
      // The request was made but no response was received
    } else {
      // Something happened in setting up the request that triggered an Error
    }
    throw error;
  }
};

export const submitAddress = async (
  name,
  phone,
  country,
  city,
  zip,
  address,
) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;

    const response = await requestCreateAddress(
      name,
      phone,
      country,
      city,
      zip,
      address,
      accessTokenValue,
    );
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAddress = async (
  id,
  name,
  phone,
  country,
  city,
  zip,
  address,
) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;

    const response = await requestUpdateAddress(
      id,
      name,
      phone,
      country,
      city,
      zip,
      address,
      accessTokenValue,
    );
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (
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
) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;

    const response = await requestUpdateProduct(
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
      accessTokenValue,
    );
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (type, post_id) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestProductDelete(
      accessTokenValue,
      type,
      post_id,
    );

    if (response.data.api_status == 200) {
      // Success logic here
      // Alert.alert('Success');
    } else {
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made, and the server responded with a status code that falls out of the range of 2xx
    } else if (error.request) {
      // The request was made but no response was received
    } else {
      // Something happened in setting up the request that triggered an Error
    }
    throw error;
  }
};

export const getReactionTypeList = async () => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestReactionTypeList(accessTokenValue);
    if (response.data.api_status == 200) {
      // do
    } else {
      //do
    }
    return response.data;
  } catch (error) {
    return error;
  }
};

export const requestPost = async postId => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestPostDetail(postId, accessTokenValue);
    if (response.data.api_status == 200) {
      // do
    } else {
      //do
    }
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getJoinedGroupList = async type => {
  // const startTime = performance.now();
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const user_id = await getData('userid');
    const response = await requestJoinedGroupList(
      accessTokenValue,
      type,
      user_id,
    );
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPageList = async type => {
  // const startTime = performance.now();
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestPageList(accessTokenValue, type);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const filterProduct = async (category_id, keyword, distance) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await filterProductList(
      accessTokenValue,
      category_id,
      keyword,
      distance,
    );

    if (response.data.api_status == 200) {
      // Success logic here
    } else {
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made, and the server responded with a status code that falls out of the range of 2xx
    } else if (error.request) {
      // The request was made but no response was received
    } else {
      // Something happened in setting up the request that triggered an Error
    }
    throw error;
  }
};

export const getMyProductList = async (category_id, keyword) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const userId = loginData.user_id;
    const response = await filterMyProduct(
      userId,
      category_id,
      keyword,
      accessTokenValue,
    );

    if (response.data.api_status == 200) {
      // Success logic here
    } else {
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made, and the server responded with a status code that falls out of the range of 2xx
    } else if (error.request) {
      // The request was made but no response was received
    } else {
      // Something happened in setting up the request that triggered an Error
    }
    throw error;
  }
};

export const getOrderedList = async () => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const userId = loginData.user_id;
    const response = await getOrdersListed(accessTokenValue);

    if (response.data.api_status == 200) {
      // Success logic here
    } else {
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made, and the server responded with a status code that falls out of the range of 2xx
    } else if (error.request) {
      // The request was made but no response was received
    } else {
      // Something happened in setting up the request that triggered an Error
    }
    throw error;
  }
};

export const getFilterOrderList = async (category, keyword) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const userId = loginData.user_id;
    const response = await getOrdersFilterListed(category, keyword , accessTokenValue);

    if (response.data.api_status == 200) {
      // Success logic here
    } else {
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made, and the server responded with a status code that falls out of the range of 2xx
    } else if (error.request) {
      // The request was made but no response was received
    } else {
      // Something happened in setting up the request that triggered an Error
    }
    throw error;
  }
};

export const requestSendInvoice = async orderHashId => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await sendInvoiceEmail(accessTokenValue, orderHashId);
    if (response.data.api_status == 200) {
      // Alert.alert('Success Loading Market');
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAllPurchased = async (category , keyword) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    
    const response = await getFiletrPurchasedList(category , keyword , accessTokenValue);

    return response.data;
  } catch (error) {
    if (error.response) {
      // Handle server response errors
    } else if (error.request) {
      // Handle no response errors
    } else {
      // Handle other errors
    }
    throw error;
  }
};