import {Alert} from 'react-native';
import {
  getData,
  loggingIn,
  requestPosts,
  requestStories,
  requestUserInfoData,
  requestRegisteration,
  getFollowersAndFollowings,
  requestGetFriend,
  requestForgotPasswordEmail,
  requestForgotPasswordCode,
  requestPostLike,
  requestForgotPasswordUpdate,
  requestMyPageList,
  requestAddPost,
  requestLikedPageList,
  likeUnlikeRequest,
  requestRecommendedGroupOrPageList,
  requestCommentData,
  requestMyGroupList,
  requestLikedGroupList,
  joinGroupRequest,
  requestMembers,
  submitInvitee,
  requestReplyCommentData,
  requestReplyCommentLike,
  requestReportComment,
  requestDeleteComment,
  requestDeleteReplyComment,
  requestEditReplyComment,
  requestEditComment,
  submitCreatePage,
  submitCreateGroup,
  submitUpdatePage,
  requestPagedata,
  submitUpdatePageInfo,
  submitDeletePage,
  requestGroupMembers,
  submitUpdateGroup,
  requestGroupdata,
  submitDeleteGroup,
  requestPageMembers,
  submitPageInvitee,
  requestSearch,
  requestNotifications,
  requestMyActivities,
  requestFriendBirthdays,
  requestChangeCoverOrAvatar,
  requestChangePageAvatar,
  requestChangePageCover,
  requestChangeGroupCover,
  requestChangeGroupAvatar,
  requestVideoPost,
  requestJoinedGroupList,
  requestPageList,
  requestSharePost,
  requestSavePost,
  requestHidePost,
  requestUpdateMyProfile,
  requestBlockedList,
  requestBlock,
  requestEditPost,
  requestFollowUser,
  requestFollowRequestAction,
  requestVerification,
  requestChangePssword,
  requestChangePassword,
  requestTwoFactorOTP,
  requestTwoFactorOn,
  requestTwoFactorOff,
  requestSessionList,
  requestSessionDelete,
  requestReaction,
  requestDeleteAccount,
  requestFriendRequest,
  requestPostsOfUserProfile,
  friendRequest,
  requestGroupPostById,
  followRequest,
  requestLikePage,
  requestJoinGroup,
  requestReportUser,
  requestPostDetail,
  requestCommentReact,
  requestCommentReactReply,
  requestUpdateMyAccount,
  requestReactionTypeList,
  requestCreateInvitationLink,
  requestVersionControl,
  requestGoingEvent,
  requestAllEvents,
  requestMyEvent,
  requestInvitedEvent,
  requestInterestedEvent,
  requestPastEvent,
  requestSavedPost,
  requestSavedPosts,
  requestAds,
  requestPopularPosts,
  requestUpdatePrivacySetting,
  requestResendEmail,
  requestGetEvent,
  requestGetEventInterested,
  requestGetEventGoing,
  requestRegisterConfigSetting,
  requestCreateEvent,
  requestDeleteEvent,
  requestEditEvent,
  requestCreateProduct,
  requestConfirmCodeUnusual,
  requestTwoFactorConfirmation,
  getProduct,
  getMyProduct,
  getPurchased,
  filterProductList,
  requestAddressList,
  requestCreateAddress,
  requestDelete,
  getCheckoutList,
  submitAddToCart,
  requestDeleteCart,
  submitBuyProduct,
  submitChangeAddToCartQty,
  submitChangeProductQty,
  requestUpdateAddress,
  requestUpdateProduct,
  requestProductDelete,
  requestActivateAccount,
  requestResendSms,
  filterMyProduct,
  getOrdersListed,
  sendInvoiceEmail,
  requestForgotPasswordSMS,
  requestForgotPasswordSmsCode,
  requestTwoFactorSetting,
  requestUpdateTwoFactor,
  requestWithdrawBank,
  requestSendMoney,
  requestBankTransfer,
  requestWithdrawKBZ,
  requestNewPlan,
  requestChangeOrderStatus,
  requestReviewProduct,
  requestGetCurrencies,
  requestEventInvite,
  requestNotInEventMember,
  requestPageVerification,
  requestSocailLinks,
  makeReaction,
  requestAdmin,
  requestPageAdmin,
  requestUpdateAdminSetting,
  requestGroupAdmin,
  requestRemoveGroupAdmin,
  requestUpdateGroupAdminSetting,
  requestUpdateGroupPrivacy,
} from './Controller';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {retrieveJsonData, storeKeys} from './AsyncStorage';
import {logJsonData} from './LiveStream/logFile';

