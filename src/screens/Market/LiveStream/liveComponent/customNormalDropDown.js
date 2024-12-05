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

const CustomNormalDropdown = ({
  data,
  selectedValue,
  onValueChange,
  placeholder,
  labelKey = '',
  pointerKey = '',
  label = '',
  isLabelVisible = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  // const [selectedItem, setSelectedItem] = useState(
  //   selectedValue === null ? data[0] : selectedValue,
  // );
  const [selectedItem, setSelectedItem] = useState(selectedValue);

  // useEffect(() => {
  //   handleSelect(selectedItem);
  // }, []);

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
          }}>
          <Text
            style={{
              fontSize: 16,
              color: selectedItem ? COLOR.Grey500 : COLOR.Grey200 || '#B0B0B0',
            }}>
            {selectedItem ? selectedItem[labelKey] : placeholder}
          </Text>
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
                    style={styles.dropdownItem}
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
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 8,
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
  selectedDropdownItemText: {
    color: COLOR.Primary, // Highlight text color for selected item
    fontWeight: 'bold',
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

export default CustomNormalDropdown;

// Uses of component
// <CustomNormalDropdown
// data={marketCategory}
// selectedValue={selected}
// onValueChange={value => setSelected(value)}
// placeholder="Select Category"
// labelKey="name"
// pointerKey="category_id"
// />
