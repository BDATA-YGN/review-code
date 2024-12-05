import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  Alert,
} from 'react-native';
import COLOR from '../../../../constants/COLOR';
import IconManager from '../../../../assets/IconManager';
import {
  getLiveCommentList,
  submitComment,
} from '../../../../helper/LiveStream/liveStreamHelper';
import {logJsonData} from '../../../../helper/LiveStream/logFile';
import {useDispatch, useSelector} from 'react-redux';

const LiveCommentBox = ({hideReaction, selectedVideo, data, setData, type}) => {
  const [text, setText] = useState('');
  const dispatch = useDispatch();

  const addNewComment = comment => {
    const newId = (data.length + 1).toString();
    const newItem = {
      id: newId,
      name: `User ${newId}`,
      comment: `${comment}`,
    };
    setData([...data, newItem]);
  };

  const liveCommentList = useSelector(
    state => state.LiveStreamSlice.liveCommentList,
  );
  const isAddNewComments = useSelector(
    state => state.LiveStreamSlice.isAddNewComments,
  );

  const fetchComments = async () => {
    await getLiveCommentList(
      dispatch,
      selectedVideo.post_id,
      liveCommentList,
      isAddNewComments,
      type,
    );
  };

  const sendComment = async (comment, postId) => {
    const response = await submitComment(comment, postId);
    if (response.data.api_status === 200) {
      fetchComments();
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={text}
        onChangeText={setText}
        onFocus={hideReaction}
        placeholder="Write a comment"
        placeholderTextColor={COLOR.Grey10}
      />
      <TouchableOpacity
        style={styles.sendButton}
        onPress={() => {
          if (text !== '') {
            sendComment(text, selectedVideo.post_id);
          }
        }}>
        <Image
          source={IconManager.message_send}
          style={{width: 24, height: 24}}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLOR.Grey100, // Border color
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: 'transparent', // Transparent background
  },
  textInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    color: COLOR.White100,
  },
  sendButton: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LiveCommentBox;
