/**
 * @jest-environment jsdom
 */
import { describe, it, expect, jest } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";
describe("mutationObserverInitializer", () => {
  // Spy on the MutationObserver's observe method
  const observe = jest.spyOn(MutationObserver.prototype, "observe");
  // Declare references for the MutationObservers
  let undoObserver: MutationObserver;
  let gameEndObserver: MutationObserver;
  let gameLogObserver: MutationObserver;

  it("should assign new mutation observers and invoke their observe methods on the correct DOM elements.", () => {
    // Arrange - Create mock elements to be observed and append them to the DOM
    const gameLogElement = document.createElement("div");
    gameLogElement.setAttribute("class", "game-log");
    document.body.appendChild(gameLogElement);
    const gameEndElement = document.createElement("game-ended-notification");
    document.body.appendChild(gameEndElement);
    const logContainerElement = document.createElement("div");
    logContainerElement.setAttribute("class", "log-container");
    document.body.appendChild(logContainerElement);

    undoObserver = new MutationObserver(DOMObserver.undoObserverFunc);
    gameEndObserver = new MutationObserver(DOMObserver.gameEndObserverFunc);
    gameLogObserver = new MutationObserver(DOMObserver.logObserverFunc);

    // Act - Simulate calling the mutationObserverInitializer
    DOMObserver.mutationObserverInitializer();

    // Assert
    expect(DOMObserver.gameEndObserver).toStrictEqual(gameEndObserver);
    expect(DOMObserver.gameLogObserver).toStrictEqual(gameLogObserver);
    expect(DOMObserver.undoObserver).toStrictEqual(undoObserver);
    expect(observe).nthCalledWith(1, logContainerElement, {
      childList: true,
      subtree: true,
    });
    expect(observe).nthCalledWith(2, gameLogElement, {
      childList: true,
      subtree: true,
    });
    expect(observe).nthCalledWith(3, gameEndElement, {
      childList: true,
      subtree: true,
    });
  });
});
