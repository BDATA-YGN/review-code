import {View, Text} from 'react-native';
import React from 'react';
import ImageView from 'react-native-image-viewing';

const ImageViewing = props => {
  return (
    <ImageView
      images={props.images}
      imageIndex={props.currentIndex}
      visible={props.visible}
      onRequestClose={props.onClose}
    />
  );
};

export default ImageViewing;
