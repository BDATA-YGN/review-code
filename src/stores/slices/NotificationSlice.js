import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    fetchFriendRequest : false,
  };
  
  export const NotificationSlice = createSlice({
    name: 'NotificationSlice',
    initialState,
    reducers: {
      setFetchFriendRequest: (state, action) => {
        state.fetchFriendRequest = action.payload;
      },
    },
  });
  
  export const {setFetchFriendRequest} = NotificationSlice.actions;
  
  export default NotificationSlice.reducer;
  