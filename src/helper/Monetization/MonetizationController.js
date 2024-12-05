import ApiService from "../ApiService";
import { SERVER_KEY } from "../../config";

export const getMonetizedList = (accessTokenValue,user_id) => {
    const formData = new FormData();
    formData.append('server_key', SERVER_KEY);
    formData.append('type', "monetization_list");
    formData.append('user_id', user_id)
    console.log(formData)
    return ApiService.post(`api/monetizations?access_token=${accessTokenValue}`, formData);
};

export const EditNewPlan = (
    type,
    id,
    title,
    price,
    currency,
    period,
    description,
    access_token,
  ) => {
    const formData = new FormData();
    formData.append('server_key', SERVER_KEY); // Ensure SERVER_KEY is defined correctly
    formData.append('type', type);   // Defaults to 'bank' if not provided
    formData.append('id', id); 
    formData.append('title', title);
    formData.append('price', price);
    formData.append('currency', currency);
    formData.append('period', period);
    formData.append('description', description);
  
    console.log(formData)
    return ApiService.post(
      `api/monetizations?access_token=${access_token}`,
      formData,
    );
  };

  export const getSubscribeList = (accessTokenValue) => {
    const formData = new FormData();
    formData.append('server_key', SERVER_KEY);
    formData.append('type', "subscriptions");
    // console.log(page)
    return ApiService.post(`api/monetizations?access_token=${accessTokenValue}`, formData);
};

export const submitSubscribed = (accessTokenValue, id) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', "subscribe");
  formData.append('id', id); 
  console.log(id)
  console.log(formData)
  return ApiService.post(`api/monetizations?access_token=${accessTokenValue}`, formData);
};

export const submitUnSubscribed = (accessTokenValue, id) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', "delete-subscription");
  formData.append('id', id); 
  console.log(id)
  console.log(formData)
  return ApiService.post(`api/monetizations?access_token=${accessTokenValue}`, formData);
};

export const submitDeleteMonetized = (accessTokenValue, id) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', "delete");
  formData.append('id', id); 
  console.log(id)
  console.log(formData)
  return ApiService.post(`api/monetizations?access_token=${accessTokenValue}`, formData);
};

export const requestCurrencyLists = (accessTokenValue) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', "currencies");
  console.log(formData)
  return ApiService.post(`api/currencies?access_token=${accessTokenValue}`, formData);
};
