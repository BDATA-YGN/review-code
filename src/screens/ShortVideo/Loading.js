// LoadingScreen.js
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';
import COLOR from '../../constants/COLOR';
import IconManager from '../../assets/IconManager';
import SPACING from '../../constants/SPACING';

const Loading = (props) => {
  return (
    <View style={[styles.container, { zIndex: props.zIndex }]}>
      {/* <ActivityIndicator animating={true} size="large" color={COLOR.DarkTheme} /> */}
      <Image source={IconManager.my_space_loading} style={{width: SPACING.sp60,height: SPACING.sp60}} />
      {/* <Text>Loading...</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loading;
