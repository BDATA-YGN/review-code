import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert, Platform} from 'react-native';
import ApiService from './ApiService';
import {SERVER_KEY} from '../config';
import {all} from 'axios';
import {useId} from 'react';
import {stringKey} from '../constants/StringKey';
import {relationship} from '../constants/CONSTANT_ARRAY';
import {logJsonData} from './LiveStream/logFile';

export const getData = async name => {
  try {
    const data = JSON.parse(await AsyncStorage.getItem(name));
    return data;
  } catch (error) {}
};
export const requestPosts = (
  type,
  filter,
  postId,
  userId,
  accessToken,
  limit,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  formData.append('after_post_id', postId);

  formData.append('limit', limit);
  // formData.append('filter', 1);
  // formData.append('post_type', filter)
  // logJsonData('====FormData ====>', formData);
  return ApiService.post(`api/posts?access_token=${accessToken}`, formData);
};

export const requestSavedPosts = (
  type,
  filter,
  postId,
  userId,
  accessToken,
  limit,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  formData.append('after_post_id', postId);

  formData.append('limit', limit);
  // formData.append('filter', 1);
  // formData.append('post_type', filter)

  return ApiService.post(`api/posts?access_token=${accessToken}`, formData);
};
export const requestPopularPosts = (
  filter,
  postId,
  userId,
  accessToken,
  limit,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);

  formData.append('after_post_id', 5499);

  formData.append('limit', limit);
  // logJsonData('Form Data', formData);
  // formData.append('filter', 1);
  // formData.append('post_type', filter)

  return ApiService.post(
    `api/most_liked?access_token=${accessToken}`,
    formData,
  );
};

export const requestPostsOfUserProfile = (
  type,
  filter,
  postId,
  accessToken,
  user_id,
  limit,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  formData.append('after_post_id', postId);
  formData.append('id', user_id);
  formData.append('limit', limit);
  // formData.append('filter', 1);
  // formData.append('post_type', filter)
  return ApiService.post(`api/posts?access_token=${accessToken}`, formData);
};

export const loggingIn = ({username, password}) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('username', username);
  formData.append('password', password);
  return ApiService.post('api/auth', formData);
};
export const requestUserInfoData = (userId, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('fetch', 'user_data');
  formData.append('user_id', userId);
  return ApiService.post(
    `api/get-user-data?access_token=${access_token}`,
    formData,
  );
};
export const requestStories = accessToken => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  return ApiService.post(
    `api/get-user-stories?access_token=${accessToken}`,
    formData,
  );
};

export const requestRegisteration = ({
  first_name,
  last_name,
  username,
  email,
  phone,
  password,
  access_token,
  gender,
}) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  if (username == null) {
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
  } else {
    formData.append('username', username);
  }

  formData.append('email', email);
  if (phone != null) {
    formData.append('phone_num', phone);
  }
  formData.append('password', password);
  formData.append('confirm_password', password);
  formData.append('gender', gender);
  console.log(formData);

  return ApiService.post(
    `api/create-account?access_token=${access_token}`,
    formData,
  );
};

export const getFollowersAndFollowings = (type, user_id, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  formData.append('user_id', user_id);
  return ApiService.post(
    `api/get-friends?access_token=${access_token}`,
    formData,
  );
};

// get Friends list

export const requestGetFriend = (type, user_id, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  formData.append('user_id', user_id);
  return ApiService.post(
    `api/get-friends?access_token=${access_token}`,
    formData,
  );
};
export const requestForgotPasswordEmail = ({email}) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);

  formData.append('email', email);

  return ApiService.post('api/send-reset-password-email', formData);
};

export const requestForgotPasswordSMS = ({phone_num}) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);

  formData.append('phone_num', phone_num);

  return ApiService.post('api/send-reset-password-email', formData);
};

export const requestForgotPasswordCode = ({email, code}) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('email', email);
  formData.append('code', code);
  return ApiService.post('api/email-code-verify', formData);
};

export const requestForgotPasswordSmsCode = ({phone_num, code}) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('phone_num', phone_num);
  formData.append('code', code);
  return ApiService.post('api/email-code-verify', formData);
};

export const requestPostLike = (accessToken, postid, action, reaction) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('post_id', postid);
  formData.append('action', action);
  formData.append('reaction', reaction);

  console.log('Reaction =>', formData);

  return ApiService.post(
    `api/post-actions?access_token=${accessToken}`,
    formData,
  );
};

export const makeReaction = async (accessToken, postId, reactType) => {
  try {
    const formData = new FormData();
    formData.append('server_key', SERVER_KEY);
    formData.append('post_id', postId);
    formData.append('action', 'reaction');
    formData.append('reaction', reactType);
    const response = await ApiService.post(
      `api/post-actions?access_token=${accessToken}`,
      formData,
    );
    return response.data;
  } catch (error) {
    console.error('Error in reaction', error);
    throw error;
  }
};
export const requestForgotPasswordUpdate = ({
  new_password,
  phone_num,
  email,
  code,
}) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  if (email != null) {
    formData.append('email', email);
  }
  if (phone_num != null) {
    formData.append('phone_num', phone_num);
  }

  formData.append('code', code);
  formData.append('new_password', new_password);
  return ApiService.post('api/reset_password', formData);
};

export const requestMyPageList = (access_token, type) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  return ApiService.post(
    `api/get-my-pages?access_token=${access_token}`,
    formData,
  );
};

export const requestMyGroupList = (access_token, type) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  return ApiService.post(
    `api/get-my-groups?access_token=${access_token}`,
    formData,
  );
};

