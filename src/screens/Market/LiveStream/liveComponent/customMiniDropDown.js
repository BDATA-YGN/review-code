// CustomDropdown.js
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';
import IconManager from '../../../../assets/IconManager';
import COLOR from '../../../../constants/COLOR';
import {FontFamily, fontSizes} from '../../../../constants/FONT';

const CustomMiniDropdown = ({
  data,
  selectedValue,
  onValueChange,
  placeholder,
  pointerKey = '',
  labelKey = '',
  label = '',
  isLabelVisible = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(
    selectedValue === null ? data[0] : selectedValue,
  );

  useEffect(() => {
    handleSelect(selectedItem);
  }, []);

  const handleSelect = item => {
    setSelectedItem(item);
    onValueChange(item);
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Touchable dropdown button */}
      {isLabelVisible ? (
        <Text
          style={{
            fontFamily: FontFamily.PoppinBold,
            fontSize: fontSizes.size16,
            color: COLOR.Grey400,
            marginLeft: 2,
          }}>
          {label}
        </Text>
      ) : null}
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsVisible(true)}>
        <View
          style={{
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 4,
          }}>
          <View
            style={{
              width: '90%',
              justifyContent: 'flex-start',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Image
              source={IconManager.earth_dark}
              style={{
                width: 16,
                height: 16,
                resizeMode: 'contain',
              }}
            />
            <Text
              numberOfLines={1}
              style={[
                styles.dropdownButtonText,
                {
                  color: selectedItem
                    ? COLOR.Grey500
                    : COLOR.Grey200 || '#B0B0B0',
                },
                {width: '80%'},
              ]}>
              {selectedItem ? selectedItem.label : placeholder}
            </Text>
          </View>
          <Image
            source={IconManager.arrow_down}
            style={{width: 12, height: 12, resizeMode: 'contain'}}
          />
        </View>
      </TouchableOpacity>

      {/* Modal for dropdown options */}
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}>
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPressOut={() => setIsVisible(false)}>
          <View style={styles.modalContent}>
            <FlatList
              data={data}
              keyExtractor={item => item[pointerKey]}
              renderItem={({item}) => (
                <View
                  style={{
                    width: '100%',
                    marginVertical: 2,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={[
                      styles.dropdownItem,
                      selectedItem &&
                      item[pointerKey] === selectedItem[pointerKey]
                        ? styles.selectedDropdownItem
                        : null,
                    ]}
                    onPress={() => handleSelect(item)}>
                    <Text
                      style={[
                        styles.dropdownItemText,
                        selectedItem &&
                        item[pointerKey] === selectedItem[pointerKey]
                          ? styles.selectedDropdownItemText
                          : null,
                      ]}>
                      {item[labelKey]}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  dropdownButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#E0E0E0',
    backgroundColor: '#F9F9F9',
  },
  dropdownButtonText: {
    fontSize: 12,
    color: '#000',
    paddingHorizontal: 4,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#F9F9F9',
    borderRadius: 5,
    maxHeight: '50%',
    borderRadius: 8,
  },
  dropdownItem: {
    width: '96%',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333333',
  },
  selectedDropdownItem: {
    // backgroundColor: '#E0E0E0', // Highlight background color for selected item
  },
  selectedDropdownItemText: {
    color: COLOR.Primary, // Highlight text color for selected item
    fontWeight: 'bold',
  },
  appContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    marginTop: 20,
    fontSize: 18,
  },
});

export default CustomMiniDropdown;
