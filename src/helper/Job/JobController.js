import ApiService from "../ApiService";
import { SERVER_KEY } from "../../config";

export const requestJobLists = (accessTokenValue, offset, limit) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', "search");
  formData.append('limit', limit); // Set the limit for pagination
  formData.append('offset', offset); // Pass the offset for pagination
  console.log(formData)
  // Make the API call using the provided access token
  return ApiService.post(`api/job?access_token=${accessTokenValue}`, formData);
};


export const requestSearchJobLists = (accessTokenValue, value,offset, limit) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', "search");
  formData.append('limit', limit); // Set the limit for pagination
  formData.append('offset', offset); // Pass the offset for pagination
  formData.append('keyword',value)
  console.log(formData)
  // Make the API call using the provided access token
  return ApiService.post(`api/job?access_token=${accessTokenValue}`, formData);
};


export const requestFilterJobLists = (accessTokenValue, type, category) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', "search");

  // Append job_type if type is provided
  if (type) {
    formData.append('job_type', type);
  }

  // Append c_id if category is provided
  if (category) {
    formData.append('c_id', category);
  }

  console.log(formData); // For debugging purposes

  // Make the API call using the provided access token
  return ApiService.post(`api/job?access_token=${accessTokenValue}`, formData);
};


export const requestMyJobLists = (accessTokenValue,id, offset, limit) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', "get");
  formData.append('page_id',id)
  formData.append('limit', limit); // Set the limit for pagination
  formData.append('offset', offset); // Pass the offset for pagination
  console.log(formData)
  // Make the API call using the provided access token
  return ApiService.post(`api/job?access_token=${accessTokenValue}`, formData);
};



export const requestApplyJobs = (
  accessTokenValue,
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
  position,
  workPlace
) => {
  const formData = new FormData();
  formData.append('server_key', SERVER_KEY);
  formData.append('type', "apply");
  formData.append('job_id', id);
  formData.append('user_name', username);
  formData.append('phone_number', phoneNo);
  formData.append('location', location);
  formData.append('email', email);
  formData.append('question_one_answer', yesNoOption || selectedOptionsId || freeTextAnswer);
  formData.append('question_two_answer', yesNoOptionTwo || selectedOptionsIdTwo || freeTextTwo);
  formData.append('question_three_answer', yesNoOptionThree || selectedOptionsIdThree || freeTextThree);
  formData.append('position', position);
  formData.append('where_did_you_work', workPlace);
  formData.append('experience_description', description);
  formData.append('i_currently_work', currentStatus);
  
  // Check and append startYear and endYear
  if (startYear) {
    formData.append('experience_start_date', startYear);
  } else {
    formData.append('experience_start_date', '');
  }

  if (endYear) {
    formData.append('experience_end_date', endYear);
  } else {
    formData.append('experience_end_date', '');
  }

  console.log(formData); // Debugging log
  return ApiService.post(`api/job?access_token=${accessTokenValue}`, formData);
};


  export const requestCreateJob = (
    accessTokenValue, 
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
    const formData = new FormData();
    const questionKeys = ['question_one', 'question_two', 'question_three'];
    formData.append('server_key', SERVER_KEY);
    formData.append('type', "create");
    formData.append('page_id', id);
    formData.append('job_title', title);
    formData.append('location', location);
    formData.append('minimum', salaryMinimum);
    formData.append('maximum', salaryMaximum);
    formData.append('currency', currency);
    formData.append('salary_date', period);
    formData.append('job_type', jobtype);
    formData.append('category', category);
    formData.append('description', description);
    questions.forEach((question, index) => {
      if (index < 3) {  // Limit to 3 questions as per the API constraint
        const questionKey = questionKeys[index];  // Get the corresponding question key
        
        // Append question details with the fixed key names
        formData.append(`${questionKey}`, question.textInputValue || '');
        formData.append(`${questionKey}_type`, question.type || '');
        
        if (question.type === 'multiple_choice_question') {
          formData.append(`${questionKey}_answers`, (question.multipleChoices || []).join(', ') || '');
        }
      }})
    formData.append('image_type', "upload");

    if (coverimg) {
      formData.append('thumbnail', {
        uri: coverimg,
        type: 'image/jpeg',
        name: `coverimg.jpg`,
      });
    }
    console.log(formData)
    return ApiService.post(`api/job?access_token=${accessTokenValue}`, formData);
  };
  export const requestEditJob = (
    accessTokenValue, 
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
    const formData = new FormData();
    formData.append('server_key', SERVER_KEY);
    formData.append('type', "edit");
    formData.append('job_id', id);
    formData.append('job_title', title);
    formData.append('location', location);
    formData.append('minimum', salaryMinimum);
    formData.append('maximum', salaryMaximum);
    formData.append('salary_date', period);
    formData.append('job_type', jobtype);
    formData.append('category', category);
    formData.append('description', description);

    console.log(formData)
    return ApiService.post(`api/job?access_token=${accessTokenValue}`, formData);
  };

  export const requestAppliedJobs = (accessTokenValue, id) => {
    const formData = new FormData();
    formData.append('server_key', SERVER_KEY);
    formData.append('type', "get_apply");
    formData.append('job_id', id); // Set the limit for pagination
    // formData.append('offset', offset); // Pass the offset for pagination
    console.log(formData)
    // Make the API call using the provided access token
    return ApiService.post(`api/job?access_token=${accessTokenValue}`, formData);
  };
  

  export const requestDeleteJobs = (accessTokenValue, id) => {
    const formData = new FormData();
    formData.append('server_key', SERVER_KEY);
    formData.append('action', "delete");
    formData.append('post_id', id); // Set the limit for pagination
    // formData.append('offset', offset); // Pass the offset for pagination
    console.log(formData)
    // Make the API call using the provided access token
    return ApiService.post(`api/post-actions?access_token=${accessTokenValue}`, formData);
  };
  