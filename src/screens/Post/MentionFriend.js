import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import AppBar from '../../components/AppBar';
import Avater from '../../components/Avater/Avater';
import IconManager from '../../assets/IconManager';
import SPACING from '../../constants/SPACING';
import COLOR from '../../constants/COLOR';
import CustomRadioButton from '../../components/Radio/CustomRadioButton';
import {FontFamily, fontSizes} from '../../constants/FONT';
import {submitGetFriends, filterSearchList} from '../../helper/ApiModel';
import ActionButton from '../../components/Button/ActionButton';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedMentionFriends} from '../../stores/slices/AddPostSlice';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {retrieveStringData, storeKeys} from '../../helper/AsyncStorage';
import DualAvater from '../../components/DualAvater';

const MentionFriend = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [friends, setFriends] = useState([]);
  const selectedMentionFriends = useSelector(
    state => state.AddPostSlice.selectedMentionFriends,
  );

  const getFriendList = () => {
    submitGetFriends('followers,following').then(value => {
      if (value.api_status === 200) {
        setFriends(value.data.followers);
      } else {
      }
    });
  };

  const handleAddMentionFriends = () => {
    navigation.pop();
  };

  const handleRadioPress = friend => {
    const isSelected = selectedMentionFriends.some(
      selectedMentionFriend => selectedMentionFriend.user_id === friend.user_id,
    );

    if (isSelected) {
      dispatch(
        setSelectedMentionFriends(
          selectedMentionFriends.filter(
            selectedFriend => selectedFriend.user_id !== friend.user_id,
          ),
        ),
      );
    } else {
      dispatch(setSelectedMentionFriends([...selectedMentionFriends, friend]));
    }
  };

  const getApiData = async search_key => {
    await filterSearchList(search_key).then(data => {
      if (data.api_status == 200) {
        setFriends(data.users);
      } else {
      }
    });
  };

  const handleSearch = () => {
    getApiData(searchText);
  };

  useEffect(() => {
    getFriendList();
  }, []);

  const handleClear = () => {
    setSearchText('');
    getFriendList();
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

  return (
    <SafeAreaView
      style={[
        styles.container,
        darkMode == 'enable'
          ? {backgroundColor: COLOR.DarkThemLight}
          : {backgroundColor: COLOR.White},
      ]}>
      <ActionAppBar
        appBarText="Mention Friends"
        // source={IconManager.back_light}
        backpress={() => navigation.pop()}
        actionButtonType="image-button"
        actionButtonImage={
          darkMode == 'enable'
            ? IconManager.search_dark
            : IconManager.search_light
        }
        actionButtonPress={() => setSearchVisible(true)}
        isSearchVisible={isSearchVisible}
        searchText={searchText}
        setSearchText={setSearchText}
        handleSearch={handleSearch}
        handleClearInput={handleClear}
        darkMode={darkMode}
      />
      <View
        style={[
          styles.contentContainer,
          darkMode == 'enable'
            ? {backgroundColor: COLOR.DarkTheme}
            : {backgroundColor: COLOR.Grey50},
        ]}>
        <ScrollView
          contentContainerStyle={{gap: SPACING.lg, padding: SPACING.lg}}>
          {friends.map((friend, index) => (
            <Pressable
              style={[
                styles.contentItem,
                darkMode == 'enable'
                  ? {backgroundColor: COLOR.DarkFadeLight}
                  : {backgroundColor: COLOR.White},
              ]}
              key={index}
              onPress={() => handleRadioPress(friend)}>
              <View style={styles.profileContent}>
                {/* <Avater
                  source={{ uri: friend.avatar }}
                  width={45}
                  height={45}
                  borderRadius={20}
                /> */}
                <DualAvater
                  largerImageWidth={45}
                  largerImageHeight={45}
                  src={friend.avatar}
                  iconBadgeEnable={false}
                />
                <Text
                  style={[
                    styles.profileText,
                    darkMode == 'enable'
                      ? {color: COLOR.White}
                      : {color: COLOR.Grey500},
                  ]}>
                  {friend.name}
                </Text>
              </View>
              <CustomRadioButton
                selected={selectedMentionFriends.some(
                  selectedFriend => selectedFriend.user_id === friend.user_id,
                )}
                onPress={() => handleRadioPress(friend)}
              />
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {selectedMentionFriends.length !== 0 ? (
        <View
          style={
            darkMode == 'enable'
              ? {
                  backgroundColor: COLOR.DarkThemLight,
                  padding: 16,
                  borderTopColor: COLOR.Grey250,
                  borderTopWidth: 0.3,
                }
              : {
                  backgroundColor: COLOR.White,
                  padding: 16,
                  borderTopColor: COLOR.Grey250,
                  borderTopWidth: 0.3,
                }
          }>
          <ActionButton text="Send" onPress={handleAddMentionFriends} />
        </View>
      ) : (
        ''
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  contentItem: {
    padding: SPACING.lg,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileContent: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  profileText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size19,
  },
});

export default MentionFriend;
