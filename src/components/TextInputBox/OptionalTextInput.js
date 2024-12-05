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
import {useDispatch, useSelector} from 'react-redux';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {storeKeys} from '../../helper/AsyncStorage';
import {useEffect} from 'react';
import {retrieveStringData} from '../../helper/AsyncStorage';

const OptionalTextInput = ({mandatory = false, ...props}, ref) => {
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
    setIsButtonPressed(false);
    setIsFocused(true);
  };

  const setValue = value => {
    setText(value);
  };

  // Expose getValue and setValue methods via ref
  useImperativeHandle(ref, () => ({
    getValue: () => text,
    setValue: setValue,
    setButtonPressed: pressed => {
      setIsButtonPressed(pressed);
    },
  }));

  const borderColor =
    isButtonPressed && text.trim() === ''
      ? COLOR.Grey200
      : isFocused
      ? COLOR.Primary
      : COLOR.Grey200;

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
            width: 16,
            height: 16,
            marginHorizontal: 4,
            tintColor: borderColor,
          }}
          resizeMode="contain"
        />
      ) : null}
      <TextInput
        style={darkMode == 'enable' ? styles.Dinput : styles.input}
        value={text}
        inputMode={props.inputMode && 'numeric'}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={props.placeholder}
        placeholderTextColor={
          darkMode == 'enable' ? COLOR.Grey100 : COLOR.Grey300
        }
        secureTextEntry={props.secureText}
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
              tintColor: borderColor,
            }}
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
    backgroundColor: COLOR.DarkThemLight,
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
    color: COLOR.Grey300,
  },
  Dinput: {
    flex: 1,
    fontSize: fontSizes.size16,
    fontFamily: FontFamily.PoppinRegular,
    paddingVertical: SPACING.sp10,
    color: COLOR.White100,
  },
});

export default forwardRef(OptionalTextInput);
