// 1 . to fix rendermention in commnet edit
// 2 . link cannot open beacuse of using in text slice
// 3 . rendermnention error when meniton not exit normal text are not shown (done)

import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  PanResponder,
  Modal,
  Pressable,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';

import {useNavigation, useRoute} from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import {useDispatch} from 'react-redux';
import COLOR from '../../constants/COLOR';
import {FontFamily, fontSizes, fontWeight} from '../../constants/FONT';
import DualAvater from '../DualAvater';
import {calculateTimeDifferenceForComment} from '../../helper/Formatter';
import {retrieveJsonData, storeKeys} from '../../helper/AsyncStorage';
import SPACING from '../../constants/SPACING';
import RADIUS from '../../constants/RADIUS';
import EditPostModal from '../Post/Modal/EditPostModal';
import {
  moreOptionForLoginUser,
  moreOptionForNonLoginUser,
  reactions,
} from '../../constants/CONSTANT_ARRAY';
import {
  deleteComment,
  deleteReplyComment,
  editComment,
  reportComment,
} from '../../helper/ApiModel';
import {
  setFetchCommentData,
  setFetchReplyCommentData,
} from '../../stores/slices/CommentSlice';
import {reactionIcons} from '../../constants/CONSTANT_ARRAY';
import PIXEL from '../../constants/PIXEL';
import TermsWebView from '../../screens/TermsWebView';
import {fetchReaction} from '../../helper/ApiModel';
import {SvgUri} from 'react-native-svg';
import {URL} from '../../config';

