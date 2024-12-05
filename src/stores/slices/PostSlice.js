import {createSlice} from '@reduxjs/toolkit';
import {Alert} from 'react-native';

const initialState = {
  fetchNFData: false,
  fetchPGData: false,
  fetchGroupList: false,
  fetchPageList: false,
  isVideoPlay: null,
  isMyPageVideoPlay: null,
  isMySavePostVideoPlay: null,
  isMyPopularPaostVideoPlay: null,
  posts: [],
  shortVideo: [],
  myPagePost: [],
  popularPost: [],
  savePost: [],
  singlePostItem: {},
  currentPlayIndex: null,
  activePageIndex: null,
  scrollPosition: 0,
  activePageIndexCopy: null,
};

export const PostSlice = createSlice({
  name: 'PostSlice',
  initialState,
  reducers: {
    setFetchNewFeedData: (state, action) => {
      state.fetchNFData = action.payload;
    },
    setFetchPGData: (state, action) => {
      state.fetchPGData = action.payload;
    },
    setFetchGroupList: (state, action) => {
      state.fetchGroupList = action.payload;
    },
    setFetchPageList: (state, action) => {
      state.fetchPageList = action.payload;
    },
    setIsVideoPlay: (state, action) => {
      state.isVideoPlay = action.payload;
    },
    setIsMyPageVideoPlay: (state, action) => {
      state.isMyPageVideoPlay = action.payload;
    },
    setIsMySavePostVideoPlay: (state, action) => {
      state.isMySavePostVideoPlay = action.payload;
    },
    setIsMyPopularPostVideoPlay: (state, action) => {
      state.isMyPopularPaostVideoPlay = action.payload;
    },
    setCurrentPlayIndex: (state, action) => {
      state.currentPlayIndex = action.payload;
    },
    setActivePageIndex: (state, action) => {
      state.activePageIndex = action.payload;
    },
    setScrollPosition: (state, action) => {
      state.scrollPosition = action.payload;
    },
    setActivePageIndexCopy: (state, action) => {
      state.activePageIndexCopy = action.payload;
    },
    setPostList: (state, action) => {
      state.posts = action.payload;
    },
    setShortVideo: (state, action) => {
      state.shortVideo = action.payload;
    },
    setMyPagePostList: (state, action) => {
      state.myPagePost = action.payload;
    },
    setPopularPostList: (state, action) => {
      state.popularPost = action.payload;
    },
    setSavePostList: (state, action) => {
      state.savePost = action.payload;
    },
    updatePostItemField: (state, action) => {
      const {id, field, value} = action.payload;
      const item = state.posts.find(post => post.post_id === id);
      if (item) {
        item[field] = value;
      }
    },
    addNewPostList: (state, action) => {
      state.posts.push(...action.payload);
    },
    addNewPostItem: (state, action) => {
      state.posts.unshift(action.payload);
    },

    //for my page post
    updateMyPagePostItemField: (state, action) => {
      const {id, field, value} = action.payload;
      const item = state.myPagePost.find(post => post.post_id === id);
      if (item) {
        item[field] = value;
      }
    },
    addNewMyPagePostList: (state, action) => {
      state.myPagePost.push(...action.payload);
    },
    addNewMyPagePostItem: (state, action) => {
      state.myPagePost.unshift(action.payload);
    },

    //for popular post
    updatePopularPostItemField: (state, action) => {
      const {id, field, value} = action.payload;
      const item = state.popularPost.find(post => post.post_id === id);
      if (item) {
        item[field] = value;
      }
    },
    addNewPopularPostList: (state, action) => {
      state.popularPost.push(...action.payload);
    },
    addNewPopularPostItem: (state, action) => {
      state.popularPost.unshift(action.payload);
    },

    //for save post
    updateSavePostItemField: (state, action) => {
      const {id, field, value} = action.payload;
      const item = state.savePost.find(post => post.post_id === id);
      if (item) {
        item[field] = value;
      }
    },
    addNewSavePostList: (state, action) => {
      state.savePost.push(...action.payload);
    },
    addNewSavePostItem: (state, action) => {
      state.savePost.unshift(action.payload);
    },
    // Inside reducers
    removeSavePostItem: (state, action) => {
      const postId = action.payload;
      state.savePost = state.savePost.filter(post => post.post_id !== postId);
    },

    //for short video post
    updateShortVideoPostItemField: (state, action) => {
      const {id, field, value} = action.payload;
      const item = state.shortVideo.find(post => post.post_id === id);
      if (item) {
        item[field] = value;
      }
    },
    addNewShortVideoPostList: (state, action) => {
      state.shortVideo.push(...action.payload);
    },
    addNewShortVideoPostItem: (state, action) => {
      state.shortVideo.unshift(action.payload);
    },

    //for post details
    setSinglePostItem: (state, action) => {
      state.singlePostItem = action.payload;
    },

    updateSinglePostItemField: (state, action) => {
      const {field, value} = action.payload;
      if (state.singlePostItem) {
        state.singlePostItem[field] = value;
      }
    },
  },
});

export const {
  setPopularPostList,
  updatePopularPostItemField,
  addNewPopularPostList,
  addNewPopularPostItem,
  setFetchNewFeedData,
  setFetchPGData,
  setFetchGroupList,
  setFetchPageList,
  setPostList,
  addNewPostList,
  setIsVideoPlay,
  updatePostItemField,
  setCurrentPlayIndex,
  addNewPostItem,
  updateSinglePostItemField,
  setSinglePostItem,
  updateMyPagePostItemField,
  addNewMyPagePostList,
  addNewMyPagePostItem,
  setIsMyPageVideoPlay,
  setMyPagePostList,
  setActivePageIndex,
  setActivePageIndexCopy,
  setSavePostList,
  updateSavePostItemField,
  addNewSavePostItem,
  addNewSavePostList,
  removeSavePostItem,
  setIsMySavePostVideoPlay,
  setIsMyPopularPostVideoPlay,
  setShortVideo,
  updateShortVideoPostItemField,
  addNewShortVideoPostItem,
  addNewShortVideoPostList,
  setScrollPosition,
} = PostSlice.actions;

export default PostSlice.reducer;
