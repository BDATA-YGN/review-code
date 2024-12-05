import {
  Alert,
  Animated,
  Image,
  Modal,
  PanResponder,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import _ from 'lodash';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  PostLike,
  getReactionTypeList,
  getUserInfoData,
  requestPost,
  startReaction,
} from '../../helper/ApiModel';
import RADIUS from '../../constants/RADIUS';
import COLOR from '../../constants/COLOR';
import PIXEL from '../../constants/PIXEL';
import SPACING from '../../constants/SPACING';
import PostFooter from '../../components/Post/PostFooter';
import PostReaction from '../../components/Post/PostReaction';
import PostHeader from '../../components/Post/PostHeader';
import PostText from '../../components/Post/PostText';
import PostBody from '../../components/Post/PostBody';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import IconManager from '../../assets/IconManager';
import {useNavigation} from '@react-navigation/native';
import PageGroupReactionAndFooter from './PageGroupReactionAndFooter';
import {retrieveJsonData, storeKeys} from '../../helper/AsyncStorage';
import PostReactionAndFooter from './PostReactionAndFooter';
import ReactCommentShareStatus from './reactCommentAndShareTest';
import {useDispatch, useSelector} from 'react-redux';
import {logJsonData} from '../../helper/LiveStream/logFile';
import {
  setSinglePostItem,
  updatePostItemField,
  updateSinglePostItemField,
} from '../../stores/slices/PostSlice';
import {defaultEmojiList} from '../../constants/CONSTANT_ARRAY';
import EmojiPopup from './emojiPopUp';
import { FontFamily, fontSizes } from '../../constants/FONT';
import ImageGrid from './MarketPost/image_grid';

