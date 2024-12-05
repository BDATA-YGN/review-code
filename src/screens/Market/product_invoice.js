import React, {useRef, useState, useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Animated,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import RNFS from 'react-native-fs';
import COLOR from '../../constants/COLOR';
import IconManager from '../../assets/IconManager';
import {useNavigation} from '@react-navigation/native';
import {FontFamily, fontSizes} from '../../constants/FONT';
import PIXEL from '../../constants/PIXEL';
import SizedBox from '../../commonComponent/SizedBox';
import SPACING from '../../constants/SPACING';
import {formatPrice} from '../../helper/PriceFormat';
import {check, request, PERMISSIONS} from 'react-native-permissions';
import InvoiceViewShot from './invoice_view_shot';
import SuccessedDialogNoAction from './MarketHelper/success_dialog_no_action';
import WarningDialogNoAction from './MarketHelper/warning_dialog_no_action';
import {useSelector} from 'react-redux';

const ProductInvoice = ({route}) => {
  const navigation = useNavigation();
  const {darkMode, product} = route.params;
  const viewShotRef = useRef();
  const [isSaving, setIsSaving] = useState(false);
  const buttonScale = useRef(new Animated.Value(1)).current;

  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isWarnDialogVisible, setWarnDialogVisible] = useState(false);
  const userInfoData = useSelector(state => state.MarketSlice.userInfoData);
  const addressList = useSelector(state => state.MarketSlice.addressList);

  const handleShowDialog = () => {
    setDialogVisible(true);
  };

  const handleCloseDialog = () => {
    setDialogVisible(false);
    // navigation.pop(1);
  };
  const handleOpenWarning = () => {
    setWarnDialogVisible(true);
  };

  const handleCloseWarning = () => {
    setWarnDialogVisible(false);
    // navigation.pop(1);
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'ios') {
      const permission = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (permission !== 'granted') {
        await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      }
    } else {
      const permission = await check(
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      );
      if (permission !== 'granted') {
        await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
      }
    }
  };

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
    captureScreen();
  };

  const captureScreen = () => {
    setIsSaving(true);
    viewShotRef.current.capture().then(uri => {
      saveToGallery(uri).then(value => {
        setIsSaving(false);
        handleShowDialog();
      });
    });
  };

  const saveToGallery = async uri => {
    try {
      if (Platform.OS === 'ios') {
        const result = await CameraRoll.save(uri, {type: 'photo'});
        return result;
      } else {
        const dirPath = `${RNFS.PicturesDirectoryPath}/MySpace`;
        const timestamp = new Date().getTime();
        const newPath = `${dirPath}/invoice_${timestamp}.jpg`;
        const dirExists = await RNFS.exists(dirPath);
        if (!dirExists) {
          await RNFS.mkdir(dirPath);
        }
        await RNFS.moveFile(uri, newPath);
        return newPath;
      }
    } catch (error) {
      setIsSaving(false);
      console.error('Failed to save the screenshot:', error);
      handleOpenWarning();
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.safeAreaView,
        {
          backgroundColor:
            darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
        },
      ]}>
      {/* <StatusBar barStyle="light-content" /> */}
      <SuccessedDialogNoAction
        headerLabel="Success!"
        visible={isDialogVisible}
        onButtonPress={handleCloseDialog}
        darkMode={darkMode}
        labelText="Invoice Save Success."
        buttonText="OK"
      />
      <WarningDialogNoAction
        headerLabel="Warning!"
        visible={isWarnDialogVisible}
        onButtonPress={handleCloseWarning}
        darkMode={darkMode}
        labelText="Invoice Saving Failed!."
        buttonText="OK"
      />

      {/* Close Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.closeButton}
        activeOpacity={0.7}>
        <Image
          source={
            darkMode === 'enable'
              ? IconManager.back_dark
              : IconManager.back_light
          }
          style={styles.backIcon}
        />
      </TouchableOpacity>

      <InvoiceViewShot
        ref={viewShotRef}
        darkMode={darkMode}
        product={product}
        userInfoData={userInfoData}
        addressList={addressList}
      />

      {/* <Animated.View style={{transform: [{scale: buttonScale}]}}>
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.7}
          style={styles.captureButton}>
          {isSaving ? (
            <ActivityIndicator size="small" color={COLOR.White100} />
          ) : (
            <Text style={styles.captureButtonText}>Save Invoice</Text>
          )}
        </TouchableOpacity>
      </Animated.View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginHorizontal: 32,
  },
  safeAreaView: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 16 : 64,
    left: 0,
    zIndex: 10,
    // backgroundColor: COLOR.PrimaryBlue50,
    width: 48,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLOR.White100,
    fontSize: 18,
    fontFamily: FontFamily.PoppinRegular,
  },
  captureButton: {
    padding: 15,
    backgroundColor: COLOR.Primary,
    alignItems: 'center',
    margin: 20,
    borderRadius: 8,
  },
  captureButtonText: {
    color: COLOR.White100,
    fontSize: 16,
    fontFamily: FontFamily.PoppinRegular,
  },
});

export default ProductInvoice;
