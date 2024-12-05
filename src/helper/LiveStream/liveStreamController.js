import {Alert} from 'react-native';
import {SERVER_KEY} from '../../config';
import ApiService from '../ApiService';
import {logJsonData} from './logFile';

export const getStreamKey = async (accessToken, userId) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('user_id', userId);
  return ApiService.post(
    `api/live_stream_generate_key?access_token=${accessToken}`,
    formData,
  );
};

export const submitStartLiveStream = async (
  accessToken,
  userId,
  myData,
  streamKey,
  type,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('user_id', userId);
  formData.append('stream_key', streamKey);
  formData.append('title', myData.liveTitle);
  formData.append('description', myData.liveDescription);

  if (type === 'live-sale') {
    formData.append('privacy', myData.selectedPostPrivacy.id);
    formData.append('post_to_timeline', myData.switchValue ? 'yes' : 'no');
    formData.append('product_name', myData.name);
    formData.append('product_price', myData.price);
    formData.append('product_discount', myData.discount);
    formData.append('product_category', myData.category.category_id);
    formData.append('product_subcategory', myData.category.category_id);
    formData.append('product_mobile_phone', myData.phone);
    formData.append('product_qty', myData.itemCount);
    formData.append('product_description', myData.description);
    formData.append('product_used', myData.selectedCondition.type);

    if (myData.images && myData.images.length > 0) {
      myData.images.forEach((photoUri, index) => {
        console.log(index);
        formData.append(`product_medias[]`, {
          uri: photoUri,
          type: 'image/jpeg', // Adjust the MIME type as needed
          name: `photo_${index}.jpg`, // Custom file name
        });
      });
    }
  }

  logJsonData('Hello World', formData);

  try {
    const response = await ApiService.post(
      `api/live_stream_start?access_token=${accessToken}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error creating product:',
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

export const submitStartLiveStreamNormal = async (
  accessToken,
  userId,
  myData,
  streamKey,
  type,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('user_id', userId);
  formData.append('stream_key', streamKey);
  formData.append('title', myData.title.text);
  formData.append('description', myData.description.text);

  try {
    const response = await ApiService.post(
      `api/live_stream_start?access_token=${accessToken}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error creating product:',
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

export const submitEndLiveStream = async (
  accessToken,
  userId,
  postId,
  broadcastId,
  postToTimeline,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('post_id', postId);
  formData.append('broadcast_id', broadcastId);
  formData.append('post_to_timeline', postToTimeline);
  formData.append('user_id', userId);
  logJsonData('Loggging>', formData);
  return ApiService.post(
    `api/live_stream_end?access_token=${accessToken}`,
    formData,
  );
};

export const submitEndLiveStreamNormal = async (
  accessToken,
  userId,
  postId,
  broadcastId,
  postToTimeline,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('post_id', postId);
  formData.append('broadcast_id', broadcastId);
  formData.append('post_to_timeline', postToTimeline);
  formData.append('user_id', userId);
  logJsonData('Loggging>', formData);
  return ApiService.post(
    `api/live_stream_end?access_token=${accessToken}`,
    formData,
  );
};

export const getActiveLiveList = async accessToken => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  return ApiService.post(
    `api/live_stream_active?access_token=${accessToken}`,
    formData,
  );
};

export const requestLiveCommentList = async (accessToken, postId) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('post_id', postId);
  return ApiService.post(
    `api/live_stream_get_comment?access_token=${accessToken}`,
    formData,
  );
};

export const startLiveHardEnd = async (postId, broadcastId, accessToken) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('post_id', postId);
  formData.append('broadcast_id', broadcastId);
  logJsonData('hard end=>', formData);
  return ApiService.post(
    `api/live_stream_end_delete?access_token=${accessToken}`,
    formData,
  );
};

export const pullLiveProductDetails = async (postId, accessToken) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('post_id', postId);
  return ApiService.post(
    `api/live_stream_count_data?access_token=${accessToken}`,
    formData,
  );
};

export const makeSumbittionComment = async (
  comment,
  postId,
  userId,
  accessToken,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('post_id', postId);
  formData.append('text', comment);
  formData.append('user_id', userId);
  return ApiService.post(
    `api/live_stream_add_comment?access_token=${accessToken}`,
    formData,
  );
};
