import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Pressable,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import React from 'react';
import COLOR from '../../constants/COLOR';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import IconManager from '../../assets/IconManager';
import SPACING from '../../constants/SPACING';
import { getCurrecyLists } from '../../helper/Monetization/MonetizationModel';
import {
  getFilterdJobLists,
  getJobLists,
  getSearchJobLists,
} from '../../helper/Job/JobModel';
import { useState, useEffect } from 'react';
import { FontFamily } from '../../constants/FONT';
import { fontSizes } from '../../constants/FONT';
import { useNavigation } from '@react-navigation/native';
import RADIUS from '../../constants/RADIUS';
import SizedBox from '../../commonComponent/SizedBox';
import IconPic from '../../components/Icon/IconPic';
import PIXEL from '../../constants/PIXEL';
import SearchTextInput from '../../components/TextInputBox/SearchTextInput';
import { useWindowDimensions } from 'react-native';
import { jobCategories, jobStatus, jobType } from '../../constants/CONSTANT_ARRAY';
import ActionButton from '../../components/Button/ActionButton';

import PostShimmer from '../../components/Post/PostShimmer';
import ListShimmer from '../GroupProfile/ListShimmer';

const JobLists = ({ route }) => {
  const { darkMode, firstName, lastName, userId } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [jobLists, setjobLists] = useState([]);
  const [searchedJobs, setsearchJobs] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const layout = useWindowDimensions();
  const [modalCategoryVisible, setModalCategoryVisible] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const slideAnim = useState(new Animated.Value(0))[0];
  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight / 1.15;
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [hasMoreJobs, setHasMoreJobs] = useState(true); // Track if there are more jobs to load
  const limit = 10; // Define the limit for each request
  const [lastJobId, setLastJobId] = useState(null); // Track the last job ID
  const [lastFilteredJobId, setLastFilteredJobId] = useState(null);
  const [lastSearchedJobId, setLastSearchedJobId] = useState(null);

  const onRefresh = async () => {
    setIsRefreshing(true); // Set the refreshing state to true to show the loading indicator
    setLastJobId(null); // Reset the last job ID to start fresh
    setHasMoreJobs(true); // Reset the pagination control
    try {
      const data = await getJobLists(null, limit); // Fetch jobs without passing a last job ID to get the first page

      if (data?.api_status === 200 && Array.isArray(data.data)) {
        setjobLists(data.data); // Update the job list with fresh data
        setsearchJobs(data.data); // Update search results with fresh data
        setFilteredJobs(data.data); // Update filtered results with fresh data
        setLastJobId(data.data.length > 0 ? data.data[data.data.length - 1].id : null); // Set last job ID for the next pagination
        setHasMoreJobs(data.data.length === limit); // Determine if there are more jobs to load
      } else {
        setjobLists([]); // Clear the list if no data is returned
        setHasMoreJobs(false); // Stop pagination if no data
      }
    } catch (error) {
      console.error('Error refreshing jobs:', error);
    } finally {
      setIsRefreshing(false); // Stop the refresh indicator after the job list is updated
    }
  };

  const openModal = () => {
    setModalCategoryVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalCategoryVisible(false);
      // filetrMarketList(dispatch, handleCategory());
    });
  };
  const closeJobModal = () => {
    getJobs();
    closeModal();
  };
  const getJobs = async () => {
    if (!hasMoreJobs) return;

    setIsLoading(true);

    try {
      // Pass the last job ID instead of an offset
      const data = await getJobLists(lastJobId, limit);

      if (data?.api_status === 200 && Array.isArray(data.data)) {
        setjobLists(prevJobs => [...prevJobs, ...data.data]);
        setsearchJobs(prevJobs => [...prevJobs, ...data.data]);
        setFilteredJobs(prevJobs => [...prevJobs, ...data.data]);

        // Check if there are more jobs to load
        setHasMoreJobs(data.data.length === limit);

        // Update the last job ID for the next request
        if (data.data.length > 0) {
          setLastJobId(data.data[data.data.length - 1].id);
        }
      } else {
        if (!lastJobId) {
          setjobLists([]); // Clear the list if no data on the first request
        }
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreJobs = () => {
    console.log('Loading more jobs...');
    if (!isLoading && hasMoreJobs) {
      getJobs(); // Fetch jobs for the next offset
    }
  };

  const handleSearch = async text => {
    setSearchText(text);
    if (text === '') {
      setsearchJobs(jobLists); // Reset search to full list
      setLastSearchedJobId(null); // Reset for fresh search pagination
    } else {
      setIsLoading(true);
      try {
        const data = await getSearchJobLists(text, null, limit); // Reset pagination when new search starts
        if (data.api_status === 200 && Array.isArray(data.data)) {
          setjobLists(data.data); // Replace with new search result
          setLastSearchedJobId(
            data.data.length > 0 ? data.data[data.data.length - 1].id : null,
          ); // Set last job ID
          setHasMoreJobs(data.data.length === limit); // Check if more results to fetch
        } else {
          Alert.alert('No jobs found for search query.');
        }
      } catch (error) {
        console.error('Error searching jobs:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Function to handle filter submission
  
  // Function to get filtered jobs with pagination
  const getFilteredJobs = async () => {
    setIsLoading(true);
    try {
      // Call the filtering function, passing null or selected values
      const data = await getFilterdJobLists(selectedType || '', selectedCategory || '');

      if (data.api_status === 200) {
        setjobLists(data.data); // Update the job list
      } else {
        setjobLists([]); // Clear the job list if no jobs are found
        setHasMoreJobs(false);
        Alert.alert('No jobs found for the selected filter.');
      }
    } catch (error) {
      console.error('Error fetching filtered jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = () => {
    // Only call getFilteredJobs if a type or category is selected, otherwise fetch all jobs
    selectedType || selectedCategory ? getFilteredJobs() : getJobs();

    closeModal(); // Close the modal after submitting
  };


  const handleClearInput = () => {
    setSearchText(''); // Clear search text
    setLastJobId(null); // Reset last job ID to null
    getJobs(); // Fetch all jobs after clearing search
  };

  const handleClear = () => {
    setSelectedType(null); // Clear selected type
    setSelectedCategory(null); // Clear selected category
  };

  useEffect(() => {
    getJobs();
  }, []);

  const renderFooter = () => {
    if (!isLoading) return null;
    return jobLists.length == 0 ? (
      <PostShimmer darkMode={darkMode} />
    ) : (
      <ActivityIndicator color={COLOR.Primary} size="small" />
    );
  };



  const renderEmptyComponent = () => {
    const { width } = Dimensions.get('window');
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
          resizeMode='contain'
        />
        <SizedBox height={SPACING.sm} />
        <Text
          style={[
            styles.emptyText,
            { color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500 },
          ]}>
          No Jobs Found
        </Text>
        <SizedBox height={PIXEL.px4} />
        <Text
          style={[
            styles.emptySubText,
            { color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500 },
          ]}>
          We cannot find the job you are searching for, maybe a little spelling
          mistake?
        </Text>
        <SizedBox height={PIXEL.px30} />
      </View>
    );
  };

  const renderItem = ({ item }) => {
    const formatTimeAgo = timestamp => {
      const seconds = Math.floor(
        (new Date() - new Date(timestamp * 1000)) / 1000,
      );

      let interval = seconds / 31536000;
      if (interval > 1)
        return `${Math.floor(interval)} year${Math.floor(interval) > 1 ? 's' : ''
          } ago`;

      interval = seconds / 2592000;
      if (interval > 1)
        return `${Math.floor(interval)} month${Math.floor(interval) > 1 ? 's' : ''
          } ago`;

      interval = seconds / 86400;
      if (interval >= 1)
        return `${Math.floor(interval)} day${Math.floor(interval) > 1 ? 's' : ''
          } ago`;

      interval = seconds / 3600;
      if (interval >= 1)
        return `${Math.floor(interval)} hour${Math.floor(interval) > 1 ? 's' : ''
          } ago`;

      interval = seconds / 60;
      if (interval >= 1)
        return `${Math.floor(interval)} minute${Math.floor(interval) > 1 ? 's' : ''
          } ago`;

      return 'just now';
    };

    const formattedTime = formatTimeAgo(item.time);

    return (
      <TouchableWithoutFeedback
        onPress={() =>
          navigation.navigate('JobDetail', {
            darkMode,
            item,
            userId,
          })
        }>
        <View style={[styles.jobCard, { backgroundColor: darkMode == 'enable' ? COLOR.DarkThemLight : COLOR.White }]}>
          <View style={styles.jobContainer}>
            <Image
              style={styles.imgStyle}
              resizeMode='contain'
              source={{
                uri: item?.page?.avatar ?? IconManager.logo_light, // Fallback URL
              }}
            />

            <View style={styles.textContainer}>
              <Text style={[styles.itemTitle, { color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500 }]} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.itemTime}>
                {formattedTime} - {item.job_type}
              </Text>
              <Text style={styles.itemTime}>{item.apply_count} applied</Text>
            </View>
          </View>
          <IconPic
            resizeMode='contain'
            source={
              item?.apply
                ? IconManager.mark_blue_light
                : darkMode == 'enable' ? IconManager.job_detail_dark : IconManager.job_detail_light
            }
          />
        </View>
      </TouchableWithoutFeedback>
    );
  };
  const filterJobsByApplyStatus = (isApplied) => {
    const filtered = jobLists.filter(job => job.apply === isApplied);
    console.log(filtered)
    setFilteredJobs(filtered); // Update the filtered jobs state
    closeModal();
  };

  return (
    <SafeAreaView style={darkMode == 'enable' ? styles.dsafeAreaView : styles.safeAreaView}>
      <ActionAppBar
        appBarText="Job"
        source={IconManager.back_light}
        backpress={() => navigation.pop()}
        darkMode={darkMode}
      />
      <View style={styles.container}>
        <Text style={[styles.nameText, { color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey400 }]}>
          Hello, {firstName} {lastName}
        </Text>
        <SizedBox height={SPACING.sp10} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 0.85 }}>
            <SearchTextInput
              searchText={searchText}
              setSearchText={handleSearch} // Corrected to only set search text
              handleSearch={handleSearch} // Triggers the search action
              handleClearInput={handleClearInput} // Clears the search input
              darkMode={darkMode}
            />
          </View>
          <TouchableOpacity
            style={{ flex: 0.15, justifyContent: 'center', alignItems: 'center' }}
            onPress={openModal}>
            <Image
              source={darkMode == 'enable' ? IconManager.filter_dark : IconManager.filter_light}
              resizeMode='contain'
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity>
        </View>

        <SizedBox height={SPACING.sp15} />
        <View style={styles.listContainer}>
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
                refreshing={isRefreshing} // Use the isRefreshing state to show the loader
                onRefresh={onRefresh} // Calls the refresh function when pulled down
                colors={[COLOR.Primary]} // Set your preferred color for the loading indicator
              />
            }
          />
        </View>
      </View>
      <Modal
        transparent={true}
        visible={modalCategoryVisible}
        onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={[styles.modalOverlay]}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.modalContainer,
                  {
                    transform: [
                      {
                        translateY: slideAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [layout.height, 0],
                        }),
                      },
                    ],
                  },
                  {
                    backgroundColor:
                      darkMode === 'enable'
                        ? COLOR.DarkThemLight
                        : COLOR.White100,
                  },
                ]}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  {/* Rest of the modal content */}
                </View>

                <View style={{ alignSelf: 'flex-end' }}>
                  <TouchableOpacity
                    style={{ justifyContent: 'flex-end' }}
                    onPress={closeJobModal}>
                    <Image
                      source={
                        darkMode == 'enable'
                          ? IconManager.close_dark
                          : IconManager.close_light
                      }
                      resizeMode="contain"
                      style={{ width: 18, height: 18 }}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ height: modalHeight }}>
                  {/* <Text style={[styles.itemTitle, { color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500 }]}>Job Status</Text>
                  <View style={styles.justifyContent}>
                    {jobStatus.map((item, index) => {
                      let isActive = selectedType === item.id;
                      let backgroundColor = isActive
                        ? COLOR.Primary
                        : darkMode === 'enable'
                          ? COLOR.DarkFadeLight
                          : COLOR.White100;
                      let color = isActive
                        ? COLOR.White
                        : darkMode === 'enable'
                          ? COLOR.White100
                          : COLOR.Grey500;

                      return (
                        <Pressable
                          key={index}
                          activeOpacity={0.9}
                          onPress={() => {
                            setSelectedType(item.id);

                            // Check if 'true' (already applied) or 'false' (not applied)
                            filterJobsByApplyStatus(item.id === 'true');
                          }}
                          style={[styles.applyButton, { backgroundColor }]}>
                          <Text style={[styles.outlineButtonText, { color }]}>
                            {item.name}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View> */}

                  <SizedBox height={SPACING.sp10} />
                  <Text style={[styles.itemTitle, { color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500 }]}>Job Type</Text>
                  <View style={styles.flexRowWrap}>
                    {jobType.map((item, index) => {
                      let isActive = selectedType === item.id;
                      let backgroundColor = isActive
                        ? COLOR.Primary
                        : darkMode === 'enable'
                          ? COLOR.DarkFadeLight
                          : COLOR.White100;
                      let color = isActive
                        ? COLOR.White
                        : darkMode === 'enable'
                          ? COLOR.White100
                          : COLOR.Grey500;
                      return (
                        <Pressable
                          key={index}
                          activeOpacity={0.9}
                          onPress={() => setSelectedType(item.id)}
                          style={[styles.outlineButton, { backgroundColor }]}>
                          <Text style={[styles.outlineButtonText, { color }]}>
                            {item.name}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  <SizedBox height={SPACING.sp10} />
                  <Text style={[styles.itemTitle, { color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500 }]}>Category</Text>
                  <View style={styles.flexRowWrap}>
                    {jobCategories.map((item, index) => {
                      let isActive = selectedCategory === item.id;
                      let backgroundColor = isActive
                        ? COLOR.Primary
                        : darkMode === 'enable'
                          ? COLOR.DarkFadeLight
                          : COLOR.White100;
                      let color = isActive
                        ? COLOR.White
                        : darkMode === 'enable'
                          ? COLOR.White100
                          : COLOR.Grey500;
                      return (
                        <Pressable
                          key={index}
                          activeOpacity={0.9}
                          onPress={() => setSelectedCategory(item.id)}
                          style={[styles.outlineButton, { backgroundColor }]}>
                          <Text style={[styles.outlineButtonText, { color }]}>
                            {item.name}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: SPACING.sp10,
                    }}>
                    <TouchableOpacity style={{ flex: 0.2 }} onPress={handleClear}>
                      <Text style={[styles.itemDescription, { color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500 }]}>Clear</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={onSubmit}>
                      <Text style={styles.submitText}>Submit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default JobLists;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: COLOR.White50,
  },
  dsafeAreaView: {
    flex: 1,
    backgroundColor: COLOR.DarkTheme,
  },
  container: {
    flex: 1,
    padding: SPACING.sp15,

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
    borderRadius: RADIUS.rd12,

  },
  jobContainer: {
    flexDirection: 'row',
    flex: 1,
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
    shadowOffset: { width: 0, height: 2 },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLOR.White100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalText: {
    fontSize: fontSizes.size16,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  outlineButton: {
    paddingVertical: SPACING.sp5,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.rd8,
    borderCurve: 'continuous',
    borderColor: COLOR.Primary,
    borderWidth: 1,
    alignItems: 'center',
  },
  applyButton: {
    flex: 0.5,
    paddingVertical: SPACING.sp5,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.rd8,
    borderCurve: 'continuous',
    borderColor: COLOR.Primary,
    borderWidth: 1,
    alignItems: 'center',
  },
  outlineButtonText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
  },
  flexRowWrap: {
    gap: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.sm,
  },
  justifyContent: {
    flexDirection: 'row',
    gap: 8,
    marginTop: SPACING.sm,
  },
  timeCard: {
    borderRadius: RADIUS.rd7,
    backgroundColor: COLOR.White,
    borderColor: COLOR.Grey100,
    borderWidth: 1,
    flex: 0.5,
    // paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  DtimeCard: {
    borderRadius: RADIUS.rd7,
    backgroundColor: COLOR.DarkFadeLight,
    borderColor: COLOR.Grey100,
    borderWidth: 1,
    flex: 0.5,
    // paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  timeText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
  },
  submitButton: {
    backgroundColor: COLOR.Primary,
    flex: 0.8,
    height: 40,
    borderRadius: RADIUS.rd8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size15,
    color: COLOR.White100,
  },
});
