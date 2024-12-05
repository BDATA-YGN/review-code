import React, { useEffect, useState } from "react";
import { Text, View, Image, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView } from "react-native";
import IconManager from "../../assets/IconManager";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import COLOR from "../../constants/COLOR";
import AppBar from "../../components/AppBar";
import { useDispatch, useSelector } from "react-redux";
import { setPostGif, setPostVideo, setPostPhotos } from "../../stores/slices/AddPostSlice";
import ActionAppBar from "../../commonComponent/ActionAppBar";
import { setFetchDarkMode } from '../../stores/slices/DarkModeSlice';
import { retrieveStringData , storeKeys } from '../../helper/AsyncStorage';

const Gif = () => {

  const dispatch = useDispatch();
  const postGif = useSelector((state) => state.AddPostSlice.postGif)
  const navigationAppBar = useNavigation();
  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const fetchDarkMode = useSelector((state) => state.DarkModeSlice.fetchDarkMode)
  const [gifList, setGifList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const apiKey = 'TLfl7BsPtZ93JgXBoc6j0cogTvwzt7s4';

  useEffect(() => {
    getGif()
   
  }, []);

  const getGif = () => {
    dispatch(setPostGif(null));
    const endpoint = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=26&offset=0&rating=g&bundle=messaging_non_clips`;

    axios.get(endpoint)
      .then(response => {
        setGifList(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching GIFs:', error);
      });
  }

  const handleGifSelection = (selectedGif) => {
    dispatch(setPostVideo(null));
    dispatch(setPostPhotos([]));
    dispatch(setPostGif({ uri: selectedGif }));
    navigationAppBar.pop();
  };

  const handleSearch = () => {
    setLoading(true);
    axios.get(`https://api.giphy.com/v1/gifs/search?api_key=TLfl7BsPtZ93JgXBoc6j0cogTvwzt7s4&q=${searchText}&limit=26&offset=0&rating=g&lang=en&bundle=messaging_non_clips`)
      .then(response => {
        setGifList(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching GIFs:', error);
      });

  };

  const handleClear = () => {
    setSearchText('');
    getGif();
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

  return (
    <SafeAreaView  style={darkMode == 'enable' ? {backgroundColor: COLOR.DarkThemLight , flex : 1} :  {backgroundColor: COLOR.White , flex : 1}}>
      <ActionAppBar 
      appBarText = "Select Gif"
      actionButtonType = "image-button"
      actionButtonPress = {() => setSearchVisible(true)}
      isSearchVisible = {isSearchVisible}
      actionButtonImage = {IconManager.search_light}
      backpress = {() => navigationAppBar.pop()}
      searchText={searchText}
      setSearchText={setSearchText}
      handleSearch={handleSearch}
      handleClearInput = {handleClear}
      darkMode = {darkMode}
      

      />
      {loading ? (
        <ActivityIndicator size="large" color={COLOR.Primary} />
      ) : (
        
        <ScrollView contentContainerStyle={darkMode == 'enable' ? {flexDirection: 'row', flexWrap: 'wrap', backgroundColor : COLOR.DarkTheme} : {flexDirection: 'row', flexWrap: 'wrap'}}>
          {gifList.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                flexDirection: 'row',
                width: '50%',
                padding: 5,
              }}
              onPress={() => handleGifSelection(item.images.fixed_height.url)}
            >
              <Image
                source={{ uri: item.images.fixed_height.url }}
                style={{ width: '100%', height: 200 }}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

export default Gif;

