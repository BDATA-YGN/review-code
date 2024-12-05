import React, { useState } from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet, TextInput,Image} from 'react-native';
import IconManager from '../../assets/IconManager';
import COLOR from '../../constants/COLOR';
import { FontFamily, fontSizes } from '../../constants/FONT';
import SPACING from '../../constants/SPACING';

const ReportUserModal = ({visible, onClose , action , setReportText , reportText, darkMode }) => (

  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}>
    <View style={styles.modalContainer}>
    <View style={[styles.modalContent,darkMode == 'enable' ? {backgroundColor: COLOR.DarkThemLight} : {backgroundColor: COLOR.White}]}>
        <View style={styles.modalHeader}>
          <View style={{flexDirection : 'row', justifyContent : 'center', alignItems : 'center', gap : 10}}>
            <Text style={[styles.modalHeaderText,darkMode == 'enable' ? {color : COLOR.White} : {color: COLOR.Grey500,}]}>Report This User</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.iconWrapper}>
            <Image source={darkMode == 'enable' ? IconManager.close_dark : IconManager.close_light} style={styles.icon} resizeMode='contain'/>
          </TouchableOpacity>
        </View>
        
       
        <View>
            <TextInput placeholder="Text" style={styles.textInputStyle}
            value={reportText}
            placeholderTextColor={darkMode == 'enable' ? COLOR.White : COLOR.Grey300}
            onChangeText={(text) => setReportText(text)}
            color = {darkMode == 'enable' ? COLOR.White : COLOR.Grey300}
            />
        </View>
        <View 
        // style={{flexDirection : 'row', justifyContent : 'flex-end'}}
        >

          <TouchableOpacity onPress={action}>
                <View style={styles.buttonStyle}>
                <Text style={[styles.buttonTextStyle, darkMode == 'enable' ? { color : COLOR.White} : { color : COLOR.Grey500}]}>Add</Text>
                </View>
          </TouchableOpacity>
        </View>
       
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderRadius: 20,
    width: '82.31%',
    padding : 16,
    gap : 16
  },
  modalContentText: {
    fontSize: 15,
    fontFamily : FontFamily.PoppinRegular,
  },
  modalHeader: {
    // padding: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalHeaderText: {
    fontSize: fontSizes.size23,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  iconWrapper : {
    padding : SPACING.xs,
  },
  icon : {
      width : 16,
      height : 16,
  },
  iconStyle : {
    width : 24,
    height : 24,
  },
  buttonStyle : {
    paddingHorizontal : SPACING.xxs ,
     paddingTop : SPACING.lg ,
      paddingBottom : SPACING.xxs,
  },
  buttonTextStyle : {
    fontSize : fontSizes.size15,
    fontFamily : FontFamily.PoppinRegular,
    textAlign : 'right'
  },
  textInputStyle : {
    borderBottomWidth : 1,
     borderBottomColor : COLOR.Primary,
    fontSize: fontSizes.size15
  }
});

export default ReportUserModal;
