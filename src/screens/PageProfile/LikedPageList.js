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
import SPACING from '../../constants/SPACING';
import RADIUS from '../../constants/RADIUS';
import SizedBox from '../../commonComponent/SizedBox';
import DualAvater from '../../components/DualAvater';
import IconManager from '../../assets/IconManager';
import {getLikedPageList, likeUnlineAction} from '../../helper/ApiModel';
import en from '../../i18n/en';
import ActionAppBar from '../../commonComponent/ActionAppBar';
import PIXEL from '../../constants/PIXEL';
import {stringKey} from '../../constants/StringKey';
import PageItemListShimmer from './PageItemsListShimmer';
import {useDispatch, useSelector} from 'react-redux';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import {retrieveStringData, storeKeys} from '../../helper/AsyncStorage';

const LikePageList = props => {
  const navigationAppBar = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recommentedListOfGroup, setRecommendetList] = useState([]);
  const [likePageList, setLikePageList] = useState([]);
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
    fetchLikedPage();
  };

  const fetchLikedPage = () => {
    getLikedPageList('liked_pages').then(data => {
      if (data.api_status == 200) {
        setLoading(false);
        setLikePageList(data.data);
      } else {
        setLoading(true);
      }
    });
  };
  const unjoinpage = (item, index) => {
    const updatedList = [...likePageList];
    if (index >= 0 && index < updatedList.length) {
      likeUnlineAction(item.page_id).then(data => {
        if (data.api_status == 200) {
          if (data.like_status == 'liked') {
            updatedList[index].is_liked = true;
            setLikePageList(updatedList);
          } else {
            updatedList[index].is_liked = false;
            setLikePageList(updatedList);
          }
        } else {
        }
      });
    } else {
      console.error('Invalid index to remove');
    }
  };

  useEffect(() => {
    fetchLikedPage();
    setTimeout(() => {
      setShimmer(false);
    }, 500);
  }, []);

  const handleOtherPageClcik = item => {
    // Handle click on friend item, you can navigate or perform any other action here
    navigationAppBar.navigate('OtherPageProfile', {data: item});
  };

  const renderItemLikedPages = ({item, index}) => (
    <TouchableOpacity
      activeOpacity={1}
      style={{
        alignSelf: 'center',
        borderRadius: 8,
        width: '100%',
        paddingVertical: 8,
      }}>
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
            {item.page_name}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              styles.bodyText,
              {color: darkMode === 'enable' && COLOR.White100},
            ]}>
            {item.username}
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
            style={[
              styles.buttonStyle,
              {
                borderWidth: 1,
                borderColor: COLOR.Primary,
                paddingHorizontal: 16,
                backgroundColor: item.is_liked
                  ? darkMode === 'enable'
                    ? COLOR.DarkThemLight
                    : COLOR.Blue50
                  : COLOR.Primary,
              },
            ]}
            onPress={() => unjoinpage(item, index)}>
            <Text
              style={[
                styles.buttonText,
                {
                  color: item.is_liked
                    ? darkMode === 'enable'
                      ? COLOR.White100
                      : COLOR.Grey500
                    : COLOR.Grey50,
                },
              ]}>
              {item.is_liked ? en.unLike : en.like}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.buttonStyleViewPage]}
            onPress={() =>
              navigationAppBar.navigate('ViewLikedPage', {
                pageData: item,
                myNavigatedId: item.page_id,
                canPost: stringKey.canPost,
              })
            }>
            <Text style={[styles.buttonTextViewPage]}>{en.viewPage}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View height={1} width = {350} style={{backgroundColor : COLOR.Grey50,marginTop : SPACING.sp10 ,alignSelf:'center'}} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={{
        backgroundColor:
          darkMode === 'enable' ? COLOR.DarkTheme : COLOR.White100,
        flex: 1,
      }}>
      <ActionAppBar
        appBarText={en.likedPages}
        darkMode={darkMode}
        source={IconManager.back_light}
        backpress={() => {
          navigationAppBar.goBack();
        }}
        actionButtonPress={() => {
          {
            //navigate to create page
          }
        }}
      />
      {/* <SizedBox height={PIXEL.px8} /> */}
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{}}
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
              <PageItemListShimmer darkMode={darkMode} isActionEnable={true} />
            ) : (
              <View>
                <View style={{paddingHorizontal: 8}}>
                  <View style={{borderRadius: 4}}>
                    <SizedBox height={8} />
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      data={likePageList}
                      renderItem={renderItemLikedPages}
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
  buttonTextViewPage: {
    fontSize: fontSizes.size14,
    fontFamily: FontFamily.PoppinRegular,
    color: COLOR.Grey500,
    paddingVertical: SPACING.sp6,
    alignSelf: 'center',
  },
  buttonStyleViewPage: {
    backgroundColor: COLOR.Blue50,
    borderRadius: RADIUS.rd30,
    width: '45%',
    alignItems :'center',
    justifyContent :'center'
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

export default LikePageList;
