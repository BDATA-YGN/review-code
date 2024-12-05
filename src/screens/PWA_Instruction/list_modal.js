import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Platform,
} from 'react-native';
import IconManager from '../../assets/IconManager';
import COLOR from '../../constants/COLOR';
import {FontFamily, fontSizes} from '../../constants/FONT';
import {useNavigation} from '@react-navigation/native';

const ListModal = ({dataList, darkMode, modalVisible, setModalVisible}) => {
  const navigation = useNavigation();
  // Function to handle outside tap
  const handleOutsidePress = () => {
    setModalVisible(false);
  };
  const navigate = item => {
    navigation.navigate(item.navigate, {darkMode: darkMode});
    setModalVisible(false);
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <TouchableOpacity
        style={styles.modalOverlay}
        onPress={handleOutsidePress}
        activeOpacity={1} // Ensures the touchable area is responsive
      >
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor:
                darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White100,
            },
          ]}>
          <FlatList
            data={dataList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  item.type === 1 ? navigate(item) : item.action();
                }}>
                <View
                  style={{
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <Image
                    source={
                      darkMode === 'enable' ? item.iconDark : item.iconLight
                    }
                    style={{width: 18, height: 18, resizeMode: 'contain'}}
                  />
                  <View style={styles.listItem}>
                    <Text
                      style={[
                        styles.textStyle,
                        {
                          color:
                            darkMode === 'enable'
                              ? COLOR.White100
                              : COLOR.Grey500,
                        },
                      ]}>
                      {item.name}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.05)', // semi-transparent background
  },
  modalContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'android' ? 16 : 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    position: 'relative', // Ensures relative positioning for the absolute close button
    // Ensure modal content does not close on click
    // flex: 1,
    justifyContent: 'flex-start',
  },
  closeButton: {
    padding: 8,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    padding: 10,
  },
  textStyle: {
    fontSize: fontSizes.size16,
    fontFamily: FontFamily.PoppinRegular,
  },
});

export default ListModal;
