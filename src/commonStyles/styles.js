import {StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import COLOR from '../constants/COLOR';
import {FontFamily} from '../constants/FONT';
import {fontSizes} from '../constants/FONT';
import RADIUS from '../constants/RADIUS';

export const styles = StyleSheet.create({
  appBarContainer: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  darkModeAppBarContainer: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    backgroundColor: COLOR.DarkThemLight,
    paddingHorizontal: 10,
  },
  HeaderBackButton: {
    width: 20,
    height: 15,
    marginLeft: 10,
  },
  myspaceLogo: {
    marginLeft: 10,
    width: 150,
    height: 50,
  },
  appBarIcon: {
    width: 25,
    height: 25,
  },
  avatar: {
    borderRadius: 100,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  // Register
  registerTextStyle: {
    fontFamily: FontFamily.PoppinBold,
    fontSize: fontSizes.size29,
    color: COLOR.Grey500,
  },
  registerbodyTextStyle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    textAlign: 'center',
    color: COLOR.Grey400,
  },
  registerTextBoxStyle: {
    width: '60%',
    alignItems: 'center',
    position: 'absolute',
    top: '55%',
    // backgroundColor: 'gray'
  },
  registerGreyText: {
    color: COLOR.Grey300,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
  },
  registerLinkText: {
    color: COLOR.Primary,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.md,
  },
  socialIconShape: {
    // backgroundColor : COLOR.Blue50,
    // backgroundColor:"red",
    // width: '15%',
    // height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    marginLeft: 10,
    marginBottom: 5,
  },
  registerUsername: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    width: '90%',
  },
});
