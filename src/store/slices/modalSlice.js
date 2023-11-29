import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  isOpen: false,
};

const modalSlice = createSlice({
  name: "authModal",
  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen = true;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
    extraReducers: (builder) => {
      builder.addCase(HYDRATE, (state, action) => {
        return {
          ...state,
          ...action.payload.authModal,
        };
      });
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
