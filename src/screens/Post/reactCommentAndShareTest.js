import React, {forwardRef} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {SvgUri} from 'react-native-svg';
import IconManager from '../../assets/IconManager';
import {FontFamily, fontSizes} from '../../constants/FONT';
import COLOR from '../../constants/COLOR';
import {defaultEmojiList} from '../../constants/CONSTANT_ARRAY';
import {useNavigation} from '@react-navigation/native';
import SPACING from '../../constants/SPACING';
import {getFileType} from '../../helper/FileTypeCheck';

const ReactCommentShareStatus = forwardRef(({item, darkMode}, ref) => {
  const styles = AppReactionStyle();
  const emojiList = defaultEmojiList;

  const renderEmoji = emoji => {
    return (
      <Image
        style={{width: 16, height: 16, resizeMode: 'contain'}}
        source={emoji}
      />
    );
  };

  const reactionMessage = reactionData => {
    const {type, count} = reactionData;

    const renderReactionMessage = () => {
      if (count === 0 || count === null) {
        return ' 0 Reaction';
      }

      if (reactionData[type]) {
        return ` You & ${count} Others`;
      }

      return ` ${count} Others`;
    };

    return <Text style={styles.status}>{renderReactionMessage()}</Text>;
  };

  const navigation = useNavigation();

  const showReactionList = () => {
    navigation.navigate('ReactionList', {post: item});
  };

  return (
    <View style={styles.container} ref={ref}>
      <TouchableOpacity
        onPress={() => {
          showReactionList();
        }}
        activeOpacity={0.8}
        style={styles.flexOne}>
        {emojiList
          .filter(emoji =>
            Object.keys(item.reaction).includes(emoji.id.toString()),
          )
          .map(emoji => (
            <View key={emoji.id} style={styles.emojiContainer}>
              {renderEmoji(emoji.emoji)}
            </View>
          ))}
        <Text
          style={[
            styles.status,
            darkMode == 'enable'
              ? {color: COLOR.White}
              : {color: COLOR.Grey300},
          ]}>
          {reactionMessage(item.reaction)}
        </Text>
      </TouchableOpacity>
      <View style={styles.flexTwo}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Comment', {
              postid: item.post_id,
              reaction: item.reaction.count,
            });
          }}>
          <Text
            style={[
              styles.status,
              darkMode == 'enable'
                ? {color: COLOR.White}
                : {color: COLOR.Grey300},
            ]}>
            {item.post_comments != 0
              ? item.post_comments == 1
                ? item.post_comments + ' Comment'
                : item.post_comments + ' Comments'
              : item.post_comments + ' Comment'}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Text
            style={[
              styles.status,
              darkMode == 'enable'
                ? {color: COLOR.White}
                : {color: COLOR.Grey300},
            ]}>
            {item.post_share != 0
              ? item.post_share == 1
                ? item.post_share + ' Share'
                : item.post_share + ' Shares'
              : item.post_share + ' Share'}
          </Text>
          {item.postFile && getFileType(item.postFile) === 'video' && (
            <Text
              style={[
                styles.status,
                darkMode == 'enable'
                  ? {color: COLOR.White}
                  : {color: COLOR.Grey300},
              ]}>
              {item.videoViews !== 0
                ? item.videoViews === 1
                  ? `${item.videoViews} View`
                  : `${item.videoViews} Views`
                : `${item.videoViews} View`}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
});

const AppReactionStyle = () => {
  return StyleSheet.create({
    status: {
      fontSize: fontSizes.size13,
      fontFamily: 'Poppins-Regular',
      // paddingLeft: SPACING.sp5,
    },
    container: {
      flexDirection: 'row',
      display: 'flex',
      marginVertical: 8,
      marginHorizontal: 16,
    },
    flexOne: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    flexTwo: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 8,
    },
    emojiContainer: {
      marginLeft: -6,
      alignItems: 'center',
    },
    emojiImage: {
      zIndex: 1,
    },
    reactionText: {
      color: COLOR.Grey500,
      fontSize: fontSizes.size12,
      fontFamily: FontFamily.PoppinSemiBold,
    },
  });
};

export default ReactCommentShareStatus;
