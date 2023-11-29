import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  category: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategory(state, action) {
      state.category = action.payload;
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

export const { setCategory } = categorySlice.actions;
export default categorySlice.reducer;
