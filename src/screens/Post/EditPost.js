import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import COLOR from '../../constants/COLOR';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import IconManager from '../../assets/IconManager';
import {useNavigation} from '@react-navigation/native';
import {
  editPost,
  filterSearchList,
  getUserInfoData,
  submitGetFriends,
} from '../../helper/ApiModel';
import {useDispatch, useSelector} from 'react-redux';
import AddPostHeader from '../../components/Post/AddPostHeader';
import {
  setPostText,
  setSelectedMentionFriends,
  setSelectedPostPrivacy,
  setErrorPosting,
  setSuccessPosting,
  setLoadingPosting,
} from '../../stores/slices/AddPostSlice';
import {postPrivary} from '../../constants/CONSTANT_ARRAY';
import DualAvater from '../../components/DualAvater';
import PostPrivacyModal from '../../components/Post/Modal/PostPrivacyModal';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {retrieveStringData, storeKeys} from '../../helper/AsyncStorage';
import {FontFamily} from '../../constants/FONT';
import PIXEL from '../../constants/PIXEL';
import Toast from 'react-native-toast-message';

const EditPost = props => {
  const postText = useSelector(state => state.AddPostSlice.postText);
  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const [userInfoData, setUserInfoData] = useState(null);
  const [mentionListLoader, setMentionListLoader] = useState(false);
  const [mentionFriendsList, setMentionFriendsList] = useState([]);
  const [postPrivacyModalVisble, setPostPrivacyModalVisible] = useState(false);

  const postPrivaryFiltered = postPrivary.filter(
    option => option.label !== 'Monetization',
  );
  const [mentionFriendListVisible, setMentionFriendListVisible] =
    useState(false);
  const selectedPostPrivacy = useSelector(
    state => state.AddPostSlice.selectedPostPrivacy,
  );
  const dispatch = useDispatch();

  const navigation = useNavigation();

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
  const showToast = msg => {
    Toast.show({
      type: 'success',
      text1: msg,
      visibilityTime: 2000,
      position: 'bottom',
    });
  };
  useEffect(() => {

    // console.log('hsdfsdf', props);
    
    getDarkModeTheme();
    getUserData();
    getFriendList();
  }, []);
  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);

  useEffect(() => {
    getUserData();

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleNavigate,
    );
    return () => backHandler.remove();
  }, []);
  const getUserData = async () => {
    const userInfo = await getUserInfoData();

    setUserInfoData(userInfo.user_data);
  };
  const handleSelectPrivacy = selectedPrivacy => {
    setPostPrivacyModalVisible(false);
    dispatch(setSelectedPostPrivacy(selectedPrivacy));
  };
  const handleClearAddPostData = () => {
    dispatch(setPostText(''));
    dispatch(setSelectedPostPrivacy(postPrivary[0]));
    dispatch(setSelectedMentionFriends([]));
  };
  const isOnlySpaces = value => {
    return value.trim() === '';
  };
  const requestEditPost = async () => {
    if (isOnlySpaces(postText)) {
      // Alert.alert('Error', 'ot be null!');
    } else {
      if (!postText) {
        showToast('Post text is required!');
        return;
      }
      dispatch(setLoadingPosting(true));
      try {
        let modifiedText = postText;

        mentionFriendsList.forEach(({first_name, last_name, username}) => {
          const mentionRegex = new RegExp(`@${first_name} ${last_name}`, 'g');
          modifiedText = modifiedText.replace(mentionRegex, `@${username}`);
        });
        navigation.pop();
        const data = await editPost(
          props.route.params.postid,
          'edit',
          modifiedText,
          selectedPostPrivacy.id,
        );

        if (data.api_status == 200) {
          dispatch(setLoadingPosting(false));
          dispatch(setSuccessPosting(true));
          // navigation.navigate('BottomTabNavigator');

          handleClearAddPostData();
        } else {
          dispatch(setLoadingPosting(false));
          dispatch(setErrorPosting(true));

          dispatch(setSuccessPosting(false));
        }
      } catch (error) {
        console.error('Error in requestHidePost:', error);
        dispatch(setLoadingPosting(false));

        dispatch(setSuccessPosting(false));

        dispatch(setErrorPosting(true));
      }
    }
  };
  const handleTextChange = text => {
    dispatch(setPostText(text));

    if (text.includes('@')) {
      const words = text.split(' ');

      const lastWord = words[words.length - 1];
      if (lastWord.endsWith('@')) {
        setMentionListLoader(true);
        getFriendList();
        setMentionFriendListVisible(true);
      }

      const search_key = lastWord.substring(lastWord.indexOf('@') + 1);

      if (lastWord.endsWith(`@${search_key}`)) {
        setMentionListLoader(true);
        if (search_key.trim() !== '') {
          getApiData(search_key);
        }
      }
    } else {
      setMentionFriendListVisible(false);
    }
  };
  const getFriendList = () => {
    submitGetFriends('followers,following', userInfoData?.user_id).then(
      value => {
        if (value.api_status === 200) {
          setMentionFriendsList(value.data.followers);
          setMentionListLoader(false);
        } else {
        }
      },
    );
  };

  const getApiData = async search_key => {
    await filterSearchList(search_key).then(data => {
      if (data.api_status == 200) {
        if (data.users.length == 0) {
          setMentionFriendListVisible(false);
        } else {
          setMentionFriendListVisible(true);
        }
        setMentionFriendsList(data.users);
        setMentionListLoader(false);
      } else {
      }
    });
  };
  const handleFocusOrBlur = val => {};
  const handleSelectMentionFriends = friend => {
    // Extracting the current text content

    let friendData = {
      first_name: friend.first_name,
      last_name: friend.last_name,
      username: friend.username,
    };
    const searchText = postText.substring(0, postText.lastIndexOf('@') + 1);

    // Check if friendData already exists in friendList
    const friendAlreadyExists = mentionFriendsList.some(
      existingFriend => existingFriend.username === friendData.username,
    );

    // If friendData doesn't exist, push it to friendList
    if (!friendAlreadyExists) {
      setMentionFriendsList(prevFriendList => [...prevFriendList, friendData]);
    }

    // Concatenating the chosen user's full name with the @ mention
    const newTextPost =
      searchText + friend.first_name + ' ' + friend.last_name + ' ';

    // Appending the remaining text
    setMentionFriendListVisible(false);
    dispatch(setPostText(newTextPost));
  };

  const handleNavigate = () => {
    handleClearAddPostData();
    navigation.goBack();
  };
  return (
    <SafeAreaView
      style={
        darkMode == 'enable'
          ? {flex: 1, backgroundColor: COLOR.DarkThemLight}
          : {flex: 1, backgroundColor: COLOR.White}
      }>
      <ActionAppBar
        appBarText="Edit Post"
        source={IconManager.back_light}
        backpress={() => {
          handleNavigate();
        }}
        actionButtonType="text-button"
        actionButtonText="Edit"
        actionButtonPress={requestEditPost}
        darkMode={darkMode}
      />
      <AddPostHeader
        selectedPostPrivacy={selectedPostPrivacy}
        setPostPrivacyModalVisible={setPostPrivacyModalVisible}
        userInfoData={userInfoData}
        pageInfo={props?.route.params?.pageInfo}
        handleTextChange={handleTextChange}
        focusOrBlur={handleFocusOrBlur}
        postType={props.route.params?.postType}
        darkMode={darkMode}
        editPost={true}
      />
      <PostPrivacyModal
        visible={postPrivacyModalVisble}
        onClose={() => setPostPrivacyModalVisible(false)}
        data={postPrivary}
        userinfo={userInfoData}
        handleSelectPrivacy={handleSelectPrivacy}
        darkMode={darkMode}
      />
      {mentionFriendListVisible ? (
        <View
          style={{
            width: 300,
            height: 240,
            position: 'absolute',
            top: '40%',
            left: '10%',
            borderWidth: 0.6,
            borderColor: darkMode == 'enable' ? COLOR.Grey500 : COLOR.Grey50,
            gap: 8,
            padding: 8,
            backgroundColor:
              darkMode == 'enable' ? COLOR.DarkThemLight : COLOR.White100,
          }}>
          {mentionListLoader ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="small" color={COLOR.Primary} />
            </View>
          ) : (
            <ScrollView keyboardShouldPersistTaps="handled">
              {mentionFriendsList?.map((friend, index) => (
                <TouchableOpacity
                  onPress={() => handleSelectMentionFriends(friend)}
                  key={index}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                      paddingVertical: 8,
                      borderBottomColor: COLOR.Grey50,
                      borderBottomWidth: 0.5,
                    }}>
                    <DualAvater
                      largerImageWidth={45}
                      largerImageHeight={45}
                      source={{uri: friend.avatar}}
                      iconBadgeEnable={false}
                    />
                    <Text
                      style={[
                        styles.friendName,
                        darkMode == 'enable'
                          ? {color: COLOR.White}
                          : {color: COLOR.Grey500},
                      ]}>
                      {friend.first_name} {friend.last_name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      ) : null}
      <Toast ref={ref => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

export default EditPost;

const styles = StyleSheet.create({
  friendName: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: PIXEL.px15,
  },
});
