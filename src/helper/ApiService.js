// import axios from 'axios';
// import { URL } from '../config';

// const ApiService = axios.create();
// // const accessTokenValue = await getData("access_token");
// const accessTokenValue="034178893e755de976959af81572051036eafbae99f9dd3c42951e7dea736b65b5b5c6cd5523312896ba4a06bae961abbfb783d9d715150c"
// ApiService.interceptors.request.use(
//   async config => {
//     //get baseUrl and combine url
//     config.url = URL;
//     const contentType = config.headers['Content-Type'];
//     //Modify Axios's config headers
//     config.headers = {
//       Accept: 'application/json',
//       'Content-Type': contentType ? contentType : 'application/json',
//     };
//     config.headers['Authorization'] = `Basic ${accessTokenValue}`;
//     return config;
//   },
//   error => {
//     // handle the error
//     return Promise.reject(error);
//   },
// );

// ApiService.interceptors.response.use(
//   function (response) {

//     return response;
//   },
//   async function (error) {
//     return Promise.reject(error);
//   },
// );

// export default ApiService;

import axios from 'axios';
import {URL} from '../config';

const ApiService = axios.create();

// const accessTokenValue = "45bc821a59dc81d60991ac417c1cc4ce885bc8c4b9572949d575449db602ea56263bfaa223712596b075703bbe07a50ddcccfaac424bb6d9";

ApiService.interceptors.request.use(
  async config => {
    config.baseURL = URL;
    config.headers = {
      'content-type': 'multipart/form-data',
      Accept: 'application/json',
      // 'Authorization': `Basic ${accessTokenValue}`
    };
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// ApiService.interceptors.request.use(
//   async config => {
//     config.baseURL = URL;
//     config.headers = {
//       "content-type": "multipart/form-data",
//       'Accept': 'application/json',
//       // 'Authorization': `Basic ${accessTokenValue}`
//     };
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   }
// );

ApiService.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    return Promise.reject(error);
  },
);

export default ApiService;
