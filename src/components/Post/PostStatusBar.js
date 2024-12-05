import React, {useEffect} from 'react';
import * as Progress from 'react-native-progress';
import COLOR from '../../constants/COLOR';
import {View, Text, Image, Alert} from 'react-native';
import IconManager from '../../assets/IconManager';
import {FontFamily, fontSizes} from '../../constants/FONT';
import {useDispatch, useSelector} from 'react-redux';
import {
  setLoadingPosting,
  setSuccessPosting,
  setErrorPosting,
} from '../../stores/slices/AddPostSlice';

const PostingStatusBar = props => {
  const dispatch = useDispatch();
  const loadingPosting = useSelector(
    state => state.AddPostSlice.loadingPosting,
  );
  const successPosting = useSelector(
    state => state.AddPostSlice.successPosting,
  );
  const errorPosting = useSelector(state => state.AddPostSlice.errorPosting);

  useEffect(() => {
    if (successPosting) {
      setTimeout(() => {
        dispatch(setSuccessPosting(false));
      }, 3000);
    }
    if (errorPosting) {
      setTimeout(() => {
        dispatch(setErrorPosting(false));
      }, 3000);
    }
  }, [successPosting, errorPosting]);

  return (
    <View style={{paddingHorizontal: 16, paddingVertical: 10}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{flexDirection: 'row', gap: 10}}>
          <Image
            source={
              props.darkMode == 'enable'
                ? IconManager.ms_system_logo_dark
                : IconManager.ms_system_logo_light
            }
            style={{width: 30, height: 20}}
            resizeMode="contain"
          />
          {/* <Text style={props.postingStatus == 'success' || 'error' && {marginBottom : 10, fontFamily : FontFamily.PoppinRegular, fontSize : fontSizes.size15 , color : COLOR.Grey500}}>{props.postingStatus == 'loading' ? 'Uploading Post' : props.postingStatus == 'success' ? 'Successful!' : props.postingStatus == 'error' ? 'Upload failed! please try again.' : ''} </Text> */}
          <Text
            style={
              props.darkMode == 'enable'
                ? {
                    marginBottom: 10,
                    fontFamily: FontFamily.PoppinRegular,
                    fontSize: fontSizes.size15,
                    color: COLOR.White,
                  }
                : {
                    marginBottom: 10,
                    fontFamily: FontFamily.PoppinRegular,
                    fontSize: fontSizes.size15,
                    color: COLOR.Grey500,
                  }
            }>
            {props.postingStatus == 'loading'
              ? 'Uploading Post'
              : props.postingStatus == 'success'
              ? 'Successful!'
              : props.postingStatus == 'error'
              ? 'Upload failed! please try again.'
              : ''}{' '}
          </Text>
        </View>
        {props.postingStatus != 'loading' && (
          <View>
            <Image
              source={IconManager.mark_blue_light}
              style={{width: 30, height: 30}}
              resizeMode="contain"
            />
          </View>
        )}
      </View>
      {props.postingStatus == 'loading' && (
        <Progress.Bar
          progress={0.3}
          width={200}
          indeterminate={true}
          color={COLOR.Primary}
          style={
            props.darkMode == 'enable'
              ? {
                  backgroundColor: COLOR.DarkFadeLight,
                  borderColor: COLOR.DarkFadeLight,
                  width: '100%',
                }
              : {
                  backgroundColor: COLOR.Grey50,
                  borderColor: COLOR.Grey50,
                  width: '100%',
                }
          }
        />
      )}
    </View>
  );
};

export default PostingStatusBar;
