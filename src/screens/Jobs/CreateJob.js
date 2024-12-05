import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import COLOR from '../../constants/COLOR';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import IconManager from '../../assets/IconManager';
import SizedBox from '../../commonComponent/SizedBox';
import PIXEL from '../../constants/PIXEL';
import {fontSizes} from '../../constants/FONT';
import {FontFamily} from '../../constants/FONT';
import RADIUS from '../../constants/RADIUS';
import SPACING from '../../constants/SPACING';
import {useNavigation} from '@react-navigation/native';
import {getCurrecyLists} from '../../helper/Monetization/MonetizationModel';
import IconPic from '../../components/Icon/IconPic';
import {fontWeight} from '../../constants/FONT';
import {
  jobDurationType,
  JobQuestions,
  jobCategories,
  jobType,
} from '../../constants/CONSTANT_ARRAY';
import ImagePicker from 'react-native-image-crop-picker';
import { getCreateJob } from '../../helper/Job/JobModel';
import ActionButton from '../../components/Button/ActionButton';
import AppLoading from '../../commonComponent/Loading';

const CreateJob = ({route}) => {
  const {darkMode, cover,id} = route.params;

  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [salaryMinimum, setSalaryMinimum] = useState('');
  const [salaryMaximum, setSalaryMaximum] = useState('');
  const navigation = useNavigation();
  const [currencyLists, setCurrencyLists] = useState([]);
  const [currenyModalVisible, setcurrenyModalVisible] = useState(false);
  const [durationModalVisible, setDurationModalVisible] = useState(false);
  const [currencyId, setCurrencyId] = useState('');
  const [currency, setCurrency] = useState('');
  const [period, setPeriod] = useState('');
  const [multiple, setMultiple] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [jobtype, setjobType] = useState('');
  const [jobtypeId, setjobTypeId] = useState('');
  const [category, setCategory] = useState('');
  const [categoryId ,setCategoryId]= useState('');
  const [jobTypeModalVisible, setJobTypeVisible] = useState(false);
  const [categoryModalVisible, setcategoryModalVisible] = useState(false);
  const [description, setDescription] = useState(false);
  const [coverimg, setCoverImg] = useState('');
  const [isUsingExistingCover, setIsUsingExistingCover] = useState(false); // Track whether to use the existing cover

// Handle image selection from file picker
const handleBrowseUpload = () => {
  ImagePicker.openPicker({
    width: 300,
    height: 300,
    cropping: true, // Enable cropping
  }).then(image => {
    setCoverImg(image.path); // Set the selected image as the cover
    setIsUsingExistingCover(false); // Indicate that we're not using the existing cover
  }).catch(err => {
    console.log('Error picking image: ', err);
  });
};

// Handle choosing the existing cover photo
const handleUseCoverPhoto = () => {
  setCoverImg(''); // Reset the uploaded image
  setIsUsingExistingCover(true); // Indicate that we're using the existing cover
  console.log('Hello')
};
  const handleAddQuestion = () => {
    if (questions.length < 3) {
      setQuestions([
        ...questions,
        {selectedOption: null, isDropdownOpen: false, type: null},
      ]);
    } else {
      Alert.alert('Limit reached', 'You can only add up to 3 questions.');
    }
  };

  const handleOptionSelect = (option, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].selectedOption = option.name;
    updatedQuestions[index].type = option.id; // Store the question type
    updatedQuestions[index].isDropdownOpen = false;
    setQuestions(updatedQuestions);
  };

  const toggleDropdown = index => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].isDropdownOpen =
      !updatedQuestions[index].isDropdownOpen;
    setQuestions(updatedQuestions);
  };

  const handleTextInputChange = (text, index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].textInputValue = text; // Store TextInput value
    setQuestions(updatedQuestions);
  };
  
  const handleMultipleChoiceChange = (text, index) => {
    const newValues = text.split(',').map(item => item.trim()); // Remove the limit to 4 choices
    const updatedQuestions = [...questions];
    updatedQuestions[index].multipleChoices = newValues; // Store all multiple choice options
    setQuestions(updatedQuestions);
  };


  const getCurrencies = async () => {
    setIsLoading(true);
    try {
      const data = await getCurrecyLists();
      if (data.api_status === 200) {
        setCurrencyLists(data);

      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCurrencySelect = (item, index) => {
    console.log('Selected Currency:', item); // Debugging: check selected currency item
    setCurrency(item.currency);
    setCurrencyId(index); // Ensure the correct id is being set
    console.log(setCurrencyId);
    setcurrenyModalVisible(false); // Close the modal after selection
  };
  const handleDurationSelect = item => {
    setPeriod(item.name);

    setDurationModalVisible(false); // Close the modal after selection
  };
  const handleJobTypeSelect = item => {
    setjobType(item.name);
    setjobTypeId(item.id)
    setJobTypeVisible(false); // Close the modal after selection
  };
  const handleCategorySelect = item => {
    setCategory(item.name);
    setCategoryId(item.id);
    setcategoryModalVisible(false); // Close the modal after selection
  };
  const createJob = async () => {
    // Check if all required fields are filled
    if (
      !title ||
      !location ||
      !salaryMinimum ||
      !salaryMaximum ||
      !currency ||
      !period ||
      !jobtypeId ||
      !categoryId ||
      !description ||
      !questions ||
      (!coverimg && !isUsingExistingCover) // At least one cover image should be provided
    ) {
      Alert.alert('Error', 'Please fill in all the required fields.', [{ text: 'OK' }], { cancelable: false });
      return; // Stop execution if validation fails
    }
  
    setIsLoading(true);
    try {
      // Prepare form data for questions
      const data = await getCreateJob(
        id,
        title,
        location,
        salaryMinimum,
        salaryMaximum,
        currency,
        period,
        jobtypeId,
        categoryId,
        description,
        questions,
        coverimg || (isUsingExistingCover ? cover : '')
      );
  
      if (data.api_status === 200) {
        // Success case
        Alert.alert('Success', 'Job Create Successful', [{ text: 'OK' }], { cancelable: false });
        navigation.pop()
      } else {
        // Handle API-specific errors (e.g., validation errors)
        Alert.alert('Error', `Job creation failed: ${errors.error_text || 'Unknown error'}`, [{ text: 'OK' }], { cancelable: false });
        console.error('API Error:', data);
      }
    } catch (error) {
      // Network errors or unexpected issues
      Alert.alert('Error', 'An error occurred while creating the job. Please try again later.', [{ text: 'OK' }], { cancelable: false });
      console.error('Error creating job:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };
  useEffect(() => {
    getCurrencies();
  }, []);
  return (
    <SafeAreaView style={darkMode == 'enable' ? styles.dsafeAreaView :styles.safeAreaView}>
      <ActionAppBar
        appBarText="Create Job"
        source={IconManager.back_light}
        backpress={() => navigation.pop()}
        darkMode={darkMode}
      />
      <ScrollView style={{padding: SPACING.sp15}}>
        <SizedBox height={PIXEL.px8} />
        <TouchableOpacity
          style={[
            styles.timeCard,
            {
              backgroundColor:
                darkMode == 'enable' ? COLOR.DarkThemLight : COLOR.White100,
            },
          ]}>
          <TextInput
            editable={true}
            placeholder="Job Title"
            style={[
              {
                fontSize: fontSizes.size15,
                color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                flex: 1,
                fontFamily: FontFamily.PoppinRegular,
                paddingVertical : 12,
              },
            ]}
            placeholderTextColor={
              darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
            }
            value={title}
            onChangeText={text => setTitle(text)}
          />
        </TouchableOpacity>
        <SizedBox height={PIXEL.px10} />
        <TouchableOpacity
          style={[
            styles.timeCard,
            {
              backgroundColor:
                darkMode == 'enable' ? COLOR.DarkThemLight : COLOR.White100,
            },
          ]}>
          <TextInput
            editable={true}
            placeholder="Location"
            style={[
              {
                fontSize: fontSizes.size15,
                color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                flex: 1,
                fontFamily: FontFamily.PoppinRegular,
                paddingVertical : 12,
              },
            ]}
            placeholderTextColor={
              darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
            }
            value={location}
            onChangeText={text => setLocation(text)}
          />
        </TouchableOpacity>
        <SizedBox height={PIXEL.px10} />
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
           style={[
            styles.timeCard,
            {
              backgroundColor:
                darkMode == 'enable' ? COLOR.DarkThemLight : COLOR.White100,
              flex: 0.5,
              marginEnd: SPACING.sp10,
            },
          ]}>
            <TextInput
              editable={true}
              placeholder="Ks Minimum"
              keyboardType="numeric"
              style={[
                {
                  fontSize: fontSizes.size15,
                  color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                  fontFamily: FontFamily.PoppinRegular,
                  paddingVertical : 12,
                },
              ]}
              placeholderTextColor={
                darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
              }
              value={salaryMinimum}
              onChangeText={text => setSalaryMinimum(text)}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.timeCard,
              {
                backgroundColor:
                  darkMode == 'enable' ? COLOR.DarkThemLight : COLOR.White100,
                flex: 0.5,
              },
            ]}>
            <TextInput
              editable={true}
              placeholder="Ks Maximum"
              keyboardType="numeric"
              style={[
                {
                  fontSize: fontSizes.size15,
                  color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
           
                  fontFamily: FontFamily.PoppinRegular,
                  paddingVertical : 12,
                },
              ]}
              placeholderTextColor={
                darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
              }
              value={salaryMaximum}
              onChangeText={text => setSalaryMaximum(text)}
            />
          </TouchableOpacity>
        </View>
        <SizedBox height={PIXEL.px10} />
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={[
              styles.timeCard,
              {
                backgroundColor:
                  darkMode == 'enable' ? COLOR.DarkThemLight : COLOR.White100,
                flex: 0.5,
                marginEnd: SPACING.sp10,
              },
            ]}
            activeOpacity={0.8}
            onPress={() => setcurrenyModalVisible(true)}>
            <TextInput
              editable={false}
              placeholder="Currency"
              style={[
                {
                  fontSize: fontSizes.size15,
                  color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                  flex: 1,
                  fontFamily: FontFamily.PoppinRegular,
                  paddingVertical : 12,
                },
              ]}
              placeholderTextColor={
                darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
              }
              keyboardType="numeric"
              value={currency}
            />
            <IconPic
              source={
                darkMode == 'enable'
                  ? IconManager.downArrow_dark
                  : IconManager.downArrow_light
              }
              style={{width: 20, height: 20}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.timeCard,
              {
                backgroundColor:
                  darkMode == 'enable' ? COLOR.DarkThemLight : COLOR.White100,
                flex: 0.5,
              },
            ]}
            activeOpacity={0.8}
            onPress={() => setDurationModalVisible(true)}>
            <TextInput
              editable={false}
              placeholder="Duration"
              style={[
                {
                  fontSize: fontSizes.size15,
                  color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                  flex: 1,
                  fontFamily: FontFamily.PoppinRegular,
                  paddingVertical : 12,
                },
              ]}
              placeholderTextColor={
                darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
              }
              keyboardType="numeric"
              value={period}
            />
            <IconPic
              source={
                darkMode == 'enable'
                  ? IconManager.downArrow_dark
                  : IconManager.downArrow_light
              }
              style={{width: 20, height: 20}}
            />
          </TouchableOpacity>
        </View>
        <SizedBox height={PIXEL.px10} />
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={[
              styles.timeCard,
              {
                backgroundColor:
                  darkMode == 'enable' ? COLOR.DarkThemLight : COLOR.White100,
                flex: 0.5,
                marginEnd: SPACING.sp10,
              },
            ]}
            activeOpacity={0.8}
            onPress={() => setJobTypeVisible(true)}>
            <TextInput
              editable={false}
              placeholder="Job Type"
              style={[
                {
                  fontSize: fontSizes.size15,
                  color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                  flex: 1,
                  fontFamily: FontFamily.PoppinRegular,
                  paddingVertical : 12,
                },
              ]}
              placeholderTextColor={
                darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
              }
              keyboardType="numeric"
              value={jobtype}
            />
            <IconPic
              source={
                darkMode == 'enable'
                  ? IconManager.downArrow_dark
                  : IconManager.downArrow_light
              }
              style={{width: 20, height: 20}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.timeCard,
              {
                backgroundColor:
                  darkMode == 'enable' ? COLOR.DarkThemLight : COLOR.White100,
                flex: 0.5,
              },
            ]}
            activeOpacity={0.8}
            onPress={() => setcategoryModalVisible(true)}>
            <TextInput
              editable={false}
              placeholder="Category"
              style={[
                {
                  fontSize: fontSizes.size15,
                  color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                  flex: 1,
                  fontFamily: FontFamily.PoppinRegular,
                  paddingVertical : 12,
                },
              ]}
              placeholderTextColor={
                darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
              }
              keyboardType="numeric"
              value={category}
            />
            <IconPic
              source={
                darkMode == 'enable'
                  ? IconManager.downArrow_dark
                  : IconManager.downArrow_light
              }
              style={{width: 20, height: 20}}
            />
          </TouchableOpacity>
        </View>
        <SizedBox height={PIXEL.px10} />
        <TouchableOpacity
          style={[
            styles.noteCard,
            {
              backgroundColor:
                darkMode == 'enable' ? COLOR.DarkThemLight : COLOR.White100,
            },
          ]}>
          <TextInput
            editable={true}
            placeholder="Job Description"
            style={[
              {
                fontSize: fontSizes.size15,
                color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                flex: 1,
                fontFamily: FontFamily.PoppinRegular,
                paddingVertical : 12,
              },
            ]}
            multiline ={true}
            placeholderTextColor={
              darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
            }
            
            value={description}
            onChangeText={text => setDescription(text)}
          />
        </TouchableOpacity>
        <SizedBox height={PIXEL.px10} />
        <TouchableOpacity
          style={[
            styles.addQuestion,
            {backgroundColor: darkMode === 'enable' ? COLOR.DarkThemLight : 'white'},
          ]}
          onPress={handleAddQuestion} activeOpacity={0.8}>
          <Image source={IconManager.add_question_light} style={{ width: 20 , height :20, marginEnd : SPACING.sp8 }} />
          <Text style={[styles.textGray,{color : darkMode == 'enable' && COLOR.White100}]}>Add Question</Text>
        </TouchableOpacity>
        <SizedBox height={PIXEL.px10} />
        <View>
        {questions.map((question, index) => (
    <View key={index} style={[styles.yesNoQuest,{backgroundColor : darkMode == 'enable' ? COLOR.DarkThemLight : COLOR.White100}]}>
      <View style={{ flexDirection:"row" ,alignItems :'center',justifyContent :'space-between',marginBottom:SPACING.sp10}}>
      <Text style={[styles.questionText,{color : darkMode == 'enable' && COLOR.White100}]}>Question {index + 1}</Text>
      <TouchableOpacity style={styles.closeBtn} activeOpacity={0.8} onPress={() => handleRemoveQuestion(index)}>
          <Image source={IconManager.close_light} style={{ width: 10, height : 10 }} />
      </TouchableOpacity>
      </View>
   

      <TouchableOpacity
        style={[styles.dropdownButton,{backgroundColor : darkMode == 'enable' && COLOR.DarkThemLight} ]}
        onPress={() => toggleDropdown(index)}>
        <Text style={[styles.dropdownButtonText,{color : darkMode == 'enable' && COLOR.White100}]}>
          {question.selectedOption ? question.selectedOption : JobQuestions[0]?.name}
        </Text>
      </TouchableOpacity>

      {question.isDropdownOpen && (
        <View style={[styles.dropdownList,{backgroundColor : darkMode == 'enable' && COLOR.DarkThemLight} ]}>
          <ScrollView>
            {JobQuestions.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.dropdownItem}
                onPress={() => handleOptionSelect(item, index)}>
                <Text style={[styles.dropdownItemText,{color : darkMode =='enable' && COLOR.White100}]}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      <SizedBox height={PIXEL.px8} />

      {/* Conditional rendering based on selected question type */}
      {question.type === 'free_text_question' && (
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Enter your question"
            style={styles.textInput}
            placeholderTextColor={COLOR.Grey300}
            multiline={true}
            value={question.textInputValue || ''} // Bind value to state
            onChangeText={text => handleTextInputChange(text, index)} // Update state
          />
        </View>
      )}

      {question.type === 'yes_no_question' && (
        <View style={styles.inputBox}>
          <TextInput
            placeholder="Enter your question"
            placeholderTextColor={COLOR.Grey300}
            style={styles.textInput}
            multiline={true}
            value={question.textInputValue || ''} // Bind value to state
            onChangeText={text => handleTextInputChange(text, index)} // Update state
          />
        </View>
      )}

      {question.type === 'multiple_choice_question' && (
        <View>
          <View style={styles.inputBox}>
            <TextInput
              placeholder="Enter your question"
              placeholderTextColor={COLOR.Grey300}
              style={styles.textInput}
              multiline = {true}
              value={question.textInputValue || ''} // Bind value to state
              onChangeText={text => handleTextInputChange(text, index)} // Update state
            />
          </View>

          <TextInput
            editable={true}
            placeholder="Enter answers (comma-separated)"
            placeholderTextColor={COLOR.Grey300}
            style={styles.multiTextInput}
            value={question.multipleChoices ? question.multipleChoices.join(', ') : ''}
            onChangeText={text => handleMultipleChoiceChange(text, index)} // Update state
            keyboardType="default"
          />
        </View>
      )}
    </View>
  ))}
        </View>
        <TouchableOpacity style={{ marginBottom: 30 }}>
      <View style={{ position: 'relative' }}>
       
        <Image 
           source={{uri: coverimg || cover}}

          resizeMode='contain'  
          style={{ 
            width: '100%', 
            height: 120, 
            borderRadius: 10 
          }}
        />

        {/* Browse to Upload Button */}
        <TouchableOpacity 
          style={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            backgroundColor: 'rgba(0,0,0,0.6)',
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 5
          }}
          onPress={handleBrowseUpload}
        >
          <Text style={{ color: 'white', fontSize: 12 }}>Browse to Upload</Text>
        </TouchableOpacity>

        {/* Use Cover Photo Button */}
        <TouchableOpacity 
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            backgroundColor: 'rgba(0,0,0,0.6)',
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 5
          }}
          onPress={handleUseCoverPhoto}
        >
          <Text style={{ color: 'white', fontSize: 12 }}>Use Cover Photo</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
    {isLoading  && <AppLoading />}
    <ActionButton text="Create Job" onPress={createJob} />
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={currenyModalVisible}
        onRequestClose={() => setcurrenyModalVisible(false)}>
        <View style={[styles.modalBox]}>
          <View
            style={[
              darkMode == 'enable'
                ? styles.DmodalInnerBox
                : styles.modalInnerBox,
              {width: '80%'},
            ]}>
            <View
              style={{
                width: '100%',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 'auto',
                marginBottom: 'auto',
                alignItems: 'flex-start',
              }}>
              <View style={styles.closeButtonContainer}>
                <Text
                  style={{
                    fontSize: fontSizes.size19,
                    fontWeight: fontWeight.weight600,
                    color:
                      darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                    fontFamily: FontFamily.PoppinSemiBold,
                  }}>
                  Currency
                </Text>
                <TouchableOpacity onPress={() => setcurrenyModalVisible(false)}>
                  <Image
                    source={
                      darkMode == 'enable'
                        ? IconManager.close_dark
                        : IconManager.close_light
                    }
                    style={{width: 20, height: 20}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: '100%',
                  height: 1,
                  marginBottom: 8,
                  marginTop: 8,
                  backgroundColor: 'gray',
                }}></View>
              {currencyLists.data?.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index} // Added key prop to ensure unique identification of each element
                    style={{width: '100%'}}
                    onPress={() => handleCurrencySelect(item, index)}>
                    <Text
                      style={[
                        styles.txt16,
                        darkMode === 'enable'
                          ? styles.txtWhite
                          : styles.txtBlack,
                        styles.paddingAll,
                      ]}>
                      {item.currency}
                      {/* Assuming you want to display the currency type; replace "Female" with {item} */}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <View style={{width: 10, height: 10}}></View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={durationModalVisible}
        onRequestClose={() => setDurationModalVisible(false)}>
        <View style={[styles.modalBox]}>
          <View
            style={[
              darkMode == 'enable'
                ? styles.DmodalInnerBox
                : styles.modalInnerBox,
              {width: '80%'},
            ]}>
            <View
              style={{
                width: '100%',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 'auto',
                marginBottom: 'auto',
                alignItems: 'flex-start',
              }}>
              <View style={styles.closeButtonContainer}>
                <Text
                  style={{
                    fontSize: fontSizes.size19,
                    fontWeight: fontWeight.weight600,
                    color:
                      darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                    fontFamily: FontFamily.PoppinSemiBold,
                  }}>
                  Duration
                </Text>
                <TouchableOpacity
                  onPress={() => setDurationModalVisible(false)}>
                  <Image
                    source={
                      darkMode == 'enable'
                        ? IconManager.close_dark
                        : IconManager.close_light
                    }
                    style={{width: 20, height: 20}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: '100%',
                  height: 1,
                  marginBottom: 8,
                  marginTop: 8,
                  backgroundColor: 'gray',
                }}></View>
              {jobDurationType.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index} // Added key prop to ensure unique identification of each element
                    style={{width: '100%'}}
                    onPress={() => handleDurationSelect(item)}>
                    <Text
                      style={[
                        styles.txt16,
                        darkMode === 'enable'
                          ? styles.txtWhite
                          : styles.txtBlack,
                        styles.paddingAll,
                      ]}>
                      {item.name}
                      {/* Assuming you want to display the currency type; replace "Female" with {item} */}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <View style={{width: 10, height: 10}}></View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={jobTypeModalVisible}
        onRequestClose={() => setJobTypeVisible(false)}>
        <View style={[styles.modalBox]}>
          <View
            style={[
              darkMode == 'enable'
                ? styles.DmodalInnerBox
                : styles.modalInnerBox,
              {width: '80%'},
            ]}>
            <View
              style={{
                width: '100%',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 'auto',
                marginBottom: 'auto',
                alignItems: 'flex-start',
              }}>
              <View style={styles.closeButtonContainer}>
                <Text
                  style={{
                    fontSize: fontSizes.size19,
                    fontWeight: fontWeight.weight600,
                    color:
                      darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                    fontFamily: FontFamily.PoppinSemiBold,
                  }}>
                  JobType
                </Text>
                <TouchableOpacity onPress={() => setJobTypeVisible(false)}>
                  <Image
                    source={
                      darkMode == 'enable'
                        ? IconManager.close_dark
                        : IconManager.close_light
                    }
                    style={{width: 20, height: 20}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: '100%',
                  height: 1,
                  marginBottom: 8,
                  marginTop: 8,
                  backgroundColor: 'gray',
                }}></View>
              {jobType.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index} // Added key prop to ensure unique identification of each element
                    style={{width: '100%'}}
                    onPress={() => handleJobTypeSelect(item)}>
                    <Text
                      style={[
                        styles.txt16,
                        darkMode === 'enable'
                          ? styles.txtWhite
                          : styles.txtBlack,
                        styles.paddingAll,
                      ]}>
                      {item.name}
                      {/* Assuming you want to display the currency type; replace "Female" with {item} */}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <View style={{width: 10, height: 10}}></View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={categoryModalVisible}
        onRequestClose={() => setcategoryModalVisible(false)}>
        <View style={[styles.modalBox]}>
          <View
            style={[
              darkMode == 'enable'
                ? styles.DmodalInnerBox
                : styles.modalInnerBox,
              {width: '80%'},
            ]}>
            <View
              style={{
                width: '100%',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 'auto',
                marginBottom: 'auto',
                alignItems: 'flex-start',
              }}>
              <View style={styles.closeButtonContainer}>
                <Text
                  style={{
                    fontSize: fontSizes.size19,
                    fontWeight: fontWeight.weight600,
                    color:
                      darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                    fontFamily: FontFamily.PoppinSemiBold,
                  }}>
                  Category
                </Text>
                <TouchableOpacity
                  onPress={() => setcategoryModalVisible(false)}>
                  <Image
                    source={
                      darkMode == 'enable'
                        ? IconManager.close_dark
                        : IconManager.close_light
                    }
                    style={{width: 20, height: 20}}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: '100%',
                  height: 1,
                  marginBottom: 8,
                  marginTop: 8,
                  backgroundColor: 'gray',
                }}></View>
              {jobCategories.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index} // Added key prop to ensure unique identification of each element
                    style={{width: '100%'}}
                    onPress={() => handleCategorySelect(item)}>
                    <Text
                      style={[
                        styles.txt16,
                        darkMode === 'enable'
                          ? styles.txtWhite
                          : styles.txtBlack,
                      ]}>
                      {item.name}
                      {/* Assuming you want to display the currency type; replace "Female" with {item} */}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <View style={{width: 10, height: 10}}></View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CreateJob;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: COLOR.White100,
  },
  dsafeAreaView: {
    flex: 1,
    backgroundColor: COLOR.DarkTheme,
  },
  timeCard: {
    borderRadius: RADIUS.rd7,
    borderRadius: RADIUS.rd7,
    backgroundColor: COLOR.White,
    borderColor: COLOR.Grey100,
    borderWidth: 1,
    flex : 1,
    // paddingVertical: SPACING.sp5,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  addQuestion: {
    borderRadius: RADIUS.rd8,
    backgroundColor: COLOR.White,
    borderColor: COLOR.Grey200,
    borderWidth: 1,
    padding: SPACING.md,
    alignItems: 'center',
    flexDirection :"row",
    justifyContent : 'center'
  },
  modalBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalInnerBox: {
    margin: 10,
    backgroundColor: COLOR.White100,
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
  },
  DmodalInnerBox: {
    margin: 10,
    backgroundColor: COLOR.DarkFadeLight,
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
  },
  txt16: {
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
  },
  textGray: {
    color: COLOR.Grey500,
    fontFamily: FontFamily.PoppinRegular,
    fontSize : fontSizes.size15
  },
  fontWeight700: {
    fontWeight: fontWeight.weight700,
  },

  closeButtonContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
  },
  txtBlack: {
    color: COLOR.Grey500,
  },
  txtWhite: {
    color: COLOR.White100,
  },
  paddingAll: {
    paddingVertical: SPACING.sp5,
  },

  yesNoQuest: {
    backgroundColor: COLOR.White100,
    padding: SPACING.sp20,
    width: '100%',
    borderRadius: RADIUS.rd8,
    borderColor : COLOR.Grey200,
    borderWidth : 1,
    marginBottom: SPACING.sp10,
  },
  dropdownButtonText: {
    color: COLOR.Grey300,
    fontSize: 16,
  },
  dropdownList: {
    marginTop: 5,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR.Grey200,
    // Limit the height for large option lists
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: COLOR.Grey200,
  },
  dropdownItemText: {
    fontSize: 16,
    color: COLOR.Grey300,
  },
  dropdownButton: {
    width: '100%',
    height: 50,
    backgroundColor: COLOR.White,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 8,
    borderColor : COLOR.Grey200,
    borderWidth : 1
  },
  textInput: {
    padding: 10,
    fontFamily: FontFamily.PoppinRegular,

    marginVertical: 5,

    color: COLOR.Grey300,
  },
  textBox : {
      paddingVertical : SPACING.sp10,
      height: 100,
      backgroundColor : 'red'
  },
  inputBox: {
    borderColor: COLOR.Grey200,
    borderWidth: 1,
    borderRadius: RADIUS.rd8,
    height: 100,
  },
  multiTextInput: {
    padding: 10,
    fontFamily: FontFamily.PoppinRegular,
    marginVertical: 5,
    color: COLOR.Grey300,
    borderColor: COLOR.Grey200,
    borderWidth: 1,
    borderRadius: RADIUS.rd8,
  },
  noteCard: {
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.rd8,
    backgroundColor: COLOR.White100,
    borderWidth: 1,
    height : 100,
    borderColor: COLOR.Grey200,
  },
  DnoteCard: {
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.rd8,
    backgroundColor: COLOR.DarkThemLight,
    borderWidth: 1,
    borderColor: COLOR.Grey200,
  },
  questionText : {
    fontFamily : FontFamily.PoppinSemiBold,
    fontSize : fontSizes.size16,
    fontWeight : fontWeight.weight600,
    color : COLOR.Grey600,
    
  },
  closeBtn : {
    backgroundColor : COLOR.Grey250,
    width : 20,
    height : 20,
    borderRadius :RADIUS.rd12,
    alignItems :"center",
    justifyContent :"center"
  }
});
