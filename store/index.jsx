import { configureStore } from "@reduxjs/toolkit";
// Import My Slices to use as Reducer
import BasketSlice from "./slices/BasketSlice";

export const store = configureStore({
  reducer: {
    basket: BasketSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export default store;
