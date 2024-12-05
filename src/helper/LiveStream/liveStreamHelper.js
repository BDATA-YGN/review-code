import {useSelector} from 'react-redux';
import {
  getLiveComments,
  requestActiveLive,
  requestEndLiveStream,
  requestEndLiveStreamNormal,
  requestGenerateStreamKey,
  requestGenerateStreamKeyNormal,
  requestLiveEnd,
  requestLiveHardEnd,
  requestLiveProductDetails,
  requestStartLiveStream,
  requestStartLiveStreamNormal,
  requestSubmitComment,
} from './liveStreamModal';
import {logJsonData, logMessage} from './logFile';
import {
  setAddNewComments,
  setBroadcastId,
  setLiveCommentList,
  setLiveProductList,
  setPostToTimeline,
  setStreamerId,
  setStreamingList,
  setStreamKey,
  setStreamPostId,
} from '../../stores/slices/liveStreamSlice';
import {
  setAddNewCommentsNormalLive,
  setBroadcastIdNormalLive,
  setLiveCommentListNormalLive,
  setPostToTimelineNormalLive,
  setStreamerIdNormalLive,
  setStreamKeyNormalLive,
  setStreamPostIdNormalLive,
} from '../../stores/slices/normalLiveSlice';

export const generateStreamKey = async (
  formData,
  dispatch,
  ref,
  type = 'live-sale',
) => {
  try {
    const response = await requestGenerateStreamKey();
    if (response && response.api_status === 200) {
      logJsonData('requestGenerateStreamKey', response);
      dispatch(setStreamKey(response.stream_key));
      await startLiveStream(response.stream_key, formData, dispatch, ref, type);
    } else {
    }
  } catch (error) {
  } finally {
  }
};

export const generateStreamKeyNormal = async (
  formData,
  dispatch,
  ref,
  type = 'live-sale',
) => {
  try {
    const response = await requestGenerateStreamKeyNormal();
    if (response && response.api_status === 200) {
      logJsonData('requestGenerateStreamKey', response);
      dispatch(setStreamKeyNormalLive(response.stream_key));
      await startLiveStreamNormal(
        response.stream_key,
        formData,
        dispatch,
        ref,
        type,
      );
    } else {
    }
  } catch (error) {
  } finally {
  }
};

export const startLiveStream = async (
  streamKey,
  formData,
  dispatch,
  ref,
  type,
) => {
  try {
    const response = await requestStartLiveStream(streamKey, formData, type);
    logJsonData('requestStartLiveStream', response);
    if (response && response.api_status === 200) {
      dispatch(setStreamerId(response?.wo_posts?.user_id));
      dispatch(setStreamPostId(response?.wo_posts?.post_id));
      dispatch(setBroadcastId(response?.vy_live_broadcasts?.id));
      dispatch(setPostToTimeline('no'));
      console.log(`rtmp://myspace.com.mm:1945/live/${streamKey}`);
      ref.current?.startStreaming(streamKey, 'rtmp://myspace.com.mm:1945/live');
      // navigation.navigate('LiveStream');
    } else {
    }
  } catch (error) {
    console.log('Error', error);
  } finally {
    console.log('Finally');
  }
};

export const startLiveStreamNormal = async (
  streamKey,
  formData,
  dispatch,
  ref,
  type,
) => {
  try {
    const response = await requestStartLiveStreamNormal(
      streamKey,
      formData,
      type,
    );
    logJsonData('requestStartLiveStream', response);
    if (response && response.api_status === 200) {
      dispatch(setStreamerIdNormalLive(response?.wo_posts?.user_id));
      dispatch(setStreamPostIdNormalLive(response?.wo_posts?.post_id));
      dispatch(setBroadcastIdNormalLive(response?.vy_live_broadcasts?.id));
      dispatch(setPostToTimelineNormalLive('no'));
      console.log(`rtmp://myspace.com.mm:1945/live/${streamKey}`);
      ref.current?.startStreaming(streamKey, 'rtmp://myspace.com.mm:1945/live');
      // navigation.navigate('LiveStream');
    } else {
    }
  } catch (error) {
    console.log('Error', error);
  } finally {
    console.log('Finally');
  }
};

