import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  textInput: '',
  selectedImage: '',
  selectedColor: '#4C2E88',
  selectedFont : 'Poppins-Regular',
  loading: false,
  success: false,
  error: null,
}


const MydaySlice = createSlice({
  name: 'MyDaySlice',
  initialState,
  reducers: {
    setSelectedImage: (state, action) => {
      state.selectedImage = action.payload;
    },
    setSelectedColor: (state, action) => {
      state.selectedColor = action.payload;
    },
    setSelectedFont: (state, action) => {
      state.selectedFont = action.payload;
    },
    setTextInput: (state, action) => {
      state.textInput = action.payload;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },

});


export const {
  setTextInput,
  setSelectedImage,
  setSelectedColor,
  setSelectedFont,
  setSuccess,
  setLoading,
} = MydaySlice.actions;


export default MydaySlice.reducer;
