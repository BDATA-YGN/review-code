import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Avater from '../Avater/Avater';
import IconManager from '../../assets/IconManager';
import {FontFamily, fontSizes} from '../../constants/FONT';
import COLOR from '../../constants/COLOR';
import i18n from '../../i18n';
import {useRoute} from '@react-navigation/native';
import Video from 'react-native-video';
import AddPostInput from './AddPostInput';
import {useDispatch, useSelector} from 'react-redux';
import {setPostGif, setPostVideo} from '../../stores/slices/AddPostSlice';

const AddPostHeader = props => {

  
  
  const dispatch = useDispatch();
  const postGif = useSelector(state => state.AddPostSlice.postGif);
  const postPhotos = useSelector(state => state.AddPostSlice.postPhotos);
  const postVideo = useSelector(state => state.AddPostSlice.postVideo);
  const feelingType = useSelector(state => state.AddPostSlice.feelingType);
  const feeling = useSelector(state => state.AddPostSlice.feeling);
  const selectedMentionFriends = useSelector(
    state => state.AddPostSlice.selectedMentionFriends,
  );

  return (
    <ScrollView style={props.darkMode == 'enable' ? {backgroundColor : COLOR.DarkTheme , flex : 1 , marginBottom : '20%'} : {backgroundColor : COLOR.White , flex : 1,marginBottom : '20%' }}
    automaticallyAdjustKeyboardInsets = 'true'
    automaticallyAdjustContentInsets= 'true'
    // nestedScrollEnabled = 'true'
    // keyboardDismissMode='interactive'
    // bounces = 'false'
    keyboardDismissMode='interactive'
    // keyboardShouldPersistTaps = 'handled'
    // alwaysBounceVertical = 'true'
    // canCancelContentTouches = 'false'

    >
      <AddPostInput
        setPostPrivacyModalVisible={props?.setPostPrivacyModalVisible}
        userInfoData={props?.userInfoData}
        pageInfo={props?.pageInfo}
        postType={props?.postType}
        userId={props?.userId}
        selectedPostPrivacy={props?.selectedPostPrivacy}
        setSnapPoint={props?.setSnapPoint}
        handleTextChange={props?.handleTextChange}
        focusOrBlur={props?.focusOrBlur}
        sharePost={props?.sharePost}
        editPost={props?.editPost}
        darkMode = {props.darkMode}
      />

      {feelingType != null && feeling ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 5,
            gap: 5,
            marginHorizontal: 16,
          }}>
          {feelingType.text === 'Feeling' ? (
            <Image style={{width: 24, height: 24}} source={feeling.icon} />
          ) : (
            ''
          )}

          <Text
            style={ props.darkMode == 'enable' ? {
              fontFamily: FontFamily.PoppinRegular,
              fontSize: fontSizes.size15,
              color: COLOR.White,
            }: {
              fontFamily: FontFamily.PoppinRegular,
              fontSize: fontSizes.size15,
              color: COLOR.Grey500,
            }}>
            {feelingType.text} {feeling.text}
          </Text>
        </View>
      ) : null}

      {selectedMentionFriends.length > 0 ? (
        <View
          style={{
            marginHorizontal: 16,
            width: '100%',
            marginBottom: 10,
            flexDirection: 'row',
            paddingHorizontal: 5,
            columnGap: 5,
            flexWrap: 'wrap',
          }}>
          <Text style={[styles.textStyle, props.darkMode == 'enable' ? {color: COLOR.White} : {color: COLOR.Grey500,}]}>With</Text>
          {selectedMentionFriends.map((friend,index) => (
            <Text style={[styles.tagFriTextStyle, props.darkMode == 'enable' ? {color: COLOR.White} : {color: COLOR.Grey500,}]} key={index}>
              @{friend.first_name} {friend.last_name},
            </Text>
          ))}
        </View>
      ) : (
        ''
      )}

      {postPhotos.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {postPhotos?.map((postPhoto, index) => (
            <View key={index} style={styles.mediaContainer}>
              <Image source={{uri: postPhoto.uri}} style={styles.postPhoto} />

              <TouchableOpacity
                style={styles.removeIconContainer}
                onPress={() => props.removeImage(postPhoto.id)}>
                <Image
                  source={IconManager.close_light}
                  style={{width: 10, height: 10}}
                />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {postGif != null && (
        <View style={{width: '100%'}}>
          <Image
            source={{uri: postGif.uri}}
            style={{width: '100%', height: 300}}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.removeIconContainer}
            onPress={() => dispatch(setPostGif(null))}>
            <Image
              source={IconManager.close_light}
              style={{width: 15, height: 15}}
            />
          </TouchableOpacity>
        </View>
      )}

      {postVideo != null && (
        <View style={{width: '100%'}}>
          <Video
            source={{uri: postVideo.uri}}
            style={{width: '100%', height: 300}}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.removeIconContainer}
            onPress={() => dispatch(setPostVideo(null))}>
            <Image
              source={IconManager.close_light}
              style={{width: 15, height: 15}}
            />
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  removeIconContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 8,
    padding: 4,
  },
  mediaContainer: {
    marginRight: 8,
  },
  postPhoto: {
    width: 120,
    height: 120,
  },
  tagFriTextStyle: {
    
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
    // color: COLOR.Primary,
  },
  textStyle: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
  },
});

export default AddPostHeader;

