import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import SPACING from '../../../constants/SPACING';
import IconManager from '../../../assets/IconManager';
import ReactionList from './reaction_list';
import {useDispatch, useSelector} from 'react-redux';
import {SvgUri} from 'react-native-svg';
import COLOR from '../../../constants/COLOR';
import RADIUS from '../../../constants/RADIUS';
import {PostLike} from '../../../helper/ApiModel';
import {
  checkNetworkStatus,
  getPostById,
} from '../../../helper/Market/MarketHelper';

const AppReaction = ({darkMode}) => {
  const navigation = useNavigation();
  const [reactionPopUpVisible, setReactionPopUpVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({x: 0, y: 0});
  const emojiList = useSelector(state => state.MarketSlice.emojiList);
  const postData = useSelector(state => state.MarketSlice.postData);
  const dispatch = useDispatch();

  const handlePress = event => {
    const {locationX, locationY} = event.nativeEvent;
    setPopupPosition({x: locationX, y: locationY});
    setReactionPopUpVisible(!reactionPopUpVisible);
  };

  const makeReaction = async reactionId => {
    try {
      // Alert.alert('Aleert . aleert ==>', `Alert => ${postData.post_id}`);
      const data = await PostLike(postData.post_id, 'reaction', reactionId);
      if (data.api_status === 200) {
        getPostById(dispatch, postData.post_id);
        // Alert.alert('Success');
      } else {
        // Alert.alert('Failed!');
      }
    } catch (error) {
      // Alert.alert('Error!', `Error ===> ${error}`);
      // Handle error
    }
  };

  //  react dynamic
  const handleReact = () => {
    if (darkMode === 'enable') {
      return postData?.reaction?.is_reacted
        ? reactedEmoji()
        : IconManager.unlike_dark;
    } else {
      return postData?.reaction?.is_reacted
        ? reactedEmoji()
        : IconManager.unlike_light;
    }
  };

  const reactedEmoji = () => {
    if (postData.reaction.type == 0) {
      return darkMode === 'enable'
        ? IconManager.like_dark
        : IconManager.like_light;
    } else {
      const item = emojiList.find(item => item.id === postData.reaction.type);
      if (item) {
        return item.wowonder_small_icon;
      } else {
        return darkMode === 'enable'
          ? IconManager.like_dark
          : IconManager.like_light;
      }
    }
  };

  return (
    <TouchableOpacity
      onLongPress={handlePress}
      onPress={() => {
        postData?.reaction?.is_reacted
          ? makeReaction('0')
          : makeReaction(emojiList[0].id);
        // checkNetworkStatus().then(isOnline => {
        //   if (isOnline) {
        //     postData?.reaction?.is_reacted
        //       ? makeReaction('0')
        //       : makeReaction(emojiList[0].id);
        //   } else {
        //   }
        // });
      }}
      activeOpacity={0.8}
      style={styles.reactionStyle}>
      <View>
        {typeof handleReact() === 'string' && handleReact().endsWith('.svg') ? (
          <View
            style={{
              padding: SPACING.sp9,
              backgroundColor:
                darkMode == 'enable' ? COLOR.Grey500 : COLOR.Blue50,
              borderRadius: RADIUS.rd15,
            }}>
            <SvgUri
              style={styles.reactionIcon}
              uri={handleReact()}
              width={18}
              height={18}
            />
          </View>
        ) : typeof handleReact() === 'string' &&
          handleReact().endsWith('.png') ? (
          <View
            style={{
              padding: SPACING.sp9,
              backgroundColor:
                darkMode == 'enable' ? COLOR.Grey500 : COLOR.Blue50,
              borderRadius: RADIUS.rd15,
            }}>
            <Image
              source={{uri: handleReact()}}
              style={{width: 18, height: 18}}
              resizeMode="contain"
            />
          </View>
        ) : (
          <Image
            source={handleReact()}
            style={{width: 36, height: 36}}
            resizeMode="contain"
          />
        )}
      </View>
      {reactionPopUpVisible ? (
        <ReactionList
          darkMode={darkMode}
          postId={postData.post_id}
          setReactionPopUpVisible={setReactionPopUpVisible}
        />
      ) : null}
    </TouchableOpacity>
  );
};

export default AppReaction;

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
