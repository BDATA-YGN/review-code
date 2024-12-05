import { retrieveJsonData ,storeKeys} from "../AsyncStorage";
import { EditNewPlan, getMonetizedList, getSubscribeList, requestCurrencyLists, submitDeleteMonetized, submitSubscribed, submitUnSubscribed } from "./MonetizationController";

export const requestMonetizationList = async (user_id) => {
    try {
      const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
      const response = await getMonetizedList(loginData.access_token,user_id);
      if (response.data.api_status == 200) {
      } else {
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const UpdateNewPlan = async (
    type,
    id,
    title,
    price,
    currency,
    period,
    description
  ) => {
    try {
      const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
      const accessTokenValue = loginData.access_token;
      const response = await EditNewPlan(
        type,
        id,
        title,
        price,
        currency,
        period,
        description,
        accessTokenValue,
      );
      if (response.api_status == 200) {
      } else {
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  export const requestSubScriptionList = async () => {
    try {
      const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
      const response = await getSubscribeList(loginData.access_token);
      if (response.data.api_status == 200) {
      } else {
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const requestSubscribed = async (id) => {
    try {
      const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
      const response = await submitSubscribed(loginData.access_token,id);
      if (response.data.api_status == 200) {
      } else {
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const requestUnSubscribed = async (id) => {
    try {
      const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
      const response = await submitUnSubscribed(loginData.access_token,id);
      if (response.data.api_status == 200) {
      } else {
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const requestDeleteMonetization = async (id) => {
    try {
      const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
      const response = await submitDeleteMonetized(loginData.access_token,id);
      if (response.data.api_status == 200) {
      } else {
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const getCurrecyLists = async () => {
    try {
      const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
      const response = await requestCurrencyLists(loginData.access_token);
      if (response.data.api_status == 200) {
      } else {
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };