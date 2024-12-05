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
import {useNavigation} from '@react-navigation/native';
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
import {submitAddress} from '../../../helper/ApiModel';
import {use} from 'i18next';
import {FontFamily} from '../../../constants/FONT';
import PIXEL from '../../../constants/PIXEL';
import RADIUS from '../../../constants/RADIUS';
import SizedBox from '../../../commonComponent/SizedBox';
import {
  createMyAddress,
  fetchAddress,
} from '../../../helper/Market/MarketHelper';
import SuccessedDialogNoAction from '../MarketHelper/success_dialog_no_action';
import WarningDialogNoAction from '../MarketHelper/warning_dialog_no_action';

const CreateAddress = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [valuesMandatory, setValueMandatory] = useState([]);
  const [darkMode, setDarkMode] = useState(null);
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const textInputRefs = useRef([]);
  const [isFocused, setIsFocused] = useState(false);
  const [address, setAddress] = useState('');

  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isWarning, setWarning] = useState(false);

  const handleShowDialog = () => {
    setDialogVisible(true);
  };

  const handleCloseDialog = () => {
    setDialogVisible(false);
    navigation.goBack();
  };

  const handleWarnOpen = () => {
    setWarning(true);
  };

  const handleWarnClose = () => {
    setWarning(false);
    // navigation.goBack();
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
  }, [fetchDarkMode, dispatch]);

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
    // onPressCreateAddress(mandatoryValues);

    if (!inputFieldsEmpty && address !== '') {
      onPressCreateAddress(mandatoryValues);
    } else {
      setWarning(true);
    }
  };

  const checkInputAreValid = data => {
    return data.every(value => value && value.trim() !== '');
  };

  const onPressCreateAddress = mandatoryValues => {
    createMyAddress(
      dispatch,
      mandatoryValues,
      setIsLoading,
      address,
      handleShowDialog,
    );
  };

  const handleAddressChange = value => {
    setValueMandatory(prevValues => {
      const newValues = [...prevValues];
      newValues[5] = value;
      return newValues;
    });
  };
  return (
    <SafeAreaView
      style={
        darkMode === 'enable' ? styles.darkSafeAreaView : styles.safeAreaView
      }>
      <SuccessedDialogNoAction
        headerLabel="Success!"
        visible={isDialogVisible}
        onButtonPress={handleCloseDialog}
        darkMode={darkMode}
        labelText="Create address successful."
        buttonText="OK"
      />

      <WarningDialogNoAction
        headerLabel="Warning!"
        visible={isWarning}
        onButtonPress={handleWarnClose}
        darkMode={darkMode}
        labelText="Please fill all the require field.."
        buttonText="OK"
      />
      <ActionAppBar
        appBarText="Create Address"
        source={IconManager.back_light}
        darkMode={darkMode}
        backpress={() => {
          navigation.goBack();
        }}
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
            keyboardType="number-pad"
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
          <ActionButton
            text={i18n.t('translation:create')}
            onPress={callMakeAction}
          />
        </View>
        <SizedBox height={PIXEL.px20} />
      </ScrollView>
      {isLoading && <AppLoading />}
    </SafeAreaView>
  );
};

export default CreateAddress;

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
