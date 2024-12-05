import React, { useRef, useState, useEffect } from "react";
import { SafeAreaView, View, Text, TextInput, StyleSheet } from "react-native";
import ActionAppBar from "../../commonComponent/ActionAppBar";
import IconManager from "../../assets/IconManager";
import { useNavigation } from "@react-navigation/native";
import { FontFamily } from "../../constants/FONT";
import PIXEL from "../../constants/PIXEL";
import COLOR from "../../constants/COLOR";
import ActionButton from "../../components/Button/ActionButton";
import { setEventLocation, setEventPhoto , setEventName , setStartDate ,setStartTime ,setEndDate ,setEndTime } from "../../stores/slices/CreateEventSlice";
import { useDispatch, useSelector } from "react-redux";
import WebView from 'react-native-webview';
import { setFetchDarkMode } from "../../stores/slices/DarkModeSlice";
import { retrieveStringData , storeKeys} from "../../helper/AsyncStorage";

const CreateEventFive = () => {
    const navigation = useNavigation();
    const textInputRef = useRef("");
    const dispatch = useDispatch();
    const [isFocused, setIsFocused] = useState(false);
    const eventLocation = useSelector(state => state.CreateEventSlice.eventLocation);
    const [darkMode, setDarkMode] = useState(null);
  const fetchDarkMode = useSelector((state) => state.DarkModeSlice.fetchDarkMode)

    const handleEventLocationChange = (text) => {
        dispatch(setEventLocation(text));
    }

    const handelNagivate = () => {
        if(eventLocation !== ''){
            navigation.navigate('CreateEventSix');
        }
    }

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
        dispatch(setStartDate(''));
        dispatch(setStartTime(''));
        dispatch(setEndDate(''));
        dispatch(setEndTime(''));
        dispatch(setEventPhoto(null));
        setEventLocation('');
        navigation.pop(5)
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
                    <Text style={[styles.stepText, darkMode == 'enable' ? {color : COLOR.White} : {color : COLOR.Grey500}]}>Step 5/6</Text>
                    <View style={[styles.progressBarBackground, darkMode == 'enable' ? {backgroundColor : COLOR.DarkFadeLight , borderColor : COLOR.DarkFadeLight}: {backgroundColor : COLOR.Grey50 , borderColor : COLOR.Grey50}]}>
                        <View style={[styles.progressBarForeground, { width: '83.33%' }]} />
                    </View>
                </View>

                <View style={styles.descriptionContainer}>
                    <Text style={[styles.descriptionTitle, darkMode == 'enable' ? {color : COLOR.White} : {color : COLOR.Grey500}]}>Location</Text>
                    <TextInput
                        style={[
                            styles.textInput,
                            // { borderColor: isFocused ? COLOR.Primary : COLOR.Grey200 },
                            { 
                                borderColor:(isFocused ? COLOR.Primary : (darkMode == 'enable' ? COLOR.Grey1000 : COLOR.Grey200)),
                                backgroundColor : darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White ,
                                color : darkMode == 'enable' ? COLOR.White : COLOR.Grey500 ,
                                
                            }
                        ]}
                        placeholderTextColor={
                            darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300
                          }
                        value={eventLocation}
                        placeholder="Enter Location Here"
                        onChangeText={handleEventLocationChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    {eventLocation ? (
                        <View style={styles.mapContainer}>
                            <WebView
                                originWhitelist={['*']}
                                source={{
                                    html: `
                                    <html>
                                        <body style="margin:0;padding:0;">
                                            <iframe width="100%" height="100%" frameborder="0" style="border:0"
                                                src="https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(eventLocation)}&key=AIzaSyA99bxTNkibka6lyd2N6oCYVt6maJfsa1E&zoom=18"
                                                allowfullscreen>
                                            </iframe>
                                        </body>
                                    </html>`,
                                }}
                                style={styles.map}
                            />
                        </View>
                    ) : null}
                    <View style={{marginTop: 5}}>
                        <ActionButton text="Next" onPress={handelNagivate} />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeAreaView: {
        // backgroundColor: COLOR.White100,
        flex: 1,
      },
    container: {
        padding: PIXEL.px16,
        rowGap: 15,
        flex: 1,
    },
    stepContainer: {
        rowGap: 10,
    },
    stepText: {
        fontFamily: FontFamily.PoppinRegular,
        fontSize: PIXEL.px15,
    },
    progressBarBackground: {
        backgroundColor: COLOR.Grey50,
        height: 6,
        width: '100%',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLOR.Grey50,
    },
    progressBarForeground: {
        height: '100%',
        backgroundColor: COLOR.Primary,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLOR.Primary,
    },
    descriptionContainer: {
        rowGap: 10,
    },
    descriptionTitle: {
        fontFamily: FontFamily.PoppinSemiBold,
        fontSize: 19,
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
    mapContainer: {
        marginTop: 10,
        height: 200, // Adjust the height as needed
    },
    map: {
        width: '100%',
        height: '100%',
    },
});

export default CreateEventFive;

