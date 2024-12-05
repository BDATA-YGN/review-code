import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  ImageBackground,
} from 'react-native';
import React from 'react';
import ActionAppBar from '../commonComponent/ActionAppBar';
import {useNavigation, useRoute} from '@react-navigation/native';
import IconManager from '../assets/IconManager';
import SPACING from '../constants/SPACING';
import RADIUS from '../constants/RADIUS';
import COLOR from '../constants/COLOR';
import {TabView} from 'react-native-tab-view';
import {useMemo} from 'react';
import {SceneMap} from 'react-native-tab-view';
import {useState} from 'react';
import Animated from 'react-native-reanimated';
import {fontSizes} from '../constants/FONT';
import {FontFamily} from '../constants/FONT';
import {setFetchDarkMode} from '../stores/slices/DarkModeSlice';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect} from 'react';
import {retrieveStringData} from '../helper/AsyncStorage';
import {storeKeys} from '../helper/AsyncStorage';
import {Dimensions} from 'react-native';
import SizedBox from '../commonComponent/SizedBox';
import PIXEL from '../constants/PIXEL';
import {fontWeight} from '../constants/FONT';
import i18n from '../i18n';
import {TouchableWithoutFeedback, WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import {
  getAllEventsList,
  getGoingEventList,
  getInterestedEventList,
  getInvitedEventList,
  getMyEventList,
  getPastEventList,
} from '../helper/ApiModel';
import PostShimmer from '../components/Post/PostShimmer';
import EventDetail from './EventDetail';
import en from '../i18n/en';
import { setFetchDeleteEvent } from '../stores/slices/DeleteEventSlice';

const Event = (props) => {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  const fetchDeleteEvent = useSelector(state => state.DeleteEventSlice.fetchDeleteEvent);
  const [id,setId] = useState('');
  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   const day = String(date.getDate()).padStart(2, '0');
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const year = String(date.getFullYear()).slice(-2);
  //   return `${day}-${month}-${year}`;
  // };
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
};

  const [routes] = useState([
    {
      key: 'all',
      title: 'All Events',
      colorId: COLOR.White100,
      iconColorID: COLOR.White100,
    },
    {
      key: 'going',
      title: 'Going',
      colorId: COLOR.Primary,
      iconColorID: COLOR.Primary,
    },
    {
      key: 'invited',
      title: 'Invited',
      colorId: COLOR.Primary,
      iconColorID: COLOR.Primary,
    },
    {
      key: 'interested',
      title: 'Interested',
      colorId: COLOR.Primary,
      iconColorID: COLOR.Primary,
    },
    {key: 'past', 
      title: 'Past' ,
      colorId: COLOR.Primary,
      iconColorID: COLOR.Primary,},
    {
      key: 'my_events',
      title: 'My Events',
      colorId: COLOR.Primary,
      iconColorID: COLOR.Primary,
    },
  ]);
  const [darkMode, setDarkMode] = useState(null); // State for dark mode theme
  const [eventData, setEventData] = useState({
    all: [],
    going: [],
    invited: [],
    interested: [],
    past: [],
    my_events: [],
  });

  const [loadingData, setLoadingData] = useState({
    all: true,
    going: true,
    invited: true,
    interested: true,
    past: true,
    my_events: true,
  });



  const handleRefresh = () => {
    setRefreshing(true);
    fetchEventData(routes[index].key);
  };

  const fetchEventData = async (type) => {
    try {
      switch (type) {
        case 'all':
          setLoadingData(prevLoadingData => ({ ...prevLoadingData, all: true }));
          const allEventsResponse = await getAllEventsList();
          setEventData(prevData => ({ ...prevData, all: allEventsResponse.events }));
          setLoadingData(prevLoadingData => ({ ...prevLoadingData, all: false }));
          dispatch(setFetchDeleteEvent(false));
          break;
        case 'going':
          setLoadingData(prevLoadingData => ({ ...prevLoadingData, going: true }));
          const goingEventsResponse = await getGoingEventList();
          setEventData(prevData => ({ ...prevData, going: goingEventsResponse.going }));
          setLoadingData(prevLoadingData => ({ ...prevLoadingData, going: false }));
          dispatch(setFetchDeleteEvent(false));
          break;
        case 'invited':
          setLoadingData(prevLoadingData => ({ ...prevLoadingData, invited: true }));
          const invitedEventsResponse = await getInvitedEventList();
          setEventData(prevData => ({ ...prevData, invited: invitedEventsResponse.invited }));
          setLoadingData(prevLoadingData => ({ ...prevLoadingData, invited: false }));
          dispatch(setFetchDeleteEvent(false));
          break;
        case 'interested':
          setLoadingData(prevLoadingData => ({ ...prevLoadingData, interested: true }));
          const interestedEventsResponse = await getInterestedEventList();
          setEventData(prevData => ({ ...prevData, interested: interestedEventsResponse.interested }));
          setLoadingData(prevLoadingData => ({ ...prevLoadingData, interested: false }));
          dispatch(setFetchDeleteEvent(false));
          break;
        case 'past':
          setLoadingData(prevLoadingData => ({ ...prevLoadingData, past: true }));
          const pastEventsResponse = await getPastEventList();
          setEventData(prevData => ({ ...prevData, past: pastEventsResponse.past }));
          setLoadingData(prevLoadingData => ({ ...prevLoadingData, past: false }));
          dispatch(setFetchDeleteEvent(false));
          break;
        case 'my_events':
          setLoadingData(prevLoadingData => ({ ...prevLoadingData, my_events: true }));
          const myEventsResponse = await getMyEventList();
          setEventData(prevData => ({ ...prevData, my_events: myEventsResponse.my_events }));
          setLoadingData(prevLoadingData => ({ ...prevLoadingData, my_events: false }));
          dispatch(setFetchDeleteEvent(false));
          break;
        default:
          break;
      }
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching event data:', error);
      setRefreshing(false);
    }
  };

  useEffect(() => {
   
      fetchEventData(routes[index].key);
      
      getDarkModeTheme();
    
    
    
   
  }, [index]);

   useEffect(() => {
    if(fetchDeleteEvent){
      fetchEventData(routes[index].key);
      
      getDarkModeTheme();
    }
    
    
   
  }, [fetchDeleteEvent]);
  
  const renderScene = SceneMap({
    all: () => renderEventList('all'),
    going: () => renderEventList('going'),
    invited: () => renderEventList('invited'),
    interested: () => renderEventList('interested'),
    past: () => renderEventList('past'),
    my_events: () => renderEventList('my_events'),
  });


  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);

  const renderEventList = type => {
    const events = eventData[type];
    const loading = loadingData[type];

    return (
      <View style={{flex: 1}}>
        {loading ? (
          <PostShimmer />
        ) : events && events.length > 0 ? (
          
            <FlatList
            data={events}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => (
              <TouchableWithoutFeedback  onPress={() => navigation.navigate('EventDetail', { eventId: item.id })} >
              <View style={styles.imgContainer}>
                <Image
                  style={[styles.imgStyle]}
                  resizeMode="cover"
                  src={item.cover}
                />
                <View style={darkMode == 'enable' ? styles.DtextContainer :styles.textContainer}>
                  <Text style={ darkMode == 'enable' ? styles.Dtext1 :styles.text1}>{item.name}</Text>
                  <Text numberOfLines={1} style={darkMode == 'enable' ? styles.Dtext2 :styles.text2}>
                    {item.description}
                  </Text>

                  <View style={styles.content}>
                    <View style={{flex: 0.3, flexDirection: 'row'}}>
                      <View style={{marginRight: SPACING.sp5}}>
                        <Image
                          resizeMode="contain"
                          style={{width: 20, height: 20}}
                          source={darkMode == 'enable' ? IconManager.calender_dark : IconManager.calender_light}
                        />
                      </View>
                      <Text style={darkMode == 'enable' ? styles.Dtext2 :styles.text2}> {item.start_date}</Text>
                    </View>
                    <View style={{flex: 0.7, flexDirection: 'row'}}>
                      <View style={{marginRight: SPACING.sp5}}>
                        <Image
                          resizeMode="contain"
                          style={{width: 20, height: 20}}
                          source={darkMode == 'enable' ? IconManager.event_location_dark :IconManager.event_location_light}
                        />
                      </View>
                      <Text style={darkMode == 'enable' ? styles.Dtext2 :styles.text2}>{item.location}</Text>
                    </View>
                  </View>
                </View>
              </View>
              </TouchableWithoutFeedback>
            )}
         
            refreshControl={
              <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
            }
          />
       
        ) : (
          <EventEmpty />
        )}
      </View>
    );
  };

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
    getDarkModeTheme();
  }, []);


  const _handleIndexChange = selectedIndex => {
    setIndex(selectedIndex);

    const baseColor = darkMode === 'enable' ? COLOR.Primary : COLOR.Grey500;
    const baseIconColor = COLOR.Primary;

    routes.forEach((route, index) => {
      route.colorId = index === selectedIndex ? COLOR.White100 : baseColor;
      route.iconColorID =
        index === selectedIndex ? COLOR.White100 : baseIconColor;
    });
  };
  const _renderTabBar = props => {
    const inputRange = props.navigationState.routes.map((x, i) => i);

    return (
      <View style={styles.tabBar}>
        <ScrollView
          style={{borderBottomWidth: 0.3, borderColor: COLOR.Grey100}}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal={true}>
          {props.navigationState.routes.map((route, i) => {
            // const backgroundColor = props.position.interpolate({
            //   inputRange,
            //   outputRange: inputRange.map(inputIndex =>
            //     inputIndex === i ?  COLOR.Primary : COLOR.Blue50
            //   ),
            // });

            // const textColor =
            //   darkMode == 'enable' ? COLOR.White : COLOR.Grey400;

            const opacity = props.position.interpolate({
              inputRange,
              outputRange: inputRange.map(inputIndex =>
                inputIndex === i ? 1 : 2,
              ),
            });
            const backgroundColor = props.position.interpolate({
              inputRange,
              outputRange: inputRange.map(inputIndex =>
                inputIndex === i
                  ? COLOR.Primary
                  : darkMode === 'enable'
                  ? COLOR.DarkFadeLight
                  : COLOR.Blue50,
              ),
            });

            return (
              <TouchableOpacity
                activeOpacity={opacity}
                style={[
                  styles.tabItem,
                  {
                    backgroundColor: backgroundColor,
                    borderRadius: RADIUS.rd100,
                    marginHorizontal: SPACING.sp8,
                    marginVertical: SPACING.sp10,
                    minWidth: 68,
                  },
                ]}
                onPress={() => {
                  _handleIndexChange(i);
                  // props.jumpTo(route.key);
                }}
                key={route.key}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <Animated.Text
                      style={{
                        textAlign: 'center',
                        fontSize: fontSizes.size15,
                        color: routes[i].colorId,
                        fontFamily: FontFamily.PoppinRegular,
                        paddingHorizontal: SPACING.sp25,
                      }}>
                      {route.title}
                    </Animated.Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };
  const EventEmpty = () => {
    const [loading, setLoading] = useState(false);

    // Get screen dimensions
    const {width} = Dimensions.get('window');

    // Calculate the icon size
    const iconSize = width * 0.5;

    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          width: '100%',
        }}>
        <Image
          resizeMode="contain"
          style={{
            width: WINDOW_WIDTH - 80,
            height: undefined,
            aspectRatio: 1,
            marginTop: '15%',
          }}
          source={
            darkMode == 'enable'
              ? IconManager.event_empty_light
              : IconManager.event_empty_light
          }
        />

        {/* <SizedBox height={PIXEL.px20} /> */}
        <Text
          style={{
            fontFamily: FontFamily.PoppinSemiBold,
            fontSize: fontSizes.size23,
            color: darkMode == 'enable' ? COLOR.White : COLOR.Grey500,
            fontWeight: fontWeight.weight700,
          }}>
          {i18n.t(`translation:noEvent`)}
        </Text>
        <SizedBox height={PIXEL.px8} />
        <Text
          style={{
            textAlign: 'center',
            marginHorizontal: SPACING.sp24,
            fontFamily: FontFamily.PoppinRegular,
            fontSize: fontSizes.size15,
            color: darkMode == 'enable' ? COLOR.White100 : COLOR.Grey500,
          }}>
          {i18n.t(`translation:noEventToShow`)}
        </Text>
        <SizedBox height={PIXEL.px30} />
      </View>
    );
  };
  
  return (
    <SafeAreaView style={ darkMode == 'enable' ? styles.darkContainer :styles.container}>
      
      <ActionAppBar
          appBarText="Event"
          source={IconManager.back_light}
          backpress={() => navigation.goBack()}
          actionButtonPress={() => {
            navigation.navigate('CreateEventOne');
          }}
          actionButtonText={en.create}
          actionButtonType="text-button"
          darkMode = {darkMode}
  
/>
      <View style={{flex: 4.5}}>
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          renderTabBar={_renderTabBar}
          onIndexChange={_handleIndexChange}
         
        />
      </View>
    </SafeAreaView>
  );
};

export default Event;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White100,
  },
  darkContainer: {
    flex: 1,
    backgroundColor: COLOR.DarkTheme
  },
  tabBar: {
    flexDirection: 'row',
    // borderColor:COLOR.Grey100,
    // borderWidth:0.5,
    // paddingVertical:SPACING.sp5
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: SPACING.sp10,
    paddingHorizontal: SPACING.sp10,
    // paddingHorizontal: 16,
    borderRadius: RADIUS.rd100,
  },
  imgContainer: {
    flex: 1,
    width: '90%',
    height: '100%',
    borderRadius: RADIUS.rd12,
    marginHorizontal: SPACING.sp20,
    marginVertical: SPACING.sp10,
    overflow: 'hidden',
    marginBottom: 10,
    // // Shadow for iOS
    shadowColor: COLOR.Grey300,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Elevation for Android
    elevation: 5,
    
  },
  DimgContainer: {
    flex: 1,
    width: '90%',
    height: '100%',
    borderRadius: RADIUS.rd8,
    marginHorizontal: SPACING.sp20,
    marginVertical: SPACING.sp12,
    overflow: 'hidden',
    marginBottom: 10,
    borderRadius: 10,
    // // Shadow for iOS
    shadowColor: COLOR.Grey300,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // // Elevation for Android
    elevation: 5,
  },

  imgStyle: {
    width: '100%',
    height: 200,
  },

  textContainer: {
    // flex: 1, // Take up half of the space
    width:'100%',
    justifyContent: 'center',
    backgroundColor:COLOR.White,
    
    padding:SPACING.sp10
  },
  DtextContainer: {
    // flex: 1, // Take up half of the space
    width:'100%',
    justifyContent: 'center',
    borderWidth: 0.25,
    backgroundColor:COLOR.Primary,
    borderTopColor : COLOR.Blue200,
    borderWidth:0.25,
    padding:SPACING.sp10
  },


  text1: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
    fontWeight: fontWeight.weight400,
    color: COLOR.Grey500,
  },
  Dtext1: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
    fontWeight: fontWeight.weight400,
    color: COLOR.White100,
  },
  text2: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size13,
    color: COLOR.Grey500,
    fontWeight: fontWeight.weight400,
  },
  Dtext2: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size13,
    color: COLOR.White100,
    fontWeight: fontWeight.weight400,
  },
  
  content: {
    flexDirection: 'row',
    // flex: 1,
    marginTop: SPACING.sp8,
    justifyContent: 'center',
  },
});
