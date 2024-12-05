import React, {useRef, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
  ScrollView,
  Text,
  TextInput,
  Image,
  Platform,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import WebView from 'react-native-webview';

import COLOR from '../../../constants/COLOR';
import SPACING from '../../../constants/SPACING';
import i18n from '../../../i18n';
import ActionAppBar from '../../../commonComponent/ActionAppBar';
import IconManager from '../../../assets/IconManager';
import MandatoryTextInput from '../../../components/TextInputBox/MandatoryTextInput';
import ActionButton from '../../../components/Button/ActionButton';
import AppLoading from '../../../commonComponent/Loading';
import {setFetchDarkMode} from '../../../stores/slices/DarkModeSlice';
import {retrieveStringData, storeKeys} from '../../../helper/AsyncStorage';
import {submitAddress, updateAddress} from '../../../helper/ApiModel';
import {use} from 'i18next';
import {FontFamily} from '../../../constants/FONT';
import PIXEL from '../../../constants/PIXEL';
import RADIUS from '../../../constants/RADIUS';
import SizedBox from '../../../commonComponent/SizedBox';
import { makeupdateAddress } from '../../../helper/Market/MarketHelper';

import SuccessedDialogNoAction from '../MarketHelper/success_dialog_no_action';
import WarningDialogNoAction from '../MarketHelper/warning_dialog_no_action';

const EditAddress = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const [isLoading, setIsLoading] = useState(false);
  const [valuesMandatory, setValueMandatory] = useState([]);
  const [darkMode, setDarkMode] = useState(null);
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const textInputRefs = useRef([]);
  const [isFocused, setIsFocused] = useState(false);
  const [address, setAddress] = useState('');
  const addressData = route.params.address;
  const id = addressData.id;

  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isWarnDialogVisible, setWarnDialogVisible] = useState(false);
  const [netError, setNetError] = useState(false);

  const handleShowDialog = () => {
    setDialogVisible(true);
  };

  const handleCloseDialog = () => {
    setDialogVisible(false);
    navigation.pop(1);
  };

  const handleShowDialogWarning = () => {
    setWarnDialogVisible(true);
  };

  const handleCloseDialogWarning = () => {
    setWarnDialogVisible(false);
    // navigation.goBack();
  };

  const handleOpenNetError = () => {
    setNetError(true);
  };

  const handleCloseNetError = () => {
    setNetError(false);
    // navigation.pop(1);
  };

  useEffect(() => {
    const getDarkModeTheme = async () => {
      try {
        const darkModeValue = await retrieveStringData({
          key: storeKeys.darkTheme,
        });
        if (darkModeValue !== null) {
          setDarkMode(darkModeValue);
        }
      } catch (error) {
        console.error('Error retrieving dark mode theme:', error);
      }
    };

    getDarkModeTheme();

    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }

    if (addressData) {
      textInputRefs.current[0]?.setValue(addressData.name);
      textInputRefs.current[1]?.setValue(addressData.phone);
      textInputRefs.current[2]?.setValue(addressData.country);
      textInputRefs.current[3]?.setValue(addressData.city);
      textInputRefs.current[4]?.setValue(addressData.zip);
      setAddress(addressData.address);
    }
  }, [fetchDarkMode, dispatch, addressData]);
  const handleEventLocationChange = text => {
    setAddress(text);
  };
  const getValuesMandatory = () => {
    textInputRefs.current.forEach(ref => {
      const value = ref.getValue();
      if (!value || value.trim() === '') {
        ref.setButtonPressed(true);
      } else {
        ref.setButtonPressed(false);
      }
    });

    const textInputValues = textInputRefs.current.map(ref => ref.getValue());
    return textInputValues;
  };

  const callMakeAction = async () => {
    const mandatoryValues = getValuesMandatory();
    setValueMandatory(mandatoryValues);
    const inputFieldsEmpty = !checkInputAreValid(mandatoryValues);
    if (!inputFieldsEmpty && address !== '') {
      onPressUpdateAddress(mandatoryValues);
    } else {
      setWarnDialogVisible(true);
    }
  };

  const checkInputAreValid = data => {
    return data.every(value => value && value.trim() !== '');
  };

  const onPressUpdateAddress = async mandatoryValues => {
    setIsLoading(true);
    try {
      const data = await makeupdateAddress(
        dispatch,
        id,
        mandatoryValues[0],
        mandatoryValues[1],
        mandatoryValues[2],
        mandatoryValues[3],
        mandatoryValues[4],
        address,
      );
      if (data?.api_status === 200) {
        setIsLoading(false);
        setDialogVisible(true);
      } else {
        setIsLoading(false);
        Alert.alert('Error', 'Failed to update address.');
      }
    } catch (error) {
      setIsLoading(false);
      // Check for specific error types
      if (error.message.includes('Network Error')) {
        // Alert.alert('Network Error', i18n.t('translation:networkError'));
        setNetError(true);
      } else if (error.message.includes('timeout')) {
        // Alert.alert('Timeout Error', i18n.t('translation:timeoutError'));
        setNetError(true);
      } else if (error.response && error.response.status) {
        // Handle specific HTTP status codes
        switch (error.response.status) {
          case 400:
            // Alert.alert('Bad Request', i18n.t('translation:badRequest'));
            setNetError(true);
            break;
          case 401:
            // Alert.alert('Unauthorized', i18n.t('translation:unauthorized'));
            setNetError(true);
            break;
          case 403:
            // Alert.alert('Forbidden', i18n.t('translation:forbidden'));
            setNetError(true);
            break;
          case 404:
            // Alert.alert('Not Found', i18n.t('translation:notFound'));
            setNetError(true);
            break;
          case 500:
            // Alert.alert('Server Error', i18n.t('translation:serverError'));
            setNetError(true);
            break;
          default:
            // Alert.alert('Error', i18n.t('translation:unexpectedError'));
            setNetError(true);
            break;
        }
      } else {
        // Handle general errors
        setNetError(true);
      }

      console.error(error);
    }
  };

  return (
    <SafeAreaView
      style={
        darkMode === 'enable' ? styles.darkSafeAreaView : styles.safeAreaView
      }>
      <ActionAppBar
        appBarText="Edit Address"
        source={IconManager.back_light}
        darkMode={darkMode}
        backpress={() => {
          navigation.goBack();
        }}
      />
      <SuccessedDialogNoAction
        headerLabel="Success!"
        visible={isDialogVisible}
        onButtonPress={handleCloseDialog}
        darkMode={darkMode}
        labelText="Edit Address successful."
        buttonText="OK"
      />
      <WarningDialogNoAction
        headerLabel="Warning!"
        visible={isWarnDialogVisible}
        onButtonPress={handleCloseNetError}
        darkMode={darkMode}
        labelText="Please fill all the required field."
        buttonText="OK"
      />
      <WarningDialogNoAction
        headerLabel="Error!"
        visible={netError}
        onButtonPress={handleCloseNetError}
        darkMode={darkMode}
        labelText="Network Error."
        buttonText="OK"
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: SPACING.sp15,
          paddingTop: SPACING.sp10,
        }}>
        <View style={styles.textInputHolder}>
          <MandatoryTextInput
            ref={ref => (textInputRefs.current[0] = ref)}
            placeholder={i18n.t('translation:placeholderName')}
            darkMode={darkMode}
            prefix
            prefixIcon={IconManager.user_light}
          />
        </View>
        <View style={styles.textInputHolder}>
          <MandatoryTextInput
            ref={ref => (textInputRefs.current[1] = ref)}
            placeholder={i18n.t('translation:placeholderPhone')}
            prefix
            prefixIcon={IconManager.phone_light}
          />
        </View>
        <View style={styles.textInputHolder}>
          <MandatoryTextInput
            ref={ref => (textInputRefs.current[2] = ref)}
            placeholder={i18n.t('translation:placeholderCountry')}
            prefix
            prefixIcon={IconManager.country_light}
          />
        </View>
        <View style={styles.textInputHolder}>
          <MandatoryTextInput
            ref={ref => (textInputRefs.current[3] = ref)}
            placeholder={i18n.t('translation:placeholderCity')}
            prefix
            prefixIcon={IconManager.address_city_light}
          />
        </View>
        <View style={styles.textInputHolder}>
          <MandatoryTextInput
            ref={ref => (textInputRefs.current[4] = ref)}
            placeholder={i18n.t('translation:placeholderPostCode')}
            prefix
            prefixIcon={IconManager.postcode_light}
          />
        </View>

        <View
          style={[
            styles.descriptionContainer,
            {
              borderColor: isFocused
                ? COLOR.Primary
                : darkMode === 'enable'
                ? COLOR.Grey1000
                : COLOR.Grey200,
              backgroundColor:
                darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
              color: darkMode === 'enable' ? COLOR.White : COLOR.Grey500,
            },
          ]}>
          <View style={{paddingTop: PIXEL.px15, marginLeft:SPACING.sp10 }}>
          <Image
            source={
              isFocused
                ? IconManager.location_light
                : IconManager.product_address_light
            }
            resizeMode="contain"
            style={[styles.icon]}
          />
          </View>
          
          <TextInput
            placeholderTextColor={
              darkMode === 'enable' ? COLOR.Grey100 : COLOR.Grey300
            }
            value={address}
            placeholder="Address"
            onChangeText={handleEventLocationChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={[
              styles.textInput,
              {
                paddingVertical:
                  Platform.OS === 'android' ? SPACING.sp12 : SPACING.sp12,
                color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                backgroundColor:
                  darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
              },
            ]}
            multiline={true}
          />
        </View>
        <SizedBox height={3} />
        {address ? (
          <View style={styles.mapContainer}>
            <WebView
              originWhitelist={['*']}
              source={{
                html: `
              <html>
                <body style="margin:0;padding:0;">
                  <iframe width="100%" height="100%" frameborder="0" style="border:0"
                    src="https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(
                      address,
                    )}&key=AIzaSyA99bxTNkibka6lyd2N6oCYVt6maJfsa1E&zoom=18"
                    allowfullscreen>
                  </iframe>
                </body>
              </html>`,
              }}
              style={styles.map}
            />
          </View>
        ) : null}
        <SizedBox height={PIXEL.px10} />
        <View>
          <ActionButton text={'Update'} onPress={callMakeAction} />
        </View>
        <SizedBox height={PIXEL.px20} />
      </ScrollView>
      {isLoading && <AppLoading />}
    </SafeAreaView>
  );
};

export default EditAddress;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: COLOR.White100,
  },
  darkSafeAreaView: {
    flex: 1,
    backgroundColor: COLOR.DarkThemLight,
  },
  textInputHolder: {
    width: '100%',
    paddingVertical: SPACING.sp5,
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align items to the center vertically
    borderWidth: 1,
    borderRadius: 8,
    
    // padding: PIXEL.px10,
    height: PIXEL.px100,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: SPACING.sp5,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
  },
  mapContainer: {
    height: 200,
    marginVertical: SPACING.sp10,
  },
  map: {
    flex: 1,
  },
});
