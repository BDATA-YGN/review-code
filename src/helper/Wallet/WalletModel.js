import {retrieveJsonData, storeKeys} from '../AsyncStorage';
import { getLoadMorePaymentList, getPaymentDateFilterList, getPaymentFilterList, getPaymentList, getTransactionList, getWalletAmount } from './WalletController';
import { setFetchTransactionData, setTransactionList} from '../../stores/slices/WalletSlice';

// export const requestTransactionList = async (dispatch, filteredTransactions, limit, page) => {
//   try {
//     const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
//     const response = await getTransactionList(loginData.access_token, filteredTransactions, limit , page);
//     if (response.data.api_status == 200) {
//     } else {
//     }
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
export const requestTransactionList = async (filteredTransactions, limit, page , startDate , endDate) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const response = await getTransactionList(loginData.access_token, filteredTransactions, limit , page , startDate , endDate);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const requestPaymentFilterList = async (status,limit, page) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const response = await getPaymentFilterList(loginData.access_token, status,limit, page);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const requestPaymentDateFilterList = async (startDate , endDate, limit,
  newPage) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const response = await getPaymentDateFilterList(loginData.access_token,startDate , endDate,limit,
      newPage);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const requestPaymentList = async (limit, page) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const response = await getPaymentList(loginData.access_token,limit, page);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const requestLoadMorePaymentList = async (limit,page) => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const response = await getLoadMorePaymentList(loginData.access_token,limit,page);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
// export const requestLoadMorePaymentList = async () => {
//   try {
//     const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
//     const response = await getPaymentList(loginData.access_token);
//     if (response.data.api_status == 200) {
//     } else {
//     }
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };
export const requestWalletAmount = async () => {
  try {
    const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
    const response = await getWalletAmount(loginData.access_token);
    if (response.data.api_status == 200) {
    } else {
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};