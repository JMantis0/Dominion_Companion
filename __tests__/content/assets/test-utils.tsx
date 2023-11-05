import React, { PropsWithChildren } from "react";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import type { PreloadedState } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import fs from "fs";
import path from "path";
import type { store, RootState } from "../../../src/redux/store";
// As a basic setup, import your same slice reducers
import contentSlice from "../../../src/redux/contentSlice";
import optionsSlice from "../../../src/redux/optionsSlice";
import { initialState as initialContentState } from "../../../src/redux/contentSlice";
import { initialState as initialOptionsState } from "../../../src/redux/optionsSlice";

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: PreloadedState<RootState>;
  store?: typeof store;
}

export const renderWithProviders = (
  ui: React.ReactElement,
  {
    preloadedState = {
      content: initialContentState,
      options: initialOptionsState,
    },
    // Automatically create a store instance if no store was passed in
    store = configureStore({
      reducer: { content: contentSlice, options: optionsSlice },
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) => {
  const Wrapper = ({ children }: PropsWithChildren<{}>): JSX.Element => {
    return <Provider store={store}>{children}</Provider>;
  };

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

export const renderWithProvidersAndCSS = (
  ui: React.ReactElement,
  {
    preloadedState = {
      content: initialContentState,
      options: initialOptionsState,
    },
    // Automatically create a store instance if no store was passed in
    store = configureStore({
      reducer: { content: contentSlice, options: optionsSlice },
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) => {
  const Wrapper = ({ children }: PropsWithChildren<{}>): JSX.Element => {
    return <Provider store={store}>{children}</Provider>;
  };

  // Add CSS to the document head
  const style = document.createElement("style");
  style.innerHTML = fs.readFileSync(
    path.resolve(__dirname, "./output.css"),
    "utf8"
  );
  document.head.appendChild(style);

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

export const renderWithCSS = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => {
  const wrapper = ({ children }: PropsWithChildren<{}>): JSX.Element => {
    return <React.Fragment>{children}</React.Fragment>;
  };

  const style = document.createElement("style");
  style.innerHTML = fs.readFileSync(
    path.resolve(__dirname, "./output.css"),
    "utf8"
  );
  document.head.appendChild(style);

  return { ...render(ui, { wrapper, ...options }) };
};