export const requestAddPost = (
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
  access_token,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('postText', postText);
  postPhotos.forEach((image, index) => {
    formData.append('postPhotos[]', {
      uri: image.uri,
      type: 'image/jpeg',
      name: `postPhoto${index}.jpg`,
    });
  });

  if (postGif != null) {
    formData.append('postPhotos[]', {
      uri: postGif.uri,
      type: 'image/gif',
      name: 'postGif.gif',
    });
  }

  // if (postVideo != null) {
  //   formData.append('postVideo', {
  //     uri: postVideo.uri,
  //     type: 'video/mp4',
  //     name: 'postVideo.mp4',
  //   });
  // }
  if (postVideo != null) {
    formData.append('postFile', {
      uri: postVideo.uri,
      type: 'video/mp4',
      name: 'postVideo.mp4',
    });
  }

  formData.append('postPrivacy', selectedPostPrivacy);
  formData.append('feeling_type', feelingType);
  formData.append('feeling', feeling);
  {
    postType === stringKey.navigateToMyPage &&
      formData.append('page_id', userId);
  }
  {
    postType === stringKey.navigateToMyGroup &&
      formData.append('group_id', userId);
  }
  return ApiService.post(`api/new_post?access_token=${access_token}`, formData);
};
export const requestLikedPageList = (access_token, type, user_id) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  formData.append('user_id', user_id);
  return ApiService.post(
    `api/get-my-pages?access_token=${access_token}`,
    formData,
  );
};

export const requestLikedGroupList = (access_token, type, user_id) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  formData.append('user_id', user_id);
  return ApiService.post(
    `api/get-my-groups?access_token=${access_token}`,
    formData,
  );
};

export const likeUnlikeRequest = (page_id, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('page_id', page_id);
  return ApiService.post(
    `api/like-page?access_token=${access_token}`,
    formData,
  );
};

export const joinGroupRequest = (group_id, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('group_id', group_id);
  return ApiService.post(
    `api/join-group?access_token=${access_token}`,
    formData,
  );
};

export const requestRecommendedGroupOrPageList = (access_token, type) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  formData.append('limit', 50);
  return ApiService.post(
    `api/fetch-recommended?access_token=${access_token}`,
    formData,
  );
};
export const requestCommentData = (
  type,
  postid,
  text,
  commentid,
  image,
  accessToken,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  formData.append('text', text);
  formData.append('post_id', postid);
  formData.append('comment_id', commentid);
  formData.append('image', image);
  return ApiService.post(`api/comments?access_token=${accessToken}`, formData);
};

export const requestMembers = (group_id, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('group_id', group_id);
  return ApiService.post(
    `api/not_in_group_member?access_token=${access_token}`,
    formData,
  );
};

export const requestPageMembers = (page_id, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('page_id', page_id);
  return ApiService.post(
    `api/not_in_page_member?access_token=${access_token}`,
    formData,
  );
};

export const submitInvitee = (group_id, user_id, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('group_id', group_id);
  formData.append('user_id', user_id);
  return ApiService.post(
    `api/group_add?access_token=${access_token}`,
    formData,
  );
};

export const requestReplyCommentData = (type, commentid, accessToken) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);

  formData.append('comment_id', commentid);

  return ApiService.post(`api/comments?access_token=${accessToken}`, formData);
};
export const requestReplyCommentLike = (type, reply_id, accessToken) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);

  formData.append('reply_id', reply_id);

  return ApiService.post(`api/comments?access_token=${accessToken}`, formData);
};
export const requestReportComment = (comment_id, accessToken) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('comment_id', comment_id);
  return ApiService.post(
    `api/report_comment?access_token=${accessToken}`,
    formData,
  );
};
export const requestDeleteComment = (type, comment_id, accessToken) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);

  formData.append('comment_id', comment_id);

  return ApiService.post(`api/comments?access_token=${accessToken}`, formData);
};
export const requestDeleteReplyComment = (type, reply_id, accessToken) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  formData.append('reply_id', reply_id);
  return ApiService.post(`api/comments?access_token=${accessToken}`, formData);
};
export const requestEditComment = (type, comment_id, text, accessToken) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);

  formData.append('comment_id', comment_id);
  formData.append('text', text);
  return ApiService.post(`api/comments?access_token=${accessToken}`, formData);
};
export const requestEditReplyComment = (type, reply_id, text, accessToken) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  formData.append('reply_id', reply_id);
  formData.append('text', text);

  return ApiService.post(`api/comments?access_token=${accessToken}`, formData);
};
export const submitPageInvitee = (page_id, user_id, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('page_id', page_id);
  formData.append('user_id', user_id);
  return ApiService.post(`api/page_add?access_token=${access_token}`, formData);
};

export const submitCreatePage = (
  page_name,
  page_title,
  category,
  about,
  access_token,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('page_name', page_name);
  formData.append('page_title', page_title);
  formData.append('page_category', category);
  formData.append('page_description', about);
  return ApiService.post(
    `api/create-page?access_token=${access_token}`,
    formData,
  );
};

export const submitCreateGroup = (
  group_name,
  group_title,
  category,
  about,
  access_token,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('group_name', group_name);
  formData.append('group_title', group_title);
  formData.append('category', category);
  formData.append('about', about);
  return ApiService.post(
    `api/create-group?access_token=${access_token}`,
    formData,
  );
};

export const submitUpdatePage = (
  page_id,
  page_title,

  page_name,
  category,
  users_post,
  pageAction,
  actionLink,
  access_token,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('page_id', page_id);
  formData.append('page_title', page_title);
  formData.append('page_name', page_name);
  formData.append('page_category', category);
  formData.append('users_post', users_post);
  formData.append('call_action_type', pageAction);
  formData.append('call_action_type_url', actionLink);
  console.log(formData);
  return ApiService.post(
    `api/update-page-data?access_token=${access_token}`,
    formData,
  );
};

