import { createSlice } from '@reduxjs/toolkit';

const addressSlice = createSlice({
  name: 'addresses',
  initialState: {
    addresses: [],
  },
  reducers: {
    setAddresses: (state, action) => {
      state.addresses = action.payload;
    },
    clearAddresses: (state) => {
      state.addresses = [];
    },
  },
});

export const { setAddresses, clearAddresses } = addressSlice.actions;
export default addressSlice.reducer;
