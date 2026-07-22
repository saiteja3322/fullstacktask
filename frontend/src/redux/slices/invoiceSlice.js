import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { invoiceService } from '../../services/invoiceService';
import toast from 'react-hot-toast';

export const fetchInvoices = createAsyncThunk('invoices/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await invoiceService.getAll(params);
    return res;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch invoices');
  }
});

export const fetchInvoiceById = createAsyncThunk('invoices/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await invoiceService.getById(id);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch invoice');
  }
});

export const createInvoice = createAsyncThunk('invoices/create', async (data, { rejectWithValue }) => {
  try {
    const res = await invoiceService.create(data);
    toast.success('Tax Invoice generated successfully!');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to create invoice');
  }
});

export const updateInvoiceStatus = createAsyncThunk('invoices/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const res = await invoiceService.updateStatus(id, status);
    toast.success(`Invoice payment status set to ${status}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to update invoice status');
  }
});

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState: {
    items: [],
    list: [],
    currentInvoice: null,
    meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentInvoice: (state) => {
      state.currentInvoice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        const dataList = action.payload.data || [];
        state.items = dataList;
        state.list = dataList;
        if (action.payload.meta) {
          state.meta = action.payload.meta;
        }
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvoice = action.payload;
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.list.unshift(action.payload);
      })
      .addCase(updateInvoiceStatus.fulfilled, (state, action) => {
        const idx = state.items.findIndex((inv) => inv.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
          state.list[idx] = action.payload;
        }
        if (state.currentInvoice?.id === action.payload.id) {
          state.currentInvoice = action.payload;
        }
      });
  },
});

export const { clearCurrentInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;
