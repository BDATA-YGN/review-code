import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import IconManager from '../../assets/IconManager';
import {useNavigation} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import COLOR from '../../constants/COLOR';
import {FontFamily, fontSizes, fontWeight} from '../../constants/FONT';
import SPACING from '../../constants/SPACING';
import CommentFooter from '../../components/Comment/CommentFooter';
import PIXEL from '../../constants/PIXEL';
import RADIUS from '../../constants/RADIUS';
import {useDispatch, useSelector} from 'react-redux';
import {
  setFetchCommentData,
  setFetchReplyCommentData,
} from '../../stores/slices/CommentSlice';
import {
  getCommentData,
  getReactionTypeList,
  getReplyCommentData,
  getReplyCommentLike,
  submitCommentReact,
  submitCommentReactReply,
} from '../../helper/ApiModel';
import CommentBody from '../../components/Comment/CommentBody';
import Toast from 'react-native-toast-message';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {retrieveStringData, storeKeys} from '../../helper/AsyncStorage';
import DualAvater from '../../components/DualAvater';

const ReplyComment = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [commentID, setCommentID] = useState(null);
  const [replyCount, setReplyCount] = useState(null);
  const [replyText, setReplyText] = useState(null);
  const [comment, setComment] = useState([]);
  const [liked, setLiked] = useState(null);
  const [isEditComment, setIsEditComment] = useState(null);
  const [name, setName] = useState(null);
  const [commentText, setCommentText] = useState(null);
  const fetchReplyCommentData = useSelector(
    state => state.CommentSlice.fetchReplyCommentData,
  );
  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const [mentionFriendsList, setMentionFriendsList] = useState([]);
  const [mentionListLoader, setMentionListLoader] = useState(false);
  const [mentionFriendListVisible, setMentionFriendListVisible] =
    useState(false);
  const [commentInputText, setCommentInputText] = useState('');
  const [friendList, setFriendList] = useState([]);
  const fetchcomment = useSelector(
    state => state.CommentSlice.fetchCommentData,
  );
  const [isReactEnable, setReactEnable] = useState(false);

  const [reactionsList, setReactionList] = useState([]);

  const fetchReactionType = () => {
    getReactionTypeList().then(data => {
      if (data.api_status === 200) {
        setReactionList(data.data);
      }
    });
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
    let publisher = props.route.params.comment.publisher;
    setName(props.route.params.replyUser);
    setFriendList([
      {
        first_name: publisher.first_name,
        last_name: publisher.last_name,
        username: publisher.username,
      },
    ]);

    // "publisher": {
    //   "user_id": "1",
    //   "username": "admin",
    //   "email": "obadaarnaout@gmail.com",
    //   "first_name": "",
    //   "last_name": "",

    setReplyCount(props.route.params.replycount);
    if (props.route.params.replycount > 1) {
      setReplyText('Replies');
    } else {
      setReplyText('Reply');
    }
    fetchDataReply(props.route.params.commentid);
    fetchReactionType();
  }, []);
  useEffect(() => {
    if (fetchReplyCommentData) {
      fetchDataReply(props.route.params.commentid);
      dispatch(setFetchReplyCommentData(false));
    }
  }, [fetchReplyCommentData]);
  const fetchDataReply = async comment_id => {
    try {
      const data = await getReplyCommentData(
        'fetch_comments_reply',
        comment_id,
      );

      if (data.api_status === 200) {
        setComment(data.data);
        setLiked(data.data.comment_likes == '0' ? false : true);
      } else {
      }
    } catch (error) {
    } finally {
    }
  };

  const reactComment = async (comment_id, reaction) => {
    try {
      const data = await submitCommentReact(
        'reaction_comment',
        comment_id,
        reaction,
      );
      if (data.api_status === 200) {
      } else {
      }
    } catch (error) {
    } finally {
    }
  };

  const reactionCommentReply = async (reply_id, reaction) => {
    try {
      const data = await submitCommentReactReply(
        'reaction_reply',
        reply_id,
        reaction,
      );
      if (data.api_status === 200) {
      } else {
      }
    } catch (error) {
    } finally {
    }
  };

  const createCommentReply = async text => {
    try {
      const data = await getCommentData(
        'create_reply',
        '',
        text,
        props.route.params.commentid,
        '',
      );

      if (data.api_status === 200) {
        setComment([...comment, data.data]);
        dispatch(setFetchCommentData(true));
      } else {
      }
    } catch (error) {
    } finally {
    }
  };
  const handleToast = message => {
    showToast(message);
  };
  const resetCommentData = () => {
    setCommentText('');
    setIsEditComment('');
    setName('');
  };
  const showToast = msg => {
    Toast.show({
      type: 'success',
      text1: msg,
      visibilityTime: 4000,
      position: 'bottom',
    });
  };

  const handleSelectMentionFriends = friend => {
    let friendData = {
      first_name: friend.first_name,
      last_name: friend.last_name,
      username: friend.username,
    };
    const searchText = commentInputText.substring(
      0,
      commentInputText.lastIndexOf('@') + 1,
    );

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

    setCommentInputText(newTextPost);
    setMentionFriendListVisible(false);
  };
  return (
    <Pressable
      onPressIn={() => setReactEnable(!isReactEnable)}
      style={{flex: 1}}>
      <SafeAreaView
        style={[
          styles.container,
          darkMode == 'enable'
            ? {backgroundColor: COLOR.DarkThemLight}
            : {backgroundColor: COLOR.White},
        ]}>
        <View style={styles.appbar}>
          <TouchableOpacity
            onPress={() => {
              navigation.pop();
            }}
            style={{width: '10%'}}>
            <Image
              style={styles.backIconStyle}
              source={
                darkMode == 'enable'
                  ? IconManager.back_dark
                  : IconManager.back_light
              }
              resizeMode="contain"
            />
          </TouchableOpacity>

          <Text
            style={[
              styles.reactions,
              darkMode == 'enable'
                ? {color: COLOR.White}
                : {color: COLOR.Grey500},
            ]}>
            {replyCount + ' ' + replyText}
          </Text>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}>
          <ScrollView
            style={[
              styles.childContainer,
              darkMode == 'enable'
                ? {backgroundColor: COLOR.DarkTheme}
                : {backgroundColor: COLOR.White},
            ]}>
            <View>
              <CommentBody
                data={props.route.params.comment}
                reactionsList={reactionsList}
                reactComment={reactComment}
                isCommentInReply
                showToast={handleToast}
                commentID={id => {
                  setCommentID(id);
                }}
                setCommentText={text => {
                  setCommentText(text);
                }}
                isEdit={val => {
                  setIsEditComment(val);
                }}
                replyUser={name => {
                  setName(name);
                }}
                darkMode={darkMode}
                parentReactCount={props.route.params.reactCount}
                parentReactIcon={props.route.params.reactIcon}
                parentSelfReactionType={props.route.params.selfReactionType}
                // parentReactText = {props.route.params.reactType}
                // friendList = {friendList}
              />
            </View>

            {comment.length > 0 &&
              comment.map((value, index) => (
                <View
                  style={[styles.commentBody, {marginLeft: 50}]}
                  key={index}>
                  <CommentBody
                    data={value}
                    // likeCommentReply={likeCommentReply}
                    reactionsList={reactionsList}
                    isReactEnable={isReactEnable}
                    setReactEnable={setReactEnable}
                    reactionCommentReply={reactionCommentReply}
                    isReplyComment
                    showToast={handleToast}
                    commentID={id => {
                      setCommentID(id);
                    }}
                    setCommentText={text => {
                      setCommentText(text);
                    }}
                    isEdit={val => {
                      setIsEditComment(val);
                    }}
                    replyUser={name => {
                      setName(name);
                    }}
                    darkMode={darkMode}
                  />
                </View>
              ))}
          </ScrollView>
          {mentionFriendListVisible ? (
            <View
              style={{
                width: 300,
                height: 240,
                position: 'absolute',
                top: '30%',
                left: '10%',
                borderWidth: 0.6,
                borderColor:
                  props.darkMode == 'enable' ? COLOR.Grey500 : COLOR.Grey50,
                gap: 8,
                padding: 8,
                backgroundColor:
                  props.darkMode == 'enable'
                    ? COLOR.DarkThemLight
                    : COLOR.White100,
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
                        <Text
                          style={[
                            styles.friendName,
                            props.darkMode == 'enable'
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
          <CommentFooter
            createReplyComment={createCommentReply}
            replyUser={name}
            commentId={comment[0]?.id}
            isCommentInReply
            data={props.replyComment}
            // isMention={(value, search_key) => { handleMentionFromInput(value, search_key) }}
            comment={comment => {
              setComment(comment);
            }}
            isEdit={isEditComment}
            setCommentText={commentText}
            commentID={commentID}
            resetData={resetCommentData}
            darkMode={darkMode}
            setMentionFriendsList={setMentionFriendsList}
            setMentionFriendListVisible={setMentionFriendListVisible}
            setMentionListLoader={setMentionListLoader}
            commentInputText={commentInputText}
            setCommentInputText={setCommentInputText}
            friendList={friendList}
          />
        </KeyboardAvoidingView>

        <Toast ref={ref => Toast.setRef(ref)} />
      </SafeAreaView>
    </Pressable>
  );
};

export default ReplyComment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  childContainer: {
    flex: 1,
  },
  footerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: PIXEL.px60,
    paddingHorizontal: SPACING.sp10,
    paddingVertical: SPACING.sp16,
    borderTopWidth: 1,
    borderColor: COLOR.White50,
  },
  textInput: {
    backgroundColor: COLOR.White50,
    width: '90%',
    height: PIXEL.px40,
    borderRadius: RADIUS.rd100,
    paddingLeft: SPACING.sp42,
  },
  iconStyle: {
    width: PIXEL.px30,
    height: SPACING.sp25,
  },
  commentRow: {
    marginTop: SPACING.sp16,
    marginHorizontal: SPACING.sp16,
    display: 'flex',
    flexDirection: 'row',
  },
  commentContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  commentTextBox: {
    backgroundColor: COLOR.Grey50,
    marginLeft: SPACING.sp10,
    paddingHorizontal: SPACING.sp12,
    paddingVertical: SPACING.sp10,
    borderBottomLeftRadius: RADIUS.rd10,
    borderTopRightRadius: RADIUS.rd10,
    borderBottomRightRadius: RADIUS.rd10,
  },
  commentUser: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.Grey500,
    fontWeight: fontWeight.weight600,
  },
  commentUserText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.Grey500,
    flexWrap: 'wrap',
    fontWeight: fontWeight.weight400,
  },
  replyText: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: SPACING.sp10,
    marginBottom: SPACING.sp12,
  },
  replyLike: {
    marginRight: SPACING.sp12,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    color: COLOR.Grey400,
    fontWeight: fontWeight.weight400,
  },
  replyAction: {
    marginRight: SPACING.sp12,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    color: COLOR.Grey400,
    fontWeight: fontWeight.weight400,
  },
  replyTime: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    color: COLOR.Grey400,
    fontWeight: fontWeight.weight400,
  },

  commentBodyContainer: {
    backgroundColor: COLOR.White500,
    display: 'flex',
    flexDirection: 'column',
  },
  backIconStyle: {
    width: PIXEL.px9,
    height: PIXEL.px16,
    padding: SPACING.sp7,
  },
  appbar: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 0.3,
    borderColor: '#A6A6A6',
    alignItems: 'center',
    padding: SPACING.sp16,
  },
  reactions: {
    marginLeft: 10,
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
  },
});
