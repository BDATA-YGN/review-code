import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  fetchUserInfoData: false,
};

export const UserInfoSlice = createSlice({
  name: 'UserInfoSlice',
  initialState,
  reducers: {
    setFetchUserInfo: (state, action) => {
      state.fetchUserInfoData = action.payload;
    },
  },
});

export const {setFetchUserInfo} = UserInfoSlice.actions;

export default UserInfoSlice.reducer;
