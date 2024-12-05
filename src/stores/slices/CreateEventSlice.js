import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  fullStartDate: '',
  eventName: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  eventPhoto: null,
  eventLocation: '',
  eventDescription: '',
};

const CreateEventSlice = createSlice({
  name: 'CreateEventSlice',
  initialState,
  reducers: {
    setFullStartDate: (state, action) => {
      state.fullStartDate = action.payload;
    },
    setEventName: (state, action) => {
      state.eventName = action.payload;
    },
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setStartTime: (state, action) => {
      state.startTime = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    setEndTime: (state, action) => {
      state.endTime = action.payload;
    },
    setEventPhoto: (state, action) => {
      state.eventPhoto = action.payload;
    },
    setEventLocation: (state, action) => {
      state.eventLocation = action.payload;
    },
    setEventDescription: (state, action) => {
      state.eventDescription = action.payload;
    },
  },
});

export const {
  setFullStartDate,
  setEventName,
  setStartDate,
  setStartTime,
  setEndDate,
  setEndTime,
  setEventPhoto,
  setEventLocation,
  setEventDescription,
} = CreateEventSlice.actions;

export default CreateEventSlice.reducer;
