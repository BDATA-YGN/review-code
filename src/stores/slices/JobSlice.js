
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  myjobs: [],
};

const myjobsSlice = createSlice({
  name: 'myjobs',
  initialState,
  
  reducers: {
    setMyJobList: (state, action) => {
        // This will add new jobs to the current job list
        state.myjobs = [...state.myjobs, ...action.payload];
      },
      updateJob: (state, action) => {
        console.log('Updating job with payload:', action.payload);
        const jobIndex = state.myjobs.findIndex(job => job.id === action.payload.id);
        if (jobIndex >= 0) {
          state.myjobs[jobIndex] = {
            ...state.myjobs[jobIndex],
            ...action.payload.updatedData,
          };
        }
      },
      
      
      
      deleteJob: (state, action) => {
        // Remove the job from the list
        state.myjobs = state.myjobs.filter(job => job.id !== action.payload);
      },
      resetJobs: (state) => {
        // Reset job list (e.g., on error or logout)
        state.myjobs = [];
      },
      editJob: (state, action) => {
        // Find and update the job in the list
        const jobIndex = state.myjobs.findIndex(job => job.id === action.payload.id);
        if (jobIndex !== -1) {
          state.myjobs[jobIndex] = { ...state.myjobs[jobIndex], ...action.payload.updatedData };
        }}
  },
});

export const { setMyJobList,updateJob,deleteJob,resetJobs,editJob } = myjobsSlice.actions;
export default myjobsSlice.reducer;