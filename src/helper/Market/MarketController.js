import AsyncStorage from '@react-native-async-storage/async-storage';
import {SERVER_KEY} from '../../config';
import ApiService from '../ApiService';

export const getData = async name => {
  try {
    const data = JSON.parse(await AsyncStorage.getItem(name));
    return data;
  } catch (error) {}
};

export const getProduct = async (accessToken,limit,offset) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('limit', limit);
  formData.append('offset', offset);
  return ApiService.post(
    `api/get-products?access_token=${accessToken}`,
    formData,
  );
};

export const filterMyProduct = async (user_id, category_id,keyword, accessToken) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('user_id', user_id);
  if(category_id != null){
    formData.append('category_id', category_id);
  }
  formData.append('keyword' , keyword)
  return ApiService.post(
    `api/get-products?access_token=${accessToken}`,
    formData,
  );
};

export const filterProductList = async (
  accessToken,
  category_id,
  keyword,
  distance,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  if(category_id != null){
    formData.append('category_id', category_id);
  }
  
  formData.append('keyword', keyword);
  formData.append('distance', distance);
  return ApiService.post(
    `api/get-products?access_token=${accessToken}`,
    formData,
  );
};

export const getCheckoutList = async (accessToken, type) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  return ApiService.post(`api/market?access_token=${accessToken}`, formData);
};

export const getMyProduct = async (user_id, accessToken) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('user_id', user_id);
  return ApiService.post(
    `api/get-products?access_token=${accessToken}`,
    formData,
  );
};

export const getOrdersListed = async ( accessToken) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', 'ordered');
 
  return ApiService.post(`api/market?access_token=${accessToken}`, formData);
};

export const getOrdersFilterListed = async (category, keyword , accessToken) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', 'ordered');
  if(category != null){
    formData.append('category', category);
  }

  formData.append('keyword', keyword);
  return ApiService.post(`api/market?access_token=${accessToken}`, formData);
};

export const getPurchased = async accessToken => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', 'purchased');
  // formData.append('limit', 25);
  return ApiService.post(`api/market?access_token=${accessToken}`, formData);
};
export const requestAddressList = async (accessToken, type) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  return ApiService.post(`api/address?access_token=${accessToken}`, formData);
};
export const requestCreateAddress = (
  name,
  phone,
  country,
  city,
  zip,
  address,
  access_token,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', 'add');
  formData.append('name', name);
  formData.append('phone', phone);
  formData.append('country', country);
  formData.append('city', city);
  formData.append('zip', zip);
  formData.append('address', address);
  return ApiService.post(`api/address?access_token=${access_token}`, formData);
};
export const requestDelete = async (accessToken, type, id) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  formData.append('id', id);
  return ApiService.post(`api/address?access_token=${accessToken}`, formData);
};

export const requestProductDelete = async (accessToken, type, post_id) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('action', type);
  formData.append('post_id', post_id);
  return ApiService.post(
    `api/post-actions?access_token=${accessToken}`,
    formData,
  );
};
export const requestDeleteCart = async (accessToken, type, productId) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  formData.append('product_id', productId);
  return ApiService.post(`api/market?access_token=${accessToken}`, formData);
};

export const requestJoinedGroupList = (access_token, type, user_id) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  formData.append('user_id', user_id);
  return ApiService.post(
    `api/get-my-groups?access_token=${access_token}`,
    formData,
  );
};
export const requestPageList = (access_token, type) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  return ApiService.post(
    `api/get-my-pages?access_token=${access_token}`,
    formData,
  );
};
export const requestPostDetail = (postId, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('fetch', 'post_data');
  formData.append('post_id', postId);
  return ApiService.post(
    `api/get-post-data?access_token=${access_token}`,
    formData,
  );
};
export const requestReactionTypeList = access_token => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  return ApiService.post(
    `api/get-reaction-type?access_token=${access_token}`,
    formData,
  );
};
export const requestUpdateAddress = (
  id,
  name,
  phone,
  country,
  city,
  zip,
  address,
  access_token,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', 'edit');
  formData.append('id', id);
  formData.append('name', name);
  formData.append('phone', phone);
  formData.append('country', country);
  formData.append('city', city);
  formData.append('zip', zip);
  formData.append('address', address);
  return ApiService.post(`api/address?access_token=${access_token}`, formData);
};
export const requestUpdateProduct = (
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
  access_token,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('product_id', id);
  formData.append('product_title', productName);
  formData.append('product_category', productCategory);
  formData.append('product_type', condition);
  formData.append('product_description', productDescription);
  formData.append('product_price', productPrice);
  formData.append('product_location', productLocation);
  formData.append('currency', currency);
  formData.append('units', productItem);
  formData.append('deleted_images_ids', imgId);

  images.forEach((image, index) => {
    // Adjust the property names based on your actual data structure
    const imageUri = image; // Example adjustments
    const imageData = {
      uri: imageUri,
      name: `photo_${index}.jpg`,
      type: image.type || 'image/jpeg',
    };
    formData.append('images[]', imageData);
  });

  return ApiService.post(
    `api/edit-product?access_token=${access_token}`,
    formData,
  );
};
export const sendInvoiceEmail = async (accessToken, orderHashId) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', 'send_invoice');
  formData.append('hash_id', orderHashId);
  return ApiService.post(`api/market?access_token=${accessToken}`, formData);
};
export const submitAddToCart = async (
  accessToken,
  type,
  productId,
  quantity,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  formData.append('product_id', productId);
  formData.append('qty', quantity);
  return ApiService.post(`api/market?access_token=${accessToken}`, formData);
};
export const submitBuyProduct = async (accessToken, type, address_id , payment_type) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  formData.append('address_id', address_id);
  formData.append('payment_type', payment_type);
  return ApiService.post(`api/market?access_token=${accessToken}`, formData);
};
export const submitChangeAddToCartQty = async (
  accessToken,
  type,
  productId,
  quantity,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  formData.append('product_id', productId);
  formData.append('qty', quantity);
  return ApiService.post(`api/market?access_token=${accessToken}`, formData);
};
export const submitChangeProductQty = async (
  accessToken,
  type,
  product_id,
  qty,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  formData.append('product_id', product_id);
  formData.append('qty', qty);
  return ApiService.post(`api/market?access_token=${accessToken}`, formData);
};

export const getFiletrPurchasedList = async (category , keyword , accessToken) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', 'purchased');
  if(category != null){
    formData.append('category', category);
  }
  // formData.append('category', category);
  formData.append('keyword', keyword);
  
  return ApiService.post(
    `api/market?access_token=${accessToken}`,
    formData,
  );
};


// export const getPurchased = async accessToken => {
//   const formData = new FormData();
//   formData.append('server_key', SERVER_KEY);
//   formData.append('type', 'purchased');
//   // formData.append('limit', 25);
//   return ApiService.post(`api/market?access_token=${accessToken}`, formData);
// };