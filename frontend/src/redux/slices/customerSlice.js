import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customerService } from '../../services/customerService';
import toast from 'react-hot-toast';

export const fetchCustomers = createAsyncThunk('customers/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await customerService.getAll(params);
    return res;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch customers');
  }
});

export const fetchCustomerById = createAsyncThunk('customers/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await customerService.getById(id);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch customer');
  }
});

export const createCustomer = createAsyncThunk('customers/create', async (data, { rejectWithValue }) => {
  try {
    const res = await customerService.create(data);
    toast.success('Customer created successfully!');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to create customer');
  }
});

export const updateCustomer = createAsyncThunk('customers/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await customerService.update(id, data);
    toast.success('Customer updated successfully!');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to update customer');
  }
});

export const updateCustomerFollowUp = createAsyncThunk('customers/updateFollowUp', async ({ id, followUpData }, { rejectWithValue }) => {
  try {
    const res = await customerService.updateFollowUp(id, followUpData);
    toast.success('Follow-up scheduled!');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to update follow-up');
  }
});

export const deleteCustomer = createAsyncThunk('customers/delete', async (id, { rejectWithValue }) => {
  try {
    await customerService.delete(id);
    toast.success('Customer deleted');
    return id;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to delete customer');
  }
});

const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    items: [],
    list: [],
    meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
    selectedCustomer: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        const dataList = action.payload.data || [];
        state.items = dataList;
        state.list = dataList;
        if (action.payload.meta) {
          state.meta = action.payload.meta;
        }
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.list.unshift(action.payload);
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const idx = state.items.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
          state.list[idx] = action.payload;
        }
      })
      .addCase(updateCustomerFollowUp.fulfilled, (state, action) => {
        const idx = state.items.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
          state.list[idx] = action.payload;
        }
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
        state.list = state.list.filter((c) => c.id !== action.payload);
      });
  },
});

export const { setSelectedCustomer } = customerSlice.actions;
export default customerSlice.reducer;