export const requestPagedata = (page_id, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('page_id', page_id);
  console.log(formData);
  return ApiService.post(
    `api/get-page-data?access_token=${access_token}`,
    formData,
  );
};

export const requestGroupdata = (id, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('group_id', id);
  return ApiService.post(
    `api/get-group-data?access_token=${access_token}`,
    formData,
  );
};

export const submitUpdatePageInfo = (
  page_id,
  company,
  phone,
  address,
  website,
  page_description,
  access_token,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('page_id', page_id);
  formData.append('company', company);
  formData.append('phone', phone);
  formData.append('address', address);
  formData.append('website', website);
  formData.append('page_description', page_description);
  return ApiService.post(
    `api/update-page-data?access_token=${access_token}`,
    formData,
  );
};

export const submitDeletePage = (password, page_id, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('page_id', page_id);
  formData.append('password', password);
  return ApiService.post(
    `api/delete_page?access_token=${access_token}`,
    formData,
  );
};

export const requestGroupMembers = (group_id, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('group_id', group_id);
  return ApiService.post(
    `api/get_group_members?access_token=${access_token}`,
    formData,
  );
};

export const submitUpdateGroup = (
  group_id,
  group_title,
  group_name,

  category,
  about,
  access_token,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('group_id', group_id);
  formData.append('group_name', group_name);
  formData.append('group_title', group_title);
  formData.append('category', category);
  formData.append('about', about);
  console.log(formData);
  return ApiService.post(
    `api/update-group-data?access_token=${access_token}`,
    formData,
  );
};

export const submitDeleteGroup = (password, group_id, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('group_id', group_id);
  formData.append('password', password);
  return ApiService.post(
    `api/delete_group?access_token=${access_token}`,
    formData,
  );
};
export const requestSearch = (search_key, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('search_key', search_key);
  // formData.append('limit', 2);
  return ApiService.post(`api/search?access_token=${access_token}`, formData);
};
export const requestNotifications = accessToken => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('fetch', 'notifications,announcement');
  return ApiService.post(
    `api/get-general-data?access_token=${accessToken}`,
    formData,
  );
};

export const requestFriendRequest = accessToken => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('fetch', 'friend_requests');
  return ApiService.post(
    `api/get-general-data?access_token=${accessToken}`,
    formData,
  );
};

export const requestMyActivities = accessToken => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('limit', 10);
  // formData.append('limit',1)
  // formData.append('fetch', 'notifications,announcement');
  return ApiService.post(
    `api/get-activities?access_token=${accessToken}`,
    formData,
  );
};

export const requestFriendBirthdays = accessToken => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  return ApiService.post(
    `api/get_friends_birthday?access_token=${accessToken}`,
    formData,
  );
};

export const requestChangeCoverOrAvatar = (
  userId,
  type,
  image,
  accessToken,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('user_id', userId);
  formData.append('image_type', type);
  formData.append('image', {
    uri: image,
    type: 'image/jpeg',
    name: 'yourPhoto.jpg',
  });
  return ApiService.post(
    `api/update_profile_picture?access_token=${accessToken}`,
    formData,
  );
};

export const requestChangePageAvatar = (pageId, image, accessToken) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('page_id', pageId);
  formData.append('avatar', {
    uri: image,
    type: 'image/jpeg',
    name: 'yourPhoto.jpg',
  });
  return ApiService.post(
    `api/update-page-data?access_token=${accessToken}`,
    formData,
  );
};

export const requestChangePageCover = (pageId, image, accessToken) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('page_id', pageId);
  formData.append('cover', {
    uri: image,
    type: 'image/jpeg',
    name: 'yourPhoto.jpg',
  });
  return ApiService.post(
    `api/update-page-data?access_token=${accessToken}`,
    formData,
  );
};

export const requestChangeGroupCover = (groupId, image, accessToken) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('group_id', groupId);
  formData.append('cover', {
    uri: image,
    type: 'image/jpeg',
    name: 'yourPhoto.jpg',
  });
  return ApiService.post(
    `api/update-group-data?access_token=${accessToken}`,
    formData,
  );
};

export const requestChangeGroupAvatar = (groupId, image, accessToken) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('group_id', groupId);
  formData.append('avatar', {
    uri: image,
    type: 'image/jpeg',
    name: 'yourPhoto.jpg',
  });
  return ApiService.post(
    `api/update-group-data?access_token=${accessToken}`,
    formData,
  );
};

export const requestVideoPost = (afterPostId, accessToken) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', 'get_random_videos');
  // formData.append('id', id);
  formData.append('after_post_id', afterPostId);
  formData.append('limit', 7);
  // formData.append('filter', 1);
  // formData.append('post_type', filter)
  return ApiService.post(`api/posts?access_token=${accessToken}`, formData);
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
export const requestSharePost = (
  accessToken,
  type,
  id,
  user_id,
  group_id,
  page_id,
  text,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  formData.append('id', id);
  formData.append('user_id', user_id);
  formData.append('group_id', group_id);
  formData.append('page_id', page_id);
  formData.append('text', text);

  return ApiService.post(`api/posts?access_token=${accessToken}`, formData);
};
export const requestSavePost = (accessToken, postid, action, reaction) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('post_id', postid);
  formData.append('action', action);

  return ApiService.post(
    `api/post-actions?access_token=${accessToken}`,
    formData,
  );
};

