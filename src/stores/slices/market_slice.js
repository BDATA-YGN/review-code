import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  fetchMarketData: false,
  fetchMyProductsData: false,
  fetchPurchasedData: false,
  fetchAddressData: false,
  fetchCheckoutCartData: false,
  fetchPostById: false,
  fetchEmojiList: false,
  fetchPageList: false,
  fetchGroupList: false,
  fetchOrderedList: false,
  isSendInvoiceMail: false,
  marketList: [], // List of market items
  myProductsList: [], // List of user's products
  purchasedList: [], // List of purchased items
  addressList: [],
  checkoutCartList: [],
  cartTotalPrice: 0,
  unitList: [],
  postData: {},
  emojiList: [],
  pageList: [],
  groupList: [],
  userInfoData: {},
  checkedItem: null,
  darkTheme: null,
  orderedList: [],
  emptyMessage: `Oops! It's empty here.`,
};

export const MarketSlice = createSlice({
  name: 'MarketSlice',
  initialState,
  reducers: {
    //setting action of loading
    setFetchMarketData: (state, action) => {
      state.fetchMarketData = action.payload;
    },
    setFetchMyProductsData: (state, action) => {
      state.fetchMyProductsData = action.payload;
    },
    setFetchPurchasedData: (state, action) => {
      state.fetchPurchasedData = action.payload;
    },
    setFetchAddressData: (state, action) => {
      state.fetchAddressData = action.payload;
    },
    setFetchCheckoutCartData: (state, action) => {
      state.fetchCheckoutCartData = action.payload;
    },
    setFetchPostById: (state, action) => {
      state.fetchPostById = action.payload;
    },
    setFetchEmojiList: (state, action) => {
      state.fetchEmojiList = action.payload;
    },
    setFetchPageList: (state, action) => {
      state.fetchPageList = action.payload;
    },
    setFetchGroupList: (state, action) => {
      state.fetchGroupList = action.payload;
    },
    setFetchOrderedList: (state, action) => {
      state.fetchOrderedList = action.payload;
    },
    setIsSendInvoiceMail: (state, action) => {
      state.isSendInvoiceMail = action.payload;
    },

    //setting list of data
    setMarketList: (state, action) => {
      state.marketList.push(...action.payload);
    },
    filteredMarketList: (state, action) => {
      state.marketList = action.payload; // Replace data (e.g., after filtering)
    },
    setMyProductsList: (state, action) => {
      state.myProductsList = action.payload;
    },
    setPurchasedList: (state, action) => {
      state.purchasedList = action.payload;
    },
    setAddressList: (state, action) => {
      state.addressList = action.payload;
    },
    setCheckoutCartList: (state, action) => {
      state.checkoutCartList = action.payload;
    },
    setCartTotalPrice: (state, action) => {
      state.cartTotalPrice = action.payload;
    },
    setUnitList: (state, action) => {
      state.unitList = action.payload;
    },
    setPostData: (state, action) => {
      state.postData = action.payload;
    },
    setEmojiList: (state, action) => {
      state.emojiList = action.payload;
    },
    setPageList: (state, action) => {
      state.pageList = action.payload;
    },
    setGroupList: (state, action) => {
      state.groupList = action.payload;
    },
    setUserInfoData: (state, action) => {
      state.userInfoData = action.payload;
    },
    // Set the checked item ID
    setCheckedItem: (state, action) => {
      state.checkedItem = action.payload;
    },
    // Clear the checked item ID
    clearCheckedItem: state => {
      state.checkedItem = null;
    },
    setDarkTheme: state => {
      state.darkTheme = null;
    },
    setOrderedList: (state, action) => {
      state.orderedList = action.payload;
    },
    setEmptyMessage: (state, action) => {
      state.emptyMessage = action.payload;
    },

    //add by item
    addMarketItem: (state, action) => {
      state.marketList.push(action.payload);
    },
    addMyProduct: (state, action) => {
      state.myProductsList.push(action.payload);
    },
    addPurchasedItem: (state, action) => {
      state.purchasedList.push(action.payload);
    },
    addAddressItem: (state, action) => {
      state.addressList.push(action.payload);
    },
    addCheckoutCartItem: (state, action) => {
      state.checkoutCartList.push(action.payload);
    },

    //for list update
    updateMarketItem: (state, action) => {
      const {id, updatedItem} = action.payload;
      const index = state.marketList.findIndex(item => item.id === id);
      if (index !== -1) {
        state.marketList[index] = updatedItem;
      }
    },
    updateMyProduct: (state, action) => {
      const {id, updatedProduct} = action.payload;
      const index = state.myProductsList.findIndex(
        product => product.id === id,
      );
      if (index !== -1) {
        state.myProductsList[index] = updatedProduct;
      }
    },
    updatePurchasedItem: (state, action) => {
      const {id, updatedItem} = action.payload;
      const index = state.purchasedList.findIndex(item => item.id === id);
      if (index !== -1) {
        state.purchasedList[index] = updatedItem;
      }
    },
    updateAddressItem: (state, action) => {
      const {id, updatedItem} = action.payload;
      const index = state.addressList.findIndex(item => item.id === id);
      if (index !== -1) {
        state.addressList[index] = updatedItem;
      }
    },
    updateCheckoutCartItem: (state, action) => {
      const {id, updatedItem} = action.payload;
      const index = state.checkoutCartList.findIndex(item => item.id === id);
      if (index !== -1) {
        state.checkoutCartList[index] = updatedItem;
      }
    },

    //remove item by id
    removeMarketItem: (state, action) => {
      const id = action.payload;
      state.marketList = state.marketList.filter(item => item.id !== id);
    },
    removeMyProduct: (state, action) => {
      const id = action.payload;
      state.myProductsList = state.myProductsList.filter(
        product => product.id !== id,
      );
    },
    removePurchasedItem: (state, action) => {
      const id = action.payload;
      state.purchasedList = state.purchasedList.filter(item => item.id !== id);
    },
    removeAddressItem: (state, action) => {
      const id = action.payload;
      state.addressList = state.addressList.filter(item => item.id !== id);
    },
    removeCheckoutCartItem: (state, action) => {
      const id = action.payload;
      state.checkoutCartList = state.checkoutCartList.filter(
        item => item.id !== id,
      );
    },
  },
});

export const {
  setFetchMarketData,
  setFetchMyProductsData,
  setFetchPurchasedData,
  setFetchAddressData,
  setFetchCheckoutCartData,
  setFetchPostById,
  setFetchEmojiList,
  setFetchPageList,
  setFetchGroupList,
  setFetchOrderedList,
  setIsSendInvoiceMail,
  filteredMarketList,
  setMarketList,
  setMyProductsList,
  setPurchasedList,
  setAddressList,
  setCheckoutCartList,
  setCartTotalPrice,
  setUnitList,
  setPostData,
  setEmojiList,
  setPageList,
  setGroupList,
  setUserInfoData,
  setCheckedItem,
  clearCheckedItem,
  setDarkTheme,
  setOrderedList,
  setEmptyMessage,

  addMarketItem,
  addMyProduct,
  addPurchasedItem,
  addAddressItem,
  addCheckoutCartItem,

  updateMarketItem,
  updateMyProduct,
  updatePurchasedItem,
  updateAddressItem,
  updateCheckoutCartItem,

  removeMarketItem,
  removeMyProduct,
  removePurchasedItem,
  removeAddressItem,
  removeCheckoutCartItem,
} = MarketSlice.actions;

export default MarketSlice.reducer;
