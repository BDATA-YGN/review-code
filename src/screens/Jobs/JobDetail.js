import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import React from 'react';
import COLOR from '../../constants/COLOR';
import RADIUS from '../../constants/RADIUS';
import SPACING from '../../constants/SPACING';
import {FontFamily, fontWeight} from '../../constants/FONT';
import {fontSizes} from '../../constants/FONT';
import SizedBox from '../../commonComponent/SizedBox';
import {useNavigation} from '@react-navigation/native';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import IconManager from '../../assets/IconManager';
import ActionButton from '../../components/Button/ActionButton';
import {getApplied, getFilterdJobLists} from '../../helper/Job/JobModel';
import AppLoading from '../../commonComponent/Loading';
import {useState,useCallback} from 'react';
import { jobCategories } from '../../constants/CONSTANT_ARRAY';

const JobDetail = ({route}) => {
  const {darkMode, item, userId} = route.params;
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
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
  const appliedJob = async () => {
    setIsLoading(true);
    try {
      const data = await getApplied(id);
      if (data.api_status === 200) {
        Alert.alert('Success', `${data.data.message}`, [{text: 'OK'}], {
          cancelable: false,
        });
      }
    } catch (error) {
      console.error('Error fetching searched jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    
  }, [item]);
  const onApply = () => {
    navigation.navigate('JobApplyModal', {darkMode, data: item});
  };
  const findCategoryNameByIndex = (id) => {
    const category = jobCategories.find(cat => cat.id === id);
    return category ? category.name : 'Category not found';
  };
  return (
    <SafeAreaView style={darkMode == 'enable' ? styles.dsafeAreaView :styles.safeAreaView}>
      <ActionAppBar
        appBarText="Job Detail"
        source={IconManager.back_light}
        backpress={() => navigation.pop()}
        darkMode={darkMode}
      />

      <ScrollView contentContainerStyle={styles.container}  refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500} // Pull-to-refresh indicator color
          />
        }>
        <View style={{alignItems: 'center'}}>
          <Image
            style={styles.imgStyle}
            resizeMode="contain"
            source={{uri: item?.page?.avatar}}
          />

          <SizedBox height={SPACING.sp15} />
          <Text style={[styles.nameText,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Primary}]}>{item?.page?.page_title}</Text>
          <Text style={[styles.location,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>{item?.location}</Text>
          <SizedBox height={SPACING.sp15} />

          <SizedBox height={SPACING.sp20} />
          <View style={{alignSelf: 'flex-start'}}>
         
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View style={{marginEnd: SPACING.sp5}}>
              <Image
                resizeMode="contain"
                source={darkMode == 'enable' ? IconManager.job_dark :IconManager.jobs_light}
                style={styles.jobImg}
              />
            </View>

            <Text  style={[styles.jobTitle,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>{item?.title}</Text>
          </View>
          <SizedBox height={SPACING.sp14} />
          <View
            style={{
              flexDirection: 'row'
            }}>
            <View style={{marginEnd: SPACING.sp8}}>
              <Image
                resizeMode="contain"
                source={darkMode == 'enable' ? IconManager.my_info_dark :IconManager.my_info_light}
                style={styles.jobImg}
              />
            </View>
            <Text style={[styles.jobTitle,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>{item?.job_type}</Text>
          </View>
          <SizedBox height={SPACING.sp14} />
          <View
            style={{
              flexDirection: 'row'
            }}>
            <View style={{marginEnd: SPACING.sp8}}>
              <Image
                resizeMode="contain"
                source={darkMode == 'enable' ? IconManager.sessions_dark:IconManager.sessions_light}
                style={styles.jobImg}
              />
            </View>
            <Text style={[styles.jobTitle,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>{formattedTime}</Text>
          </View>
          <SizedBox height={SPACING.sp14} />
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View style={{marginEnd: SPACING.sp5}}>
              <Image
                resizeMode="contain"
                source={darkMode == 'enable' ? IconManager.job_dark :IconManager.media_light}
                style={styles.jobImg}
              />
            </View>

            <Text  style={[styles.jobTitle,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>{findCategoryNameByIndex(item?.category)}</Text>
          </View>
          <SizedBox height={SPACING.sp14} />
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View style={{marginEnd: SPACING.sp5}}>
              <Image
                resizeMode="contain"
                source={darkMode == 'enable' ? IconManager.earning_dark :IconManager.earning_light}
                style={styles.jobImg}
              />
            </View>

            <Text  style={[styles.jobTitle,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>${item?.minimum} To ${item?.maximum}</Text>
          </View>
            <SizedBox height={SPACING.sp20} />
            { item?.description ?
             (<View>
              <Text style={[styles.jobDetail,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>Description </Text>
              <Text style={[styles.jobDescription,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]}>{item?.description}</Text>
             </View>)
              : null
            }
          </View>
        </View>

        <SizedBox height={SPACING.sp20} />
        {isLoading && <AppLoading />}
        {userId === item.user_id ? (
          item?.apply_count > 0 ? (
            <TouchableOpacity
              style={styles.viewCandidate}
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('JobAppliedLists', {id: item.id, darkMode})
              }>
              <Text style={styles.viewText}>
                View Candidate ({item?.apply_count})
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
            style={styles.viewCandidate}
              activeOpacity={0.8}
              disabled={true}>
              <Text style={styles.viewText}>
                View Candidate ({item?.apply_count})
              </Text>
            </TouchableOpacity>
          )
        ) : item?.apply ? (
          <TouchableOpacity
          style={styles.viewCandidate}
            activeOpacity={0.8}
            disabled={true}>
            <Text style={styles.viewText}>Already Applied</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
          style={styles.viewCandidate}
            activeOpacity={0.8}
            onPress={onApply}>
            <Text style={styles.viewText}>Apply</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default JobDetail;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: COLOR.White100,
  },
  dsafeAreaView: {
    flex: 1,
    backgroundColor: COLOR.DarkThemLight,
  },
  container: {
    // alignItems :'center',
    padding: SPACING.sp20,
    // flex : 1
  },
  imgStyle: {
    width: 70,
    height: 70,
    borderRadius: RADIUS.rd10,
  },
  nameText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size19,
    color: COLOR.Grey500,
    fontWeight :fontWeight.weight600,
  },
  location: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
    fontWeight :fontWeight.weight600,
    color: COLOR.Grey300,
  },
  jobTitle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.Grey500,
    textAlign: 'center',
  },
  overView: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
    color: COLOR.Grey500,
    textAlign: 'center',
  },
  jobImg: {
    width: 20,
    height: 20,
  },
  jobDescription: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.Grey500,
  },
  linePrimary: {
    backgroundColor: COLOR.Blue500,
    height: '10%',
  },
  viewCandidate: {
    backgroundColor: COLOR.Primary,
    padding: SPACING.sp8,
    alignItems: 'center',
    borderColor: COLOR.Primary,
    borderRadius: RADIUS.rd8,
    borderWidth: 1,
  },
  viewText: {
    fontSize: fontSizes.size13,
    color: COLOR.Blue50,
    fontFamily: FontFamily.PoppinRegular,
    textAlign: 'center',
  },
  jobDetail : {
    fontSize : fontSizes.size18,
    fontFamily: FontFamily.PoppinSemiBold,
    color : COLOR.Grey600,
    marginBottom : SPACING.sp8
  }
});