import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  StyleSheet,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  retrieveJsonData,
  storeKeys,
  retrieveStringData,
} from '../../helper/AsyncStorage';
import {fetchReaction, getReactionTypeList} from '../../helper/ApiModel';
import DualAvater from '../../components/DualAvater';
import {
  calculateTimeDifference,
  calculateTimeDifferenceForComment,
} from '../../helper/Formatter';
import IconManager from '../../assets/IconManager';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {useSelector} from 'react-redux';
import COLOR from '../../constants/COLOR';
import {SvgUri} from 'react-native-svg';
import {stringKey} from '../../constants/StringKey';

const Tab = createMaterialTopTabNavigator();

const EmojiTabScreen = ({type, data}) => {
  const [reactionList, setReactionList] = useState([]);
  const navigation = useNavigation();
  const [loginUserId, setLogInUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const route = useRoute();

  const checkUserType = async () => {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const user_id = loginData.user_id;
    setLogInUserId(user_id);
  };

  useEffect(() => {
    const fetchDataForTab = async () => {
      setLoading(true);
      try {
        const result = await fetchReaction(
          data.data.replies ? 'comment' : 'reply',
          data.data.id,
          type,
        );
        setLoading(false);
        setReactionList(result.data[type]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataForTab();
  }, [type]);

  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);

  useEffect(() => {
    checkUserType();
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

  return (
    <ScrollView
      style={
        darkMode == 'enable'
          ? {flex: 1, backgroundColor: COLOR.DarkTheme}
          : {flex: 1, backgroundColor: COLOR.White}
      }>
      {!loading &&
        reactionList?.map((item, index) => (
          <TouchableOpacity
            onPress={() => {
              if (item.user_id == loginUserId) {
                navigation.navigate('UserProile', {
                  myNavigatedId: loginUserId,
                  canPost: stringKey.canPost,
                  backDisable: 'enable',
                });
              } else {
                navigation.navigate('OtherUserProfile', {
                  otherUserData: item,
                  userId: item.user_id,
                });
              }
            }}
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'row',
              padding: 10,
            }}>
            <DualAvater
              largerImageWidth={55}
              largerImageHeight={55}
              source={{uri: item.avatar}}
              iconBadgeEnable={false}
            />
            <View
              style={{
                flexDirection: 'column',
                marginHorizontal: 5,
              }}>
              <Text
                style={[
                  styles.username,
                  darkMode == 'enable'
                    ? {color: COLOR.White}
                    : {color: COLOR.Grey500},
                ]}>
                {item.name}
              </Text>

              <Text
                style={
                  darkMode == 'enable'
                    ? {
                        fontSize: 10,
                        fontFamily: 'Poppins-Regular',
                        color: COLOR.White,
                        marginLeft: 5,
                        marginTop: 2,
                      }
                    : {
                        fontSize: 10,
                        fontFamily: 'Poppins-Regular',
                        color: COLOR.Grey300,
                        marginLeft: 5,
                        marginTop: 2,
                      }
                }>
                Last seen {calculateTimeDifference(item.lastseen)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      {reactionList.length == '0' && !loading && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 100,
          }}>
          <Image
            source={require('../../assets/icons/nousergif.gif')}
            style={{
              width: 200,
              height: 200,
              alignSelf: 'center',
              justifyContent: 'center',
            }}
          />
          <Text
            style={
              darkMode == 'enable'
                ? {
                    fontSize: 24,
                    fontFamily: 'Poppins-SemiBold',
                    color: COLOR.White,
                  }
                : {
                    fontSize: 24,
                    fontFamily: 'Poppins-SemiBold',
                    color: COLOR.Grey500,
                  }
            }>
            No Users to show.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const EmojiTabs = data => {
  const [reactionTypes, setReactionTypes] = useState([]);
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

  useEffect(() => {
    const fetchReactionTypes = async () => {
      try {
        const response = await getReactionTypeList(); // Replace this with your API call function
        if (response.api_status === 200) {
          const reactionTypes = response.data.map((reaction, index) => ({
            ...reaction,
            reaction_id: String(index + 1),
          }));
          setReactionTypes(reactionTypes);
        }
      } catch (error) {
        console.error('Error fetching reaction types:', error);
      }
    };

    fetchReactionTypes();
  }, []);
  if (reactionTypes.length === 0) {
    return null;
  }

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarShowIcon: true,
        tabBarShowLabel: false,
        tabBarStyle:
          darkMode == 'enable'
            ? {backgroundColor: COLOR.DarkThemLight}
            : {backgroundColor: COLOR.White},

        tabBarIcon: ({focused, color, size}) => {
          const reaction = reactionTypes.find(
            reaction => reaction.reaction_id === route.name,
          );
          if (reaction.wowonder_icon.endsWith('.svg')) {
            return (
              <SvgUri
                style={styles.reactionIcon}
                uri={reaction.wowonder_icon}
                width={32}
                height={32}
              />
            );
          } else {
            return (
              <Image
                source={{uri: reaction.wowonder_icon}}
                style={{width: 32, height: 32}}
                resizeMode="contain"
              />
            );
          }
        },
      })}>
      {reactionTypes.map(reaction => (
        <Tab.Screen
          key={reaction.reaction_id}
          name={reaction.reaction_id}
          initialParams={{data: data}}>
          {props => (
            <EmojiTabScreen {...props} type={reaction.id} data={data} />
          )}
        </Tab.Screen>
      ))}

      {/* <Tab.Screen
        name="Like"
        component={LikeScreen}
        initialParams={{data: data}}
      />
      <Tab.Screen
        name="Love"
        component={LoveScreen}
        initialParams={{data: data}}
      />
      <Tab.Screen
        name="Haha"
        component={HahaScreen}
        initialParams={{data: data}}
      />
      <Tab.Screen
        name="Wow"
        component={WowScreen}
        initialParams={{data: data}}
      />
      <Tab.Screen
        name="Sad"
        component={SadScreen}
        initialParams={{data: data}}
      />
      <Tab.Screen
        name="Angry"
        component={AngryScreen}
        initialParams={{data: data}}
      /> */}
    </Tab.Navigator>
  );
};
const goBack = () => {
  const navigation = useNavigation();
  navigation.goBack();
};
const CommentReactionList = props => {
  const navigation = useNavigation();
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

  return (
    <SafeAreaView
      style={
        darkMode == 'enable'
          ? {flex: 1, backgroundColor: COLOR.DarkThemLight}
          : {flex: 1, backgroundColor: COLOR.White}
      }>
      {/* header */}
      <ActionAppBar
        appBarText="Comment Reaction"
        source={IconManager.back_light}
        backpress={() => {
          navigation.goBack();
        }}
        darkMode={darkMode}
      />

      <EmojiTabs data={props.route.params.comment} />
    </SafeAreaView>
  );
};

export default CommentReactionList;
const styles = StyleSheet.create({
  username: {
    fontSize: 19,
    fontFamily: 'Poppins-SemiBold',
    marginRight: 10,
  },
});