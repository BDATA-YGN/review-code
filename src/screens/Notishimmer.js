import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import SPACING from '../constants/SPACING';
import PIXEL from '../constants/PIXEL';
import RADIUS from '../constants/RADIUS';
import COLOR from '../constants/COLOR';
import { useState ,useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFetchDarkMode } from '../stores/slices/DarkModeSlice';
import { retrieveStringData } from '../helper/AsyncStorage';
import { storeKeys } from '../helper/AsyncStorage';
const windowWidth = Dimensions.get('window').width;

const Notishimmer = () => {
  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);

  useEffect(() => {
      getDarkModeTheme();
  }, []);
  useEffect(() => {
      if (fetchDarkMode) {
          getDarkModeTheme();
          dispatch(setFetchDarkMode(false));
      }
  }, [fetchDarkMode]);

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
  const shimmerViews = Array.from({length:5}).map((_, index) => (
    <SkeletonPlaceholder  highlightColor={darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White} backgroundColor={darkMode === 'enable' ? COLOR.DarkFadeLight : COLOR.White50}  key={index}>
      <View style={styles.postContainer}>
        <View style={styles.avatar} />
        <View style={styles.textContainer}>
          <View style={styles.title} />
          <View style={styles.subtitle} />
        </View>
      </View>
    </SkeletonPlaceholder>
  ));

  return <View style={darkMode === 'enable' ? styles.darkContainer : styles.container}>{shimmerViews}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: SPACING.sp15, 
  },
  darkContainer : {
    flex: 1,
    backgroundColor: COLOR.DarkTheme,
    padding: SPACING.sp15,  
  },
  postContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: windowWidth - 30,
    marginBottom: SPACING.sp30,
  },
  avatar: {
    width: PIXEL.px60,
    height: PIXEL.px60,
    borderRadius: RADIUS.rd30,
    marginLeft: SPACING.sp10,
  },
  textContainer: {
    marginLeft: SPACING.sp10,
  },
  title: {
    width: windowWidth - 110,
    height: PIXEL.px20,
    borderRadius: RADIUS.rd4,
    marginBottom: SPACING.sp6,
  },
  subtitle: {
    width: PIXEL.px150,
    height: PIXEL.px15,
    borderRadius: RADIUS.rd4,
  },
});

export default Notishimmer;
