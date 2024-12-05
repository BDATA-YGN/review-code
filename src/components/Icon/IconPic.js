// TextInputComponent.js

import React, {useState, forwardRef, useImperativeHandle} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
import COLOR from '../../constants/COLOR';
import IconManager from '../../assets/IconManager';
import SPACING from '../../constants/SPACING';
import RADIUS from '../../constants/RADIUS';
import {FontFamily, fontSizes, fontWeight} from '../../constants/FONT';
import PIXEL from '../../constants/PIXEL';

const IconPic = props => {
  return (
    <Image
      resizeMode={props.resizeMode ? 'stretch' : 'contain'}
      source={props.src ? {uri: props.src.trim()} : props.source}
      style={[
        {
          width: props.width ? props.width : PIXEL.px18,
          height: props.height ? props.height : PIXEL.px18,
          borderRadius: props.borderRadius,
          borderTopLeftRadius: props.borderTopLeftRadius,
          borderTopRightRadius: props.borderTopRightRadius,
          borderBottomLeftRadius: props.borderBottomLeftRadius,
          borderBottomRightRadius: props.borderBottomRightRadius,
          tintColor: props.tintColor,
        },
        props.myStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({});

export default IconPic;
