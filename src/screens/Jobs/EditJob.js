import { SafeAreaView, StyleSheet, Text, View ,TouchableOpacity,TextInput,Modal,Image,Alert} from 'react-native'
import React, { useState,useEffect } from 'react'
import COLOR from '../../constants/COLOR'
import { FontFamily } from '../../constants/FONT'
import { fontSizes } from '../../constants/FONT'
import SizedBox from '../../commonComponent/SizedBox'
import PIXEL from '../../constants/PIXEL'
import RADIUS from '../../constants/RADIUS'
import SPACING from '../../constants/SPACING'
import ActionAppBar from '../../commonComponent/ActionAppBar'
import { useNavigation } from '@react-navigation/native'
import IconManager from '../../assets/IconManager'
import IconPic from '../../components/Icon/IconPic'
import { fontWeight } from '../../constants/FONT'
import {
    jobDurationType,
    JobQuestions,
    jobCategories,
    jobType,
  } from '../../constants/CONSTANT_ARRAY';
import AppLoading from '../../commonComponent/Loading'
import ActionButton from '../../components/Button/ActionButton'
import { getCreateJob, getEditJob } from '../../helper/Job/JobModel'
import { editJob, setMyJobList, updateJob } from '../../stores/slices/JobSlice'
import { useDispatch } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler'

