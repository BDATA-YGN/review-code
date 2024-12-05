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
import COLOR from '../../../constants/COLOR';
import {FontFamily, fontSizes} from '../../../constants/FONT';
import IconManager from '../../../assets/IconManager';
import i18n from '../../../i18n';
import SizedBox from '../../../commonComponent/SizedBox';
import SelectDropdown from 'react-native-select-dropdown';
import {categoriesList} from '../../../constants/CONSTANT_ARRAY';
import ActionButton from '../../../components/Button/ActionButton';
import AppLoading from '../../../commonComponent/Loading';
import {createNewGroup} from '../../../helper/ApiModel';
import ActionAppBar from '../../../commonComponent/ActionAppBar';
import en from '../../../i18n/en';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import {setFetchDarkMode} from '../../../stores/slices/DarkModeSlice';
import {retrieveStringData, storeKeys} from '../../../helper/AsyncStorage';
import PIXEL from '../../../constants/PIXEL';
import {setFetchGroupList} from '../../../stores/slices/PostSlice';

const CreateGroup = props => {
  const navigationAppBar = useNavigation();
  const [focusOne, setFoucsOne] = useState(false);
  const [focusTwo, setFoucsTwo] = useState(false);
  const [categoryName, setCategory] = useState('Group Category');
  const [description, setDescription] = useState('');
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);

  const [groupColor, setGroupColor] = useState(false);
  const [descriptionColor, setDescriptionColor] = useState(false);

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

  const handleFocusOne = () => {
    setGroupColor(false);
    setFoucsOne(true);
  };

  const handleBlurOne = () => {
    setFoucsOne(false);
  };

  const handleFocusTwo = () => {
    setDescriptionColor(false);
    setFoucsTwo(true);
  };

  const handleBlurTwo = () => {
    setFoucsTwo(false);
  };

  const handleButtonPress = () => {
    if (groupName == '' && description == '') {
      setGroupColor(true);
      setDescriptionColor(true);
    } else {
      onPressCreate(groupName, groupName, categoryName, description);
    }
  };

  const handleToast = message => {
    showToast(message);
  };

  const showToast = msg => {
    Toast.show({
      type: 'success',
      text1: msg,
      visibilityTime: 4000,
      position: 'bottom',
    });
  };

  const onPressCreate = (group_name, group_title, category, about) => {
    setLoading(true);
    createNewGroup(group_name, group_title, category, about).then(data => {
      if (data.api_status == 200) {
        setLoading(false);
        dispatch(setFetchGroupList(true));

        navigationAppBar.pop();
        //
      } else if (data.api_status == 400) {
        setLoading(false);
        handleToast(`${data.errors.error_text}`);
        // Toast.showWithGravity(data.errors.error_text, Toast.LONG, Toast.CENTER, { backgroundColor: 'rgb(0, 0, 255)', textColor: COLOR.Primary, });
      } else {
        setLoading(false);
        handleToast(`${i18n.t(`translation:sometingWrong`)}`);
        //
      }
    });
  };

  const navigateToProfilePage = item => {
    // Handle click on friend item, you can navigate or perform any other action here
    navigationAppBar.pop(1);
    // navigationAppBar.navigate('GroupScreen', { data: item })
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White100,
      }}>
      <ActionAppBar
        appBarText={en.createNewGroup}
        darkMode={darkMode}
        source={IconManager.back_light}
        backpress={() => {
          navigationAppBar.goBack();
        }}
      />
      <SizedBox height={8} />
      <View>
        <View
          style={{
            width: '100%',
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '90%',
              height: PIXEL.px50,
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              backgroundColor:
                darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White100,
              borderColor: groupColor
                ? COLOR.Warning
                : focusOne
                ? COLOR.Primary
                : COLOR.Grey100,
              borderWidth: 1,
              borderRadius: 8,
            }}>
            <TextInput
              style={{
                backgroundColor:
                  darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White100,
                borderRadius: 8,
                width: '100%',
                paddingHorizontal: 16,
              }}
              multiline={false}
              onFocus={handleFocusOne}
              onBlur={handleBlurOne}
              placeholder="Group Name"
              placeholderTextColor={
                darkMode === 'enable' ? COLOR.Grey100 : COLOR.Grey300
              }
              onChangeText={text => {
                setGroupColor(false);
                setGroupName(text);
              }}
              color={darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500}
              textInputStyle={{
                color: COLOR.Grey500,
                fontFamily: FontFamily.PoppinRegular,
                width: '100%',
                backgroundColor: COLOR.White100,
                fontSize: fontSizes.size14,
              }}
            />
          </View>
        </View>
        <SizedBox height={8} />
        <View
          style={{
            width: '100%',
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <SelectDropdown
            data={categoriesList}
            defaultValueByIndex={0}
            showsVerticalScrollIndicator={false}
            selectedRowStyle={{
              borderRadius: 1,
              borderColor: COLOR.Primary,
              borderWidth: 1,
            }}
            // defaultValue={'Egypt'}
            onSelect={(selectedItem, index) => {
              setCategory(selectedItem.id);
            }}
            defaultButtonText={categoryName}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem.category_name;
            }}
            rowTextForSelection={(item, index) => {
              return (
                <Text
                  style={{
                    color:
                      darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
                    fontFamily: FontFamily.PoppinRegular,
                    fontSize: fontSizes.size14,
                  }}>
                  {item.category_name}
                </Text>
              );
            }}
            buttonStyle={{
              width: '90%',
              backgroundColor:
                darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White100,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: COLOR.Grey100,
            }}
            buttonTextStyle={[
              styles.dropdown1BtnTxtStyle,
              {color: darkMode === 'enable' && COLOR.White100},
            ]}
            renderDropdownIcon={isOpened => {
              return (
                <Image
                  resizeMode="contain"
                  style={{width: 15, height: 15, marginRight: 8}}
                  source={IconManager.downArrow_light}
                />
              );
            }}
            dropdownIconPosition={'right'}
            dropdownStyle={[styles.dropdown1DropdownStyle]}
            rowStyle={[
              styles.dropdown1RowStyle,
              {
                backgroundColor: darkMode === 'enable' && COLOR.DarkTheme,
                borderBottomColor: darkMode === 'enable' && COLOR.DarkTheme,
              },
            ]}
            rowTextStyle={[styles.dropdown1RowTxtStyle]}
          />
        </View>
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
              width: '90%',
              justifyContent: 'flex-start',
              alignContent: 'center',
              alignItems: 'center',
              height: 120,
              backgroundColor:
                darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White100,
              borderColor: descriptionColor
                ? 'red'
                : focusTwo
                ? COLOR.Primary
                : COLOR.Grey100,
              borderWidth: 1,
              borderRadius: 8,
            }}>
            <TextInput
              style={{
                backgroundColor:
                  darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White100,
                borderRadius: 8,
                width: '100%',
                paddingHorizontal: 16,
              }}
              multiline={true}
              onFocus={handleFocusTwo}
              onBlur={handleBlurTwo}
              placeholder="Group Description"
              placeholderTextColor={
                darkMode === 'enable' ? COLOR.Grey100 : COLOR.Grey300
              }
              color={darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500}
              onChangeText={text => {
                setDescriptionColor(false);
                setDescription(text);
              }}
              textInputStyle={{
                color: COLOR.Grey500,
                fontFamily: FontFamily.PoppinRegular,
                width: '100%',
                backgroundColor: COLOR.White100,
                fontSize: fontSizes.size14,
              }}
            />
          </View>
        </View>
        <SizedBox height={4} />
        <View style={{width: '90%', alignSelf: 'center'}}>
          <Text
            style={{
              textAlign: 'auto',
              fontFamily: FontFamily.PoppinRegular,
              fontSize: fontSizes.size12,
              color: darkMode === 'enable' ? COLOR.White100 : COLOR.Grey500,
            }}>
            Your group description,between 10 and 200 characters max.
          </Text>
        </View>
        <SizedBox height={8} />
        <View style={{width: '90%', alignSelf: 'center'}}>
          <ActionButton text="Submit" onPress={() => handleButtonPress()} />
        </View>
      </View>
      {loading && <AppLoading />}
      <Toast ref={ref => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dropdown1BtnTxtStyle: {
    color: COLOR.Grey500,
    textAlign: 'left',
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
  },
  dropdown1DropdownStyle: {borderRadius: 4, padding: 8},
  dropdown1RowStyle: {
    backgroundColor: COLOR.White50,
    borderBottomColor: COLOR.White50,
    height: 40,
  },
  dropdown1RowTxtStyle: {color: COLOR.Primary, textAlign: 'left'},
});

export default CreateGroup;