export const requestHidePost = (accessToken, postid) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('post_id', postid);
  return ApiService.post(`api/hide_post?access_token=${accessToken}`, formData);
};
export const requestUpdateMyProfile = (
  valuesOptional,
  relationship,
  access_token,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('first_name', valuesOptional[0]);
  formData.append('last_name', valuesOptional[1]);
  formData.append('address', valuesOptional[2]);
  formData.append('about', valuesOptional[3]);
  formData.append('website', valuesOptional[4]);
  formData.append('working', valuesOptional[5]);
  formData.append('school', valuesOptional[6]);
  formData.append('relationship', relationship);
  console.log('formdata', formData);
  return ApiService.post(
    `api/update-user-data?access_token=${access_token}`,
    formData,
  );
};

export const requestUpdateMyAccount = (
  valuesOptional,
  country_id,
  birthday,
  gender,
  access_token,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('username', valuesOptional[0]);
  formData.append('email', valuesOptional[1]);
  formData.append('phone_number', valuesOptional[2]);
  formData.append('country_id', country_id);
  formData.append('birthday', birthday);
  formData.append('gender', gender);
  return ApiService.post(
    `api/update-user-data?access_token=${access_token}`,
    formData,
  );
};

export const requestBlockedList = access_token => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  return ApiService.post(
    `api/get-blocked-users?access_token=${access_token}`,
    formData,
  );
};

export const requestBlock = (userId, blockType, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('user_id', userId);
  formData.append('block_action', blockType);
  return ApiService.post(
    `api/block-user?access_token=${access_token}`,
    formData,
  );
};
export const requestEditPost = (
  accessToken,
  postid,
  action,
  text,
  selectedPostPrivacy,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('post_id', postid);
  formData.append('action', action);
  formData.append('text', text);
  formData.append('privacy_type', selectedPostPrivacy);
  console.log(formData);
  return ApiService.post(
    `api/post-actions?access_token=${accessToken}`,
    formData,
  );
};

// export const requestFollowRequestAction = (user_id,access_token) => {
//   const formData = new FormData();
//   formData.append('server_key', SERVER_KEY);
//   formData.append('user_id', user_id);

//   return ApiService.post(
//     `api/follow-request-action?access_token=${access_token}`,
//     formData,
//   );
// };

export const requestFollowRequestAction = (
  accessToken,
  user_id,
  request_action,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('user_id', user_id);
  formData.append('request_action', request_action);
  return ApiService.post(
    `api/follow-request-action?access_token=${accessToken}`,
    formData,
  );
};

export const requestVerification = (
  data,
  yourphoto,
  yourpassport,
  access_token,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('name', data[0]);
  formData.append('text', data[1]);
  formData.append('photo', {
    uri: yourphoto,
    type: 'image/jpeg',
    name: 'yourPhoto.jpg',
  });
  formData.append('passport', {
    uri: yourpassport,
    type: 'image/jpeg',
    name: 'yourPassport.jpg',
  });
  console.log('formdata', formData);
  return ApiService.post(
    `api/verification?access_token=${access_token}`,
    formData,
  );
};

export const requestChangePassword = (
  new_password,
  current_password,
  access_token,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('current_password', current_password);
  formData.append('new_password', new_password);
  return ApiService.post(
    `api/update-user-data?access_token=${access_token}`,
    formData,
  );
};

export const requestTwoFactorOTP = access_token => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('factor_method', 'two_factor');
  return ApiService.post(
    `api/update_two_factor?access_token=${access_token}`,
    formData,
  );
};

export const requestTwoFactorOn = (otp, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', 'verify');
  formData.append('code', otp);
  formData.append('factor_method', 'two_factor');
  return ApiService.post(
    `api/update_two_factor?access_token=${access_token}`,
    formData,
  );
};

export const requestTwoFactorOff = access_token => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  // formData.append('factor_method', 'two_factor');
  return ApiService.post(
    `api/update_two_factor?access_token=${access_token}`,
    formData,
  );
};

export const requestSessionList = access_token => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', 'get');
  return ApiService.post(`api/sessions?access_token=${access_token}`, formData);
};

export const requestSessionDelete = (sessionId, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', 'delete');
  formData.append('id', sessionId);
  return ApiService.post(`api/sessions?access_token=${access_token}`, formData);
};

export const requestReaction = (
  accessToken,
  type,
  id,
  reaction,
  limit,
  offset,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  formData.append('id', id);
  formData.append('reaction', reaction);
  // formData.append('limit', limit)
  // formData.append('offset', offset)

  return ApiService.post(
    `api/get-reactions?access_token=${accessToken}`,
    formData,
  );
};

export const requestDeleteAccount = (username, password, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('username', username);
  formData.append('password', password);
  return ApiService.post(
    `api/delete-user?access_token=${access_token}`,
    formData,
  );
};

export const friendRequest = (userId, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('user_id', userId);

  return ApiService.post(
    `api/follow-user?access_token=${access_token}`,
    formData,
  );
};

export const requestGroupPostById = (userId, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('group_id', userId);
  return ApiService.post(
    `api/get-group-data?access_token=${access_token}`,
    formData,
  );
};

export const followRequest = (user_id, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('user_id', user_id);
  return ApiService.post(
    `api/follow-user?access_token=${access_token}`,
    formData,
  );
};

export const requestLikePage = (page_id, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('page_id', page_id);
  return ApiService.post(
    `api/like-page?access_token=${access_token}`,
    formData,
  );
};

export const requestJoinGroup = (group_id, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('group_id', group_id);
  return ApiService.post(
    `api/join-group?access_token=${access_token}`,
    formData,
  );
};

