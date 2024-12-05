import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import PIXEL from '../../constants/PIXEL';
import SPACING from '../../constants/SPACING';
import COLOR from '../../constants/COLOR';
import RADIUS from '../../constants/RADIUS';
import IconManager from '../../assets/IconManager';
import i18next from 'i18next';
import {
  editComment,
  editReplyComment,
  filterSearchList,
  getUserInfoData,
} from '../../helper/ApiModel';
import {
  setFetchCommentData,
  setFetchReplyCommentData,
} from '../../stores/slices/CommentSlice';
import {submitGetFriends} from '../../helper/ApiModel';
import DualAvater from '../DualAvater';

const CommentFooter = props => {
  const textInputRef = useRef(null);
  const dispatch = useDispatch();
  // const [comment, setComment] = useState('');

  const [userInfoData, setUserInfoData] = useState(null);
  useEffect(() => {
    getUserData();

    if (props.replyUser && !props.setCommentText) {
      // props.setFriendList([{"first_name": "Soe", "last_name": "Gyi", "username": "Soegyi"}])
      textInputRef.current.focus();

      props.setCommentInputText('@' + props.replyUser + ' ');
      // handleTextChange(props.commentInputText)
    } else if (props.setCommentText && textInputRef.current) {
      textInputRef.current.focus();
      props.setCommentInputText(props.setCommentText);
    }
  }, [props.replyUser, props.url, props.setCommentText]);

  const isOnlySpaces = value => {
    return value.trim() === '';
  };

  const handleSendComment = () => {
    let modifiedText = props.commentInputText;
    if (isOnlySpaces(modifiedText)) {
      // Alert.alert('Error', 'Peleae write comment.');
    } else {
      props.friendList.forEach(({first_name, last_name, username}) => {
        const mentionRegex = new RegExp(`@${first_name} ${last_name}`, 'g');
        modifiedText = modifiedText.replace(mentionRegex, `@${username}`);
      });

      if (props.isCommentInReply && !props.isEdit && !props.setCommentText) {
        props.createReplyComment(modifiedText);
      } else {
        if (props.isEdit == 'comment' && props.setCommentText) {
          fetchEditComment(props.commentID, modifiedText);
        } else if (props.isEdit == 'commentreply' && props.setCommentText) {
          fetchEditReplyComment(props.commentID, modifiedText);
        } else {
          props.createComment(modifiedText);
        }
      }
      props.setCommentInputText('');
      props.resetData();
    }
  };

  const fetchEditComment = async (comment_id, text) => {
    try {
      const data = await editComment(comment_id, text);
      if (data.api_status === 200) {
        dispatch(setFetchCommentData(true));
        dispatch(setFetchReplyCommentData(true));
      } else {
      }
    } catch (error) {
    } finally {
    }
  };
  const fetchEditReplyComment = async (reply_id, text) => {
    try {
      const data = await editReplyComment(reply_id, text);
      if (data.api_status === 200) {
        dispatch(setFetchCommentData(true));

        dispatch(setFetchReplyCommentData(true));
      } else {
      }
    } catch (error) {
    } finally {
    }
  };

  const getUserData = async () => {
    const userInfo = await getUserInfoData();
    setUserInfoData(userInfo.user_data);
  };

  const getFriendList = () => {
    submitGetFriends('followers,following', userInfoData.user_id).then(
      value => {
        if (value.api_status === 200) {
          props.setMentionFriendsList(value.data.followers);
          props.setMentionListLoader(false);
        } else {
        }
      },
    );
  };

  const handleTextChange = text => {
    // dispatch(setPostText(text));
    props.setCommentInputText(text);
    if (text.includes('@')) {
      const words = text.split(' ');

      const lastWord = words[words.length - 1];
      if (lastWord.endsWith('@')) {
        props.setMentionListLoader(true);
        getFriendList();
        props.setMentionFriendListVisible(true);
      }

      const search_key = lastWord.substring(lastWord.indexOf('@') + 1);

      if (lastWord.endsWith(`@${search_key}`)) {
        props.setMentionListLoader(true);
        if (search_key.trim() !== '') {
          getApiData(search_key);
        }
      }
    } else {
      props.setMentionFriendListVisible(false);
    }
  };

  const getApiData = async search_key => {
    await filterSearchList(search_key).then(data => {
      if (data.api_status == 200) {
        if (data.users.length == 0) {
          props.setMentionFriendListVisible(false);
        } else {
          props.setMentionFriendListVisible(true);
        }
        props.setMentionFriendsList(data.users);
        props.setMentionListLoader(false);
      } else {
      }
    });
  };

  return (
    <View style={styles.footerContainer}>
      <TextInput
        ref={textInputRef}
        style={[
          styles.textInput,
          props.darkMode == 'enable'
            ? {backgroundColor: COLOR.DarkFadeLight}
            : {backgroundColor: COLOR.White50},
        ]}
        placeholder={i18next.t('translation:writeComment')}
        value={props.commentInputText}
        // onChangeText={text => {
        //   setComment(text);
        // }}
        onChangeText={handleTextChange}
        placeholderTextColor={
          props.darkMode == 'enable' ? COLOR.White : COLOR.Grey400
        }
        color={props.darkMode == 'enable' ? COLOR.White : COLOR.Grey400}
      />

      <TouchableOpacity
        style={{padding: SPACING.sp10}}
        onPress={() => {
          handleSendComment();
        }}>
        <Image
          source={
            props.darkMode == 'enable'
              ? IconManager.send_dark
              : IconManager.send_light
          }
          style={styles.iconStyle}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default CommentFooter;
const styles = StyleSheet.create({
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
    width: '90%',
    height: PIXEL.px40,
    borderRadius: RADIUS.rd100,
    paddingLeft: SPACING.sp42,
  },
  iconStyle: {
    width: PIXEL.px30,
    height: SPACING.sp25,
  },
});
