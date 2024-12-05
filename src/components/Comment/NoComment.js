import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import IconManager from '../../assets/IconManager';
import SPACING from '../../constants/SPACING';
import PIXEL from '../../constants/PIXEL';
import {FontFamily, fontSizes} from '../../constants/FONT';
import i18next from 'i18next';
import COLOR from '../../constants/COLOR';

const NoComment = (props) => {
  return (
    <View style={styles.nocommentContainer}>
      <Image
        resizeMode="contain"
        source={props.darkMode == 'enable' ? IconManager.nocomment_dark : IconManager.nocomment_light}
        style={styles.commentImage}
      />
      <Text style={[styles.nocommentText , props.darkMode == 'enable' ? {color: COLOR.White} : {color: COLOR.Grey500}]}>
        {i18next.t('translation:noComment')}
      </Text>
    </View>
  );
};

export default NoComment;

const styles = StyleSheet.create({
  nocommentContainer: {
    alignItems: 'center',
    marginTop: SPACING.sp48,
  },
  commentImage: {
    width: PIXEL.px97,
    height: PIXEL.px97,
  },
  nocommentText: {
    marginTop: SPACING.sp16,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
  },
});
