import React from "react";
import { createRoot, Root } from "react-dom/client";
import DomRoot from "./DomRoot";
import { Provider } from "react-redux";
import { store } from "../redux/store";
let resetInterval: NodeJS.Timeout;

/**
 * Content global variable -
 * Use - This container is appended to the Dominion client, and is where the React.JS root rendered.
 */
let domViewContainer: HTMLElement;

/**
 * Content global variable -
 * Use - The ReactJS root to render the root React Component into the Client Dom
 */
let domViewRoot: Root;

/**
 * Attaches the DomRoot React component to the client DOM.
 */
const attachDomRoot = (): void => {
  domViewContainer = document.createElement("div");
  domViewContainer.setAttribute("style", "z-index: 15000; position:fixed;");
  domViewContainer.setAttribute("id", "domViewContainer");
  domViewRoot = createRoot(domViewContainer);
  domViewRoot.render(
    <Provider store={store}>
      <DomRoot />
    </Provider>
  );
  document.body.appendChild(domViewContainer);
};

/**
 * Removes the DomRoot React component from the client DOM
 */
const removeDomRoot = (): void => {
  domViewContainer.remove();
  domViewRoot.unmount();
};

const initIntervalFunction = () => {
  const sessionId = window.localStorage.getItem("sessionId");
  const resetCheckIntervalFunction = () => {
    if (sessionId === null || sessionId === "") {
      clearInterval(resetInterval);
      removeDomRoot();
      initInterval = setInterval(initIntervalFunction, 1000);
    }
  };
  if (sessionId !== null && sessionId !== "") {
    clearInterval(initInterval);
    attachDomRoot();
    resetInterval = setInterval(resetCheckIntervalFunction, 1000);
  }
};

let initInterval = setInterval(initIntervalFunction, 1000);
