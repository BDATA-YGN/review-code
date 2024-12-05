import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import COLOR from '../../constants/COLOR';
import IconManager from '../../assets/IconManager';
import {FontFamily, fontSizes} from '../../constants/FONT';
import {useNavigation} from '@react-navigation/native';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import i18n from '../../i18n';
import AppLoading from '../../commonComponent/Loading';
import {getBlockedList, submitBlock} from '../../helper/ApiModel';
import RADIUS from '../../constants/RADIUS';
import SPACING from '../../constants/SPACING';
import ProfileAvatar from '../../components/Icon/ProfileAvatar';
import SizedBox from '../../commonComponent/SizedBox';
import {calculateTimeDifference} from '../../helper/Formatter';
import ListShimmer from '../GroupProfile/ListShimmer';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import { setFetchDarkMode } from '../../stores/slices/DarkModeSlice';
import { retrieveStringData,storeKeys } from '../../helper/AsyncStorage';

const BlockedList = () => {
  const navigation = useNavigation();
  const [blockedList, setBlockedList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const dispatch = useDispatch();

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
    getBlockedList().then(data => {
      setLoading(true);
      if (data.api_status == 200) {
        setBlockedList(data.blocked_users);
        setLoading(false);
      } else {
        //do something
      }
    });
  }, []);
  useEffect(() => {
    getDarkModeTheme();
  }, []);
  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);


  const showToast = msg => {
    Toast.show({
      type: 'success',
      text1: msg,
      visibilityTime: 2000,
      position: 'bottom',
    });
  };

  const unBlock = (user_id, block_type, index) => {
    submitBlock(user_id, block_type).then(data => {
      if (data.api_status == 200) {
        const updatedItems = [
          ...blockedList.slice(0, index),
          ...blockedList.slice(index + 1),
        ];
        setBlockedList(updatedItems);
        showToast('Unblock Successfully');
      } else {
      }
    });
  };

  const renderBlockedUser = ({item, index}) => (
    <View style={styles.profile}>
      <View style={styles.profileContentHandle}>
        <ProfileAvatar source={{uri: item.avatar}} />
        <SizedBox width={SPACING.xs} />
        <View>
          <Text numberOfLines={1} style={darkMode == 'enable' ? styles.dusername :styles.username}>
            {item.first_name} {item.last_name}
          </Text>
          <Text numberOfLines={1} style={styles.viewProfile}>
            {calculateTimeDifference(item.lastseen)}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          unBlock(item.user_id, 'un-block', index);
        }}
        style={{
          borderWidth: 1,
          borderColor: COLOR.Primary,
          borderRadius: RADIUS.rd30,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={styles.unblock}>{i18n.t(`translation:unBlock`)}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      style={darkMode == 'enable' ? styles.DsafeAreaView : styles.safeAreaView}>
      <ActionAppBar
        appBarText={i18n.t(`translation:blockedUsers`)}
        source={IconManager.back_light}
        backpress={() => {
          navigation.goBack();
        }}
        darkMode={darkMode}
      />

      <View>
        {loading ? (
          <ListShimmer />
        ) : (
          <FlatList
            data={blockedList}
            renderItem={renderBlockedUser}
            keyExtractor={(item, index) => index}
            contentContainerStyle={{}}
          />
        )}
      </View>
      <Toast ref={ref => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

export default BlockedList;

const styles = StyleSheet.create({
  profileContentHandle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  username: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size19,
    color: COLOR.Grey500,
  },
  dusername: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size19,
    color: COLOR.White100,
  },
  viewProfile: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.Grey300,
  },
  unblock: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.Primary,
    paddingHorizontal: SPACING.sp12,
    paddingVertical: SPACING.sp4,
  },
  profile: {
    borderRadius: RADIUS.xs,
    margin: SPACING.sp12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  safeAreaView: {
    backgroundColor: COLOR.White100,
    flex: 1,
  },
  DsafeAreaView: {
    backgroundColor: COLOR.DarkTheme,
    flex: 1,
  },
  blockedListTextView: {
    marginLeft: '3%',
    marginRight: 'auto',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 4,
    paddingRight: 4,
    alignContent: 'center',
    flex: 1,
  },
  cardElementHolder: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 100,
    borderColor: 'red',
    borderWidth: 0,
  },
  card: {
    flexDirection: 'row',
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 4,
    paddingBottom: 16,
    // borderWidth: 2,
    // borderColor: 'red'
  },
  avatarSession: {
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLOR.Primary,
    borderRadius: 100,
  },
  imageSession: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  textSession: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
