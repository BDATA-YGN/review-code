// TextInputComponent.js

import React, {useState, forwardRef, useImperativeHandle} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import COLOR from '../../constants/COLOR';
import SPACING from '../../constants/SPACING';
import RADIUS from '../../constants/RADIUS';
import {FontFamily, fontSizes} from '../../constants/FONT';
import IconManager from '../../assets/IconManager';
import PIXEL from '../../constants/PIXEL';
import {storeKeys, retrieveStringData} from '../../helper/AsyncStorage';
import {useSelector, useDispatch} from 'react-redux';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {useEffect} from 'react';

const MandatoryTextInput = ({mandatory = false, ...props}, ref) => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const dispatch = useDispatch();

  const getDarkModeTheme = async () => {
    try {
      const darkModeValue = await retrieveStringData({
        key: storeKeys.darkTheme,
      });
      if (darkModeValue !== null || undefined) {
        setDarkMode(darkModeValue);
      }
    } catch (error) {
      console.error('Error retrieving dark mode theme:', error);
    }
  };
  useEffect(() => {
    getDarkModeTheme();
  }, []);
  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);

  const onChangeText = value => {
    setText(value);
    setIsButtonPressed(false); // Reset button press state when text changes

    // Update border color based on input validity
    const borderColor = value.trim() === '' ? 'red' : 'blue';
    setIsButtonPressed(false);
    setIsFocused(true);
  };

  useImperativeHandle(ref, () => ({
    getValue: () => text,
    setValue: value => setText(value),
    setButtonPressed: pressed => setIsButtonPressed(pressed),
  }));


  const borderColor =
    isButtonPressed && text.trim() === ''
      ? COLOR.Error
      : isFocused
      ? COLOR.Primary
      : darkMode == 'enable' ? COLOR.White : COLOR.Grey1000;

  return (
    <View
      style={[
        darkMode == 'enable' ? styles.Dcontainer : styles.container,
        {borderColor},
      ]}>
      {props.prefix ? (
        <Image
          source={props.prefixIcon ? props.prefixIcon : IconManager.logo_light}
          style={{
            width: PIXEL.px18,
            height: PIXEL.px18,
            marginHorizontal: 4,
                    
          }}
          tintColor={darkMode == 'enable' ? COLOR.White700 : COLOR.Grey500}
          resizeMode="contain"
        />
      ) : null}
      <TextInput
        style={darkMode == 'enable' ? styles.Dinput : styles.input}
        value={text}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={props.placeholder}
        placeholderTextColor={
          darkMode == 'enable' ? COLOR.White700 : COLOR.Grey300
        }
        secureTextEntry={props.secureText}
        multiline={props.multiline}
        // numberOfLines={4}
         keyboardType={props.keyboardType}
        height={props.height ? props.height : 'auto'}
      />
      {props.postfix ? (
        <TouchableOpacity onPress={props.secureTextChange}>
          <Image
            source={
              props.postfixIcon ? props.postfixIcon : IconManager.logo_light
            }
            style={{
              width: 16,
              height: 16,
              marginRight: 4,
             
            }}
            tintColor={darkMode == 'enable' ? COLOR.White700 : COLOR.Grey500}
            resizeMode="contain"
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.White100,
    paddingHorizontal: SPACING.xxxxs,
    borderRadius: RADIUS.xxs,
    marginBottom: SPACING.xs,
    borderWidth: 1,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Dcontainer: {
    backgroundColor: COLOR.DarkTheme,
    paddingHorizontal: SPACING.xxxxs,
    borderRadius: RADIUS.xxs,
    marginBottom: SPACING.xs,
    borderWidth: 1,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkThemecontainer: {
    backgroundColor: COLOR.DarkTheme,
    paddingHorizontal: SPACING.xxxxs,
    borderRadius: RADIUS.xxs,
    marginBottom: SPACING.xs,
    borderWidth: 1,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: fontSizes.size16,
    fontFamily: FontFamily.PoppinRegular,
    paddingVertical: SPACING.sp10,
    color : COLOR.Grey500
  },
  Dinput: {
    flex: 1,
    fontSize: fontSizes.size16,
    fontFamily: FontFamily.PoppinRegular,
    paddingVertical: SPACING.sp10,
    color: COLOR.White100,
  },
});

export default forwardRef(MandatoryTextInput);

