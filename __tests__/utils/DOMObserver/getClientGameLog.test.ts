/**
 * @jest-environment jsdom
 */

import { afterEach } from "@jest/globals";
import { expect, describe, it } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";

describe("getClientGameLog()", () => {
  // Declare mock game log element.
  let mockGameLogElement: HTMLElement;

  afterEach(() => {
    mockGameLogElement.remove();
  });

  it("should return game-log contents as string ", () => {
    // Arrange
    mockGameLogElement = document.createElement("div");
    mockGameLogElement.setAttribute("class", "game-log");
    document.body.appendChild(mockGameLogElement);
    mockGameLogElement.innerText = "Game Log Contents";

    // Act and Assert - Simulate getting the game log contents.
    expect(DOMObserver.getClientGameLog()).toBe("Game Log Contents");
  });

  it("should remove the last lines if it matches the string 'Premoves", () => {
    // Arrange
    mockGameLogElement = document.createElement("div");
    mockGameLogElement.setAttribute("class", "game-log");
    document.body.appendChild(mockGameLogElement);
    mockGameLogElement.innerText =
      "Log1\nLog2\nLog3\nPremoves:Player premoves a Copper";

    // Act and Assert - Simulate getting a game log where the last line is a Premoves line..
    expect(DOMObserver.getClientGameLog()).toBe("Log1\nLog2\nLog3");
  });

  it("should return an error if there is no game log element present in the DOM", () => {
    // Act and Assert - Simulating getting the game log when the element is not in the DOM.
    expect(() => DOMObserver.getClientGameLog()).toThrowError(
      "No game-log element present in the DOM."
    );
  });
});
