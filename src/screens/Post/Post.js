import React, {useState, useEffect, useCallback, memo, useRef} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Alert,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  Modal,
  TouchableHighlight,
  Vibration,
  Image,
  Easing,
  Platform,
} from 'react-native';
import {
  PostLike,
  getAdsData,
  getJoinedGroupList,
  getPageList,
  getPostsData,
  getReactionTypeList,
  startReaction,
} from '../../helper/ApiModel';
import PostBody from '../../components/Post/PostBody';
import PostHeader from '../../components/Post/PostHeader';
import PostShimmer from '../../components/Post/PostShimmer';
import _ from 'lodash';
import {
  addNewPostList,
  setFetchGroupList,
  setFetchNewFeedData,
  setFetchPageList,
  setIsVideoPlay,
  setPostList,
  updatePostItemField,
} from '../../stores/slices/PostSlice';
import {useDispatch, useSelector} from 'react-redux';
import PostText from '../../components/Post/PostText';
import PostReactionAndFooter from './PostReactionAndFooter';
import RADIUS from '../../constants/RADIUS';
import COLOR from '../../constants/COLOR';
import PIXEL from '../../constants/PIXEL';
import SPACING from '../../constants/SPACING';
import AdsComponent from '../../components/AdsComponent';
import ImageGrid from './MarketPost/image_grid';
import {FontFamily, fontSizes} from '../../constants/FONT';
import MonetizationPost from '../../components/Post/MonetizationPost';
import EmojiPopup from './emojiPopUp';
import PostReaction from '../../components/Post/PostReaction';
import IconManager from '../../assets/IconManager';
import ReactCommentShareStatus from './reactCommentAndShareTest';
import {logJsonData} from '../../helper/LiveStream/logFile';
import {defaultEmojiList} from '../../constants/CONSTANT_ARRAY';
import CreatePost from './CreatePost';
import PostingStatusBar from '../../components/Post/PostStatusBar';
import {useScrollToTop} from '@react-navigation/native';

