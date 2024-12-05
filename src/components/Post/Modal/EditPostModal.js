import i18next from 'i18next';
import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import IconManager from '../../../assets/IconManager';
import PIXEL from '../../../constants/PIXEL';
import COLOR from '../../../constants/COLOR';
import {fontSizes} from '../../../constants/FONT';
import SPACING from '../../../constants/SPACING';
import RADIUS from '../../../constants/RADIUS';

const EditPostModal = ({visible, onClose, data, handleSelectedOption}) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalHeaderText}>
            {i18next.t('translation:more')}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Image
              source={IconManager.filter_close}
              style={{width: PIXEL.px16, height: PIXEL.px16}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.modalHeaderBottomBorder} />
        <View style={{padding: SPACING.sp16, rowGap: SPACING.sp16}}>
          {data.map(item => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleSelectedOption(item)}>
              <Text style={styles.modalContentText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
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
    backgroundColor: COLOR.White,
    borderRadius: RADIUS.rd15,
    width: '82.31%',
  },
  modalContentText: {
    fontSize: fontSizes.size15,
    fontFamily: 'Poppins-Regular',
  },
  modalHeader: {
    padding: SPACING.sp16,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalHeaderBottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#C0C0C0',
  },
  modalHeaderText: {
    fontSize: fontSizes.size23,
    color: COLOR.Grey500,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default EditPostModal;
