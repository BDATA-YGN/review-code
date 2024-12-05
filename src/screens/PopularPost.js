import React, {useState, useEffect, useCallback, useRef, memo} from 'react';
import {getPopularPostsData, startReaction} from '../helper/ApiModel';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Pressable,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Text,
  Modal,
  Image,
  PanResponder,
  TouchableOpacity,
  TouchableHighlight,
  Animated,
  Vibration,
  Easing,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import _ from 'lodash';
import {
  retrieveJsonData,
  retrieveStringData,
  storeKeys,
} from '../helper/AsyncStorage';
import {setFetchDarkMode} from '../stores/slices/DarkModeSlice';
import ActionAppBar from '../commonComponent/ActionAppBar';
import IconManager from '../assets/IconManager';
import {useNavigation} from '@react-navigation/native';
import PostHeader from '../components/Post/PostHeader';
import PostBody from '../components/Post/PostBody';
import PostReactionAndFooter from './Post/PostReactionAndFooter';
import COLOR from '../constants/COLOR';
import RADIUS from '../constants/RADIUS';
import PIXEL from '../constants/PIXEL';
import SPACING from '../constants/SPACING';
import PostShimmer from '../components/Post/PostShimmer';
import PostText from '../components/Post/PostText';
import ListShimmer from './GroupProfile/ListShimmer';
import {
  addNewPopularPostList,
  setFetchNewFeedData,
  setIsMyPopularPostVideoPlay,
  setPopularPostList,
  updateMyPagePostItemField,
  updatePopularPostItemField,
} from '../stores/slices/PostSlice';
import {
  PostLike,
  getJoinedGroupList,
  getPageList,
  getReactionTypeList,
} from '../helper/ApiModel';
import {stringKey} from '../constants/StringKey';
import ReactCommentShareStatus from './Post/reactCommentAndShareTest';
import {logJsonData} from '../helper/LiveStream/logFile';
import {defaultEmojiList} from '../constants/CONSTANT_ARRAY';
import EmojiPopup from './Post/emojiPopUp';
import {FontFamily, fontSizes} from '../constants/FONT';
import ImageGrid from './Post/MarketPost/image_grid';

