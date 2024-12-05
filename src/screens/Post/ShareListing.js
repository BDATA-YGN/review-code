import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {useNavigation} from '@react-navigation/native';
import IconManager from '../../assets/IconManager';
import DualAvater from '../../components/DualAvater';
import {retrieveStringData, storeKeys} from '../../helper/AsyncStorage';
import {useSelector} from 'react-redux';
import {setFetchDarkMode} from '../../stores/slices/DarkModeSlice';
import COLOR from '../../constants/COLOR';

const ShareListing = props => {
  const navigation = useNavigation();
  const [darkMode, setDarkMode] = useState(null);

  const fetchDarkMode = useSelector(state => state.DarkModeSlice.fetchDarkMode);
  useEffect(() => {
    getDarkModeTheme();
  }, []);

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
    if (fetchDarkMode) {
      getDarkModeTheme();
      dispatch(setFetchDarkMode(false));
    }
  }, [fetchDarkMode]);
  const handleClick = item => {
    // Alert.alert('Alert', `Alert => ${props.route.params.isMarket}`);
    navigation.navigate('SharePost', {
      postid: props.route.params.postid,
      post: props.route.params.post,
      reaction: props.route.params.reaction,
      shareType: props.route.params.shareType,
      group: item,
      page: item,
      isFromShare: true,
      isShortVideo: props.route.params.isShortVideo,
      isMarket: props.route.params.isMarket,
    });
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: darkMode == 'enable' ? COLOR.DarkTheme : COLOR.Grey50,
      }}>
      <View
        style={{
          borderBottomWidth: 0.3,
          borderColor: '#A6A6A6',
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor:
            darkMode == 'enable' ? COLOR.DarkTheme : COLOR.White100,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={{width: 9, height: 16}}
            source={
              darkMode == 'enable'
                ? IconManager.back_dark
                : IconManager.back_light
            }
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <Text
            style={{
              color: darkMode == 'enable' ? COLOR.White100 : COLOR.DarkTheme,
            }}>
            {props.route.params.shareType == 'share_post_on_group'
              ? 'Share Group'
              : 'Share Page'}
          </Text>
        </View>
      </View>
      <FlatList
        data={
          props.route.params.shareType == 'share_post_on_group'
            ? props.route.params.groupList
            : props.route.params.pageList
        }
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View
            style={
              darkMode == 'enable'
                ? styles.DitemContainer
                : styles.itemContainer
            }>
            <TouchableOpacity
              onPress={() => handleClick(item)}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 10,
                paddingLeft: 10,
              }}>
              <DualAvater
                borderRadius={12}
                largerImageWidth={50}
                largerImageHeight={50}
                src={item.avatar}
                isIconColor={false}
                iconBadgeEnable={false}
              />
              <View
                style={{
                  flex: 1,
                  marginLeft: 10,
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}>
                <Text
                  numberOfLines={1}
                  style={{
                    color:
                      darkMode == 'enable' ? COLOR.White100 : COLOR.DarkTheme,
                  }}>
                  {props.route.params.shareType == 'share_post_on_group'
                    ? item.group_name
                    : item.page_name}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.separator} />
          </View>
        )}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  groupContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemContainer: {
    flex: 1,
    backgroundColor: COLOR.White,
  },
  DitemContainer: {
    flex: 1,
    backgroundColor: COLOR.DarkTheme,
  },
  itemName: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#CCCCCC',
  },
});
export default ShareListing;
