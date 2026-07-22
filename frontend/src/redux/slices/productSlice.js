import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../../services/productService';
import toast from 'react-hot-toast';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await productService.getAll(params);
    return res;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch products');
  }
});

export const fetchProductById = createAsyncThunk('products/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await productService.getById(id);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch product');
  }
});

export const createProduct = createAsyncThunk('products/create', async (formData, { rejectWithValue }) => {
  try {
    const res = await productService.create(formData);
    toast.success('Product added to catalog!');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to add product');
  }
});

export const updateProduct = createAsyncThunk('products/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = await productService.update(id, formData);
    toast.success('Product updated!');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to update product');
  }
});

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try {
    await productService.delete(id);
    toast.success('Product deleted');
    return id;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to delete product');
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    list: [],
    meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
    selectedProduct: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        const dataList = action.payload.data || [];
        state.items = dataList;
        state.list = dataList;
        if (action.payload.meta) {
          state.meta = action.payload.meta;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.list.unshift(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
          state.list[idx] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
        state.list = state.list.filter((p) => p.id !== action.payload);
      });
  },
});

export default productSlice.reducer;
