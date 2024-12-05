import React from 'react';
import {Platform} from 'react-native';
import PIXEL from '../../constants/PIXEL';
import RADIUS from '../../constants/RADIUS';
import SPACING from '../../constants/SPACING';
import COLOR from '../../constants/COLOR';
import CheckBox from '@react-native-community/checkbox';

const CustomCheckBox = props => (
  <CheckBox
    value={props.value}
    onValueChange={props.onValueChange}
    boxType="square"
    tintColor={props.tintColorFalse}
    onFillColor={props.tintColorFalse}
    onCheckColor={COLOR.White50}
    onTintColor={props.tintColorFalse}
    tintColors={{
      true: props.tintColorTrue,
      false: props.tintColorFalse,
    }}
    style={{
      width: PIXEL.px20,
      height: PIXEL.px20,
      borderWidth: 1,
      borderRadius: RADIUS.rd3,
      marginEnd: SPACING.sp5,
    }}
  />
);

export default CustomCheckBox;
