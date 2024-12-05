import {createSlice} from '@reduxjs/toolkit';
import {all} from 'axios';
import {Alert} from 'react-native';

export const pageSlice = createSlice({
  name: 'page',
  initialState: {
    isRefreshing: false,
    myPageList: [],
    isLoading: false,
    likePageList: [],
    recommendedList: [],
    fetchPageInfoList: false,
    fetchGroupInfoList: false,
    acitivePageIndex: null,
  },
  reducers: {
    setIsRefreshing: (state, action) => {
      state.isRefreshing = action.payload;
    },
    setMyPageList: (state, action) => {
      state.myPageList = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setActivePageIndex: (state, action) => {
      state.acitivePageIndex = action.payload;
    },
    setLikePageList: (state, action) => {
      state.likePageList = action.payload;
    },
    setRecommendedList: (state, action) => {
      state.recommendedList = action.payload;
    },
    setPageInfoData: (state, action) => {
      state.fetchPageInfoList = action.payload;
    },

    setGroupInfoData: (state, action) => {
      state.fetchGroupInfoList = action.payload;
    },
  },
});

export const {
  setIsRefreshing,
  setMyPageList,
  setIsLoading,
  setLikePageList,
  setRecommendedList,
  setPageInfoData,
  setGroupInfoData,
  setActivePageIndex,
} = pageSlice.actions;

export const selectPage = state => state.page;

export default pageSlice.reducer;
