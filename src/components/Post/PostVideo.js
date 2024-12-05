import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useRef, useState} from 'react';

import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import PIXEL from '../../constants/PIXEL';
import COLOR from '../../constants/COLOR';
import SPACING from '../../constants/SPACING';
import IconManager from '../../assets/IconManager';
import RADIUS from '../../constants/RADIUS';
import {getFileType} from '../../helper/FileTypeCheck';
import {posterimage} from '../../constants/CONSTANT_ARRAY';

const PostVideo = props => {
  const [clicked, setClicked] = useState(false);
  const [previewPlayIcon, setPreviewIcon] = useState(true);
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState({
    currentTime: 0,
    seekableDuration: 1,
  });
  const ref = useRef();
  const [isTimber, setTimber] = useState(false);

  const handlePress = () => {
    setClicked(!clicked);
  };

  const handlePreviewViewIconPress = () => {
    setPreviewIcon(!previewPlayIcon);
    setPaused(!paused);
  };

  const format = seconds => {
    let mins = parseInt(seconds / 60)
      .toString()
      .padStart(2, '0');
    let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleVideoEnd = () => {
    setPaused(!paused);
    ref.current.seek(0); // Reset video to the beginning
  };

  return (
    <View>
      {props.postFile ? (
        getFileType(props.postFile) == 'video' ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity style={{width: '100%'}} onPress={handlePress}>
              <View
                style={{width: '100%', height: '100%', alignItems: 'center'}}>
                <Video
                  paused={paused}
                  source={{uri: props.postFile}}
                  muted={muted}
                  style={{width: '100%', aspectRatio: 16 / 9}}
                  ref={ref}
                  playWhenInactive={false}
                  playInBackground={false}
                  fullscreen={true}
                  resizeMode="contain" // Change this to "cover" if you want it to fill the container
                  onProgress={x => {
                    setProgress(x);
                  }}
                  onEnd={handleVideoEnd}
                  poster={
                    props.poster ? props.poster : posterimage.defaultposter
                  }
                  posterResizeMode="cover"
                />
              </View>
              {clicked ? (
                <TouchableOpacity
                  onPress={() => setClicked(!clicked)}
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity
                      onPress={() =>
                        ref.current.seek(parseInt(progress.currentTime) - 10)
                      }>
                      <Image
                        source={IconManager.backward_light}
                        style={{
                          width: PIXEL.px30,
                          height: PIXEL.px30,
                        }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        paused ? [setPaused(!paused)] : [setPaused(!paused)];
                      }}>
                      <Image
                        source={
                          paused
                            ? IconManager.play_light
                            : IconManager.pause_light
                        }
                        resizeMode="contain"
                        style={{
                          width: PIXEL.px50,
                          height: PIXEL.px50,
                          marginLeft: PIXEL.px50,
                          marginRight: PIXEL.px50,
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        ref.current.seek(parseInt(progress.currentTime) + 10)
                      }>
                      <Image
                        source={IconManager.forward_light}
                        style={{
                          width: PIXEL.px30,
                          height: PIXEL.px30,
                        }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      position: 'absolute',
                      bottom: SPACING.sp10,
                      paddingLeft: SPACING.sp20,
                      paddingRight: SPACING.sp20,
                      alignItems: 'center',
                    }}>
                    <Text style={{color: 'white'}}>
                      {format(progress.currentTime)}
                    </Text>
                    <Slider
                      style={{width: '70%', height: PIXEL.px40}}
                      minimumValue={0}
                      maximumValue={progress.seekableDuration}
                      minimumTrackTintColor={COLOR.Primary}
                      maximumTrackTintColor={COLOR.White500}
                      thumbTintColor={COLOR.Primary}
                      value={progress.currentTime}
                      onValueChange={x => {
                        setProgress({...progress, currentTime: x});
                      }}
                      onSlidingComplete={x => {
                        ref.current.seek(x);
                      }}
                    />
                    <Text style={{color: COLOR.White}}>
                      {format(progress.seekableDuration)}
                    </Text>
                    <TouchableOpacity onPress={() => setMuted(!muted)}>
                      <Image
                        source={muted ? IconManager.mute : IconManager.unmute}
                        style={{
                          width: PIXEL.px25,
                          height: PIXEL.px25,
                          tintColor: COLOR.White,
                          marginLeft: SPACING.sp10,
                        }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ) : previewPlayIcon === true ? (
                <TouchableOpacity
                  onPress={handlePreviewViewIconPress}
                  style={{
                    width: PIXEL.px50,
                    height: PIXEL.px50,
                    top: '38%',
                    position: 'absolute',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    borderRadius: RADIUS.rd50,
                    alignSelf: 'center',
                  }}>
                  <Image
                    style={{
                      width: PIXEL.px50,
                      height: PIXEL.px50,
                      borderRadius: RADIUS.rd50,
                    }}
                    source={IconManager.play_light}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ) : null}
            </TouchableOpacity>
          </View>
        ) : (
          ''
        )
      ) : (
        ''
      )}
    </View>
  );
};

export default PostVideo;
