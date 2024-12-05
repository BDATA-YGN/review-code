import React from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet,Image} from 'react-native';
// import assets from '../../../assets/AssetsManager';
import IconManager from '../../../assets/IconManager';
import SPACING from '../../../constants/SPACING';
import COLOR from '../../../constants/COLOR';
import { FontFamily,fontSizes } from '../../../constants/FONT';
import { feelingActivityOptions } from '../../../constants/CONSTANT_ARRAY';
import i18n from "../../../i18n";
// import { feelingActivityOptions } from '../../../constants/const_array';
// import { FontFamily, FontSize } from '../../../constants/GlobalStyles';

const FeelingActivityModal = ({visible, onClose , action, darkMode}) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}>
    <TouchableOpacity style={styles.modalContainer} onPress = {onClose}>
    <TouchableOpacity activeOpacity={1} style={[styles.modalContent,darkMode == 'enable' ? {backgroundColor: COLOR.DarkThemLight} : {backgroundColor: COLOR.White}]}>
        <View style={styles.modalHeader}>
          <Text style={[styles.modalHeaderText,darkMode == 'enable' ? {color : COLOR.White} : {color: COLOR.Grey500,}]}>{i18n.t(`translation:whatareyoudoing`)}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeIconWrapper}>
            <Image source={darkMode == 'enable' ? IconManager.close_dark : IconManager.close_light} style={styles.closeIcon} resizeMode='contain'/>
          </TouchableOpacity>
        </View>
        <View style={[styles.modalHeaderBottomBorder,darkMode == 'enable' ? { borderBottomColor: COLOR.White} : { borderBottomColor: COLOR.Grey100}]} />
       
        <View style={styles.itemWrapper}>
           {feelingActivityOptions.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => action(item.id)}
             >
              <View key={index} style = {styles.itemContent}>
                <Image source={darkMode == 'enable' ? item.iconDark : item.iconLight} style={styles.icon} resizeMode='contain'/>
                <Text style = {[styles.itemContentText, darkMode == 'enable' ? { color : COLOR.White}: { color : COLOR.Grey500}]}>{item.text}</Text>
              </View>
            </TouchableOpacity>
          ))}
         
        </View>
       
      </TouchableOpacity>
    </TouchableOpacity>
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
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
    color : COLOR.Grey500
  },
  modalHeader: {
    padding: SPACING.lg,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalHeaderBottomBorder: {
    borderBottomWidth: 1,
  },
  modalHeaderText: {
    fontSize: fontSizes.size23,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  itemWrapper : {
    padding: 16, rowGap: 16
  },
  itemContent : {
    flexDirection: 'row',
     columnGap: 10,
      alignItems : 'center'
  },
  itemContentText : {
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
  },
  closeIconWrapper : {
    padding : SPACING.xs,
  },
  closeIcon : {
      width : 16,
      height : 16,
  },
  icon : {
    width : 24,
    height : 24,
  }
});

export default FeelingActivityModal;
