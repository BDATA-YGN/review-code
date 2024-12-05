import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import Video from 'react-native-video';
import {getVideoPostList} from '../../../../../helper/ApiModel';
import {logJsonData} from '../../../../../helper/LiveStream/logFile';
import ShortVideoNew from '../../../../ShortVideo/ShortVideoNew';
import {useDispatch, useSelector} from 'react-redux';
import {setFetchDarkMode} from '../../../../../stores/slices/DarkModeSlice';
import {
  retrieveStringData,
  storeKeys,
} from '../../../../../helper/AsyncStorage';
import COLOR from '../../../../../constants/COLOR';

const {width} = Dimensions.get('window');
const VideoPaging = () => {
  const dispatch = useDispatch();
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme

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

  useEffect(() => {
    getDarkModeTheme();
  }, []);
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
        },
      ]}>
      <ShortVideoNew darkMode={darkMode} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // borderColor: 'red',
    // borderWidth: 1,
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  video: {
    width: '100%',
    height: '90%',
  },
  seekBarContainer: {
    height: 4,
    backgroundColor: 'gray',
    position: 'absolute',
    bottom: 10,
  },
  seekBarProgress: {
    height: '100%',
    backgroundColor: 'red',
  },
});

export default VideoPaging;
