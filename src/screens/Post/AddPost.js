import {
  SafeAreaView,
  StyleSheet,
  BackHandler,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import COLOR from '../../constants/COLOR';
import IconManager from '../../assets/IconManager';
import AddPostHeader from '../../components/Post/AddPostHeader';
import AddPostFooter from '../../components/Post/AddPostFooter';
import {pagePrivary, postPrivary} from '../../constants/CONSTANT_ARRAY';
import PostPrivacyModal from '../../components/Post/Modal/PostPrivacyModal';
import UploadImageModal from '../../components/Post/Modal/UploadImageModal';
import UploadVideoModal from '../../components/Post/Modal/UploadVideoModal';
import FeelingActivityModal from '../../components/Post/Modal/FeelingActivityModal';
import {useNavigation, useRoute} from '@react-navigation/native';
import OtherActivityModal from '../../components/Post/Modal/OtherActivityModal';
import {feelingActivityOptions} from '../../constants/CONSTANT_ARRAY';
import ImagePicker from 'react-native-image-crop-picker';
import {
  getUserInfoData,
  submitAddPost,
  submitGetFriends,
  filterSearchList,
} from '../../helper/ApiModel';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import {useDispatch, useSelector} from 'react-redux';
import {
  setPostGif,
  setPostText,
  setPostPhotos,
  setPostVideo,
  setSelectedPostPrivacy,
  setFeelingType,
  setFeeling,
  setSelectedMentionFriends,
  setErrorPosting,
  setLoadingPosting,
  setSuccessPosting,
} from '../../stores/slices/AddPostSlice';
import DiscardPostModal from '../../components/Post/Modal/DiscardPostModal';
import DualAvater from '../../components/DualAvater';
import {
  addNewMyPagePostItem,
  addNewPostItem,
  setFetchNewFeedData,
  setFetchPGData,
} from '../../stores/slices/PostSlice';
import {retrieveStringData, storeKeys} from '../../helper/AsyncStorage';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {FontFamily} from '../../constants/FONT';
import PIXEL from '../../constants/PIXEL';
import {stringKey} from '../../constants/StringKey';

const AddPost = props => {
  const navigation = useNavigation();
  const route = useRoute();
  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const [userInfoData, setUserInfoData] = useState(null);
  const [postPrivacyModalVisble, setPostPrivacyModalVisible] = useState(false);
  const postPrivaryFiltered = postPrivary.filter(
    option => option.label !== 'Monetization',
  );
  const pagePrivacyList = pagePrivary;
  const [uploadImageModalVisible, setUploadImageModalVisible] = useState(false);
  const [uploadVideoModalVisible, setUploadVideoModalVisible] = useState(false);
  const [feelingActivityModalVisible, setFeelingActivityModalVisible] =
    useState(false);
  const [otherActivityModalVisible, setOtherActivityModalVisible] =
    useState(false);
  const [discardPostModalVisible, setDiscardPostModalVisible] = useState(false);
  const [activityData, setActivityData] = useState(feelingActivityOptions[1]);
  const [idCounter, setIdCounter] = useState(1);
  const [activityType, setActivityType] = useState('');

  const dispatch = useDispatch();
  const postText = useSelector(state => state.AddPostSlice.postText);
  const postPhotos = useSelector(state => state.AddPostSlice.postPhotos);
  const postVideo = useSelector(state => state.AddPostSlice.postVideo);
  const postGif = useSelector(state => state.AddPostSlice.postGif);
  const selectedPostPrivacy = useSelector(
    state => state.AddPostSlice.selectedPostPrivacy,
  );
  const feelingType = useSelector(state => state.AddPostSlice.feelingType);
  const feeling = useSelector(state => state.AddPostSlice.feeling);
  const selectedMentionFriends = useSelector(
    state => state.AddPostSlice.selectedMentionFriends,
  );
  const [snapPoint, setSnapPoint] = useState(1);
  const [mentionFriendListVisible, setMentionFriendListVisible] =
    useState(false);
  const [mentionFriendsList, setMentionFriendsList] = useState([]);
  const [mentionListLoader, setMentionListLoader] = useState(false);
  const [friendList, setFriendList] = useState([]);

  const [isFocused, setIsFocused] = useState(false);

  // Snap points for BottomSheet
  const snapPoints = useMemo(() => ['12%', '30%'], [snapPoint]);

  // Function to handle text input focus
  const handleFocus = () => {
    setIsFocused(true);
  };

  // Function to handle text input blur
  const handleBlur = () => {
    setIsFocused(false);
  };
  const getUserData = async () => {
    const userInfo = await getUserInfoData();
    setUserInfoData(userInfo.user_data);
  };

  const handleSelectPrivacy = selectedPrivacy => {
    setPostPrivacyModalVisible(false);
    dispatch(setSelectedPostPrivacy(selectedPrivacy));
  };

  const handlePostOptions = selectedOptionId => {
    if (selectedOptionId == 1) {
      setUploadImageModalVisible(true);
    }

    if (selectedOptionId == 2) {
      navigation.navigate('MentionFriend');
    }

    if (selectedOptionId == 3) {
      setUploadVideoModalVisible(true);
    }

    if (selectedOptionId == 4) {
      navigation.navigate('Gif');
    }

    if (selectedOptionId == 5) {
      setFeelingActivityModalVisible(true);
    }
  };

  const handleFeelingActivity = feelingActivityId => {
    dispatch(setFeeling(null));

    setFeelingActivityModalVisible(false);
    if (feelingActivityId == 0) {
      navigation.navigate('Feeling');
    } else {
      dispatch(setFeelingType(feelingActivityOptions[feelingActivityId]));
      setActivityData(feelingActivityOptions[feelingActivityId]);
      setOtherActivityModalVisible(true);
    }
  };

  const handleOtherActivity = () => {
    setOtherActivityModalVisible(false);
    dispatch(
      setFeeling({value: activityType, text: 'to ' + activityType, icon: ''}),
    );
  };

  const pickImages = () => {
    // Hide upload image modal
    setUploadImageModalVisible(false);

    // Use async/await for better error handling
    setTimeout(async () => {
      try {
        const pickedImages = await ImagePicker.openPicker({
          multiple: true,
          forceJpg: true,
          mediaType: 'photo',
          // maxFiles : 50,
        });

        // Dispatch actions to reset post GIF and video
        dispatch(setPostGif(null));
        dispatch(setPostVideo(null));

        // Map picked images to desired format
        const newImages = pickedImages.map((image, index) => ({
          uri: image.path,
          id: (idCounter + index).toString(),
        }));

        // Update post photos with new images
        dispatch(setPostPhotos([...postPhotos, ...newImages]));

        // Increment id counter
        setIdCounter(prevCounter => prevCounter + pickedImages.length);
      } catch (error) {
        // Handle error appropriately
      }
    }, 1000);
  };

  const pickCameraImage = () => {
    setUploadImageModalVisible(false);
    setTimeout(async () => {
      try {
        const pickCameraImage = await ImagePicker.openCamera({
          mediaType: 'image',
        });

        dispatch(setPostGif(null));
        dispatch(setPostVideo(null));

        const newCameraImage = {
          uri: pickCameraImage.path,
          id: idCounter.toString(),
        };
        dispatch(setPostPhotos([...postPhotos, newCameraImage]));
        setIdCounter(prevCounter => prevCounter + 1);
      } catch (error) {}
    }, 1000);
  };

  const pickVideo = () => {
    setUploadVideoModalVisible(false);
    setTimeout(async () => {
      try {
        const pickVideo = await ImagePicker.openPicker({
          mediaType: 'video',
        });

        dispatch(setPostGif(null));
        dispatch(setPostPhotos([]));

        const newVideo = {
          uri: pickVideo.path,
          id: idCounter.toString(),
        };

        dispatch(setPostVideo(newVideo));
        setIdCounter(prevCounter => prevCounter + 1);
      } catch (error) {}
    }, 1000);
  };

  const pickVideoFile = async () => {
    setUploadVideoModalVisible(false);
    setTimeout(async () => {
      try {
        const pickVideoFile = await ImagePicker.openCamera({
          mediaType: 'video',
        });

        dispatch(setPostGif(null));
        dispatch(setPostPhotos([]));

        const newCameraVideo = {
          uri: pickVideoFile.path,
          id: idCounter.toString(),
        };
        dispatch(setPostVideo(newCameraVideo));
        setIdCounter(prevCounter => prevCounter + 1);
      } catch (error) {}
    }, 1000);
  };

  const removeImage = id => {
    const updatedPhotos = postPhotos.filter(photo => photo.id !== id);
    dispatch(setPostPhotos(updatedPhotos));
  };

  const handleClearAddPostData = () => {
    dispatch(setPostGif(null));
    dispatch(setPostText(''));
    dispatch(setPostPhotos([]));
    dispatch(setPostVideo(null));
    dispatch(setSelectedPostPrivacy(postPrivary[0]));
    dispatch(setFeeling(null));
    dispatch(setFeelingType(null));
    dispatch(setSelectedMentionFriends([]));
  };

  useEffect(() => {
    if (route.params?.isFeelingModalVisible) {
      setFeelingActivityModalVisible(true);
    }

    if (route.params?.isMentionNavigate) {
      navigation.navigate('MentionFriend');
    }

    if (route.params.isUploadImgModalVisible) {
      setUploadImageModalVisible(true);
    }
  }, []);

  useEffect(() => {
    getUserData();
    const backAction = () => {
      if (
        postText ||
        postPhotos.length > 0 ||
        postVideo !== null ||
        postGif !== null ||
        selectedMentionFriends.length > 0 ||
        feeling !== null ||
        feelingType !== null
      ) {
        setDiscardPostModalVisible(true);
        return true;
      } else {
        return false;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [postText, postPhotos, postVideo, postGif]);

  const handleAddPost = () => {
    dispatch(setLoadingPosting(true));
    let modifiedText = postText;

    friendList.forEach(({first_name, last_name, username}) => {
      const mentionRegex = new RegExp(`@${first_name} ${last_name}`, 'g');
      modifiedText = modifiedText.replace(mentionRegex, `@${username}`);
    });

    const modifiedPostText =
      modifiedText +
      (selectedMentionFriends.length > 0
        ? ' With ' +
          selectedMentionFriends
            .map(friend => `@${friend.username}`)
            .join(' , ')
        : '');

    navigation.pop();

    submitAddPost(
      modifiedPostText,
      postPhotos,
      postGif,
      postVideo,
      feeling?.value ? feelingType?.value : null,
      feeling?.value,
      selectedPostPrivacy.id,
      route?.params?.postType,
      route?.params?.userId,
      route?.params?.pageInfo,
    )
      .then(value => {
        if (value.api_status === 200 || value.status == 200) {
          //add new post at the top of the post
          dispatch(addNewPostItem(value.post_data));
          route?.params?.postType === stringKey.navigateToMyPage &&
            dispatch(addNewMyPagePostItem(value.post_data));
          // dispatch(setFetchNewFeedData(true));
          dispatch(setLoadingPosting(false));
          dispatch(setSuccessPosting(true));
          dispatch(setFetchPGData(true));
          handleClearAddPostData();
        } else {
          console.error('Error adding post:', value);
          dispatch(setLoadingPosting(false));
          dispatch(setSuccessPosting(false));
          dispatch(setErrorPosting(true));
        }
      })
      .catch(error => {
        // Handle the error
        console.error('Error adding post:', error);
        dispatch(setLoadingPosting(false));
        dispatch(setSuccessPosting(false));
        dispatch(setErrorPosting(true));
      });
  };

  // const handleAddPost = () => {
  //   dispatch(setLoadingPosting(true));
  //   let modifiedText = postText;

  //   friendList.forEach(({first_name, last_name, username}) => {
  //     const mentionRegex = new RegExp(`@${first_name} ${last_name}`, 'g');
  //     modifiedText = modifiedText.replace(mentionRegex, `@${username}`);
  //   });

  //   const modifiedPostText =
  //     modifiedText +
  //     (selectedMentionFriends.length > 0
  //       ? ' With ' +
  //         selectedMentionFriends
  //           .map(friend => `@${friend.username}`)
  //           .join(' , ')
  //       : '');

  //   navigation.pop();
  //   submitAddPost(
  //     modifiedPostText,
  //     postPhotos,
  //     postGif,
  //     postVideo,
  //     feelingType?.value,
  //     feeling?.value,
  //     selectedPostPrivacy.id,
  //     route?.params?.postType,
  //     route?.params?.userId,
  //     route?.params?.pageInfo,
  //   ).then(value => {
  //     if (value.api_status === 200 || value.status == 200) {
  //       // navigation.navigate('BottomTabNavigator');
  //       Alert.alert('Call add post api');
  //       dispatch(setFetchNewFeedData(true));
  //       dispatch(setLoadingPosting(false));
  //       dispatch(setSuccessPosting(true));
  //       handleClearAddPostData();
  //     } else {
  //       dispatch(setLoadingPosting(false));
  //       dispatch(setSuccessPosting(false));
  //       dispatch(setErrorPosting(true));
  //     }
  //   });
  // };

  const handleNavigate = () => {
    if (
      postText.trim() ||
      postPhotos.length > 0 ||
      postVideo !== null ||
      postGif !== null ||
      selectedMentionFriends.length > 0 ||
      (feeling !== null && feelingType !== null)
    ) {
      setDiscardPostModalVisible(true);
    } else {
      navigation.goBack();
    }
  };

  const handleClearDataNavigate = () => {
    navigation.pop();
    handleClearAddPostData();
  };

  const getApiData = async search_key => {
    await filterSearchList(search_key).then(data => {
      if (data.api_status == 200) {
        if (data.users.length == 0) {
          setMentionFriendListVisible(false);
        } else {
          setMentionFriendListVisible(true);
        }
        setMentionFriendsList(data.users);
        setMentionListLoader(false);
      } else {
      }
    });
  };

  const getFriendList = () => {
    submitGetFriends('followers,following', userInfoData.user_id).then(
      value => {
        if (value.api_status === 200) {
          setMentionFriendsList(value.data.followers);
          setMentionListLoader(false);
        } else {
        }
      },
    );
  };

  const handleTextChange = text => {
    dispatch(setPostText(text));
    if (text.includes('@')) {
      const words = text.split(' ');

      const lastWord = words[words.length - 1];
      if (lastWord.endsWith('@')) {
        setMentionListLoader(true);
        getFriendList();
        setMentionFriendListVisible(true);
      }

      const search_key = lastWord.substring(lastWord.indexOf('@') + 1);

      if (lastWord.endsWith(`@${search_key}`)) {
        setMentionListLoader(true);
        if (search_key.trim() !== '') {
          getApiData(search_key);
        }
      }
    } else {
      setMentionFriendListVisible(false);
    }
  };
  const handleFocusOrBlur = val => {
    setIsFocused(val);
  };
  const handleSelectMentionFriends = friend => {
    // Extracting the current text content

    let friendData = {
      first_name: friend.first_name,
      last_name: friend.last_name,
      username: friend.username,
    };
    const searchText = postText.substring(0, postText.lastIndexOf('@') + 1);

    // Check if friendData already exists in friendList
    const friendAlreadyExists = friendList.some(
      existingFriend => existingFriend.username === friendData.username,
    );

    // If friendData doesn't exist, push it to friendList
    if (!friendAlreadyExists) {
      setFriendList(prevFriendList => [...prevFriendList, friendData]);
    }

    // Concatenating the chosen user's full name with the @ mention
    const newTextPost =
      searchText + friend.first_name + ' ' + friend.last_name + ' ';

    // Appending the remaining text
    dispatch(setPostText(newTextPost));
    setMentionFriendListVisible(false);
  };

  const getDarkModeTheme = async () => {
    try {
      const darkModeValue = await retrieveStringData({
        key: storeKeys.darkTheme,
      });
      if (darkModeValue !== null || undefined) {
        setDarkMode(darkModeValue);
      }
    } catch (error) {
      console.error('Error retrieving dark mode theme:', error);
    }
  };

  useEffect(() => {
    getDarkModeTheme();
  }, []);
  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);

  return (
    <SafeAreaView
      style={
        darkMode == 'enable' ? styles.darkModeContainer : styles.container
      }>
      <ActionAppBar
        appBarText="Add Post"
        backpress={handleNavigate}
        actionButtonType="text-button"
        actionButtonText="Post"
        isDisable={
          postText.trim() || postGif || postPhotos.length > 0 || postVideo
            ? false
            : true
        }
        actionButtonPress={
          postText.trim() || postGif || postPhotos.length > 0 || postVideo
            ? handleAddPost
            : null
        }
        darkMode={darkMode}
      />
     
      <AddPostHeader
        selectedPostPrivacy={selectedPostPrivacy}
        setPostPrivacyModalVisible={setPostPrivacyModalVisible}
        postVideo={postVideo}
        setPostVideo={setPostVideo}
        removeImage={removeImage}
        userInfoData={userInfoData}
        pageInfo={route?.params?.pageInfo}
        postType={route?.params?.postType}
        userId={route?.params?.userId}
        setSnapPoint={setSnapPoint}
        handleTextChange={handleTextChange}
        focusOrBlur={handleFocusOrBlur}
        darkMode={darkMode}
      />
      <AddPostFooter
        handlePostOptions={handlePostOptions}
        setSnapPoint={setSnapPoint}
        snapPoints={snapPoints}
        snapPoint={snapPoint}
        focusOrBlurValue={isFocused}
        darkMode={darkMode}
      />

      <PostPrivacyModal
        visible={postPrivacyModalVisble}
        onClose={() => setPostPrivacyModalVisible(false)}
        data={
          route?.params?.postType === stringKey.navigateToMyPage
            ? pagePrivacyList
            : postPrivary
        }
        userinfo={userInfoData}
        // data={postPrivary}
        handleSelectPrivacy={handleSelectPrivacy}
        darkMode={darkMode}
      />
      <UploadImageModal
        visible={uploadImageModalVisible}
        onClose={() => setUploadImageModalVisible(false)}
        openGallery={pickImages}
        openCamera={pickCameraImage}
        darkMode={darkMode}
      />
      <UploadVideoModal
        visible={uploadVideoModalVisible}
        onClose={() => setUploadVideoModalVisible(false)}
        openGallery={pickVideo}
        openCamera={pickVideoFile}
        darkMode={darkMode}
      />
      <FeelingActivityModal
        visible={feelingActivityModalVisible}
        onClose={() => setFeelingActivityModalVisible(false)}
        action={handleFeelingActivity}
        darkMode={darkMode}
      />
      <OtherActivityModal
        visible={otherActivityModalVisible}
        onClose={() => setOtherActivityModalVisible(false)}
        data={activityData}
        action={handleOtherActivity}
        setActivityType={setActivityType}
        activityType={activityType}
        darkMode={darkMode}
      />
      <DiscardPostModal
        visible={discardPostModalVisible}
        onClose={() => setDiscardPostModalVisible(false)}
        clearAndNavigate={handleClearDataNavigate}
        darkMode={darkMode}
      />

      {mentionFriendListVisible ? (
        <View
          style={{
            width: 300,
            height: 240,
            position: 'absolute',
            top: '40%',
            left: '10%',
            borderWidth: 0.6,
            borderColor: darkMode == 'enable' ? COLOR.Grey500 : COLOR.Grey50,
            gap: 8,
            padding: 8,
            backgroundColor:
              darkMode == 'enable' ? COLOR.DarkThemLight : COLOR.White100,
          }}>
          {mentionListLoader ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator size="small" color={COLOR.Primary} />
            </View>
          ) : (
            <ScrollView keyboardShouldPersistTaps="handled">
              {mentionFriendsList?.map((friend, index) => (
                <TouchableOpacity
                  onPress={() => handleSelectMentionFriends(friend)}
                  key={index}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                      paddingVertical: 8,
                      borderBottomColor: COLOR.Grey50,
                      borderBottomWidth: 0.5,
                    }}>
                    <DualAvater
                      largerImageWidth={45}
                      largerImageHeight={45}
                      source={{uri: friend.avatar}}
                      iconBadgeEnable={false}
                    />
                    <Text
                      style={[
                        styles.friendName,
                        darkMode == 'enable'
                          ? {color: COLOR.White}
                          : {color: COLOR.Grey500},
                      ]}>
                      {friend.first_name} {friend.last_name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  darkModeContainer: {
    flex: 1,
    backgroundColor: COLOR.DarkThemLight,
  },
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
  },
  friendName: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: PIXEL.px15,
  },
});

export default AddPost;