const PopularPost = userId => {
  const [userInfoData, setUserInfoData] = useState({});
  const posts = useSelector(state => state.PostSlice.popularPost);
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const [darkMode, setDarkMode] = useState(null);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  // const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [groupList, setGroupList] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pageList, setPageList] = useState([]);
  const [page, setPage] = useState(1);
  const [afterPostId, setAfterPostId] = useState(null);
  const [isReactEnable, setReactEnable] = useState(false);
  const fetchGroupList = useSelector(state => state.PostSlice.fetchGroupList);
  const fetchPageList = useSelector(state => state.PostSlice.fetchPageList);
  const fetchNFData = useSelector(state => state.PostSlice.fetchNFData);
  const [isOtherReactionPopupStatus, setOtherReactionPopupStatus] =
    useState(false);
  const [reactionType, setReactionType] = useState([]);

  useEffect(() => {
    getUserInfo();
    getDarkModeTheme();
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

  // useEffect(() => {
  //   console.log('currentPlayingIndex UPDATED:', currentPlayingIndex);
  // }, [currentPlayingIndex]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    // fetchData(0);
    setTimeout(() => {
      dispatch(setIsMyPopularPostVideoPlay(null));
      setRefreshing(false);
    }, 3000); // Simulating a network request
  }, []);

  const onViewableItemsChanged = ({viewableItems}) => {
    if (viewableItems && viewableItems.length > 0) {
      const newPlayingIndex = viewableItems[0].index;
      if (isScrollUp) {
        toggleAnimatedView(true);
        setScrollUp(false);
      }
      dispatch(setIsMyPopularPostVideoPlay(newPlayingIndex));
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

  const getUserInfo = async () => {
    const loginData = await retrieveJsonData({key: storeKeys.userInfoData});
    setUserInfoData(loginData);
  };

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

  const fetchPopularPosts = useCallback(
    async (postId = 0) => {
      logJsonData('======================>', postId);
      setLoadingMore(postId !== 0);
      try {
        setIsLoading(true);

        const data = await getPopularPostsData(
          'photos',
          postId,
          userId,
          page === 1 ? 20 : 15,
        );
        if (data.api_status === 200) {
          if (postId === 0) {
            dispatch(setPopularPostList(data.data));
            // dispatch(setPopularPostList(data.data));
          } else {
            dispatch(addNewPopularPostList(data.data));
          }
        }
      } catch (error) {
        setLoadingMore(false);
        // Handle error: Show error message or retry option
        setIsLoading(false);
      } finally {
        setIsLoading(false);
        setLoadingMore(false);
      }
    },
    [dispatch, posts],
  );

  // const fetchPopularPosts = async (postId = 0) => {
  //   try {
  //     setIsLoading(true);

  //     const data = await getPopularPostsData(
  //       'photos',
  //       'videos',
  //       postId,
  //       userId,
  //     );
  //     if (data.api_status === 200) {
  //       if (postId === 0) {
  //         // setPosts(data.data);
  //         dispatch(setPopularPostList(data.data));
  //       } else {
  //         // setPosts(prevPosts => [
  //         //   ...prevPosts,
  //         //   ...data.data.filter(post => !prevPosts.some(p => p.id === post.id)),
  //         // ]);
  //         dispatch(addNewPopularPostList(data.data));
  //       }
  //       setAfterPostId(data.data[data.data.length - 1]?.id);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setIsLoading(false);
  //     setLoading(false);
  //   }
  // };
  // const handleRemovePost = postId => {
  //   setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  // };
  // useEffect(() => {
  //   fetchPopularPosts(afterPostId);
  // }, []);

  useEffect(() => {
    fetchPopularPosts(posts[posts.length - 1]?.id);
  }, [page]);

  // useEffect(() => {
  //   if (fetchNFData) {
  //     fetchPopularPosts();
  //     dispatch(setFetchNewFeedData(false));
  //   }
  // }, [fetchNFData]);

  // useEffect(() => {
  //   fetchJoinedGroup();
  //   fetchMyPage();
  //   fetchReactionType();
  // }, []);

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

  const loadMorePosts = () => {
    if (!isLoading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const renderItem = useCallback(({item, index}) => {
    return (
      <PostItem
        item={item}
        darkMode={darkMode}
        isReactEnable={isReactEnable}
        setReactEnable={setReactEnable}
        // reaction={reaction}
        userInfoData={userInfoData}
        index={index}
        setOtherReactionPopupStatus={setOtherReactionPopupStatus}
        isOtherReactionPopupStatus={isOtherReactionPopupStatus}
        reactionType={reactionType}
        dispatch={dispatch}
      />
    );
  }, []);
  return (
    <SafeAreaView
      style={darkMode == 'enable' ? styles.dSafeAreaView : styles.safeAreaView}>
      <StatusBar
        backgroundColor={
          darkMode == 'enable' ? COLOR.DarkThemLight : COLOR.White100
        }
        barStyle={darkMode == 'enable' ? 'light-content' : 'dark-content'}
      />
      <ActionAppBar
        appBarText="Popular Posts"
        source={
          darkMode === 'enable' ? IconManager.back_dark : IconManager.back_light
        }
        backpress={() => {
          navigation.goBack();
        }}
        darkMode={darkMode}
      />
      <View style={styles.container}>
        <FlatList
          data={posts}
          // ref={scrollRef}
          keyExtractor={(item, index) => `${item.post_id}-${index}`}
          renderItem={renderItem}
          ListHeaderComponent={() => {}}
          onEndReachedThreshold={0.1}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          initialNumToRender={7}
          ListFooterComponent={refreshing ? <ActivityIndicator /> : null}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig} // Add this property to FlatList
          maxToRenderPerBatch={3}
          refreshing={refreshing}
          onRefresh={onRefresh}
          windowSize={7}
          maintainVisibleContentPosition={{minIndexForVisible: 0}}
          onEndReached={loadMorePosts}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          // ListEmptyComponent={() =>
          //   isLoading ? (
          //     <PostShimmer />
          //   ) : (
          //     <View
          //       style={{
          //         width: '100%',
          //         justifyContent: 'center',
          //         alignItems: 'center',
          //       }}>
          //       <Text
          //         style={{
          //           color:
          //             darkMode === 'enable' ? COLOR.White100 : COLOR.Grey300,
          //           fontSize: 16,
          //           marginTop: 16,
          //           fontFamily: FontFamily.PoppinRegular,
          //         }}>
          //         Empty Post
          //       </Text>
          //     </View>
          //   )
          // }
        />
      </View>
    </SafeAreaView>
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
    userInfoData,
    pageList,
    setOtherReactionPopupStatus,
    isOtherReactionPopupStatus,
    reactionType,
    handleRemovePost,
    dispatch,
  }) => {
    // if (item.type === 'ad') {
    //   return <AdsComponent ad={item} />;
    // }

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
      console.log('asdkfjalskdfjlkasjflk');
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
          updatePopularPostItemField({
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
          updatePopularPostItemField({
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
    const renderPostBody = useCallback(
      item => {
        return (
          <PostBody
            data={item}
            darkMode={darkMode}
            index={index}
            whereFrom={stringKey.popular_post}
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
        <PostHeader
          data={item}
          sharedText={item?.shared_info}
          darkMode={darkMode}
        />
        {item?.shared_info && (
          <View style={{marginTop: SPACING.sp15}}>
            <PostText
              postText={item.Orginaltext}
              mentions_users={item?.mentions_users}
              darkMode={darkMode}
            />
            <View style={styles.horizontalLine} />
            <PostHeader
              data={item?.shared_info}
              isShared={true}
              darkMode={darkMode}
            />
          </View>
        )}
        {renderPostBody(item)}
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
              likeUnlike(item);
            }}
            underlayColor={COLOR.Blue50}
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
              // reaction={reaction}
              posts={posts}
              index={index}
              setOtherReactionPopupStatus={setOtherReactionPopupStatus}
              isOtherReactionPopupStatus={isOtherReactionPopupStatus}
              reactionType={reactionType}
              userInfoData={userInfoData}
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
                item={item}
                postIndex={index}
                whereFrom={stringKey.popular_post}
              />
            </View>
          </TouchableOpacity>
        </Modal>
        {/* <PostReactionAndFooter
          item={item}
          userData={userData}
          isReactEnable={isReactEnable}
          setReactEnable={setReactEnable}
          darkMode={darkMode}
          reaction={reaction}
          posts={posts}
          setPosts={setPosts}
          index={index}
          groupList={groupList}
          pageList={pageList}
          setOtherReactionPopupStatus={setOtherReactionPopupStatus}
          isOtherReactionPopupStatus={isOtherReactionPopupStatus}
          reactionType={reactionType}
        /> */}
        <View
          style={
            darkMode == 'enable' ? styles.DarkModegapStyle : styles.gapStyle
          }
        />
      </View>
    );
  },
);
export default PopularPost;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: COLOR.White100,
  },
  dSafeAreaView: {
    flex: 1,
    backgroundColor: COLOR.DarkThemLight,
  },
  container: {
    paddingBottom: SPACING.sp60,
  },
  postContainer: {
    marginTop: RADIUS.rd6,
    marginBottom: RADIUS.rd4,
    padddingTop: SPACING.sp12,
    elevation: 0,
  },
  darkModepostContainer: {
    marginTop: RADIUS.rd6,
    marginBottom: RADIUS.rd4,
    backgroundColor: COLOR.DarkThemLight,
    elevation: 0,
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
  emptyComponent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