export const requestReportUser = (user, text, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('user', user);
  formData.append('text', text);
  return ApiService.post(
    `api/report_user?access_token=${access_token}`,
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

export const requestCommentReact = (
  type,
  comment_id,
  reaction,
  accessToken,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  formData.append('comment_id', comment_id);
  formData.append('reaction', reaction);
  return ApiService.post(`api/comments?access_token=${accessToken}`, formData);
};

export const requestCommentReactReply = (
  type,
  reply_id,
  reaction,
  accessToken,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  formData.append('reply_id', reply_id);
  formData.append('reaction', reaction);
  return ApiService.post(`api/comments?access_token=${accessToken}`, formData);
};

export const requestReactionTypeList = access_token => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  return ApiService.post(
    `api/get-reaction-type?access_token=${access_token}`,
    formData,
  );
};
export const requestCreateInvitationLink = async (type, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  return ApiService.post(
    `api/invitation?access_token=${access_token}`,
    formData,
  );
};

export const requestVersionControl = async (versionName, platform) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('version_name', versionName);
  formData.append('platform', platform);
  return ApiService.post(`api/android-version`, formData);
};
export const requestAllEvents = accessToken => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('fetch', 'events');
  return ApiService.post(
    `api/get-events?access_token=${accessToken}`,
    formData,
  );
};

export const requestGoingEvent = accessToken => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('fetch', 'going');
  return ApiService.post(
    `api/get-events?access_token=${accessToken}`,
    formData,
  );
};
export const requestMyEvent = accessToken => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('fetch', 'my_events');
  return ApiService.post(
    `api/get-events?access_token=${accessToken}`,
    formData,
  );
};
export const requestInvitedEvent = accessToken => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('fetch', 'invited');
  return ApiService.post(
    `api/get-events?access_token=${accessToken}`,
    formData,
  );
};

export const requestInterestedEvent = accessToken => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('fetch', 'interested');
  return ApiService.post(
    `api/get-events?access_token=${accessToken}`,
    formData,
  );
};
export const requestPastEvent = accessToken => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('fetch', 'past');
  return ApiService.post(
    `api/get-events?access_token=${accessToken}`,
    formData,
  );
};
export const requestAds = accessToken => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  return ApiService.post(`api/get-ads?access_token=${accessToken}`, formData);
};
export const requestUpdatePrivacySetting = async (
  type,
  value,
  access_token,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  if (type === 'follow_privacy') {
    formData.append('follow_privacy', value);
  }

  if (type === 'message_privacy') {
    formData.append('message_privacy', value);
  }

  if (type === 'friend_privacy') {
    formData.append('friend_privacy', value);
  }

  if (type === 'birth_privacy') {
    formData.append('birth_privacy', value);
  }

  if (type === 'confirm_followers') {
    formData.append('confirm_followers', value);
  }

  if (type === 'show_activities_privacy') {
    formData.append('show_activities_privacy', value);
  }
  if (type === 'visit_privacy') {
    formData.append('visit_privacy', value);
  }

  if (type === 'share_my_location') {
    formData.append('share_my_location', value);
  }

  if (type === 'post_privacy') {
    formData.append('post_privacy', value);
  }

  if (type == 'status') {
    formData.append('status', value);
  }
  console.log(formData);
  return ApiService.post(
    `api/update-user-data?access_token=${access_token}`,
    formData,
  );
};
export const requestResendEmail = email => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);

  formData.append('email', email);

  return ApiService.post(`api/resend_ac_activation_email`, formData);
};
export const requestGetEventInterested = async (id, accessToken) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('event_id', id);
  return ApiService.post(
    `api/interest-event?access_token=${accessToken}`,
    formData,
  );
};

export const requestGetEventGoing = async (id, accessToken) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('event_id', id);
  return ApiService.post(
    `api/go-to-event?access_token=${accessToken}`,
    formData,
  );
};
export const requestGetEvent = async (id, accessToken) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('id', id);
  return ApiService.post(
    `api/get_event_by_id?access_token=${accessToken}`,
    formData,
  );
};

// export const getProduct = async accessToken => {
//   const formData = new FormData();
//   formData.append('server_key', SERVER_KEY);
//   return ApiService.post(
//     `api/get-products?access_token=${accessToken}`,
//     formData,
//   );
// };

// export const filterProductList = async (
//   accessToken,
//   category_id,
//   keyword,
//   distance,
// ) => {
//   const formData = new FormData();
//   formData.append('server_key', SERVER_KEY);
//   formData.append('category_id', category_id);
//   formData.append('keyword', keyword);
//   formData.append('distance', distance);
//   return ApiService.post(
//     `api/get-products?access_token=${accessToken}`,
//     formData,
//   );
// };

// export const requestAddressList = async (accessToken, type) => {
//   const formData = new FormData();
//   formData.append('server_key', SERVER_KEY);
//   formData.append('type', type);
//   return ApiService.post(`api/address?access_token=${accessToken}`, formData);
// };

// export const getCheckoutList = async (accessToken, type) => {
//   const formData = new FormData();
//   formData.append('server_key', SERVER_KEY);
//   formData.append('type', type);
//   return ApiService.post(`api/market?access_token=${accessToken}`, formData);
// };

// export const submitAddToCart = async (
//   accessToken,
//   type,
//   productId,
//   quantity,
// ) => {
//   const formData = new FormData();
//   formData.append('server_key', SERVER_KEY);
//   formData.append('type', type);
//   formData.append('product_id', productId);
//   formData.append('qty', quantity);
//   return ApiService.post(`api/market?access_token=${accessToken}`, formData);
// };

// export const submitChangeAddToCartQty = async (
//   accessToken,
//   type,
//   productId,
//   quantity,
// ) => {
//   const formData = new FormData();
//   formData.append('server_key', SERVER_KEY);
//   formData.append('type', type);
//   formData.append('product_id', productId);
//   formData.append('qty', quantity);
//   return ApiService.post(`api/market?access_token=${accessToken}`, formData);
// };

