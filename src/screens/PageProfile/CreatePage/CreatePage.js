import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Pressable,
  Modal,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import COLOR from '../../../constants/COLOR';
import ActionButton from '../../../components/Button/ActionButton';
import IconManager from '../../../assets/IconManager';
import ActionAppBar from '../../../commonComponent/ActionAppBar';
import en from '../../../i18n/en';
import { useDispatch, useSelector } from 'react-redux';
import { setFetchDarkMode } from '../../../stores/slices/DarkModeSlice';
import { retrieveStringData, storeKeys } from '../../../helper/AsyncStorage';
import PIXEL from '../../../constants/PIXEL';
import { setErrorPosting } from '../../../stores/slices/AddPostSlice';
import { URL } from '../../../config';
import { categoriesList } from '../../../constants/CONSTANT_ARRAY';
import { FontFamily, fontSizes } from '../../../constants/FONT';
import SPACING from '../../../constants/SPACING';
import { createNewPage } from '../../../helper/ApiModel';
import AppLoading from '../../../commonComponent/Loading';
import { setFetchPageList } from '../../../stores/slices/PostSlice';
import i18n from '../../../i18n';

const CreatePage = () => {

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);

  const [darkMode, setDarkMode] = useState(null);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [pageTitleErrorMessage, setPageTitleErrorMessage] = useState('');
  const [isUrlFocused, setIsUrlFocused] = useState(false);
  const [pageUrlErrorMessage, setPageUrlErrorMessage] = useState('');
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [categoryName, setCategory] = useState({ id: '0', category_name: 'Page Category' },);
  const [loading, setLoading] = useState(false);

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

  // const handleCreatePage = async () => {
  //   setLoading(true);
  //   try {

  //     await createNewPage(urlInputRef.current, titleInputRef.current, categoryName.category_name, descriptionInputRef.current).then(data => {
  //       console.log(data);

  //       if (data.api_status == 200) {
  //         setLoading(false);
  //         dispatch(setFetchPageList(true));
  //         navigation.goBack();
  //       } else if (data.api_status == 400) {
  //         setLoading(false);
  //       } else {
  //         setLoading(false);

  //       }
  //     });
  //   } catch {

  //   }

  // }
  const handleCreatePage = async () => {
    let hasError = false;

    // Reset all error messages
    setPageTitleErrorMessage('');
    setPageUrlErrorMessage('');
    setDescriptionErrorMessage('');

    // Validate the title
    if (!titleInputRef.current.trim()) {
      setPageTitleErrorMessage('Page title is required.');
      hasError = true;
    }

    // Validate the URL
    if (!urlInputRef.current.trim()) {
      setPageUrlErrorMessage('Page URL is required.');
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
      await createNewPage(urlInputRef.current, titleInputRef.current, categoryName.id, descriptionInputRef.current)
        .then(data => {
          if (data.api_status === 200) {
            setLoading(false);
            dispatch(setFetchPageList(true));
            navigation.goBack();
          } else if (data.api_status === 400) {
            Alert.alert('Error', `${data.errors.error_text}`, [
              {
                text: i18n.t(`translation:OK`),
                onPress: () => {},
              },
            ]);
            setLoading(false);
            
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
        appBarText={en.createNewPage}
        darkMode={darkMode}
        source={IconManager.back_light}
        backpress={navigation.goBack}
      />

      <ScrollView contentContainerStyle={styles.formContainer}>
        <View>
          <TextInput
            style={[
              styles.textInput,
              {
                borderColor: pageTitleErrorMessage
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
            placeholder="Page Title"
            onChangeText={handleTitleChange}
            onFocus={() => setIsTitleFocused(true)}
            onBlur={() => setIsTitleFocused(false)}
          />
          {pageTitleErrorMessage ? (
            <Text style={styles.errorText}>{pageTitleErrorMessage}</Text>
          ) : null}
        </View>

        <View style={[
          styles.inputContainer,
          {
            borderColor: pageTitleErrorMessage
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
            placeholder="Page URL"
            onChangeText={handleUrlChange}
            onFocus={() => setIsUrlFocused(true)}
            onBlur={() => setIsUrlFocused(false)}
          />

        </View>
        {pageUrlErrorMessage ? (
          <Text style={styles.errorText}>{pageUrlErrorMessage}</Text>
        ) : null}

        <Pressable onPress={() => setVisible(true)}>
          <TextInput
            style={[
              styles.textInput,
              {
                borderColor: pageTitleErrorMessage
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
            placeholder="Page Category"
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
            placeholder="Page Description"
            onChangeText={handleDescriptionChange}
            onFocus={() => setIsDescriptionFocused(true)}
            onBlur={() => setIsDescriptionFocused(false)}
          />
          {/* {descriptionErrorMessage ? (
            <Text style={styles.errorText}>{descriptionErrorMessage}</Text>
          ) : null} */}
        </View>
        <View>
          <Text style={{ fontFamily: FontFamily.PoppinRegular, fontSize: fontSizes.size12, color: COLOR.Grey300 }}>Your Page description, Between 10 and 200 characters max.</Text>
        </View>
        <ActionButton text="Create" onPress={handleCreatePage} />
      </ScrollView>




      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}>
        <TouchableOpacity style={styles.modalContainer} onPress={() => setVisible(false)}>
          <TouchableOpacity activeOpacity={1} style={[styles.modalContent, darkMode == 'enable' ? { backgroundColor: COLOR.DarkThemLight } : { backgroundColor: COLOR.White }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalHeaderText, darkMode == 'enable' ? { color: COLOR.White } : { color: COLOR.Grey500, }]}>Page Category</Text>
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

export default CreatePage;

