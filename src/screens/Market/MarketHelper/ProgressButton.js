import React, {useState} from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import COLOR from '../../../constants/COLOR';
import SPACING from '../../../constants/SPACING';
import { FontFamily, fontSizes } from '../../../constants/FONT';
import RADIUS from '../../../constants/RADIUS';

const ProgressButton = ({onPressButton, text, darkMode, isLoading}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={
        isLoading
          ? null
          : () => {
              onPressButton();
            }
      }
      style={[
        styles.button,
        darkMode === 'enable' ? styles.buttonStyle : styles.buttonStyle,
      ]}>
      {isLoading ? (
        <ActivityIndicator
          color={darkMode === 'enable' ? COLOR.White100 : COLOR.White100}
          style = {{ padding: 4, }}
        />
      ) : (
        <Text
          style={[
            styles.text,
            darkMode === 'enable' ? styles.darkText : styles.lightText,
          ]}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: SPACING.xxs, 
    borderRadius: RADIUS.xxs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    backgroundColor: COLOR.Primary,
    borderWidth: 1,
    borderColor: '#333333',
  },
  text: {
  
    fontFamily: FontFamily.PoppinSemiBold,
        color: COLOR.White50,
        fontSize: fontSizes.size19
  },
  darkText: {
    color: COLOR.White100,
  },
  lightText: {
    color: COLOR.White100,
  },
});

export default ProgressButton;
