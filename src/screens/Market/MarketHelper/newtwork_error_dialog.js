import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal} from 'react-native';
import COLOR from '../../../constants/COLOR';
import {FontFamily, fontSizes} from '../../../constants/FONT';
import SPACING from '../../../constants/SPACING';
import RADIUS from '../../../constants/RADIUS';

const NetworkErrorDialog = ({
  visible,
  onRetryPress,
  darkMode,
  errorMessage = 'Please check your network connection and try again.',
  buttonText = 'Retry',
}) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onRetryPress}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.dialogContainer,
            {
              backgroundColor:
                darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
            },
          ]}>
          <Text
            style={[
              styles.title,
              {
                color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey800,
              },
            ]}>
            Network Error
          </Text>
          <View style={styles.divider} />
          <Text
            style={[
              styles.message,
              {
                color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
              },
            ]}>
            {errorMessage}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor:
                    darkMode === 'enable' ? COLOR.Primary : COLOR.Primary,
                },
              ]}
              onPress={onRetryPress}>
              <Text
                style={[
                  styles.buttonText,
                  {
                    color:
                      darkMode === 'enable' ? COLOR.White100 : COLOR.White100,
                  },
                ]}>
                {buttonText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NetworkErrorDialog;

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#CCCCCC',
    marginBottom: 10,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dialogContainer: {
    width: '80%',
    borderRadius: RADIUS.rd8,
    // padding: SPACING.sp16,
    shadowColor: COLOR.Primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 5,
  },
  title: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size18,
    margin: 10,
    textAlign: 'center',
  },
  message: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    margin: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    paddingVertical: SPACING.sp8,
    paddingHorizontal: SPACING.sp32,
    borderRadius: RADIUS.rd8,
    backgroundColor: COLOR.Primary,
    margin: 10,
  },
  buttonText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size14,
    color: COLOR.White100,
  },
});
