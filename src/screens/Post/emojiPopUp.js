import React, {useRef, useEffect} from 'react';
import {
  Animated,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import IconManager from '../../assets/IconManager';
import {SvgUri} from 'react-native-svg';
import COLOR from '../../constants/COLOR';
import {logJsonData} from '../../helper/LiveStream/logFile';
import {startReaction} from '../../helper/ApiModel';
import {
  updateMyPagePostItemField,
  updatePopularPostItemField,
  updatePostItemField,
  updateSavePostItemField,
  updateSinglePostItemField,
} from '../../stores/slices/PostSlice';
import {defaultEmojiList} from '../../constants/CONSTANT_ARRAY';
import {stringKey} from '../../constants/StringKey';

const EmojiPopup = ({
  showReactions,
  setShowReactions,
  item,
  darkMode,
  index,
  whereFrom,
}) => {
  const emojiPopupOpacity = useRef(new Animated.Value(0)).current;
  const emojiList = defaultEmojiList;
  const styles = EmojiPopupStyle(darkMode);
  const dispatch = useDispatch();

  const emojiAnimations = useRef(
    emojiList.map(() => new Animated.Value(0)),
  ).current;

  const makeReaction = async (emoji, item) => {
    if (item.reaction.is_reacted) {
      if (item.reaction.type === emoji.id) {
        logJsonData('Already Reacted', 'Already Reacted');
        setShowReactions(false);
      } else {
        setShowReactions(false);
        const reaction = {
          [emoji.id]: 1,
          is_reacted: true,
          type: emoji.id,
          count: item.reaction.count,
        };
        Object.keys(item.reaction).forEach(key => {
          if (!['is_reacted', 'type', 'count'].includes(key)) {
            if (emoji.id === key) {
              reaction[key] =
                parseInt(item.reaction[key], 10) + parseInt(reaction[key], 10);
            } else if (item.reaction.type === key) {
              if (parseInt(item.reaction[key]) > 1) {
                reaction[key] = parseInt(item.reaction[key]) - 1;
              }
            } else {
              reaction[key] = item.reaction[key];
            }
          }
        });
        // if (response.api_status === 200) {
        {
          whereFrom === 'post_details'
            ? dispatch(
                updateSinglePostItemField({field: 'reaction', value: reaction}),
              )
            : whereFrom === stringKey.my_page_post
            ? dispatch(
                updateMyPagePostItemField({
                  id: item.post_id,
                  field: 'reaction',
                  value: reaction,
                }),
              )
            : whereFrom === stringKey.popular_post
            ? dispatch(
                updatePopularPostItemField({
                  id: item.post_id,
                  field: 'reaction',
                  value: reaction,
                }),
              )
            : whereFrom === stringKey.save_post
            ? dispatch(
                updateSavePostItemField({
                  id: item.post_id,
                  field: 'reaction',
                  value: reaction,
                }),
              )
            : dispatch(
                updatePostItemField({
                  id: item.post_id,
                  field: 'reaction',
                  value: reaction,
                }),
              );
        }
        // dispatch(
        //   updateFeedItemField({
        //     id: item.post_id,
        //     field: 'reaction',
        //     value: reaction,
        //   }),
        // );
        logJsonData('Reaction Updated', reaction);
        // setShowReactions(false);
        // }
        const response = await startReaction(item.post_id, emoji.id);
      }
    } else {
      setShowReactions(false);
      const reaction = {
        [emoji.id]: 1,
        is_reacted: true,
        type: emoji.id,
        count: item.reaction.count + 1,
      };
      Object.keys(item.reaction).forEach(key => {
        if (!['is_reacted', 'type', 'count'].includes(key)) {
          if (emoji.id === key) {
            reaction[key] =
              parseInt(item.reaction[key], 10) + parseInt(reaction[key], 10);
          } else {
            reaction[key] = item.reaction[key];
          }
        }
      });
      // if (response.api_status === 200) {
      {
        whereFrom === 'post_details'
          ? dispatch(
              updateSinglePostItemField({field: 'reaction', value: reaction}),
            )
          : whereFrom === stringKey.my_page_post
          ? dispatch(
              updateMyPagePostItemField({
                id: item.post_id,
                field: 'reaction',
                value: reaction,
              }),
            )
          : whereFrom === stringKey.popular_post
          ? dispatch(
              updatePopularPostItemField({
                id: item.post_id,
                field: 'reaction',
                value: reaction,
              }),
            )
          : whereFrom === stringKey.save_post
          ? dispatch(
              updateSavePostItemField({
                id: item.post_id,
                field: 'reaction',
                value: reaction,
              }),
            )
          : dispatch(
              updatePostItemField({
                id: item.post_id,
                field: 'reaction',
                value: reaction,
              }),
            );
      }

      // dispatch(
      //   updateFeedItemField({
      //     id: item.post_id,
      //     field: 'reaction',
      //     value: reaction,
      //   }),
      // );
      logJsonData('Reaction Updated', reaction);
      // setShowReactions(false);
      // }
      const response = await startReaction(item.post_id, emoji.id);
    }
  };

  useEffect(() => {
    if (showReactions) {
      Animated.timing(emojiPopupOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();

      emojiList.forEach((_, index) => {
        Animated.timing(emojiAnimations[index], {
          toValue: 1,
          duration: 300,
          delay: index * 100,
          useNativeDriver: true,
        }).start();
      });
    } else {
      Animated.timing(emojiPopupOpacity, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }).start(() => {
        setShowReactions(false);
      });
    }
  }, [showReactions]);

  const renderEmoji = (emoji, index) => {
    return <Image source={emoji.emoji} style={styles.emojiItemImage} />;
    // return <SvgUri xml={emoji.emoji} width={50} height={50} />;
    // const {wowonder_icon} = emoji;
    // const fileExtension = wowonder_icon.split('.').pop()?.toLowerCase();

    // if (fileExtension === 'svg') {
    //   return (
    //     <SvgUri
    //       uri={wowonder_icon}
    //       width={customImageWidthHeight.image_20}
    //       height={customImageWidthHeight.image_20}
    //     />
    //   );
    // } else if (['png', 'jpg', 'jpeg'].includes(fileExtension)) {
    //   return (
    //     <Image source={{uri: wowonder_icon}} style={styles.emojiItemImage} />
    //   );
    // } else {
    //   return null;
    // }
  };

  return (
    showReactions && (
      <Animated.View
        style={[
          styles.emojiPopup,
          {
            opacity: emojiPopupOpacity,
            left: Platform.OS === 'ios' ? -100 : -100,
          },
        ]}>
        <ScrollView
          style={{marginHorizontal: 6}}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {emojiList.map((emoji, index) => {
            const animatedStyle = {
              transform: [
                {
                  translateY: emojiAnimations[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            };

            return (
              <Animated.View style={animatedStyle} key={index}>
                <TouchableOpacity
                  style={styles.emojiItem}
                  onPress={() => makeReaction(emoji, item)}>
                  {renderEmoji(emoji, index)}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </ScrollView>
      </Animated.View>
    )
  );
};

const EmojiPopupStyle = darkMode => {
  return StyleSheet.create({
    emojiPopup: {
      position: 'absolute',
      backgroundColor:
        darkMode === 'enable'
          ? 'rgba(0, 0, 0, 0.2)'
          : 'rgba(255, 255, 255, 0.9)',
      justifyContent: 'center',
      paddingVertical: 6,
      alignItems: 'center',
      bottom: Platform.OS === 'ios' ? 50 : 50,
      borderRadius: 24,
      elevation: 8,
      overflow: 'hidden',
      zIndex: 1001,
      shadowColor: '#333',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    emojiItem: {
      marginHorizontal: 5,
      padding: 8,
      backgroundColor:
        darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.Blue50,
      borderRadius: 15,
    },
    emojiItemImage: {
      width: 18,
      height: 18,
    },
  });
};

export default EmojiPopup;
