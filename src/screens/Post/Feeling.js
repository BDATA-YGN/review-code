import React , {useState , useEffect}from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SPACING from '../../constants/SPACING';
import COLOR from '../../constants/COLOR';
import { FontFamily, fontSizes } from '../../constants/FONT';
import { feelingEmoji } from '../../constants/CONSTANT_ARRAY';
import AppBar from '../../components/AppBar';
import { useDispatch, useSelector } from 'react-redux';
import { setFeeling,setFeelingType } from '../../stores/slices/AddPostSlice';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import { setFetchDarkMode } from '../../stores/slices/DarkModeSlice';
import { retrieveStringData , storeKeys } from '../../helper/AsyncStorage';

const Feeling = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const fetchDarkMode = useSelector((state) => state.DarkModeSlice.fetchDarkMode)

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

  const handleFeeling = (item) => {
      dispatch(setFeeling({ value: item.value, text: item.text, icon: item.icon }))
      dispatch(setFeelingType({ text: 'Feeling', value: 'feelings' }))
      navigation.pop();
      // navigation.navigate('AddPost')
  }

  const renderEmoji = ({ item, index }) => {
    return (
      <TouchableOpacity style={[styles.emojiItemTouchable, darkMode == 'enable' ? {backgroundColor : COLOR.DarkFadeLight} : {backgroundColor: COLOR.White}]}  onPress={() => handleFeeling(item)}>
        <View style={styles.emojiItem}>
          {/* <Icon width={30} height={30} source={item.icon} /> */}
          <Image style={styles.emojiIcon} source={item.icon}/>
          <Text style={[styles.emojiText, darkMode == 'enable' ? {color : COLOR.White} : {color : COLOR.Grey500}]}>{item.text}</Text>
        </View>
      </TouchableOpacity>

    )
  }
  return (
    <SafeAreaView style={[styles.container,darkMode == 'enable' ? {backgroundColor: COLOR.DarkThemLight} :  {backgroundColor: COLOR.White}]}>
        <ActionAppBar 
        appBarText = "Feeling"
        backpress = {() => navigation.pop()}
        darkMode = {darkMode}
        />
      <View style={[styles.emojoWrapper,darkMode == 'enable' ? {backgroundColor : COLOR.DarkTheme} : {backgroundColor: COLOR.Grey50}]}>
        <FlatList
          data={feelingEmoji}
          renderItem={renderEmoji}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={{gap : SPACING.xs}}
          columnWrapperStyle={{
            gap: SPACING.lg,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : COLOR.White,
    },
    emojoWrapper : {
        flex: 1,
         padding: SPACING.lg,
    },
    emojiItemTouchable : {
        width: '48%',
        borderRadius: 8
    },
    emojiItem : {
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: SPACING.xs, 
        gap: SPACING.xs,
    },
    emojiText : {
        fontFamily: FontFamily.PoppinRegular,
         fontSize: fontSizes.size15,
    },
    emojiIcon : {
        width : 30,
        height : 30,
    }
});

export default Feeling;
