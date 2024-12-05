import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  fetchUserList: false,
  userList: [],
  fetchPageList: false,
  pageList: [],
  fetchGroupList: false,
  groupList: [],
  searchText: '',
  isDarkMode: 'disable',
};

export const SearchSlice = createSlice({
  name: 'SearchSlice',
  initialState,
  reducers: {
    //setting action of loading
    setFetchUserData: (state, action) => {
      state.fetchPageList = action.payload;
    },
    setFetchPageData: (state, action) => {
      state.fetchPageList = action.payload;
    },
    setFetchGroupData: (state, action) => {
      state.fetchGroupList = action.payload;
    },
    setSearchDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
    },

    //setting list of data
    setUserList: (state, action) => {
      state.userList = action.payload;
    },
    setPageList: (state, action) => {
      state.pageList = action.payload;
    },
    setGroupList: (state, action) => {
      state.groupList = action.payload;
    },

    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },

    //add by item
    addUserItem: (state, action) => {
      state.userList.push(action.payload);
    },
    addPageItem: (state, action) => {
      state.pageList.push(action.payload);
    },
    addGroupItem: (state, action) => {
      state.groupList.push(action.payload);
    },

    //for list update
    updateUserItem: (state, action) => {
      const {id, updatedItem} = action.payload;
      const index = state.userList.findIndex(item => item.id === id);
      if (index !== -1) {
        state.userList[index] = updatedItem;
      }
    },
    updatePageItem: (state, action) => {
      const {id, updatedItem} = action.payload;
      const index = state.pageList.findIndex(item => item.id === id);
      if (index !== -1) {
        state.pageList[index] = updatedItem;
      }
    },
    updateGroupItem: (state, action) => {
      const {id, updatedItem} = action.payload;
      const index = state.groupList.findIndex(item => item.id === id);
      if (index !== -1) {
        state.groupList[index] = updatedItem;
      }
    },
  },
});

export const {
  setFetchUserData,
  setFetchPageData,
  setFetchGroupData,
  setUserList,
  setPageList,
  setGroupList,
  addUserItem,
  addPageItem,
  addGroupItem,
  updateUserItem,
  updatePageItem,
  updateGroupItem,
  setSearchText,
  setSearchDarkMode,
  //test
} = SearchSlice.actions;

export default SearchSlice.reducer;
//test
