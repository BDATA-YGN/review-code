import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedBgColor : '#4C2E88',
    text : '',
}

const CreateStorySlice = createSlice({
  name: 'CreateStorySlice',
  initialState,
  reducers: {
    setSelectedBgColor : (state , action) => {
        state.selectedBgColor = action.payload;
    },
    setText : (state , action) => {
        state.text = action.payload;
    },
 
   
  },

});

export const {
    setSelectedBgColor,
    setText,
} = CreateStorySlice.actions;

export default CreateStorySlice.reducer;
