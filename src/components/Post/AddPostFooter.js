import React from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import COLOR from '../../constants/COLOR';
import {addPostOptions} from '../../constants/CONSTANT_ARRAY';
import {FontFamily, fontSizes} from '../../constants/FONT';
import PIXEL from '../../constants/PIXEL';

const AddPostFooter = ({
  // snapPointsControl,
  snapPoint,
  setSnapPoint,
  snapPoints,
  handlePostOptions,
  focusOrBlurValue,
  darkMode,
}) => {
  const handleSheetChanges = index => {
    if (index === 0) {
      setSnapPoint(0);
    } else if (index === 1) {
      setSnapPoint(1);
    }
    // } else if (index === 2) {
    //   setSnapPoints(2);
    // }
  };

  return (
    <BottomSheet
      snapPoints={snapPoints}
      handleIndicatorStyle={{backgroundColor: COLOR.Primary, width: '13.5%'}}
      onChange={handleSheetChanges}
      index={snapPoint}
      style={{
        elevation: 10,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: {width: 0, height: -4},
        shadowOpacity: 0.2,
        shadowRadius: 5,
      }}
      backgroundStyle={
        darkMode == 'enable' ? {backgroundColor: COLOR.DarkFadeLight} : ''
      }>
      {snapPoint === 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.footerrow}>
          {addPostOptions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.footerbottom,
                darkMode == 'enable'
                  ? {backgroundColor: COLOR.DarkFadeLight}
                  : {backgroundColor: COLOR.Blue50},
              ]}
              onPress={() => handlePostOptions(item.id)}>
              <View key={index} style={{flexDirection: 'row', gap: 5}}>
                <Image
                  style={styles.optionIcon}
                  source={darkMode == 'enable' ? item.iconDark : item.iconLight}
                  resizeMode="contain"
                />
                <Text
                  style={
                    darkMode == 'enable'
                      ? styles.footertextDark
                      : styles.footertext
                  }>
                  {item.text}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={{padding: 16, rowGap: 16}}>
          {addPostOptions.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handlePostOptions(item.id)}>
              <View key={index} style={{flexDirection: 'row', columnGap: 10}}>
                <Image
                  style={styles.optionIcon}
                  source={darkMode == 'enable' ? item.iconDark : item.iconLight}
                  resizeMode="contain"
                />
                <Text
                  style={
                    darkMode == 'enable'
                      ? styles.footertextDark
                      : styles.footertext
                  }>
                  {item.text}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  optionWrapper: {
    padding: 16,
    flexDirection: 'row', // Make the options layout horizontal
    alignItems: 'center',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 24,
    height: 24,
  },
  optionText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.Grey500,
  },
  footerbottom: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderRadius: 100,
    padding: 10,
    marginHorizontal: 8,
  },
  footerrow: {
    display: 'flex',
    flexDirection: 'row',
  },
  footertext: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: PIXEL.px15,
    color: COLOR.Grey500,
  },
  footertextDark: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: PIXEL.px15,
    color: COLOR.White,
  },
});

export default AddPostFooter;
