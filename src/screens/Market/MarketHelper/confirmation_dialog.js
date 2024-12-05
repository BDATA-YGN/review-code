import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal} from 'react-native';
import COLOR from '../../../constants/COLOR';
import {FontFamily, fontSizes} from '../../../constants/FONT';
import SPACING from '../../../constants/SPACING';
import RADIUS from '../../../constants/RADIUS';

const ConfirmationDialog = ({
  headerLable,
  visible,
  onConfirm,
  onCancel,
  darkMode,
  lableText,
  buttonOne,
  buttonTwo,
}) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onCancel}>
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
            {headerLable}
          </Text>
          <Text
            style={[
              styles.message,
              {
                color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
              },
            ]}>
            {lableText}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.cancelButton,
                {
                  backgroundColor:
                    darkMode === 'enable' ? COLOR.Grey700 : COLOR.Grey100,
                },
              ]}
              onPress={onCancel}>
              <Text
                style={[
                  styles.buttonText,
                  {
                    color:
                      darkMode === 'enable' ? COLOR.White100 : COLOR.Grey800,
                  },
                ]}>
                {buttonOne}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onConfirm}>
              <Text style={styles.buttonText}>{buttonTwo}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationDialog;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  dialogContainer: {
    width: '80%',
    borderRadius: RADIUS.rd8,
    padding: SPACING.sp16,
    // Shadow for iOS
    shadowColor: COLOR.Primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.6,
    shadowRadius: 2,
    // Shadow for Android
    elevation: 5,
  },
  title: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size18,
    marginBottom: SPACING.sp8,
  },
  message: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    marginBottom: SPACING.sp16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: SPACING.sp8,
    paddingHorizontal: SPACING.sp16,
    borderRadius: RADIUS.rd8,
    backgroundColor: COLOR.Primary,
    marginLeft: SPACING.sp8,
  },
  cancelButton: {
    backgroundColor: COLOR.Grey300,
  },
  buttonText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size14,
    color: COLOR.White100,
  },
});
