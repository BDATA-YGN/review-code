import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import SPACING from '../../../constants/SPACING';
import IconManager from '../../../assets/IconManager';
import {useSelector} from 'react-redux';
import {checkNetworkStatus} from '../../../helper/Market/MarketHelper';

const AppComment = ({darkMode}) => {
  const navigation = useNavigation();
  const postData = useSelector(state => state.MarketSlice.postData);

  return (
    <TouchableOpacity
      onPress={() => {
        checkNetworkStatus().then(isOnline => {
          if (isOnline) {
            navigation.navigate('Comment', {
              postid: postData.post_id,
              reaction: postData.reaction.count,
            });
          } else {
          }
        });
      }}
      activeOpacity={0.8}
      style={styles.reactionStyle}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          style={{
            width: SPACING.sp36,
            height: SPACING.sp36,
            resizeMode: 'contain',
          }}
          source={
            darkMode === 'enable'
              ? IconManager.uncomment_dark
              : IconManager.uncomment_light
          }
        />
      </View>
    </TouchableOpacity>
  );
};

export default AppComment;

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
