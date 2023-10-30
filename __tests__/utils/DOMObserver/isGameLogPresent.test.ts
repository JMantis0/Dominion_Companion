/**
 * @jest-environment jsdom
 */

import { expect, describe, it } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";

describe("isGameLogPresent()", () => {
  it("should return true when game-log element is present in the DOM.", () => {
    // Arrange - place an element with 'game-log' class into the DOM

    const mockGameLogElement = document.createElement("div");
    mockGameLogElement.setAttribute("class", "game-log");
    document.body.appendChild(mockGameLogElement);

    // Act and Assert - Check for presence of a game-log element.
    expect(DOMObserver.isGameLogPresent()).toBe(true);
  });

  it("should return false when the game-log element is not present in the DOM.", () => {
    // Arrange - Clear all HTML from document body.
    document.body.innerHTML = "";

    // Act and Assert - Check for game-log element when none is present.
    expect(DOMObserver.isGameLogPresent()).toBe(false);
  });
});
