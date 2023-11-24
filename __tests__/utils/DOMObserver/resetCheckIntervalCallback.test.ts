/**
 * @jest-environment jsdom
 */
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";

describe("resetCheckIntervalCallback", () => {
  // Spy on dependencies.
  const clearInterval = jest.spyOn(global, "clearInterval");
  const setInterval = jest.spyOn(global, "setInterval");
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML="";
  });
  it("should not do anything if the game log is present in the DOM", () => {
    // Arrange - Add game log to the DOM
    const gameLog = document.createElement("div");
    gameLog.setAttribute("class", "game-log");
    document.body.appendChild(gameLog);

    // Act
    DOMObserver.resetCheckIntervalCallback();

    // Assert
    expect(clearInterval).not.toBeCalled();
    expect(setInterval).not.toBeCalled();
  });

  it("should clear the resetInterval and set the initInterval if the game log element is not present in the DOM", () => {
    // Arrange - clear the DOM
    document.body.innerHTML = "";

    // Act
    DOMObserver.resetCheckIntervalCallback();

    // Assert
    expect(clearInterval).toBeCalledWith(DOMObserver.resetInterval);
    expect(setInterval).toBeCalledWith(DOMObserver.initIntervalCallback, 1000);
  });
});
