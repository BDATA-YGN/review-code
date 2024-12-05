import {View, Viewt} from 'react-native';
import React from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';

const PostYoutubePlayer = props => {
  return (
    <View>
      {props.postYoutube ? (
        <View>
          <YoutubePlayer height={230} videoId={props.postYoutube} />
        </View>
      ) : (
        ''
      )}
    </View>
  );
};

export default PostYoutubePlayer;
