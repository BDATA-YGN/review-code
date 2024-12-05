import React from 'react';
import {ImageBackground, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import IconManager from '../assets/IconManager';
import SPACING from '../constants/SPACING';
import COLOR from '../constants/COLOR';
import {FontFamily, fontSizes} from '../constants/FONT';

const CommingSoon = props => {
  const navigation = useNavigation();
  const route = useRoute();
  const data = route.params ? route.params.postid : '';
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ImageBackground
        source={IconManager.coming_soon}
        style={{width: '100%', height: '100%'}}
        resizeMode="cover">
        <View style={{flex: 1}} />
        <View
          style={{
            height: '20%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View
              style={{
                backgroundColor: '#11178f',
                paddingVertical: SPACING.sp12,
                paddingHorizontal: SPACING.sp24,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  color: COLOR.White100,
                  fontFamily: FontFamily.PoppinBold,
                  fontSize: fontSizes.size15,
                }}>
                Go Back
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default CommingSoon;
