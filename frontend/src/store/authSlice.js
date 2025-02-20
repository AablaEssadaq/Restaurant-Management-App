// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: JSON.parse(sessionStorage.getItem('isAuthenticated')) || false,
  user: JSON.parse(sessionStorage.getItem('user')) || null,
  restaurant: JSON.parse(sessionStorage.getItem('restaurant')) || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.restaurant = action.payload.restaurant;
      sessionStorage.setItem('isAuthenticated', state.isAuthenticated);
      sessionStorage.setItem('user', JSON.stringify(action.payload.user));
      sessionStorage.setItem('restaurant', JSON.stringify(action.payload.restaurant));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.restaurant = null;
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('restaurant');
      sessionStorage.removeItem('isAuthenticated');
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
