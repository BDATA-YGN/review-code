import React, {useEffect, useState, useRef} from 'react';
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
  ImageBackground,
  Button,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import SPACING from '../../constants/SPACING';
import COLOR from '../../constants/COLOR';
import {FontFamily, fontSizes} from '../../constants/FONT';
import RADIUS from '../../constants/RADIUS';
import SizedBox from '../../commonComponent/SizedBox';
import {
  getRecommentedGroupOrPageList,
  likeUnlineAction,
} from '../../helper/ApiModel';
import DualAvater from '../../components/DualAvater';
import IconManager from '../../assets/IconManager';
import en from '../../i18n/en';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import PageItemListShimmer from './PageItemsListShimmer';
import {stringKey} from '../../constants/StringKey';
import {useDispatch, useSelector} from 'react-redux';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {retrieveStringData, storeKeys} from '../../helper/AsyncStorage';

const SuggestedPageScreen = () => {
  const navigationAppBar = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recommendedList, setRecommendetList] = useState([]);
  const [shimmer, setShimmer] = useState(true);

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
    getDarkModeTheme();
  }, []);
  useEffect(() => {
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);

  const onRefresh = () => {
    fetchRecommendedPages();
  };

  useEffect(() => {
    fetchRecommendedPages();
    setTimeout(() => {
      setShimmer(false);
    }, 500);
  }, []);
  const fetchRecommendedPages = () => {
    getRecommentedGroupOrPageList('pages').then(data => {
      if (data.api_status == 200) {
        setLoading(false);
        setRecommendetList(data.data);
      } else {
        setLoading(true);
      }
    });
  };

  const joinpage = (item, index) => {
    const updatedList = [...recommendedList];
    if (index >= 0 && index < updatedList.length) {
      likeUnlineAction(item.page_id).then(data => {
        if (data.api_status == 200) {
          if (data.like_status == 'liked') {
            updatedList[index].is_liked = true;
            setRecommendetList(updatedList);
          } else {
            updatedList[index].is_liked = false;
            setRecommendetList(updatedList);
          }
        } else {
        }
      });
    } else {
      console.error('Invalid index to remove');
    }
  };

  const handleJoinGroupClcik = item => {
    navigationAppBar.navigate('SuggestedGroupScreen', {data: item});
  };

  const renderSuggestedPageItem = ({item, index}) => (
    <TouchableOpacity
      activeOpacity={1}
      style={{
        alignSelf: 'center',
        borderRadius: 8,
        width: '100%',
        paddingVertical: 8,
        backgroundColor: darkMode === 'enable' && COLOR.DarkThemLight,
      }}>
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: SPACING.sp8,
        }}>
        <DualAvater
          largerImageWidth={55}
          largerImageHeight={55}
          src={item.avatar}
          smallIcon={IconManager.page_line_white}
          isIconColor={false}
          iconBadgeEnable={true}
        />
        <View style={{flex: 1, marginLeft: 8}}>
          <Text
            numberOfLines={1}
            style={[
              styles.headerText,
              {color: darkMode === 'enable' && COLOR.White100},
            ]}>
            {item.username}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              styles.bodyText,
              {color: darkMode === 'enable' && COLOR.White100},
            ]}>
            {item.category}
          </Text>
        </View>
      </View>
      <SizedBox height={SPACING.sp8} />
      <View
        style={{
          width: '100%',
          justifyContent: 'flex-end',
          flexDirection: 'row',
        }}>
        <View style={{width: '18%'}} />
        <View
          style={{
            flexDirection: 'row',
            width: '82%',
            justifyContent: 'space-evenly',
          }}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.buttonStyle,
              {
                borderWidth: 1,
                borderColor: COLOR.Primary,
                paddingHorizontal: 16,
                backgroundColor: item.is_liked
                  ? darkMode === 'enable'
                    ? COLOR.DarkThemLight
                    : COLOR.Grey50
                  : COLOR.Primary,
              },
            ]}
            onPress={() => joinpage(item, index)}>
            <Text
              style={[
                styles.buttonText,
                {color: item.is_liked ? COLOR.Primary : COLOR.Grey50},
              ]}>
              {item.is_liked ? en.unLike : en.like}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.buttonStyleViewPage]}
            onPress={() =>
              navigationAppBar.navigate('ViewDiscoverPage', {
                pageData: item,
                myNavigatedId: item.page_id,
                canPost: stringKey.canPost,
              })
            }>
            <Text style={[styles.buttonTextViewPage]}>{en.viewPage}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  //   useEffect(() => {
  //     fetchRecommendedPages()
  //     setTimeout(() => {
  //       setShimmer(false)
  //     }, 500);
  //   }, [])

  return (
    <SafeAreaView
      style={{
        backgroundColor:
          darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White100,
        flex: 1,
      }}>
      <ActionAppBar
        appBarText={en.suggestedPage}
        darkMode={darkMode}
        source={IconManager.back_light}
        backpress={() => {
          navigationAppBar.goBack();
        }}
        actionButtonPress={() => {
          //navigate to create page
        }}
      />
      {/* <SizedBox height={SPACING.sp8} /> */}
      <View style={{backgroundColor: COLOR.DarkTheme}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLOR.Primary]}
            />
          }
          ListFooterComponent={() => (
            <View
              style={{
                backgroundColor:
                  darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White100,
              }}>
              {shimmer ? (
                <PageItemListShimmer
                  darkMode={darkMode}
                  isActionEnable={true}
                />
              ) : (
                <View
                  style={{
                    backgroundColor:
                      darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White100,
                  }}>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      backgroundColor:
                        darkMode === 'enable'
                          ? COLOR.DarkTheme
                          : COLOR.White100,
                    }}>
                    <View
                      style={{
                        borderRadius: 4,
                        backgroundColor:
                          darkMode === 'enable'
                            ? COLOR.DarkTheme
                            : COLOR.White100,
                      }}>
                      <SizedBox height={8} />
                      <View>
                        <Text
                          style={[
                            styles.headerText,
                            {color: darkMode === 'enable' && COLOR.White100},
                          ]}>
                          {en.ramdomPage}
                        </Text>
                      </View>
                      <SizedBox height={8} />
                      <FlatList
                        showsHorizontalScrollIndicator={false}
                        data={recommendedList}
                        renderItem={renderSuggestedPageItem}
                        keyExtractor={(item, index) => index}
                        horizontal={false}
                      />
                      <SizedBox height={8} />
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonTextViewPage: {
    fontSize: fontSizes.size14,
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Grey500,
    paddingVertical: SPACING.sp6,
    alignSelf: 'center',
  },
  buttonStyleViewPage: {
    backgroundColor: COLOR.SocialBakcground,
    borderRadius: RADIUS.rd30,
    width: '45%',
  },
  container: {
    flex: 1,
    backgroundColor: '#E8E8E8',
    marginBottom: 0,
    marginTop: 16,
  },
  headerText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size16,
    color: COLOR.Grey500,
  },
  bodyText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size12,
    color: COLOR.Grey300,
  },
  buttonText: {
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.White100,
    paddingVertical: SPACING.sp6,
    alignSelf: 'center',
  },
  buttonStyle: {
    backgroundColor: COLOR.Primary,
    borderRadius: RADIUS.rd30,
    width: '45%',
  },
  buttonTextSeeAll: {
    fontSize: fontSizes.size16,
    fontFamily: FontFamily.PoppinSemiBold,
    color: COLOR.White100,
    paddingVertical: SPACING.sp10,
    alignSelf: 'center',
  },
});

export default SuggestedPageScreen;
