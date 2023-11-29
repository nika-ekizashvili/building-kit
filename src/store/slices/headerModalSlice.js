import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  isOpen: false,
};

const headerModalSlice = createSlice({
  name: "headerModal",
  initialState,
  reducers: {
    openHeaderModal: (state) => {
      state.isOpen = true;
    },
    closeHeaderModal: (state) => {
      state.isOpen = false;
    },
    extraReducers: (builder) => {
      builder.addCase(HYDRATE, (state, action) => {
        return {
          ...state,
          ...action.payload.headerModal,
        };
      });
    },
  },
});

export const { openHeaderModal, closeHeaderModal } = headerModalSlice.actions;
export default headerModalSlice.reducer;
