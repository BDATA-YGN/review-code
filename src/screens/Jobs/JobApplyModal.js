import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import React from 'react';
import { FontFamily } from '../../constants/FONT';
import { fontSizes } from '../../constants/FONT';
import COLOR from '../../constants/COLOR';
import { useState, useEffect } from 'react';
import { getUserInfoData } from '../../helper/ApiModel';
import RADIUS from '../../constants/RADIUS';
import SPACING from '../../constants/SPACING';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import { useNavigation } from '@react-navigation/native';
import IconManager from '../../assets/IconManager';
import SizedBox from '../../commonComponent/SizedBox';
import PIXEL from '../../constants/PIXEL';
import SelectDropdown from 'react-native-select-dropdown';
import ActionButton from '../../components/Button/ActionButton';
import { applyYears } from '../../constants/CONSTANT_ARRAY';
import CheckBox from '@react-native-community/checkbox';
import { getApplied } from '../../helper/Job/JobModel';
import { Alert } from 'react-native';
import AppLoading from '../../commonComponent/Loading';

const JobApplyModal = ({ route }) => {
  const { darkMode, data } = route.params;
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation();
  const [userInfoData, setUserInfoData] = useState([]);
  const [username, setUsername] = useState('');
  const [last_name, setLastName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [postition, setPosition] = useState('');
  const [workPlace, setWorkPlace] = useState('');
  const [yesNoOption, setyesNoOption] = useState('');
  const [yesNoOptionTwo, setyesNoOptionTwo] = useState('');
  const [yesNoOptionThree, setyesNoOptionThree] = useState('');

  const [selectedOptions, setSelectedOptions] = useState('');
  const [selectedOptionsTwo, setSelectedOptionsTwo] = useState('');
  const [selectedOptionsThree, setSelectedOptionsThree] = useState('');
  const [selectedOptionsId, setSelectedOptionsId] = useState('');
  const [selectedOptionsIdTwo, setSelectedOptionsIdTwo] = useState('');
  const [selectedOptionsIdThree, setSelectedOptionsIdThree] = useState('');
  const [freeTextAnswer, setFreeTextAnswer] = useState('');
  const [freeTextTwo, setfreeTextTwo] = useState('');
  const [freeTextThree, setfreeTextThree] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpenTwo, setIsDropdownOpenTwo] = useState(false);
  const [isDropdownOpenThree, setIsDropdownOpenThree] = useState(false);
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [isCurrentWorkHere, setIsCurrentWorkHere] = useState(false);
  const [description, setDescription] = useState('');
  const [curretStatus, setcurrentStatus] = useState('');
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  const id = data?.id
  const handleCurrentWorkHereToggle = (text) => {
    setIsCurrentWorkHere(!isCurrentWorkHere);
    if (!isCurrentWorkHere) {
      // Clear end year when toggling to "currently work here"
      setEndYear('');
      setcurrentStatus('on')
    }
  };
  //MultiPle choice
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const toggleDropdownTwo = () => {
    setIsDropdownOpenTwo(!isDropdownOpenTwo);
  };
  const toggleDropdownThree = () => {
    setIsDropdownOpenThree(!isDropdownOpenThree);
  };
  const handleOptionSelect = (option, index) => {
    setSelectedOptions(option);
    setSelectedOptionsId(index)
    console.log(selectedOptions);
    console.log(selectedOptionsId)
    setIsDropdownOpen(false);
  };
  useEffect(() => {
    console.log("Selected Option:", selectedOptions);
    console.log("Selected Option ID:", selectedOptionsId);
  }, [selectedOptions, selectedOptionsId]);
  const handleOptionSelectTwo = (option, index) => {
    setSelectedOptionsTwo(option);
    setSelectedOptionsIdTwo(index)
    setIsDropdownOpenTwo(false);
  };
  useEffect(() => {
    console.log("Selected Option Two:", selectedOptionsTwo);
    console.log("Selected Option ID Two:", selectedOptionsIdTwo);
  }, [selectedOptionsTwo, selectedOptionsIdTwo]);
  const handleOptionSelectThree = (option, index) => {
    setSelectedOptionsThree(option);
    setSelectedOptionsIdThree(index)
    console.log(selectedOptionsThree);

    setIsDropdownOpenThree(false);
  };
  useEffect(() => {
    console.log("Selected Option Three:", selectedOptionsThree);
    console.log("Selected Option ID Three:", selectedOptionsIdThree);
  }, [selectedOptionsThree, selectedOptionsIdThree]);

  //YesNO option
  const handleSelection = option => {
    setyesNoOption(option);
  };
  const handleSelectionTwo = option => {
    setyesNoOptionTwo(option);
  };
  const handleSelectionThree = option => {
    setyesNoOptionThree(option);
  };

  const fetchUserInfo = async () => {
    try {
      const userDataResponse = await getUserInfoData();
      setUserInfoData(userDataResponse.user_data);
      setUsername(userDataResponse.user_data.username);
      setPhoneNo(userDataResponse.user_data.phone_number);
      setEmail(userDataResponse.user_data.email);
      setLocation(userDataResponse.user_data.address);
    } catch (error) {
      fetchUserInfo();
    }
  };
  const appliedJob = async () => {
    setIsLoading(true);
    try {
      // Prepare form data for questions
      const data = await getApplied(
        id,
        username,
        phoneNo,
        location,
        email,
        yesNoOption,               // Answer for question one (Yes/No)
        yesNoOptionTwo,            // Answer for question two (Yes/No)
        yesNoOptionThree,          // Answer for question three (Yes/No)
        selectedOptionsId,         // ID for question one multiple-choice answer
        selectedOptionsIdTwo,      // ID for question two multiple-choice answer
        selectedOptionsIdThree,    // ID for question three multiple-choice answer
        freeTextAnswer,            // Free text answer for question one
        freeTextTwo,               // Free text answer for question two
        freeTextThree,             // Free text answer for question three
        description,               // Description (job-specific field)
        startYear,                 // Start year (job-specific field)
        endYear,                   // End year (job-specific field)
        curretStatus,             // Current work status (job-specific field)
        postition,       // Position (job-specific field)
        workPlace
      );
      if (data.api_status === 200) {
        console.log(data.api_status)
        Alert.alert('Success', 'Job Apply SuccessFul', [{ text: 'OK' }], { cancelable: false });
        navigation.pop()
      }
    } catch (error) {
      console.error('Error submitting the application:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <SafeAreaView style={darkMode == 'enable' ? styles.dsafeAreaView : styles.safeAreaView}>
      <ActionAppBar
        appBarText={data?.title}
        source={IconManager.back_light}
        backpress={() => navigation.pop()}
        darkMode={darkMode}
      />
      <ScrollView style={{ padding: SPACING.sp20 }}>
        <Text style={[styles.jobDescription, { color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500 }]}>Your Info</Text>
        <SizedBox height={PIXEL.px8} />
        <TouchableOpacity
          style={[
            styles.timeCard,
            {
              backgroundColor:
                darkMode == 'enable' ? COLOR.DarkThemLight : COLOR.White100,
              borderColor: isDescriptionFocused ? COLOR.Primary : COLOR.Grey300
            },

          ]}>
          <TextInput
            editable={true}
            placeholder="Your Name"
            style={[
              {
                fontSize: fontSizes.size15,
                color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                flex: 1,
                fontFamily: FontFamily.PoppinRegular,
                paddingVertical: 14
              },
            ]}
            placeholderTextColor={
              darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
            }
            onFocus={() => setIsDescriptionFocused(true)}
            value={username}
            onChangeText={text => setUsername(text)}
          />
        </TouchableOpacity>
        <SizedBox height={PIXEL.px15} />
        <TouchableOpacity
          style={[
            styles.timeCard,
            {
              backgroundColor:
                darkMode == 'enable' ? COLOR.DarkThemLight : COLOR.White100,
              borderColor: isDescriptionFocused ? COLOR.Primary : COLOR.Grey300
            },
          ]}>
          <TextInput
            editable={true}
            placeholder="Phone Number"
            style={[
              {
                fontSize: fontSizes.size15,
                color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                flex: 1,
                fontFamily: FontFamily.PoppinRegular,
                paddingVertical: 14
              },
            ]}
            placeholderTextColor={
              darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
            }
            value={phoneNo}
            onChangeText={text => setPhoneNo(text)}
            onFocus={() => setIsDescriptionFocused(true)}
          />
        </TouchableOpacity>
        <SizedBox height={PIXEL.px15} />
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
            placeholder="Email"
            style={[
              {
                fontSize: fontSizes.size15,
                color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                flex: 1,
                fontFamily: FontFamily.PoppinRegular,
                paddingVertical: 14
              },
            ]}
            placeholderTextColor={
              darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
            }
            value={email}
            onChangeText={text => setEmail(text)}
          />
        </TouchableOpacity>
        <SizedBox height={PIXEL.px15} />
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
                paddingVertical: 14
              },
            ]}
            placeholderTextColor={
              darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
            }
            value={location}
            onChangeText={text => setLocation(text)}
          />
        </TouchableOpacity>
        <SizedBox height={PIXEL.px20} />
        <Text style={[styles.jobDescription, { color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500 }]}>Experience</Text>
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
            placeholder="Position"
            style={[
              {
                fontSize: fontSizes.size15,
                color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                flex: 1,
                fontFamily: FontFamily.PoppinRegular,
                paddingVertical: 14
              },
            ]}
            placeholderTextColor={
              darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
            }
            value={postition}
            onChangeText={text => setPosition(text)}
          />
        </TouchableOpacity>
        <SizedBox height={PIXEL.px15} />
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
            placeholder="Where did you work?"
            style={[
              {
                fontSize: fontSizes.size15,
                color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                flex: 1,
                fontFamily: FontFamily.PoppinRegular,
                paddingVertical: 14
              },
            ]}
            placeholderTextColor={
              darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
            }
            value={workPlace}
            onChangeText={text => setWorkPlace(text)}
          />
        </TouchableOpacity>
        <SizedBox height={PIXEL.px15} />

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
        <SizedBox height={PIXEL.px15} />
        <View style={styles.container}>
          <View style={styles.dropdownContainer}>
            <SelectDropdown
              data={applyYears.map(year => year.name)}
              onSelect={selectedItem => setStartYear(selectedItem)}
              defaultValue={startYear}
              defaultButtonText="Year"
              buttonStyle={darkMode === 'enable' ? styles.DdropdownBtn : styles.dropdownBtn}
              buttonTextStyle={darkMode == 'enable' ? styles.dDropdownButtonText2 : styles.dropdownButtonText2}
              dropdownStyle={darkMode == 'enable' ? styles.Ddropdown : styles.dropdown}
              rowStyle={darkMode == 'enable' ? styles.ddropdownRow : styles.dropdownRow}
              rowTextStyle={darkMode == 'enable' ? styles.ddropdownRowText : styles.dropdownRowText}
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={[styles.location, { color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300 }]}>to</Text>
          </View>
          {!isCurrentWorkHere &&
            <View style={styles.dropdownContainer}>
              <SelectDropdown
                data={applyYears.map(year => year.name)}
                onSelect={selectedItem => setEndYear(selectedItem)}
                defaultValue={endYear}
                defaultButtonText="Year"
                buttonStyle={darkMode === 'enable' ? styles.DdropdownBtn : styles.dropdownBtn}
                buttonTextStyle={darkMode == 'enable' ? styles.dDropdownButtonText2 : styles.dropdownButtonText2}
                dropdownStyle={darkMode == 'enable' ? styles.Ddropdown : styles.dropdown}
                rowStyle={darkMode == 'enable' ? styles.ddropdownRow : styles.dropdownRow}
                rowTextStyle={darkMode == 'enable' ? styles.ddropdownRowText : styles.dropdownRowText}
              />
            </View>}

        </View>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={isCurrentWorkHere}
            onValueChange={handleCurrentWorkHereToggle}
            tintColors={{ true: COLOR.Primary, false: COLOR.Grey300 }}
          />
          <Text style={[styles.checkboxLabel, { color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300 }]}>I currently work here</Text>
        </View>
        <SizedBox height={PIXEL.px15} />
        <View style={{ marginBottom: SPACING.sp30 }}>
          {data?.question_one && (
            <>
              {/* Free Text Question */}
              {data?.question_one_type === 'free_text_question' && (
                <View style={styles.yesNoQuest}>
                  <Text style={styles.location}>{data?.question_one}</Text>

                  <TouchableOpacity
                    style={darkMode == 'enable' ? styles.DnoteCard : styles.freeTextBox}
                    activeOpacity={0.8}>
                    <TextInput
                      editable={true}
                      placeholder="Type your answer here..."
                      multiline={true}
                      style={[
                        {
                          fontSize: fontSizes.size15,
                          color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300,
                          // flex: 1,
                          fontFamily: FontFamily.PoppinRegular,
                        },
                      ]}
                      value={freeTextAnswer}
                      placeholderTextColor={
                        darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
                      }

                      onChangeText={setFreeTextAnswer} // Add this line to update the amount state
                    />
                  </TouchableOpacity>
                </View>
              )}

              {/* Yes/No Question */}
              {data?.question_one_type === 'yes_no_question' && (
                <View style={styles.yesNoQuest}>
                  <Text style={styles.location}>{data?.question_one}</Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginEnd: 20,
                      }}>
                      <TouchableOpacity
                        onPress={() => handleSelection('yes')}
                        style={{ marginEnd: 10 }}>
                        {yesNoOption == 'yes' ? (
                          <View style={styles.radio1}>
                            <View style={styles.radioBg}></View>
                          </View>
                        ) : (
                          <View style={styles.radio2}></View>
                        )}
                      </TouchableOpacity>
                      <Text style={styles.text}>Yes</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <TouchableOpacity
                        onPress={() => handleSelection('no')}
                        style={{ marginEnd: 10 }}>
                        {yesNoOption == 'no' ? (
                          <View style={styles.radio1}>
                            <View style={styles.radioBg}></View>
                          </View>
                        ) : (
                          <View style={styles.radio2}></View>
                        )}
                      </TouchableOpacity>
                      <Text style={styles.text}>No</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Multiple Choice Question */}
              {data?.question_one_type === 'multiple_choice_question' && (
                <View style={styles.yesNoQuest}>
                  <Text style={styles.location}>{data?.question_one}</Text>

                  <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={toggleDropdown}>
                    <Text style={styles.dropdownButtonText}>
                      {selectedOptions ? selectedOptions : 'Select an option'}
                    </Text>
                  </TouchableOpacity>

                  {isDropdownOpen && (
                    <View style={styles.dropdownList}>
                      <ScrollView>
                        {data?.question_one_answers?.map((item, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.dropdownItem}
                            onPress={() => handleOptionSelect(item, index)}>
                            <Text style={styles.dropdownItemText}>{item}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              )}
            </>
          )}

          <SizedBox height={PIXEL.px15} />

          {data?.question_two && (
            <>
              {/* Free Text Question */}
              {data?.question_two_type === 'free_text_question' && (
                <View style={styles.yesNoQuest}>
                  <Text style={styles.location}>{data?.question_two}</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Type your answer here..."
                    value={freeTextTwo}
                    onChangeText={setfreeTextTwo}
                    placeholderTextColor={COLOR.Grey300}
                  />
                </View>
              )}

              {/* Yes/No Question */}
              {data?.question_two_type === 'yes_no_question' && (
                <View style={styles.yesNoQuest}>
                  <Text style={styles.location}>{data?.question_two}</Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginEnd: 20,
                      }}>
                      <TouchableOpacity
                        onPress={() => handleSelectionTwo('yes')}
                        style={{ marginEnd: 10 }}>
                        {yesNoOptionTwo == 'yes' ? (
                          <View style={styles.radio1}>
                            <View style={styles.radioBg}></View>
                          </View>
                        ) : (
                          <View style={styles.radio2}></View>
                        )}
                      </TouchableOpacity>
                      <Text style={styles.text}>Yes</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <TouchableOpacity
                        onPress={() => handleSelectionTwo('no')}
                        style={{ marginEnd: 10 }}>
                        {yesNoOptionTwo == 'no' ? (
                          <View style={styles.radio1}>
                            <View style={styles.radioBg}></View>
                          </View>
                        ) : (
                          <View style={styles.radio2}></View>
                        )}
                      </TouchableOpacity>
                      <Text style={styles.text}>No</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Multiple Choice Question */}
              {data?.question_two_type === 'multiple_choice_question' && (
                <View style={styles.yesNoQuest}>
                  <Text style={styles.location}>{data?.question_two}</Text>

                  <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={toggleDropdownTwo}>
                    <Text style={styles.dropdownButtonText}>
                      {selectedOptionsTwo
                        ? selectedOptionsTwo
                        : 'Select an option'}
                    </Text>
                  </TouchableOpacity>

                  {isDropdownOpenTwo && (
                    <View style={styles.dropdownList}>
                      <ScrollView>
                        {data?.question_two_answers?.map((item, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.dropdownItem}
                            onPress={() => handleOptionSelectTwo(item, index)}>
                            <Text style={styles.dropdownItemText}>{item}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              )}
            </>
          )}
          <SizedBox height={PIXEL.px15} />
          {data?.question_three && (
            <>
              {/* Free Text Question */}
              {data?.question_three_type === 'free_text_question' && (
                <View style={styles.yesNoQuest}>
                  <Text style={styles.location}>{data?.question_three}</Text>
                  <TouchableOpacity>

                  </TouchableOpacity>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Type your answer here..."
                    value={freeTextThree}
                    onChangeText={setfreeTextThree}
                    placeholderTextColor={COLOR.Grey300}
                  />


                </View>
              )}

              {/* Yes/No Question */}
              {data?.question_three_type === 'yes_no_question' && (
                <View style={styles.yesNoQuest}>
                  <Text style={styles.location}>{data?.question_three}</Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginEnd: 20,
                      }}>
                      <TouchableOpacity
                        onPress={() => handleSelectionThree('yes')}
                        style={{ marginEnd: 10 }}>
                        {yesNoOptionThree == 'yes' ? (
                          <View style={styles.radio1}>
                            <View style={styles.radioBg}></View>
                          </View>
                        ) : (
                          <View style={styles.radio2}></View>
                        )}
                      </TouchableOpacity>
                      <Text style={styles.text}>Yes</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <TouchableOpacity
                        onPress={() => handleSelectionThree('no')}
                        style={{ marginEnd: 10 }}>
                        {yesNoOptionThree == 'no' ? (
                          <View style={styles.radio1}>
                            <View style={styles.radioBg}></View>
                          </View>
                        ) : (
                          <View style={styles.radio2}></View>
                        )}
                      </TouchableOpacity>
                      <Text style={styles.text}>No</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Multiple Choice Question */}
              {data?.question_three_type === 'multiple_choice_question' && (
                <View style={styles.yesNoQuest}>
                  <Text style={styles.location}>{data?.question_three}</Text>

                  <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={toggleDropdownThree}>
                    <Text style={styles.dropdownButtonText}>
                      {selectedOptionsThree
                        ? selectedOptionsThree
                        : 'Select an option'}
                    </Text>
                  </TouchableOpacity>

                  {isDropdownOpenThree && (
                    <View style={styles.dropdownList}>
                      <ScrollView>
                        {data?.question_three_answers?.map((item, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.dropdownItem}
                            onPress={() => handleOptionSelectThree(item, index)}>
                            <Text style={styles.dropdownItemText}>{item}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              )}
            </>
          )}
          {isLoading && <AppLoading />}
          <ActionButton text="Submit" onPress={appliedJob} />

        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default JobApplyModal;

const styles = StyleSheet.create({
  location: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.Grey400,
    marginBottom: SPACING.sp8
  },
  timeCard: {
    borderRadius: RADIUS.rd7,
    backgroundColor: COLOR.White,
    borderColor: COLOR.Grey300,
    borderWidth: 1,
    // paddingVertical: SPACING.sp5,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: COLOR.White100,
  },
  dsafeAreaView: {
    flex: 1,
    backgroundColor: COLOR.DarkThemLight,
  },
  jobDescription: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
    color: COLOR.Grey400,
  },
  yesNoQuest: {
    backgroundColor: COLOR.Grey50,
    padding: SPACING.sp20,
    width: '100%',
    borderRadius: RADIUS.rd7,
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
  text: {
    fontSize: 12,
    color: COLOR.Grey500,
  },
  dropdownButton: {
    width: '100%',
    height: 50,
    backgroundColor: COLOR.White,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  dropdownBtn: {
    width: '100%',
    height: 50,
    backgroundColor: COLOR.White,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 8,
    borderColor: COLOR.Grey300,
    borderWidth: 1,
  },
  DdropdownBtn: {
    width: '100%',
    height: 50,
    backgroundColor: COLOR.DarkThemLight,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 8,
    borderColor: COLOR.Grey300,
    borderWidth: 1,
  },
  dropdownButtonText: {
    color: COLOR.Grey400,
    fontSize: 16,
  },
  dropdownList: {
    marginTop: 5,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    // Limit the height for large option lists
  },
  DdropdownList: {
    marginTop: 5,
    backgroundColor: COLOR.DarkThemLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    // Limit the height for large option lists
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  dropdownItemText: {
    fontSize: 16,
    color: COLOR.Grey400,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    color: COLOR.Grey400,
    height: 50,
    paddingHorizontal: SPACING.sp15,
    fontFamily: FontFamily.PoppinRegular
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // margin: 20,
  },
  dropdownContainer: {
    flex: 1,
    // marginHorizontal: 10,
  },
  textContainer: {
    marginHorizontal: 10,
  },

  dropdownButtonText2: {
    color: COLOR.Grey400,
    textAlign: 'left',
    fontFamily: FontFamily.PoppinRegular
  },
  dDropdownButtonText2: {
    color: COLOR.White100,
    textAlign: 'left',
    fontFamily: FontFamily.PoppinRegular
  },
  dropdown: {
    backgroundColor: '#fff',
  },
  Ddropdown: {
    backgroundColor: COLOR.DarkThemLight
  },
  dropdownRow: {
    backgroundColor: '#fff',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  ddropdownRow: {
    backgroundColor: COLOR.DarkThemLight,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  dropdownRowText: {
    color: '#333',
    fontFamily: FontFamily.PoppinRegular
  },
  ddropdownRowText: {
    color: COLOR.White100,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,

  },
  checkboxLabel: {
    marginLeft: 10,
    color: COLOR.Grey300,
    fontFamily: FontFamily.PoppinRegular
  },
  noteCard: {
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
    backgroundColor: COLOR.White100,
    borderWidth: 1,
    height: 120,
    borderColor: COLOR.Grey300,
  },
  DnoteCard: {
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
    backgroundColor: COLOR.DarkThemLight,
    borderWidth: 1,
    height: 120,
    borderColor: COLOR.Grey300,
  },
  freeTextBox : {
    padding: SPACING.md,
    borderRadius: RADIUS.sm,
    backgroundColor: COLOR.White100,

    height: 120,
  
  }
});