export const getPostsData = async (type, filter, postId, userId, limit) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const response = await requestPosts(
      type,
      filter,
      postId,
      userId,
      loginData.access_token,
      limit,
    );
    // logJsonData('==================>', response.data);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getSavedPostsData = async (
  type,
  filter,
  postId,
  userId,
  limit,
) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const response = await requestSavedPosts(
      type,
      filter,
      postId,
      userId,
      loginData.access_token,
      limit,
    );

    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPopularPostsData = async (filter, postId, userId, limit) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const response = await requestPopularPosts(
      filter,
      postId,
      userId,
      loginData.access_token,
      limit,
    );

    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPostsDataOfUserProfile = async (
  type,
  filter,
  postId,
  user_id,
  limit,
) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const response = await requestPostsOfUserProfile(
      type,
      filter,
      postId,
      loginData.access_token,
      user_id,
      limit,
    );

    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitLoginData = async ({username, password}) => {
  try {
    const response = await loggingIn({username: username, password: password});
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getUserInfoData = async otherUserId => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const response = await requestUserInfoData(
      otherUserId ? otherUserId : loginData.user_id,
      loginData.access_token,
    );
    if (response.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStories = async () => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const response = await requestStories(loginData.access_token);

    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitRegisteration = async ({
  first_name,
  last_name,
  username,
  email,
  phone,
  password,
  gender,
}) => {
  try {
    const accessTokenValue = await getData('access_token');

    const response = await requestRegisteration(
      {
        first_name: first_name,
        last_name: last_name,
        username: username,
        email: email,
        phone: phone,
        password: password,
        comfirmPassword: password,
        gender: gender,
      },
      accessTokenValue,
    );
    if (response.data.api_status == 220) {
      // do
    } else {
      //do
    }
    return response.data;
  } catch (error) {
    return error;
  }
};

export const requestFollowersAndFollowingList = async (type, user_id) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const response = await getFollowersAndFollowings(
      type,
      user_id,
      loginData?.access_token,
    );
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    return error;
  }
};
// get Friends list

export const submitGetFriends = async type => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const user_id = loginData.user_id;
    const response = await requestGetFriend(type, user_id, accessTokenValue);
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

export const submitForgotPasswordEmail = async ({email}) => {
  try {
    const response = await requestForgotPasswordEmail({email: email});
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitForgotPasswordSMS = async ({phone_num}) => {
  try {
    const response = await requestForgotPasswordSMS({phone_num: phone_num});
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitForgotPasswordCode = async ({email, code}) => {
  try {
    const response = await requestForgotPasswordCode({
      email: email,
      code: code,
    });
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitForgotPasswordSmsCode = async ({phone_num, code}) => {
  try {
    const response = await requestForgotPasswordSmsCode({
      phone_num: phone_num,
      code: code,
    });
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const PostLike = async (postid, action, reaction) => {
  // Alert.alert("HEllo ",`Hello ${postid} ${reaction}`)
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestPostLike(
      accessTokenValue,
      postid,
      action,
      reaction,
    );
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const startReaction = async (postId, reactType) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await makeReaction(accessTokenValue, postId, reactType);

    if (response.api_status === 200) {
      return response;
    } else {
      console.log('Error in reaction: ', response.api_status);
    }
    return null;
  } catch (error) {
    Alert.alert('Error', 'Failed to react');
    console.log(error);
  } finally {
    // Any final cleanup or actions can be handled here
  }
};
export const submitForgotPasswordUpdate = async ({
  new_password,
  phone_num,
  email,
  code,
}) => {
  try {
    const response = await requestForgotPasswordUpdate({
      new_password: new_password,
      phone_num: phone_num,
      email: email,
      code: code,
    });
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMyPageList = async type => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestMyPageList(accessTokenValue, type);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMyGroupList = async type => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestMyGroupList(accessTokenValue, type);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitAddPost = async (
  postText,
  postPhotos,
  postGif,
  postVideo,
  feelingType,
  feeling,
  selectedPostPrivacy,
  postType,
  userId,
  pageInfo,
) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestAddPost(
      postText,
      postPhotos,
      postGif,
      postVideo,
      feelingType,
      feeling,
      selectedPostPrivacy,
      postType,
      userId,
      pageInfo,
      accessTokenValue,
    );
    logJsonData('Create Post Success ====>', response);
    if (response.data.api_status === 200) {
      // logJsonData('Create Post Success ====>', response);
      // Successful API response
      // Do something on success
    } else {
      // Handle API error
      // Do something on error
    }

    return response.data;
  } catch (error) {
    // Handle any other errors
    return error;
  }
};
export const getLikedPageList = async type => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const user_id = loginData.user_id;
    const response = await requestLikedPageList(
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

export const getLikedGroupList = async type => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const user_id = loginData.user_id;
    const response = await requestLikedGroupList(
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

export const joinUnjionGroupAction = async page_id => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await joinGroupRequest(page_id, accessTokenValue);
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

export const getRecommentedGroupOrPageList = async type => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestRecommendedGroupOrPageList(
      accessTokenValue,
      type,
    );
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCommentData = async (type, postid, text, comment_id, image) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestCommentData(
      type,
      postid,
      text,
      comment_id,
      image,
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

export const likeUnlineAction = async page_id => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await likeUnlikeRequest(page_id, accessTokenValue);
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

export const getNotGroupMembers = async id => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestMembers(id, accessTokenValue);
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

export const getNotPageMembers = async id => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestPageMembers(id, accessTokenValue);
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

export const addInvitee = async (id, user_id) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await submitInvitee(id, user_id, accessTokenValue);
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

export const getReplyCommentData = async (type, comment_id) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestReplyCommentData(
      type,
      comment_id,
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
export const getReplyCommentLike = async (type, reply_id) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestReplyCommentLike(
      type,
      reply_id,
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
export const reportComment = async comment_id => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestReportComment(comment_id, accessTokenValue);

    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteComment = async comment_id => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestDeleteComment(
      'delete',
      comment_id,
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
export const deleteReplyComment = async reply_id => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestDeleteReplyComment(
      'delete_reply',
      reply_id,
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
export const editComment = async (comment_id, text) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestEditComment(
      'edit',
      comment_id,
      text,
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
export const editReplyComment = async (reply_id, text) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestEditReplyComment(
      'edit_reply',
      reply_id,
      text,
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
export const addPageInvitee = async (id, user_id) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await submitPageInvitee(id, user_id, accessTokenValue);
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

export const filterSearchList = async search_key => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestSearch(search_key, accessTokenValue);
    if (response.data.api_status == 200) {
      console.log('Data ===>', response.data);
      // do
    } else {
      //do
    }
    return response.data;
  } catch (error) {
    return error;
  }
};

export const createNewPage = async (page_name, page_title, category, about) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await submitCreatePage(
      page_name,
      page_title,
      category,
      about,
      accessTokenValue,
    );
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

export const createNewGroup = async (
  group_name,
  group_title,
  category,
  about,
) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await submitCreateGroup(
      group_name,
      group_title,
      category,
      about,
      accessTokenValue,
    );
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

export const updatePage = async (
  page_id,
  page_title,

  page_name,
  category,
  users_post,
  pageAction,
  actionLink,
) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await submitUpdatePage(
      page_id,
      page_title,

      page_name,
      category,
      users_post,
      pageAction,
      actionLink,
      accessTokenValue,
    );
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

export const getPageInfoById = async page_id => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestPagedata(page_id, accessTokenValue);
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

export const getGroupInfoById = async id => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestGroupdata(id, accessTokenValue);
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

export const updatePageInfo = async (
  page_id,
  company,
  phone,
  address,
  website,
  page_description,
) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await submitUpdatePageInfo(
      page_id,
      company,
      phone,
      address,
      website,
      page_description,
      accessTokenValue,
    );
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

export const deletePage = async (password, page_id) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await submitDeletePage(
      password,
      page_id,
      accessTokenValue,
    );
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getNotificationList = async () => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    console.log(accessTokenValue);
    const response = await requestNotifications(accessTokenValue);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFriendRequestList = async () => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestFriendRequest(accessTokenValue);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGroupMembers = async group_id => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestGroupMembers(group_id, accessTokenValue);
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

export const updateGroup = async (
  group_id,
  group_title,
  group_name,

  category,
  about,
) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await submitUpdateGroup(
      group_id,
      group_title,
      group_name,

      category,
      about,
      accessTokenValue,
    );
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

export const deleteGroup = async (password, group_id) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await submitDeleteGroup(
      password,
      group_id,
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
export const getActivitiesList = async () => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestMyActivities(accessTokenValue);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFriBirthdayList = async () => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});

    const accessTokenValue = loginData.access_token;
    const response = await requestFriendBirthdays(accessTokenValue);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAvatarOreCover = async (userId, type, image) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestChangeCoverOrAvatar(
      userId,
      type,
      image,
      accessTokenValue,
    );
    // if (response.data.api_status == 200) {
    // } else {

    // }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePageAvatar = async (pageId, image) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestChangePageAvatar(
      pageId,
      image,
      accessTokenValue,
    );
    // if (response.data.api_status == 200) {
    // } else {

    // }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePageCover = async (pageId, image) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestChangePageCover(
      pageId,
      image,
      accessTokenValue,
    );
    // if (response.data.api_status == 200) {
    // } else {

    // }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateGroupCover = async (groupId, image) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestChangeGroupCover(
      groupId,
      image,
      accessTokenValue,
    );
    // if (response.data.api_status == 200) {
    // } else {

    // }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateGroupAvatar = async (groupId, image) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestChangeGroupAvatar(
      groupId,
      image,
      accessTokenValue,
    );
    // if (response.data.api_status == 200) {
    // } else {

    // }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getVideoPostList = async (afterPostId = 0) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const userid = await getData('userid');
    const response = await requestVideoPost(afterPostId, accessTokenValue);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
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
export const submitUpdateMyProfile = async (valuesOptional, relationship) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestUpdateMyProfile(
      valuesOptional,
      relationship,
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
export const submitUpdateMyAccount = async (
  valuesOptional,
  country_id,
  birthday,
  gender,
) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestUpdateMyAccount(
      valuesOptional,
      country_id,
      birthday,
      gender,
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

export const getBlockedList = async () => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestBlockedList(accessTokenValue);

    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitBlock = async (userId, blockType) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestBlock(userId, blockType, accessTokenValue);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const sharePostOnGroup = async (
  type,
  id,
  group_id,
  text,
  navigation,
  isShortVideo,
  isMarket,
) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestSharePost(
      accessTokenValue,
      type,
      id,
      '',
      group_id,
      '',
      text,
    );
    if (response.data.api_status == 200) {
      if (isMarket === 'SHARE_MARKET') {
        navigation.pop(2);
      } else {
        isShortVideo === 'true'
          ? navigation.pop(2)
          : navigation.navigate('BottomTabNavigator');
      }
    } else {
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};
export const sharePostOnPage = async (
  type,
  id,
  page_id,
  text,
  navigation,
  isShortVideo,
  isMarket,
) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestSharePost(
      accessTokenValue,
      type,
      id,
      '',
      '',
      page_id,
      text,
    );
    if (response.data.api_status == 200) {
      if (isMarket === 'SHARE_MARKET') {
        navigation.pop(2);
      } else {
        isShortVideo === 'true'
          ? navigation.pop(2)
          : navigation.navigate('BottomTabNavigator');
      }
    } else {
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};
export const savePost = async (postid, action) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestSavePost(accessTokenValue, postid, action);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const hidePost = async postid => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestHidePost(accessTokenValue, postid);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const sharePostOnTimeLine = async (
  type,
  id,
  user_id,
  text,
  navigation,
  isShortVideo,
  isMarket,
) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestSharePost(
      accessTokenValue,
      type,
      id,
      user_id,
      '',
      '',
      text,
    );
    if (response.data.api_status == 200) {
      if (isMarket === 'SHARE_MARKET') {
        navigation.pop();
      } else {
        isShortVideo === 'true'
          ? navigation.pop()
          : navigation.navigate('BottomTabNavigator');
      }
      // navigation.pop();
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};
export const editPost = async (postid, action, text, selectedPostPrivacy) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestEditPost(
      accessTokenValue,
      postid,
      action,
      text,
      selectedPostPrivacy,
    );
    if (response.data.api_status == 200) {
      // navigation.navigate('BottomTabNavigator');
    } else {
      // return response.data;
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAcceptFollowUser = async (request_action, user_id) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestFollowRequestAction(
      accessTokenValue,
      user_id,
      request_action,
    );

    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitVerficationRequest = async (
  data,
  yourphoto,
  yourpassport,
) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    console.log(accessTokenValue);
    const response = await requestVerification(
      data,
      yourphoto,
      yourpassport,
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

export const changePassword = async (new_password, current_password) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestChangePassword(
      new_password,
      current_password,
      accessTokenValue,
    );
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    return error;
  }
};

export const twoFactorOtp = async () => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestTwoFactorOTP(accessTokenValue);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchReaction = async (type, id, reaction, limit, offset) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestReaction(
      accessTokenValue,
      type,
      id,
      reaction,
    );
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const twoFactorON = async otp => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestTwoFactorOn(otp, accessTokenValue);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const twoFactorOFF = async () => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestTwoFactorOff(accessTokenValue);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const geSessionList = async () => {
  // const startTime = performance.now();
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestSessionList(accessTokenValue);
    // const endTime = performance.now();
    // const elapsedTime = endTime - startTime;

    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sessionDelete = async sessionId => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestSessionDelete(sessionId, accessTokenValue);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const accountDelete = async password => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.userInfoData});
    const loginAccess = await retrieveJsonData({
      key: storeKeys.loginCredential,
    });
    const accessTokenValue = loginAccess.access_token;
    const response = await requestDeleteAccount(
      loginData.username,
      password,
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

export const submitFriendRequest = async userId => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await friendRequest(userId, accessTokenValue);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const gettingGroupPostById = async userId => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestGroupPostById(userId, accessTokenValue);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitFollowRequest = async user_id => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await followRequest(user_id, accessTokenValue);
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

export const submitLikePage = async page_id => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestLikePage(page_id, accessTokenValue);
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

export const submitJoinGroup = async group_id => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestJoinGroup(group_id, accessTokenValue);
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

export const submitReportUser = async (user, text) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestReportUser(user, text, accessTokenValue);
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

export const submitCommentReact = async (type, comment_id, reaction) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestCommentReact(
      type,
      comment_id,
      reaction,
      accessTokenValue,
    );
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

export const submitCommentReactReply = async (type, reply_id, reaction) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestCommentReactReply(
      type,
      reply_id,
      reaction,
      accessTokenValue,
    );
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

export const submitCreateInvitationLink = async type => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;

    const response = await requestCreateInvitationLink(type, accessTokenValue);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getVersionControl = async (versionName, platform) => {
  try {
    const response = await requestVersionControl(versionName, platform);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getAllEventsList = async () => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestAllEvents(accessTokenValue);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getGoingEventList = async () => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestGoingEvent(accessTokenValue);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getMyEventList = async () => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestMyEvent(accessTokenValue);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getInvitedEventList = async () => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestInvitedEvent(accessTokenValue);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getInterestedEventList = async () => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestInterestedEvent(accessTokenValue);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getPastEventList = async () => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestPastEvent(accessTokenValue);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getEventById = async id => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestGetEvent(id, accessTokenValue);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// export const requestProduct = async () => {
//   try {
//     const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
//     const accessTokenValue = loginData.access_token;
//     const response = await getProduct(accessTokenValue);
//     if (response.data.api_status == 200) {
//       // Alert.alert('Success Loading Market');
//     } else {
//     }
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const filterProduct = async (category_id, keyword, distance) => {
//   try {
//     const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
//     const accessTokenValue = loginData.access_token;
//     const response = await filterProductList(
//       accessTokenValue,
//       category_id,
//       keyword,
//       distance,
//     );

//     if (response.data.api_status == 200) {
//       // Success logic here
//     } else {
//     }

//     return response.data;
//   } catch (error) {
//     if (error.response) {
//       // The request was made, and the server responded with a status code that falls out of the range of 2xx
//     } else if (error.request) {
//       // The request was made but no response was received
//     } else {
//       // Something happened in setting up the request that triggered an Error
//     }
//     throw error;
//   }
// };

// export const getMyProductList = async category_id => {
//   try {
//     const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
//     const accessTokenValue = loginData.access_token;
//     const userId = loginData.user_id;
//     const response = await filterMyProduct(
//       userId,
//       category_id,
//       accessTokenValue,
//     );

//     if (response.data.api_status == 200) {
//       // Success logic here
//     } else {
//     }

//     return response.data;
//   } catch (error) {
//     if (error.response) {
//       // The request was made, and the server responded with a status code that falls out of the range of 2xx
//     } else if (error.request) {
//       // The request was made but no response was received
//     } else {
//       // Something happened in setting up the request that triggered an Error
//     }
//     throw error;
//   }
// };

// export const getOrderedList = async category_id => {
//   try {
//     const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
//     const accessTokenValue = loginData.access_token;
//     const userId = loginData.user_id;
//     const response = await getOrdersListed(accessTokenValue);

//     if (response.data.api_status == 200) {
//       // Success logic here
//     } else {
//     }

//     return response.data;
//   } catch (error) {
//     if (error.response) {
//       // The request was made, and the server responded with a status code that falls out of the range of 2xx
//     } else if (error.request) {
//       // The request was made but no response was received
//     } else {
//       // Something happened in setting up the request that triggered an Error
//     }
//     throw error;
//   }
// };

// export const requestAddress = async type => {
//   try {
//     const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
//     const accessTokenValue = loginData.access_token;
//     const response = await requestAddressList(accessTokenValue, type);

//     if (response.data.api_status == 200) {
//       // Success logic here
//       // Alert.alert('Success');
//     } else {
//     }

//     return response.data;
//   } catch (error) {
//     if (error.response) {
//       // The request was made, and the server responded with a status code that falls out of the range of 2xx
//     } else if (error.request) {
//       // The request was made but no response was received
//     } else {
//       // Something happened in setting up the request that triggered an Error
//     }
//     throw error;
//   }
// };

// export const requestCheckoutCartList = async type => {
//   try {
//     const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
//     const accessTokenValue = loginData.access_token;
//     const response = await getCheckoutList(accessTokenValue, type);

//     if (response.data.api_status == 200) {
//       // Success logic here
//       // Alert.alert('Success');
//     } else {
//     }

//     return response.data;
//   } catch (error) {
//     if (error.response) {
//       // The request was made, and the server responded with a status code that falls out of the range of 2xx
//     } else if (error.request) {
//       // The request was made but no response was received
//     } else {
//       // Something happened in setting up the request that triggered an Error
//     }
//     throw error;
//   }
// };

// export const requestAddToCart = async (type, productId, quantity) => {
//   try {
//     const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
//     const accessTokenValue = loginData.access_token;
//     const response = await submitAddToCart(
//       accessTokenValue,
//       type,
//       productId,
//       quantity,
//     );

//     if (response.data.api_status == 200) {
//       // Success logic here
//       // Alert.alert('Success');
//     } else {
//     }

//     return response.data;
//   } catch (error) {
//     if (error.response) {
//       // The request was made, and the server responded with a status code that falls out of the range of 2xx
//     } else if (error.request) {
//       // The request was made but no response was received
//     } else {
//       // Something happened in setting up the request that triggered an Error
//     }
//     throw error;
//   }
// };

// export const requestChangeAddToCartQty = async (type, productId, quantity) => {
//   try {
//     const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
//     const accessTokenValue = loginData.access_token;
//     const response = await submitChangeAddToCartQty(
//       accessTokenValue,
//       type,
//       productId,
//       quantity,
//     );

//     if (response.data.api_status == 200) {
//       // Success logic here
//       // Alert.alert('Success');
//     } else {
//     }

//     return response.data;
//   } catch (error) {
//     if (error.response) {
//       // The request was made, and the server responded with a status code that falls out of the range of 2xx
//     } else if (error.request) {
//       // The request was made but no response was received
//     } else {
//       // Something happened in setting up the request that triggered an Error
//     }
//     throw error;
//   }
// };

// export const buyRequest = async (type, address_id) => {
//   try {
//     const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
//     const accessTokenValue = loginData.access_token;
//     const response = await submitBuyProduct(accessTokenValue, type, address_id);

//     if (response.data.api_status == 200) {
//       // Success logic here
//       // Alert.alert('Success');
//     } else {
//     }

//     return response.data;
//   } catch (error) {
//     if (error.response) {
//       // The request was made, and the server responded with a status code that falls out of the range of 2xx
//     } else if (error.request) {
//       // The request was made but no response was received
//     } else {
//       // Something happened in setting up the request that triggered an Error
//     }
//     throw error;
//   }
// };

// export const requestChangeProductQty = async (type, product_id, qty) => {
//   try {
//     const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
//     const accessTokenValue = loginData.access_token;
//     const response = await submitChangeProductQty(
//       accessTokenValue,
//       type,
//       product_id,
//       qty,
//     );

//     if (response.data.api_status == 200) {
//       // Success logic here
//       // Alert.alert('Success');
//     } else {
//     }

//     return response.data;
//   } catch (error) {
//     if (error.response) {
//       // The request was made, and the server responded with a status code that falls out of the range of 2xx
//     } else if (error.request) {
//       // The request was made but no response was received
//     } else {
//       // Something happened in setting up the request that triggered an Error
//     }
//     throw error;
//   }
// };

// export const deleteAddress = async (type, id) => {
//   try {
//     const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
//     const accessTokenValue = loginData.access_token;
//     const response = await requestDelete(accessTokenValue, type, id);

//     if (response.data.api_status == 200) {
//       // Success logic here
//       // Alert.alert('Success');
//     } else {
//     }

//     return response.data;
//   } catch (error) {
//     if (error.response) {
//       // The request was made, and the server responded with a status code that falls out of the range of 2xx
//     } else if (error.request) {
//       // The request was made but no response was received
//     } else {
//       // Something happened in setting up the request that triggered an Error
//     }
//     throw error;
//   }
// };

// export const deleteProduct = async (type, post_id) => {
//   try {
//     const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
//     const accessTokenValue = loginData.access_token;
//     const response = await requestProductDelete(
//       accessTokenValue,
//       type,
//       post_id,
//     );

//     if (response.data.api_status == 200) {
//       // Success logic here
//       // Alert.alert('Success');
//     } else {
//     }

//     return response.data;
//   } catch (error) {
//     if (error.response) {
//       // The request was made, and the server responded with a status code that falls out of the range of 2xx
//     } else if (error.request) {
//       // The request was made but no response was received
//     } else {
//       // Something happened in setting up the request that triggered an Error
//     }
//     throw error;
//   }
// };

// export const submitDeleteCart = async (type, productId) => {
//   try {
//     const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
//     const accessTokenValue = loginData.access_token;
//     const response = await requestDeleteCart(accessTokenValue, type, productId);

//     if (response.data.api_status == 200) {
//       // Success logic here
//       // Alert.alert('Success');
//     } else {
//     }

//     return response.data;
//   } catch (error) {
//     if (error.response) {
//       // The request was made, and the server responded with a status code that falls out of the range of 2xx
//     } else if (error.request) {
//       // The request was made but no response was received
//     } else {
//       // Something happened in setting up the request that triggered an Error
//     }
//     throw error;
//   }
// };

// export const requestPurchase = async () => {
//   try {
//     const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
//     const accessTokenValue = loginData.access_token;
//     const response = await getPurchased(accessTokenValue);
//     if (response.data.api_status == 200) {
//       // Alert.alert('Success Loading Market');
//     } else {
//     }
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const requestSendInvoice = async orderHashId => {
//   try {
//     const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
//     const accessTokenValue = loginData.access_token;
//     const response = await sendInvoiceEmail(accessTokenValue, orderHashId);
//     if (response.data.api_status == 200) {
//       // Alert.alert('Success Loading Market');
//     } else {
//     }
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const requestMyProduct = async () => {
//   try {
//     const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
//     const accessTokenValue = loginData.access_token;
//     const user_id = loginData.user_id;
//     const response = await getMyProduct(user_id, accessTokenValue);
//     if (response.data.api_status == 200) {
//       // Alert.alert('Success Loading Market');
//     } else {
//     }
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

export const requestResendEmailActivation = async email => {
  try {
    const response = await requestResendEmail(email);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getEventInterested = async id => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestGetEventInterested(id, accessTokenValue);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getEventGoing = async id => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestGetEventGoing(id, accessTokenValue);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getAdsData = async () => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const response = await requestAds(loginData.access_token);

    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitUpdatePrivacySetting = async (
  type,
  value,
  // confirm_followers,
  // show_activities_privacy,
  // birth_privacy,
  // share_my_location,
) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;

    const response = await requestUpdatePrivacySetting(
      type,
      value,
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

export const getRegisterConfig = async () => {
  try {
    const response = await requestRegisterConfigSetting();

    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitCreateEvent = async (
  eventName,
  startDate,
  startTime,
  endDate,
  endTime,
  eventPhoto,
  eventLocation,
  eventDescription,
) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;

    const response = await requestCreateEvent(
      eventName,
      startDate,
      startTime,
      endDate,
      endTime,
      eventPhoto,
      eventLocation,
      eventDescription,
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

export const submitDeleteEvent = async (eventId, type) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestDeleteEvent(
      accessTokenValue,
      eventId,
      'delete',
    );
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateEvent = async (
  eventId,
  eventName,
  startDate,
  starttime,
  endDate,
  endtime,
  photo,
  location,
  descript,
) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestEditEvent(
      'edit',
      eventId,
      eventName,
      startDate,
      starttime,
      endDate,
      endtime,
      photo,
      location,
      descript,
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

export const submitCreateProduct = async (
  productName,
  productPrice,
  productCurrency,
  productCategory,
  productDescription,
  productCondition,
  productPhotos,
  productLocation,
  productUnit,
) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;

    const response = await requestCreateProduct(
      productName,
      productPrice,
      productCurrency,
      productCategory,
      productDescription,
      productCondition,
      productPhotos,
      productLocation,
      productUnit,
      accessTokenValue,
    );

    if (response && response.api_status === 200) {
      return response;
    } else {
      console.error('Unexpected API response:', response);
      throw new Error('Unexpected API response');
    }
  } catch (error) {
    console.error('Error submitting product:', error.message);
    throw error;
  }
};

export const submitConfirmCodeUnusual = async (
  unsual_login_username,
  confirm_code,
) => {
  try {
    // const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    // const accessTokenValue = loginData.access_token;

    const response = await requestConfirmCodeUnusual(
      unsual_login_username,
      confirm_code,
      // accessTokenValue,
    );
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitTwoFactorConfirm = async (email_or_phone, code) => {
  try {
    // const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    // const accessTokenValue = loginData.access_token;

    const response = await requestTwoFactorConfirmation(
      email_or_phone,
      code,
      // accessTokenValue,
    );
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// export const submitAddress = async (
//   name,
//   phone,
//   country,
//   city,
//   zip,
//   address,
// ) => {
//   try {
//     const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
//     const accessTokenValue = loginData.access_token;

//     const response = await requestCreateAddress(
//       name,
//       phone,
//       country,
//       city,
//       zip,
//       address,
//       accessTokenValue,
//     );
//     if (response.data.api_status == 200) {
//     } else {
//     }
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const updateAddress = async (
//   id,
//   name,
//   phone,
//   country,
//   city,
//   zip,
//   address,
// ) => {
//   try {
//     const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
//     const accessTokenValue = loginData.access_token;

//     const response = await requestUpdateAddress(
//       id,
//       name,
//       phone,
//       country,
//       city,
//       zip,
//       address,
//       accessTokenValue,
//     );
//     if (response.data.api_status == 200) {
//     } else {
//     }
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const updateProduct = async (
//   id,
//   productName,
//   productPrice,
//   currency,
//   productLocation,
//   productCategory,
//   productItem,
//   productDescription,
//   condition,
//   images,
//   imgId,
// ) => {
//   try {
//     const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
//     const accessTokenValue = loginData.access_token;

//     const response = await requestUpdateProduct(
//       id,
//       productName,
//       productPrice,
//       currency,
//       productLocation,
//       productCategory,
//       productItem,
//       productDescription,
//       condition,
//       images,
//       imgId,
//       accessTokenValue,
//     );
//     if (response.data.api_status == 200) {
//     } else {
//     }
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

export const submitActivateAccount = async (email_or_phone, code) => {
  try {
    // const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    // const accessTokenValue = loginData.access_token;

    const response = await requestActivateAccount(
      email_or_phone,
      code,
      // accessTokenValue,
    );
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const requestResendSMSActivation = async phone_num => {
  try {
    const response = await requestResendSms(phone_num);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitTwoFactorSetting = async () => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestTwoFactorSetting(accessTokenValue);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitUpdateTwoFactor = async (
  type,
  factor_method,
  code,
  phone_number,
) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestUpdateTwoFactor(
      type,
      factor_method,
      code,
      phone_number,
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

export const submitBankWithdraw = async (type, amount, bank, name) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestWithdrawBank(
      'bank',
      amount,
      bank,
      name,
      accessTokenValue,
    );
    if (response.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitKBZWithdraw = async (type, full_name, amount) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestWithdrawKBZ(
      'bank',
      full_name,
      amount,
      accessTokenValue,
    );
    if (response.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to request bank withdrawal by making an API call

export const submitSendMoney = async (type, note, amount, user_id) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestSendMoney(
      'send',
      note,
      amount,
      user_id,
      accessTokenValue,
    );
    if (response.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitBankTransfer = async (type, amount, photo) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestBankTransfer(
      type,
      amount,
      photo,
      accessTokenValue,
    );
    if (response.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitNewPlan = async (
  type,
  title,
  price,
  currency,
  period,
  description,
) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestNewPlan(
      type,
      title,
      price,
      currency,
      period,
      description,
      accessTokenValue,
    );
    if (response.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UpdateNewPlan = async (
  type,
  id,
  title,
  price,
  currency,
  period,
  description,
) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestNewPlan(
      type,
      id,
      title,
      price,
      currency,
      period,
      description,
      accessTokenValue,
    );
    if (response.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitChangeOrderStatus = async (type, hash_order, status) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestChangeOrderStatus(
      type,
      hash_order,
      status,
      accessTokenValue,
    );
    if (response.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitReviewProduct = async (
  type,
  review,
  rating,
  product_id,
  reviewPhotos,
) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestReviewProduct(
      type,
      review,
      rating,
      product_id,
      reviewPhotos,
      accessTokenValue,
    );
    if (response.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitGetCurrencies = async type => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestGetCurrencies(type, accessTokenValue);
    if (response.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitEventInvite = async (user_id, event_id) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestEventInvite(
      user_id,
      event_id,
      accessTokenValue,
    );
    if (response.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitGetNotInEventMember = async event_id => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestNotInEventMember(event_id, accessTokenValue);
    if (response.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const submitVerificationRequest = async pageId => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestPageVerification(pageId, accessTokenValue);
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
export const updateSocailLinks = async (
  page_id,
  facebook,
  twitter,
  instagram,
  telegram,
  viber,
  youtube,
) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestSocailLinks(
      page_id,
      facebook,
      twitter,
      instagram,
      telegram,
      viber,
      youtube,
      accessTokenValue,
    );
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

export const submitAdmin = async (pageId, userId) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestAdmin(pageId, userId, accessTokenValue);
    if (response.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPageAdmin = async page_id => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestPageAdmin(page_id, accessTokenValue);
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

export const submitUpdateAdminSettings = async (
  pageId,
  userId,
  general,
  info,
  social,
  avatar,
  admins,
  delete_page,
) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;

    const response = await requestUpdateAdminSetting(
      pageId,
      userId,
      general,
      info,
      social,
      avatar,
      admins,
      delete_page,
      accessTokenValue,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const submitGroupAdmin = async (groupId, userId) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestGroupAdmin(groupId, userId, accessTokenValue);
    if (response.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeGroupMember = async (groupId, userId) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;
    const response = await requestRemoveGroupAdmin(
      groupId,
      userId,
      accessTokenValue,
    );
    if (response.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitUpdateGroupAdminSettings = async (
  pageId,
  userId,
  general,
  privacy,
  avatar,
  member,
  analytics,
  delete_group,
) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;

    const response = await requestUpdateGroupAdminSetting(
      pageId,
      userId,
      general,
      privacy,
      avatar,
      member,
      analytics,
      delete_group,
      accessTokenValue,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateGroupPrivacy = async (groupId, privacy, joinPrivacy) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const accessTokenValue = loginData.access_token;

    const response = await requestUpdateGroupPrivacy(
      groupId,
      privacy,
      joinPrivacy,
      accessTokenValue,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
