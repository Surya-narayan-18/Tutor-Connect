import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchTutors = createAsyncThunk(
  'tutors/fetchTutors',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await api.get('/tutors', { params });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch tutors');
    }
  }
);

export const fetchTutorById = createAsyncThunk(
  'tutors/fetchTutorById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/tutors/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch tutor');
    }
  }
);

export const fetchMyTutorProfile = createAsyncThunk(
  'tutors/fetchMyProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/tutors/profile/me');
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const createOrUpdateProfile = createAsyncThunk(
  'tutors/createOrUpdateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const res = await api.post('/tutors/profile', profileData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to save profile');
    }
  }
);

export const updateAvailability = createAsyncThunk(
  'tutors/updateAvailability',
  async (slots, { rejectWithValue }) => {
    try {
      const res = await api.put('/tutors/availability', { slots });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update availability');
    }
  }
);

const tutorsSlice = createSlice({
  name: 'tutors',
  initialState: {
    list: [],
    pagination: null,
    selectedTutor: null,
    selectedTutorAvailability: [],
    myProfile: null,
    myAvailability: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedTutor: (state) => {
      state.selectedTutor = null;
      state.selectedTutorAvailability = [];
    },
    clearTutorError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTutors
      .addCase(fetchTutors.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTutors.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.tutors;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTutors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchTutorById
      .addCase(fetchTutorById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTutorById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTutor = action.payload.tutor;
        state.selectedTutorAvailability = action.payload.availability;
      })
      .addCase(fetchTutorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchMyProfile
      .addCase(fetchMyTutorProfile.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyTutorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.myProfile = action.payload.profile;
        state.myAvailability = action.payload.availability;
      })
      .addCase(fetchMyTutorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // createOrUpdateProfile
      .addCase(createOrUpdateProfile.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createOrUpdateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.myProfile = action.payload.profile;
      })
      .addCase(createOrUpdateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateAvailability
      .addCase(updateAvailability.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.myAvailability = action.payload.slots;
      })
      .addCase(updateAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedTutor, clearTutorError } = tutorsSlice.actions;
export default tutorsSlice.reducer;
