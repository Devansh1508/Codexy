import { configureStore } from "@reduxjs/toolkit";
import promptReducer from "./slices/prompt";

export const store = configureStore({
  reducer: {
    prompt: promptReducer,
  },
});

// 👇 Export these inferred types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
