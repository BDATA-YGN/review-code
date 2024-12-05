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
import COLOR from '../../constants/COLOR';
import {FontFamily, fontSizes} from '../../constants/FONT';
import RADIUS from '../../constants/RADIUS';
import SPACING from '../../constants/SPACING';
import IconManager from '../../assets/IconManager';
import en from '../../i18n/en';
import {
  getRecommentedGroupOrPageList,
  joinUnjionGroupAction,
  likeUnlineAction,
} from '../../helper/ApiModel';
import SizedBox from '../../commonComponent/SizedBox';
import DualAvater from '../../components/DualAvater';
import PIXEL from '../../constants/PIXEL';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import RecommendedPageScreenShimmer from '../PageProfile/RecommendedPageScreenShimmer';
import {stringKey} from '../../constants/StringKey';
import {useDispatch, useSelector} from 'react-redux';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {retrieveStringData, storeKeys} from '../../helper/AsyncStorage';

const RecommendedGroupScreen = ({route}) => {
  const {recommendedPageList} = route.params;
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
    getRecommentedGroupOrPageList('groups').then(data => {
      if (data.api_status == 200) {
        setLoading(false);
        setRecommendetList(data.data);
      } else {
        setLoading(true);
      }
    });
  };

  const joingroup = (item, index) => {
    const updatedList = [...recommendedList];
    if (index >= 0 && index < updatedList.length) {
      joinUnjionGroupAction(item.group_id).then(data => {
        if (data.api_status == 200) {
          if (item.privacy == 2) {
            data.join_status == 'requested'
              ? (updatedList[index].is_group_joined = 2)
              : (updatedList[index].is_group_joined = 0);
            setRecommendetList(updatedList);
            // // Remove the element at the specified index
            // updatedList.splice(index, 1);
            // // Update the state with the new array
            // setRecommendetList(updatedList);
          } else {
            data.join_status == 'joined'
              ? (updatedList[index].is_group_joined = 1)
              : (updatedList[index].is_group_joined = 0);
            setRecommendetList(updatedList);
          }
        } else {
        }
      });
    } else {
      console.error('Invalid index to remove');
    }
  };

  const handleSuggestedForYouPageClick = () => {
    navigationAppBar.navigate('SuggestedPageScreen');
  };

  const handleDiscoverGroupClick = item => {
    navigationAppBar.navigate('SuggestedGroupScreen', {data: item});
  };

  const renderJoinedGroupItem = ({item, index}) => (
    <TouchableOpacity
      onPress={() => {
        navigationAppBar.navigate('ViewRecommendedGroup', {
          pageData: item,
          myNavigatedId: item.group_id,
          canPost: stringKey.canPost,
        });
      }}
      activeOpacity={0.8}
      style={styles.rectangleGroup}>
      <Image
        style={[styles.frameChild4, styles.frameChildLayout]}
        resizeMode="cover"
        src={item.cover.trim()}
      />
      <View
        style={[
          styles.frameParent3,
          styles.frameSpaceBlock,
          {backgroundColor: darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.Blue50} ,
        ]}>
        <View style={[styles.instanceParent,{backgroundColor: darkMode === 'enable' ? COLOR.DarkThemLight: COLOR.Blue50}]}>
          <Image
            style={styles.frameItem}
            resizeMode="cover"
            src={item?.avatar  }
          />
          <View style={styles.textParent}>
            <Text
              numberOfLines={1}
              style={[
                styles.airStyle,
                {color: darkMode === 'enable' && COLOR.White100},
              ]}>
              {item.group_name}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.gaming,
                styles.textTypo,
                {color: darkMode === 'enable' && COLOR.White100},
              ]}>
              @{item.category}
            </Text>
          </View>
        </View>
        {/* <TouchableOpacity style={[styles.buttonStyle, { borderWidth: 1, borderColor: Color.Primary, backgroundColor: item.is_group_joined == 0 ? Color.Primary : Color.Grey50 }]} onPress={() => joinGroup(item, index)} >
                    <Text style={[styles.buttonText, { color: item.is_group_joined == 0 ? Color.Grey50 : Color.Grey500 }]}>{item.is_group_joined == 0 ? 'Join Group' : item.is_group_joined == 2 ? 'Requested' : 'Joined'}</Text>
                </TouchableOpacity> */}
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => joingroup(item, index)}>
          <View
            style={
              item.is_group_joined == 0
                ? styles.buttonStyle1
                : [
                    styles.buttonStyle2,
                    {
                      backgroundColor:
                        darkMode === 'enable' && COLOR.DarkThemLight,
                    },
                  ]
            }>
            <Text
              style={[
                item.is_group_joined == 0
                  ? styles.pages1Typo
                  : styles.pages1Typo1,
              ]}>
              {item.is_group_joined == 0
                ? 'Join Group'
                : item.is_group_joined == 2
                ? 'Requested'
                : 'Joined'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
     
    </TouchableOpacity>
  );

  const renderRamdomGroup = ({item, index}) => (
    <TouchableOpacity
      style={{
        alignSelf: 'center',
        borderRadius: 8,
        width: '100%',
        paddingVertical: 8,
      }}
      // onPress={() => {navigationAppBar.navigate('ViewRecommendedGroup', {pageData: item,myNavigatedId: item.group_id, canPost: stringKey.canPost})}}
      activeOpacity={1}>
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <DualAvater
          largerImageWidth={55}
          largerImageHeight={55}
          src={item.avatar}
          smallIcon={IconManager.group_line_white}
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
          {/* <TouchableOpacity style={[styles.buttonStyle, { borderWidth: 1, borderColor: Color.Primary, backgroundColor: item.is_group_joined == 0 ? Color.Primary : Color.Grey50, paddingHorizontal: 12, borderRadius: 30 }]} onPress={() => joinGroup(item, index)} >
                        <Text style={[styles.buttonText, { color: item.is_group_joined == 0 ? Color.Grey50 : Color.Grey500 }]}>{item.is_group_joined == 0 ? 'Join Group' : item.is_group_joined == 2 ? 'Requested' : 'Joined'}</Text>
                    </TouchableOpacity> */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.buttonStyle,
              {
                borderWidth: 1,
                borderColor: COLOR.Primary,
                paddingHorizontal: 16,
                backgroundColor:
                  item.is_group_joined == 0
                    ? COLOR.Primary
                    : darkMode === 'enable'
                    ? COLOR.DarkThemLight
                    : COLOR.Blue50,
              },
            ]}
            onPress={() => joingroup(item, index)}>
            <Text
              style={[
                styles.buttonText,
                {
                  color:
                    item.is_group_joined == 0 ? COLOR.Blue50 : COLOR.Primary,
                },
              ]}>
              {item.is_group_joined == 0
                ? en.joinGroup
                : item.is_group_joined == 2
                ? en.requested
                : en.joined}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.buttonStyleViewPage]}
            // onPress={() => navigationAppBar.navigate('ViewDiscoverPage',{pageData: item})}
            onPress={() => {
              navigationAppBar.navigate('ViewRecommendedGroup', {
                pageData: item,
                myNavigatedId: item.group_id,
                canPost: stringKey.canPost,
              });
            }}>
            <Text style={[styles.buttonTextViewPage]}>{en.viewGroup}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View height={1} width = {350} style={{backgroundColor : COLOR.Grey50,marginTop : SPACING.sp10 ,alignSelf:'center'}} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White100,
      }}>
      <ActionAppBar
        appBarText={'Discover'}
        source={IconManager.back_light}
        darkMode={darkMode}
        backpress={() => {
          navigationAppBar.goBack();
        }}
        actionButtonPress={() => {}}
      />
      <SizedBox height={SPACING.sp8} />
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
          <View>
            {shimmer ? (
              <RecommendedPageScreenShimmer darkMode={darkMode} />
            ) : (
              <View>
                <View
                  style={{
                    paddingHorizontal: 8,
                    backgroundColor:
                      darkMode === 'enable'
                        ? COLOR.DarkThemLight
                        : COLOR.White100,
                  }}>
                  <View style={{borderRadius: 4}}>
                    <SizedBox height={8} />
                    <View>
                      <Text
                        style={[
                          styles.headerText,
                          {color: darkMode === 'enable' && COLOR.White100},
                        ]}>
                        {en.suggestedForYou}
                      </Text>
                    </View>
                    <SizedBox height={10} />
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      data={recommendedList}
                      renderItem={renderJoinedGroupItem}
                      keyExtractor={(item, index) => index}
                      horizontal={true}
                    />
                    <SizedBox height={10} />
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[styles.buttonStyleSuggested]}
                      onPress={() =>
                        navigationAppBar.navigate('SuggestedGroupList')
                      }>
                      <Text style={[styles.buttonTextSeeAll]}>{en.seeAll}</Text>
                    </TouchableOpacity>
                    <SizedBox height={8} />
                  </View>
                </View>
                <SizedBox height={SPACING.sp8} />
                <View
                  style={{
                    paddingHorizontal: 8,
                    backgroundColor:
                      darkMode === 'enable'
                        ? COLOR.DarkThemLight
                        : COLOR.White100,
                  }}>
                  <View style={{borderRadius: 4}}>
                    <SizedBox height={8} />
                    <View>
                      <Text
                        style={[
                          styles.headerText,
                          {color: darkMode === 'enable' && COLOR.White100},
                        ]}>
                        {en.ramdomGroup}
                      </Text>
                    </View>
                    <SizedBox height={8} />
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      data={recommendedList}
                      renderItem={renderRamdomGroup}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  buttonTextViewPage: {
    fontSize: fontSizes.size14,
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Grey500,
    paddingVertical: SPACING.sp6,
    alignSelf: 'center',
  },
  buttonStyle: {
    backgroundColor: COLOR.Primary,
    borderRadius: RADIUS.rd30,
    width: '45%',
  },
  buttonStyleViewPage: {
    backgroundColor: COLOR.SocialBakcground,
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
  bodyText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.Grey300,
  },
  headerText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size19,
    color: COLOR.Grey500,
  },
  seeAll: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size14,
    color: COLOR.Primary,
  },
  titleText: {
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size19,
    color: COLOR.Grey500,
    flex: 1,
  },
  myPageItemCard: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 10,
    width: PIXEL.px50,
    height: PIXEL.px50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure the icon is above other content
  },
  textTypo: {
    fontFamily: FontFamily.PoppinBold,
    textAlign: 'left',
  },
  frameChildLayout: {
    height: PIXEL.px110,
    width: PIXEL.px150,
  },
  frameSpaceBlock: {
    padding: SPACING.xxxxs,
    backgroundColor: COLOR.SocialBakcground,
    alignItems: 'center',
  },
  pages1Typo: {
    textAlign: 'center',
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Blue50,
  },
  pages1Typo1: {
    textAlign: 'center',
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Primary,
  },
  frameItem: {
    width: PIXEL.px30,
    height: PIXEL.px30,
    borderRadius: RADIUS.rd13,
  },
  airStyle: {
    fontSize: fontSizes.size15,
    fontFamily: FontFamily.PoppinRegular,
    textAlign: 'left',
    color: COLOR.Grey500,
  },
  gaming: {
    fontSize: fontSizes.size12,
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Grey300,
    alignItems: 'center',
  },
  textParent: {
    height: 42,
    marginLeft: 10,
    width: 101,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  instanceParent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primary: {
    color: COLOR.White50,
  },
  buttonStyle1: {
    borderRadius: RADIUS.rd10,
    backgroundColor: COLOR.Primary,
    width: PIXEL.px140,
    height: PIXEL.px35,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: COLOR.Primary,
    borderWidth: 1,
  },
  buttonStyle2: {
    borderRadius: RADIUS.rd10,
    backgroundColor: COLOR.Blue50,
    width: PIXEL.px140,
    height: PIXEL.px35,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: COLOR.Primary,
    borderWidth: 1,
  },
  buttonStyleSuggested: {
    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: COLOR.Primary,
    borderWidth: 1,
    borderColor: COLOR.Primary,
    borderRadius: RADIUS.rd12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rectangleGroup: {
    marginRight: SPACING.sm,
    borderWidth: 0,
    borderColor: COLOR.Blue50,
    borderRadius: RADIUS.md,
  },
  frameChild4: {
    borderTopLeftRadius: RADIUS.rd15,
    borderTopRightRadius: RADIUS.rd15,
  },
  frameParent3: {
    borderBottomRightRadius: RADIUS.rd15,
    borderBottomLeftRadius: RADIUS.rd15,
  },
  cardStyle: {
    borderWidth: 0,
    borderColor: COLOR.Primary,
    borderRadius: RADIUS.rd8,
    backgroundColor: COLOR.White100,
  },
  cardSpacing: {paddingLeft: SPACING.xs, paddingVertical: SPACING.xs},
  headerAndSeeAll: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
    marginBottom: SPACING.xxxs,
  },
});

export default RecommendedGroupScreen;
