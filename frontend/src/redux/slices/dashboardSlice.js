import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardService } from '../../services/dashboardService';

export const fetchDashboardSummary = createAsyncThunk('dashboard/fetchSummary', async (_, { rejectWithValue }) => {
  try {
    const res = await dashboardService.getSummary();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    summary: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
