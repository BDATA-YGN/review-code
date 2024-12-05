import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  fetchCommentData: false,
  fetchReplyCommentData: false,
};

export const CommentSlice = createSlice({
  name: 'CommentSlice',
  initialState,
  reducers: {
    setFetchCommentData: (state, action) => {
      state.fetchCommentData = action.payload;
    },
    setFetchReplyCommentData: (state, action) => {
      state.fetchReplyCommentData = action.payload;
    },
  },
});

export const {setFetchCommentData, setFetchReplyCommentData} =
  CommentSlice.actions;

export default CommentSlice.reducer;
