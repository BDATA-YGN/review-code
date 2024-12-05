import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  fetchVersionControl: true,
};

export const VersionControlSlice = createSlice({
  name: 'VersionControlSlice',
  initialState,
  reducers: {
    setFetchVersionControl: (state, action) => {
      state.fetchVersionControl = action.payload;
    },
  },
});

export const {setFetchVersionControl} = VersionControlSlice.actions;

export default VersionControlSlice.reducer;
