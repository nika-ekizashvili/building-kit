import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
  project: [],
  galleryImages: [],
  drawingsImages: [],
  searchType: ''
};

export const projectSlice = createSlice({
  name: "proj",
  initialState,
  reducers: {
    setProjectState(state, action) {
      state.project = [...state.project, action.payload];
    },
    setProjectGalleryImages(state, action) {
      state.galleryImages = [...state.galleryImages, ...action.payload];
    },
    setProjectDrawingsImages(state, action) {
      state.drawingsImages = [...state.drawingsImages, ...action.payload];
    },
    setSearchValue(state, action) {
      state.searchType = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      return {
        ...state,
        ...action.payload.proj,
      };
    });
  },
});

export const { setProjectState, setProjectGalleryImages, setProjectDrawingsImages, setSearchValue } = projectSlice.actions;
export default projectSlice.reducer;