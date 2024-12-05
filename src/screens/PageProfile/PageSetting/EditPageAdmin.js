import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, FlatList, SafeAreaView, Alert } from 'react-native';
import IconManager from '../../../assets/IconManager';
import React, { useState, useEffect } from 'react';
import SizedBox from '../../../commonComponent/SizedBox';
import { getGroupMembers, getPageAdmin, getUserInfoData, requestFollowersAndFollowingList, submitAdmin } from '../../../helper/ApiModel';
import SPACING from '../../../constants/SPACING';
import { fontSizes } from '../../../constants/FONT';
import { FontFamily } from '../../../constants/FONT';
import COLOR from '../../../constants/COLOR';
import ProfileAvatar from '../../../components/Icon/ProfileAvatar';
import IconPic from '../../../components/Icon/IconPic';
import RADIUS from '../../../constants/RADIUS';
import ActionAppBar from '../../../commonComponent/ActionAppBar';
import { useNavigation } from '@react-navigation/native';
import i18n from '../../../i18n';
import { retrieveJsonData, storeKeys } from '../../../helper/AsyncStorage';
import { setPageInfoData } from '../../../stores/slices/PageSlice';
import { setFetchPageList } from '../../../stores/slices/PostSlice';
import { useDispatch } from 'react-redux';

