import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Image,
  RefreshControl,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import COLOR from '../../../constants/COLOR';
import {FontFamily, fontSizes} from '../../../constants/FONT';
import IconPic from '../../../components/Icon/IconPic';
import IconManager from '../../../assets/IconManager';
import RADIUS from '../../../constants/RADIUS';
import AppLoading from '../../../commonComponent/Loading';
import SizedBox from '../../../commonComponent/SizedBox';
import ActionButton from '../../../components/Button/ActionButton';
import ActionAppBar from '../../../commonComponent/ActionAppBar';
import {deletePage} from '../../../helper/ApiModel';
import PIXEL from '../../../constants/PIXEL';
import CustomCheckBox from '../../../components/Button/CustomCheckBox';
import {storeKeys} from '../../../helper/AsyncStorage';
import {retrieveStringData} from '../../../helper/AsyncStorage';
import {useSelector} from 'react-redux';
import {setFetchDarkMode} from '../../../stores/slices/DarkModeSlice';
import i18n from '../../../i18n';

const EditDeletePage = ({route}) => {
  const {data} = route.params;
  const navigationAppBar = useNavigation();
  const [secureText, setSecureText] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordColor, setPasswordColor] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [loading, setLoading] = useState(false);

  const [checkbox, setCheckbox] = useState(false);
  const [checkboxBorder, setCheckboxBorder] = useState(false);
  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
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
  const pressEnableDisable = () => {
    setSecureText(!secureText);
  };

  const onPressDelete = () => {
    if (password == '') {
      setPasswordColor(true);
    } else {
      if (checkbox) {
        makeDelete(password, data?.page_id);
      } else {
        setCheckboxBorder(true);
      }
    }
  };

  const makeDelete = (password, page_id) => {
    setLoading(true);
    deletePage(password, page_id).then(data => {
      if (data.api_status == 200) {
        setLoading(false);
        navigationAppBar.pop(3);
      } else {
        setLoading(false);
        Alert.alert('Error', `${data.errors.error_text}`, [
          {
            text: i18n.t(`translation:OK`),
            onPress: () => {},
          },
        ]);
      }
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
      }}>
      <ActionAppBar
        appBarText={'Delete Page'}
        source={IconManager.back_light}
        backpress={() => navigationAppBar.goBack()}
        darkMode={darkMode}
      />
      <SizedBox height={8} />
      <View
        style={{
          width: '100%',
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            height: PIXEL.px50,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            backgroundColor:
              darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
            borderColor: passwordColor
              ? 'red'
              : passwordFocus
              ? COLOR.Primary
              : COLOR.Grey100,
            borderWidth: 1,
            borderRadius: 8,
          }}>
          <TextInput
            style={{
              backgroundColor:
                darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
              borderRadius: 8,
              width: '89%',
              paddingLeft: 8,
              paddingRight: 16,
              color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500,
            }}
            multiline={false}
            secureTextEntry={secureText}
            placeholder="Enter Password"
            placeholderTextColor={
              darkMode == 'enable' ? COLOR.Grey100 : COLOR.Grey300
            }
            onChangeText={text => {
              setPasswordFocus(true);
              setPassword(text);
              setPasswordColor(false);
            }}
            textInputStyle={{
              color: COLOR.Grey500,
              fontFamily: FontFamily.PoppinRegular,
              width: '100%',
              backgroundColor: COLOR.White100,
              fontSize: fontSizes.size14,
            }}
          />
          <TouchableOpacity
            style={{width: '11%', paddingRight: 16}}
            onPress={pressEnableDisable}>
            <IconPic
              source={
                secureText
                  ? IconManager.secureCloseEye
                  : IconManager.secureOpenEye
              }
            />
          </TouchableOpacity>
        </View>
      </View>
      <SizedBox height={8} />
      <View
        style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{width: '90%', flexDirection: 'row', alignItems: 'center'}}>
          <CustomCheckBox
            value={checkbox}
            onValueChange={() => {
              setCheckbox(!checkbox);
              setCheckboxBorder(false);
            }}
            tintColorTrue={COLOR.Primary}
            tintColorFalse={
              checkboxBorder
                ? 'red'
                : darkMode == 'enable'
                ? COLOR.White100
                : COLOR.Grey300
            }
          />
          {/* <CheckBox
                        value={checkbox}
                        onValueChange={() => {
                            setCheckbox(!checkbox);
                            setCheckboxBorder(false);
                        }}
                        tintColors={{ true: COLOR.Primary, false: checkboxBorder ? 'red' : COLOR.Grey300 }} /> */}
          <Text
            style={darkMode == 'enable' ? styles.dbodyText : styles.bodyText}>
            Are you sure to delete?
          </Text>
        </View>
      </View>
      <SizedBox height={8} />
      <View style={{width: '90%', alignSelf: 'center'}}>
        <ActionButton text="Delete" onPress={() => onPressDelete()} />
      </View>
      {loading && <AppLoading />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bodyText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.Grey500,
  },
  dbodyText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.White100,
  },
});

export default EditDeletePage;
