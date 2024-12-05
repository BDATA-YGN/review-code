import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Text,
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import IconManager from '../../assets/IconManager';
import SPACING from '../../constants/SPACING';
import PIXEL from '../../constants/PIXEL';
import ModalComponent from '../../commonComponent/ModalComponent';
import {getJoinedGroupList, getPageList} from '../../helper/ApiModel';
import {reactions, shareOptions} from '../../constants/CONSTANT_ARRAY';
import {useDispatch, useSelector} from 'react-redux';
import {
  setFetchGroupList,
  setFetchPageList,
} from '../../stores/slices/PostSlice';
import COLOR from '../../constants/COLOR';
import {SvgUri} from 'react-native-svg';
import RADIUS from '../../constants/RADIUS';
const PostFooter = props => {
  const navigation = useNavigation();
  const [openModal, setOpenModal] = useState(false);
  const [doReaction, setDoReaction] = useState(true);
  const [isReacted, setIsReacted] = useState(props.data?.reaction?.is_reacted);

  const [message, setMessage] = useState(null);
  const [emptyPage, setEmptyPage] = useState(false);
  const [reactionPopUpVisible, setReactionPopUpVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({x: 0, y: 0});
  const [isHovered, setIsHovered] = useState(false);
  const [reactionId, setReactionId] = useState(0);

  // const dispatch = useDispatch();

  useEffect(() => {
    props.data?.reaction?.type === ''
      ? setReactionId(0)
      : setReactionId(props.data?.reaction?.type);
  }, []);

  useEffect(() => {
    setReactionPopUpVisible(false);
  }, [props.isReactEnable]);

  const handlePress = event => {
    const {locationX, locationY} = event.nativeEvent;
    setPopupPosition({x: locationX, y: locationY});

    setReactionPopUpVisible(!reactionPopUpVisible);
  };
  const handlePressIn = reaction => {
    setIsHovered(true);
  };

  const handlePressOut = reaction => {
    setIsHovered(false);
  };
  const handleReaction = () => {
    setDoReaction(!doReaction);
    setIsReacted(!isReacted);
    props.reaction({
      postid: props.data.post_id,
      isReacted: isReacted,
      type: props.typeOfReaction,
      doReaction: doReaction,
      setSelfReacted: props.setSelfReacted,
      isSelfReacted: props.isSelfReacted,
      isSelfReactedEmojiId: props.isSelfReactedEmojiId,
    });
  };

  const handleReactionReact = () => {
    setDoReaction(!doReaction);
    setIsReacted(!isReacted);
    props.reaction({
      postid: props.data.post_id,
      isReacted: isReacted,
      type: '1',
      doReaction: doReaction,
      setSelfReacted: props.setSelfReacted,
      isSelfReacted: props.isSelfReacted,
      isSelfReactedEmojiId: props.isSelfReactedEmojiId,
    });
  };

  const renderIcon = (reaction, index) => {
    return (
      <TouchableOpacity
        onPressIn={() => {
          // handleEmojiIconsPress(reaction.id);
          handleEmojiIconsPress(reaction.id, false);
        }}
        onPressOut={() => {
          setReactionPopUpVisible(reactionPopUpVisible === true ? false : true);
        }}
        onPress={() => {
          handleReaction();
        }}>
        {reaction.wowonder_icon.endsWith('.svg') ? (
          <SvgUri
            style={styles.reactionIcon}
            uri={reaction.wowonder_icon}
            width={32}
            height={32}
          />
        ) : (
          <Image
            source={{uri: reaction.wowonder_icon}}
            style={{width: 32, height: 32}}
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>
    );
  };

  const handleEmojiIconsPress = (properties, unReact) => {
    const {data, posts, index, setSelfReacted, setTypeOfReaction, setPosts} =
      props;
    const post = props.isFromDetail ? data : posts[index];
    const reactionType = post.reaction.type;

    const updateReaction = newType => {
      if (post.reaction[reactionType]) {
        if (parseInt(post.reaction[reactionType]) > 1) {
          // delete post.reaction[reactionType];
          // post.reaction.type = newType;
          post.reaction[reactionType] = (
            parseInt(post.reaction[reactionType], 10) - 1
          ).toString();
          post.reaction.is_reacted = false;
          post.reaction.type = '';

          if (post.reaction[newType]) {
            if (parseInt(post.reaction[newType]) >= 1) {
              post.reaction.type = newType;
              post.reaction[newType] = (
                parseInt(post.reaction[newType], 10) + 1
              ).toString();
              post.reaction.is_reacted = true;
            } else {
              post.reaction.type = newType;
              post.reaction[newType] = (1).toString();
              post.reaction.is_reacted = true;
            }
          } else {
            post.reaction.type = newType;
            post.reaction[newType] = (1).toString();
            post.reaction.is_reacted = true;
          }
          !props.isFromDetail && setPosts(posts);
        } else if (parseInt(post.reaction[reactionType]) == 1) {
          delete post.reaction[reactionType];
          post.reaction.is_reacted = false;
          post.reaction.type = '';

          if (post.reaction[newType]) {
            if (parseInt(post.reaction[newType]) >= 1) {
              post.reaction.type = newType;
              post.reaction[newType] = (
                parseInt(post.reaction[newType], 10) + 1
              ).toString();
              post.reaction.is_reacted = true;
            } else {
              post.reaction.type = newType;
              post.reaction[newType] = (1).toString();
              post.reaction.is_reacted = true;
            }
          } else {
            post.reaction.type = newType;
            post.reaction[newType] = (1).toString();
            post.reaction.is_reacted = true;
          }
          !props.isFromDetail && setPosts(posts);
        } else {
          delete post.reaction[reactionType];
          post.reaction.is_reacted = false;
          post.reaction.type = '';

          post.reaction.type = newType;
          post.reaction[newType] = (1).toString();
          post.reaction.is_reacted = true;
          !props.isFromDetail && setPosts(posts);
        }
      } else {
        delete post.reaction[reactionType];
        post.reaction.is_reacted = false;
        post.reaction.type = '';

        post.reaction.type = newType;
        post.reaction[newType] = (1).toString();
        post.reaction.is_reacted = true;
        !props.isFromDetail && setPosts(posts);
      }
    };

    const resetReaction = newType => {
      if (post.reaction[newType]) {
        if (parseInt(post.reaction[newType]) <= 1) {
          delete post.reaction[reactionType];
          post.reaction.type = '';
          post.reaction.is_reacted = false;
          post.reaction.count -= 1;
          !props.isFromDetail && setPosts(posts);
        } else {
          // delete post.reaction[reactionType];
          post.reaction.type = '';
          post.reaction[newType] = (
            parseInt(post.reaction[newType], 10) - 1
          ).toString();
          post.reaction.is_reacted = false;
          post.reaction.count -= 1;
          !props.isFromDetail && setPosts(posts);
        }
      }
    };

    if (post.reaction.is_reacted) {
      if (reactionType === properties) {
        if (unReact) {
          resetReaction(properties);
          setSelfReacted('Initial');
          setTypeOfReaction('');
        }
      } else {
        updateReaction(properties);
        setSelfReacted('Re-Reacted');
        setTypeOfReaction(properties);
      }
    } else {
      if (post.reaction[properties]) {
        if (parseInt(post.reaction[properties]) > 0) {
          post.reaction.type = properties;
          post.reaction[properties] = (
            parseInt(post.reaction[properties], 10) + 1
          ).toString();
          post.reaction.is_reacted = true;
          post.reaction.count += 1;
          !props.isFromDetail && setPosts(posts);
          setSelfReacted('Reacted');
          setTypeOfReaction(properties);
        } else {
          post.reaction.type = properties;
          post.reaction[properties] = (1).toString();
          post.reaction.is_reacted = true;
          post.reaction.count += 1;
          !props.isFromDetail && setPosts(posts);
          setSelfReacted('Reacted');
          setTypeOfReaction(properties);
        }
      } else {
        post.reaction.type = properties;
        post.reaction[properties] = (1).toString();
        post.reaction.is_reacted = true;
        post.reaction.count += 1;
        !props.isFromDetail && setPosts(posts);
        setSelfReacted('Reacted');
        setTypeOfReaction(properties);
      }
    }
    setReactionId(properties);
  };

  //react static
  // const handleReact = () => {
  //   if (props.darkMode === 'enable') {
  //     return props.isSelfReacted === 'Initial'
  //       ? IconManager.unlike_dark
  //       : reactedEmoji();
  //   } else {
  //     return props.isSelfReacted === 'Initial'
  //       ? IconManager.unlike_light
  //       : reactedEmoji();
  //   }
  // };

  //  react dynamic
  const handleReact = () => {
    if (props.darkMode === 'enable') {
      return props.isSelfReacted === 'Initial'
        ? IconManager.unlike_dark
        : reactedEmoji();
    } else {
      return props.isSelfReacted === 'Initial'
        ? IconManager.unlike_light
        : reactedEmoji();
    }
  };

  const reactedEmoji = () => {
    if (reactionId == 0) {
      return props.darkMode === 'enable'
        ? IconManager.like_dark
        : IconManager.like_light;
    } else {
      const item = props?.reactionType?.find(item => item.id === reactionId);
      if (item) {
        return item.wowonder_small_icon;
      } else {
        return props.darkMode === 'enable'
          ? IconManager.like_dark
          : IconManager.like_light;
      }
      // return props?.reactionType?.[reactionId - 1].wowonder_small_icon;
      // return reactions[reactionId - 1].icon_small;
    }
  };

  // const reactedEmoji = () => {
  //   if (reactionId == 0) {
  //     return props.darkMode === 'enable'
  //       ? IconManager.like_dark
  //       : IconManager.like_light;
  //   } else {
  //     return reactions[reactionId - 1].icon_small;
  //   }
  // };
  // const reactedEmoji = () => {
  //   if (reactionId == 0) {
  //     return props.darkMode === 'enable'
  //       ? IconManager.like_dark
  //       : IconManager.like_light;
  //   } else {
  //     return props?.reactionType[0].wowonder_icon
  //     // return reactions[reactionId - 1].icon_small;
  //   }
  // };

  return (
    <View style={{justifyContent: 'center', alignItems: 'center', height: 65}}>
      {/* <View style={styles.horizontalline} /> */}
      <View style={styles.cardFooter}>
        {/* {props.isFromShare ? (
          <TouchableOpacity
            onPressIn={() => {}}
            activeOpacity={1}
            onPress={() => {}}
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            delayLongPress={200} // Adjust this value as needed, default is 500ms
            minDurationMs={20} // Adjust this value as needed, default is 200ms
            // onLongPress={!props.isFromShare && handlePress}
            onPressOut={() => {
              // setTimeout(() => {
              //   setReactionPopUpVisible(false);
              // }, 2000);
            }}
            disabled={reactionPopUpVisible}>
            {props.isSelfReacted === 'Initial' ||
            props.isSelfReacted === 'Reacted' ||
            props.isSelfReacted === 'Re-Reacted' ? (
              <View>
                {typeof handleReact() === 'string' &&
                handleReact().endsWith('.svg') ? (
                  <View
                    style={{
                      padding: SPACING.sp9,
                      backgroundColor:
                        props.darkMode == 'enable'
                          ? COLOR.Grey500
                          : COLOR.Blue50,
                      borderRadius: RADIUS.rd15,
                    }}>
                    <SvgUri
                      style={styles.reactionIcon}
                      uri={handleReact()}
                      width={18}
                      height={18}
                    />
                  </View>
                ) : (
                  <Image
                    source={handleReact()}
                    style={{width: 36, height: 36}}
                    resizeMode="contain"
                  />
                )}
              </View>
            ) : null}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPressIn={() => {}}
            onPress={() => {
              if (props.data.reaction['is_reacted']) {
                // setReactionId(0);
                // props.setTypeOfReaction('0');
                // handleEmojiIconsPressLike('un-like');
                handleEmojiIconsPress(reactionId, true);
                handleReaction();
              } else {
                // setReactionId(1);
                // props.setTypeOfReaction('1');
                handleEmojiIconsPress('1', false);
                // handleReaction();
                handleReactionReact();
              }
            }}
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            delayLongPress={200} // Adjust this value as needed, default is 500ms
            minDurationMs={20} // Adjust this value as needed, default is 200ms
            onLongPress={handlePress}
            onPressOut={() => {
              // setTimeout(() => {
              //   setReactionPopUpVisible(false);
              // }, 2000);
            }}
            disabled={reactionPopUpVisible}>
            {props.isSelfReacted === 'Initial' ||
            props.isSelfReacted === 'Reacted' ||
            props.isSelfReacted === 'Re-Reacted' ? (
              <View>
                {typeof handleReact() === 'string' &&
                handleReact().endsWith('.svg') ? (
                  <View
                    style={{
                      padding: SPACING.sp9,
                      backgroundColor:
                        props.darkMode == 'enable'
                          ? COLOR.Grey500
                          : COLOR.Blue50,
                      borderRadius: RADIUS.rd15,
                    }}>
                    <SvgUri
                      style={styles.reactionIcon}
                      uri={handleReact()}
                      width={18}
                      height={18}
                    />
                  </View>
                ) : typeof handleReact() === 'string' &&
                  handleReact().endsWith('.png') ? (
                  <View
                    style={{
                      padding: SPACING.sp9,
                      backgroundColor:
                        props.darkMode == 'enable'
                          ? COLOR.Grey500
                          : COLOR.Blue50,
                      borderRadius: RADIUS.rd15,
                    }}>
                    <Image
                      source={{uri: handleReact()}}
                      style={{width: 18, height: 18}}
                      resizeMode="contain"
                    />
                  </View>
                ) : (
                  <Image
                    source={handleReact()}
                    style={{width: 36, height: 36}}
                    resizeMode="contain"
                  />
                )}
              </View>
            ) : null}
          </TouchableOpacity>
        )} */}
        <TouchableOpacity
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          activeOpacity={!props.isFromShare ? 0.1 : 1}
          onPress={() => {
            !props.isFromShare &&
              navigation.navigate('Comment', {
                postid: props.data.post_id,
                reaction: props.data.reaction.count,
                reactionType: props?.reactionType,
              });
          }}>
          <Image
            source={
              props.darkMode == 'enable'
                ? IconManager.uncomment_dark
                : IconManager.uncomment_light
            }
            style={styles.iconStyle}
            resizeMode="contain"
          />
        </TouchableOpacity>
        {!props.data.shared_info && (
          <TouchableOpacity
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            activeOpacity={!props.isFromShare ? 0.1 : 1}
            onPress={() => {
              !props.isFromShare && setOpenModal(true);
            }}>
            <Image
              source={
                props.darkMode == 'enable'
                  ? IconManager.share_dark
                  : IconManager.share_light
              }
              style={styles.iconStyle}
            />
          </TouchableOpacity>
        )}
      </View>
      <ModalComponent
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
        options={shareOptions}
        postid={props.data.post_id}
        post={props.data}
        reaction={props.reaction}
        groupList={props.groupList}
        pageList={props.pageList}
        message={"You can't share!"}
        posts={props.posts}
        setPosts={props.setPosts}
        index={props.index}
        setOtherReactionPopupStatus={props.setOtherReactionPopupStatus}
        isOtherReactionPopupStatus={props.isOtherReactionPopupStatus}
        selfReactionId={props.selfReactionId}
        userData={props.userData}
        isReactEnable={props.isReactEnable}
        setReactEnable={props.setReactEnable}
        doReaction={props.doReaction}
        reactionType={props.reactionType}
        darkMode={props.darkMode}
      />
      {/* {reactionPopUpVisible && (
        <>
          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              top: -40,
              left: 38,
              zIndex: 1,
              backgroundColor: COLOR.White,
              paddingHorizontal: 6,
              paddingVertical: 6,
              gap: 12,
              borderRadius: 192,
            }}>
            {reactions.map(reaction => (
              <TouchableOpacity
                onPress={() => {
                  setReactionPopUpVisible(
                    reactionPopUpVisible === true ? false : true,
                  );
                }}>
                <TouchableWithoutFeedback
                  onPressIn={() => {
                    handleEmojiIconsPress(reaction.id);
                  }}
                  onPressOut={() => {
                    setReactionPopUpVisible(
                      reactionPopUpVisible === true ? false : true,
                    );
                  }}
                  onPress={() => {
                    handleReaction();
                  }}>
                  <View>
                    <Image
                      source={reaction.icon}
                      style={{ width: 32, height: 32 }}
                      resizeMode="contain"
                    />
                  </View>
                </TouchableWithoutFeedback>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )} */}
      {reactionPopUpVisible && (
        <>
          <View
            style={{
              flexDirection: 'row',
              position: 'absolute',
              top: -40,
              left: 10,
              zIndex: 1,
              backgroundColor: COLOR.White,
              paddingHorizontal: 6,
              paddingVertical: 6,
              gap: 12,
              borderRadius: 192,
            }}>
            {props?.reactionType?.map((reaction, index) => (
              <TouchableOpacity
                onPress={() => {
                  setReactionPopUpVisible(
                    reactionPopUpVisible === true ? false : true,
                  );
                }}>
                {renderIcon(reaction, index)}
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

export default PostFooter;
const styles = StyleSheet.create({
  horizontalline: {
    borderBottomColor: '#767676',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: SPACING.sp8,
    marginHorizontal: SPACING.sp10,
    // backgroundColor: 'blue',
  },
  cardFooter: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: PIXEL.px36,
    marginBottom: SPACING.sp10,
    // backgroundColor: 'blue',
  },
  iconStyle: {
    width: PIXEL.px36,
    height: PIXEL.px36,
  },
  box: {
    width: 48,
    height: 48,
    opacity: 1,
    borderRadius: 24, // 50% of width/height to make it circular
    backgroundColor: COLOR.White, // or any background color
    // Animation fill mode is not directly supported in React Native
  },
  reactionIcon: {
    width: 10,
    height: 10,
  },
});
