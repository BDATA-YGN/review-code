import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';

import {VLCPlayer} from 'react-native-vlc-media-player';
import COLOR from '../../../../constants/COLOR';
import {FontFamily, fontSizes} from '../../../../constants/FONT';
import IconManager from '../../../../assets/IconManager';
import SizedBox from '../../../../commonComponent/SizedBox';
import LiveReaction from '../LiveReaction/liveReaction';
import {useWindowDimensions} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  checkNetworkStatus,
  emojiList,
} from '../../../../helper/Market/MarketHelper';
import {useDispatch, useSelector} from 'react-redux';
import {setEmptyMessage} from '../../../../stores/slices/liveStreamSlice';
import LiveCommentBox from '../liveComponent/liveCommentBox';
import LiveProductModal from '../liveComponent/liveProductByModal';
import {
  getLiveCommentList,
  getLiveProductDetails,
} from '../../../../helper/LiveStream/liveStreamHelper';
import LiveCommentsListViewer from '../liveComponent/liveCommentListViewer';

const StreamViewerView = ({
  selectedVideo,
  handleCloseFullScreen,
  isMutedMap,
  togglePlayPause,
  toggleMute,
  isPlayingMap,
}) => {
  const dispatch = useDispatch();
  const [streaming, setStreaming] = useState(false);
  const [reactionPopUpVisible, setReactionPopUpVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const {width, height} = useWindowDimensions();
  const [isVideoReady, setIsVideoReady] = useState(false);
  // const [data, setData] = useState([
  //   {id: '1', name: 'Userrrrrr 1', comment: 'User commented you live 1'},
  //   {id: '2', name: 'User 2', comment: 'User commented you live 2'},
  //   {id: '3', name: 'User 3', comment: 'User commented you live 3'},
  // ]);
  const liveCommentList = useSelector(
    state => state.LiveStreamSlice.liveCommentList,
  );
  const isAddNewComments = useSelector(
    state => state.LiveStreamSlice.isAddNewComments,
  );
  const productList = useSelector(
    state => state.LiveStreamSlice.liveProductList,
  );

  const fetchComments = async () => {
    await getLiveCommentList(
      dispatch,
      selectedVideo.post_id,
      liveCommentList,
      isAddNewComments,
    );
  };

  useEffect(() => {
    fetchComments(); // Initial call
    const intervalId = setInterval(fetchComments, 7000); // Call every 7 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [dispatch, selectedVideo.post_id, isAddNewComments]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      await getLiveProductDetails(selectedVideo.post_id, dispatch);
    };

    fetchProductDetails(); // Initial call
    const intervalId = setInterval(fetchProductDetails, 15000); // Call every 15 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [dispatch, selectedVideo.post_id]);

  useEffect(() => {
    checkNetworkStatus().then(isOnline => {
      if (isOnline) {
        emojiList(dispatch);
      } else {
        dispatch(
          setEmptyMessage(
            `Oops! It looks like you're offline. Connect to the internet to continue.`,
          ),
        );
      }
    });
  }, [dispatch]);

  const hideReaction = () => {
    if (reactionPopUpVisible) {
      setReactionPopUpVisible(false);
    }
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => {
              hideReaction();
              Keyboard.dismiss();
            }}
            activeOpacity={1}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#333333',
              width: '100%',
            }}>
            {isVideoReady ? null : (
              <View
                style={{
                  // borderWidth: 1,
                  position: 'absolute',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            )}
            <VLCPlayer
              key={selectedVideo?.id}
              style={{
                width: '100%',
                height: '100%',
                borderColor: 'balck',
                borderWidth: 0,
                zIndex: 1,
              }}
              onPlaying={() => {
                console.log('Video is ready to play');
                setIsVideoReady(true);
              }}
              playInBackground={false}
              source={{
                uri: selectedVideo?.stream_url,
              }}
              muted={isMutedMap[selectedVideo?.id] || false}
              videoAspectRatio="20:43.5"
              onError={e => console.log('Error:', e)}
              onBuffering={e => {
                // console.log('Buffering:', e);
              }}
            />
          </TouchableOpacity>

          {/* Comments section */}
          <View
            style={{
              width: '100%',
              height: height * 0.3,
              position: 'absolute',
              bottom: 80,
            }}>
            <View style={{borderWidth: 0, marginHorizontal: 6}}>
              {liveCommentList.length >= 1 && (
                <LiveCommentsListViewer
                  data={liveCommentList}
                  hideReaction={hideReaction}
                  isViewer={true}
                />
              )}
            </View>
          </View>

          <View
            style={{
              position: 'absolute',
              top: height * 0.05,
              right: width * 0.04,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8,
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                handleCloseFullScreen();
              }}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(49, 49, 49, 0.5)',
                borderRadius: 8,
                padding: 10,
              }}>
              <Image
                source={IconManager.close_dark}
                style={{width: 20, height: 20, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              position: 'absolute',
              top: height * 0.11,
              right: width * 0.04,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8,
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                toggleMute();
              }}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(49, 49, 49, 0.5)',
                borderRadius: 8,
                padding: 8,
              }}>
              <Image
                source={
                  isMutedMap[selectedVideo?.id]
                    ? IconManager.mute
                    : IconManager.unmute
                }
                style={{width: 24, height: 24, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>

          {/* Header and Live viewer count */}
          <View
            style={{
              position: 'absolute',
              top: height * 0.05,
              left: width * 0.04,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8,
            }}>
            {streaming && (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  hideReaction();
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(217, 56, 56, 0.5)',
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 2,
                }}>
                <Text
                  style={{
                    fontFamily: FontFamily.PoppinRegular,
                    fontSize: fontSizes.size17,
                    color: COLOR.White100,
                  }}>
                  Live
                </Text>
              </TouchableOpacity>
            )}
            {productList.length >= 1 && (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  hideReaction();
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(49, 49, 49, 0.5)',
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 2,
                }}>
                <Image
                  source={IconManager.live_eye_viewer}
                  style={{width: 20, height: 20}}
                />
                <SizedBox width={8} />
                <Text
                  style={{
                    fontFamily: FontFamily.PoppinRegular,
                    fontSize: fontSizes.size17,
                    color: COLOR.White100,
                  }}>
                  {productList[0]?.views}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Product information */}
          {selectedVideo.vy_product_data &&
          selectedVideo.vy_product_data !== null ? (
            <TouchableOpacity
              onPress={() => {
                hideReaction();
                setModalVisible(true);
              }} // Show modal when pressed
              activeOpacity={0.8}
              style={{
                position: 'absolute',
                top: height * 0.1,
                left: width * 0.04,
                width: width * 0.33,
                height: height * 0.17,
                alignItems: 'center',
                backgroundColor: 'rgba(49, 49, 49, 0.5)',
                borderRadius: 12,
              }}>
              <View style={{width: '100%', height: '90%'}}>
                <Image
                  source={{uri: productList[0]?.product_media_data[0]?.image}}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                />
              </View>
              <View
                style={{
                  width: '100%',
                  height: '20%',
                  backgroundColor: 'white',
                  borderBottomEndRadius: 8,
                  borderBottomStartRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 8,
                }}>
                <Text
                  style={{
                    fontFamily: FontFamily.PoppinSemiBold,
                    fontSize: fontSizes.size13,
                    color: COLOR.Grey500,
                  }}>
                  {`${productList[0]?.price} Ks`}
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}

          {/* Start/Stop Stream Button */}
          <View
            style={{
              position: 'absolute',
              bottom: height * 0.02,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 16,
              flexDirection: 'row',
              paddingVertical: 8,
              gap: 4,
            }}>
            <View style={{width: '84%'}}>
              <LiveCommentBox
                hideReaction={hideReaction}
                selectedVideo={selectedVideo}
                // data={data}
                // setData={setData}
              />
            </View>
            <LiveReaction
            // reactionPopUpVisible={reactionPopUpVisible}
            // setReactionPopUpVisible={setReactionPopUpVisible}
            // darkMode="disable"
            // isViewer={true}
            />
          </View>

          {/* Modal */}
          <LiveProductModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            selectedVideo={selectedVideo}
          />
        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default StreamViewerView;
