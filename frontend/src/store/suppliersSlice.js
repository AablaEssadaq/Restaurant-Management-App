// src/store/suppliersSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  suppliers: JSON.parse(sessionStorage.getItem('suppliers')) || null,
};

const suppliersSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    setSuppliers: (state, action) => {
      state.suppliers = action.payload.suppliers;
      sessionStorage.setItem('suppliers', JSON.stringify(action.payload.suppliers));
    },
  },
});

export const { setSuppliers } = suppliersSlice.actions;
export default suppliersSlice.reducer;