const PostDetail = props => {
  const [loading, setLoading] = useState(false);
  const postData = useSelector(state => state.PostSlice.singlePostItem);
  const [selfReaction, setSelfReaction] = useState();
  const [selfReactionId, setSelfReactionId] = useState('');
  const [userData, setUserData] = useState({});
  const [reactionType, setReactionType] = useState([]);
  const [isReactEnable, setReactEnable] = useState(false);
  const [userInfoData, setUserInfoData] = useState({});
  const [isOtherReactionPopupStatus, setOtherReactionPopupStatus] =
    useState(false);

  const fetchData = async () => {
    const userDataResponse = await getUserInfoData();
    setUserData(userDataResponse.user_data);
    await fetchPostDetail(props.route.params.postId);
  };

  const navigation = useNavigation();
  useEffect(() => {
    fetchData();
  }, [props.route.params.postId]);

  useEffect(() => {
    getUserInfo();
    fetchReactionType();
    // Alert.alert('Hlelo ', `This is ${postData.length}`)
    // getDarkModeTheme();
  }, []);

  const getUserInfo = async () => {
    const loginData = await retrieveJsonData({key: storeKeys.userInfoData});
    setUserInfoData(loginData);
  };

  const fetchReactionType = () => {
    getReactionTypeList().then(data => {
      if (data.api_status === 200) {
        setReactionType(data.data);
      }
    });
  };
  const fetchPostDetail = async postId => {
    try {
      setLoading(true);
      const data = await requestPost(postId);
      if (data.api_status === 200) {
        console.log('post detail', data.post_data);
        dispatch(setSinglePostItem(data.post_data));
        setLoading(false);
      } else {
        // Alert.alert(data.errors.error_text);
        setLoading(false);
      }
    } catch (error) {
      // console.error('Error fetching data:', error);
      throw error;
      // Handle error: Show error message or retry option
    } finally {
      setLoading(false);
    }
  };
  const reaction = async props => {
    const reactionType = props.doReaction ? props.type : '0';
    try {
      const data = await PostLike(props.postid, 'reaction', reactionType);
      if (data.api_status === 200) {
        setSelfReaction(data.code);
        setSelfReactionId(props.postid);
      } else {
      }
    } catch (error) {
    } finally {
    }
  };
  const isEmptyObject = obj => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  };

  const [isDragging, setIsDragging] = useState(false);
  const [modalPosition, setModalPosition] = useState({x: 0, y: 0});
  const [showReactions, setShowReactions] = useState(false);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [modalTranslateY] = useState(new Animated.Value(300)); // Start off screen
  const emojiList = defaultEmojiList;
  const dispatch = useDispatch();
  const buttonRef = useRef(null); // Ref to capture button position
  const [buttonLayout, setButtonLayout] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  const onLayoutCapture = event => {
    const {x, y, width, height} = event.nativeEvent.layout;
    setButtonLayout({x, y, width, height});
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const {dx, dy} = gestureState;
        return Math.abs(dx) > 5 || Math.abs(dy) > 5; // Threshold for starting pan gesture
      },
      onPanResponderGrant: () => {
        setIsDragging(true);
        setShowReactions(false); // Hide modal on drag
      },
      onPanResponderMove: (evt, gestureState) => {
        const {moveX, moveY} = gestureState;
        console.log(`Dragging at position X: ${moveX}, Y: ${moveY}`);
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
      },
    }),
  ).current;

  const handleLongPress = useCallback(
    _.debounce(index => {
      if (buttonRef.current) {
        buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
          const centerX = pageX + width / 2;
          const centerY = pageY + height / 2;
          setModalPosition({x: centerX, y: centerY});
          setShowReactions(true);
          console.log(
            `Long pressed at center X: ${centerX}, center Y: ${centerY}`,
          );
        });
      }
      setIsDragging(true); // Start dragging
    }, 100),
    [],
  );

  // Function to update a specific field in singlePostItem
  // const updateSinglePostItemField = (field, value) => {
  //   setPostData(prevState => ({
  //     ...prevState,
  //     [field]: value,
  //   }));
  // };

  const likeUnlike = async item => {
    if (item.reaction.is_reacted) {
      const reaction = {
        ...(parseInt(item.reaction[emojiList[0].id], 10) > 1 && {
          [emojiList[0].id]: 1,
        }),
        is_reacted: false,
        type: null,
        count: item.reaction.count - 1,
      };
      Object.keys(item.reaction).forEach(key => {
        if (!['is_reacted', 'type', 'count'].includes(key)) {
          if (item.reaction.type === key) {
            if (parseInt(item.reaction[key], 10) > 1) {
              reaction[key] = parseInt(item.reaction[key], 10) - 1;
            }
          } else {
            reaction[key] = item.reaction[key];
          }
        }
      });
      // if (response.api_status === 200) {
      // dispatch(
      //   updatePostItemField({
      //     id: item.post_id,
      //     field: 'reaction',
      //     value: reaction,
      //   }),
      // );
      dispatch(updateSinglePostItemField({field: 'reaction', value: reaction}));

      logJsonData('Unlike', reaction);
      // }
      const response = await startReaction(item.post_id, emojiList[0].id);
    } else {
      const reaction = {
        [emojiList[0].id]: 1,
        is_reacted: true,
        type: emojiList[0].id,
        count: item.reaction.count + 1,
      };
      Object.keys(item.reaction).forEach(key => {
        if (!['is_reacted', 'type', 'count'].includes(key)) {
          if (emojiList[0].id === key) {
            reaction[key] =
              parseInt(item.reaction[key], 10) + parseInt(reaction[key], 10);
          } else {
            reaction[key] = item.reaction[key];
          }
        }
      });
      // if (response.api_status === 200) {
      // dispatch(
      //   updatePostItemField({
      //     id: item.post_id,
      //     field: 'reaction',
      //     value: reaction,
      //   }),
      // );
      dispatch(updateSinglePostItemField({field: 'reaction', value: reaction}));

      logJsonData('Like', reaction);
      // }
      const response = await startReaction(item.post_id, emojiList[0].id);
    }
  };

  const findEmojiById = id => {
    const emojiObj = emojiList.find(emoji => emoji.id === id);
    return emojiObj ? emojiObj.emoji : undefined;
  };

  const handleReact = useCallback(() => {
    return postData?.reaction?.is_reacted
      ? reactedEmoji(postData)
      : IconManager.like_line_light;
  }, [postData]);

  const reactedEmoji = useCallback(
    item => {
      if (item.reaction.type === 0) return IconManager.like_line_light;

      const emoji = findEmojiById(item.reaction.type);
      return emoji || IconManager.like_line_light;
    },
    [emojiList],
  );

  const renderEmoji = emoji => {
    return (
      <View
        style={{
          backgroundColor: COLOR.Blue50,
          padding: 10,
          borderRadius: 13,
        }}>
        <Image
          source={emoji}
          style={{width: 16, height: 16, resizeMode: 'contain'}}
        />
      </View>
    );
  };

  return (
    <SafeAreaView
      style={
        props.route.params.darkMode == 'enable'
          ? styles.darkModepostContainer
          : styles.postContainer
      }>
      <ActionAppBar
        source={IconManager.back_light}
        darkMode={props.route.params.darkMode}
        backpress={() => {
          navigation.goBack();
        }}
      />
      {loading ? (
        <View />
      ) : (
        <ScrollView
          style={{marginVertical: 10}}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          <PostHeader
            data={postData}
            sharedText={postData?.shared_info}
            darkMode={props.route.params.darkMode}
            isShared
          />

          <View style={{marginTop: SPACING.sp15}}>
            <PostText
              postText={postData.Orginaltext}
              mentions_users={postData?.mentions_users}
              darkMode={props.route.params.darkMode}
            />
            {postData?.shared_info && (
              <View>
                <View style={styles.horizontalLine} />
                <PostHeader
                  data={postData?.shared_info}
                  isShared={true}
                  darkMode={props.route.params.darkMode}
                />
              </View>
            )}
          </View>

          {postData && (
            <PostBody data={postData} darkMode={props.route.params.darkMode} />
          )}

{postData.product && (
          <View>
            <Text
              style={{
                fontSize: fontSizes.size14,
                paddingHorizontal: 12,
                paddingVertical: 8,
                color: props.route.params.darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                fontFamily: FontFamily.PoppinRegular,
              }}>
              {postData?.product?.name}
            </Text>
          
            <ImageGrid data={postData.product} darkMode={props.route.params.darkMode} />
          </View>
        )}
          {/* {postData.reaction ? (
          <PostReaction
            data={postData}
            //   selfReaction={item.reaction}
            //   selfReactionId={selfReactionId}
            // username={posts.username}

            username={userData.first_name + ' ' + userData.last_name}
            darkMode={props.route.params.darkMode}
          />
        ) : null}

        {!isEmptyObject(postData) && (
          <PostFooter
            data={postData}
            reaction={reaction}
            doReaction={postData?.doReaction}
            darkMode={props.route.params?.darkMode}
          />
        )} */}

          {postData.reaction ? (
            <ReactCommentShareStatus
              item={postData}
              darkMode={props.route.params.darkMode}
            />
          ) : null}

          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              display: 'flex',
              height: 57,
              borderTopWidth: 1,
              borderTopColor: '#767676',
            }}
            ref={buttonRef}
            onLayout={onLayoutCapture}
            {...panResponder.panHandlers}>
            <TouchableHighlight
              onPressIn={() => {
                // Vibration.vibrate(50);
              }}
              onLongPress={handleLongPress}
              onPress={() => {
                likeUnlike(postData);
              }}
              underlayColor={COLOR.Blue50}
              delayLongPress={100}
              style={{
                padding: 8,
                // borderRadius: 16,
                flex: postData.shared_info ? 1.5 : 1,
                // borderWidth: 1,
                // backgroundColor: 'pink',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {renderEmoji(handleReact())}
            </TouchableHighlight>
            <View style={{flex: postData.shared_info ? 2 : 2.5}}>
              <PostReactionAndFooter
                item={postData}
                isFromDetail={true}
                selfReaction={postData.reaction}
                selfReactionId={selfReactionId}
                userData={props.userData}
                isReactEnable={isReactEnable}
                setReactEnable={setReactEnable}
                darkMode={props.darkMode}
                reaction={reaction}
                // posts={posts}
                // setPosts={setPosts}
                // index={index}
                setOtherReactionPopupStatus={setOtherReactionPopupStatus}
                isOtherReactionPopupStatus={isOtherReactionPopupStatus}
                userInfoData={userInfoData}
                postType={props.postType}
                reactionType={reactionType}
              />
            </View>
          </View>

          <Modal
            visible={showReactions}
            transparent={true}
            animationType="none"
            onRequestClose={() => setShowReactions(false)}>
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPressIn={() => setShowReactions(false)}>
              <View
                style={{
                  position: 'absolute',
                  top: modalPosition.y || 50,
                  left: modalPosition.x - 50 || 50,
                  pointerEvents: 'auto',
                  padding: 10,
                }}>
                <EmojiPopup
                  showReactions={showReactions}
                  setShowReactions={setShowReactions}
                  item={postData}
                  postIndex={0}
                  whereFrom="post_details"
                />
              </View>
            </TouchableOpacity>
          </Modal>

          {/* <PostReactionAndFooter
            item={postData}
            isFromDetail={true}
            selfReaction={postData.reaction}
            selfReactionId={selfReactionId}
            userData={props.userData}
            isReactEnable={isReactEnable}
            setReactEnable={setReactEnable}
            darkMode={props.darkMode}
            reaction={reaction}
            // posts={posts}
            // setPosts={setPosts}
            // index={index}
            setOtherReactionPopupStatus={setOtherReactionPopupStatus}
            isOtherReactionPopupStatus={isOtherReactionPopupStatus}
            userInfoData={userInfoData}
            postType={props.postType}
            reactionType={reactionType}
          /> */}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default PostDetail;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkModepostContainer: {
    marginTop: RADIUS.rd6,
    marginBottom: RADIUS.rd4,
    backgroundColor: COLOR.DarkThemLight,
    elevation: 0, // Or use shadow properties, not both
    flex: 1,
  },
  postContainer: {
    flex: 1,
    // marginTop: RADIUS.rd6,
    marginBottom: RADIUS.rd4,
    backgroundColor: COLOR.White,
    elevation: 0, // Or use shadow properties, not both
  },
  gapStyle: {
    width: '100%',
    height: PIXEL.px10,
    backgroundColor: COLOR.White,
    marginBottom: SPACING.sp15,
  },
  DarkModegapStyle: {
    width: '100%',
    height: PIXEL.px10,
    backgroundColor: COLOR.DarkTheme,
    marginBottom: SPACING.sp15,
  },
  horizontalLine: {
    borderBottomColor: COLOR.Grey300,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginHorizontal: SPACING.sp10,
    marginBottom: SPACING.sp20,
    marginTop: SPACING.sp10,
  },
});
