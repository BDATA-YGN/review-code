import React from 'react';
import {View, Image, Dimensions} from 'react-native';
import IconManager from '../assets/IconManager';
import COLOR from '../constants/COLOR';
import {TouchableOpacity} from 'react-native-gesture-handler';
const CoverVsAvatar = props => {
  //   const { width } = Dimensions.get('window');
  // Calculate the width and height of the Smaller Image
  const smallerImageWidthHolder = props.largerImageWidth * 0.33; // Adjust the multiplier as needed
  const smallerImageHeightHolder = props.largerImageHeight * 0.33; // Adjust the multiplier as needed

  // Calculate the width and height of the Smaller Image
  const smallerImageWidth = props.largerImageWidth * 0.2; // Adjust the multiplier as needed
  const smallerImageHeight = props.largerImageHeight * 0.2; // Adjust the multiplier as needed

  // Calculate the borderWidth based on the difference in image sizes
  const borderWidthDifference =
    (props.largerImageWidth - smallerImageWidth) / 80;

  return (
    <View>
      <View
        style={{position: 'relative', borderWidth: 0, borderColor: 'orange'}}>
        <TouchableOpacity activeOpacity={1} onPress={props.onPressCover}>
          {props.userInfo?.cover ? (
            <Image
              style={{
                width: props.largerImageWidth,
                height: props.largerImageHeight,
                backgroundColor: COLOR.Grey100,
              }}
              src={props.userInfo.cover}
              resizeMode="cover"
            />
          ) : (
            <Image
              style={{
                width: props.largerImageWidth,
                height: props.largerImageHeight,
                backgroundColor: COLOR.Grey100,
              }}
              source={IconManager.default_cover}
              resizeMode="cover"
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={1} onPress={props.onPressAvatar}>
          {props.userInfo?.avatar ? (
            <Image
              style={{
                width: smallerImageWidthHolder,
                height: smallerImageWidthHolder,
                borderColor: 'white',
                borderWidth: borderWidthDifference,
                borderRadius: 55,
                justifyContent: 'center',
                alignItems: 'center',
                // position: 'absolute',
                position: 'relative',
                bottom: -smallerImageHeightHolder * -1,
                left: props.largerImageWidth / 2 - smallerImageWidthHolder / 2,
                backgroundColor: COLOR.Grey100,
              }}
              src={props.userInfo?.avatar}
              resizeMode="contain"
            />
          ) : (
            <Image
              style={{
                width: smallerImageWidthHolder,
                height: smallerImageWidthHolder,
                borderColor: 'white',
                borderWidth: borderWidthDifference,
                borderRadius: 52,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',

                // position: 'absolute',
                bottom: -smallerImageHeightHolder * -1,
                left: props.largerImageWidth / 2 - smallerImageWidthHolder / 2,
                backgroundColor: COLOR.Grey100,
              }}
              source={IconManager.default_user}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CoverVsAvatar;
