import React, {useEffect} from 'react';
import {StyleSheet, View, Image, TouchableOpacity, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import SPACING from '../../../../constants/SPACING';
import {SvgUri} from 'react-native-svg';
import {useDispatch, useSelector} from 'react-redux';
import {PostLike} from '../../../../helper/ApiModel';
import {getPostById} from '../../../../helper/Market/MarketHelper';

const LiveReactionList = ({darkMode, postId, setReactionPopUpVisible}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const emojiList = useSelector(state => state.MarketSlice.emojiList);

  const makeReaction = async reactionId => {
    try {
      const data = await PostLike(postId, 'reaction', reactionId);
      if (data.api_status === 200) {
        getPostById(dispatch, postId);
      } else {
        Alert.alert('Failed!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {}, []);

  const renderIcon = (reaction, index) => {
    return (
      <TouchableOpacity
        onPress={() => {
          makeReaction(reaction.id);
          setReactionPopUpVisible(false);
        }}>
        {reaction.wowonder_icon.endsWith('.svg') ? (
          <SvgUri
            style={styles.reactionIcon}
            uri={reaction.wowonder_icon}
            width={36}
            height={36}
          />
        ) : (
          <Image
            source={{uri: reaction.wowonder_icon}}
            style={{width: 36, height: 36}}
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        position: 'absolute',
        zIndex: 1,
        paddingHorizontal: 6,
        paddingVertical: 6,
        bottom: 40,
        gap: 10,
        borderRadius: 192,
      }}>
      {emojiList
        ?.slice()
        .reverse()
        .map((reaction, index) => (
          <TouchableOpacity key={index}>
            {renderIcon(reaction, index)}
          </TouchableOpacity>
        ))}
    </View>
  );
};

export default LiveReactionList;

const styles = StyleSheet.create({
  reactionIcon: {
    // Add any specific styles for your icons here
  },
});
