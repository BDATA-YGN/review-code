import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    fetchTransactionData: false,
    emptyMessage: `Oops! It's empty here.`,
    transactionList : [], // List of transactions
    walletAmount : "",
    walletCount : "",
}

export const WalletSlice = createSlice({
    name: 'WalletSlice',
    initialState,
    reducers: {
      //setting action of loading
      setFetchTransactionData: (state, action) => {
        state.fetchTransactionData = action.payload;
      },
      //setting list of data
      setTransactionList: (state, action) => {
        state.transactionList = action.payload;
      },
      setEmptyMessage: (state, action) => {
        state.emptyMessage = action.payload;
      },
      setWalletAmount: (state, action) => {
        state.walletAmount = action.payload;
      },
      setwalletCount: (state, action) => {
        state.walletCount = action.payload;
      },
    },
  });

  export const {
    setTransactionList,
    setFetchTransactionData,
    setEmptyMessage,
    setWalletAmount,
    setwalletCount
  } = WalletSlice.actions;
  
  export default WalletSlice.reducer;
