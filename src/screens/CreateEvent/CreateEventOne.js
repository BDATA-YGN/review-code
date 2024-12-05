import { SafeAreaView, View, Text, StyleSheet, TextInput } from "react-native";
import ActionAppBar from "../../commonComponent/ActionAppBar";
import IconManager from "../../assets/IconManager";
import { useNavigation } from "@react-navigation/native";
import { FontFamily } from "../../constants/FONT";
import PIXEL from "../../constants/PIXEL";
import COLOR from "../../constants/COLOR";
import MandatoryTextInput from "../../components/TextInputBox/MandatoryTextInput";
import { useEffect, useRef, useState } from "react";
import ActionButton from "../../components/Button/ActionButton";
import { useDispatch, useSelector } from "react-redux";
import { setEventName } from "../../stores/slices/CreateEventSlice";
import { setFetchDarkMode } from "../../stores/slices/DarkModeSlice";
import { retrieveStringData , storeKeys} from "../../helper/AsyncStorage";

const CreateEventOne = () => {
    const navigation = useNavigation();
    const eventName = useSelector(state => state.CreateEventSlice.eventName);
    const dispatch = useDispatch();
    const [isFocused, setIsFocused] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [darkMode, setDarkMode] = useState(null);
    const fetchDarkMode = useSelector((state) => state.DarkModeSlice.fetchDarkMode)

    const handleEventNameChange = (text) => {
        dispatch(setEventName(text));
        // if(text.length >= 10 || text != ''){
            setErrorMessage('');
        // }
    }

    // const handelNagivate = () => {
    //     if (eventName.length != '' && eventName.length >= 10) {
    //         // setErrorMessage('');
    //         navigation.navigate('CreateEventTwo');
    //     }else if(eventName.length < 10){
    //         setErrorMessage('Name should be more than 10 characters.');
    //     }
    // }

    
  const handelNagivate = () => {
    // Check if the trimmed product name meets the length requirement
    if (eventName.trim().length >= 10) {
      // Clear any previous error messages
      setErrorMessage('');
      // Navigate to the next screen
      navigation.navigate('CreateEventTwo');
    } else if (eventName.trim() === '') {
      // Show error if the product name is only spaces or empty
      setErrorMessage('Event Name cannot be spaces!');
    } else if (eventName.trim().length < 10) {
      // Show error if the product name is less than 10 characters (excluding spaces)
      setErrorMessage('Name should be more than 10 characters.');
    }
  };


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


      const handleBack = () => {
        dispatch(setEventName(''))
        navigation.pop()
      }
    return (
        <SafeAreaView style={[styles.safeAreaView,darkMode == 'enable' ? {backgroundColor: COLOR.DarkThemLight} :  {backgroundColor: COLOR.White}]}>
            <ActionAppBar
                appBarText="Create Event"
                backpress={handleBack}
                darkMode = {darkMode}
            />
            <View style={[styles.container,darkMode == 'enable' ? {backgroundColor: COLOR.DarkTheme} :  {backgroundColor: COLOR.White}]}>
                <View style={styles.stepContainer}>
                    <View>
                        <Text  style={[styles.stepText, darkMode == 'enable' ? {color : COLOR.White} : {color : COLOR.Grey500}]}>Step 1/6</Text>
                    </View>
                    <View style={[styles.progressBarBackground, darkMode == 'enable' ? {backgroundColor : COLOR.DarkFadeLight , borderColor : COLOR.DarkFadeLight}: {backgroundColor : COLOR.Grey50 , borderColor : COLOR.Grey50}]}>
                        <View style={styles.progressBarForeground} />
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <View>
                        <Text style={[styles.labelText, darkMode == 'enable' ? {color : COLOR.White} : {color : COLOR.Grey500}]}>Event Name</Text>
                    </View>
                    <View>
                        <TextInput
                            style={[
                                styles.textInput,
                                { 
                                    borderColor: errorMessage ? 'red' : (isFocused ? COLOR.Primary : (darkMode == 'enable' ? COLOR.Grey1000 : COLOR.Grey200)),
                                    backgroundColor : darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White ,
                                    color : darkMode == 'enable' ? COLOR.White : COLOR.Grey500 ,
                                    
                                }
                            ]}
                            placeholderTextColor={COLOR.Grey300}
                            value={eventName}
                            placeholder="Enter Event Name"
                            onChangeText={handleEventNameChange}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                        />
                          {errorMessage ? (
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    ) : null}
                    </View>
                  
                    <View style={{ marginTop: 5 }}>
                        <ActionButton text="Next" onPress={handelNagivate}/>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeAreaView: {
        // backgroundColor: COLOR.White,
        flex: 1
    },
    container: {
        padding: PIXEL.px16,
        rowGap: 15,
        flex : 1
    },
    stepContainer: {
        rowGap: 10
    },
    stepText: {
        fontFamily: FontFamily.PoppinRegular,
        fontSize: PIXEL.px15
    },
    progressBarBackground: {
        // backgroundColor: COLOR.Grey50,
        height: 6,
        width: '100%',
        borderRadius: 8,
        borderWidth: 1,
        // borderColor: COLOR.Grey50
    },
    progressBarForeground: {
        width: '16.66%',
        height: '100%',
        backgroundColor: COLOR.Primary,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLOR.Primary
    },
    inputContainer: {
        rowGap: 10
    },
    labelText: {
        fontFamily: FontFamily.PoppinSemiBold,
        fontSize: 19
    },
    textInput: {
        // backgroundColor: COLOR.White,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        fontFamily: FontFamily.PoppinRegular,
        fontSize: PIXEL.px15,
        textAlignVertical: 'top',
    },
    errorText: {
        color: 'red',
        fontFamily: FontFamily.PoppinRegular,
        fontSize: 13,
        marginTop: 5,
    },
});

export default CreateEventOne;
