import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {getFileType} from '../../helper/FileTypeCheck';
import {reactionIcons} from '../../constants/CONSTANT_ARRAY';
import {fontSizes} from '../../constants/FONT';
import COLOR from '../../constants/COLOR';
import SPACING from '../../constants/SPACING';
import PIXEL from '../../constants/PIXEL';
import {SvgUri} from 'react-native-svg';

const PostReaction = props => {
  const navigation = useNavigation();

  const handleReact = reaction => {
    return reaction?.wowonder_small_icon;
  };
  useEffect(() => {}, []);
  const renderReactions = () => {
    return (
      <>
        {props.isSelfReacted === 'Initial' ||
        props.isSelfReacted === 'Reacted' ||
        props.isSelfReacted === 'Re-Reacted' ? (
          <View style={styles.reaction}>
            {props?.reactionType?.map(reactionType =>
              props.data.reaction[reactionType.id] ? (
                <View
                  key={reactionType.id}
                  style={[styles.iconContainer, {zIndex: 1}]}>
                  {/* <Image
                  source={reactionIcons[reactionType]}
                  style={styles.iconStyle}
                  resizeMode="contain"
                /> */}
                  <>
                    {typeof handleReact(reactionType) === 'string' &&
                    handleReact(reactionType).endsWith('.svg') ? (
                      <SvgUri
                        style={styles.reactionIcon}
                        uri={handleReact(reactionType)}
                        width={18}
                        height={18}
                      />
                    ) : typeof handleReact(reactionType) === 'string' &&
                      handleReact(reactionType).endsWith('.png') ? (
                      <Image
                        source={{uri: handleReact(reactionType)}}
                        style={{width: 18, height: 18}}
                        resizeMode="contain"
                      />
                    ) : (
                      <Image
                        source={handleReact(reactionType)}
                        style={{width: 18, height: 18}}
                        resizeMode="contain"
                      />
                    )}
                  </>
                </View>
              ) : null,
            )}
          </View>
        ) : null}
      </>
    );
  };

  const showReactionList = () => {
    navigation.navigate('ReactionList', {post: props.data});
  };
  return (
    <View style={styles.bodyStatus}>
      <TouchableOpacity
        onPress={() => {
          !props.isFromShare && showReactionList();
        }}
        activeOpacity={props.isFromShare ? 1 : 0.1}
        style={styles.statusleft}>
        {props.data.reaction.count > 0 ? renderReactions() : null}

        {/* {props.data.reaction.count > 0 ?
            <View style={styles.reaction}>
                {[1, 2, 3, 4, 5, 6].map(reactionType => (
                props.data.reaction[reactionType] == 1 ? (
                    <View key={reactionType} style={[styles.iconContainer, { zIndex: 1 }]}>
                    <Icon source={reactionIcons[reactionType]} width={18} height={18} />
                    </View>
                ) : null
                ))}
            </View>
            :null
                } */}
        {/* {
          props.isSelfReacted === 'Initial'
          ?
          <Text style={[styles.status, props.darkMode == 'enable' ? { color: COLOR.White } : { color: COLOR.Grey300 }]}>
            Initial
          </Text>
          :
          props.isSelfReacted == 'Reacted'
          ?
          <Text style={[styles.status, props.darkMode == 'enable' ? { color: COLOR.White } : { color: COLOR.Grey300 }]}>
            Reacted
          </Text>
          :
          props.isSelfReacted === 'Re-Reacted'
          ?
          <Text style={[styles.status, props.darkMode == 'enable' ? { color: COLOR.White } : { color: COLOR.Grey300 }]}>
            Re-Reacted
          </Text>
          :
          null
        } */}
        {props.isSelfReacted === 'Initial' ||
        props.isSelfReacted === 'Reacted' ||
        props.isSelfReacted === 'Re-Reacted' ? (
          <Text
            style={[
              styles.status,
              props.darkMode == 'enable'
                ? {color: COLOR.White}
                : {color: COLOR.Grey300},
            ]}>
            {props.selfReaction == 1
              ? props.username
              : props.data.reaction.count > 0
              ? props.data.reaction.is_reacted
                ? props.data.reaction.count == 1
                  ? props.isSelfReacted === 'Initial'
                    ? 'You'
                    : props.isSelfReacted === 'Re-Reacted'
                    ? 'You'
                    : props.isSelfReacted === 'Reacted'
                    ? 'You'
                    : '0 Reaction'
                  : (props.isSelfReacted === 'Initial'
                      ? 'You & '
                      : props.isSelfReacted === 'Re-Reacted'
                      ? 'You & '
                      : props.isSelfReacted === 'Reacted'
                      ? 'You & '
                      : '') +
                    (props.data.reaction.count - 1 > 1
                      ? props.data.reaction.count - 1 + ' Others'
                      : props.data.reaction.count - 1 + ' Other')
                : props.data.reaction.count > 1
                ? (props.isSelfReacted === 'Initial' ? '' : 'You & ') +
                  props.data.reaction.count +
                  ' Others'
                : (props.isSelfReacted === 'Initial' ? '' : 'You & ') +
                  props.data.reaction.count +
                  ' Other'
              : props.isSelfReacted === 'Initial'
              ? '0 Reaction'
              : 'You'}
          </Text>
        ) : null}
      </TouchableOpacity>
      <View style={styles.statusright}>
        <TouchableOpacity
          activeOpacity={props.isFromShare ? 1 : 0.1}
          onPress={() => {
            !props.isFromShare &&
              navigation.navigate('Comment', {
                postid: props.data.post_id,
                reaction: props.data.reaction.count,
              });
          }}>
          <Text
            style={[
              styles.status,
              props.darkMode == 'enable'
                ? {color: COLOR.White}
                : {color: COLOR.Grey300},
            ]}>
            {props.data.post_comments != 0
              ? props.data.post_comments == 1
                ? props.data.post_comments + ' Comment'
                : props.data.post_comments + ' Comments'
              : props.data.post_comments + ' Comment'}
          </Text>
        </TouchableOpacity>
        <Text
          style={[
            styles.status,
            props.darkMode == 'enable'
              ? {color: COLOR.White}
              : {color: COLOR.Grey300},
          ]}>
          {props.data.post_share != 0
            ? props.data.post_share == 1
              ? props.data.post_share + ' Share'
              : props.data.post_share + ' Shares'
            : props.data.post_share + ' Share'}
        </Text>
        {props.data.postFile &&
          getFileType(props.data.postFile) === 'video' && (
            <Text
              style={[
                styles.status,
                props.darkMode == 'enable'
                  ? {color: COLOR.White}
                  : {color: COLOR.Grey300},
              ]}>
              {props.data.videoViews !== 0
                ? props.data.videoViews === 1
                  ? `${props.data.videoViews} View`
                  : `${props.data.videoViews} Views`
                : `${props.data.videoViews} View`}
            </Text>
          )}
      </View>
    </View>
  );
};

export default PostReaction;
const styles = StyleSheet.create({
  reactionIcon: {
    width: 10,
    height: 10,
  },
  reaction: {
    flexDirection: 'row',
    paddingRight: SPACING.sp10,
    paddingTop: SPACING.sp3,
  },
  iconContainer: {
    marginRight: -SPACING.sp8,
  },
  bodyStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sp16,
    // height: 15,
    marginHorizontal: SPACING.sp16,
    paddingVertical: SPACING.sp5,
  },
  statusleft: {
    flexDirection: 'row',
    alignItems: 'center',
    resizeMode: 'cover',
    top: -1,
  },
  shares: {
    fontSize: fontSizes.size10,
    fontFamily: 'Poppins-Regular',
    color: COLOR.Grey300,
  },
  statusright: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: -1,
  },
  status: {
    fontSize: fontSizes.size13,
    fontFamily: 'Poppins-Regular',
    paddingLeft: SPACING.sp5,
  },
  iconStyle: {
    width: PIXEL.px18,
    height: PIXEL.px18,
  },
});
