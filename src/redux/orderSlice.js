import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    backendOrders: [],
  },
  reducers: {
    setOrders: (state, action) => {
      state.backendOrders = action.payload;
    },
    clearOrders: (state) => {
      state.backendOrders = [];
    },
  },
});

export const { setOrders, clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
