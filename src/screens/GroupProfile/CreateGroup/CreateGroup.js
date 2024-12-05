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
  Pressable,
  Modal,
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
import { URL } from '../../../config';
import SPACING from '../../../constants/SPACING';


const CreateGroup = props => {
  const navigationAppBar = useNavigation();
 ;

  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [groupTitleErrorMessage, setGroupTitleErrorMessage] = useState('');
  const [isUrlFocused, setIsUrlFocused] = useState(false);
  const [groupUrlErrorMessage, setGroupUrlErrorMessage] = useState('');
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [categoryName, setCategory] = useState({ id: '0', category_name: 'Group Category' },);
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const titleInputRef = useRef('');
  const urlInputRef = useRef('');
  const descriptionInputRef = useRef('');

  const handleTitleChange = (text) => {
    titleInputRef.current = text;
  }

  const handleUrlChange = (text) => {
    urlInputRef.current = text;
  }

  const handleDescriptionChange = (text) => {
    descriptionInputRef.current = text;
  }

  const getDarkModeTheme = async () => {
    try {
      const darkModeValue = await retrieveStringData({
        key: storeKeys.darkTheme,
      });
      if (darkModeValue) {
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

  const handleSelectCategory = (selectedItem) => {
    setVisible(false)
    setCategory(selectedItem);
  }



  // const onPressCreate = (group_name, group_title, category, about) => {
  //   setLoading(true);
  //   createNewGroup(group_name, group_title, category, about).then(data => {
  //     if (data.api_status == 200) {
  //       setLoading(false);
  //       dispatch(setFetchGroupList(true));

  //       navigationAppBar.pop();
  //       //
  //     } else if (data.api_status == 400) {
  //       setLoading(false);
  //       handleToast(`${data.errors.error_text}`);
  //       // Toast.showWithGravity(data.errors.error_text, Toast.LONG, Toast.CENTER, { backgroundColor: 'rgb(0, 0, 255)', textColor: COLOR.Primary, });
  //     } else {
  //       setLoading(false);
  //       handleToast(`${i18n.t(`translation:sometingWrong`)}`);
  //       //
  //     }
  //   });
  // };

  const handleCreateGroup = async () => {
    let hasError = false;

    // Reset all error messages
    setGroupTitleErrorMessage('');
    setGroupUrlErrorMessage('');
    setDescriptionErrorMessage('');

    // Validate the title
    if (!titleInputRef.current.trim()) {
      setGroupTitleErrorMessage('Page title is required.');
      hasError = true;
    }

    // Validate the URL
    if (!urlInputRef.current.trim()) {
      setGroupUrlErrorMessage('Page URL is required.');
      hasError = true;
    }

    // Validate the description
    if (!descriptionInputRef.current.trim()) {
      setDescriptionErrorMessage('Your Page description, Between 10 and 200 characters max.');
      hasError = true;
    }

    // Stop the process if there are any validation errors
    if (hasError) {
      setLoading(false);
      return;
    }

    // Proceed to create page if validation passes
    setLoading(true);
    try {
      await createNewGroup(urlInputRef.current, titleInputRef.current, categoryName.id, descriptionInputRef.current)
        .then(data => {
          if (data.api_status === 200) {
            setLoading(false);
            dispatch(setFetchGroupList(true));
            navigationAppBar.goBack();
          } else if (data.api_status === 400) {
            setLoading(false);
            Alert.alert('Error', `${data.errors.error_text}`, [
              {
                text: i18n.t(`translation:OK`),
                onPress: () => {},
              },
            ]);
            // Handle specific error from the API if needed
            console.log(data);
          } else {
            setLoading(false);
            console.log(data);
            
          }
        });
    } catch (error) {
      setLoading(false);
      console.error('Error creating page:', error);
    }
  };


  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White100 },
      ]}
    >
      <ActionAppBar
        appBarText={en.createNewGroup}
        darkMode={darkMode}
        source={IconManager.back_light}
        backpress={navigationAppBar.goBack}
      />

      <ScrollView contentContainerStyle={styles.formContainer}>
        <View>
          <TextInput
            style={[
              styles.textInput,
              {
                borderColor: groupTitleErrorMessage
                  ? COLOR.Danger
                  : isTitleFocused
                    ? COLOR.Primary
                    : darkMode === 'enable'
                      ? COLOR.Grey1000
                      : COLOR.Grey200,
                backgroundColor: darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White,
                color: darkMode === 'enable' ? COLOR.White : COLOR.Grey500,
              },
            ]}
            placeholderTextColor={COLOR.Grey300}
            placeholder="Group Name"
            onChangeText={handleTitleChange}
            onFocus={() => setIsTitleFocused(true)}
            onBlur={() => setIsTitleFocused(false)}
          />
          {groupTitleErrorMessage ? (
            <Text style={styles.errorText}>{groupTitleErrorMessage}</Text>
          ) : null}
        </View>

        <View style={[
          styles.inputContainer,
          {
            borderColor: groupTitleErrorMessage
              ? COLOR.Danger
              : isUrlFocused
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
            placeholderTextColor={COLOR.Grey300}
            placeholder="Group URL"
            onChangeText={handleUrlChange}
            onFocus={() => setIsUrlFocused(true)}
            onBlur={() => setIsUrlFocused(false)}
          />

        </View>
        {groupUrlErrorMessage ? (
          <Text style={styles.errorText}>{groupUrlErrorMessage}</Text>
        ) : null}

        <Pressable onPress={() => setVisible(true)}>
          <TextInput
            style={[
              styles.textInput,
              {
                borderColor: groupTitleErrorMessage
                  ? COLOR.Danger
                  : isTitleFocused
                    ? COLOR.Primary
                    : darkMode === 'enable'
                      ? COLOR.Grey1000
                      : COLOR.Grey200,
                backgroundColor: darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White,
                color: darkMode === 'enable' ? COLOR.White : COLOR.Grey500,
              },
            ]}
            placeholderTextColor={COLOR.Grey300}
            placeholder="Group Category"
            value={categoryName.category_name}
            editable={false}
            pointerEvents="none"  // Ensures the pressable can handle touch events
          />
        </Pressable>

        <View>
          <TextInput
            style={[
              styles.textArea,  // Changed to a textarea style
              {
                borderColor: descriptionErrorMessage
                  ? COLOR.Danger
                  : isDescriptionFocused
                    ? COLOR.Primary
                    : darkMode === 'enable'
                      ? COLOR.Grey1000
                      : COLOR.Grey200,
                backgroundColor: darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White,
                color: darkMode === 'enable' ? COLOR.White : COLOR.Grey500,
              },
            ]}
            multiline
            numberOfLines={4}  // Set initial number of lines
            placeholderTextColor={COLOR.Grey300}
            placeholder="Group Description"
            onChangeText={handleDescriptionChange}
            onFocus={() => setIsDescriptionFocused(true)}
            onBlur={() => setIsDescriptionFocused(false)}
          />
          {/* {descriptionErrorMessage ? (
            <Text style={styles.errorText}>{descriptionErrorMessage}</Text>
          ) : null} */}
        </View>
        <View>
          <Text style={{ fontFamily: FontFamily.PoppinRegular, fontSize: fontSizes.size12, color: COLOR.Grey300 }}>Your group description, Between 10 and 200 characters max.</Text>
        </View>
        <ActionButton text="Create" onPress = {handleCreateGroup}/>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}>
        <TouchableOpacity style={styles.modalContainer} onPress={() => setVisible(false)}>
          <TouchableOpacity activeOpacity={1} style={[styles.modalContent, darkMode == 'enable' ? { backgroundColor: COLOR.DarkThemLight } : { backgroundColor: COLOR.White }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalHeaderText, darkMode == 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500, }]}>Group Category</Text>
              <TouchableOpacity onPress={() => setVisible(false)} style={styles.iconWrapper}>
                <Image source={darkMode == 'enable' ? IconManager.close_dark : IconManager.close_light} style={styles.closeIcon} resizeMode='contain' />
              </TouchableOpacity>
            </View>
            <View style={[styles.modalHeaderBottomBorder, darkMode == 'enable' ? { borderBottomColor: COLOR.White } : { borderBottomColor: COLOR.Grey100 }]} />
            <View style={{ padding: 16, rowGap: 16 }}>
              {categoriesList.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelectCategory(item)}
                >
                  <View key={index} style={styles.itemContent}>
                    <Text style={[styles.itemContentText, darkMode == 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500 }]}>{item.category_name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {loading && <AppLoading />}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderRadius: 15,
    width: '82.31%',
  },
  modalContentText: {
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Grey500
  },
  modalHeader: {
    padding: SPACING.lg,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalHeaderBottomBorder: {
    borderBottomWidth: 1,
  },
  modalHeaderText: {
    fontSize: fontSizes.size19,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  iconWrapper: {
    padding: SPACING.xs,
  },
  closeIcon: {
    width: 16,
    height: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
  itemContent: {
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center'
  },
  itemContentText: {
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
  },
});
export default CreateGroup;
