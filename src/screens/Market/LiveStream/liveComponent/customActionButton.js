import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import COLOR from '../../../../constants/COLOR';

const CustomActionButton = ({onPressButton, text, darkMode, isLoading}) => {
  const isDarkMode = darkMode === 'enable';
  const textColor = isDarkMode ? COLOR.White100 : COLOR.White100; // Adjust if different colors are needed

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={!isLoading ? onPressButton : null}
      style={[styles.button, styles.buttonStyle]}>
      {isLoading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, {color: textColor}]}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    backgroundColor: COLOR.Primary,
  },
  text: {
    fontSize: 16,
  },
});

export default CustomActionButton;
