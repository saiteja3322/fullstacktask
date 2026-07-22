import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { inventoryService } from '../../services/inventoryService';
import toast from 'react-hot-toast';

export const stockIn = createAsyncThunk('inventory/stockIn', async (data, { rejectWithValue }) => {
  try {
    const res = await inventoryService.stockIn(data);
    toast.success('Stock inward recorded!');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Stock In failed');
  }
});

export const stockOut = createAsyncThunk('inventory/stockOut', async (data, { rejectWithValue }) => {
  try {
    const res = await inventoryService.stockOut(data);
    toast.success('Stock outward recorded!');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Stock Out failed');
  }
});

export const adjustStock = createAsyncThunk('inventory/adjustStock', async (data, { rejectWithValue }) => {
  try {
    const res = await inventoryService.adjustStock(data);
    toast.success('Stock level adjusted!');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Stock adjustment failed');
  }
});

export const transferStock = createAsyncThunk('inventory/transferStock', async (data, { rejectWithValue }) => {
  try {
    const res = await inventoryService.transferStock(data);
    toast.success('Inter-warehouse stock transfer recorded!');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Stock transfer failed');
  }
});

export const fetchStockMovements = createAsyncThunk('inventory/fetchMovements', async (params, { rejectWithValue }) => {
  try {
    const res = await inventoryService.getMovements(params);
    return res;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch movements');
  }
});

export const fetchLowStock = createAsyncThunk('inventory/fetchLowStock', async (_, { rejectWithValue }) => {
  try {
    const res = await inventoryService.getLowStockAlerts();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch low stock alerts');
  }
});

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    movements: [],
    meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
    lowStockAlerts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockMovements.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStockMovements.fulfilled, (state, action) => {
        state.loading = false;
        state.movements = action.payload.data || [];
        if (action.payload.meta) {
          state.meta = action.payload.meta;
        }
      })
      .addCase(fetchStockMovements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLowStock.fulfilled, (state, action) => {
        state.lowStockAlerts = action.payload || [];
      });
  },
});

export default inventorySlice.reducer;
