import {Alert, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState, useRef, useMemo} from 'react';
import assets from '../assets/IconManager';
import COLOR from '../constants/COLOR';
import {FontFamily, fontSizes} from '../constants/FONT';
import SPACING from '../constants/SPACING';
import Slider from '@react-native-community/slider';
import SizedBox from '../commonComponent/SizedBox';
import {shareOptions} from '../constants/CONSTANT_ARRAY';
import Share from 'react-native-share';
import AppLoading from '../commonComponent/Loading';
import ShortModalComponent from '../commonComponent/ShortModalComponet';
import {useNavigation} from '@react-navigation/native';
import Video from 'react-native-video';
import BottomCenterBadge from '../components/BottomCenterBadge';
import {StatusBar} from 'react-native';
import {getVideoPostList} from '../helper/ApiModel';
import {TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native';
import PagerView from 'react-native-pager-view';
import Toast from 'react-native-toast-message';

const ShortVideo = () => {
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [shortVideoList, setShortVideoList] = useState([]);
  const [shimmer, setShimmer] = useState(true);
  const navigationAppBar = useNavigation();
  const videoRef = useRef([]);
  const [isVideoLoading, setVideoLoading] = useState(true);
  const [isPaused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDoubleTap, setIsDoubleTap] = useState(false);
  const [current, setCurrent] = useState(null);
  const [show, setShow] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [result, setResult] = useState('');
  const [numberOfLines, setNumberOfLine] = useState(2);

  useEffect(() => {
    getVideoPostList().then(data => {
      if (data.api_status == 200) {
        setShortVideoList(data.data);
        setShimmer(false);
      } else {
      }
    });
  }, []);

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
    setVideoLoading(false);
    setDuration(data.duration);
  };

  const onProgress = data => {
    if (!isPaused) {
      setCurrentTime(data.currentTime);
    }
  };

  const [hasEnded, setHasEnded] = useState(false);

  const handlePlayPause = () => {
    setPaused(prevPaused => !prevPaused);
    setCurrentTime(0);
  };

  const onSeeking = value => {
    setCurrentTime(value);
  };

  const onSeek = value => {
    videoRef.current.seek(value);
    setCurrentTime(value);
  };

  const onPageSelected = event => {
    const newPageIndex = event.nativeEvent.position;
    setActivePageIndex(newPageIndex);
    setCurrentTime(0);
  };
  const showToast = message => {
    Toast.show({
      text1: message,
      type: 'success',
    });
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
    setPaused(true);
    setCurrentTime(0);
    videoRef.current.seek(0);
    // Handle video end
  };
  // const onEnd = () => {
  //   setPaused(true);
  //   setCurrentTime(0);

  // };
  const handlePress = value => {
    if (value == 'onPress') {
      if (isDoubleTap) {
        // showToast('Double Touch !')
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
  const shareBox = async () => {
    const shareOptions = {
      title: 'Share file',
      email: 'email@example.com',
      social: Share.Social.EMAIL,
      failOnCancel: false,
    };

    try {
      const ShareResponse = await Share.open(shareOptions);
      setResult(JSON.stringify(ShareResponse, null, 2));
    } catch (error) {
      setResult('error: '.concat(getErrorString(error)));
    }
  };
  function getErrorString(error, defaultValue) {
    let e = defaultValue || 'Something went wrong. Please try again';
    if (typeof error === 'string') {
      e = error;
    } else if (error && error.message) {
      e = error.message;
    } else if (error && error.props) {
      e = error.props;
    }
    return e;
  }

  const memoizedShortTemplate = useMemo(() => {
    return shortVideoList.map((item, index) => (
      <View style={{flex: 1}} key={item.id}>
        <TouchableOpacity
          activeOpacity={1} // To prevent the opacity change on tap
          onPressIn={value => {
            if (show) {
              setShow(!show);
            } else {
              handlePress('pressIn');
            }
          }}
          onPress={value => {
            if (show) {
              setShow(!show);
            } else {
              handlePress('onPress');
            }
          }}
          onLongPress={value => handlePress('onLongPress')}
          delayDoubleTap={300}
          style={{flex: 1}}>
          <SafeAreaView
            style={{flex: 1, backgroundColor: '#333333', opacity: 1}}>
            <View style={{flex: 1}}>
              {/* Transparent App Bar Cion */}
              {/* <ToucahbleIcon padding={16} iconWidth={9} iconHeight={16} source={assetsManager.back_back_icon} onPress = {()=>{}} position= 'absolute' top= {32} left= {0} zIndex = {1} /> */}
              {/* <TouchableIcon padding={16} iconWidth={9} iconHeight={16} source={assetsManager.back_back_icon} onPress={() => { }} position='absolute' top={0} left={0} zIndex={1} /> */}
              <View style={styles.container}>
                <Video
                  ref={videoRef}
                  source={{uri: item?.postFile}}
                  style={styles.video}
                  resizeMode="contain"
                  onBuffer={onBuffer}
                  onLoad={onLoad}
                  onEnd={onEnd}
                  repeat={true}
                  controls={false}
                  onProgress={onProgress}
                  paused={activePageIndex === index ? isPaused : true}
                  useTextureView={true}
                  onTouchStart={() => handlePlayPause()}
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
                      width={80}
                      height={75}
                      source={assets.short_Video_light}
                    />
                  </View>
                )}
                {isVideoLoading && (
                  <View style={styles.loadingOverlay}>
                    <AppLoading />
                  </View>
                )}
                {/* Custom controls */}
              </View>
              {/* Vertical action */}

              <View
                style={{
                  alignSelf: 'center',
                  position: 'absolute',
                  bottom: 2,
                  left: 0,
                  paddingVertical: 8,
                  width: '100%',
                }}>
                <View
                  style={{
                    alignSelf: 'center',
                    right: 0,
                    zIndex: 10,
                    width: '100%',
                    alignItems: 'flex-end',
                  }}>
                  <View>
                    <View
                      style={{
                        borderRadius: 100,
                        alignSelf: 'center',
                        margin: 10,
                        width: '100%',
                        alignItems: 'flex-end',
                      }}>
                      <BottomCenterBadge
                        onPressLarge={() => {
                          // navigationAppBar.navigate('MyProfile')
                        }}
                        onPressSmall={() => {
                          showToast('followed');
                        }}
                        largerImageWidth={45}
                        largerImageHeight={45}
                        src={item?.publisher?.avatar}
                        smallIcon={assets.short_add_and_follow_light}
                        isIconColor={false}
                        iconBadgeEnable={false}
                      />
                    </View>
                    <SizedBox height={16} />
                    <View
                      style={{alignItems: 'center', justifyContent: 'center'}}>
                      {/* <View style={{ alignSelf: 'center' }}>
                            <ReactionMoletules current={current} show={show} setCurrent={setCurrent} setShow={setShow} floatIconLeft={true} />
                          </View> */}
                      <Text style={{color: 'white'}}>0</Text>
                    </View>
                    <SizedBox height={16} />
                    <View
                      style={{alignItems: 'center', justifyContent: 'center'}}>
                      <View style={{alignSelf: 'center'}}>
                        <TouchableOpacity
                          onPress={() =>
                            navigationAppBar.navigate('CommingSoon')
                          }>
                          <Image
                            style={{width: 24, height: 24}}
                            source={assets.short_message_light}
                          />
                        </TouchableOpacity>
                      </View>
                      <Text style={{color: 'white'}}>0</Text>
                    </View>
                    <SizedBox height={16} />
                    <View
                      style={{alignItems: 'center', justifyContent: 'center'}}>
                      <View style={{alignSelf: 'center'}}>
                        <TouchableOpacity
                          onPress={() =>
                            navigationAppBar.navigate('CommingSoon')
                          }>
                          <Image
                            style={{width: 24, height: 24}}
                            source={assets.short_share_light}
                          />
                        </TouchableOpacity>
                      </View>
                      <Text style={{color: 'white'}}>0</Text>
                    </View>
                  </View>
                </View>
                <Text
                  style={{
                    fontFamily: FontFamily.PoppinRegular,
                    fontSize: fontSizes.size15,
                    color: COLOR.White100,
                    marginHorizontal: 16,
                  }}>
                  {formatTime(currentTime)}
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={duration}
                  value={currentTime} // Update the value prop with currentTime
                  onValueChange={onSeek}
                  // onSlidingComplete={onSeek}
                  minimumTrackTintColor={COLOR.Primary}
                  maximumTrackTintColor={COLOR.Grey100}
                  thumbTintColor={COLOR.Primary}
                  disabled={false}
                />
                <View style={{marginHorizontal: 16, width: '80%'}}>
                  {item?.publisher?.first_name ? (
                    <Text
                      style={{
                        color: 'white',
                        fontSize: fontSizes.size19,
                        fontFamily: FontFamily.PoppinSemiBold,
                        flex: 1,
                      }}>
                      {item?.publisher?.first_name} {item?.publisher?.last_name}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        color: 'white',
                        fontSize: fontSizes.size19,
                        fontFamily: FontFamily.PoppinSemiBold,
                        flex: 1,
                      }}>
                      {item?.publisher?.first_name} {item?.publisher?.page_name}
                    </Text>
                  )}
                  <TouchableOpacity
                    onPress={() =>
                      numberOfLines == 2
                        ? setNumberOfLine(9)
                        : setNumberOfLine(2)
                    }>
                    <Text
                      numberOfLines={numberOfLines}
                      style={{
                        color: 'white',
                        fontSize: fontSizes.size10,
                        fontFamily: FontFamily.PoppinRegular,
                        flex: 1,
                        textAlign: 'justify',
                      }}>
                      {item?.Orginaltext}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {/* <View style={{height: 12,backgroundColor: 'orange',marginHorizontal: 8, borderRadius: 4}} /> */}
            <ShortModalComponent
              openModal={openModal}
              closeModal={() => setOpenModal(false)}
              options={shareOptions}
              postid={0}
              shareBox={shareBox}
            />
          </SafeAreaView>
        </TouchableOpacity>
      </View>
    ));
  }, [activePageIndex, shortVideoList, isPaused, currentTime, duration]);

  return (
    <View style={{flex: 1, backgroundColor: COLOR.Grey500}}>
      {/* <StatusBar translucent={true} backgroundColor="transparent" /> */}
      <StatusBar translucent={false} backgroundColor="#333333" />

      {shimmer ? (
        <AppLoading />
      ) : (
        <PagerView
          style={styles.pagerView}
          initialPage={activePageIndex}
          onPageSelected={onPageSelected}
          orientation="vertical">
          {memoizedShortTemplate}
        </PagerView>
      )}
      {/* <ReactionPopup /> */}
      {/* <ShareExample /> */}
    </View>
  );
};
export default ShortVideo;

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
});
