import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native'; // Import useNavigation
import IconManager from '../../assets/IconManager';
import COLOR from '../../constants/COLOR';
import SPACING from '../../constants/SPACING';
import {FontFamily} from '../../constants/FONT';

const PWAInstallInstructions = ({route}) => {
  const {darkMode} = route.params;
  const navigation = useNavigation(); // Initialize useNavigation

  const handleClose = () => {
    navigation.goBack(); // Navigate back to the previous screen
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
        },
      ]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        <Text style={styles.headerText}>Install Our App</Text>
        <Text
          style={[
            styles.descriptionText,
            {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500},
          ]}>
          Get quick access, offline capabilities, and an app-like experience by
          adding our app to your home screen.
        </Text>

        {/* Android Instructions */}
        <View style={styles.stepContainer}>
          <Text
            style={[
              styles.stepHeaderText,
              {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500},
            ]}>
            For Android:
          </Text>
          <Text
            style={[
              styles.stepHeaderText,
              {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500},
            ]}>
            1. Open in Chrome
          </Text>
          <Text
            style={[
              styles.stepDescriptionText,
              {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500},
            ]}>
            Open Chrome on your Android device and navigate to our website.
          </Text>
          <Image
            source={IconManager.pwa_instruction_for_android_one}
            style={[styles.image]}
          />
          <Text
            style={[
              styles.stepHeaderText,
              {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500},
            ]}>
            2. Tap the Menu Button
          </Text>
          <Text
            style={[
              styles.stepDescriptionText,
              {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500},
            ]}>
            Tap the three dots in the upper-right corner of the screen.
          </Text>
          <Image
            source={IconManager.pwa_instruction_for_android_second}
            style={styles.image}
          />
          <Text
            style={[
              styles.stepHeaderText,
              {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500},
            ]}>
            3. Select 'Add to Home Screen'
          </Text>
          <Text
            style={[
              styles.stepDescriptionText,
              {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500},
            ]}>
            From the dropdown menu, select 'Add to Home Screen'.
          </Text>
          <Image
            source={IconManager.pwa_instruction_for_android_third}
            style={styles.image}
          />
          <Text
            style={[
              styles.stepHeaderText,
              {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500},
            ]}>
            4. Confirm Installation
          </Text>
          <Text
            style={[
              styles.stepDescriptionText,
              {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500},
            ]}>
            You can rename the app if you want, then tap 'Add'.
          </Text>
          <Image
            source={IconManager.pwa_instruction_for_android_four}
            style={styles.image}
          />
        </View>

        {/* iOS Instructions */}
        <View style={styles.stepContainer}>
          <Text
            style={[
              styles.stepHeaderText,
              {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500},
            ]}>
            For iOS:
          </Text>
          <Text
            style={[
              styles.stepHeaderText,
              {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500},
            ]}>
            1. Open in Safari
          </Text>
          <Text
            style={[
              styles.stepDescriptionText,
              {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500},
            ]}>
            Open Safari on your iOS device and navigate to our website.
          </Text>
          <Image
            source={IconManager.pwa_instruction_for_ios_one}
            style={styles.image}
          />
          <Text
            style={[
              styles.stepHeaderText,
              {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500},
            ]}>
            2. Tap the Share Button
          </Text>
          <Text
            style={[
              styles.stepDescriptionText,
              {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500},
            ]}>
            Tap the share icon at the bottom of the screen.
          </Text>
          <Image
            source={IconManager.pwa_instruction_for_ios_two}
            style={styles.image}
          />
          <Text
            style={[
              styles.stepHeaderText,
              {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500},
            ]}>
            3. Select 'Add to Home Screen'
          </Text>
          <Text
            style={[
              styles.stepDescriptionText,
              {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500},
            ]}>
            Scroll down and select 'Add to Home Screen' from the share sheet.
          </Text>
          <Image
            source={IconManager.pwa_instruction_for_ios_three}
            style={styles.image}
          />
          <Text
            style={[
              styles.stepHeaderText,
              {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500},
            ]}>
            4. Confirm Installation
          </Text>
          <Text
            style={[
              styles.stepDescriptionText,
              {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500},
            ]}>
            You can rename the app if you want, then tap 'Add'.
          </Text>
          <Image
            source={IconManager.pwa_instruction_for_ios_four}
            style={styles.image}
          />
        </View>

        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Got it!</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White100,
    paddingHorizontal: Platform.OS === 'android' ? 16 : 16,
    paddingVertical: Platform.OS === 'android' ? 0 : 48,
  },
  contentContainer: {
    paddingBottom: SPACING.sp32,
  },
  headerText: {
    fontSize: 24,
    fontFamily: FontFamily.PoppinBold,
    color: COLOR.Primary,
    marginBottom: SPACING.sp16,
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Grey500,
    marginBottom: SPACING.sp24,
  },
  stepContainer: {
    marginBottom: SPACING.sp24,
  },
  stepHeaderText: {
    fontSize: 20,
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Secondary,
    marginBottom: SPACING.sp8,
  },
  stepDescriptionText: {
    fontSize: 16,
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Grey500,
    marginBottom: SPACING.sp8,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  closeButton: {
    backgroundColor: COLOR.Primary,
    padding: SPACING.sp12,
    borderRadius: SPACING.sp8,
    alignItems: 'center',
    marginTop: SPACING.sp8,
  },
  closeButtonText: {
    color: COLOR.White100,
    fontSize: 16,
    fontFamily: FontFamily.PoppinBold,
  },
});

export default PWAInstallInstructions;
