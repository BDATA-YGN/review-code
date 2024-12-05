import React from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet, Pressable, Image} from 'react-native';
import IconManager from '../../../assets/IconManager';
import { FontFamily,fontSizes } from '../../../constants/FONT';
import COLOR from '../../../constants/COLOR';

const DiscardPostModal = ({visible, onClose,clearAndNavigate , darkMode}) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}>
    <View style={styles.modalContainer}>
      <View style={[styles.modalContent, darkMode == 'enable' ? {backgroundColor: COLOR.DarkFadeLight,} : {backgroundColor: COLOR.White,}]}>
        <View style={styles.modalHeader}>
          <Text style={[styles.modalHeaderText, darkMode == 'enable' ? {  color: COLOR.White,} : {  color: COLOR.Grey500,}]}>Are you sure?</Text>
          <TouchableOpacity onPress={onClose}>
            <Image source={darkMode == 'enable' ? IconManager.close_dark : IconManager.close_light} style={{width : 16 ,height : 16}} resizeMode='contain'/>
          </TouchableOpacity>
        </View>
        <View style={styles.modalHeaderBottomBorder} />
        <View style={{padding: 16, rowGap: 16}}>
          <Text style={darkMode == 'enable' ? {fontFamily : FontFamily.PoppinRegular , fontSize : fontSizes.size15 , color : COLOR.White} : {fontFamily : FontFamily.PoppinRegular , fontSize : fontSizes.size15 , color : COLOR.Grey500}}>The full input will be deleted if you exit or you can continue editing</Text>
          <View style = {{flexDirection : 'row', justifyContent : 'space-between',}}>
            <Pressable onPress={clearAndNavigate}>
            <Text style={{color : '#D93838', fontFamily : FontFamily.PoppinRegular , fontSize : fontSizes.size15 }}>Discard Post</Text>
            </Pressable>
            <Pressable onPress={onClose}>
            <Text style={darkMode == 'enable' ? {fontFamily : FontFamily.PoppinRegular , fontSize : fontSizes.size15 , color : COLOR.White} : {fontFamily : FontFamily.PoppinRegular , fontSize : fontSizes.size15 , color : COLOR.Grey500}}>Continue Editing</Text>
            </Pressable>
          </View>
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
    borderRadius: 15,
    width: '82.31%',
  },
  modalContentText: {
    fontSize: 15,
    fontFamily: FontFamily.PoppinRegular,
  },
  modalHeader: {
    padding: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalHeaderBottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#C0C0C0',
  },
  modalHeaderText: {
    fontSize: 23,
    fontFamily: FontFamily.PoppinSemiBold,
  },
});

export default DiscardPostModal;
