import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import IconManager from '../../assets/IconManager';
import {useNavigation} from '@react-navigation/core';
import AddPostHeader from '../../components/Post/AddPostHeader';
import {useDispatch, useSelector} from 'react-redux';
import {
  feelingActivityOptions,
  postPrivary,
} from '../../constants/CONSTANT_ARRAY';
import {
  filterSearchList,
  getUserInfoData,
  sharePostOnGroup,
  sharePostOnPage,
  sharePostOnTimeLine,
  submitGetFriends,
} from '../../helper/ApiModel';
import {
  setPostText,
  setSelectedMentionFriends,
} from '../../stores/slices/AddPostSlice';
import PostHeader from '../../components/Post/PostHeader';
import SPACING from '../../constants/SPACING';
import RADIUS from '../../constants/RADIUS';
import COLOR from '../../constants/COLOR';
import PIXEL from '../../constants/PIXEL';
import PostFooter from '../../components/Post/PostFooter';
import PostReaction from '../../components/Post/PostReaction';
import PostText from '../../components/Post/PostText';
import PostBody from '../../components/Post/PostBody';
import {ScrollView} from 'react-native-gesture-handler';
import {TouchableOpacity} from '@gorhom/bottom-sheet';
import DualAvater from '../../components/DualAvater';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {retrieveStringData, storeKeys} from '../../helper/AsyncStorage';
import PostReactionAndFooter from './PostReactionAndFooter';

