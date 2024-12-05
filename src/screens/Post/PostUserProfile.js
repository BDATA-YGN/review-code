import React, {useState, useEffect, useRef, useCallback, memo} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
  Pressable,
  Animated,
  Easing,
  PanResponder,
  Modal,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Vibration,
} from 'react-native';
import {
  PostLike,
  getPostsData,
  getPostsDataOfUserProfile,
  getReactionTypeList,
  startReaction,
} from '../../helper/ApiModel';
import _ from 'lodash';
import PostBody from '../../components/Post/PostBody';
import PostHeader from '../../components/Post/PostHeader';
import PIXEL from '../../constants/PIXEL';
import COLOR from '../../constants/COLOR';
import SPACING from '../../constants/SPACING';
import PostShimmer from '../../components/Post/PostShimmer';
import {
  addNewMyPagePostList,
  setFetchNewFeedData,
  setFetchPGData,
  setIsMyPageVideoPlay,
  setIsVideoPlay,
  setMyPagePostList,
  updateMyPagePostItemField,
} from '../../stores/slices/PostSlice';
import {useDispatch, useSelector} from 'react-redux';
import PostText from '../../components/Post/PostText';
import RADIUS from '../../constants/RADIUS';
import PostFooter from '../../components/Post/PostFooter';
import PostReaction from '../../components/Post/PostReaction';
import {RefreshControl} from 'react-native-gesture-handler';
import {useIsFocused, useScrollToTop} from '@react-navigation/native';
import {all} from 'axios';
import {
  retrieveJsonData,
  retrieveStringData,
  storeKeys,
} from '../../helper/AsyncStorage';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import PostImage from '../../components/Post/PostImage';
import {stringKey} from '../../constants/StringKey';
import {
  setSuccessPosting,
  setErrorPosting,
} from '../../stores/slices/AddPostSlice';
import PostingStatusBar from '../../components/Post/PostStatusBar';
import PageGroupReactionAndFooter from './PageGroupReactionAndFooter';
import MonetizationPost from '../../components/Post/MonetizationPost';
import {FontFamily} from '../../constants/FONT';
import {fontSizes} from '../../constants/FONT';
import ImageGrid from './MarketPost/image_grid';
import IconManager from '../../assets/IconManager';
import {logJsonData} from '../../helper/LiveStream/logFile';
import {defaultEmojiList} from '../../constants/CONSTANT_ARRAY';
import ReactCommentShareStatus from './reactCommentAndShareTest';
import EmojiPopup from './emojiPopUp';
import PostReactionAndFooter from './PostReactionAndFooter';
import {setMyPageList} from '../../stores/slices/PageSlice';
import CreatePost from './CreatePost';

