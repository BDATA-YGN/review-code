import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import SPACING from '../../constants/SPACING';
import PIXEL from '../../constants/PIXEL';
import RADIUS from '../../constants/RADIUS';
import COLOR from '../../constants/COLOR';

const windowWidth = Dimensions.get('window').width;

const PostShimmer = (props) => {
  const shimmerViews = Array.from({length: 10}).map((_, index) => (
    <SkeletonPlaceholder highlightColor={props.darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White} backgroundColor={props.darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White50} key={index}>
      <View style={styles.postContainer}>
        <View style={styles.avatar} />
        <View style={styles.textContainer}>
          <View style={styles.title} />
          <View style={styles.subtitle} />
        </View>
      </View>
    </SkeletonPlaceholder>
  ));

  return <View style={[styles.container,{backgroundColor: props.darkMode==='enable' && COLOR.DarkTheme}]}>{shimmerViews}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: SPACING.sp10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: windowWidth - 20,
    marginBottom: SPACING.sp30,
  },
  avatar: {
    width: PIXEL.px60,
    height: PIXEL.px60,
    borderRadius: RADIUS.rd30,
    marginLeft: SPACING.sp10,
  },
  textContainer: {
    marginLeft: SPACING.sp10,
  },
  title: {
    width: windowWidth - 110,
    height: PIXEL.px20,
    borderRadius: RADIUS.rd4,
    marginBottom: SPACING.sp6,
  },
  subtitle: {
    width: PIXEL.px150,
    height: PIXEL.px15,
    borderRadius: RADIUS.rd4,
  },
});

export default PostShimmer;
