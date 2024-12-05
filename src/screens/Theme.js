import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AppBar from '../components/AppBar';
import {useNavigation} from '@react-navigation/native';
import COLOR from '../constants/COLOR';
import {fontSizes} from '../constants/FONT';
import {FontFamily} from '../constants/FONT';
import SPACING from '../constants/SPACING';
import RADIUS from '../constants/RADIUS';
import SizedBox from '../commonComponent/SizedBox';
import en from '../i18n/en';
import i18n from '../i18n';
import ActionAppBar from '../commonComponent/ActionAppBar';
import IconManager from '../assets/IconManager';
import { useSelector } from 'react-redux';
import {
  retrieveStringData,
  storeKeys,
  storeStringData,
} from '../helper/AsyncStorage';
import {setFetchDarkMode} from '../stores/slices/DarkModeSlice';
import {useDispatch} from 'react-redux';
const Theme = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState('disable');
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const [darkMode, setDarkMode] = useState(null);
  
  const saveSelectedValue = async value => {
    try {
      storeStringData({
        key: storeKeys.darkTheme,
        data: value.toString(),
      });
    } catch (error) {
      console.error('Error saving selected value:', error);
    }
  };

  const loadSelectedValue = async () => {
    try {
      const value = await retrieveStringData({
        key: storeKeys.darkTheme,
      });

      if (value !== null || undefined) {
        setSelected(value);
      }
    } catch (error) {
      console.error('Error loading selected value:', error);
    }
  };
  useEffect(() => {
    loadSelectedValue();
  }, []);

  useEffect(() => {
    if (fetchDarkMode) {
      loadSelectedValue();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);


  const handleRadioButtonClick = value => {
    setSelected(value);
    saveSelectedValue(value);
    dispatch(setFetchDarkMode(true));
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor:  selected == 'enable' ? COLOR.DarkTheme :  COLOR.White}}>
      <ActionAppBar
        appBarText="Dark mode"
        source={IconManager.back_light}
        backpress={() => {
          navigation.goBack();
        }}
        darkMode = {selected}
      />
      <View style={{paddingHorizontal: SPACING.sp16}}>
        <TouchableOpacity activeOpacity={0.7} style={styles.genralContentStyle}>
          <View style={styles.generalContentHolder}>
            <View style={styles.generalIconAndText}>
              <SizedBox width={SPACING.sm} />
              <Text style={selected == 'enable' ? styles.DcardText : styles.cardText}>
                {i18n.t(`translation:disable`)}
              </Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => handleRadioButtonClick('disable')}>
                {selected == 'disable' ? (
                  <View style={styles.radio1}>
                    <View style={styles.radioBg}></View>
                  </View>
                ) : (
                  <View style={styles.radio2}></View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <SizedBox width={'100%'} height={0.5} color={COLOR.Grey100} />
      <View style={{paddingHorizontal: SPACING.sp16}}>
        <TouchableOpacity activeOpacity={0.7} style={styles.genralContentStyle}>
          <View style={styles.generalContentHolder}>
            <View style={styles.generalIconAndText}>
              <SizedBox width={SPACING.sm} />
              <Text  style={ selected == 'enable' ? styles.DcardText : styles.cardText}>
                {i18n.t(`translation:enable`)}
              </Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => handleRadioButtonClick('enable')}>
                {selected == 'enable' ? (
                  <View style={styles.radio1}>
                    <View style={styles.radioBg}></View>
                  </View>
                ) : (
                  <View style={styles.radio2}></View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <SizedBox width={'100%'} height={0.5} color={COLOR.Grey100} />
    </SafeAreaView>
  );
};

export default Theme;

const styles = StyleSheet.create({
 
  generalContentHolder: {
    flexDirection: 'row',
    paddingVertical: SPACING.sm,
  },
  generalIconAndText: {
    flex: 1,
    flexDirection: 'row',
  },
  genralContentStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.xxxxs,
    marginVertical: SPACING.xxxxs,
  },
  cardText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.Grey500,
  },
  DcardText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.White,
  },
  radio1: {
    width: 20,
    height: 20,
    borderRadius: RADIUS.rd50,
    borderColor: COLOR.Primary,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio2: {
    width: 20,
    height: 20,
    borderRadius: RADIUS.rd50,
    borderColor: COLOR.Grey300,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioBg: {
    width: 12,
    height: 12,
    backgroundColor: COLOR.Primary,
    borderRadius: RADIUS.rd50,
    borderColor: COLOR.Grey300,
  },
});
