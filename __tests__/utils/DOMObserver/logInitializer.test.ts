/**
 * @jest-environment jsdom
 */
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";
describe("logInitializer", () => {
  let gameLogElement: HTMLElement;
  describe("should check if the game-log element is in the document, and then...", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      document.body.innerHTML = "";
    });

    it("if the game log is present, it should set the DOMObserver field values, gameLog, ratedGame, and logInitialized", () => {
      // Arrange - add the game-log element to the document.
      gameLogElement = document.createElement("div");
      gameLogElement.classList.add("game-log");
      gameLogElement.innerText =
        "Game #133465515, rated.\nCard Pool: level 1\nL starts with 7 Coppers.\nL starts with 3 Estates.\nG starts with 7 Coppers.\nG starts with 3 Estates.";
      document.body.appendChild(gameLogElement);

      // Act - Call logInitializer
      DOMObserver.logInitializer();

      // Verify gameLogField was set correctly.
      expect(DOMObserver.gameLog).toBe(
        "Game #133465515, rated.\nCard Pool: level 1\nL starts with 7 Coppers.\nL starts with 3 Estates.\nG starts with 7 Coppers.\nG starts with 3 Estates."
      );
      // Verify ratedGame field was set correctly.
      expect(DOMObserver.ratedGame).toBe(true);
      // Verify logInitialized set correctly.
      expect(DOMObserver.logInitialized).toBe(true);
    });

    it("if the game log is not present, it should not change any DOMObserver fields.", () => {
      // Arrange - Do not add the game-log element to the document.

      // Set DOMObserver fields;
      DOMObserver.gameLog = "This game log should not change.";
      DOMObserver.ratedGame = true;
      DOMObserver.logInitialized = false;

      // Spy on setter dependencies to ensure they are not called
      const setGameLog = jest.spyOn(DOMObserver, "setGameLog");
      const setRatedGame = jest.spyOn(DOMObserver, "setRatedGame");
      const setLogInitialized = jest.spyOn(DOMObserver, "setRatedGame");

      // Act - Simulate calling the logInitializer when the game log element is not present in the DOM.
      DOMObserver.logInitializer();

      // Assert
      // Verify the fields did not change.
      expect(DOMObserver.gameLog).toBe("This game log should not change.");
      expect(DOMObserver.ratedGame).toBe(true);
      expect(DOMObserver.logInitialized).toBe(false);
      // Verify the setters for the fields were not called.
      expect(setGameLog).not.toBeCalled();
      expect(setRatedGame).not.toBeCalled();
      expect(setLogInitialized).not.toBeCalled();
    });
  });
});
