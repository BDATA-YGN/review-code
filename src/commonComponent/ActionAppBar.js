/*For App Bar */
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import COLOR from '../constants/COLOR';
import SPACING from '../constants/SPACING';
import {FontFamily, fontSizes} from '../constants/FONT';
import PIXEL from '../constants/PIXEL';
import IconManager from '../assets/IconManager';
import SearchTextInput from '../components/TextInputBox/SearchTextInput';

const ActionAppBar = props => {
  return (
    <View
      style={
        props.darkMode == 'enable'
          ? [
              styles.darkModeContainer,
              props.borderBottom && {borderBottomWidth: 0},
            ]
          : [styles.container, props.borderBottom && {borderBottomWidth: 0}]
      }>
      {props.isSearchVisible ? (
        <View style={[styles.headerContainer, {paddingVertical: 6}]}>
          <TouchableOpacity
            style={[styles.backIconButton, {width: '12%'}]}
            onPress={props.backpress}>
            <Image
              source={
                props.darkMode == 'enable'
                  ? IconManager.back_dark
                  : IconManager.back_light
              }
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={styles.headerTextHolder}>
            <SearchTextInput
              searchText={props.searchText}
              setSearchText={props.setSearchText}
              handleSearch={props.handleSearch}
              handleClearInput={props.handleClearInput}
              darkMode={props.darkMode}
            />
          </View>
          <View style={{width: '5%'}} />
        </View>
      ) : (
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={[styles.backIconButton, {width: '15%'}]}
            onPress={props.backpress}>
            <Image
              source={
                props.darkMode == 'enable'
                  ? IconManager.back_dark
                  : IconManager.back_light
              }
              style={styles.backIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={styles.headerTextHolder}>
            <Text
              style={
                props.darkMode == 'enable'
                  ? styles.darkModeAppBarText
                  : styles.appBarText
              }>
              {props.appBarText}
            </Text>
          </View>

          {props.actionButtonType == 'image-button' ? (
            <View>
              <TouchableOpacity
                onPress={props.actionButtonPress}
                style={styles.actionButtonStyle}>
                <Image
                  source={props.actionButtonImage}
                  style={styles.ImageIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          ) : props.actionButtonType == 'text-button' ? (
            <View>
              {props.isDisable ? (
                <View style={styles.actionButtonStyle}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.actionButtonText,
                      {
                        color:
                          props.darkMode == 'enable'
                            ? COLOR.White900
                            : COLOR.Grey100,
                      },
                    ]}>
                    {props.actionButtonText}
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.actionButtonStyle}
                  onPress={props.actionButtonPress}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.actionButtonText,
                      {
                        color:
                          props.darkMode == 'enable'
                            ? COLOR.White
                            : COLOR.Grey500,
                      },
                    ]}>
                    {props.actionButtonText}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={[styles.actionButtonStyle, {width: '15%'}]} />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  darkModeContainer: {
    backgroundColor: COLOR.DarkTheme,
    borderBottomColor: COLOR.Grey1000,
    borderBottomWidth: 0.3,
  },
  container: {
    backgroundColor: COLOR.White,
    borderBottomColor: COLOR.Grey1000,
    borderBottomWidth: 0.3,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIconButton: {
    padding: 16,
    // backgroundColor : 'green',
  },
  backIcon: {
    width: 9,
    height: 16,
  },
  ImageIcon: {
    width: 24,
    height: 24,
  },
  actionButtonStyle: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    // backgroundColor : 'green',
  },
  actionButtonText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    // color: COLOR.Grey500,
  },
  appBarText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.Grey500,
  },
  darkModeAppBarText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.White,
  },
  headerTextHolder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ActionAppBar;
