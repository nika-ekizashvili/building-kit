import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { authSlice } from "./slices/authSlice";
import { projectSlice } from "./slices/projectSlice";
import { productSlice } from "./slices/productSlice";
import modalReducer from "./slices/modalSlice";
import headerPopUpReducer from "./slices/headerModalSlice";
import editProjectsReducer from "./slices/editProjectSlice";
import { persistReducer, persistStore } from 'redux-persist';
import categoryReducer from './slices/categorySlice';
import statusReducer from "./slices/statusSlice";

import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
  [authSlice.name]: authSlice.reducer,
  modal: modalReducer,
  headerPopUp: headerPopUpReducer,
  update: editProjectsReducer,
  userStatus: statusReducer,
  cats: categoryReducer,
  [projectSlice.name]: projectSlice.reducer,
  [productSlice.name]: productSlice.reducer
});

const persistConfig = {
  key: 'root',
  storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
    devTools: true,
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
export default store;

export const persistor = persistStore(store);