import React from "react";
import { createRoot } from "react-dom/client";
// import "../assets/tailwind.css";
import Content from "./content";

const init = () => {
  const appContainer = document.createElement("div");
  appContainer.setAttribute("id", "hack");
  if (!appContainer) {
    throw new Error("can't find appContainer");
  }
  
  document.body.appendChild(appContainer);
  const root = createRoot(appContainer);
  console.log(appContainer);
  root.render(<Content />);
};
init();