const SharePost = props => {
  const navigation = useNavigation();
  const [userInfoData, setUserInfoData] = useState(null);
  const [postPrivacyModalVisble, setPostPrivacyModalVisible] = useState(false);
  const postPrivaryFiltered = postPrivary.filter(
    option => option.label !== 'Monetization',
  );
  const [shareType, setShareType] = useState(props.route.params.shareType);

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
  const [mentionListLoader, setMentionListLoader] = useState(false);
  const [mentionFriendsList, setMentionFriendsList] = useState([]);
  const [mentionFriendListVisible, setMentionFriendListVisible] =
    useState(false);
  const selectedPostPrivacy = useSelector(
    state => state.AddPostSlice.selectedPostPrivacy,
  );

  const postText = useSelector(state => state.AddPostSlice.postText);
  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);

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

  useEffect(() => {
    getUserData();
  }, []);
  const dispatch = useDispatch();
  const getUserData = async () => {
    const userInfo = await getUserInfoData();

    setUserInfoData(userInfo.user_data);
  };
  const handleClearAddPostData = () => {
    dispatch(setPostText(''));

    dispatch(setSelectedMentionFriends([]));
  };
  const sharePost = () => {
    try {
      let modifiedText = postText;

      mentionFriendsList.forEach(({first_name, last_name, username}) => {
        const mentionRegex = new RegExp(`@${first_name} ${last_name}`, 'g');
        modifiedText = modifiedText.replace(mentionRegex, `@${username}`);
      });

      if (shareType == 'share_post_on_timeline') {
        sharePostOnTimeLine(
          shareType,
          props.route.params.postid,
          userInfoData.user_id,
          modifiedText,
          navigation,
          (isShortVideo = props.route.params.isShortVideo),
          (isMarket = props.route.params.isMarket),
        );
      } else if (shareType == 'share_post_on_page') {
        sharePostOnPage(
          shareType,
          props.route.params.postid,
          props.route.params.group.page_id,
          modifiedText,
          navigation,
          (isShortVideo = props.route.params.isShortVideo),
          (isMarket = props.route.params.isMarket),
        );
      } else {
        sharePostOnGroup(
          shareType,
          props.route.params.postid,
          props.route.params.group.group_id,
          modifiedText,
          navigation,
          (isShortVideo = props.route.params.isShortVideo),
          (isMarket = props.route.params.isMarket),
        );
      }
      handleClearAddPostData();
    } catch (error) {}
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
  const handleFocusOrBlur = val => {};
  const handleSelectMentionFriends = friend => {
    // Extracting the current text content

    let friendData = {
      first_name: friend.first_name,
      last_name: friend.last_name,
      username: friend.username,
    };
    const searchText = postText.substring(0, postText.lastIndexOf('@') + 1);

    // Check if friendData already exists in friendList
    const friendAlreadyExists = mentionFriendsList.some(
      existingFriend => existingFriend.username === friendData.username,
    );

    // If friendData doesn't exist, push it to friendList
    if (!friendAlreadyExists) {
      setMentionFriendsList(prevFriendList => [...prevFriendList, friendData]);
    }

    // Concatenating the chosen user's full name with the @ mention
    const newTextPost =
      searchText + friend.first_name + ' ' + friend.last_name + ' ';

    // Appending the remaining text
    setMentionFriendListVisible(false);
    dispatch(setPostText(newTextPost));
  };
  return (
    <SafeAreaView
      style={[
        styles.containerStyle,
        darkMode == 'enable'
          ? {backgroundColor: COLOR.DarkThemLight}
          : {backgroundColor: COLOR.White},
      ]}>
      <ActionAppBar
        appBarText="Share Post"
        source={IconManager.back_light}
        backpress={() => {
          navigation.goBack();
        }}
        actionButtonType="text-button"
        actionButtonText="Share"
        actionButtonPress={sharePost}
        darkMode={darkMode}
      />
      <ScrollView
        bounces={false}
        style={
          darkMode == 'enable'
            ? {backgroundColor: COLOR.DarkTheme}
            : {backgroundColor: COLOR.White}
        }>
        <AddPostHeader
          userInfoData={userInfoData}
          handleTextChange={handleTextChange}
          sharePost
          focusOrBlur={handleFocusOrBlur}
          darkMode={darkMode}
        />
        <View style={styles.horizontalline} />

        <View
          style={[
            styles.postContainer,
            darkMode == 'enable'
              ? {backgroundColor: COLOR.DarkTheme}
              : {backgroundColor: COLOR.White},
          ]}>
          <PostHeader
            data={
              props.route.params.post.shared_info
                ? props.route.params.post.shared_info
                : props.route.params.post
            }
            sharedText={props.route.params.post?.shared_info}
            darkMode={darkMode}
            isFromShare={props.route.params.isFromShare}
          />
          {props.route.params.post?.shared_info && (
            <View style={{marginTop: SPACING.sp15}}>
              <PostText
                postText={props.route.params.post.Orginaltext}
                mentions_users={props.route.params.post?.mentions_users}
                darkMode={darkMode}
              />
              <View style={styles.horizontalLine} />
              <PostHeader
                data={props.route.params.post?.shared_info}
                isShared={true}
                darkMode={darkMode}
              />
            </View>
          )}
          <PostBody data={props.route.params.post} darkMode={darkMode} />

          {/* <PostReactionAndFooter
            selfReaction={props.route.params.reaction}
            username={props.route.params.post.username}
            item={props.route.params.post}
            darkMode={darkMode}
            reaction={props.route.params.reaction}
            doReaction={props.route.params.doReaction}
            posts={props.route.params.posts}
            setPosts={props.route.params.setPosts}
            index={props.route.params.index}
            groupList={props.route.params.groupList}
            pageList={props.route.params.pageList}
            setOtherReactionPopupStatus={
              props.route.params.setOtherReactionPopupStatus
            }
            isOtherReactionPopupStatus={
              props.route.params.isOtherReactionPopupStatus
            }
            selfReactionId={props.route.params.selfReactionId}
            userData={props.route.params.userData}
            isReactEnable={props.route.params.isReactEnable}
            setReactEnable={props.route.params.setReactEnable}
            reactionType={props.route.params.reactionType}
            isFromShare={props.route.params.isFromShare}
          /> */}
          {/* {props.route.params.post.reaction ? (
            <PostReaction
              data={props.route.params.post}
              selfReaction={props.route.params.post.reaction}
              // selfReactionId={selfReactionId}
              // username={posts.username}

              username={props.route.params.post.username}
              darkMode = {darkMode}
            />
          ) : null}

          <PostFooter
            data={props.route.params.post}
            reaction={props.route.params.reaction}
            doReaction={props.route.params.posts?.doReaction}
            darkMode = {darkMode}
          /> */}
          <View
            style={[
              styles.gapStyle,
              darkMode == 'enable'
                ? {backgroundColor: COLOR.DarkTheme}
                : {backgroundColor: COLOR.Grey50},
            ]}
          />
        </View>
        {mentionFriendListVisible ? (
          <View
            style={{
              width: 300,
              height: 240,
              position: 'absolute',
              top: '40%',
              left: '10%',
              borderWidth: 0.6,
              borderColor: COLOR.Grey50,
              gap: 8,
              padding: 8,
              backgroundColor: COLOR.White100,
            }}>
            {mentionListLoader ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
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
                      <Text>
                        {friend.first_name} {friend.last_name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SharePost;

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
  },
  postContainer: {
    marginTop: SPACING.sp10,
    marginBottom: RADIUS.rd4,
    elevation: 0,
  },
  gapStyle: {
    width: '100%',
    height: PIXEL.px10,
    marginBottom: SPACING.sp15,
  },
  horizontalLine: {
    borderBottomColor: COLOR.Grey300,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginHorizontal: SPACING.sp10,
    marginBottom: SPACING.sp20,
    marginTop: SPACING.sp10,
  },
  horizontalline: {
    borderBottomColor: '#767676',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginHorizontal: 10,
  },
});
