import { configureStore } from '@reduxjs/toolkit';
import tutorsReducer from './slices/tutorsSlice';
import bookingsReducer from './slices/bookingsSlice';
import recommendationsReducer from './slices/recommendationsSlice';

export const store = configureStore({
  reducer: {
    tutors: tutorsReducer,
    bookings: bookingsReducer,
    recommendations: recommendationsReducer,
  },
});

export default store;
