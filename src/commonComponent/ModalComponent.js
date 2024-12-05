import React, { useEffect, useState } from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  Alert,
  StyleSheet,
  Image,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useDispatch } from 'react-redux';
import COLOR from '../constants/COLOR';
import SPACING from '../constants/SPACING';
import RADIUS from '../constants/RADIUS';
import PIXEL from '../constants/PIXEL';
import { FontFamily, fontSizes } from '../constants/FONT';
import { hidePost, savePost, submitDeleteEvent } from '../helper/ApiModel';
import Toast from 'react-native-toast-message';
import { setFetchNewFeedData, setFetchPGData } from '../stores/slices/PostSlice';
import {
  setPostText,
  setSelectedPostPrivacy,
  setSuccessPosting,
} from '../stores/slices/AddPostSlice';
import { postPrivary } from '../constants/CONSTANT_ARRAY';
import { getSavedPostsData } from '../helper/ApiModel';

const ModalComponent = ({
  eventId,
  eventData,
  openModal,
  closeModal,
  options,
  postid,
  post,
  reaction,
  groupList,
  pageList,
  message,
  isShortVideo,
  posts,
  setPosts,
  index,
  setOtherReactionPopupStatus,
  isOtherReactionPopupStatus,
  selfReactionId,
  userData,
  isReactEnable,
  setReactEnable,
  doReaction,
  reactionType,
  postType,
  pageInfo,
  x,
  darkMode,
  userId,
  handleRemovePost = () => { },
  isLoading,
  setIsLoading,
  afterPostId,
  setAfterPostId,
  fetchSavedPosts = () => { },
  isMarket,
}) => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [savePosts, setSavePost] = useState(post?.is_post_saved);
  const [reportPost, setReportPost] = useState(post?.is_post_reported);

  const dispatch = useDispatch();
  const copyToClipboard = text => {
    if (text) {
      Clipboard.setString(text);
      showToast('Text copied to clipboard');
    }
  };
  const copyLinkToClipboard = link => {
    if (link) {
      Clipboard.setString(link);
      showToast('Copied to clipboard');
    }
  };

  const showToast = msg => {
    Toast.show({
      type: 'success',
      text1: msg,
      visibilityTime: 4000,
      position: 'bottom',
    });
  };

  const requestSavePost = async () => {
    try {
      const data = await savePost(postid, 'save');
      if (data.api_status === 200) {
        showToast(
          data.code == 0
            ? 'Post unsaved successfully!'
            : 'Post saved successfully!',
        );
        // if (data.code == 0) {
        //   fetchSavedPosts();
        // }
        dispatch(setFetchNewFeedData(true));
        setSavePost(data.code == 0 ? false : true);
        dispatch(setFetchNewFeedData(false));
      } else {
        // Handle other API status codes if needed
      }
    } catch (error) {
      console.error('Error in requestSavePost:', error);
    } finally {
      // Any cleanup or additional logic
    }
  };

  // const fetchSavedPosts = async (postId = 0) => {
  //   try {
  //     setIsLoading(true);

  //     const data = await getSavedPostsData('saved', 'photos', postId, userId);
  //     if (data.api_status === 200) {
  //       if (postId === 0) {
  //         setPosts(data.data);
  //         } else {
  //           setPosts((prevPosts) => [
  //             ...prevPosts,
  //             ...data.data.filter((post) => !prevPosts.some((p) => p.id === post.id)),
  //           ]);
  //       }
  //       setAfterPostId(data.data[data.data.length - 1]?.id);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setIsLoading(false);

  //   }
  // };

  const requestHidePost = async () => {
    try {
      const data = await hidePost(postid);
      if (data.api_status === 200) {
        showToast('Post hide successfully!');

        dispatch(setFetchNewFeedData(true));
      } else {
        // Handle other API status codes if needed
      }
    } catch (error) {
      console.error('Error in requestHidePost:', error);
    } finally {
      // Any cleanup or additional logic
    }
  };

  const requestReportPost = async () => {
    try {
      const data = await savePost(postid, 'report');
      if (data.api_status === 200) {
        showToast(data.code == 0 ? 'Post unreported' : 'Post reported');
        dispatch(setFetchNewFeedData(true));
        setReportPost(data.code == 0 ? false : true);
        dispatch(setFetchNewFeedData(false));
      }
    } catch (error) {
      console.error('Error in requestHidePost:', error);
    }
  };
  const requestDeletePost = async () => {
    try {
      const data = await savePost(postid, 'delete');
      if (data.api_status === 200) {
        showToast('Post deleted successfully');
        dispatch(setFetchNewFeedData(true));
        // dispatch(setSuccessPosting(true));
        dispatch(setFetchPGData(true));
      }
    } catch (error) {
      console.error('Error in requestHidePost:', error);
    }
  };

  const requestDeleteEvent = async () => {
    try {
      const data = await submitDeleteEvent(eventId, 'delete');
      if (data.api_status === 200) {
        showToast('Event deleted successfully');
        navigation.navigate('Event');
        // dispatch(setFetchNewFeedData(true));
        // dispatch(setSuccessPosting(true));
        // dispatch(setFetchPGData(true));
      }
    } catch (error) {
      console.error('Error delete event:', error);
    }
  };

  function renderModalOption(option) {
    let toastMessage = '';
    if (
      option.type === 'copyText' &&
      (!post || !post?.Orginaltext || post?.Orginaltext.trim() === '')
    ) {
      return null;
    }

    // useEffect(()=>{
    //   // Alert.alert("Hello",isShortVideo)
    // },[])
    // const navigateToEdit = () => {
    //   navigation.navigate('EventEdit', { eventId });
    //   closeModal();
    // };
    return (
      <TouchableOpacity
        onPress={() => {
          setTimeout(() => {
            closeModal();
          }, 2000);
          if (
            (option.shareType === 'share_post_on_group' &&
              (!groupList || groupList.length === 0)) ||
            (option.shareType === 'share_post_on_page' &&
              (!pageList || pageList.length === 0))
          ) {
            if (option.shareType === 'share_post_on_group') {
              toastMessage = 'You have no groups.';
            } else if (option.shareType === 'share_post_on_page') {
              toastMessage = 'You have no pages.';
            }
            setVisible(true);
            showToast(toastMessage);
            return;
          } else if (option.type === 'save') {
            setVisible(true);
            requestSavePost();
            dispatch(setFetchNewFeedData(false));
          } else if (option.type === 'copyText') {
            setVisible(true);
            copyToClipboard(post?.Orginaltext);
          } else if (option.type === 'copyLink') {
            setVisible(true);
            copyLinkToClipboard(post?.url);
          } else if (option.type === 'copyLinkEvent') {
            setVisible(true);
            copyLinkToClipboard(eventData?.url);
          } else if (option.type === 'editEvent') {
            setVisible(true);
            navigation.navigate(option.navigation, { eventId });
          } else if (option.type === 'deleteEvent') {
            setVisible(true);
            // navigation.navigate(option.navigation, {eventId})
            requestDeleteEvent();
          } else if (option.type === 'hidePost') {
            setVisible(true);
            requestHidePost();
          } else if (option.type === 'reportPost') {
            setVisible(true);
            requestReportPost();
          } else if (option.type === 'delete') {
            setVisible(true);
            requestDeletePost();
          } else {
            if (option.navigation == 'EditPost') {
              dispatch(setPostText(post.Orginaltext));
              dispatch(setSelectedPostPrivacy(postPrivary[post.postPrivacy]));
            }
            navigation.navigate(option.navigation, {
              postid: postid,
              post: post,
              reaction: reaction,
              shareType: option.shareType,
              groupList: groupList,
              pageList: pageList,
              posts,
              setPosts,
              postType,
              pageInfo,

              // handleRemovePost: handleRemovePost,
              index,
              setOtherReactionPopupStatus,
              isOtherReactionPopupStatus,
              selfReactionId,
              userData,
              isReactEnable,
              setReactEnable,
              doReaction,
              reactionType,
              isShortVideo,
              isFromShare: true,
              isMarket: isMarket,
              darkMode
            });
            closeModal();
          }
        }}>
        <View style={styles.shareRow}>
          <Image
            source={darkMode == 'enable' ? option.iconDark : option.iconLight}
            style={{ width: PIXEL.px24, height: PIXEL.px24 }}
            resizeMode="contain"
          />
          <Text
            style={[
              styles.shareText,
              darkMode == 'enable'
                ? { color: COLOR.White }
                : { color: COLOR.Grey500 },
            ]}>
            {
              option.type === 'save'
                ? (savePosts ? 'Unsave Post' : 'Save Post')
                : option.type === 'reportPost'
                  ? (reportPost ? 'Unreport Post' : 'Report Post')
                  : option.text
            }

          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <Modal visible={openModal} transparent={true}>
      <TouchableOpacity onPress={closeModal} style={styles.shareBottomBg}>
        <View
          style={[
            styles.shareBottom,
            darkMode == 'enable'
              ? { backgroundColor: COLOR.DarkFadeLight }
              : { backgroundColor: COLOR.White },
          ]}>
          {options.map((option, index) => (
            <React.Fragment key={index}>
              {renderModalOption(option)}
              {index < options.length - 1 && (
                <View style={styles.horizontalBorder}></View>
              )}
            </React.Fragment>
          ))}
        </View>
      </TouchableOpacity>
      <Toast />
    </Modal>
  );
};

export default ModalComponent;
const styles = StyleSheet.create({
  shareBottomBg: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  shareBottom: {
    width: '100%',
    paddingHorizontal: SPACING.sp16,
    borderTopLeftRadius: RADIUS.rd20,
    borderTopRightRadius: RADIUS.rd20,
  },
  horizontalBorder: {
    borderWidth: 0.2,
    borderColor: COLOR.Grey1000,
  },
  shareRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  shareText: {
    marginLeft: 10,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    lineHeight: SPACING.sp16,
    top: SPACING.sp2,
  },
});
