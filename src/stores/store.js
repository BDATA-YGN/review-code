import {configureStore} from '@reduxjs/toolkit';
import * as AllSlices from './slices';
export const store = configureStore({
  reducer: AllSlices,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        warnAfter: 128, // Further increase the threshold
      },
    }),
});
