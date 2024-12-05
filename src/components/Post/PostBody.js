import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback} from 'react';
import PostImage from './PostImage';
import PostMultiImage from './PostMultiImage';
import PostPhotoAlbum from './PostPhotoAlbum';
import PostVideo from './PostVideo';
import PostYoutubePlayer from './PostYoutubePlayer';
import PostText from './PostText';
import COLOR from '../../constants/COLOR';
import PostEvent from './PostEvent';
import ImageGrid from '../../screens/Post/MarketPost/image_grid';
import AppImageSlider from './imageSliderTest';
import NewFeedImageAndVideo from './imageAndVideoTest';

const PostBody = (
  {data, darkMode, isPlaying, onPlay, index, whereFrom},
  props,
) => {
  const imageAndVideo = useCallback(() => {
    return (
      <NewFeedImageAndVideo
        photo_multi={data?.photo_multi}
        postFile_full={data?.postFile_full}
        index={index}
        whereFrom={whereFrom}
      />
    );
  });
  return (
    <View style={styles.cardBody}>
      <PostText
        postText={
          data?.shared_info != null
            ? data?.shared_info?.Orginaltext
            : data?.Orginaltext
        }
        mentions_users={
          props.isShared ? data.shared_info.mentions_users : data.mentions_users
        }
        darkMode={darkMode}
      />
      {imageAndVideo()}
      {/* <PostImage postFile={data?.postFile_full} /> */}
      <PostEvent postEvent={data?.event} />
      {/* <PostMultiImage photo_multi={data?.photo_multi} /> */}
      {/* <PostPhotoAlbum photo_album={data?.photo_album} /> */}
      {data?.photo_album && data?.photo_album.length > 0 ? (
        <AppImageSlider clickable={true} imageList={data?.photo_album} />
      ) : null}
      <PostYoutubePlayer postYoutube={data?.postYoutube} />
      {/* <PostVideo
        postFile={data?.postFile}
        poster={data?.postFileThumb}
      /> */}
    </View>
  );
};

export default PostBody;
const styles = StyleSheet.create({
  cardBody: {
    marginTop: 10,
  },
  bodyText: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: COLOR.Grey500,
    paddingLeft: 16,
  },
});
