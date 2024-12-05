import {retrieveJsonData, storeKeys} from '../AsyncStorage';
import {
  getActiveLiveList,
  getStreamKey,
  makeSumbittionComment,
  pullLiveProductDetails,
  requestLiveCommentList,
  startLiveEnd,
  startLiveHardEnd,
  submitEndLiveStream,
  submitEndLiveStreamNormal,
  submitStartLiveStream,
  submitStartLiveStreamNormal,
} from './liveStreamController';
import {logJsonData, logMessage} from './logFile';

export const requestGenerateStreamKey = async () => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessToken = loginData.access_token;
    const userId = loginData.user_id;
    console.log(accessToken);
    const response = await getStreamKey(accessToken, userId);
    if (response && response.data.api_status == 200) {
      // logJsonData('Generate Stream Key :', response.data);
    } else {
      // logJsonData('Api calling failed!', response.data);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const requestGenerateStreamKeyNormal = async () => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessToken = loginData.access_token;
    const userId = loginData.user_id;
    console.log(accessToken);
    const response = await getStreamKey(accessToken, userId);
    if (response && response.data.api_status == 200) {
      // logJsonData('Generate Stream Key :', response.data);
    } else {
      // logJsonData('Api calling failed!', response.data);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const requestStartLiveStream = async (streamKey, formData, type) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessToken = loginData.access_token;
    const userId = loginData.user_id;
    const response = await submitStartLiveStream(
      accessToken,
      userId,
      formData,
      streamKey,
      type,
    );
    if (response && response.api_status == 200) {
      logJsonData('Generate Live Data :', response);
    } else {
      // logJsonData('Api calling failed!', response.data);
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export const requestStartLiveStreamNormal = async (
  streamKey,
  formData,
  type,
) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessToken = loginData.access_token;
    const userId = loginData.user_id;
    const response = await submitStartLiveStreamNormal(
      accessToken,
      userId,
      formData,
      streamKey,
      type,
    );
    if (response && response.api_status == 200) {
      logJsonData('Generate Live Data :', response);
    } else {
      // logJsonData('Api calling failed!', response.data);
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export const requestEndLiveStream = async (
  userId,
  postId,
  broadcastId,
  postToTimeline,
) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessToken = loginData.access_token;
    // const userId = loginData.user_id;
    const response = await submitEndLiveStream(
      accessToken,
      userId,
      postId,
      broadcastId,
      postToTimeline,
    );
    logJsonData('Generate Live End Data :', response);
    if (response && response.api_status == 200) {
      // logJsonData('Generate Live End Data :', response);
    } else {
      // logJsonData('Api calling failed!', response.data);
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export const requestEndLiveStreamNormal = async (
  userId,
  postId,
  broadcastId,
  postToTimeline,
) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessToken = loginData.access_token;
    // const userId = loginData.user_id;
    const response = await submitEndLiveStreamNormal(
      accessToken,
      userId,
      postId,
      broadcastId,
      postToTimeline,
    );
    logJsonData('Generate Live End Data Normal :', response);
    if (response && response.api_status == 200) {
      // logJsonData('Generate Live End Data :', response);
    } else {
      // logJsonData('Api calling failed!', response.data);
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export const requestActiveLive = async () => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessToken = loginData.access_token;
    // const userId = loginData.user_id;
    const response = await getActiveLiveList(accessToken);
    if (response && response.api_status == 200) {
      // logJsonData('Generate active Live Data :', response);
    } else {
      // logJsonData('Api calling failed!', response.data);
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export const getLiveComments = async postId => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessToken = loginData.access_token;
    // const userId = loginData.user_id;
    const response = await requestLiveCommentList(accessToken, postId);
    if (response && response.api_status == 200) {
    } else {
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export const requestLiveHardEnd = async (postId, boradcastId) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessToken = loginData.access_token;
    const response = await startLiveHardEnd(postId, boradcastId, accessToken);
    logJsonData('Hjslfjaksf', response);
    if (response && response.api_status == 200) {
    } else {
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export const requestLiveProductDetails = async postId => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessToken = loginData.access_token;
    const response = await pullLiveProductDetails(postId, accessToken);
    if (response && response.api_status == 200) {
    } else {
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export const requestSubmitComment = async (comment, postId) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessToken = loginData.access_token;
    const userId = loginData.user_id;
    const response = await makeSumbittionComment(
      comment,
      postId,
      userId,
      accessToken,
    );
    if (response && response.api_status == 200) {
    } else {
    }
    return response;
  } catch (error) {
    throw error;
  }
};
