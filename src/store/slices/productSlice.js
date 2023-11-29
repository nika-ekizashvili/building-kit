import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
    product: {},
    products: []
};

export const productSlice = createSlice({
    name: "prod",
    initialState,
    reducers: {
        setProductState(state, action) {
            state.product = action.payload;
        },
        setProducts(state, action) {
            state.products = action.payload;
        },
        deleteProductState(state, action) {
            state.products = state.products.filter(
                (product) => product.id !== action.payload
            );
        },
    },
    extraReducers: (builder) => {
        builder.addCase(HYDRATE, (state, action) => {
          return {
            ...state,
            ...action.payload.prod,
          };
        });
      },
});

export const { setProductState, deleteProductState, setProducts } = productSlice.actions;
export default productSlice.reducer;
