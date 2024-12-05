import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, Image, TouchableOpacity, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import SPACING from '../../../constants/SPACING';
import IconManager from '../../../assets/IconManager';
import {SvgUri} from 'react-native-svg';
import {useDispatch, useSelector} from 'react-redux';
import COLOR from '../../../constants/COLOR';
import {PostLike} from '../../../helper/ApiModel';
import {getPostById} from '../../../helper/Market/MarketHelper';

const ReactionList = ({darkMode, postId, setReactionPopUpVisible}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const emojiList = useSelector(state => state.MarketSlice.emojiList);
  const makeReaction = async reactionId => {
    try {
      const data = await PostLike(postId, 'reaction', reactionId);
      if (data.api_status === 200) {
        getPostById(dispatch, postId);
        // Alert.alert('Success');
      } else {
        Alert.alert('Failed!');
      }
    } catch (error) {
      // Handle error
    }
  };

  useEffect(() => {
    // Alert.alert('Alert', `ID ${emojiList[0].id}`);
  }, []);

  const renderIcon = (reaction, index) => {
    return (
      <TouchableOpacity
        onPressIn={() => {
          // handleEmojiIconsPress(reaction.id);
          // handleEmojiIconsPress(reaction.id, false);
        }}
        onPressOut={() => {
          // setReactionPopUpVisible(reactionPopUpVisible === true ? false : true);
        }}
        onPress={() => {
          // handleReaction();
          makeReaction(reaction.id);
          setReactionPopUpVisible(false);
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

  return (
    <View
      style={{
        flexDirection: 'row',
        position: 'absolute',
        top: -60,
        left: 35,
        // right: 40,
        zIndex: 1,
        // backgroundColor: COLOR.White,
        paddingHorizontal: 6,
        paddingVertical: 6,
        gap: 10,
        borderRadius: 192,
      }}>
      {emojiList?.map((reaction, index) => (
        <TouchableOpacity key={index} onPress={() => {}}>
          {renderIcon(reaction, index)}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ReactionList;

const styles = StyleSheet.create({
  reactionStyle: {
    // backgroundColor: COLOR.Primary,
    borderRadius: SPACING.sp8,
    width: '32%',
    // height: SPACING.sp40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
