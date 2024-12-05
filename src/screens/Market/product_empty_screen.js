import React from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import COLOR from '../../constants/COLOR';
import IconManager from '../../assets/IconManager'; // Assuming you have some icons for the button
import {FontFamily, fontSizes} from '../../constants/FONT';
import SPACING from '../../constants/SPACING';

const ProductEmptyScreen = ({darkMode, image, header, body, onReload}) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:
          darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.Grey50,
      }}>
      <Image source={image} style={{width: '30%', height: '30%'}} />
      {/* <Text
        style={[
          styles.textHeader,
          {color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500},
        ]}>
        {header}
      </Text> */}
      <Text
        style={[
          styles.textBody,
          {
            color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
            textAlign: 'center',
            marginHorizontal: 32,
            marginTop: 16,
          },
        ]}>
        {body}
      </Text>
      <TouchableOpacity style={styles.reloadButton} onPress={onReload}>
        <Text style={styles.reloadButtonText}>Reload</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProductEmptyScreen;

const styles = StyleSheet.create({
  textHeader: {
    fontSize: fontSizes.size16,
    fontFamily: FontFamily.PoppinSemiBold,
    marginTop: SPACING.sp8,
  },
  textBody: {
    fontSize: fontSizes.size14,
    fontFamily: FontFamily.PoppinRegular,
    marginTop: SPACING.sp8,
  },
  reloadButton: {
    marginTop: SPACING.sp16,
    paddingVertical: SPACING.sp8,
    paddingHorizontal: SPACING.sp16,
    backgroundColor: COLOR.Primary,
    borderRadius: SPACING.sp4,
  },
  reloadButtonText: {
    color: COLOR.White100,
    fontSize: fontSizes.size14,
    fontFamily: FontFamily.PoppinSemiBold,
  },
});
