import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  loggedIn: false,
  access_token: "",
  role: "",
  email: "",
  user_id: "",
  provider: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState(state, action) {
      state.loggedIn = action.payload;
    },
    setAuthAccessToken(state, action) {
      state.access_token = action.payload;
    },
    setAuthRole(state, action) {
      state.role = action.payload;
    },
    setAuthEmail(state, action) {
      state.email = action.payload;
    },
    setAuthUserId(state, action) {
      state.user_id = action.payload;
    },
    setProvider(state, action) {
      state.provider = action.payload;
    },
    extraReducers: (builder) => {
      builder.addCase(HYDRATE, (state, action) => {
        return {
          ...state,
          ...action.payload.auth,
        };
      });
    },
  },
});

export const {
  setAuthState,
  setAuthAccessToken,
  setAuthEmail,
  setAuthRole,
  setAuthUserId,
  setProvider
} = authSlice.actions;
export const selectAuthState = (state) => state.auth.loggedIn;
export const selectAuthUserId = (state) => state.auth.user_id;
export const selectAuthAccessToken = (state) => state.auth.access_token;
export const selectAuthEmail = (state) => state.auth.email;
export const selectAuthRole = (state) => state.auth.role;
export default authSlice.reducer;
