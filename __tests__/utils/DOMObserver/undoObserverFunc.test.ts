/**
 * @jest-environment jsdom
 */

import {
  describe,
  it,
  expect,
  beforeEach,
  jest,
  afterEach,
} from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";

// Approach notes: MutationRecords[] are not able to be constructed manually, because the Mutation.addedNodes property
// is read-only.  Thus, to create the desired MutationRecord[] instance, in the beforeEach callback, we create an
// actual MutationRecord[] with the desired properties by setting up a MutationObserver and mutating the observed
// element.
describe("undoObserverCallback", () => {
  // Mock dependencies
  const setInterval = jest.spyOn(global, "setInterval");
  const clearInterval = jest.spyOn(global, "clearInterval");
  let mutationListMock: MutationRecord[];
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("in the case where game log was removed and added", () => {
    // In this beforeEach we create a MutationRecord[]  to use as a mock
    beforeEach(() => {
      // Create the game log element that will be removed and added.
      const gameLogElement = document.createElement("div");
      gameLogElement.setAttribute("class", "game-log");
      // Create the log container element that will be watched by the MutationObserver
      const logContainer = document.createElement("div");
      document.body.appendChild(logContainer);
      logContainer.appendChild(gameLogElement);
      //Create observer to watch the logContainer
      const mockObserver = new MutationObserver(
        (mutationList: MutationRecord[]) => {
          // Collect the MutationRecord[] to be used in the test within mutation callback.
          mutationListMock = mutationList;
        }
      );
      // Begin observing the log container element.
      mockObserver.observe(logContainer, { childList: true });
      // Mutate the log observer element to generate a MutationRecord[] with the desired properties.
      gameLogElement.remove();
      logContainer.appendChild(gameLogElement);
    });

    it("should clear the resetInterval and set the initInterval if the game log element was removed and added to the DOM.", () => {
      // Act - Simulate the undoObserverFunc triggering when the game log is removed and added.
      DOMObserver.undoObserverFunc(mutationListMock);

      // Assert
      expect(clearInterval).toBeCalledTimes(1);
      expect(clearInterval).toBeCalledWith(DOMObserver.resetInterval);
      expect(setInterval).toBeCalledTimes(1);
      expect(setInterval).toBeCalledWith(
        DOMObserver.initIntervalCallback,
        1000
      );
    });
  });

  describe("in the case where game log not both removed and added", () => {
    // In this beforeEach we create a MutationRecord[]  to use as a mock
    beforeEach(() => {
      // Create the game log element that exists within the log container
      const gameLogElement = document.createElement("div");
      gameLogElement.setAttribute("class", "game-log");
      // Create the log container element that will be watched by the Mutation Observer
      const logContainer = document.createElement("div");
      document.body.appendChild(logContainer);
      const mockObserver = new MutationObserver(
        (mutationList: MutationRecord[]) => {
          // Collect the MutationRecord[] to be used in the test.
          mutationListMock = mutationList;
        }
      );
      // Begin observing the log container
      mockObserver.observe(logContainer, { childList: true });
      // Mutate the log observer element to generate a MutationRecord[] that doesn't trigger an undo
      logContainer.appendChild(gameLogElement);
    });

    it("should take no action.", () => {
      // Act - Simulate the undoObserverFunc triggering when the game log not both removed and added.
      DOMObserver.undoObserverFunc(mutationListMock);

      // Assert
      expect(clearInterval).not.toBeCalled();
      expect(setInterval).not.toBeCalled();
    });
  });
});
