import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./UserSlice";
export const Store = configureStore({
  reducer: {
    user: userReducer,
  },

  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
