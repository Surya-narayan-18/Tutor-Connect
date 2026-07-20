import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchRecommendations = createAsyncThunk(
  'recommendations/fetch',
  async (queryData, { rejectWithValue }) => {
    try {
      const res = await api.post('/recommendations', queryData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to get recommendations');
    }
  }
);

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState: {
    results: [],
    query: null,
    aiPowered: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearRecommendations: (state) => {
      state.results = [];
      state.query = null;
      state.aiPowered = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.recommendations || [];
        state.query = action.payload.query;
        state.aiPowered = action.payload.aiPowered;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRecommendations } = recommendationsSlice.actions;
export default recommendationsSlice.reducer;
