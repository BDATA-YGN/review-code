import { ImageBackground, StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import IconManager from '../../assets/IconManager';
import COLOR from '../../constants/COLOR';
import RADIUS from '../../constants/RADIUS';
import ActionButton from '../Button/ActionButton';
import { FontFamily, fontSizes, fontWeight } from '../../constants/FONT';

const PostMarket = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity style={styles.centeredView}>
        <View style={styles.container}>
          <ImageBackground 
            source={IconManager.notificationBg_light} 
            style={styles.imgStyle}
          >
            <LinearGradient
              colors={[COLOR.White50,'transparent' ]}
              style={styles.gradient}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            >
              <View style={styles.content}>
                <View style={styles.textContainer}>
                  <Text style={styles.text1}>Zara Tote Bag</Text>
                  <Text style={styles.text2}>Bag body size fwfefef</Text>
                </View>
                <View style={styles.buttonContainer}>
                  <ActionButton text="Shop Now" />
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PostMarket;

const styles = StyleSheet.create({
  centeredView: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    height: '80%',
    width: '90%',
    // borderRadius: RADIUS.rd20,
    borderBottomEndRadius:RADIUS.rd10,
    borderBottomStartRadius:RADIUS.rd10,
    overflow: 'hidden', // Ensure child elements don't overflow the container's border radius
  },
  imgStyle: {
    width: '100%',
    height: '100%',
    borderBottomEndRadius:RADIUS.rd10,
    borderBottomStartRadius:RADIUS.rd10,
    overflow: 'hidden', // Ensure the image respects the container's border radius
  },
  gradient: {
    // flex: 1, // Take up all available space within the ImageBackground
    height:'20%',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end', 
    alignItems: 'center', // Center content horizontally
    paddingBottom: '5%', // Add some padding at the bottom for the button
    borderColor:COLOR.White,
    borderWidth:0.25
  },
  content: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '5%', // Add some padding horizontally
  },
  textContainer: {
    flex: 1, // Take up half of the space
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 1, // Take up half of the space
    alignItems: 'flex-end', // Align the button to the right
    justifyContent: 'center',
  },
  text1: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
    fontWeight: fontWeight.weight400,
  },
  text2: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
  },
});
