import { configureStore } from "@reduxjs/toolkit";
import optionsReducer from "./optionsSlice";
import contentReducer from "./contentSlice";

export const store = configureStore({
  reducer: {
    options: optionsReducer,
    content: contentReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
