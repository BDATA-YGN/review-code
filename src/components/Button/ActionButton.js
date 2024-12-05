// TextInputComponent.js

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import COLOR from '../../constants/COLOR';
import IconManager from '../../assets/IconManager';
import SPACING from '../../constants/SPACING';
import RADIUS from '../../constants/RADIUS';
import { FontFamily, fontSizes, fontWeight } from '../../constants/FONT';

const ActionButton = (props) => {
    return (
        <TouchableOpacity disabled={props.disabled} onPress={props.onPress} activeOpacity={0.85} style={[styles.buttonStyle,props.myStyle]} >
            <Text style={[styles.text,props.myText]}>{props.text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonStyle: { 
        backgroundColor: COLOR.Primary, 
        padding: SPACING.xxs, 
        borderRadius: RADIUS.xxs,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontFamily: FontFamily.PoppinSemiBold,
        color: COLOR.White50,
        fontSize: fontSizes.size19
    }
});

export default ActionButton;
