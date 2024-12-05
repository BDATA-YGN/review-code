import { requestAppliedJobs, requestApplyJobs, requestCreateJob, requestDeleteJobs, requestEditJob, requestFilteredJobLists, requestFilterJobLists, requestJobLists, requestMyJobLists, requestSearchJobLists } from "./JobController";
import { retrieveJsonData ,storeKeys} from "../AsyncStorage";

export const getJobLists = async (offset,limit) => {
    try {
      const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
      const response = await requestJobLists(loginData.access_token,offset,limit);
      if (response.data.api_status == 200) {
      } else {
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  export const getMyJobLists = async (id,offset,limit) => {
    try {
      const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
      const response = await requestMyJobLists(loginData.access_token,id,offset,limit);
      if (response.data.api_status == 200) {
      } else {
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  export const getSearchJobLists = async (value,offset,limit) => {
    try {
      const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
      const response = await requestSearchJobLists(loginData.access_token,value,offset,limit);
      if (response.data.api_status == 200) {
      } else {
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const getFilterdJobLists = async (type, id) => {
    try {
      const loginData = await retrieveJsonData({ key: storeKeys.loginCredential });
      const response = await requestFilterJobLists(loginData.access_token, type, id);
  
      // Check if the response status is 200, then return the data
      if (response.data.api_status === 200) {
        return response.data;
      } else {
        return { api_status: 400, data: [] }; // Handle no jobs found case
      }
    } catch (error) {
      throw error;
    }
  };
  

  export const getApplied = async (
    id, username, phoneNo, location, email, yesNoOption, 
    yesNoOptionTwo, yesNoOptionThree, selectedOptionsId, 
    selectedOptionsIdTwo, selectedOptionsIdThree, freeTextAnswer, 
    freeTextTwo, freeTextThree, description, startYear, endYear, 
    currentStatus, position,workPlace
  ) => {
    try {
      const loginData = await retrieveJsonData({ key: storeKeys.loginCredential });
      const response = await requestApplyJobs(
        loginData.access_token,
        id,
        username,
        phoneNo,
        location,
        email,
        yesNoOption,
        yesNoOptionTwo,
        yesNoOptionThree,
        selectedOptionsId,
        selectedOptionsIdTwo,
        selectedOptionsIdThree,
        freeTextAnswer,
        freeTextTwo,
        freeTextThree,
        description,
        startYear,
        endYear,
        currentStatus,
        position
        ,workPlace
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  export const getCreateJob = async ( 
    id,
    title,
    location,
    salaryMinimum,
    salaryMaximum,
    currency,
    period,
    jobtype,
    category,
    description,
    questions,
    coverimg) => {
    try {
      const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
      const response = await requestCreateJob(loginData.access_token, id,
        title,
        location,
        salaryMinimum,
        salaryMaximum,
        currency,
        period,
        jobtype,
        category,
        description,
        questions,
        coverimg);
      if (response.data.api_status == 200) {
      } else {
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  export const getEditJob = async ( 
    id,
    title,
    location,
    salaryMinimum,
    salaryMaximum,
    period,
    jobtype,
    category,
    description,
   ) => {
    try {
      const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
      const response = await requestEditJob(loginData.access_token, id,
        title,
        location,
        salaryMinimum,
        salaryMaximum,
        period,
        jobtype,
        category,
        description,
      );
      if (response.data.api_status == 200) {
      } else {
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  export const requestAppliedJobLists = async (offset,limit) => {
    try {
      const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
      const response = await requestAppliedJobs(loginData.access_token,offset,limit);
      if (response.data.api_status == 200) {
      } else {
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const requestDeleteJobLists = async (id) => {
    try {
      const loginData = await retrieveJsonData({key: storeKeys.loginCredential});
      const response = await requestDeleteJobs(loginData.access_token,id);
      if (response.data.api_status == 200) {
      } else {
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };