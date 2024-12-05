import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  fetchDarkMode: false,
};

export const DarkModeSlice = createSlice({
  name: 'DarkModeSlice',
  initialState,
  reducers: {
    setFetchDarkMode: (state, action) => {
      state.fetchDarkMode = action.payload;
    },
  },
});

export const {setFetchDarkMode} = DarkModeSlice.actions;

export default DarkModeSlice.reducer;
