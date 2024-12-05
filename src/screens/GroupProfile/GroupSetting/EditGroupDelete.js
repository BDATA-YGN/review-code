import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView, StatusBar, StyleSheet, Image, RefreshControl, TextInput, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import COLOR from '../../../constants/COLOR';
import RADIUS from '../../../constants/RADIUS';
import IconManager from '../../../assets/IconManager';
import IconPic from '../../../components/Icon/IconPic';
import { FontFamily, fontSizes } from '../../../constants/FONT';
import CheckBox from '@react-native-community/checkbox';
import ActionAppBar from '../../../commonComponent/ActionAppBar';
import SizedBox from '../../../commonComponent/SizedBox';
import ActionButton from '../../../components/Button/ActionButton';
import { deleteGroup } from '../../../helper/ApiModel';
import AppLoading from '../../../commonComponent/Loading';
import PIXEL from '../../../constants/PIXEL';
import CustomCheckBox from '../../../components/Button/CustomCheckBox';
import { setFetchDarkMode } from '../../../stores/slices/DarkModeSlice';
import { retrieveStringData } from '../../../helper/AsyncStorage';
import { storeKeys } from '../../../helper/AsyncStorage';
import { useSelector } from 'react-redux';
import i18n from '../../../i18n';
const EditGroupDelete = ({ route }) => {
    const { data } = route.params;
    const navigationAppBar = useNavigation();
    const [secureText, setSecureText] = useState(true);
    const [password, setPassword] = useState('');
    const [passwordColor, setPasswordColor] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);
    const [loading, setLoading] = useState(false);

    const [checkbox, setCheckbox] = useState(false);
    const [checkboxBorder, setCheckboxBorder] = useState(false);
    const pressEnableDisable = () => {
        setSecureText(!secureText)
    }
    const [darkMode, setDarkMode] = useState(null);

    const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
    useEffect(() => {
        getDarkModeTheme();
      }, []);
    
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
        if (fetchDarkMode) {
          getDarkModeTheme();
          dispatch(setFetchDarkMode(false));
        }
      }, [fetchDarkMode]);


    const onPressDelete = () => {
        if (password == '') {
            setPasswordColor(true)
        } else {
            if (checkbox) {
                makeDelete(password, data.group_id)
            } else {
                setCheckboxBorder(true)
            }
        }
    }

    const makeDelete = (password, group_id) => {
        setLoading(true)
        deleteGroup(password, group_id).then((data) => {
          
            if (data.api_status == 200) {
                setLoading(false)
                navigationAppBar.pop(3)
            } else {
                setLoading(false)
                Alert.alert('Error', `${data.errors.error_text}`, [
                    {
                      text: i18n.t(`translation:OK`),
                      onPress: () => {},
                    },
                  ]);
            }
        })
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: darkMode =='enable' ? COLOR.DarkTheme : COLOR.White100 }}>
            <ActionAppBar
                appBarText={'Delete Group'}
                source={IconManager.back_light}
                backpress={() => navigationAppBar.goBack()} darkMode={darkMode}
            />
            <SizedBox height={8} />
            <View style={{ width: '100%', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{
                    flexDirection: 'row', width: '90%', height: PIXEL.px50, justifyContent: 'center', alignContent: 'center', alignItems: 'center', backgroundColor: darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
                    borderColor: passwordColor ? 'red' : passwordFocus ? COLOR.Primary : COLOR.Grey100, borderWidth: 1, borderRadius: 8,
                }}>
                    <TextInput
                        style={{ backgroundColor: darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100, borderRadius: 8, width: '89%', paddingLeft: 8, paddingRight: 16, color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300  }}
                        multiline={false}
                        secureTextEntry={secureText}
                        placeholder='Enter Password'
                        placeholderTextColor={darkMode == 'enable' ? COLOR.Grey100 : COLOR.Grey300}
                        onChangeText={(text) => {
                            setPasswordFocus(true)
                            setPassword(text)
                            setPasswordColor(false)
                        }}
                        textInputStyle={{
                            color: COLOR.Grey500, fontFamily: FontFamily.PoppinRegular, width: '100%', backgroundColor: COLOR.White100,
                            fontSize: fontSizes.size14
                        }} />
                    <View style={{ width: '11%', paddingRight: 16 }}>
                        <IconPic source={secureText ? IconManager.secureCloseEye : IconManager.secureOpenEye} />
                    </View>
                </View>
            </View>
            <SizedBox height={8} />
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: '90%', flexDirection: 'row', alignItems: 'center' }}>
                    <CustomCheckBox
                        value={checkbox}
                        onValueChange={() => {
                            setCheckbox(!checkbox);
                            setCheckboxBorder(false);
                        }}
                        tintColorTrue={COLOR.Primary}
                        tintColorFalse={checkboxBorder ? 'red' : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300}
                    />
                    {/* <CheckBox
                        value={checkbox}
                        onValueChange={() => {
                            setCheckbox(!checkbox);
                            setCheckboxBorder(false);
                        }}
                        tintColors={{ true: COLOR.Primary, false: checkboxBorder ? 'red' : COLOR.Grey300 }} /> */}
                    <Text style={darkMode == 'enable' ? styles.DbodyText : styles.bodyText}>Are you sure to delete?</Text>
                </View>
            </View>
            <SizedBox height={8} />
            <View style={{ width: '90%', alignSelf: 'center' }}>
                <ActionButton text='Save' onPress={() => onPressDelete()} />
            </View>
            {loading && <AppLoading />}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    bodyText: {
        fontFamily: FontFamily.PoppinRegular,
        fontSize: fontSizes.size14,
        color: COLOR.Grey500
    },
    DbodyText: {
        fontFamily: FontFamily.PoppinRegular,
        fontSize: fontSizes.size14,
        color: COLOR.White100
    }
});

export default EditGroupDelete;