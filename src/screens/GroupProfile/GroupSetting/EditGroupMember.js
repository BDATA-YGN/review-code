import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Image,
  RefreshControl,
  TextInput,
  FlatList,
  Modal,
  Button,
  SafeAreaView,
  Alert,
} from 'react-native';
import ListShimmer from '../ListShimmer';
import COLOR from '../../../constants/COLOR';
import IconPic from '../../../components/Icon/IconPic';
import IconManager from '../../../assets/IconManager';
import { FontFamily, fontSizes, fontWeight } from '../../../constants/FONT';
import { useNavigation } from '@react-navigation/native';
import { getGroupMembers, removeGroupMember, submitAdmin, submitGroupAdmin } from '../../../helper/ApiModel';
import { retrieveJsonData, storeKeys } from '../../../helper/AsyncStorage';
import PIXEL from '../../../constants/PIXEL';
import ActionAppBar from '../../../commonComponent/ActionAppBar';
import SizedBox from '../../../commonComponent/SizedBox';
import DualAvater from '../../../components/DualAvater';
import { useDispatch, useSelector } from 'react-redux';
import { setFetchDarkMode } from '../../../stores/slices/DarkModeSlice';
import { retrieveStringData } from '../../../helper/AsyncStorage';
import SPACING from '../../../constants/SPACING';
import RADIUS from '../../../constants/RADIUS';
import { setFetchGroupData } from '../../../stores/slices/searchSlice';
import { setGroupInfoData } from '../../../stores/slices/PageSlice';
import {  calculateTimeDifferenceForComment } from '../../../helper/Formatter';

const EditGroupMember = ({ route }) => {
  const { data } = route.params;
  const groupId = data.group_id;
  const ownerId = data.user_id;
  const navigationAppBar = useNavigation();
  const [shimmer, setShimmer] = useState(true);
  const [groupMember, setGroupMember] = useState([]);
  const [userId, setUserId] = useState('');
  const [darkMode, setDarkMode] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const fetchGroupInfoList = useSelector(
    state => state.PageSlice.fetchGroupInfoList,
  );
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);

  useEffect(() => {
    fetchDarkModeTheme();
    fetchFriendList(groupId);
    const timer = setTimeout(() => setShimmer(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (fetchDarkMode) {
      fetchDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);

  useEffect(() => {
    if (fetchGroupInfoList) {
      fetchFriendList(groupId);
    }
  }, [fetchGroupInfoList]);

  const fetchDarkModeTheme = async () => {
    try {
      const darkModeValue = await retrieveStringData({
        key: storeKeys.darkTheme,
      });
      if (darkModeValue) setDarkMode(darkModeValue);
    } catch (error) {
      console.error('Error retrieving dark mode theme:', error);
    }
  };

  const fetchFriendList = async group_id => {
    try {
      const loginData = await retrieveJsonData({ key: storeKeys.loginCredential });
      const id = loginData.user_id;
      const data = await getGroupMembers(group_id);

      if (data.api_status === 200) {
        setUserId(id);
        setGroupMember(data.users);
        dispatch(setGroupInfoData(true));
      } else {
        console.error('Failed to fetch group members');
      }
    } catch (error) {
      console.error('Error fetching friend list:', error);
    }
  };

  const handleRequestAdmin = async (groupId, memberId) => {
    setIsLoading(true);
    try {
      const data = await submitGroupAdmin(groupId, memberId);
      if (data.api_status === 200) {
        setGroupMember(prev =>
          prev.map(member =>
            member.user_id === memberId
              ? { ...member, is_admin: member.is_admin === 1 ? 0 : 1 }
              : member
          )
        );
        dispatch(setGroupInfoData(true));
      } else {
        Alert.alert('Error', 'Request failed. Please try again.');
      }
    } catch (error) {
      console.error('Admin request error:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (groupId, memberId) => {
    setIsLoading(true);
    try {
      const data = await removeGroupMember(groupId, memberId);
      if (data.api_status === 200) {
        setGroupMember(prev => prev.filter(member => member.user_id !== memberId));
      } else {
        Alert.alert('Error', 'Request failed. Please try again.');
      }
    } catch (error) {
      console.error('Remove member error:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderFriendList = ({ item }) => (
    <View
      style={[
        styles.memberContainer,
        { backgroundColor: darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White },
      ]}>
      <DualAvater
        borderRadius={25}
        largerImageWidth={55}
        largerImageHeight={55}
        src={item.avatar || ''}
        iconBadgeEnable={false}
      />
      <View style={styles.memberDetails}>
        <Text style={darkMode === 'enable' ? styles.DheaderText : styles.headerText}>
          {item.first_name} {item.last_name}
        </Text>
        <Text style={darkMode === 'enable' ? styles.DbodyText : styles.bodyText}>
        {calculateTimeDifferenceForComment(item.lastseen_unix_time)}
         
        </Text>
        <View style={styles.actionButtons}>
          {item.is_admin === 1 && item.user_id === userId && item.user_id === ownerId &&(
             <TouchableOpacity
              style={styles.button}
              onPress={() => handleRequestAdmin(groupId, item.user_id)}>
              <Text style={styles.buttonText}>Remove</Text>
            </TouchableOpacity>
          )}
          {item.is_admin === 1 && item.user_id === ownerId  ? (
            // <TouchableOpacity
            //   style={styles.button}
            //   onPress={() => handleRequestAdmin(groupId, item.user_id)}>
            //   <Text style={styles.buttonText}>Remove</Text>
            // </TouchableOpacity>
            null
          ) : (
            <>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleRemoveMember(groupId, item.user_id)}>
                <Text style={styles.buttonText}>Remove</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleRequestAdmin(groupId, item.user_id)}>
                <Text style={styles.buttonText}>Admin</Text>
              </TouchableOpacity>
              {item.is_admin === 1 && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    navigationAppBar.navigate('EditGroupPrivileges', {
                      adminData: item.admin_info,
                      data,
                      userId: item.user_id,
                    })
                  }>
                  <Text style={styles.buttonText}>Privileges</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeAreaView(darkMode)}>
      <ActionAppBar
        appBarText="Members List"
        source={IconManager.back_light}
        backpress={() => navigationAppBar.goBack()}
        darkMode={darkMode}
      />
      <SizedBox height={2} />
      {shimmer ? (
        <ListShimmer isActionEnable={true} darkMode={darkMode} />
      ) : (
        <FlatList
          data={groupMember}
          renderItem={renderFriendList}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: darkMode => ({
    flex: 1,
    backgroundColor: darkMode === 'enable' ? COLOR.DarkTheme : COLOR.Blue50,
  }),
  memberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  memberDetails: {
    marginLeft: 8,
    flex: 1,
  },
  headerText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
    color: COLOR.Grey500,
    fontWeight : fontWeight.weight500
  },
  DheaderText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size19,
    color: COLOR.White100,
  },
  bodyText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    color: COLOR.Grey300,
  },
  DbodyText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.White100,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  button: {
    backgroundColor: COLOR.Grey50,
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: COLOR.Grey500,
  },
});

export default EditGroupMember;


