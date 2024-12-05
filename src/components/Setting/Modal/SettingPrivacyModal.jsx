import React from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet, Image} from 'react-native';
import IconManager from '../../../assets/IconManager';
import { FontFamily, fontSizes } from '../../../constants/FONT';
import COLOR from '../../../constants/COLOR';
import SPACING from '../../../constants/SPACING';
import i18n from "../../../i18n";


const SettingPrivacyModal = ({visible, onClose , title , data , handleSelectSettingPrivacy, darkMode}) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}>
    <TouchableOpacity style={styles.modalContainer} onPress={onClose}>
      <TouchableOpacity activeOpacity={1} style={[styles.modalContent,darkMode == 'enable' ? {backgroundColor: COLOR.DarkThemLight} : {backgroundColor: COLOR.White}]}>
        <View style={styles.modalHeader}>
          <Text style={[styles.modalHeaderText,darkMode == 'enable' ? {color : COLOR.White} : {color: COLOR.Grey500,}]}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.iconWrapper}>
            <Image source={darkMode == 'enable' ? IconManager.close_dark : IconManager.close_light} style={styles.closeIcon} resizeMode='contain'/>
          </TouchableOpacity>
        </View>
        <View style={[styles.modalHeaderBottomBorder,darkMode == 'enable' ? { borderBottomColor: COLOR.White} : { borderBottomColor: COLOR.Grey100}]} />
        <View style={{padding: 16, rowGap: 16}}>
          {data.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelectSettingPrivacy(item)}
              >
                <View key={index} style = {styles.itemContent}>
                  {/* <Image source={darkMode == 'enable' ?  item.iconDark : item.iconLight} style={styles.icon} resizeMode='contain'/> */}
                  <Text style = {[styles.itemContentText,darkMode == 'enable' ? {color : COLOR.White} : {color : COLOR.Grey500}]}>{item.label}</Text>
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
    fontSize: fontSizes.size19,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  iconWrapper : {
    padding : SPACING.xs,
  },
  closeIcon : {
    width : 16,
    height : 16,
},
icon : {
  width : 24,
  height : 24,
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

});

export default SettingPrivacyModal;
