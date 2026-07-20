import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchMyBookings = createAsyncThunk(
  'bookings/fetchMyBookings',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await api.get('/bookings/me', { params });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  'bookings/fetchBookingById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/bookings/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch booking');
    }
  }
);

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const res = await api.post('/bookings', bookingData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create booking');
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  'bookings/updateBookingStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/bookings/${id}/status`, { status });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update booking');
    }
  }
);

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: {
    list: [],
    pagination: null,
    selectedBooking: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearBookingError: (state) => { state.error = null; },
    clearBookingSuccess: (state) => { state.successMessage = null; },
    clearSelectedBooking: (state) => { state.selectedBooking = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBookings.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.bookings;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBookingById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBooking = action.payload.booking;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createBooking.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload.booking);
        state.successMessage = 'Booking created successfully!';
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBookingStatus.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.booking;
        const idx = state.list.findIndex((b) => b._id === updated._id);
        if (idx !== -1) state.list[idx] = updated;
        if (state.selectedBooking?._id === updated._id) {
          state.selectedBooking = updated;
        }
        state.successMessage = `Booking ${updated.status} successfully!`;
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBookingError, clearBookingSuccess, clearSelectedBooking } = bookingsSlice.actions;
export default bookingsSlice.reducer;
