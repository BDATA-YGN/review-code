import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  SafeAreaView,
  FlatList,
  Text,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  addNewShortVideoPostList,
  setActivePageIndex,
  setScrollPosition,
  setShortVideo,
} from '../../stores/slices/PostSlice';
import ShortTemplate from './ShortTemplate';
import COLOR from '../../constants/COLOR';
import {
  getVideoPostList,
  getReactionTypeList,
  getPageList,
  getJoinedGroupList,
} from '../../helper/ApiModel';
import {FontFamily} from '../../constants/FONT';

const ShortVideoNew = ({darkMode}) => {
  const dispatch = useDispatch();
  const shortVideoList = useSelector(state => state.PostSlice.shortVideo);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // Refreshing state
  const [safeAreaHeight, setSafeAreaHeight] = useState(0);
  const [groupList, setGroupList] = useState([]);
  const [pageList, setPageList] = useState([]);
  const [reactionType, setReactionType] = useState([]);
  const [focusedItem, setFocusedItem] = useState(null);
  const scrollPosition = useSelector(state => state.PostSlice.scrollPosition);

  const flatListRef = useRef(null); // Create a ref for FlatList

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50, // Trigger when 50% of the item is visible
  };

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      const focusedIndex = viewableItems[0].index; // Get the index of the first visible item
      console.log('Focused Index:', focusedIndex); // Log the index
      setFocusedItem(viewableItems[0].item); // Update the focused item
      dispatch(setActivePageIndex(focusedIndex));
    }
  }).current;

  const fetchReactionType = useCallback(() => {
    getReactionTypeList().then(data => {
      if (data.api_status === 200) {
        const updatedReactions = data.data.map((reaction, index) => ({
          ...reaction,
          reaction_id: String(index + 1),
        }));
        setReactionType(updatedReactions);
      }
    });
  }, []);

  const fetchVideoPostList = useCallback(
    async (afterPostId = 0) => {
      setLoadingMore(true);
      setIsLoading(true);
      try {
        const data = await getVideoPostList(afterPostId);
        if (data.api_status === 200) {
          if (afterPostId !== 0) {
            dispatch(addNewShortVideoPostList(data.data));
          } else {
            dispatch(setShortVideo(data.data));
          }
          setLoadingMore(false);
          setIsLoading(false);
        } else {
          setLoadingMore(false);
          setIsLoading(false);
        }
      } catch (error) {
        setLoadingMore(false);
        setIsLoading(false);
      }
    },
    [dispatch],
  );

  const fetchJoinedGroup = useCallback(() => {
    getJoinedGroupList('my_groups').then(data => {
      if (data.api_status === 200) {
        setGroupList(data.data);
      }
    });
  }, []);

  const fetchMyPage = useCallback(() => {
    getPageList('my_pages').then(data => {
      if (data.api_status === 200) {
        setPageList(data.data);
      }
    });
  }, []);

  useEffect(() => {
    fetchReactionType();
    fetchVideoPostList(0);
    fetchJoinedGroup();
    fetchMyPage();
  }, [fetchReactionType, fetchVideoPostList, fetchJoinedGroup, fetchMyPage]);

  // useEffect(() => {
  //   // When the component re-renders or when switching between tabs, restore scroll position
  //   if (flatListRef.current) {
  //     flatListRef.current.scrollToOffset({
  //       offset: scrollPosition,
  //       animated: false,
  //     });
  //   }
  // }, [shortVideoList]); // Run when shortVideoList changes

  const loadMore = useCallback(async () => {
    if (!loadingMore) {
      const lastPostId = shortVideoList[shortVideoList.length - 1]?.post_id;
      if (lastPostId) {
        await fetchVideoPostList(lastPostId);
      }
    }
  }, [loadingMore, shortVideoList, fetchVideoPostList]);

  const onScroll = useCallback(event => {
    // Save the scroll position when the user scrolls
    const offsetY = event.nativeEvent.contentOffset.y;
    dispatch(setScrollPosition(offsetY));
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchVideoPostList(0); // Reload the video list
    setRefreshing(false);
  }, [fetchVideoPostList]);

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <View
          style={{
            height: safeAreaHeight,
            width: '100%',
            backgroundColor: 'red',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          key={`${item.post_id}-${index}`}>
          <ShortTemplate
            index={index}
            item={item}
            videoUri={item.postFile !== '' ? item.postFile : item.postYoutube}
            videoType={item.postFile !== '' ? 'video' : 'youtube'}
            groupList={groupList}
            pageList={pageList}
            posts={shortVideoList}
            darkMode={darkMode}
            reactionType={reactionType}
            safeAreaHeight={safeAreaHeight}
            isFocused={focusedItem?.post_id === item.post_id} // Pass focus state
          />
          {loadingMore && (
            <View style={[styles.container]}>
              <ActivityIndicator
                animating={true}
                size="large"
                color={'white'}
              />
            </View>
          )}
        </View>
      );
    },
    [
      safeAreaHeight,
      groupList,
      pageList,
      shortVideoList,
      focusedItem,
      loadingMore,
      darkMode,
      reactionType,
    ],
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        borderColor: 'red',
        backgroundColor:
          darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.DarkThemLight, // Correct background color
      }}
      onLayout={event => {
        const {height} = event.nativeEvent.layout;
        setSafeAreaHeight(height);
      }}>
      <StatusBar hidden={true} />
      {shortVideoList.length <= 0 && isLoading ? (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text
            style={{
              color: 'white',
              fontSize: 15,
              fontFamily: FontFamily.PoppinSemiBold,
            }}>
            Loading ...
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef} // Attach ref to FlatList
          data={shortVideoList}
          renderItem={renderItem} // Memoized renderItem
          keyExtractor={(item, index) => `${item.post_id}-${index}`}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          pagingEnabled={true}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onScroll={onScroll} // Capture scroll events
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default ShortVideoNew;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});
