import React from "react";
import { store } from "../redux/store";
import Options from "./options";
import { Provider } from "react-redux";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createRoot } from "react-dom/client";

const init = () => {
  const appContainer = document.createElement("div");
  document.body.appendChild(appContainer);
  if (!appContainer) {
    throw new Error("Can not find AppContainer");
  }
  console.log("Init from options index");
  const root = createRoot(appContainer);
  console.log(appContainer);
  root.render(
    <Provider store={store}>
        <Options />
    </Provider>
  );
};
init();
