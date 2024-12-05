import {createSlice} from '@reduxjs/toolkit';


const initialState = {
  productName: '',
  productPrice:'',
  productCurrency:'',
  productCategory:'',
  productDescription:'',
  productCondition:'',
  productPhotos: [],
  productLocation :'',
  productUnit : '',

};

const CreateProductSlice = createSlice({
  name: 'CreateProductSlice',
  initialState,
  reducers: {
    setProductName: (state, action) => {
      state.productName = action.payload;
    },
    setProductPrice: (state, action) => {
        state.productPrice = action.payload;
      },
    setProductCurrency : (state, action) => {
      state.productCurrency = action.payload;
    },
    setProductCategory : (state, action) => {
      state.productCategory = action.payload;
    },
    setProductDescription : (state, action) => {
      state.productDescription = action.payload;
    },
    setProductCondition : (state, action) => {
      state.productCondition = action.payload;
    },
    setProductPhotos: (state, action) => {
      state.productPhotos = action.payload; // Set photos array
    },
    addProductPhoto: (state, action) => {
      state.productPhotos.push(action.payload);
    },
    removeProductPhoto: (state, action) => {
      state.productPhotos = state.productPhotos.filter(photo => photo !== action.payload);
    },
    setProductLocation : (state , action) => {
      state.productLocation = action.payload;
    },
    setProductUnit : (state, action) => {
      state.productUnit = action.payload;
    }
  },
});

export const {
    setProductName,
    setProductPrice,
    setProductCurrency,
    setProductCategory,
    setProductDescription,
    setProductCondition,
    setProductPhotos,
    setProductLocation,
    setProductUnit,
    addProductPhoto,
    removeProductPhoto

} = CreateProductSlice.actions;

export default CreateProductSlice.reducer;
