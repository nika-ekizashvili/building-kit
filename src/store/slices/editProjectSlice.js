import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  updateProject: null,
};

const editProjectSlice = createSlice({
  name: "updateProject",
  initialState,
  reducers: {
    setUpdateProject(state, action) {
      state.updateProject = action.payload;
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

export const { setUpdateProject } = editProjectSlice.actions;
export default editProjectSlice.reducer;
