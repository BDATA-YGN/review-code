// TextInputComponent.js

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Image,
    TouchableOpacity,
    Text,
} from 'react-native';
import COLOR from '../../constants/COLOR';
import SPACING from '../../constants/SPACING';
import RADIUS from '../../constants/RADIUS';
import { FontFamily, fontSizes } from '../../constants/FONT';
import IconManager from '../../assets/IconManager';
import PIXEL from '../../constants/PIXEL';
import { setFetchDarkMode } from '../../stores/slices/DarkModeSlice';
import { useSelector } from 'react-redux';
import { storeKeys,retrieveStringData } from '../../helper/AsyncStorage';
import { useEffect } from 'react';

const LegendFieldMandatory = ({ mandatory = false, ...props }, ref) => {
    const [text, setText] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [isButtonPressed, setIsButtonPressed] = useState(false);
    const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
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

    // Expose getValue method via ref
    useImperativeHandle(ref, () => ({
        getValue: () => {
            return text;
        },
        setButtonPressed: pressed => {
            setIsButtonPressed(pressed);
        },
    }));

    const borderColor =
        isButtonPressed && text.trim() === ''
            ? COLOR.Warning
            : isFocused
                ? COLOR.Primary
                : COLOR.Grey200;

    return (
        <View style={[darkMode == 'enable' ? styles.Dcontainer : styles.container, { borderColor }]}>
            <Text style={[darkMode == 'enable' ? styles.Dlegend :styles.legend]}> {props.legendName} </Text>
            {props.prefix ? (
                <Image
                    source={props.prefixIcon ? props.prefixIcon : IconManager.logo_light}
                    style={{
                        width: PIXEL.px18,
                        height: PIXEL.px18,
                        marginHorizontal: 4,
                        tintColor: borderColor,
                    }}
                    resizeMode="contain"
                />
            ) : null}
            <TextInput
                style={[styles.input,props.legendBoxHeight]}
                value={text}
                onChangeText={onChangeText}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                // placeholder={props.placeholder}
                // placeholderTextColor={COLOR.Grey300}
                secureTextEntry={props.secureText}
                multiline={props.isMultiline}
                color ={darkMode == 'enable' ? COLOR.White : COLOR.Grey500}
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
    fieldSet: {
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLOR.Grey200,
    },
    legend: {
        position: 'absolute',
        top: -10,
        left: 12,
        fontFamily: FontFamily.PoppinSemiBold,
        backgroundColor: COLOR.White100,
        color: COLOR.Grey500,
        fontSize: fontSizes.size15,
    },
    Dlegend: {
        position: 'absolute',
        top: -10,
        left: 12,
        fontFamily: FontFamily.PoppinSemiBold,
        backgroundColor: COLOR.DarkTheme,
        color: COLOR.White100,
        fontSize: fontSizes.size15,
    },
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
    input: {
        flex: 1,
        fontSize: fontSizes.size16,
        fontFamily: FontFamily.PoppinRegular,
        paddingVertical: SPACING.sp10,
     
    },

});

export default forwardRef(LegendFieldMandatory);