const Post = props => {
  const posts = useSelector(state => state.PostSlice.posts);
  const [originalPosts, setOriginalPosts] = useState([]); // Original posts without ads
  const [refreshing, setRefreshing] = useState(false);
  const loadingPosting = useSelector(
    state => state.AddPostSlice.loadingPosting,
  );
  const successPosting = useSelector(
    state => state.AddPostSlice.successPosting,
  );
  const errorPosting = useSelector(state => state.AddPostSlice.errorPosting);

  const [page, setPage] = useState(1);
  const [afterPostId, setAfterPostId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selfReaction, setSelfReaction] = useState('');
  const [selfReactionId, setSelfReactionId] = useState('');
  const [groupList, setGroupList] = useState([]);
  const [pageList, setPageList] = useState([]);
  const fetchNFData = useSelector(state => state.PostSlice.fetchNFData);
  const fetchGroupList = useSelector(state => state.PostSlice.fetchGroupList);
  const fetchPageList = useSelector(state => state.PostSlice.fetchPageList);
  const [isReactEnable, setReactEnable] = useState(false);
  const [isOtherReactionPopupStatus, setOtherReactionPopupStatus] =
    useState(false);
  const [reactionType, setReactionType] = useState([]);
  const dispatch = useDispatch();
  const [insertedAds, setInsertedAds] = useState([]);
  const [adsData, setAdsData] = useState([]);
  const insertedAdsPositions = {};
  const [limit, setLimit] = useState(20);
  const [loadingMore, setLoadingMore] = useState(false);
  const scrollRef = useRef(null);
  useScrollToTop(scrollRef);

  const fetchData = useCallback(
    async (postId = 0) => {
      setLoadingMore(postId !== 0);
      try {
        setIsLoading(true);
        const data = await getPostsData(
          props.postType,
          'photos',
          postId,
          props.userId,
          page === 1 ? 20 : 10,
        );
        if (data.api_status === 200) {
          let newPosts = data.data;
          let originalPosts = [...posts];
          if (postId !== 0) {
            newPosts = [
              ...posts,
              ...newPosts.filter(post => !posts.some(p => p.id === post.id)),
            ];
          }

          if (postId === 0) {
            // const {mergedData, positions} = mergeAdsWithPosts(
            //   newPosts,
            //   adsData,
            //   insertedAdsPositions,
            // );

            // if (Object.keys(positions).length === 0) {
            //   console.log('Positions is empty: {}');
            //   dispatch(setPostList([]));
            //   dispatch(addNewPostList(data.data));
            // } else {
            //   console.log('Positions:', positions);
            //   dispatch(setPostList(mergedData));
            // }
            dispatch(setPostList(data.data));
            // dispatch(addNewPostList(data.data));
            setLoadingMore(false);
          } else {
            // const {mergedData, positions} = mergeAdsWithPosts(
            //   newPosts,
            //   adsData,
            //   insertedAdsPositions,
            // );

            // if (Object.keys(positions).length === 0) {
            //   console.log('Positions is empty: {}');
            //   dispatch(addNewPostList(data.data));
            // } else {
            //   console.log('Positions:', positions);
            //   dispatch(setPostList(mergedData));
            // }
            dispatch(addNewPostList(data.data));
            setLoadingMore(false);
          }
        }
      } catch (error) {
        console.error(error);
        setLoadingMore(false);
      } finally {
        setIsLoading(false);
        setLoadingMore(false);
      }
    },
    [adsData, dispatch, limit, posts],
  );

  const mergeAdsWithPosts = (posts, ads, insertedAdsPositions) => {
    let mergedData = [...posts];
    let existingAdPositions = Object.keys(insertedAdsPositions).map(Number);

    ads.forEach((ad, adIndex) => {
      const interval = parseInt(ad.interval, 10);
      let insertionPoint = interval - 1;
      while (
        existingAdPositions.includes(insertionPoint) &&
        insertionPoint < mergedData.length
      ) {
        insertionPoint++;
      }

      if (insertionPoint < mergedData.length) {
        if (mergedData[insertionPoint].type !== 'ad') {
          mergedData.splice(insertionPoint, 0, {type: 'ad', ...ad});
          insertedAdsPositions[insertionPoint] = ad.id;
          existingAdPositions.push(insertionPoint);
        }
      }
    });

    return {mergedData, positions: insertedAdsPositions};
  };

  useEffect(() => {
    fetchJoinedGroup();
    fetchMyPage();
    fetchReactionType();
    fetchAds();
  }, []);

  useEffect(() => {
    if (fetchGroupList) {
      fetchJoinedGroup();
    }
    if (fetchPageList) {
      fetchMyPage();
    }
  }, [fetchGroupList, fetchPageList]);

  const fetchJoinedGroup = () => {
    getJoinedGroupList('my_groups').then(data => {
      if (data.api_status === 200) {
        setGroupList(data.data);
      }
    });
  };

  const fetchMyPage = () => {
    getPageList('my_pages').then(data => {
      if (data.api_status === 200) {
        setPageList(data.data);
      }
    });
  };
  const fetchReactionType = () => {
    getReactionTypeList().then(data => {
      if (data.api_status === 200) {
        const updatedReactions = data.data.map((reaction, index) => ({
          ...reaction,
          reaction_id: String(index + 1),
        }));
        setReactionType(updatedReactions);
      }
    });
  };

  const fetchAds = async () => {
    try {
      const data = await getAdsData();
      if (data.api_status === 200) {
        setAdsData(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const reaction = async props => {
    const reactionType = props.doReaction ? props.type : '0';
    try {
      const data = await PostLike(props.postid, 'reaction', reactionType);
      if (data.api_status === 200) {
      } else {
      }
    } catch (error) {
      // Handle error
    }
  };

  const loadMorePosts = () => {
    {
      loadingMore ? null : setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    fetchData(posts[posts.length - 1]?.id);
  }, [page]);

  // useEffect(() => {
  //   if (fetchNFData) {
  //     fetchData();
  //     dispatch(setFetchNewFeedData(false));
  //   }
  // }, [fetchNFData]);

  // useEffect(() => {
  //   if (successPosting) {
  //     fetchData(0);
  //   }
  // }, [successPosting]);

  // const renderFooter = () => {
  //   if (!isLoading) return null;
  //   return page === 1 ? <PostShimmer /> : <ActivityIndicator size="large" />;
  // };

  useEffect(() => {
    console.log('RE RENDER');
  }, []);

  const renderItemTest = useCallback(({item, index}) => {
    return (
      <Text
        style={{
          paddingVertical: 128,
          backgroundColor: 'pink',
          fontSize: 23,
          fontWeight: 'bold',
        }}>
        {index}
      </Text>
    );
  }, []);

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

  const renderItem = useCallback(({item, index}) => {
    return (
      <PostItem
        item={item}
        darkMode={props.darkMode}
        userData={props.userData}
        isReactEnable={isReactEnable}
        setReactEnable={setReactEnable}
        reaction={reaction}
        posts={posts}
        index={index}
        groupList={groupList}
        pageList={pageList}
        setOtherReactionPopupStatus={setOtherReactionPopupStatus}
        isOtherReactionPopupStatus={isOtherReactionPopupStatus}
        reactionType={reactionType}
      />
    );
  }, []);

  const renderFooter = () => {
    return loadingMore ? (
      <ActivityIndicator
        size="small"
        color="#0000ff"
        style={styles.loadingMoreIndicator}
      />
    ) : null;
  };

  useEffect(() => {
    console.log('currentPlayingIndex UPDATED:', currentPlayingIndex);
  }, [currentPlayingIndex]);

  const onViewableItemsChanged = ({viewableItems}) => {
    if (viewableItems && viewableItems.length > 0) {
      const newPlayingIndex = viewableItems[0].index;
      if (isScrollUp) {
        toggleAnimatedView(true);
        setScrollUp(false);
      }
      dispatch(setIsVideoPlay(newPlayingIndex));
      setCurrentPlayingIndex(newPlayingIndex);
    }
    // const visibleItem = viewableItems.find(item => item.isViewable);
    // if (visibleItem && visibleItem.index !== currentPlayingIndex) {
    //   if (isScrollUp) {
    //     // toggleAnimatedView(true);
    //     // setScrollUp(false);
    //     dispatch(setIsVideoPlay(visibleItem.index));
    //     setCurrentPlayingIndex(visibleItem.index);
    //     setTestIndex(visibleItem.index);
    //   }
    //   setCurrentPlayingIndex(visibleItem.index);
    // } else if (!visibleItem && currentPlayingIndex !== null) {
    //   dispatch(setIsVideoPlay(null));
    //   setCurrentPlayingIndex(null);
    //   setTestIndex(null);
    // }
  };
  const previousScrollY = useRef(0);

  const handleScroll = event => {
    const currentScrollY = event.nativeEvent.contentOffset.y;

    // Check if the scroll has passed 200 points
    if (Math.abs(currentScrollY - previousScrollY.current) > 300) {
      // Compare current scroll position with previous one
      if (currentScrollY > previousScrollY.current) {
        // User is scrolling down
        console.log('Scrolling down');
        setScrollUp(false);
        toggleAnimatedView(false);
      } else if (currentScrollY < previousScrollY.current) {
        // User is scrolling up
        console.log('Scrolling up');
        setScrollUp(true);
        toggleAnimatedView(true);
      }

      // Update previous scroll position after detecting a scroll beyond 200
      previousScrollY.current = currentScrollY;
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    fetchData(0);
    setTimeout(() => {
      setRefreshing(false);
    }, 3000); // Simulating a network request
  }, []);

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <FlatList
          data={posts}
          ref={scrollRef}
          keyExtractor={(item, index) => `${item.post_id}-${index}`}
          renderItem={renderItem}
          ListHeaderComponent={() => {
            return (
              <View>
                <CreatePost
                  userData={props.userData}
                  darkMode={props.darkMode}
                />
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
                    <View
                      style={{
                        width: '100%',
                        height: 10,
                        backgroundColor:
                          props.darkMode === 'enable'
                            ? COLOR.DarkThemLight
                            : COLOR.Grey50,
                      }}
                    />
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
                <View
                  style={{
                    width: '100%',
                    height: 10,
                    backgroundColor:
                      props.darkMode === 'enable'
                        ? COLOR.DarkTheme
                        : COLOR.Grey50,
                  }}
                />
              </View>
            );
          }}
          onEndReachedThreshold={0.1}
          scrollEventThrottle={1}
          onScroll={handleScroll}
          initialNumToRender={20}
          ListFooterComponent={
            refreshing ? (
              <ActivityIndicator />
            ) : (
              <ActivityIndicator size={'small'} />
            )
          }
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig} // Add this property to FlatList
          maxToRenderPerBatch={page === 1 ? 10 : 5}
          refreshing={refreshing}
          onRefresh={onRefresh}
          windowSize={5}
          maintainVisibleContentPosition={{minIndexForVisible: 0}}
          onEndReached={loadMorePosts}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          ListEmptyComponent={() => <PostShimmer />}
        />
      </View>
    </View>
  );
};

const PostItem = memo(
  ({
    item,
    darkMode,
    userData,
    isReactEnable,
    setReactEnable,
    reaction,
    posts,
    index,
    groupList,
    pageList,
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
    const dispatch = useDispatch();

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
    //for reaction kh fixing end
    // Memoize renderPostBody to prevent unnecessary re-renders
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
        return <PostBody data={postData} darkMode={darkMode} index={index} />;
      },
      [darkMode],
    );

    // Render ad component if the item type is 'ad'
    if (item.type === 'ad') {
      return (
        <View>
          <AdsComponent ad={item} />
          <View
            style={
              darkMode === 'enable' ? styles.DarkModegapStyle : styles.gapStyle
            }
          />
        </View>
      );
    }

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
          updatePostItemField({
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
                parseInt(item.reaction[key], 10) + parseInt(reaction[key], 10);
            } else {
              reaction[key] = item.reaction[key];
            }
          }
        });
        // if (response.api_status === 200) {
        dispatch(
          updatePostItemField({
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

    return (
      <View
        style={
          darkMode === 'enable'
            ? styles.darkModepostContainer
            : styles.postContainer
        }>
        {/* Header for the main post */}
        {/* <View
          style={{
            height: 65,
            width: '100%',
          }}>
          <PostHeader
            data={item}
            sharedText={item?.shared_info}
            darkMode={darkMode}
        
          />
        </View> */}
        {/* <Text>{index}</Text> */}
        <PostHeader
          data={item}
          sharedText={item?.shared_info}
          darkMode={darkMode}
        />

        {/* Post content */}
        <View style={{}}>
          {item.shared_info ? (
            <View>
              {!item.is_monetized_post || item?.can_not_see_monetized === 0 ? (
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

              <View
                style={{
                  height: 65,
                  width: '100%',
                }}>
                <PostHeader
                  data={item.shared_info}
                  isShared={true}
                  darkMode={darkMode}
                />
              </View>

              {renderPostBody(item.shared_info)}
            </View>
          ) : (
            renderPostBody(item)
          )}
        </View>

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
              // Platform.OS === 'ios' ? null : Vibration.vibrate(50);
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
          <View style={{flex: item.shared_info ? 2 : 2.5}}>
            <PostReactionAndFooter
              item={item}
              userData={userData}
              isReactEnable={isReactEnable}
              setReactEnable={setReactEnable}
              darkMode={darkMode}
              reaction={reaction}
              posts={posts}
              index={index}
              groupList={groupList}
              pageList={pageList}
              setOtherReactionPopupStatus={setOtherReactionPopupStatus}
              isOtherReactionPopupStatus={isOtherReactionPopupStatus}
              reactionType={reactionType}
            />
          </View>
        </View>

        <View
          style={
            darkMode === 'enable' ? styles.DarkModegapStyle : styles.gapStyle
          }
        />

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
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  postContainer: {
    // marginTop: SPACING.sp15,
    marginBottom: RADIUS.rd4,
    backgroundColor: COLOR.White,
    // paddingTop : 15,
    elevation: 0,
  },
  darkModepostContainer: {
    // marginTop: RADIUS.rd6,
    marginBottom: RADIUS.rd4,
    backgroundColor: COLOR.DarkThemLight,
    elevation: 0,
  },
  gapStyle: {
    width: '100%',
    height: PIXEL.px10,
    backgroundColor: COLOR.Grey50,
    // marginBottom: SPACING.sp15,
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
  monetizedPostContainer: {
    backgroundColor: COLOR.MonetizedBackground, // Define appropriate color
    paddingHorizontal: SPACING.sp20,
    borderRadius: RADIUS.rd8,
    marginVertical: SPACING.sp10,
  },
  darkModeMonetizedPostContainer: {
    backgroundColor: COLOR.DarkMonetizedBackground,
    padding: SPACING.sp15,
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
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingMoreIndicator: {
    paddingVertical: 20,
  },
});

export default Post;
