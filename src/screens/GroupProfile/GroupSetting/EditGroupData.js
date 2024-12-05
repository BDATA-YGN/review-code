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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown';
import COLOR from '../../../constants/COLOR';
import IconPic from '../../../components/Icon/IconPic';
import {FontFamily, fontSizes} from '../../../constants/FONT';
import SizedBox from '../../../commonComponent/SizedBox';
import IconManager from '../../../assets/IconManager';
import {categoriesList} from '../../../constants/CONSTANT_ARRAY';
import ActionAppBar from '../../../commonComponent/ActionAppBar';
import {updateGroup} from '../../../helper/ApiModel';
import SPACING from '../../../constants/SPACING';
import PIXEL from '../../../constants/PIXEL';
import {setFetchDarkMode} from '../../../stores/slices/DarkModeSlice';
import {retrieveStringData} from '../../../helper/AsyncStorage';
import {useDispatch, useSelector} from 'react-redux';
import {storeKeys} from '../../../helper/AsyncStorage';
import {setFetchGroupList} from '../../../stores/slices/PostSlice';
import {setGroupInfoData} from '../../../stores/slices/PageSlice';
import { use } from 'i18next';
import { URL } from '../../../config';

const EditGroupData = ({route}) => {
  const {data} = route.params;
  const navigationAppBar = useNavigation();
  const [focusOne, setFoucsOne] = useState(false);
  const [focusTwo, setFoucsTwo] = useState(false);
  const [gunameFocus, setGunameFocus] = useState(false);
  const [categoryName, setCategory] = useState('Group Category');
  const [description, setDescription] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupUsername, setGroupUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const [groupColor, setGroupColor] = useState(false);
  const [groupUrlColor, setGroupUrlColor] = useState(false);
  const [descriptionColor, setDescriptionColor] = useState(false);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [darkMode, setDarkMode] = useState(null);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [groupTitleErrorMessage, setGroupTitleErrorMessage] = useState('');
  const [isUrlFocused, setIsUrlFocused] = useState(false);
  const [groupUrlErrorMessage, setGroupUrlErrorMessage] = useState('');
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  useEffect(() => {
    getDarkModeTheme();
  }, []);
  const dispatch = useDispatch();
  const urlInputRef = useRef('');
  const [url , setUrl] = useState('');
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

  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);

  const handleGunameFocusOne = () => {
    setGroupUrlColor(false);
    setGunameFocus(true);
  };

  const handleGunameBlurOne = () => {
    setGunameFocus(false);
  };

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
  const handleUrlChange = (text) => {
    setUrl(text)
    setGroupUrlColor(false);
  }

    const handleButtonPress = () => {
      if (groupName == '' || url == '' || description == '' || url == '') {
        if (groupName == '') {
          setGroupColor(true);
        }
        if (description == '') {
          setDescriptionColor(true);
        }
        if (url == '') {
          setGroupUrlColor(true);
        }
      } else {
        onPressCreate(
          data.group_id ? data.group_id : 0,
          groupName,
          url,
          categoryName,
          description,
        );
      }
    };

    const onPressCreate = (
      group_id,
      group_title,
      group_name,
      category,
      about,
    ) => {
      setLoading(true);
      updateGroup(group_id, group_title, group_name, category, about).then(
        data => {
          if (data.api_status == 200) {
            setLoading(false);
            dispatch(setGroupInfoData(true));
            dispatch(setFetchGroupList(true));
            navigationAppBar.goBack();
            //
          } else {
            setLoading(false);
            //
          }
        },
      );
    };

  const navigateToProfilePage = item => {
    // Handle click on friend item, you can navigate or perform any other action here
    navigationAppBar.navigate('GroupScreen', {data: item});
  };

  useEffect(() => {
    setGroupName(data.group_title);
    setGroupUsername(data.group_name);
    setDescription(data.about);
    setUrl(data.username)
    const index = categoriesList.findIndex(
      category => category.id === data.category_id,
    );
    setCategoryIndex(index);
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
      }}>
      {/* <CommonAppBar
                appBarText={'Genearl'}
                source={assetsManager.back_back_icon}
                backpress={() => navigationAppBar.goBack()}
                actionButtonType={'text-button'}
                actionButtonPress={() => handleButtonPress()}
                actionButtonText={'Save'}
            /> */}
           <ActionAppBar
        appBarText={'Genearl'}
        source={IconManager.back_light}
        backpress={() => navigationAppBar.goBack()}
        actionButtonType={'text-button'}
        actionButtonPress={handleButtonPress}
        actionButtonText={'Save'}
        darkMode={darkMode}
      />
      <SizedBox height={12} />
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
            height: PIXEL.px45,
            justifyContent: 'flex-start',
            alignContent: 'center',
            alignItems: 'center',
            backgroundColor:
              darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
            borderColor: groupColor
              ? 'red'
              : focusOne
              ? COLOR.Primary
              : darkMode == 'enable'
              ? COLOR.White100
              : COLOR.Grey100,
            borderWidth: 1,
            borderRadius: 8,
          }}>
          <View style={{width: '11%', paddingLeft: 16}}>
            <IconPic
              source={
                darkMode == 'enable'
                  ? IconManager.group_dark
                  : IconManager.group_light
              }
            />
          </View>
          <TextInput
            style={{
              backgroundColor:
                darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
              borderRadius: 8,
              width: '89%',
              paddingLeft: 8,
              paddingRight: 16,
              color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500,
              fontFamily : FontFamily.PoppinRegular
            }}
            multiline={false}
            onFocus={handleFocusOne}
            onBlur={handleBlurOne}
            placeholder="Group Title"
            value={groupName}
            placeholderTextColor={
              darkMode == 'enable' ? COLOR.Grey100 : COLOR.Grey300
            }
            onChangeText={text => {
              setGroupColor(false);
              setGroupName(text);
            }}
            // textInputStyle={{
            //   color: darkMode == 'enable' ? COLOR.White100 : 'red',
            //   fontFamily: FontFamily.PoppinRegular,
            //   width: '100%',
            //   backgroundColor:
            //     darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
            //   fontSize: fontSizes.size14,
            // }}
          />
        </View>
      </View>
      <SizedBox height={8} />
    
      <View style={{
          width: '100%',
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
  <View style={[
          styles.inputContainer,
          {
            borderColor: groupUrlColor
              ? COLOR.Danger
              : gunameFocus
                ? COLOR.Primary
                : darkMode === 'enable'
                  ? COLOR.Grey1000
                  : COLOR.Grey200,
            backgroundColor: darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White,
          }
        ]}>
          {/* URL Display */}
          <TextInput
            style={[
              styles.urlTextUInput,
              {
                color: darkMode === 'enable' ? COLOR.White : COLOR.Grey500
              }
            ]}
            placeholderTextColor={COLOR.Grey300}
            value={URL}
            editable={false}  // Replaced `readOnly` with `editable={false}`
          />

          {/* Divider */}
          <View style={styles.divider} />

          {/* Page Title Input */}
          <TextInput
            style={[
              styles.urlTextUInput,
              {
                color: darkMode === 'enable' ? COLOR.White : COLOR.Grey500
              }
            ]}
            value={url}
            placeholderTextColor={COLOR.Grey300}
            placeholder="Group URL"
            onChangeText={text => {
              setGroupUrlColor(false);
              setUrl(text);
            }}
            onFocus={handleGunameFocusOne}
            onBlur={handleGunameBlurOne}
          />

        </View>
      </View >
        
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
          defaultValueByIndex={categoryIndex}
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
            return (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <IconPic
                  source={
                    darkMode == 'enable'
                      ? IconManager.memories_dark
                      : IconManager.menu_light
                  }
                />
                <Text
                  style={{
                    color:
                      darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500,
                    fontFamily: FontFamily.PoppinRegular,
                    fontSize: fontSizes.size14,
                    paddingLeft: 8,
                  }}>
                  {selectedItem.category_name}
                </Text>
              </View>
            );
          }}
          rowTextForSelection={(item, index) => {
            return (
              <Text
                style={{
                  color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500,
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
              darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: COLOR.Grey100,
          }}
          buttonTextStyle={styles.dropdown1BtnTxtStyle}
          renderDropdownIcon={isOpened => {
            return (
              <Image
                resizeMode="contain"
                style={{width: 15, height: 15, marginRight: 8}}
                source={
                  darkMode == 'enable'
                    ? IconManager.downArrow_dark
                    : IconManager.downArrow_light
                }
              />
            );
          }}
          dropdownIconPosition={'right'}
          dropdownStyle={
            darkMode == 'enable'
              ? styles.Ddropdown1DropdownStyle
              : styles.dropdown1DropdownStyle
          }
          rowStyle={
            darkMode == 'enable'
              ? styles.Ddropdown1RowStyle
              : styles.dropdown1RowStyle
          }
          rowTextStyle={
            darkMode == 'enable'
              ? styles.Ddropdown1RowTxtStyle
              : styles.dropdown1RowTxtStyle
          }
        />
      </View>
      <SizedBox height={8} />
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignContent: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            alignContent: 'center',
            marginHorizontal: 8,
            justifyContent: 'center',
            borderColor: descriptionColor
              ? 'red'
              : focusTwo
              ? COLOR.Primary
              : COLOR.Grey100,
            borderWidth: 1,
            borderRadius: 8,
            backgroundColor:
              darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
          }}>
          <View style={{width: '11%', paddingLeft: 16, paddingTop: 14}}>
            <IconPic
              source={
                darkMode == 'enable'
                  ? IconManager.logout_dark
                  : IconManager.logout_light
              }
            />
          </View>
          <View
            style={{
              width: '89%',
              justifyContent: 'flex-start',
              // alignContent: 'center',
              // alignItems: 'center',
              height: 120,
              backgroundColor:
                darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
              borderWidth: 0,
              borderRadius: 8,
              paddingTop: 10
            }}>

            <TextInput
              style={{
                backgroundColor:
                  darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
                borderRadius: 8,
                width: '100%',
                paddingLeft: 8,
                paddingRight: 16,
                color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500,
                fontFamily: FontFamily.PoppinRegular
              }}
              
              multiline={true}
              onFocus={handleFocusTwo}
              onBlur={handleBlurTwo}
              placeholder="Group Description"
              value={description}
              placeholderTextColor={
                darkMode == 'enable' ? COLOR.Grey100 : COLOR.Grey300
              }
              onChangeText= {handleUrlChange}
              // textInputStyle={{
              //   color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500,
              //   fontFamily: FontFamily.PoppinRegular,
              //   width: '100%',
              //   backgroundColor:
              //     darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
              //   fontSize: fontSizes.size14,
              // }}
            />
          </View>
        </View>
      </View>
      <SizedBox height={4} />
      <View style={{width: '90%', alignSelf: 'center'}}>
        <Text
          style={{
            textAlign: 'auto',
            fontFamily: FontFamily.PoppinRegular,
            fontSize: fontSizes.size12,
            color: COLOR.Grey500,
          }}>
          Your group description,between 10 and 200 characters max.
        </Text>
      </View>
      {/* <SizedBox height={8} />
            <View style={{ width: '90%', alignSelf: 'center' }}>
                <ActionButton backgroundColor={Color.Primary} buttonText='Save' borderRadius={BorderRadius.radius8}
                    height={50} loadingWidth={22} loadingHeight={22}
                    loading={loading} setLoading={setLoading} onPress={() => handleButtonPress()} />
            </View> */}
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
  dropdown1DropdownStyle: {
    borderRadius: 4,
    padding: 8,
    backgroundColor: COLOR.White100,
  },
  Ddropdown1DropdownStyle: {
    borderRadius: 4,
    padding: 8,
    backgroundColor: COLOR.DarkTheme,
  },
  dropdown1RowStyle: {
    backgroundColor: COLOR.White50,
    borderBottomColor: COLOR.White50,
    height: 40,
  },
  Ddropdown1RowStyle: {
    backgroundColor: COLOR.DarkTheme,
    borderBottomColor: COLOR.White50,
    height: 40,
  },
  dropdown1RowTxtStyle: {color: COLOR.Grey500, textAlign: 'left'},
  Ddropdown1RowTxtStyle: {color: COLOR.White100, textAlign: 'left'},
  textInput: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: PIXEL.px15,
    textAlignVertical: 'top',
  },
  combineTextInput: {

  },
  errorText: {
    color: COLOR.Danger,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: 13,
    marginTop: 5,
  },
  formContainer: {
    padding: '5%',
    gap: 8,
  },
  inputContainer: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    width : '90%',
    // alignItems : 'center',
    // justifyContent :'center'
  },
  urlTextUInput: {
    // paddingVertical: 8,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: PIXEL.px15,
  },
  divider: {
    borderColor: COLOR.Grey200,
    borderWidth: 0.3,
    marginVertical: 8,  // Added some spacing for visual separation
  },
  textArea: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: PIXEL.px15,
    textAlignVertical: 'top',  // Ensures text starts at the top
    minHeight: 95,  // Ensures the height looks like a textarea
  },
});

export default EditGroupData;
