import React from 'react';
import { View, Image } from 'react-native';
import assets from '../assets/IconManager'
import CustomAvatar from './CustomAvatar';
import COLOR from '../constants/COLOR';

const BottomCenterBadge = (props) => {
  // Calculate the width and height of the Smaller Image
  const smallerImageWidthHolder = props.largerImageWidth * 0.37; // Adjust the multiplier as needed
  const smallerImageHeightHolder = props.largerImageHeight * 0.37; // Adjust the multiplier as needed

    // Calculate the width and height of the Smaller Image
    const smallerImageWidth = props.largerImageWidth * 0.2; // Adjust the multiplier as needed
    const smallerImageHeight = props.largerImageHeight * 0.2; // Adjust the multiplier as needed

  // Calculate the borderWidth based on the difference in image sizes
  const borderWidthDifference = (props.largerImageWidth - smallerImageWidth) / 37;

  return (
    <View>
      {
        props.iconBadgeEnable
        ?
        <View style={{ position: 'relative', borderWidth: 0, borderRadius: 120, borderColor: 'orange'}}>
          {
                props.src ? 
                  <CustomAvatar onPress={props.onPressLarge} src={props.src} width= {props.largerImageWidth} height= {props.largerImageHeight} borderRadius= {200} /> : 
                props.source ?
                  <CustomAvatar onPress={props.onPressLarge} source={props.source} width= {props.largerImageWidth} height= {props.largerImageHeight} borderRadius= {200} /> :
                  <CustomAvatar onPress={props.onPressLarge} source={assets.logo} width= {props.largerImageWidth} height= {props.largerImageHeight} borderRadius= {200} />
          }
          {
                props.isIconColor ? 
                <View style={{ borderColor: COLOR.Primary, borderWidth: borderWidthDifference, width: smallerImageWidthHolder, height: smallerImageHeightHolder,
                  borderRadius: 100, justifyContent: 'center', alignItems: 'center', position: 'absolute',bottom: -smallerImageHeightHolder * 0.4, left: props.largerImageWidth / 2 - smallerImageWidthHolder / 2, backgroundColor: props.isActive ? COLOR.Primary : COLOR.Grey300 }} />
                :
                <View style={{ borderColor:COLOR.Primary, borderWidth: borderWidthDifference, width: smallerImageWidthHolder, height: smallerImageHeightHolder, backgroundColor:COLOR.Primary,borderRadius: 100, 
                  justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: -smallerImageHeightHolder * 0.4, left: props.largerImageWidth / 2 - smallerImageWidthHolder / 2 }}>
                  <CustomAvatar onPress={props.onPressSmall} source={ props.smallIcon==null ? assets.logo_light : props.smallIcon} width= {smallerImageWidth} height= {smallerImageHeight} />
                </View>
          }
        </View>
        :
        <View style={{ position: 'relative', borderWidth: 0, borderRadius: 120, borderColor: 'orange'}}>
          {
                props.src ? 
                  <CustomAvatar onPress={props.onPressLarge} src={props.src} width= {props.largerImageWidth} height= {props.largerImageHeight} borderRadius= {200} /> : 
                props.source ?
                  <CustomAvatar onPress={props.onPressLarge} source={props.source} width= {props.largerImageWidth} height= {props.largerImageHeight} borderRadius= {200} /> :
                  <CustomAvatar onPress={props.onPressLarge} source={assets.logo_light} width= {props.largerImageWidth} height= {props.largerImageHeight} borderRadius= {200} />
          }
        </View>
      }
    </View>
  );
};

export default BottomCenterBadge;
