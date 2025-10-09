import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: 'userDetails',
  token: localStorage.getItem('authToken') || null,
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
};

const userSlice = createSlice({
  name: 'userDetails',
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
    clearUserDetsils: (state) => {
      state.userDetails = [];
    },
  },
});

export const { setUserDetails, clearUserDetails } = userSlice.actions;
export default userSlice.reducer;
