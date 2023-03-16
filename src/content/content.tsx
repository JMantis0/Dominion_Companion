import React from "react";
import { createRoot, Root } from "react-dom/client";
import DomRoot from "./DomRoot";

let resetInterval: NodeJS.Timer;

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
    <DomRoot

    />
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
  const resetCheckIntervalFunction2 = () => {
    if (sessionId === null || sessionId === "") {
      removeDomRoot();
      initInterval = setInterval(initIntervalFunction, 1000);
      clearInterval(resetInterval);
    }
  };
  if (sessionId !== null && sessionId !== "") {
    attachDomRoot();
    clearInterval(initInterval);
    resetInterval = setInterval(resetCheckIntervalFunction2, 1000);
  }
};

let initInterval = setInterval(initIntervalFunction, 1000);
