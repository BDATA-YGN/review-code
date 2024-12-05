import {createSlice} from '@reduxjs/toolkit';
import {postPrivary} from '../../constants/CONSTANT_ARRAY';
import {act} from 'react-test-renderer';
import {Alert} from 'react-native';

const initialState = {
  postText: '',
  postTextWithMention: '',
  selectedPostPrivacy: postPrivary[0],
  postPhotos: [],
  postVideo: null,
  postGif: null,
  feelingType: null,
  feeling: null,
  selectedMentionFriends: [],
  successPosting: false,
  loadingPosting: false,
  errorPosting: false,
};

const AddPostSlice = createSlice({
  name: 'AddPostSlice',
  initialState,
  reducers: {
    setPostText: (state, action) => {
      state.postText = action.payload;
    },
    setPostTextWithMention: (state, action) => {
      state.postTextWithMention = action.payload;
    },
    setSelectedPostPrivacy: (state, action) => {
      state.selectedPostPrivacy = action.payload;
    },
    setPostPhotos: (state, action) => {
      state.postPhotos = action.payload;
    },
    setPostVideo: (state, action) => {
      state.postVideo = action.payload;
    },
    setPostGif: (state, action) => {
      state.postGif = action.payload;
    },
    setFeelingType: (state, action) => {
      state.feelingType = action.payload;
    },
    setFeeling: (state, action) => {
      state.feeling = action.payload;
    },
    setSelectedMentionFriends: (state, action) => {
      state.selectedMentionFriends = action.payload;
    },
    setSuccessPosting: (state, action) => {
      state.successPosting = action.payload;
    },
    setLoadingPosting: (state, action) => {
      state.loadingPosting = action.payload;
    },
    setErrorPosting: (state, action) => {
      state.errorPosting = action.payload;
    },
  },
});

export const {
  setPostText,
  setPostTextWithMention,
  setSelectedPostPrivacy,
  setPostPhotos,
  setPostVideo,
  setPostGif,
  setFeelingType,
  setFeeling,
  setSelectedMentionFriends,
  setLoadingPosting,
  setSuccessPosting,
  setErrorPosting,
} = AddPostSlice.actions;

export default AddPostSlice.reducer;
