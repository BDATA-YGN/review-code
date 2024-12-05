// TextInputComponent.js

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import COLOR from '../../constants/COLOR';
import IconManager from '../../assets/IconManager';
import SPACING from '../../constants/SPACING';
import RADIUS from '../../constants/RADIUS';
import { FontFamily, fontSizes, fontWeight } from '../../constants/FONT';
import PIXEL from '../../constants/PIXEL';

const ProfileAvatar = (props) => {
    return (
        <Image resizeMode='contain' src={props.src} source={props.source} style={[{width: PIXEL.px55,height: PIXEL.px55,borderRadius: RADIUS.xxl, borderWidth: 0, borderColor: COLOR.Primary, backgroundColor: COLOR.Blue50},props.myStyle]} />
    );
};

const styles = StyleSheet.create({
});

export default ProfileAvatar;