// export const submitBuyProduct = async (accessToken, type, address_id) => {
//   const formData = new FormData();
//   formData.append('server_key', SERVER_KEY);
//   formData.append('type', type);
//   formData.append('address_id', address_id);
//   formData.append('payment_type', 1);
//   return ApiService.post(`api/market?access_token=${accessToken}`, formData);
// };

// export const submitChangeProductQty = async (
//   accessToken,
//   type,
//   product_id,
//   qty,
// ) => {
//   const formData = new FormData();
//   formData.append('server_key', SERVER_KEY);
//   formData.append('type', type);
//   formData.append('product_id', product_id);
//   formData.append('qty', qty);
//   return ApiService.post(`api/market?access_token=${accessToken}`, formData);
// };

// export const requestDelete = async (accessToken, type, id) => {
//   const formData = new FormData();
//   formData.append('server_key', SERVER_KEY);
//   formData.append('type', type);
//   formData.append('id', id);
//   return ApiService.post(`api/address?access_token=${accessToken}`, formData);
// };

// export const requestProductDelete = async (accessToken, type, post_id) => {
//   const formData = new FormData();
//   formData.append('server_key', SERVER_KEY);
//   formData.append('action', type);
//   formData.append('post_id', post_id);
//   return ApiService.post(
//     `api/post-actions?access_token=${accessToken}`,
//     formData,
//   );
// };

// export const requestDeleteCart = async (accessToken, type, productId) => {
//   const formData = new FormData();
//   formData.append('server_key', SERVER_KEY);
//   formData.append('type', type);
//   formData.append('product_id', productId);
//   return ApiService.post(`api/market?access_token=${accessToken}`, formData);
// };

// export const getPurchased = async accessToken => {
//   const formData = new FormData();
//   formData.append('server_key', SERVER_KEY);
//   formData.append('type', 'purchased');
//   // formData.append('limit', 25);
//   return ApiService.post(`api/market?access_token=${accessToken}`, formData);
// };

// export const sendInvoiceEmail = async (accessToken, orderHashId) => {
//   const formData = new FormData();
//   formData.append('server_key', SERVER_KEY);
//   formData.append('type', 'send_invoice');
//   formData.append('hash_id', orderHashId);
//   return ApiService.post(`api/market?access_token=${accessToken}`, formData);
// };

// export const getMyProduct = async (user_id, accessToken) => {
//   const formData = new FormData();
//   formData.append('server_key', SERVER_KEY);
//   formData.append('user_id', user_id);
//   return ApiService.post(
//     `api/get-products?access_token=${accessToken}`,
//     formData,
//   );
// };

// export const filterMyProduct = async (user_id, category_id, accessToken) => {
//   const formData = new FormData();
//   formData.append('server_key', SERVER_KEY);
//   formData.append('user_id', user_id);
//   formData.append('category_id', category_id);
//   return ApiService.post(
//     `api/get-products?access_token=${accessToken}`,
//     formData,
//   );
// };

// export const getOrdersListed = async accessToken => {
//   const formData = new FormData();
//   formData.append('server_key', SERVER_KEY);
//   formData.append('type', 'ordered');
//   return ApiService.post(`api/market?access_token=${accessToken}`, formData);
// };

export const requestRegisterConfigSetting = async () => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  return ApiService.post(`api/get-register-config`, formData);
};

export const requestCreateEvent = async (
  eventName,
  startDate,
  startTime,
  endDate,
  endTime,
  eventPhoto,
  eventLocation,
  eventDescription,
  access_token,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('event_name', eventName);
  formData.append('event_start_date', startDate);
  formData.append('event_end_date', endDate);
  formData.append('event_start_time', startTime);
  formData.append('event_end_time', endTime);
  formData.append('event_location', eventLocation);
  formData.append('event_description', eventDescription);
  if (eventPhoto != '') {
    formData.append('event_cover', {
      uri: eventPhoto,
      type: 'image/jpeg',
      name: `cover.jpg`,
    });
  }
  return ApiService.post(
    `api/create-event?access_token=${access_token}`,
    formData,
  );
};

export const requestDeleteEvent = (accessToken, eventId, type) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('event_id', eventId);
  formData.append('type', type);

  return ApiService.post(`api/events?access_token=${accessToken}`, formData);
};

export const requestEditEvent = (
  type,
  eventId,
  eventName,
  startDate,
  starttime,
  endDate,
  endtime,
  photo,
  location,
  descript,
  accessToken,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  formData.append('event_id', eventId);
  formData.append('event_name', eventName);
  formData.append('event_start_date', startDate);
  formData.append('event_start_time', starttime);
  formData.append('event_end_date', endDate);
  formData.append('event_end_time', endtime);
  formData.append('event_location', location);
  formData.append('event_description', descript);

  // Check if the photo is defined and not null before appending
  if (photo != null) {
    formData.append('event-cover', {
      uri: photo,
      type: 'image/jpeg',
      name: `photo.jpg`,
    });
  }

  return ApiService.post(`api/events?access_token=${accessToken}`, formData);
};

