import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    fetchDeleteEvent : false,
  };

  export const DeleteEventSlice = createSlice({
    name: 'DeleteEventSlice',
    initialState,
    reducers: {
      setFetchDeleteEvent : (state, action) => {
        state.fetchDeleteEvent = action.payload;
      },
    },
  });

  export const {setFetchDeleteEvent} = DeleteEventSlice.actions;
  
  export default DeleteEventSlice.reducer;