import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import COLOR from '../../constants/COLOR';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import IconManager from '../../assets/IconManager';
import {useNavigation} from '@react-navigation/native';
import {requestAppliedJobLists} from '../../helper/Job/JobModel';
import {FontFamily, fontSizes} from '../../constants/FONT';
import SPACING from '../../constants/SPACING';
import RADIUS from '../../constants/RADIUS';
import IconPic from '../../components/Icon/IconPic';
import SizedBox from '../../commonComponent/SizedBox';
const JobAppliedLists = ({route}) => {
  const {darkMode, id} = route.params;
  const navigation = useNavigation();
  const [applyList, setApplyLists] = useState([]);
  const [isLoading, setIsLoading] = useState([]);

  const getApplyJobLists = async () => {
    setIsLoading(true);
    try {
      const data = await requestAppliedJobLists(id);
      if (data.api_status === 200) {
        setApplyLists(data.data);
        console.log(data.data);
      }
      // setTimeout(() => {
      //   navigation.pop(); // Navigate back to the previous screen
      // }, 2000);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getApplyJobLists();
  }, []);

  const renderItem = ({item}) => {
    const formatTimeAgo = timestamp => {
      const seconds = Math.floor(
        (new Date() - new Date(timestamp * 1000)) / 1000,
      );

      let interval = seconds / 31536000;
      if (interval > 1)
        return `${Math.floor(interval)} year${
          Math.floor(interval) > 1 ? 's' : ''
        } ago`;

      interval = seconds / 2592000;
      if (interval > 1)
        return `${Math.floor(interval)} month${
          Math.floor(interval) > 1 ? 's' : ''
        } ago`;

      interval = seconds / 86400;
      if (interval >= 1)
        return `${Math.floor(interval)} day${
          Math.floor(interval) > 1 ? 's' : ''
        } ago`;

      interval = seconds / 3600;
      if (interval >= 1)
        return `${Math.floor(interval)} hour${
          Math.floor(interval) > 1 ? 's' : ''
        } ago`;

      interval = seconds / 60;
      if (interval >= 1)
        return `${Math.floor(interval)} minute${
          Math.floor(interval) > 1 ? 's' : ''
        } ago`;

      return 'just now';
    };

    const formattedTime = formatTimeAgo(item.time);
    return (
      <View style={{padding: SPACING.sp10}}>
        <TouchableOpacity style={darkMode == 'enable' ? styles.djobContainer :styles.jobContainer}  onPress={() =>
                navigation.navigate('JobAppliedDetail', {data : item, darkMode : darkMode} )
              }
              activeOpacity={0.8}>
          <View
            style={styles.jobCard}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('JobAppliedDetail', {data : item, darkMode : darkMode} )
            }
            >
            <View
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={styles.avatar} activeOpacity={0.8}>
                <Image
                  source={{uri: item.user_data?.avatar}}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 10,
                    resizeMode: 'contain',
                  }}
                />
              </View>
              <View style={{marginStart: SPACING.sp8}}>
                <Text style={[styles.avatarText,{color : darkMode == 'enable' ? COLOR.White100  : COLOR.Grey500}]}>
                  {item?.user_data.first_name} {''}
                  {item?.user_data.last_name}
                </Text>
                <Text style={styles.timeText}> {formattedTime}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() =>
                navigation.navigate('JobAppliedDetail', {data : item, darkMode : darkMode} )
              }>
              <IconPic source={darkMode  == 'enable' ? IconManager.next_dark :IconManager.next_light} />
            </TouchableOpacity>
          </View>
         
         
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <SafeAreaView style={ darkMode == 'enable' ? styles.dsafeAreaView :styles.safeAreaView}>
      <ActionAppBar
        appBarText="Job Detail"
        source={IconManager.back_light}
        backpress={() => navigation.pop()}
        darkMode={darkMode}
      />
      <View style={{padding: SPACING.sp20}}>
        <Text style={[styles.text16,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>Who applied my Offer</Text>
        <FlatList
          data={applyList}
          keyExtractor={(item, index) => `${item.id}_${index}`}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default JobAppliedLists;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: COLOR.White,
  },
  dsafeAreaView: {
    flex: 1,
    backgroundColor: COLOR.DarkThemLight,
  },
  avatarText: {
    color: COLOR.Grey500,
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size16,
  },
  text16: {
    color: COLOR.Grey500,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
  },
  avatar: {
    borderColor: COLOR.Grey100,
    borderCurve: 'continuous',
    borderWidth: 2,
    borderRadius: RADIUS.rd10,
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    color: COLOR.Grey200,
    fontFamily: FontFamily.PoppinRegular,
  },
  jobCard: {
    flex: 1,
    flexDirection: 'row',
    justifyContent :'space-between',
    alignItems: 'center',
  },
  jobContainer: {
    borderRadius: RADIUS.rd10,
    flex: 1,
    padding: 15,
    backgroundColor: COLOR.White,
    shadowColor: COLOR.Grey300,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // // // Elevation for Android
    elevation: 2,
  },
  djobContainer: {
    borderRadius: RADIUS.rd10,
    flex: 1,
    padding: 15,
    backgroundColor: COLOR.DarkFadeLight,
    shadowColor: COLOR.Grey300,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // // // Elevation for Android
    elevation: 2,
  },
  viewCandidate: {
    backgroundColor: COLOR.Primary,
    padding: SPACING.sp7,
    alignItems: 'center',
    borderColor: COLOR.Primary,
    borderRadius: RADIUS.rd8,
    borderWidth: 1,
  },
  viewText: {
    fontSize: fontSizes.size13,
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinRegular,
    textAlign: 'center',
  },
});