const EditPageAdmin = ({ route }) => {
  const { data, darkMode } = route.params;
  const [loading, setIsLoading] = useState(false);
  const [following, setFollowing] = useState([]);
  const [filteredFollowing, setFilteredFollowing] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [userStatuses, setUserStatuses] = useState({});
  const [admins, setAdmins] = useState([]);
  const navigation = useNavigation();
  const pageId = data.page_id;
  const dispatch = useDispatch();
  useEffect(() => {
    fetchAdminList(pageId);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const loginData = await retrieveJsonData({ key: storeKeys.loginCredential });
      const id = loginData.user_id;
      const { data } = await requestFollowersAndFollowingList('followers,following', id);
      const followingData = data.following ?? [];
      setFollowing(followingData);
      setFilteredFollowing(followingData);

    } catch (error) {
      console.error('Error fetching following data:', error);
    }
  };

  const fetchAdminList = async (pageId) => {
    try {
      const data = await getPageAdmin(pageId);
      if (data.api_status === 200) {
        setAdmins(data.data);
        dispatch(setPageInfoData(true));

        const adminStatuses = {};
        data.data.forEach(admin => {
          // Correct the spelling from "Privillge" to "Privilege"
          adminStatuses[admin.user_id] = admin.admin === '0' ? 'Admin' : 'Admin'; // Categorize based on admin status


        });
        setUserStatuses(adminStatuses);
        // console.log(adminStatuses);
      }
    } catch (error) {
      console.error('Error fetching admin list:', error);
    }
  };


  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      setFilteredFollowing(
        following.filter(
          user => user.first_name.toLowerCase().includes(text.toLowerCase()) ||
            user.last_name.toLowerCase().includes(text.toLowerCase())
        )
      );
    } else {
      setFilteredFollowing(following);
    }
  };

  const onPressRequestAdmin = async (pageId, userId) => {
    setIsLoading(true);
    try {
      const data = await submitAdmin(pageId, userId);
      if (data.api_status === 200) {
        setUserStatuses(prevStatuses => ({
          ...prevStatuses,
          [userId]: data.code === 1 ? 'Admin' : 'Privilege',
        }));


        Alert.alert('Success', data.code === 1 ? 'Admin privileges granted.' : 'Admin privileges removed.');
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

  const renderItem = ({ item }) => {
    const userStatus = userStatuses[item.user_id] || 'Privilege';

    return (
      <View style={darkMode === 'enable' ? styles.DprofileHolder : styles.profileHolder}>
        <View style={darkMode === 'enable' ? styles.Dprofile : styles.profile}>
          <TouchableOpacity
            onPress={() => navigation.navigate('OtherUserProfile', { otherUserData: item, userId: item.user_id })}
            activeOpacity={0.8}
          >
            <ProfileAvatar src={item.avatar} />
          </TouchableOpacity>
          <SizedBox width={SPACING.xs} />
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={[styles.username, { color: darkMode === 'enable' ? COLOR.White50 : COLOR.Grey500 }]}>
              {item.first_name} {item.last_name}
            </Text>
          </View>
        </View>

        {userStatus === 'Admin' ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.admin}
              activeOpacity={0.8}
              onPress={() => onPressRequestAdmin(pageId, item.user_id)}
            >
              <IconPic source={IconManager.close_dark} width={10} height={10} />
              <Text style={styles.adminText}>Admin</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.privileges}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('EditPrivileges', { darkMode: darkMode, data: data, userId: item.user_id, adminData: item.admin_info })}
            >
              <Text style={styles.adminText}>Privileges</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.admin}
            activeOpacity={0.8}
            onPress={() => onPressRequestAdmin(pageId, item.user_id)}
          >
            <IconPic source={IconManager.add_friend_dark} />
            <Text style={styles.adminText}>Admin</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: darkMode == 'enable' ? COLOR.DarkTheme :COLOR.White50  }}>
      <ActionAppBar
        appBarText="Admin"
        source={IconManager.back_light}
        backpress={() => navigation.goBack()}
        darkMode={darkMode}
      />
      <SizedBox height={SPACING.sp10} />
      <View style={{ padding: SPACING.sp10 }}>
        <View
          style={[
            darkMode === 'enable' ? styles.DtimeCard : styles.timeCard,
            {
              borderColor: searchText ? COLOR.Primary : darkMode === 'enable' ? COLOR.Grey250 : COLOR.Grey250,
              borderWidth: searchText ? 1 : 0.5,
            },
          ]}
        >
          {/* Conditionally render the search icon */}
          {!searchText && (
            <Image
              source={darkMode == 'enable' ? IconManager.search_dark :IconManager.search_light}
              style={{ width: 12, height: 12, marginRight: 5 }}
            />
          )}

          <TextInput
            placeholder="Search"
            value={searchText}
            onChangeText={handleSearch}
            style={{
              fontSize: fontSizes.size15,
              color: darkMode === 'enable' ? COLOR.White : COLOR.Grey300,
              fontFamily: FontFamily.PoppinRegular,
              flex: 1,
              paddingVertical: SPACING.sp10,
            }}
            placeholderTextColor={darkMode === 'enable' ? COLOR.White : COLOR.Grey300}
          />

          {/* Close button to clear search text */}
          {searchText && (
            <TouchableOpacity onPress={() => handleSearch('')} style={styles.close} activeOpacity={0.8}>
              <Image
                source={darkMode === 'enable' ? IconManager.close_dark : IconManager.close_light}
                resizeMode="contain"
                style={{ width: 8, height: 8 }}
              />
            </TouchableOpacity>
          )}
        </View>

        <SizedBox height={SPACING.sp10} />
        <View >
          {admins.length === 0 && !searchText ? (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: COLOR.Grey500, fontFamily: FontFamily.PoppinRegular }}>No users to show</Text>
            </View>

          ) : (
            <FlatList
              data={searchText ? filteredFollowing : admins}
              keyExtractor={item => item.user_id.toString()}
              renderItem={renderItem}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditPageAdmin;

const styles = StyleSheet.create({
  timeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.rd10,
    // backgroundColor: COLOR.White100,
    borderWidth: 1,
    borderColor: COLOR.Grey100,
  },
  DtimeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.xxs,
    backgroundColor: COLOR.DarkThemLight,
    borderWidth: 1,
    borderColor: COLOR.Grey100,
  },
  profileHolder: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sp10,
    flex: 1,
    backgroundColor: COLOR.Grey40,
    borderRadius: RADIUS.rd10,
    marginVertical: SPACING.sp5,
  },
  DprofileHolder: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sp10,
    flex: 1,
    backgroundColor: COLOR.DarkThemLight,
    borderRadius: RADIUS.rd10,
    marginVertical: SPACING.sp5,
  },
  profile: {
    flex: 0.8,
    borderRadius: RADIUS.sm,
    margin: SPACING.md,
    paddingVertical: SPACING.sp5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Dprofile: {
    flex: 0.8,
    borderRadius: RADIUS.sm,
    margin: SPACING.md,
    paddingVertical: SPACING.sp5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinMedium,
  },
  admin: {
    backgroundColor: COLOR.Primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: SPACING.sp10
  },
  privileges: {
    backgroundColor: COLOR.Grey300,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    // marginLeft: SPACING.sp10,
  },
  adminText: {
    color: COLOR.White,
    fontSize: fontSizes.size13,
    fontFamily: FontFamily.PoppinRegular,
    marginLeft: SPACING.sp5,
  },
  // buttonContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   flex: 0.5,
  // },
  close: {
    flex: 0.05,
    backgroundColor: COLOR.Grey200,
    padding: SPACING.sp2,
    paddingVertical: SPACING.sp7,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.rd7,

  }
});
