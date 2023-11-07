import { configureStore } from "@reduxjs/toolkit";
import contentReducer from "./contentSlice";
import optionsReducer from "./optionsSlice";
console.log(process.env.NODE_ENVIRONMENT);

export const store = configureStore({
  reducer: {
    content: contentReducer,
    options: optionsReducer,
  },
  middleware: (getMiddleWare) =>
    // If environment is dev, remove middleware.
    process.env.NODE_ENVIRONMENT === "dev" ? [] : getMiddleWare(),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