export const endLiveStream = async (
  userId,
  postId,
  broadcastId,
  postToTimeline,
) => {
  try {
    const response = await requestEndLiveStream(
      userId,
      postId,
      broadcastId,
      postToTimeline,
    );
    if (response && response.api_status === 200) {
    } else {
    }
  } catch (error) {
    console.log('Error', error);
  } finally {
    // console.log('Finally');
  }
};

export const endLiveStreamNormal = async (
  userId,
  postId,
  broadcastId,
  postToTimeline,
) => {
  try {
    const response = await requestEndLiveStreamNormal(
      userId,
      postId,
      broadcastId,
      postToTimeline,
    );
    if (response && response.api_status === 200) {
    } else {
    }
  } catch (error) {
    console.log('Error', error);
  } finally {
    // console.log('Finally');
  }
};

export const getActiveLive = async dispatch => {
  try {
    const response = await requestActiveLive();
    logJsonData('', response.data.streams);
    if (response && response.data.api_status === 200) {
      dispatch(setStreamingList(response.data.streams));
    } else {
    }
  } catch (error) {
    console.log('Error', error);
  } finally {
    // console.log('Finally');
  }
};

export const getLiveCommentList = async (
  dispatch,
  postId,
  currentComments = [],
  isAddNewComments,
  type,
) => {
  try {
    const response = await getLiveComments(postId);
    // logJsonData('Comments List', response.data.comments);

    if (response && response.data.api_status === 200) {
      // Filter new comments that are not in the current list
      const newComments = response.data.comments.filter(
        newComment =>
          !currentComments.some(
            existingComment => existingComment.id === newComment.id,
          ),
      );

      if (newComments.length > 0) {
        // Add only new comments to the list
        if (type === 'normal-live') {
          dispatch(setAddNewCommentsNormalLive(isAddNewComments + 1));
          dispatch(
            setLiveCommentListNormalLive([...currentComments, ...newComments]),
          );
        } else {
          dispatch(setAddNewComments(isAddNewComments + 1));
          dispatch(setLiveCommentList([...currentComments, ...newComments]));
        }
      }
    }
  } catch (error) {
    console.log('Error', error);
  } finally {
    // console.log('Finally');
  }
};

export const getLiveCommentListNormalLive = async (
  dispatch,
  postId,
  currentComments = [],
  isAddNewComments,
) => {
  try {
    const response = await getLiveComments(postId);
    // logJsonData('Comments List', response.data.comments);

    if (response && response.data.api_status === 200) {
      // Filter new comments that are not in the current list
      const newComments = response.data.comments.filter(
        newComment =>
          !currentComments.some(
            existingComment => existingComment.id === newComment.id,
          ),
      );

      if (newComments.length > 0) {
        // Add only new comments to the list
        dispatch(setAddNewCommentsNormalLive(isAddNewComments + 1));
        dispatch(
          setLiveCommentListNormalLive([...currentComments, ...newComments]),
        );
      }
    }
  } catch (error) {
    console.log('Error', error);
  } finally {
    // console.log('Finally');
  }
};

export const liveHardEnd = async (postId, boradcastId) => {
  try {
    const response = await requestLiveHardEnd(postId, boradcastId);
    logJsonData('live end', response.data);
    if (response && response.data.api_status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.log('Error', error);
  } finally {
    // console.log('Finally');
  }
};

export const getLiveProductDetails = async (streamPostId, dispatch) => {
  try {
    const response = await requestLiveProductDetails(streamPostId);
    // logJsonData('live product details', response.data);
    if (response && response.data.api_status === 200) {
      dispatch(setLiveProductList(response.data.products));
    } else {
      return null;
    }
  } catch (error) {
    console.log('Error', error);
  } finally {
    // console.log('Finally');
  }
};

export const submitComment = async (comment, postId) => {
  try {
    const response = await requestSubmitComment(comment, postId);
    // logJsonData('live product details', response.data);
    return response;
  } catch (error) {
    console.log('Error', error);
  } finally {
    console.log('Finally');
  }
};
