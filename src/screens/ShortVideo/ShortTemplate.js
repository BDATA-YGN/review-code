import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import Loading from './Loading';
import IconManager from '../../assets/IconManager';
import {FontFamily, fontSizes} from '../../constants/FONT';
import COLOR from '../../constants/COLOR';
import ModalComponent from '../../commonComponent/ModalComponent';
import {defaultEmojiList, shareOptions} from '../../constants/CONSTANT_ARRAY';
import PostYoutubePlayer from '../../components/Post/PostYoutubePlayer';
import {PostLike, startReaction} from '../../helper/ApiModel';
import {retrieveJsonData, storeKeys} from '../../helper/AsyncStorage';
import CustomSlider from './CustomSlider';
import {useDispatch, useSelector} from 'react-redux';
import {logJsonData} from '../../helper/LiveStream/logFile';
import {formatDateTime} from '../../helper/DateFormatter';
import {calculateTimeDifference} from '../../helper/Formatter';
import {useNavigation} from '@react-navigation/native';
import {stringKey} from '../../constants/StringKey';
import {
  setActivePageIndex,
  updateShortVideoPostItemField,
} from '../../stores/slices/PostSlice';

const ShortTemplate = props => {
  const dispatch = useDispatch();
  const navigationAppBar = useNavigation();
  const activePageIndex = useSelector(state => state.PostSlice.activePageIndex);
  const videoRef = useRef(null);
  const [isVideoLoading, setVideoLoading] = useState(true);
  const [isPaused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDoubleTap, setIsDoubleTap] = useState(false);
  const [show, setShow] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [videoSize, setVideoSize] = useState({width: 0, height: 0});
  const [showFullText, setShowFullText] = useState(false);
  const maxLength = 30; // Define max length for collapsed text
  const emojiList = defaultEmojiList;

  const goToProfile = () => {
    if (isLoginUser) {
      if (props.item?.page_id === '0') {
        navigationAppBar.navigate('UserProile', {
          myNavigatedId: loginUserId,
          canPost: stringKey.canPost,
          backDisable: 'enable',
        });
      } else {
        navigationAppBar.navigate('ViewMyPage', {
          pageData: props.item?.publisher,
          myNavigatedId: props.item?.page_id,
          canPost: stringKey.canPost,
        });
      }
    } else {
      if (props.item?.page_id === '0') {
        navigationAppBar.navigate('OtherUserProfile', {
          otherUserData: props.item.publisher,
          userId: props.item.publisher?.user_id,
        });
      } else {
        navigationAppBar.navigate('ViewLikedPage', {
          pageData: props.item?.publisher,
          myNavigatedId: props.item.page_id,
          canPost: stringKey.canPost,
        });
        // showToast("Can't navigate for other page.")
      }
    }
  };

  const toggleText = () => {
    setShowFullText(!showFullText);
  };

  const displayText = showFullText
    ? props.item?.Orginaltext
    : `${props.item?.Orginaltext?.slice(0, maxLength)}...`;

  const [isSelfReacted, setSelfReacted] = useState(
    props.item?.reaction?.is_reacted ? 'Reacted' : 'Initial',
  );
  const [typeOfReaction, setTypeOfReaction] = useState('0');
  const [reactionPopUpVisible, setReactionPopUpVisible] = useState(false);
  const [reactionId, setReactionId] = useState(
    props.item?.reaction?.type !== '' ? props.item?.reaction?.type : 0,
  );
  const [isLoginUser, setLogInUser] = useState(null);
  const [loginUserId, setLoginUserId] = useState(null);

  useEffect(() => {
    checkUserType();
  }, [props.item]);
  const checkUserType = async () => {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const user_id = loginData.user_id;
    setLogInUser(user_id == props.item.publisher.user_id);
    user_id === props.item.publisher.user_id && setLoginUserId(user_id);
  };

  const formatTime = timeInSeconds => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    const formattedHours = hours > 0 ? `${hours}:` : '';
    const formattedMinutes = `${String(minutes).padStart(2, '0')}:`;
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedHours}${formattedMinutes}${formattedSeconds}`;
  };

  const onBuffer = ({isBuffering}) => {
    setVideoLoading(isBuffering);
  };

  const onLoad = data => {
    const {width, height} = data.naturalSize;
    setVideoSize({width, height});
    // Alert.alert('AAAAAA',`${videoSize.width} ${videoSize.height}`)
    setVideoLoading(false);
    setDuration(data.duration);
  };

  const onProgress = data => {
    setCurrentTime(data.currentTime);
  };

  const [hasEnded, setHasEnded] = useState(false);

  const handlePlayPause = () => {
    setPaused(!isPaused);
  };

  const onSeeking = value => {
    setCurrentTime(value);
    videoRef.current.seek(value);
  };

  const onSeek = value => {
    videoRef.current.seek(value);
    setCurrentTime(value);
  };

  const showToast = message => {
    // ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Check if the video has been previously watched
    if (!isInitialLoad && currentTime > 0) {
      // Video has been previously watched, show a toast or implement your logic
      showToast(`Resuming from ${currentTime.toFixed(2)} seconds`);
    }
  }, [isInitialLoad, currentTime]);

  const onEnd = () => {
    setHasEnded(true);
    setCurrentTime(0); // Reset currentTime to start
    setPaused(true); // Pause the video
    onSeek(0); // Update the Slider value when the video ends
    setIsInitialLoad(false); // Set initial load to false after the first playback
  };

  const handlePress = value => {
    if (value == 'onPress') {
      dispatch(setActivePageIndex(props.index));
      if (isDoubleTap) {
        setPaused(!isPaused);
        setPaused(!isPaused);
        setIsDoubleTap(false);
        setPaused(!isPaused);
      } else {
        setPaused(!isPaused);
        setTimeout(() => {
          setIsDoubleTap(false);
        }, 300);
        setIsDoubleTap(true);
      }
    } else if (value == 'pressIn') {
    } else {
      // showToast('On Long Press')
    }
  };

  // Example usage in the parent component
  const handleSeeking = time => {
    videoRef.current.seek(time); // Update the video to preview position
  };

  const handleSeek = time => {
    videoRef.current.seek(time); // Set video to the new position
  };

  const likeUnlike = async item => {
    if (item.reaction.is_reacted) {
      const reaction = {
        ...(parseInt(item.reaction[emojiList[1].id], 10) > 1 && {
          [emojiList[1].id]: 1,
        }),
        is_reacted: false,
        type: null,
        count: item.reaction.count - 1,
      };
      Object.keys(item.reaction).forEach(key => {
        if (!['is_reacted', 'type', 'count'].includes(key)) {
          if (item.reaction.type === key) {
            if (parseInt(item.reaction[key], 10) > 1) {
              reaction[key] = parseInt(item.reaction[key], 10) - 1;
            }
          } else {
            reaction[key] = item.reaction[key];
          }
        }
      });
      // if (response.api_status === 200) {
      dispatch(
        updateShortVideoPostItemField({
          id: item.post_id,
          field: 'reaction',
          value: reaction,
        }),
      );

      logJsonData('Unlike', reaction);
      // }
      const response = await startReaction(item.post_id, emojiList[1].id);
    } else {
      const reaction = {
        [emojiList[1].id]: 1,
        is_reacted: true,
        type: emojiList[1].id,
        count: item.reaction.count + 1,
      };
      Object.keys(item.reaction).forEach(key => {
        if (!['is_reacted', 'type', 'count'].includes(key)) {
          if (emojiList[1].id === key) {
            reaction[key] =
              parseInt(item.reaction[key], 10) + parseInt(reaction[key], 10);
          } else {
            reaction[key] = item.reaction[key];
          }
        }
      });
      // if (response.api_status === 200) {
      dispatch(
        updateShortVideoPostItemField({
          id: item.post_id,
          field: 'reaction',
          value: reaction,
        }),
      );

      logJsonData('Like', reaction);
      // }
      const response = await startReaction(item.post_id, emojiList[1].id);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1} // To prevent the opacity change on tap
      onPressIn={value => {}}
      onPress={value => {
        if (show) {
          setShow(!show);
        } else {
          reactionPopUpVisible
            ? setReactionPopUpVisible(!reactionPopUpVisible)
            : handlePress('onPress');
        }
      }}
      onLongPress={value => handlePress('onLongPress')}
      delayDoubleTap={300}
      style={{
        backgroundColor: COLOR.DarkThemLight,
        height: props.safeAreaHeight,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0,
        borderColor: 'yellow',
      }}>
      <SafeAreaView
        style={{
          height: props.safeAreaHeight,
          borderWidth: 0,
          borderColor: 'green',
          width: '100%',
          // backgroundColor:
          //   props.darkMode === 'enable' ? COLOR.DarkThemLight : COLOR.White100,
          opacity: 1,
        }}>
        <View
          style={{
            flex: 1,
            borderWidth: 0,
            borderColor: 'indigo',
          }}>
          {props.videoType === 'video' ? (
            <View
              style={[
                styles.container,
                {borderWidth: 0, borderColor: 'white'},
              ]}>
              <Video
                ref={videoRef}
                // source={props.videoUri}
                source={{uri: props.videoUri}}
                style={[styles.video]}
                resizeMode={videoSize.height > 650 ? 'cover' : 'contain'}
                preload={activePageIndex === props.index ? true : false}
                onBuffer={onBuffer}
                onLoad={onLoad}
                muted={false}
                onEnd={onEnd}
                repeat={true}
                controls={false}
                onProgress={onProgress}
                paused={
                  activePageIndex === props.index && isPaused == false
                    ? false
                    : true
                }
                useTextureView={true}
              />
              {isPaused && (
                <View
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: 0.5,
                  }}>
                  <Image
                    style={{width: 65, height: 65}}
                    source={IconManager.short_Video_dark}
                  />
                </View>
              )}
              {isVideoLoading && (
                <View style={styles.loadingOverlay}>
                  <Loading />
                </View>
              )}
              {/* Custom controls */}
            </View>
          ) : props.videoType === 'youtube' ? (
            <View style={{flex: 1, justifyContent: 'center'}}>
              <PostYoutubePlayer postYoutube={props.videoUri} />
            </View>
          ) : (
            <View style={styles.container}>
              <Text
                style={{
                  color: COLOR.White100,
                  fontFamily: FontFamily.PoppinSemiBold,
                  fontSize: fontSizes.size16,
                }}>
                Not supported Video Type!
              </Text>
            </View>
          )}
          <View style={styles.textContainer}>
            <ScrollView style={styles.scrollView}>
              <Text style={styles.textStyle}>{displayText}</Text>
            </ScrollView>
            {props.item?.Orginaltext?.length > maxLength && (
              <TouchableOpacity
                onPress={toggleText}
                // style={styles.toggleButton}
              >
                <Text style={styles.toggleTextStyle}>
                  {showFullText ? 'See less' : '...See more'}
                </Text>
              </TouchableOpacity>
            )}
            <View
              style={{
                flexDirection: 'row',
                display: 'flex',
                marginVertical: 8,
              }}>
              <View
                style={{
                  flex: 1.5,
                  // borderWidth: 1,
                  height: 60,
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  overflow: 'hidden',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity activeOpacity={0.9} onPress={goToProfile}>
                  <Image
                    style={{width: 45, height: 45, borderRadius: 20}}
                    source={{uri: props.item?.publisher?.avatar}}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    // borderWidth: 2,
                    margin: 6,
                  }}>
                  {props.item?.publisher?.first_name ? (
                    <Text
                      numberOfLines={1}
                      style={{
                        color: 'white',
                        fontSize: fontSizes.size16,
                        fontFamily: FontFamily.PoppinSemiBold,
                        flex: 1,
                      }}>
                      {`${props.item?.publisher?.first_name} ${props.item?.publisher?.last_name}`}
                    </Text>
                  ) : (
                    <Text
                      numberOfLines={1}
                      style={{
                        color: 'white',
                        fontSize: fontSizes.size16,
                        fontFamily: FontFamily.PoppinSemiBold,
                        flex: 1,
                      }}>
                      {props.item?.publisher?.username}
                    </Text>
                  )}
                  <Text numberOfLines={1} style={styles.textTime}>
                    {calculateTimeDifference(props.item?.time)}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  // borderWidth: 1,
                  height: 64,
                  display: 'flex',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    likeUnlike(props.item);
                  }}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // borderWidth: 1,
                    gap: 4,
                  }}>
                  {props.item?.reaction?.is_reacted ? (
                    <Image
                      source={IconManager.loveReactLine}
                      style={{width: 22, height: 22, resizeMode: 'contain'}}
                    />
                  ) : (
                    <Image
                      source={IconManager.love_line}
                      style={{width: 22, height: 22, resizeMode: 'contain'}}
                    />
                  )}
                  <Text style={styles.textTime}>
                    {props.item?.reaction?.count}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {
                    navigationAppBar.navigate('Comment', {
                      postid: props.item.post_id,
                      reaction: props.item.reaction.count,
                      reactionType: props?.reactionType,
                    });
                  }}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // borderWidth: 1,
                    gap: 4,
                  }}>
                  <Image
                    source={IconManager.comment_line}
                    style={{width: 22, height: 22, resizeMode: 'contain'}}
                  />
                  <Text style={styles.textTime}>
                    {props.item?.post_comments}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => setOpenModal(true)}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // borderWidth: 1,
                    gap: 4,
                  }}>
                  <Image
                    source={IconManager.share_line}
                    style={{width: 22, height: 22, resizeMode: 'contain'}}
                  />
                  <Text style={styles.textTime}>{props.item?.post_shares}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View
            style={{
              alignSelf: 'center',
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
            }}>
            <View
              style={{
                marginHorizontal: 16,
                width: '100%',
                // borderWidth: 1,
                // borderColor: 'white',
                left: -16,
              }}>
              {props.videoType !== 'youtube' && (
                <CustomSlider
                  currentTime={currentTime}
                  duration={duration}
                  onSeeking={onSeeking}
                  onSeek={onSeek}
                  minimumTrackTintColor={COLOR.Primary}
                  maximumTrackTintColor={
                    props.darkMode === 'enable'
                      ? COLOR.DarkThemLight
                      : COLOR.White100
                  }
                  thumbTintColor={COLOR.White100}
                />
              )}
            </View>
          </View>

          <ModalComponent
            openModal={openModal}
            closeModal={() => setOpenModal(false)}
            options={shareOptions}
            postid={props.item.post_id}
            post={props.item}
            reaction={props.reaction}
            groupList={props.groupList}
            pageList={props.pageList}
            message={"You can't share!"}
            isShortVideo="true"
          />
        </View>
      </SafeAreaView>
    </TouchableOpacity>
  );
};

export default ShortTemplate;

const styles = StyleSheet.create({
  textContainer: {
    position: 'absolute',
    width: '100%',
    // left: 12,
    flex: 1,
    bottom: 4,
    paddingTop: 16,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    paddingLeft: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scrollView: {
    maxHeight: 100,
  },
  textTime: {
    color: 'white',
    fontSize: fontSizes.size12,
    fontFamily: FontFamily.PoppinRegular,
  },
  textStyle: {
    color: 'white',
    fontSize: fontSizes.size12,
    fontFamily: FontFamily.PoppinRegular,
    textAlign: 'justify',
    flex: 1,
  },
  toggleTextStyle: {
    color: COLOR.Primary,
    fontSize: fontSizes.size12,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  youTubeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  youTubeVideo: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.DarkThemLight,
  },
  video: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
    borderColor: 'red',
    backgroundColor: COLOR.DarkThemLight,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.DarkThemLight,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  playPauseButton: {
    marginRight: 15,
  },
  slider: {
    zIndex: 1,
    width: '100%',
  },
  reactionIcon: {
    width: 10,
    height: 10,
  },
});
