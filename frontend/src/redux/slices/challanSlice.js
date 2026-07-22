import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { challanService } from '../../services/challanService';
import toast from 'react-hot-toast';

export const fetchChallans = createAsyncThunk('challans/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await challanService.getAll(params);
    return res;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch challans');
  }
});

export const fetchChallanById = createAsyncThunk('challans/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await challanService.getById(id);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch challan details');
  }
});

export const createChallan = createAsyncThunk('challans/create', async (data, { rejectWithValue }) => {
  try {
    const res = await challanService.create(data);
    toast.success('Sales Challan created successfully!');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to create challan');
  }
});

export const confirmChallan = createAsyncThunk('challans/confirm', async (id, { rejectWithValue }) => {
  try {
    const res = await challanService.confirm(id);
    toast.success('Sales Challan confirmed & inventory stock updated!');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to confirm challan');
  }
});

export const cancelChallan = createAsyncThunk('challans/cancel', async (id, { rejectWithValue }) => {
  try {
    const res = await challanService.cancel(id);
    toast.success('Sales Challan cancelled');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to cancel challan');
  }
});

export const deleteChallan = createAsyncThunk('challans/delete', async (id, { rejectWithValue }) => {
  try {
    await challanService.delete(id);
    toast.success('Challan deleted');
    return id;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to delete challan');
  }
});

const challanSlice = createSlice({
  name: 'challans',
  initialState: {
    items: [],
    currentChallan: null,
    meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentChallan: (state) => {
      state.currentChallan = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChallans.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChallans.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        if (action.payload.meta) {
          state.meta = action.payload.meta;
        }
      })
      .addCase(fetchChallans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchChallanById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChallanById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChallan = action.payload;
      })
      .addCase(fetchChallanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createChallan.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(confirmChallan.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentChallan?.id === action.payload.id) {
          state.currentChallan = action.payload;
        }
      })
      .addCase(cancelChallan.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentChallan?.id === action.payload.id) {
          state.currentChallan = action.payload;
        }
      })
      .addCase(deleteChallan.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { clearCurrentChallan } = challanSlice.actions;
export default challanSlice.reducer;
