import { configureStore } from "@reduxjs/toolkit";
import contentReducer from "./contentSlice";
import optionsReducer from "./optionsSlice";

export const store = configureStore({
  reducer: {
    content: contentReducer,
    options: optionsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
