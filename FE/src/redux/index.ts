import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from "@reduxjs/toolkit/query";

import authReducer from "./features/authSlice"
import { apiSlice } from './services/apiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },

  middleware : (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),

  devTools: true,
})


setupListeners(store.dispatch);

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;