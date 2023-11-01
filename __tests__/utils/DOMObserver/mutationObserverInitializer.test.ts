/**
 * @jest-environment jsdom
 */
import { describe, it, expect, jest } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";
describe("mutationObserverInitializer", () => {
  // Mock dependencies
  const setGameLogObserver = jest.spyOn(DOMObserver, "setGameLogObserver");
  const setGameEndObserver = jest.spyOn(DOMObserver, "setGameEndObserver");
  const setUndoObserver = jest.spyOn(DOMObserver, "setUndoObserver");
  const observe = jest.spyOn(MutationObserver.prototype, "observe");
  
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

    // Act - Simulate calling the mutationObserverInitializer
    DOMObserver.mutationObserverInitializer();

    // Assert
    expect(setGameLogObserver).toBeCalledTimes(1);
    expect(setGameLogObserver).toBeCalledWith(
      new MutationObserver(DOMObserver.logObserverFunc)
    );
    expect(setGameEndObserver).toBeCalledTimes(1);
    expect(setGameEndObserver).toBeCalledWith(
      new MutationObserver(DOMObserver.gameEndObserverFunc)
    );
    expect(setUndoObserver).toBeCalledTimes(1);
    expect(setUndoObserver).toBeCalledWith(
      new MutationObserver(DOMObserver.undoObserverFunc)
    );
    expect(observe).toBeCalledTimes(3);
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