const EditJob = ({route}) => {
   
   
  const [title,setTitle] = useState('')
  const {item ,darkMode} = route.params
  const [isLoading,setIsLoading] = useState(false)
  const [location ,setLocation] = useState('')
  const [salaryMinimum, setSalaryMinimum] = useState('');
  const [salaryMaximum, setSalaryMaximum] = useState('');
  const navigation = useNavigation();
  const [period, setPeriod] = useState('');
  const [jobtype, setjobType] = useState('');
  const [jobtypeId, setjobTypeId] = useState('');
  const [category, setCategory] = useState('');
  const [categoryId ,setCategoryId]= useState('');
  const [jobTypeModalVisible, setJobTypeVisible] = useState(false);
  const [categoryModalVisible, setcategoryModalVisible] = useState(false);
  const [durationModalVisible, setDurationModalVisible] = useState(false);
  const [description, setDescription] = useState(false);
  const dispatch = useDispatch();
  
  const id  = item?.job?.id
  useEffect(() => {
    setCategoryId(item?.job?.category);
    if (item) {
      setTitle(item?.job?.title);
      setLocation(item?.job.location)
      setSalaryMinimum(item?.job?.minimum)
      setSalaryMaximum(item?.job?.maximum)
      setPeriod(item?.job?.salary_date)
      setjobType(item?.job?.job_type)
      setDescription(item?.job?.description)
      setCategory(findCategoryNameByIndex(item?.job?.category));
   
    }
  }, [ item]);
  const findCategoryNameByIndex = (id) => {
    const category = jobCategories.find(cat => cat.id === id);
    return category ? category.name : 'Category not found';
  };
  const EditJob = async () => {
    setIsLoading(true);
    try {
      // Prepare form data for questions
      const data = await getEditJob(
        id,
        title,
        location,
        salaryMinimum,
        salaryMaximum,
        period,
        jobtypeId,
        categoryId,
        description,
      );
  
      if (data.api_status === 200) {
        // Success case
        Alert.alert('Success', 'Job Edit Successful', [{ text: 'OK' }], { cancelable: false });
        
        // Dispatch the updated job data to Redux
        dispatch(updateJob({
          id: id, // Use the job ID to locate it in the state
          updatedData: {
            title,
            location,
            salaryMinimum,
            salaryMaximum,
            period,
            jobtypeId,
            categoryId,
            description,
          }
        }));
  
  
        navigation.pop();
      } else {
        // Handle API-specific errors (e.g., validation errors)
        Alert.alert('Error', `Job editing failed: ${data.message || 'Unknown error'}`, [{ text: 'OK' }], { cancelable: false });
        console.error('API Error:', data);
      }
    } catch (error) {
      // Network errors or unexpected issues
      Alert.alert('Error', 'An error occurred while editing the job. Please try again later.', [{ text: 'OK' }], { cancelable: false });
      console.error('Error editing job:', error);
    } finally {
      setIsLoading(false);
    }
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
  return (
    <SafeAreaView style={darkMode == 'enable' ? styles.dsafeAreaView :styles.safeAreaView}>
         <ActionAppBar
        appBarText="Edit Job"
        source={IconManager.back_light}
        backpress={() => navigation.pop()}
        darkMode={darkMode}
      />
        <ScrollView contentContainerStyle={styles.container}>
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
            placeholder="Enter Plan Title"
            style={[
              {
                fontSize: fontSizes.size15,
                color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                flex: 1,
                fontFamily: FontFamily.PoppinRegular,
                paddingVertical : 12
              },
            ]}
            placeholderTextColor={
              darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
            }
            value={title}
            onChangeText={text => setTitle(text)}
          />
        </TouchableOpacity>
        <SizedBox height={PIXEL.px12} />
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
            placeholder="Enter Plan Title"
            style={[
              {
                fontSize: fontSizes.size15,
                color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                flex: 1,
                fontFamily: FontFamily.PoppinRegular,
                paddingVertical : 12
              },
            ]}
            placeholderTextColor={
              darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
            }
            value={location}
            onChangeText={text => setLocation(text)}
          />
        </TouchableOpacity>
        <SizedBox height={PIXEL.px12} />
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={[
              styles.timeCard,
              {
                backgroundColor:
                  darkMode == 'enable' ? COLOR.DarkThemLight : COLOR.White100,
                marginEnd: SPACING.sp10, flex : 0.5
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
                  flex: 1,
                  fontFamily: FontFamily.PoppinRegular,
                  paddingVertical : 12
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
                  darkMode == 'enable' ? COLOR.DarkThemLight : COLOR.White100, flex : 0.5
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
                  flex: 1,
                  fontFamily: FontFamily.PoppinRegular,
                  paddingVertical : 12
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
        <SizedBox height={PIXEL.px12} />
        <TouchableOpacity
            style={[
              styles.timeCard,
              {
                backgroundColor:
                  darkMode == 'enable' ? COLOR.DarkThemLight : COLOR.White100,
          
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
                  paddingVertical : 12
                },
              ]}
              placeholderTextColor={
                darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
              }
           
              value={period}
              onChangeText={text => setPeriod(text)}
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
                  paddingVertical : 12
                },
              ]}
              placeholderTextColor={
                darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
              }
              
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
                },
              ]}
              placeholderTextColor={
                darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
              }
    
              value={category}
              onChangeText={text => setCategory(text)}
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
          style={darkMode == 'enable' ? styles.DnoteCard : styles.noteCard}
          activeOpacity={0.8}>
          <TextInput
            editable={true}
            placeholder="Job Description"
            multiline={true}
            style={[
              {
                fontSize: fontSizes.size15,
                color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                // flex: 1,
                fontFamily: FontFamily.PoppinRegular,
              },
            ]}
            placeholderTextColor={
              darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
            }
            value={description}
            onChangeText={text => setDescription(text)} // Add this line to update the amount state
          />
        </TouchableOpacity>
        <SizedBox height={PIXEL.px20} />
        {isLoading  && <AppLoading />}
        <ActionButton text="Edit Job" onPress={EditJob} />
        </ScrollView>
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
  )
}

export default EditJob

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: COLOR.White100,
      },
      dsafeAreaView: {
        flex: 1,
        backgroundColor: COLOR.DarkTheme,
      },
      container : {
        padding :SPACING.sp20
      },
      timeCard: {
        borderRadius: RADIUS.rd7,
        backgroundColor: COLOR.White,
        borderColor: COLOR.Grey100,
        borderWidth: 1,
        // paddingVertical: SPACING.sp5,
        paddingHorizontal: SPACING.md,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
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
        color: COLOR.Grey300,
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
      noteCard: {
        paddingHorizontal: SPACING.md,
        borderRadius: RADIUS.rd8,
        backgroundColor: COLOR.White100,
        borderWidth: 1,
        borderColor: COLOR.Grey200,
        height : 100
      },
      DnoteCard: {
        paddingHorizontal: SPACING.md,
        borderRadius: RADIUS.rd8,
        backgroundColor: COLOR.DarkThemLight,
        borderWidth: 1,
        borderColor: COLOR.Grey200,
      },
})