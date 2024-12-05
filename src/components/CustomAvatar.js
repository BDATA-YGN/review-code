import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import IconManager from '../assets/IconManager';

const CustomAvatar = props => (
  <TouchableOpacity onPress={props.onPress}>
    {props.src ? (
      <Image
        resizeMode="contain"
        source={{uri: props.src.trim()}} // trim() to remove any extra spaces
        style={{
          width: props.width,
          height: props.height,
          flex: props.flex,
          justifyContent: props.justifyContent,
          borderRadius: props.borderRadius,
          borderWidth: props.borderWidth,
          borderColor: props.borderColor,
          backgroundColor: props.backgroundColor,
        }}
      />
    ) : props.source ? (
      <Image
        resizeMode="contain"
        source={props.source}
        style={{
          width: props.width,
          height: props.height,
          flex: props.flex,
          justifyContent: props.justifyContent,
          borderRadius: props.borderRadius,
          borderWidth: props.borderWidth,
          borderColor: props.borderColor,
          backgroundColor: props.backgroundColor,
        }}
      />
    ) : (
      <Image
        resizeMode="contain"
        source={IconManager.logo_light}
        style={{
          width: props.width,
          height: props.height,
          flex: props.flex,
          justifyContent: props.justifyContent,
          borderRadius: props.borderRadius,
          borderWidth: props.borderWidth,
          borderColor: props.borderColor,
          backgroundColor: props.backgroundColor,
        }}
      />
    )}
  </TouchableOpacity>
);

export default CustomAvatar;
