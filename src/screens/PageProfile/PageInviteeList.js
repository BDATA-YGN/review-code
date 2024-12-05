import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Image,
  RefreshControl,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FontFamily, fontSizes} from '../../constants/FONT';
import COLOR from '../../constants/COLOR';
import ListShimmer from '../GroupProfile/ListShimmer';
import IconManager from '../../assets/IconManager';
import DualAvater from '../../components/DualAvater';
import {
  addInvitee,
  addPageInvitee,
  getNotGroupMembers,
  getNotPageMembers,
} from '../../helper/ApiModel';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import en from '../../i18n/en';
import SizedBox from '../../commonComponent/SizedBox';
import PIXEL from '../../constants/PIXEL';
import SPACING from '../../constants/SPACING';
import IconPic from '../../components/Icon/IconPic';

const PageInviteeList = ({route}) => {
  const {pageId} = route.params;
  const navigationAppBar = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [yourFriendList, setFriendList] = useState([]);
  const onRefresh = () => {};
  const [shimmer, setShimmer] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchFriendList = async group_id => {
    setLoading(true);
    const data = await getNotPageMembers(group_id);
    if (data.api_status === 200) {
      setFriendList(data.users);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const onPressInvitee = async (page_id, user_id, index) => {
    const updatedList = [...yourFriendList];
    await addPageInvitee(page_id, user_id).then(data => {
      if (data.api_status == 200) {
        // Remove the element at the specified index
        updatedList.splice(index, 1);
        // Update the state with the new array
        setFriendList(updatedList);
      } else {
      }
    });
  };

  const renderFriendList = ({item, index}) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginVertical: 4,
        marginHorizontal: 8,
        borderRadius: 8,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <DualAvater
          borderRadius={25}
          largerImageWidth={55}
          largerImageHeight={55}
          src={item.avatar}
          iconBadgeEnable={false}
        />
        <View style={{marginLeft: 8, flex: 1}}>
          <Text style={styles.headerText}>
          {item.first_name !== '' ? `${item.first_name} ${item.last_name}` : item.username}
          </Text>
          <Text style={styles.bodyText}>@{item.username}</Text>
        </View>
        <TouchableOpacity
          onPress={() => onPressInvitee(pageId, item.user_id, index)}>
          <IconPic
            source={IconManager.add_user_light}
            width={PIXEL.px20}
            height={PIXEL.px20}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  useEffect(() => {
    fetchFriendList(pageId);
    setTimeout(() => {
      setShimmer(false);
    }, 500);
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ActionAppBar
        appBarText={en.inviteFriends}
        source={IconManager.back_light}
        backpress={() => {
          navigationAppBar.goBack();
        }}
      />
      <View
        style={{
          backgroundColor: COLOR.White100,
          borderRadius: 4,
          flex: 1,
          borderColor: COLOR.Grey500,
          paddingTop: SPACING.sp8,
        }}>
        {
          shimmer ? (
            <ListShimmer isActionEnable={true} />
          ) : (
            <FlatList
              data={yourFriendList}
              renderItem={renderFriendList}
              keyExtractor={(item, index) => index}
              horizontal={false}
            />
          )
          // </ScrollView>
        }
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size15,
    color: COLOR.Grey500,
  },
  bodyText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    color: COLOR.Grey300,
  },
});

export default PageInviteeList;