export const requestCreateProduct = async (
  productName,
  productPrice,
  productCurrency,
  productCategory,
  productDescription,
  productCondition,
  productPhotos,
  productLocation,
  productUnit,
  access_token,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('product_title', productName);
  formData.append('product_price', productPrice);
  formData.append('currency', productCurrency);
  formData.append('product_category', productCategory);
  formData.append('product_description', productDescription);
  formData.append('product_type', productCondition);
  formData.append('product_location', productLocation);
  formData.append('units', productUnit);

  if (productPhotos && productPhotos.length > 0) {
    productPhotos.forEach((photo, index) => {
      formData.append('images[]', {
        uri: photo,
        type: 'image/jpeg', // Default to 'image/jpeg' if mime type is not available
        name: `photo_${index}.jpg`,
      });
    });
  }

  try {
    const response = await ApiService.post(
      `api/create-product?access_token=${access_token}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      'Error creating product:',
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

// export const requestCreateAddress = (
//   name,
//   phone,
//   country,
//   city,
//   zip,
//   address,
//   access_token,
// ) => {
//   const formData = new FormData();
//   formData.append('server_key', SERVER_KEY);
//   formData.append('type', 'add');
//   formData.append('name', name);
//   formData.append('phone', phone);
//   formData.append('country', country);
//   formData.append('city', city);
//   formData.append('zip', zip);
//   formData.append('address', address);
//   return ApiService.post(`api/address?access_token=${access_token}`, formData);
// };

export const requestConfirmCodeUnusual = (
  unsual_login_username,
  confirm_code,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('unsual_login_username', unsual_login_username);
  formData.append('confirm_code', confirm_code);
  return ApiService.post(`api/confirm-code-unsual-login`, formData);
};

export const requestTwoFactorConfirmation = (email_or_phone, code) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('email_or_phone', email_or_phone);
  formData.append('code', code);
  return ApiService.post(`/api/two-factor`, formData);
};

// export const requestUpdateAddress = (
//   id,
//   name,
//   phone,
//   country,
//   city,
//   zip,
//   address,
//   access_token,
// ) => {
//   const formData = new FormData();
//   formData.append('server_key', SERVER_KEY);
//   formData.append('type', 'edit');
//   formData.append('id', id);
//   formData.append('name', name);
//   formData.append('phone', phone);
//   formData.append('country', country);
//   formData.append('city', city);
//   formData.append('zip', zip);
//   formData.append('address', address);
//   return ApiService.post(`api/address?access_token=${access_token}`, formData);
// };

// export const requestUpdateProduct = (
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
//   access_token,
// ) => {
//   const formData = new FormData();
//   formData.append('server_key', SERVER_KEY);
//   formData.append('product_id', id);
//   formData.append('product_title', productName);
//   formData.append('product_category', productCategory);
//   formData.append('product_type', condition);
//   formData.append('product_description', productDescription);
//   formData.append('product_price', productPrice);
//   formData.append('product_location', productLocation);
//   formData.append('currency', currency);
//   formData.append('units', productItem);
//   formData.append('deleted_images_ids', imgId);

//   images.forEach((image, index) => {
//     // Adjust the property names based on your actual data structure
//     const imageUri = image; // Example adjustments
//     const imageData = {
//       uri: imageUri,
//       name: `photo_${index}.jpg`,
//       type: image.type || 'image/jpeg',
//     };
//     formData.append('images[]', imageData);
//   });

//   return ApiService.post(
//     `api/edit-product?access_token=${access_token}`,
//     formData,
//   );
// };

export const requestActivateAccount = (email_or_phone, code) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('email_or_phone', email_or_phone);
  formData.append('code', code);
  return ApiService.post(`api/active_account_sms`, formData);
};

export const requestResendSms = phone_num => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);

  formData.append('phone_num', phone_num);

  return ApiService.post(`api/resend_ac_activation_email`, formData);
};

export const requestTwoFactorSetting = access_token => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  return ApiService.post(
    `api/two-factor-setting?access_token=${access_token}`,
    formData,
  );
};

export const requestUpdateTwoFactor = (
  type,
  factor_method,
  code,
  phone_number,
  access_token,
) => {
  const formData = new FormData();

  if (code == null && phone_number == null) {
    console.log('all null');
    formData.append('server_key', SERVER_KEY);
  } else {
    formData.append('server_key', SERVER_KEY);
    if (code != null) {
      formData.append('type', type);
      formData.append('factor_method', factor_method);
      formData.append('code', code);
    }

    if (phone_number != null) {
      formData.append('phone_number', phone_number);
    }
  }

  return ApiService.post(
    `api/update_two_factor?access_token=${access_token}`,
    formData,
  );
};

export const requestWithdrawBank = (
  type,
  amount,
  bank,
  full_name,
  access_token,
) => {
  // Create FormData and append fields
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY); // Ensure SERVER_KEY is defined correctly
  formData.append('type', type); // Defaults to 'bank' if not provided
  formData.append('amount', amount);
  formData.append('iban', bank);
  formData.append('full_name', full_name);
  formData.append('country', null);
  formData.append('swift_code', null);
  formData.append('address', null);

  console.log('Formdata!!!!!!!!!!', formData);
  // Make the API POST request with the form data
  return ApiService.post(`api/withdraw?access_token=${access_token}`, formData);
};
export const requestWithdrawKBZ = (type, full_name, amount, access_token) => {
  // Create FormData and append fields
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY); // Ensure SERVER_KEY is defined correctly
  formData.append('type', type); // Defaults to 'bank' if not provided
  formData.append('full_name', full_name);
  formData.append('amount', amount);
  formData.append('iban', null);
  formData.append('country', null);
  formData.append('swift_code', null);
  formData.append('address', null);

  console.log('Formdata!!!!!!!!!!', formData);
  return ApiService.post(`api/withdraw?access_token=${access_token}`, formData);
};

export const requestSendMoney = (
  type,
  note,
  amount,
  user_id,

  access_token,
) => {
  // Create FormData and append fields
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY); // Ensure SERVER_KEY is defined correctly
  formData.append('type', type); // Defaults to 'bank' if not provided
  formData.append('note', note);
  formData.append('amount', amount);
  formData.append('user_id', user_id);

  console.log(formData);
  return ApiService.post(`api/wallet?access_token=${access_token}`, formData);
};

export const requestBankTransfer = (type, amount, photo, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY); // Ensure SERVER_KEY is defined correctly
  formData.append('payment_type', type); // Defaults to 'bank' if not provided
  formData.append('price', amount);
  if (photo) {
    formData.append('thumbnail', {
      uri: photo,
      type: 'image/jpeg',
      name: `photo.jpg`,
    });
  }
  console.log('photo', photo);
  console.log(formData);
  return ApiService.post(`api/bank?access_token=${access_token}`, formData);
};

export const requestNewPlan = (
  type,
  title,
  price,
  currency,
  period,
  description,
  access_token,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY); // Ensure SERVER_KEY is defined correctly
  formData.append('type', type); // Defaults to 'bank' if not provided
  formData.append('title', title);
  formData.append('price', price);
  formData.append('currency', currency);
  formData.append('period', period);
  formData.append('description', description);

  console.log(formData);
  return ApiService.post(
    `api/monetizations?access_token=${access_token}`,
    formData,
  );
};

export const requestChangeOrderStatus = (
  type,
  hash_order,
  status,
  access_token,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY); // Ensure SERVER_KEY is defined correctly
  formData.append('type', type); // Defaults to 'bank' if not provided
  formData.append('hash_order', hash_order);
  formData.append('status', status);

  console.log(formData);
  return ApiService.post(`api/market?access_token=${access_token}`, formData);
};

export const requestReviewProduct = (
  type,
  review,
  rating,
  product_id,
  reviewPhotos,
  access_token,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  formData.append('review', review);
  formData.append('rating', rating);
  formData.append('product_id', product_id);
  reviewPhotos.forEach((image, index) => {
    formData.append('images[]', {
      uri: image,
      type: 'image/jpeg',
      name: `reviewPhoto${index}.jpg`,
    });
  });

  console.log(formData);
  return ApiService.post(`api/market?access_token=${access_token}`, formData);
};

export const requestGetCurrencies = (type, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', type);
  return ApiService.post(
    `api/currencies?access_token=${access_token}`,
    formData,
  );
};

export const requestEventInvite = (user_id, event_id, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('user_id', user_id);
  formData.append('event_id', event_id);
  return ApiService.post(
    `api/event_add?access_token=${access_token}`,
    formData,
  );
};

export const requestNotInEventMember = (event_id, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('event_id', event_id);
  return ApiService.post(
    `api/not_in_event_member?access_token=${access_token}`,
    formData,
  );
};

export const requestPageVerification = (pageId, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('id', pageId);
  console.log(formData);
  return ApiService.post(
    `api/page_verification?access_token=${access_token}`,
    formData,
  );
};
export const requestSocailLinks = (
  page_id,
  facebook,
  twitter,
  instagram,
  telegram,
  viber,
  youtube,
  access_token,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('page_id', page_id);
  formData.append('facebook', facebook);
  formData.append('twitter', twitter);
  formData.append('instgram', instagram);
  formData.append('vk', telegram);
  formData.append('linkedin', viber);
  formData.append('youtube', youtube);

  console.log(formData);
  return ApiService.post(
    `api/social-links?access_token=${access_token}`,
    formData,
  );
};

export const requestAdmin = (pageId, userId, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('page_id', pageId);
  formData.append('user_id', userId);
  console.log(formData);
  return ApiService.post(
    `api/make_page_admin?access_token=${access_token}`,
    formData,
  );
};

export const requestPageAdmin = (page_id, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('page_id', page_id);
  return ApiService.post(
    `api/get_page_admins?access_token=${access_token}`,
    formData,
  );
};

export const requestUpdateAdminSetting = async (
  pageId,
  userId,
  general,
  info,
  social,
  avatar,
  admins,
  delete_page,
  access_token,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('page_id', pageId);
  formData.append('user_id', userId);
  formData.append('general', general);
  formData.append('info', info);
  formData.append('social', social);
  formData.append('avatar', avatar);
  // formData.append('design', design);
  formData.append('admins', admins);
  // formData.append('analytics', analytics);
  formData.append('delete_page', delete_page);
  console.log(formData);
  return ApiService.post(
    `api/update_privileges?access_token=${access_token}`,
    formData,
  );
};

export const requestGroupAdmin = (pageId, userId, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('group_id', pageId);
  formData.append('user_id', userId);
  console.log(formData);
  return ApiService.post(
    `api/make_group_admin?access_token=${access_token}`,
    formData,
  );
};
export const requestRemoveGroupAdmin = (pageId, userId, access_token) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('group_id', pageId);
  formData.append('user_id', userId);
  console.log(formData);
  return ApiService.post(
    `api/delete_group_member?access_token=${access_token}`,
    formData,
  );
};
export const requestUpdateGroupAdminSetting = async (
  pageId,
  userId,
  general,
  privacy,
  avatar,
  member,
  analytics,
  delete_group,
  access_token,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('group_id', pageId);
  formData.append('user_id', userId);
  formData.append('general', general);
  formData.append('privacy', privacy);
  formData.append('avatar', avatar);
  formData.append('members', member);
  formData.append('analytics', analytics);
  formData.append('delete_group', delete_group);
  console.log(formData);
  return ApiService.post(
    `api/update_privileges?access_token=${access_token}`,
    formData,
  );
};

export const requestUpdateGroupPrivacy = async (
  groupId,
  privacy,
  joinPrivacy,
  access_token,
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', 'group_privacy');
  formData.append('group_id', groupId);
  formData.append('privacy', privacy);
  formData.append('join_privacy', joinPrivacy);

  console.log(formData);
  return ApiService.post(`api/groups?access_token=${access_token}`, formData);
};
