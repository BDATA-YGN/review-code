import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import {styles} from '../commonStyles/styles';
import IconManager from '../assets/IconManager';
import {useNavigation} from '@react-navigation/native';
import ModalComponent from '../commonComponent/ModalComponent';
import {
  postCreateOptions,
  pwaUserActionList,
} from '../constants/CONSTANT_ARRAY';
// import PWAInstallInstructions from '../screens/PWA_Instruction/pwa_install_instructions';
import ListModal from '../screens/PWA_Instruction/list_modal';

const AppBar = props => {
  const [openModal, setOpenModal] = useState(false);
  const navigation = useNavigation();
  // const openTargetApp = () => {
  //   const url = 'my-space-messenger://'; // The custom URL scheme of the target app

  //   Linking.canOpenURL(url)
  //     .then(supported => {
  //       return Linking.openURL(url);
  //     })
  //     .catch(err => Alert.alert('Error', `An error ${url}`, url));
  // };
  const openTargetApp = () => {
    const urlScheme = 'my-space-messenger://'; // The custom URL scheme of the target app
    const appStoreURL = 'https://apps.apple.com/app/id454638411'; // The App Store URL

    Linking.canOpenURL(urlScheme)
      .then(supported => {
        if (supported) {
          return Linking.openURL(urlScheme);
        } else {
          const storeURL = Platform.OS === 'ios' ? appStoreURL : null;
          Linking.openURL(storeURL).catch(err => {
            Alert.alert('Error', 'Failed to open the store.');
          });
        }
      })
      .catch(err => {
        Alert.alert('Error', `An error occurred: ${err.message}`);
      });
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleDownloadPWA = () => {
    const pwaUrl = 'https://msg.myspace.com.mm/login';
    Linking.openURL(pwaUrl).catch(err =>
      console.error('Failed to open URL: ', err),
    );
  };

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View
      style={
        props.darkMode == 'enable'
          ? styles.darkModeAppBarContainer
          : styles.appBarContainer
      }>
      {props.isbackArrow && (
        <TouchableOpacity onPress={props.onPressBack}>
          <Image
            source={
              props.darkMode == 'enable'
                ? IconManager.back_dark
                : IconManager.back_light
            }
            resizeMode="contain"
            style={styles.HeaderBackButton}
          />
        </TouchableOpacity>
      )}
      {props.isAppLogo && (
        <Image
          source={
            props.darkMode == 'enable'
              ? IconManager.myspace_dark
              : IconManager.myspace_light
          }
          resizeMode="contain"
          style={styles.myspaceLogo}
        />
      )}

      <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
        {props.isHome && (
          <>
            <TouchableOpacity
              onPress={props.onPressSearch}
              style={{marginHorizontal: 10}}>
              <Image
                source={
                  props.darkMode == 'enable'
                    ? IconManager.search_dark
                    : IconManager.search_light
                }
                resizeMode="contain"
                style={styles.appBarIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginHorizontal: 10}}
              onPress={() => setOpenModal(true)}>
              <Image
                source={
                  props.darkMode == 'enable'
                    ? IconManager.create
                    : IconManager.create_light
                }
                resizeMode="contain"
                style={styles.appBarIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginHorizontal: 10}}
              onPress={() => {
                // navigation.navigate('CommingSoon');
                // openTargetApp();
                // handleDownloadPWA();
                // handleOpenModal();
                setModalVisible(true);
              }}>
              <Image
                source={
                  props.darkMode == 'enable'
                    ? IconManager.chat
                    : IconManager.chat_light
                }
                resizeMode="contain"
                style={styles.appBarIcon}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
      {/* <Modal visible={isModalVisible} animationType="slide">
        <PWAInstallInstructions
          onClose={handleCloseModal}
          darkMode={props.darkMode}
        />
      </Modal> */}
      <ListModal
        dataList={pwaUserActionList}
        darkMode={props.darkMode}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <ModalComponent
        openModal={openModal}
        closeModal={() => setOpenModal(false)}
        options={postCreateOptions}
        darkMode={props.darkMode}
      />
    </View>
  );
};

export default AppBar;