const CommentBody = props => {
  const navigation = useNavigation();
  const route = useRoute();
  const datas = route.params;
  const [liked, setLiked] = useState(
    props.data?.reaction.is_reacted ? true : false,
  );

  const [showCommentEditModal, setShowCommentEditModal] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [shouldDisplayReadMore, setShouldDisplayReadMore] = useState(false);
  const [moreData, setMoreData] = useState(null);
  const [reactionPopUpVisible, setReactionPopUpVisible] = useState(false);

  const [isReact, setReact] = useState(props.data?.reaction.is_reacted);
  const [reactCount, setReactCount] = useState(props.data?.reaction.count);
  const [reactIcon, setReactIcon] = useState(props.data.reaction);
  const [selfReactionType, setSelfReactionType] = useState(
    props.data?.reaction.type,
  );

  useEffect(() => {
    setReactionPopUpVisible(false);
  }, [props.isReactEnable]);

  const reactText = reaction => {
    const index = props.reactionsList.findIndex(r => r.id === reaction);
    return props.reactionsList[reaction === '' ? 0 : index]?.name;
  };

  useEffect(() => {
    if (props.isCommentInReply) {
      setReactCount(props.parentReactCount);
      setSelfReactionType(props.parentSelfReactionType);
      setReactIcon(props.parentReactIcon);
    }
  }, []);

  // useEffect(() => {
  //   fetchReactData(props.data.id)
  // },[isReact])

  const renderReactions = () => {
    return (
      <TouchableOpacity
        activeOpacity={props.isCommentInReply ? 1 : 0.2}
        style={styles.reaction}
        onPress={() =>
          props.isCommentInReply
            ? null
            : navigation.navigate('CommentReactionList', {comment: props.data})
        }>
        {props.reactionsList.map(reactionType =>
          reactIcon[reactionType.id] ? (
            <View
              key={reactionType.id}
              style={[styles.iconContainer, {zIndex: 1}]}>
              {reactionType.wowonder_small_icon.endsWith('.svg') ? (
                <SvgUri
                  uri={reactionType.wowonder_small_icon}
                  // style={styles.iconStyle}
                  width={18}
                  height={18}
                />
              ) : (
                <Image
                  source={{uri: reactionType.wowonder_small_icon}}
                  style={{width: 18, height: 18}}
                  resizeMode="contain"
                />
              )}
            </View>
          ) : null,
        )}
      </TouchableOpacity>
    );
  };

  // const renderIcon = (reaction, index) => {
  //   if (reaction.wowonder_icon.endsWith('.svg')) {
  //     return (
  //       <TouchableOpacity
  //         onPressIn={() => {
  //           // handleEmojiIconsPress(reaction.id);
  //           handleEmojiIconsPress(reaction.id);
  //         }}
  //         onPressOut={() => {
  //           setReactionPopUpVisible(
  //             reactionPopUpVisible === true ? false : true,
  //           );
  //         }}
  //         onPress={() => {
  //           handleReaction();
  //         }}>
  //         <SvgUri
  //           style={styles.reactionIcon}
  //           uri={reaction.wowonder_icon}
  //           width={32}
  //           height={32}
  //         />
  //       </TouchableOpacity>
  //     );
  //   } else {
  //     return (
  //       <Image
  //         source={{ uri: reaction.wowonder_icon }}
  //         style={{ width: 32, height: 32 }}
  //         resizeMode="contain"
  //       />
  //     );
  //   }
  // };

  // useEffect(() => {

  // },[])

  let isLoginUser = null;
  const dispatch = useDispatch();

  useEffect(() => {
    checkUserType();
  }, [props.data?.user_id]);
  const checkUserType = async () => {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const user_id = loginData.user_id;
    isLoginUser = user_id == props.data.user_id;
    const newOptions = isLoginUser
      ? moreOptionForLoginUser
      : moreOptionForNonLoginUser;
    setMoreData(newOptions);
  };
  // const handleLiked = () => {
  //   if (props.isReplyComment && !props.isCommentInReply) {
  //     props.likeCommentReply(props.data.id);
  //   } else {
  //     props.likeComment(props.data.id);
  //   }
  //   setLiked(!liked);
  // };

  const handledReact = reaction => {
    if (props.isReplyComment && !props.isCommentInReply) {
      props.reactionCommentReply(props.data.id, reaction);
    } else {
      props.reactComment(props.data.id, reaction);
    }
    // dispatch(setFetchCommentData(true));
    setReactCount(reactCount + 1);
    setSelfReactionType(reaction);
    if (!reactIcon[reaction]) {
      setReactIcon(preData => ({
        ...preData,
        [reaction]: 1,
      }));
    } else {
      setReactIcon(preData => ({
        ...preData,
        [reaction]: parseInt(reactIcon[reaction]) + 1,
      }));
    }

    setReactionPopUpVisible(false);
    setReact(!isReact);

    // setReactText(reactions[reaction - 1].value);
  };

  const handleReactionVisible = type => {
    if (!isReact) {
      setReactionPopUpVisible(!reactionPopUpVisible);
    } else {
      if (props.isReplyComment && !props.isCommentInReply) {
        props.reactionCommentReply(props.data.id, '');
      } else {
        props.reactComment(props.data.id, '');
      }
      // dispatch(setFetchCommentData(true));
      setReactCount(reactCount - 1);
      setSelfReactionType('');
      if (parseInt(reactIcon[type]) == 1) {
        const updatedReaction = {...reactIcon};
        // if(selfReactionType != "" && selfReactionType != type){
        // if(reactDataCount[type].length == 1){
        delete updatedReaction[type];
        // }

        // }

        setReactIcon(updatedReaction);
      } else if (parseInt(reactIcon[type]) > 1) {
        setReactIcon(preData => ({
          ...preData,
          [type]: parseInt(reactIcon[type]) - 1,
        }));
      }

      // dispatch(setFetchReplyCommentData(true));
      setReact(false);
      // dispatch(setFetchCommentData(true));
    }
  };

  const handleReply = () => {
    // dispatch(setFetchCommentData(true))

    if (props.isReplyComment) {
      props.replyUser(props.data.publisher.name);
    } else {
      navigation.navigate('ReplyComment', {
        postid: props.data.postid,
        commentid: props.data.id,
        comment: props.data,
        replycount: props.data?.replies_count,
        replyUser: props.data.publisher.name,
        reactCount: reactCount,
        reactIcon: reactIcon,
        selfReactionType: selfReactionType,
        // reactType : reactText,
      });
    }
  };

  const highlightUserMentions = data => {
    if (!data.Orginaltext) {
      return null; // or any default value you prefer
    }

    const mentionRegex = /@([a-zA-Z0-9_]+)/g;
    const parts = data.Orginaltext.split(mentionRegex);

    return parts.map((part, index) => {
      if (part.match(mentionRegex)) {
        const mentionUser = part.match(mentionRegex)[1]; // Extract the mentioned user name
        return (
          <TouchableOpacity
            key={index}
            onPress={() => handleMentionPress(data.mention_url)}>
            <Text style={{color: 'blue', textDecorationLine: 'underline'}}>{`@${
              mentionUser + ' '
            }`}</Text>
          </TouchableOpacity>
        );
      } else {
        return <Text key={index}>{part}</Text>;
      }
    });
  };

  const renderMention = text => {
    // let myspaceIndex = text.indexOf(URL);
    const mentions = props.data.mentions_users || [];

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const mentionRegex =
      mentions.length > 0
        ? new RegExp(`(${mentions.map(user => user.name).join('|')})`, 'g')
        : null;
    // mentions.map((user) => {
    //      let friendData = {
    //   first_name: friend.first_name,
    //   last_name: friend.last_name,
    //   username: friend.username,
    // };

    // const friendAlreadyExists = props.friendList.some(
    //   existingFriend => existingFriend.username === friendData.username,
    // );

    // if (!friendAlreadyExists) {
    //   props.setFriendList(prevFriendList => [...prevFriendList, friendData]);
    // }
    // })

    const parts = [];
    let lastIndex = 0;

    const combinedRegex = mentionRegex
      ? new RegExp(`${urlRegex.source}|${mentionRegex.source}`, 'g')
      : urlRegex;

    if (mentionRegex) {
      text.replace(combinedRegex, (match, url, mention, offset) => {
        if (lastIndex !== offset) {
          parts.push(text.substring(lastIndex, offset));
        }
        if (url) {
          if (match.indexOf(URL) !== -1) {
            const myspaceIndex = text.indexOf(URL);
            const postIdStartIndex = myspaceIndex + URL.length + 5;
            const postIdEndIndex = text.indexOf('_', postIdStartIndex);
            const postId = text.substring(postIdStartIndex, postIdEndIndex);

            parts.push(
              <Text
                key="myspace_link"
                style={{color: COLOR.Primary}}
                onPress={() => {
                  navigation.navigate('PostDetail', {
                    postId: postId,
                    darkMode: props.darkMode,
                  });
                }}>
                {url}
              </Text>,
            );
          } else {
            parts.push(
              <Text
                key={url}
                style={{color: COLOR.Primary}}
                onPress={() => Linking.openURL(url)}>
                {url}
              </Text>,
            );
          }
        }

        if (mention) {
          const user = mentions.find(u => u.name === mention);
          if (user) {
            parts.push(
              <Text
                key={user.name}
                style={{color: COLOR.Primary}}
                onPress={() => {
                  if (isLoginUser) {
                    navigation.navigate('UserProfile');
                  } else {
                    navigation.navigate('OtherUserProfile', {
                      otherUserData: user,
                      userId: user.user_id,
                    });
                  }
                }}>
                {user.name}
              </Text>,
            );
          }
        }

        lastIndex = offset + match.length;
      });
    } else
      text.replace(combinedRegex, (match, url, offset) => {
        if (lastIndex !== offset) {
          parts.push(text.substring(lastIndex, offset));
        }
        if (url) {
          if (match.indexOf(URL) !== -1) {
            const myspaceIndex = text.indexOf(URL);
            const postIdStartIndex = myspaceIndex + URL.length + 5;
            const postIdEndIndex = text.indexOf('_', postIdStartIndex);
            const postId = text.substring(postIdStartIndex, postIdEndIndex);

            parts.push(
              <Text
                key="myspace_link"
                style={{color: COLOR.Primary}}
                onPress={() => {
                  navigation.navigate('PostDetail', {
                    postId: postId,
                    darkMode: props.darkMode,
                  });
                }}>
                {url}
              </Text>,
            );
          } else {
            parts.push(
              <Text
                key={url}
                style={{color: COLOR.Primary}}
                onPress={() => Linking.openURL(url)}>
                {url}
              </Text>,
            );
          }
        }

        lastIndex = offset + match.length;
      });

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  };

  useEffect(() => {
    if (props.data?.Orginaltext) {
      if (props.data.Orginaltext && props.data.Orginaltext.length > 100) {
        setShouldDisplayReadMore(true);
      }
    }
  }, [props.data?.Orginaltext]);

  const renderComment = () => {
    // const commentTextWithLinks = highlightUserMentions(props.data);
    const commentTextWithLinks = renderMention(props.data?.Orginaltext);
    const sliceText = props.data.Orginaltext.slice(0, 100);
    const sliceTextWtihLinks = renderMention(sliceText);

    if (expanded) {
      return (
        <View>
          <Text
            style={
              props.darkMode == 'enable'
                ? {color: COLOR.White}
                : {color: COLOR.Grey500}
            }>
            {commentTextWithLinks}
          </Text>
          {shouldDisplayReadMore && (
            <TouchableOpacity onPress={handleReadMore}>
              <Text style={styles.readLess}>Read Less</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    } else {
      const truncatedText =
        props.data?.Orginaltext?.length > 100
          ? sliceTextWtihLinks
          : commentTextWithLinks;
      return (
        <View>
          <Text
            style={
              props.darkMode == 'enable'
                ? {color: COLOR.White}
                : {color: COLOR.Grey500}
            }>
            {truncatedText}
          </Text>
          {shouldDisplayReadMore && (
            <TouchableOpacity onPress={handleReadMore}>
              <Text style={styles.readMore}>Read More</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }
  };

  const handleReadMore = () => {
    setExpanded(!expanded);
  };

  const handleMentionPress = url => {
    Linking.openURL(url);
  };
  const onLongPress = () => {
    setShowCommentEditModal(true);
  };
  const closeCommentEditModal = () => {
    setShowCommentEditModal(false);
  };
  const handleSelectedOption = item => {
    if (item.label == 'Copy Text') {
      copyToClipboard(props.data.Orginaltext);
      closeCommentEditModal();
    } else if (item.label == 'Report') {
      reportComments(props.data.id);
      closeCommentEditModal();
    } else if (item.label == 'Edit') {
      props.commentID(props.data.id);
      if (props.isReplyComment && !props.isCommentInReply) {
        props.setCommentText(props.data.Orginaltext);
        props.isEdit('commentreply');
      } else {
        props.setCommentText(props.data.Orginaltext);
        props.isEdit('comment');
      }
      closeCommentEditModal();
    } else if (item.label == 'Delete') {
      if (props.isReplyComment && !props.isCommentInReply) {
        fetchdeleteReplyComment(props.data.id);
      } else {
        fetchdeleteComment(props.data.id);
      }
      closeCommentEditModal();
    } else {
    }
  };
  const copyToClipboard = text => {
    if (text) {
      Clipboard.setString(text);

      props.showToast('Text copied to clipboard');
    }
  };
  const reportComments = async comment_id => {
    try {
      const data = await reportComment(comment_id);
      if (data.api_status === 200) {
        props.showToast(
          data.code == 'unreport' ? 'Comment unreported' : 'Comment reported',
        );
      } else {
      }
    } catch (error) {
    } finally {
    }
  };
  const fetchdeleteComment = async comment_id => {
    try {
      const data = await deleteComment(comment_id);
      if (data.api_status === 200) {
        props.showToast('Comment deleted successfully!');
        dispatch(setFetchCommentData(true));
        dispatch(setFetchReplyCommentData(true));
      } else {
      }
    } catch (error) {
    } finally {
    }
  };
  const fetchdeleteReplyComment = async reply_id => {
    try {
      const data = await deleteReplyComment(reply_id);
      if (data.api_status === 200) {
        props.showToast('Comment deleted successfully!');
        dispatch(setFetchCommentData(true));

        dispatch(setFetchReplyCommentData(true));
      } else {
      }
    } catch (error) {
    } finally {
    }
  };

  return (
    <View
      key={datas.postid}
      style={[
        styles.container,
        props.darkMode == 'enable'
          ? {backgroundColor: COLOR.DarkTheme}
          : {backgroundColor: COLOR.White500},
      ]}>
      <View style={styles.commentRow}>
        <DualAvater
          largerImageWidth={55}
          largerImageHeight={55}
          src={props.data?.publisher?.avatar}
          iconBadgeEnable={false}
        />

        <View style={styles.commentContainer}>
          <TouchableOpacity
            style={[
              styles.commentTextBox,
              props.darkMode == 'enable'
                ? {backgroundColor: COLOR.DarkThemLight}
                : {backgroundColor: COLOR.Grey50},
            ]}
            onLongPress={() => {
              onLongPress();
            }}>
            <Text
              style={[
                styles.commentUser,
                props.darkMode == 'enable'
                  ? {color: COLOR.White}
                  : {color: COLOR.Grey500},
              ]}>
              {/* {props.data?.publisher?.first_name}{' '}
              {props.data?.publisher?.last_name} */}
                  {props.data?.publisher?.first_name !== "" ? `${props.data?.publisher?.first_name} ${props.data?.publisher?.last_name}` : props.data?.publisher?.username}
            </Text>

            {renderComment()}
          </TouchableOpacity>
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <View style={styles.replyText}>
              <TouchableOpacity
                activeOpacity={props.isCommentInReply ? 1 : 0.2}
                onPress={() => {
                  props.isCommentInReply
                    ? null
                    : handleReactionVisible(selfReactionType);
                }}>
                <Text
                  style={[
                    styles.replyLike,
                    selfReactionType == ''
                      ? props.darkMode === 'enable'
                        ? {color: COLOR.White}
                        : {color: COLOR.Grey400}
                      : selfReactionType == 1
                      ? {color: COLOR.Primary}
                      : selfReactionType == 2
                      ? {color: '#FF5F6F'}
                      : selfReactionType == 6
                      ? {color: '#E75337'}
                      : {color: '#FFC62F'},
                  ]}>
                  {reactText(selfReactionType)}
                </Text>
              </TouchableOpacity>
              {!props.isCommentInReply && (
                <TouchableOpacity
                  onPress={() => {
                    handleReply();
                  }}>
                  <Text
                    style={[
                      styles.replyAction,
                      props.darkMode == 'enable'
                        ? {color: COLOR.White}
                        : {color: COLOR.Grey400},
                    ]}>
                    {props.isReplyComment
                      ? `Reply`
                      : props.data?.replies_count != '0'
                      ? `Reply (${props.data?.replies_count})`
                      : `Reply`}
                  </Text>
                </TouchableOpacity>
              )}
              <Text
                style={[
                  styles.replyTime,
                  props.darkMode == 'enable'
                    ? {color: COLOR.White}
                    : {color: COLOR.Grey400},
                ]}>
                {calculateTimeDifferenceForComment(props.data?.time)}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
              <Text
                style={[
                  styles.reactCount,
                  props.darkMode == 'enable'
                    ? {color: COLOR.White}
                    : {color: COLOR.Grey400},
                ]}>
                {reactCount === 0 ? '' : reactCount}
              </Text>
              {renderReactions()}
            </View>
          </View>
        </View>
      </View>

      {showCommentEditModal && (
        <EditPostModal
          visible={showCommentEditModal}
          onClose={closeCommentEditModal}
          data={moreData}
          handleSelectedOption={handleSelectedOption}
        />
      )}

      {reactionPopUpVisible && (
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            backgroundColor: COLOR.White,
            padding: 12,
            gap: 12,
            borderRadius: 192,
          }}
          // ref={props.targetRef}
        >
          {props.reactionsList.map(reaction => (
            <TouchableOpacity onPress={() => handledReact(reaction.id)}>
              {reaction.wowonder_small_icon.endsWith('.svg') ? (
                <SvgUri uri={reaction.wowonder_icon} width={32} height={32} />
              ) : (
                <Image
                  source={{uri: reaction.wowonder_small_icon}}
                  style={{width: 32, height: 32}}
                  resizeMode="contain"
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* {reactionPopUpVisible && (
  
    <View style={{ zIndex : 1 ,flexDirection: 'row', position: 'absolute', top: 0, left: 0, backgroundColor: COLOR.White, padding: 12, gap: 12, borderRadius: 192, }}>
      {reactions.map((reaction) => (
        <TouchableOpacity key={reaction.id} onPress={() => handledReact(reaction.id)} style = {{pointerEvents: 'none',}}>
          <Image source={reaction.icon} style={{ width: 32, height: 32 }} resizeMode='contain' />
        </TouchableOpacity>
      ))}
       
    </View>
   
  
)} */}
    </View>
  );
};

export default CommentBody;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  commentRow: {
    marginTop: SPACING.sp16,
    marginHorizontal: SPACING.sp16,
    display: 'flex',
    flexDirection: 'row',
  },
  commentContainer: {
    flex: 1,
    display: 'flex',
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

    fontWeight: fontWeight.bold,
  },
  commentUserText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.Grey500,
    flexWrap: 'wrap',
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
    fontWeight: fontWeight.bold,
  },
  replyAction: {
    marginRight: SPACING.sp12,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    fontWeight: fontWeight.bold,
  },
  replyTime: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    fontWeight: fontWeight.bold,
  },
  reactCount: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    fontWeight: fontWeight.bold,
  },
  iconContainer: {
    marginRight: -SPACING.sp8,
  },
  reaction: {
    flexDirection: 'row',
    paddingRight: SPACING.sp10,
    paddingTop: SPACING.sp3,
  },
  iconStyle: {
    width: PIXEL.px18,
    height: PIXEL.px18,
  },
});
