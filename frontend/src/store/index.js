import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import suppliersReducer from './suppliersSlice.js';

export const store = configureStore({
  reducer: { // Use `reducer`, not `reducers`, and provide an object, not an array
    auth: authReducer,
    suppliers: suppliersReducer,
  },
});
