import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';

export const storeKeys = {
  credential: '@MYSPACE:credential',
  language: '@MYSPACE:language',
  loginCredential: '@MYSPACE:loginCredential',
  darkTheme: '@MYSPACE:darkTheme',
  rememberMe: '@MYSPACE:rememberMe',
  userInfoData: '@MYSPACE:userInfoData',
  isOnBoarding: '@MYSPACE:onBoardingData',
};

export const retrieveKey = async function (key) {
  try {
    return AsyncStorage.getItem(key);
  } catch (err) {
    if (err) {
      return AsyncStorage.getItem(key);
    }
    return new Promise((resolved, failed) => resolved(''));
  }
};

export const storeJsonData = async function ({key, data}) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {}
};

export const clearData = async function ({key}) {
  try {
    await AsyncStorage.removeItem(key);
    // navigation.navigate('Login')
  } catch (error) {}
};

export const retrieveJsonData = async function ({key}) {
  try {
    const storedData = await AsyncStorage.getItem(key);
    if (storedData !== null) {
      return JSON.parse(storedData);
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

// const data = {
//   "api_status": 200,
//   "timezone": "UTC",
//   "access_token": "4f66aa6db0a09feb2e809d314da0bab8d26312388118c100f2df522f81cf9fac9c515730604350241ee942c6b182d0f041a2312947385b23",
//   "user_id": "538",
//   "membership": false
// };

// // Storing data
// storeData(data);

export const storeStringData = async function ({key, data}) {
  try {
    await AsyncStorage.setItem(key, data);
  } catch (error) {}
};

export const retrieveStringData = async function ({key}) {
  try {
    const storedData = await AsyncStorage.getItem(key);
    if (storedData !== null) {
      return storedData;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};
