// plansSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  plans: [],
  subscriptions : []
};

const plansSlice = createSlice({
  name: 'plans',
  initialState,
  
  reducers: {
    setMonetizationList: (state, action) => {
      state.plans = action.payload;
    },
    setSubscriptionList: (state, action) => {
      state.subscriptions = action.payload;
    },
    updatePlan: (state, action) => {
      const { id, updatedData } = action.payload;
      // Find the index of the plan to update
      const index = state.plans.findIndex(plan => plan.id === id);
      if (index !== -1) {
        // Update the plan data
        state.plans[index] = { ...state.plans[index], ...updatedData };
      }
    },
  },
});

export const { setMonetizationList,setSubscriptionList, updatePlan } = plansSlice.actions;
export default plansSlice.reducer;
