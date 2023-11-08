/**
 * @jest-environment jsdom
 */
import { describe, it, expect, beforeEach } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";
import contentSlice, {
  setBaseOnly as setBaseOnlyRedux,
} from "../../../src/redux/contentSlice";
import { DOMStore } from "../../../src/utils";
import { configureStore } from "@reduxjs/toolkit";
import optionsSlice from "../../../src/redux/optionsSlice";
describe("kingdomInitializer should check if the kingdom-viewer-group element is present in the DOM and...", () => {
  // Declare element references
  let kingdomViewerElement: HTMLElement;
  let nameElement1: HTMLElement;
  let nameElement2: HTMLElement;
  let nameElement3: HTMLElement;
  let nameElement4: HTMLElement;
  let nameElement5: HTMLElement;
  // Declare a redux store
  let storeMock: DOMStore;

  beforeEach(() => {
    DOMObserver.resetGame();
    // Create a new store instance for DOMObserver
    storeMock = configureStore({
      reducer: { content: contentSlice, options: optionsSlice },
      middleware: [],
    });
    // Set DOMObserver to use the mock store and mock dispatch
    DOMObserver.setStore(storeMock);
    DOMObserver.setDispatch(storeMock.dispatch);
    document.body.innerHTML = "";
  });

  it("if  present it should set the kingdom and baseOnly fields, and dispatch the redux action for baseOnly (Case: base kingdom)", () => {
    // Arrange a scenario where the kingdom element is present in the DOM and the kingdom contains only base cards.
    nameElement1 = document.createElement("div");
    nameElement1.classList.add("name-layer");
    nameElement2 = document.createElement("div");
    nameElement2.classList.add("name-layer");
    nameElement3 = document.createElement("div");
    nameElement3.classList.add("name-layer");
    nameElement4 = document.createElement("div");
    nameElement4.classList.add("name-layer");
    nameElement5 = document.createElement("div");
    nameElement5.classList.add("name-layer");

    nameElement1.innerText = "Vassal";
    nameElement2.innerText = "Bureaucrat";
    nameElement3.innerText = "Sentry";
    nameElement4.innerText = "Market";
    nameElement5.innerText = "Chapel";

    kingdomViewerElement = document.createElement("div");
    kingdomViewerElement.classList.add("kingdom-viewer-group");

    kingdomViewerElement.appendChild(nameElement1);
    kingdomViewerElement.appendChild(nameElement2);
    kingdomViewerElement.appendChild(nameElement3);
    kingdomViewerElement.appendChild(nameElement4);
    kingdomViewerElement.appendChild(nameElement5);

    document.body.appendChild(kingdomViewerElement);
    storeMock.dispatch(setBaseOnlyRedux(false));
    // Act - Simulate calling the kingdomInitializer when the kingdom element is present and it is a base kingdom.
    DOMObserver.kingdomInitializer();

    // Assert
    // Verify kingdom field was set correctly
    expect(DOMObserver.kingdom).toStrictEqual([
      "Vassal",
      "Bureaucrat",
      "Sentry",
      "Market",
      "Chapel",
      "Province",
      "Gold",
      "Duchy",
      "Silver",
      "Estate",
      "Copper",
      "Curse",
    ]);
    // Verify baseOnly was set correctly
    expect(DOMObserver.baseOnly).toBe(true);
    // Verify baseOnly was dispatched to redux correctly
    expect(storeMock.getState().content.baseOnly).toBe(true);
    expect(DOMObserver.kingdomInitialized).toBe(true);
  });

  it("if  present it should set the kingdom and baseOnly fields, and dispatch the redux action for baseOnly (Case: non-base kingdom)", () => {
    // Arrange a scenario where the kingdom element is present in the DOM and the kingdom contains only base cards.
    nameElement1 = document.createElement("div");
    nameElement1.classList.add("name-layer");
    nameElement2 = document.createElement("div");
    nameElement2.classList.add("name-layer");
    nameElement3 = document.createElement("div");
    nameElement3.classList.add("name-layer");
    nameElement4 = document.createElement("div");
    nameElement4.classList.add("name-layer");
    nameElement5 = document.createElement("div");
    nameElement5.classList.add("name-layer");

    nameElement1.innerText = "Vampire";
    nameElement2.innerText = "Ogre";
    nameElement3.innerText = "Plebeian";
    nameElement4.innerText = "Lancer";
    nameElement5.innerText = "Minstrel";

    kingdomViewerElement = document.createElement("div");
    kingdomViewerElement.classList.add("kingdom-viewer-group");

    kingdomViewerElement.appendChild(nameElement1);
    kingdomViewerElement.appendChild(nameElement2);
    kingdomViewerElement.appendChild(nameElement3);
    kingdomViewerElement.appendChild(nameElement4);
    kingdomViewerElement.appendChild(nameElement5);

    document.body.appendChild(kingdomViewerElement);
    storeMock.dispatch(setBaseOnlyRedux(true));
    // Act - Simulate calling the kingdomInitializer when the kingdom element is present and it is a base kingdom.
    DOMObserver.kingdomInitializer();

    // Assert
    expect(DOMObserver.kingdom).toStrictEqual([
      "Vampire",
      "Ogre",
      "Plebeian",
      "Lancer",
      "Minstrel",
      "Province",
      "Gold",
      "Duchy",
      "Silver",
      "Estate",
      "Copper",
      "Curse",
    ]);
    expect(DOMObserver.baseOnly).toBe(false);
    expect(storeMock.getState().content.baseOnly).toBe(false);
    expect(DOMObserver.kingdomInitialized).toBe(true);
  });

  it("Should not initialize the kingdom and baseOnly fields if the kingdom element is not present in the DOM.", () => {
    // Arrange scenario where the kingdom element is not present in the Client DOM.

    // Act - Simulate calling the kingdomInitializer when the kingdom element is not present in the DOM.
    DOMObserver.kingdomInitializer();

    // Assert
    expect(DOMObserver.kingdom).toStrictEqual([]);
    expect(DOMObserver.baseOnly).toBe(true);
    expect(storeMock.getState().content.baseOnly).toBe(true);
    expect(DOMObserver.kingdomInitialized).toBe(false);
  });
});
