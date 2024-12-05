import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  Text,
  View,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  getJobLists,
  getMyJobLists,
  requestDeleteJobLists,
} from '../../helper/Job/JobModel';
import COLOR from '../../constants/COLOR';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import IconManager from '../../assets/IconManager';
import {useNavigation} from '@react-navigation/native';
import {FontFamily} from '../../constants/FONT';
import {fontSizes} from '../../constants/FONT';
import RADIUS from '../../constants/RADIUS';
import SPACING from '../../constants/SPACING';
import PostShimmer from '../../components/Post/PostShimmer';
import {Dimensions} from 'react-native';
import IconPic from '../../components/Icon/IconPic';
import SizedBox from '../../commonComponent/SizedBox';
import PIXEL from '../../constants/PIXEL';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {useDispatch, useSelector} from 'react-redux';
import {deleteJob, resetJobs, setMyJobList} from '../../stores/slices/JobSlice';

const MyJobLists = ({route}) => {
  const {cover, id, darkMode} = route.params;
  const jobLists = useSelector(state => state.JobSlice.myjobs);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreJobs, setHasMoreJobs] = useState(true); // Track if there are more jobs to load
  const limit = 6; // Define the limit for each request
  const [lastJobId, setLastJobId] = useState(null); // Track the last job ID
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getMyJobs = async (isRefreshing = false) => {
    if (!hasMoreJobs && !isRefreshing) return;
    if (isLoading && !isRefreshing) return; // Prevent loading if already loading and not refreshing

    if (isRefreshing) {
      setIsRefreshing(true);
      setLastJobId(null); // Reset lastJobId for a fresh fetch
    } else {
      setIsLoading(true);
    }

    console.log(`Fetching jobs starting after job ID: ${lastJobId}`);

    try {
      const data = await getMyJobLists(
        id,
        isRefreshing ? null : lastJobId,
        limit,
      );

      if (data?.api_status === 200 && Array.isArray(data.data)) {
        if (isRefreshing) {
          dispatch(resetJobs()); // Clear the job list if refreshing
        }

        // Dispatch the jobs to the Redux store
        dispatch(setMyJobList(data.data));

        // Update lastJobId to the ID of the last job in the list
        if (data.data.length > 0) {
          setLastJobId(data.data[data.data.length - 1].id);
        }

        setHasMoreJobs(data.data.length === limit); // Check if there are more jobs to load
      } else {
        setHasMoreJobs(false); // No more jobs to load
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      if (isRefreshing) {
        setIsRefreshing(false); // Stop the refresh spinner
      } else {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    dispatch(resetJobs()); // Clear the job list when entering the screen
    setLastJobId(null); // Reset lastJobId to start fetching from the beginning
    getMyJobs(); // Fetch the jobs
  }, []);

  const handleDeletePress = async jobId => {
    setIsLoading(true);
    try {
      const data = await requestDeleteJobLists(jobId);
      if (data.api_status === 200) {
        Alert.alert('Success', 'Job Delete Successful', [{text: 'OK'}], {
          cancelable: false,
        });

        // Dispatch the delete action to Redux
        dispatch(deleteJob(jobId));

        getMyJobs();
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreJobs = () => {
    console.log('Loading more jobs...');
    if (!isLoading && hasMoreJobs) {
      getMyJobs(); // Fetch jobs for the next offset
    }
  };
  const renderItem = ({item, index}) => {
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

    const formattedTime = formatTimeAgo(item.job?.time);

    return (
      <View style={[styles.jobContainer,{backgroundColor : darkMode == 'enable' ? COLOR.DarkFadeLight : COLOR.White }]}>
        <TouchableWithoutFeedback>
          <View style={styles.jobItemContainer}>
            <View style={styles.jobItemContainer}>
              <Image style={styles.imgStyle} source={{uri: item?.job?.image}} />

              <View style={styles.textContainer}>
                <Text style={[styles.itemTitle,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500}]} numberOfLines={1}>
                  {item?.job?.title}
                </Text>
                <Text style={[styles.itemTime,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300}]}>
                  {formattedTime} - {item?.job?.job_type}
                </Text>
                <Text style={[styles.itemTime,{color : darkMode == 'enable' ? COLOR.White100 : COLOR.Grey300}]}>{item.apply_count} applied</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('EditJob', {item, darkMode})
                }>
                <Image
                  style={{width: 20, height: 20, marginEnd: SPACING.sp10}}
                  resizeMode="contain"
                  source={darkMode == 'enable' ? IconManager.editing_white :IconManager.editing_light}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeletePress(item?.post_id)}>
                <Image
                  style={{width: 20, height: 20}}
                  resizeMode="contain"
                  source={darkMode == 'enable' ? IconManager.delete_dark :IconManager.delete_light}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <SizedBox height={SPACING.sp10} />
        {item?.job?.apply_count > 0 ? (
          <TouchableOpacity
            style={styles.viewCandidate}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('JobAppliedLists', {
                id: item?.job?.id,
                darkMode,
              })
            }>
            <Text style={styles.viewText}>
              View Candidate ({item?.job?.apply_count})
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
          style={styles.viewCandidate}
            disabled="true"
            activeOpacity={0.8}>
            <Text style={styles.viewText}>
              View Candidate ({item?.job?.apply_count})
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  const renderFooter = () => {
    if (!isLoading) return null;
    return jobLists.length == 0 ? (
      <PostShimmer darkMode={darkMode} />
    ) : (
      <ActivityIndicator color={COLOR.Primary} size="small" />
    );
  };
  const renderEmptyComponent = () => {
    const {width} = Dimensions.get('window');
    const iconSize = width * 0.7;
    if (isLoading) {
      return null;
    }
    return (
      <View style={styles.emptyContainer}>
        <IconPic
          width={iconSize}
          height={iconSize}
          source={IconManager.empty_search_light}
        />
        <SizedBox height={SPACING.sm} />
        <Text
          style={[
            styles.emptyText,
            {color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500},
          ]}>
          No Jobs Created
        </Text>
        <SizedBox height={PIXEL.px4} />
        <Text
          style={[
            styles.emptySubText,
            {color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500},
          ]}>
          Create a job for your page to hire hte right applicants on MySpace.
        </Text>
        <SizedBox height={PIXEL.px30} />
      </View>
    );
  };
  return (
    <SafeAreaView style={darkMode == 'enable' ? styles.dsafeAreaView :styles.safeAreaView}>
      <ActionAppBar
        appBarText="Offer a Job"
        source={IconManager.back_light}
        backpress={() => navigation.pop()}
        darkMode={darkMode}
        actionButtonPress={() => {
          navigation.navigate('CreateJob', {
            darkMode: darkMode,
            cover,
            id,
          });
        }}
        actionButtonText="Create"
        actionButtonType="text-button"
      />
      <View style={{padding: SPACING.sp20}}>
        <View style={{marginBottom: SPACING.sp30}}>
          <FlatList
            data={jobLists}
            keyExtractor={(item, index) => `${item.id}_${index}`}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            onEndReached={loadMoreJobs} // Trigger when reaching the bottom
            onEndReachedThreshold={0.5} // Trigger when 50% from the bottom
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmptyComponent}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => getMyJobs(true)} // Pass true to indicate refreshing
                colors={[COLOR.Primary]}
              />
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MyJobLists;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: COLOR.Grey50,
  },
  dsafeAreaView: {
    flex: 1,
    backgroundColor: COLOR.DarkThemLight,
  },
  listContainer: {
    flex: 1,
  },
  nameText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size19,
    color: COLOR.Grey400,
  },
  itemTitle: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size16,
    color: COLOR.Grey500,
  },
  itemDescription: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    color: COLOR.Grey500,
  },
  itemTime: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size13,
    color: COLOR.Grey300,
  },
  imgStyle: {
    width: 65,
    height: 65,
    borderRadius: RADIUS.rd10,
  },
  jobContainer: {
    borderRadius: RADIUS.sm,
    flex: 1,

    padding: 18,
    backgroundColor: COLOR.White,
    marginBottom: SPACING.sp10,
    // // Shadow for iOS
    shadowColor: COLOR.Grey300,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // // // Elevation for Android
    elevation: 2,
  },
  jobItemContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  textContainer: {
    marginHorizontal: SPACING.sp10,
    flex: 1,
  },
  jobCard: {
    borderRadius: RADIUS.sm,
    flex: 1,
    flexDirection: 'row',
    padding: 18,
    backgroundColor: COLOR.White,
    marginBottom: SPACING.sp10,
    // // Shadow for iOS
    shadowColor: COLOR.Grey300,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // // // Elevation for Android
    elevation: 2,
  },
  timeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
    backgroundColor: COLOR.White100,
    flex: 0.9,
    borderColor: COLOR.Grey100,
  },
  DtimeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
    backgroundColor: COLOR.DarkThemLight,
    borderWidth: 1,
    borderColor: COLOR.Grey100,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: SPACING.sp20,
  },
  emptyText: {
    fontSize: fontSizes.size23,
    color: COLOR.Black900,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  emptySubText: {
    fontSize: fontSizes.size14,
    color: COLOR.Grey600,
    fontFamily: FontFamily.PoppinRegular,
    textAlign: 'center',
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
});
