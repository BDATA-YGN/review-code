import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import ApiService from '../ApiService';
import { SERVER_KEY } from '../../config';
import { all } from 'axios';
import { useId } from 'react';
import { stringKey } from '../constants/StringKey';
import { relationship } from '../constants/CONSTANT_ARRAY';

export const getTransactionList = (accessTokenValue, filteredTransactions, limit, page , startDate , endDate) => {
    const formData = new FormData();
    console.log("limt-controller", filteredTransactions)
    formData.append('server_key', SERVER_KEY);
    formData.append('type', "transactions");
    formData.append('limit', limit);
    formData.append('kind', filteredTransactions);
    formData.append('page', page);
    if(startDate != "" &&  endDate != ""){
        formData.append('start_date', startDate);
        formData.append('end_date', endDate);
        
    }
    return ApiService.post(`api/wallet?access_token=${accessTokenValue}`, formData);
};
export const getPaymentFilterList = (accessTokenValue, status,limit,page) => {
    const formData = new FormData();
    formData.append('server_key', SERVER_KEY);
    formData.append('type', "payment_history");
    formData.append('status', status);
    formData.append('limit', limit);
    formData.append('page', page);
    console.log(page)
    return ApiService.post(`api/wallet?access_token=${accessTokenValue}`, formData);
};
export const getPaymentDateFilterList = (accessTokenValue,startDate , endDate, limit,
    page) => {
    const formData = new FormData();
    formData.append('server_key', SERVER_KEY);
    formData.append('type', "payment_history");
    if(startDate != "" &&  endDate != ""){
        formData.append('start_date', startDate);
        formData.append('end_date', endDate);
        
    }
    formData.append('limit', limit);
    formData.append('page', page);
    console.log(page)
    return ApiService.post(`api/wallet?access_token=${accessTokenValue}`, formData);
};
export const getPaymentList = (accessTokenValue,limit, page) => {
    const formData = new FormData();
    formData.append('server_key', SERVER_KEY);
    formData.append('type', "payment_history");
    formData.append('limit', limit);
    formData.append('page', page);
    console.log(page)
    return ApiService.post(`api/wallet?access_token=${accessTokenValue}`, formData);
};
export const getLoadMorePaymentList = (accessTokenValue,limit,page) => {
    const formData = new FormData();
    formData.append('server_key', SERVER_KEY);
    formData.append('type', "payment_history");
    formData.append('limit', limit);
    formData.append('page', page);
    console.log(page)
    return ApiService.post(`api/wallet?access_token=${accessTokenValue}`, formData);
};
export const getWalletAmount = (accessTokenValue) => {
    const formData = new FormData();
    formData.append('server_key', SERVER_KEY);
    formData.append('type', "wallet_amount");
    return ApiService.post(`api/wallet?access_token=${accessTokenValue}`, formData);
};