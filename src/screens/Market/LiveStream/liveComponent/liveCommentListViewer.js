import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import COLOR from '../../../../constants/COLOR';
import {FontFamily, fontSizes} from '../../../../constants/FONT';
import IconManager from '../../../../assets/IconManager';
import {useSelector} from 'react-redux';
import {retrieveJsonData, storeKeys} from '../../../../helper/AsyncStorage';

const LiveCommentsListViewer = ({data, hideReaction, isViewer}) => {
  const flatListRef = useRef();
  const [expandedCommentId, setExpandedCommentId] = useState(null);
  const [visibleSeeMore, setVisibleSeeMore] = useState(
    Array(data.length).fill(false),
  );
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [newCommentsCount, setNewCommentsCount] = useState(0); // Track new comments
  const [userId, setUserId] = useState('');

  const maxHeightForTwoLines = () => {
    return fontSizes.size14 * 2 * 1.2;
  };

  useEffect(() => {
    const fetchLoginData = async () => {
      const loginData = await retrieveJsonData({
        key: storeKeys.loginCredential,
      });
      const userId = loginData.user_id;
      setUserId(userId);
    };
    fetchLoginData();
  }, []);

  const isAddNewComments = useSelector(
    state => state.NormalLiveSlice.isAddNewComments,
  );

  const renderItem = ({item, index}) => {
    const isExpanded = expandedCommentId === item.id;

    return (
      <TouchableOpacity
        onPress={() => {
          {
            isViewer && hideReaction();
          }
        }}
        activeOpacity={0.9}
        style={{
          width: '100%',
          paddingHorizontal: 16,
          alignItems: 'flex-end',
        }}>
        <View style={{flexDirection: 'row', gap: 4}}>
          <View style={{width: '15%'}}>
            <Image source={{uri: item.avatar}} style={styles.profileImage} />
          </View>
          <View style={styles.commentContainer}>
            <Text style={styles.userName}>
              {item.first_name === ''
                ? item.username
                : `${item.first_name} ${item.last_name}`}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                onLayout={event => {
                  const {height} = event.nativeEvent.layout;
                  setVisibleSeeMore(prev => {
                    const newVisibleSeeMore = [...prev];
                    if (
                      height > maxHeightForTwoLines() &&
                      !newVisibleSeeMore[index]
                    ) {
                      newVisibleSeeMore[index] = true;
                    }
                    return newVisibleSeeMore;
                  });
                }}
                numberOfLines={isExpanded ? undefined : 2}
                style={styles.commentText}>
                {item.comment}
              </Text>
              {!isExpanded && visibleSeeMore[index] && (
                <TouchableOpacity
                  onPress={() => {
                    {
                      isViewer && hideReaction();
                    }
                    setExpandedCommentId(item.id);
                  }}>
                  <Text style={styles.seeMoreText}>see more</Text>
                </TouchableOpacity>
              )}
            </View>
            {isExpanded && (
              <TouchableOpacity
                onPress={() => {
                  {
                    isViewer && hideReaction();
                  }
                  setExpandedCommentId(null);
                }}>
                <Text style={styles.seeLessText}>see less</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleScroll = event => {
    {
      isViewer && hideReaction();
    }
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const currentOffset = layoutMeasurement.height + contentOffset.y;
    const isCloseToBottom = currentOffset >= contentSize.height - 50; // Adjust threshold as needed
    setIsAtBottom(isCloseToBottom);
    if (isCloseToBottom) {
      setNewCommentsCount(0);
    }
  };

  const handleNewMessagesClick = () => {
    flatListRef.current?.scrollToEnd({animated: true});
    setNewCommentsCount(0); // Reset new comments count after clicking
  };

  // Effect to reset new comments count if the user is at the bottom
  useEffect(() => {
    if (!isAtBottom) {
      setNewCommentsCount(prevCount => prevCount + 1); // Increment new comments count if not at bottom
    } else {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({animated: true});
        setNewCommentsCount(0);
      }, 100);
    }
  }, [isAddNewComments]);

  const ItemSeparator = () => <View style={{height: 6}} />;

  return (
    <View style={styles.container}>
      {newCommentsCount > 0 &&
        !isAtBottom && ( // Show new message notification only if not at bottom
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleNewMessagesClick}
            style={styles.newMessageNotification}>
            <Image
              source={IconManager.scroll_to_end}
              style={styles.scrollIcon}
            />
            <Text style={styles.newMessageText}>
              {newCommentsCount > 1 ? '2 more messages' : '1 new message'}
            </Text>
          </TouchableOpacity>
        )}
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={ItemSeparator}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
    </View>
  );
};

const styles = {
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  commentContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    width: '83%',
    padding: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  userName: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size16,
    color: COLOR.Grey800,
  },
  commentText: {
    fontWeight: '500',
    fontSize: fontSizes.size14,
    color: COLOR.Grey500,
    flex: 1,
  },
  seeMoreText: {
    color: COLOR.Grey400,
    bottom: -9,
    fontSize: fontSizes.size13,
  },
  seeLessText: {
    color: COLOR.Grey400,
    marginTop: 4,
    fontSize: fontSizes.size13,
  },
  newMessageNotification: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(49, 49, 49, 0.6)',
    alignItems: 'center',
    position: 'absolute',
    top: -38,
    zIndex: 1,
    flexDirection: 'row',
    gap: 4,
    borderRadius: 30,
  },
  scrollIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  newMessageText: {
    color: COLOR.White100,
    fontSize: fontSizes.size16,
  },
  addButtonContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(49, 49, 49, 0.5)',
    borderRadius: 12,
    zIndex: 1,
  },
  addButtonText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size17,
    color: COLOR.White100,
  },
};

export default LiveCommentsListViewer;
