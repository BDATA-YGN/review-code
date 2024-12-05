import React, {useEffect, useState, useRef} from 'react';
import {View, Text} from 'react-native';
import COLOR from '../../constants/COLOR';
import RADIUS from '../../constants/RADIUS';
import {FontFamily, fontSizes} from '../../constants/FONT';
import IconManager from '../../assets/IconManager';
import IconPic from '../../components/Icon/IconPic';
import ActionButton from '../../components/Button/ActionButton';
import SizedBox from '../../commonComponent/SizedBox';

const SearchEmpty = props => {
  const [loading, setLoading] = useState(false);
  return (
    <View
      style={
        props.darkMode == 'enable'
          ? {
              flex: 1,
              justifyContent: 'space-evenly',
              alignItems: 'center',
              width: '100%',
              backgroundColor: COLOR.DarkTheme,
            }
          : {
              flex: 1,
              justifyContent: 'space-evenly',
              alignItems: 'center',
              width: '100%',
              backgroundColor: COLOR.White100,
            }
      }>
      <View
        style={{alignItems: 'center', justifyContent: 'center', width: '85%'}}>
        <IconPic width={200} height={200} source={IconManager.empty_sad} />
        <SizedBox height={40} />
        <Text
          style={
            props.darkMode == 'enable'
              ? {
                  fontFamily: FontFamily.PoppinSemiBold,
                  fontSize: fontSizes.size23,
                  color: COLOR.White,
                }
              : {
                  fontFamily: FontFamily.PoppinSemiBold,
                  fontSize: fontSizes.size23,
                  color: COLOR.Grey500,
                }
          }>
          Sad no result!
        </Text>
        <SizedBox height={8} />
        <Text
          style={
            props.darkMode == 'enable'
              ? {
                  textAlign: 'center',
                  fontFamily: FontFamily.PoppinRegular,
                  fontSize: fontSizes.size15,
                  color: COLOR.White,
                }
              : {
                  textAlign: 'center',
                  fontFamily: FontFamily.PoppinRegular,
                  fontSize: fontSizes.size15,
                  color: COLOR.Grey500,
                }
          }>
          We cannot find the keyword you are searching form maybe a little
          spelling mistake?
        </Text>
        <SizedBox height={16} />
      </View>
      <View style={{width: '90%'}}>
        <ActionButton text="Search Random" onPress={props.onPress} />
      </View>
    </View>
  );
};

export default SearchEmpty;
