// store/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: null,
    isAuthenticated: false,
  },
  reducers: {
    setUser(state, action) {
      state.userInfo = action.payload;
      state.isAuthenticated = true;
    },
    clearUser(state) {
      state.userInfo = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
