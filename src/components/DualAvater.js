import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import CustomAvatar from './CustomAvatar';
import IconManager from '../assets/IconManager';
import COLOR from '../constants/COLOR';

const DualAvater = props => {
  // Calculate the width and height of the Smaller Image
  const smallerImageWidthHolder = props.largerImageWidth * 0.37; // Adjust the multiplier as needed
  const smallerImageHeightHolder = props.largerImageHeight * 0.37; // Adjust the multiplier as needed

  // Calculate the width and height of the Smaller Image
  const smallerImageWidth = props.largerImageWidth * 0.2; // Adjust the multiplier as needed
  const smallerImageHeight = props.largerImageHeight * 0.2; // Adjust the multiplier as needed

  // Calculate the borderWidth based on the difference in image sizes
  const borderWidthDifference =
    (props.largerImageWidth - smallerImageWidth) / 37;
  const isBorderColor = props.isBorderColor;
  return (
    <View>
      {props.iconBadgeEnable ? (
        <TouchableOpacity
          onPress={props.onPress}
          activeOpacity={0.9}
          style={{
            position: 'relative',
            borderWidth: 0,
            borderRadius: props.largerImageWidth / 2.25,
            borderColor: 'orange',
            backgroundColor: COLOR.Blue100,
          }}>
          {props.src ? (
            <CustomAvatar
              src={props.src}
              onPress={props.onPress}
              width={props.largerImageWidth}
              height={props.largerImageHeight}
              borderRadius={props.largerImageWidth / 2.25}
            />
          ) : props.source ? (
            <CustomAvatar
              source={props.source}
              onPress={props.onPress}
              width={props.largerImageWidth}
              height={props.largerImageHeight}
              borderRadius={props.largerImageWidth / 2.25}
              borderColor={isBorderColor ? 'white' : null}
              borderWidth={isBorderColor ? 1 : null}
            />
          ) : (
            <CustomAvatar
              source={IconManager.logo_light}
              onPress={props.onPress}
              width={props.largerImageWidth}
              height={props.largerImageHeight}
              borderRadius={props.largerImageWidth / 2.25}
              borderColor={isBorderColor ? 'white' : null}
              borderWidth={isBorderColor ? 1 : null}
            />
          )}
          {props.isIconColor ? (
            <View
              style={{
                borderColor: '#FFFFFF',
                borderWidth: borderWidthDifference,
                width: smallerImageWidthHolder,
                height: smallerImageHeightHolder,
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                right: -1,
                top: props.largerImageHeight - smallerImageHeightHolder,
                backgroundColor: props.isActive ? COLOR.Primary : COLOR.Grey300,
              }}
            />
          ) : (
            <View
              style={{
                borderColor: '#FFFFFF',
                borderWidth: borderWidthDifference,
                width: smallerImageWidthHolder,
                height: smallerImageHeightHolder,
                backgroundColor: COLOR.Primary,
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                right: -1,
                top: props.largerImageHeight - smallerImageHeightHolder,
              }}>
              <CustomAvatar
                onPress={props.onPress}
                source={
                  props.smallIcon == null
                    ? IconManager.logo_light
                    : props.smallIcon
                }
                width={smallerImageWidth}
                height={smallerImageHeight}
              />
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={props.onPress}
          style={{
            position: 'relative',
            borderWidth: 0,
            borderRadius: props.largerImageWidth / 2.25,
            borderColor: 'orange',
            backgroundColor: props.backgroundColor
              ? props.backgroundColor
              : COLOR.Blue100,
          }}>
          {props.src ? (
            <CustomAvatar
              src={props.src}
              onPress={props.onPress}
              width={props.largerImageWidth}
              height={props.largerImageHeight}
              borderRadius={props.largerImageWidth / 2.25}
            />
          ) : props.source ? (
            <CustomAvatar
              source={props.source}
              onPress={props.onPress}
              width={props.largerImageWidth}
              height={props.largerImageHeight}
              borderRadius={props.largerImageWidth / 2.25}
            />
          ) : (
            <CustomAvatar
              source={IconManager.logo_light}
              onPress={props.onPress}
              width={props.largerImageWidth}
              height={props.largerImageHeight}
              borderRadius={props.largerImageWidth / 2.25}
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default DualAvater;
