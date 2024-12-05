import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
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

const PostBody = props => {
  return (
    <View style={styles.cardBody}>
      <PostText
        postText={
          props.data?.shared_info != null
            ? props.data?.shared_info?.Orginaltext
            : props.data?.Orginaltext
        }
        mentions_users={
          props.isShared
            ? props.data.shared_info.mentions_users
            : props.data.mentions_users
        }
        darkMode={props.darkMode}
      />
      <NewFeedImageAndVideo
        photo_multi={props.data?.photo_multi}
        postFile_full={props.data?.postFile_full}
        isPlaying={props.isPlaying}
        onPlay={props.onPlay}
        index={props.index}
      />
      {/* <PostImage postFile={props.data?.postFile_full} /> */}
      <PostEvent postEvent={props.data?.event} />
      {/* <PostMultiImage photo_multi={props.data?.photo_multi} /> */}
      <PostPhotoAlbum photo_album={props.data?.photo_album} />
      <PostYoutubePlayer postYoutube={props.data?.postYoutube} />
      {/* <PostVideo
        postFile={props.data?.postFile}
        poster={props.data?.postFileThumb}
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
