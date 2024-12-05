import React, { useRef, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Alert, ScrollView,Text,TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import WebView from 'react-native-webview';

import COLOR from '../constants/COLOR';
import SPACING from '../constants/SPACING';
import i18n from '../i18n';
import ActionAppBar from '../commonComponent/ActionAppBar';
import IconManager from '../assets/IconManager';
import MandatoryTextInput from '../components/TextInputBox/MandatoryTextInput';
import ActionButton from '../components/Button/ActionButton';
import AppLoading from '../commonComponent/Loading';
import { setFetchDarkMode } from '../stores/slices/DarkModeSlice';
import { retrieveStringData, storeKeys } from '../helper/AsyncStorage';
import { submitAddress } from '../helper/ApiModel';
import { use } from 'i18next';
import { FontFamily } from '../constants/FONT';
import PIXEL from '../constants/PIXEL';
import RADIUS from '../constants/RADIUS';
import SizedBox from '../commonComponent/SizedBox';


const CreateAddress = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [valuesMandatory, setValueMandatory] = useState([]);
  const [darkMode, setDarkMode] = useState(null);
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const textInputRefs = useRef([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [address ,setAddress] = useState('');
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

  const handleEventLocationChange = (text) => {
    setAddress(text);
}
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
    if (inputFieldsEmpty && address) {
      Alert.alert(
        'Error',
        i18n.t('translation:fillAllFields'),
        [
          {
            text: i18n.t('translation:OK'),
            onPress: () => {},
          },
        ],
        { cancelable: true }
      );
      return; // Return early if any condition fails
    }
    onPressCreateAddress(mandatoryValues);
  };

  const checkInputAreValid = data => {
    return data.every(value => value && value.trim() !== '');
  };

  const onPressCreateAddress = async mandatoryValues => {
    setIsLoading(true);
    try {
      const data = await submitAddress(
        mandatoryValues[0],
        mandatoryValues[1],
        mandatoryValues[2],
        mandatoryValues[3],
        mandatoryValues[4],
        address,
      );

      if (data.api_status === 200) {
        setIsLoading(false);
        Alert.alert(
          'Success',
          i18n.t('translation:createdAddress'),
          [
            {
              text: i18n.t('translation:OK'),
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Error', `${data.errors.error_text}`, [
          {
            text: i18n.t('translation:OK'),
            onPress: () => {},
          },
        ]);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };
  const handleAddressChange = (value) => {
    setValueMandatory(prevValues => {
      const newValues = [...prevValues];
      newValues[5] = value;
      return newValues;
    });
  };
  return (
    <SafeAreaView style={darkMode === 'enable' ? styles.darkSafeAreaView : styles.safeAreaView}>
      <ActionAppBar
        appBarText="Create Address"
        source={IconManager.back_light}
        backpress={() => {
          navigation.goBack();
        }}
      />
      <ScrollView contentContainerStyle={{ paddingHorizontal: SPACING.sp15, paddingTop: SPACING.sp10 }}>
        <View style={styles.textInputHolder}>
          <MandatoryTextInput
            ref={ref => (textInputRefs.current[0] = ref)}
            placeholder={i18n.t('translation:placeholderName')}
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
          borderColor: isFocused  && text.trim() === ''? COLOR.Primary : (darkMode === 'enable' ? COLOR.Grey1000 : COLOR.Grey200),
          backgroundColor: darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White,
          color: darkMode === 'enable' ? COLOR.White : COLOR.Grey500,
        },
      ]}
    >
      <Image
        source={isFocused ? IconManager.location_light : IconManager.product_address_light}
        resizeMode="contain"
        style={styles.icon}
      />
      <TextInput
        placeholderTextColor={darkMode === 'enable' ? COLOR.White100 : COLOR.Grey300}
        value={address}
        placeholder="Address"
        onChangeText={handleEventLocationChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[
          styles.textInput,
          {
            color: darkMode === 'enable' ? COLOR.White : COLOR.Grey500,
          },
        ]}
      />

    </View>
    {address ? (
        <View style={styles.mapContainer}>
          <WebView
            originWhitelist={['*']}
            source={{
              html: `
              <html>
                <body style="margin:0;padding:0;">
                  <iframe width="100%" height="100%" frameborder="0" style="border:0"
                    src="https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(address)}&key=AIzaSyA99bxTNkibka6lyd2N6oCYVt6maJfsa1E&zoom=18"
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
        <View style={styles.textInputHolder}>
          {isLoading && <AppLoading />}
          <ActionButton
            text={i18n.t('translation:create')}
            onPress={callMakeAction}
          />
        </View>
      </ScrollView>
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
    backgroundColor: COLOR.DarkTheme,
  },
  textInputHolder: {
    width: '100%',
    paddingVertical: SPACING.sp5,
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sp5,
    borderWidth: 1,
    borderRadius: RADIUS.rd10,
    
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
