import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "../redux/store";
// import "../assets/tailwind.css";
// import Content from "./content";

const init = () => {
  const appContainer = document.createElement("div");
  appContainer.setAttribute("id", "hack");
  if (!appContainer) {
    throw new Error("can't find appContainer");
  }

  document.body.appendChild(appContainer);
  const root = createRoot(appContainer);
  console.log(appContainer);
  root.render(
    <Provider store={store}>
      {/* <Content /> */}
    </Provider>
  );
};
init();