const PostUserProfile = props => {
  const posts = useSelector(state => state.PostSlice.myPagePost);
  const [page, setPage] = useState(1);
  const [afterPostId, setAfterPostId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selfReaction, setSelfReaction] = useState();
  const [selfReactionId, setSelfReactionId] = useState('');
  // const [darkMode, setDarkMode] = useState(null);
  const [userInfoData, setUserInfoData] = useState({});
  const [loadingMore, setLoadingMore] = useState(false);
  const scrollRef = useRef(null);
  useScrollToTop(scrollRef);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPGData = useSelector(state => state.PostSlice.fetchPGData);
  const loadingPosting = useSelector(
    state => state.AddPostSlice.loadingPosting,
  );
  const successPosting = useSelector(
    state => state.AddPostSlice.successPosting,
  );
  const errorPosting = useSelector(state => state.AddPostSlice.errorPosting);
  // const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const dispatch = useDispatch();
  const [reactionType, setReactionType] = useState([]);
  const [isReactEnable, setReactEnable] = useState(false);
  const [isOtherReactionPopupStatus, setOtherReactionPopupStatus] =
    useState(false);

  useEffect(() => {
    dispatch(setMyPagePostList([]));
    getUserInfo();
    fetchReactionType();
    // getDarkModeTheme();
  }, []);

  const fetchReactionType = () => {
    getReactionTypeList().then(data => {
      if (data.api_status === 200) {
        setReactionType(data.data);
      }
    });
  };

  const getUserInfo = async () => {
    const loginData = await retrieveJsonData({key: storeKeys.userInfoData});
    setUserInfoData(loginData);
  };

  const fetchData = useCallback(
    async (postId = 0) => {
      console.log('LogJSONDATA', postId);
      setLoadingMore(postId !== 0);
      try {
        setIsLoading(true);

        const data = await getPostsDataOfUserProfile(
          props.postType,
          'photos',
          postId,
          props.userId,
          page === 1 ? 15 : 10,
        );
        if (data.api_status === 200) {
          if (postId === 0) {
            dispatch(setMyPagePostList(data.data));
            // setLoadingMore(false);
            // setIsLoading(false);
            // dispatch(setMyPagePostList(data.data));
          } else {
            dispatch(addNewMyPagePostList(data.data));
            // setIsLoading(false);
            // setLoadingMore(false);
          }
        }
      } catch (error) {
        // Handle error: Show error message or retry option
        setIsLoading(false);
        setLoadingMore(false);
      } finally {
        setIsLoading(false);
        setLoadingMore(false);
      }
    },
    [dispatch],
  );

  const loadMorePosts = () => {
    {
      loadingMore ? null : setPage(prevPage => prevPage + 1);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    fetchData(0);
    setTimeout(() => {
      dispatch(setIsMyPageVideoPlay(null));
      setRefreshing(false);
    }, 3000); // Simulating a network request
  }, []);

  useEffect(() => {
    {
      loadingMore ? null : fetchData(posts[posts.length - 1]?.id);
    }
  }, [page]);

  useEffect(() => {
    if (fetchPGData) {
      fetchData(0);
      dispatch(setFetchPGData(false));
    }
  }, [fetchPGData]);

  const [isScrollUp, setScrollUp] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(null);
  // Create an Animated.Value for controlling visibility
  const animatedViewOpacity = useRef(new Animated.Value(0)).current;

  const toggleAnimatedView = show => {
    Animated.timing(animatedViewOpacity, {
      toValue: show ? 1 : 0,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {});
  };

  useEffect(() => {
    toggleAnimatedView(true);
  }, []);

  // useEffect(() => {
  //   console.log('currentPlayingIndex UPDATED:', currentPlayingIndex);
  // }, [currentPlayingIndex]);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 100, // Adjust this value as needed
    waitForInteraction: true,
  };

  // useEffect(() => {
  //   console.log('currentPlayingIndex UPDATED:', currentPlayingIndex);
  // }, [currentPlayingIndex]);

  const onViewableItemsChanged = ({viewableItems}) => {
    if (viewableItems && viewableItems.length > 0) {
      const newPlayingIndex = viewableItems[0].index;
      if (isScrollUp) {
        toggleAnimatedView(true);
        setScrollUp(false);
      }
      dispatch(setIsMyPageVideoPlay(newPlayingIndex));
      setCurrentPlayingIndex(newPlayingIndex);
    }
  };
  const previousScrollY = useRef(0);

  const handleScroll = event => {
    const currentScrollY = event.nativeEvent.contentOffset.y;

    // Check if the scroll has passed 200 points
    if (Math.abs(currentScrollY - previousScrollY.current) > 300) {
      // Compare current scroll position with previous one
      if (currentScrollY > previousScrollY.current) {
        // User is scrolling down
        // console.log('Scrolling down');
        setScrollUp(false);
        toggleAnimatedView(false);
      } else if (currentScrollY < previousScrollY.current) {
        // User is scrolling up
        // console.log('Scrolling up');
        setScrollUp(true);
        toggleAnimatedView(true);
      }

      // Update previous scroll position after detecting a scroll beyond 200
      previousScrollY.current = currentScrollY;
    }
  };

  const renderItem = useCallback(({item, index}) => {
    return (
      <MyPageItem
        item={item}
        darkMode={props.darkMode}
        userData={props.userData}
        isReactEnable={isReactEnable}
        setReactEnable={setReactEnable}
        // reaction={reaction}
        posts={posts}
        index={index}
        setOtherReactionPopupStatus={setOtherReactionPopupStatus}
        isOtherReactionPopupStatus={isOtherReactionPopupStatus}
        reactionType={reactionType}
      />
    );
  }, []);

  const MyPageItem = memo(
    ({
      item,
      darkMode,
      userData,
      isReactEnable,
      setReactEnable,
      // reaction,
      posts,
      index,
      setOtherReactionPopupStatus,
      isOtherReactionPopupStatus,
      reactionType,
    }) => {
      //for reaction kh fixing start
      const [modalPosition, setModalPosition] = useState({x: 0, y: 0});
      const buttonRef = useRef(null); // Ref to capture button position
      const [buttonLayout, setButtonLayout] = useState({
        width: 0,
        height: 0,
        x: 0,
        y: 0,
      });
      const [isDragging, setIsDragging] = useState(false);
      const [showReactions, setShowReactions] = useState(false);
      const [showMoreModal, setShowMoreModal] = useState(false);
      const [modalTranslateY] = useState(new Animated.Value(300)); // Start off screen
      const emojiList = defaultEmojiList;

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
          dispatch(
            updateMyPagePostItemField({
              id: item.post_id,
              field: 'reaction',
              value: reaction,
            }),
          );

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
                  parseInt(item.reaction[key], 10) +
                  parseInt(reaction[key], 10);
              } else {
                reaction[key] = item.reaction[key];
              }
            }
          });
          // if (response.api_status === 200) {
          dispatch(
            updateMyPagePostItemField({
              id: item.post_id,
              field: 'reaction',
              value: reaction,
            }),
          );

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
        return item?.reaction?.is_reacted
          ? reactedEmoji(item)
          : darkMode === 'enable'
          ? IconManager.like_line_white
          : IconManager.like_line_light;
      }, [item]);

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
              backgroundColor:
                darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.Blue50,
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

      const renderPostBody = useCallback(
        postData => {
          if (
            postData.is_monetized_post &&
            postData.can_not_see_monetized !== 0
          ) {
            return (
              <View
                style={
                  darkMode === 'enable'
                    ? styles.darkModeMonetizedPostContainer
                    : styles.monetizedPostContainer
                }>
                <MonetizationPost data={postData} darkMode={darkMode} />
              </View>
            );
          }
          return (
            <PostBody
              data={postData}
              darkMode={darkMode}
              index={index}
              whereFrom={stringKey.my_page_post}
            />
          );
        },
        [darkMode],
      );

      return (
        <View
          style={
            darkMode == 'enable'
              ? styles.darkModepostContainer
              : styles.postContainer
          }>
          {/* Original Post Header */}

          <PostHeader
            data={item}
            sharedText={item?.shared_info}
            darkMode={darkMode}
            postType={props.postType}
            pageInfo={props.userData}
          />

          <View
            style={{
              backgroundColor:
                darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
            }}>
            {item.shared_info ? (
              <View>
                {/* Render original post text or monetization post */}
                {!item.is_monetized_post ||
                item?.can_not_see_monetized === 0 ? (
                  <View style={{marginTop: SPACING.sp15}}>
                    <PostText
                      postText={item.Orginaltext}
                      mentions_users={item?.mentions_users}
                      darkMode={darkMode}
                    />
                    <View style={styles.horizontalLine} />
                  </View>
                ) : (
                  <View
                    style={
                      darkMode === 'enable'
                        ? styles.darkModeMonetizedPostContainer
                        : styles.monetizedPostContainer
                    }>
                    <MonetizationPost data={item} darkMode={darkMode} />
                  </View>
                )}

                {/* Header for the shared post */}
                <PostHeader
                  data={item.shared_info}
                  isShared={true}
                  darkMode={darkMode}
                />

                {/* Render post body for the shared post */}
                {renderPostBody(item.shared_info)}
              </View>
            ) : (
              // Render post body for the main post if there's no shared post
              renderPostBody(item)
            )}
          </View>
          {/* Footer and Reactions */}

          {/* Market Product */}
          {item.product && (
            <View>
              <Text
                style={{
                  fontSize: fontSizes.size14,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                  fontFamily: FontFamily.PoppinRegular,
                }}>
                {item?.product?.name}
              </Text>
              <ImageGrid data={item.product} darkMode={darkMode} />
            </View>
          )}

          {item.reaction ? (
            <ReactCommentShareStatus item={item} darkMode={darkMode} />
          ) : null}

          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              display: 'flex',
              height: 57,
              borderTopWidth: StyleSheet.hairlineWidth,
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
                likeUnlike(item);
              }}
              underlayColor={
                darkMode === 'enable' ? COLOR.DarkTheme : COLOR.Blue50
              }
              delayLongPress={100}
              style={{
                padding: 8,
                // borderRadius: 16,
                flex: item.shared_info ? 1.5 : 1,
                // borderWidth: 1,
                // backgroundColor: 'pink',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {renderEmoji(handleReact())}
            </TouchableHighlight>
            <View
              style={{
                flex: item.shared_info ? 2 : 2.5,
                backgroundColor:
                  darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
              }}>
              <PostReactionAndFooter
                item={item}
                userData={userData}
                isReactEnable={isReactEnable}
                setReactEnable={setReactEnable}
                darkMode={darkMode}
                // reaction={reaction}
                posts={posts}
                index={index}
                setOtherReactionPopupStatus={setOtherReactionPopupStatus}
                isOtherReactionPopupStatus={isOtherReactionPopupStatus}
                reactionType={reactionType}
                userInfoData={userInfoData}
              />
              {/* <PageGroupReactionAndFooter
                item={item}
                selfReaction={item.reaction}
                selfReactionId={selfReactionId}
                userData={props.userData}
                isReactEnable={isReactEnable}
                setReactEnable={setReactEnable}
                darkMode={props.darkMode}
                reaction={reaction}
                posts={posts}
                index={index}
                setOtherReactionPopupStatus={setOtherReactionPopupStatus}
                isOtherReactionPopupStatus={isOtherReactionPopupStatus}
                userInfoData={userInfoData}
                postType={props.postType}
                reactionType={reactionType}
              /> */}
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
                  item={item}
                  darkMode={darkMode}
                  postIndex={index}
                  whereFrom={stringKey.my_page_post}
                />
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Gap between posts */}
          {/* <View
            style={{
              backgroundColor:
                darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.Grey50,
              width: '100%',
              height: 10,
            }}
          /> */}
        </View>
      );
    },
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            props.darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White100,
        },
      ]}>
      <View
        style={{
          flex: 1,
          backgroundColor:
            props.darkMode === 'enable' ? COLOR.DarkTheme : COLOR.Grey10,
        }}>
        <FlatList
          data={posts}
          // ref={scrollRef}
          keyExtractor={(item, index) => `${item.post_id}-${index}`}
          renderItem={renderItem}
          ListHeaderComponent={() => {
            return (
              <View style={{gap: 12, marginBottom: 4}}>
                {/* {props.canPost === stringKey.canPost && (
                  <View>
                    <CreatePost
                      userData={props.userData}
                      postType={props.postType}
                      darkMode={props.darkMode}
                    />
                    <Text>{props.postType}</Text>
                  </View>
                )} */}
                {loadingPosting || successPosting || errorPosting ? (
                  <View
                    style={{
                      zIndex: 1,
                      width: '100%',
                      paddingVertical: 10,
                      backgroundColor:
                        props.darkMode === 'enable'
                          ? COLOR.DarkFadeLight
                          : COLOR.White100,
                    }}>
                    <PostingStatusBar
                      postingStatus={
                        loadingPosting
                          ? 'loading'
                          : successPosting
                          ? 'success'
                          : errorPosting
                          ? 'error'
                          : ''
                      }
                      darkMode={props.darkMode}
                    />
                  </View>
                ) : null}
              </View>
            );
          }}
          onEndReachedThreshold={0.5}
          // style={{backgroundColor: }}
          scrollEventThrottle={1}
          onScroll={handleScroll}
          initialNumToRender={20}
          ListFooterComponent={refreshing ? <ActivityIndicator /> : null}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig} // Add this property to FlatList
          maxToRenderPerBatch={page === 1 ? 15 : 5}
          refreshing={refreshing}
          onRefresh={onRefresh}
          windowSize={2}
          maintainVisibleContentPosition={{minIndexForVisible: 0}}
          onEndReached={loadMorePosts}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          ListEmptyComponent={() => {
            {
              <View style={{height: 50, borderWidth: 1}}>
                <Text style={{color: 'red'}}>EMPTY</Text>
              </View>;
            }
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
  },
  darkModeContainer: {
    flex: 1,
    backgroundColor: COLOR.DarkThemLight,
  },
  postContainer: {
    marginTop: RADIUS.rd6,
    marginBottom: RADIUS.rd4,
    backgroundColor: COLOR.White,
    elevation: 0, // Or use shadow properties, not both
    // Shadow properties for iOS:
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.2,
    // shadowRadius: RADIUS.rd2,
  },
  darkModepostContainer: {
    marginTop: RADIUS.rd6,
    marginBottom: RADIUS.rd4,
    backgroundColor: COLOR.DarkThemLight,
    elevation: 0, // Or use shadow properties, not both
  },
  gapStyle: {
    width: '100%',
    height: PIXEL.px10,
    backgroundColor: COLOR.Grey50,
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
  gapStyle: {
    width: '100%',
    height: PIXEL.px10,
    backgroundColor: COLOR.Grey50,
    marginVertical: SPACING.sp15,
  },
  darkModegapStyle: {
    width: '100%',
    height: PIXEL.px10,
    backgroundColor: COLOR.DarkTheme,
    marginVertical: SPACING.sp15,
  },
  monetizedPostContainer: {
    backgroundColor: COLOR.MonetizedBackground, // Define appropriate color
    paddingHorizontal: SPACING.sp20,
    borderRadius: RADIUS.rd8,
    marginVertical: SPACING.sp10,
  },
  darkModeMonetizedPostContainer: {
    backgroundColor: COLOR.DarkMonetizedBackground,
    padding: SPACING.sp20,
    borderRadius: RADIUS.rd8,
    marginVertical: SPACING.sp10,
  },
  monetizedText: {
    color: COLOR.MonetizedText, // Define appropriate color
    fontSize: fontSizes.size16,
    fontFamily: FontFamily.PoppinBold,
  },
  darkModeMonetizedText: {
    color: COLOR.DarkMonetizedText,
    fontSize: fontSizes.size16,
    fontFamily: FontFamily.PoppinBold,
  },
});

export default PostUserProfile;
