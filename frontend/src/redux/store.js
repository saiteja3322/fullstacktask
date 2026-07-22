import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './slices/authSlice';
import customerReducer from './slices/customerSlice';
import productReducer from './slices/productSlice';
import inventoryReducer from './slices/inventorySlice';
import invoiceReducer from './slices/invoiceSlice';
import challanReducer from './slices/challanSlice';
import dashboardReducer from './slices/dashboardSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  customers: customerReducer,
  products: productReducer,
  inventory: inventoryReducer,
  challans: challanReducer,
  invoices: invoiceReducer,
  dashboard: dashboardReducer,
});

const persistConfig = {
  key: 'mini_erp_root',
  storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
