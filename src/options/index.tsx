import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { createRoot } from "react-dom/client";
import { HashRouter as Router } from "react-router-dom";
import Options from "./options";

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
      <Router>
        <Options />
      </Router>
    </Provider>
  );
};
init();
