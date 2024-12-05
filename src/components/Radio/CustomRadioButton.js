import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import COLOR from '../../constants/COLOR';
import {fontSizes} from '../../constants/FONT';

const CustomRadioButton = ({label, selected, onPress, textSize, darkMode}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.radioButton}
      onPress={onPress}>
      <View
        style={[
          {
            height: 24,
            width: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
            alignItems: 'center',
            justifyContent: 'center',
          },
          selected && styles.radioSelected,
        ]}>
        {selected && (
          <View
            style={[
              {
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: COLOR.Primary,
              },
            ]}
          />
        )}
      </View>
      <Text
        style={[
          styles.radioLabel,
          {
            fontSize: textSize,
            color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
          },
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  radioOuterCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#636366',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInnerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: COLOR.Primary,
  },
  radioSelected: {
    borderColor: COLOR.Primary,
  },
  radioLabel: {
    marginLeft: 10,
  },
});

export default CustomRadioButton;
