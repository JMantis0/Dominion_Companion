/**
 * @jest-environment jsdom
 */
import { expect, describe, it } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";

describe("arePlayerInfoElementsPresent", () => {
  // Create mock player-info-name elements.
  const mockPlayerInfoElement1: HTMLElement =
    document.createElement("player-info-name");
  const mockPlayerInfoElement2: HTMLElement =
    document.createElement("player-info-name");

  it("should return true when player-info-name elements are in present in the DOM.", () => {
    // Arrange - Append the <player-info-elements> in the DOM.
    document.body.appendChild(mockPlayerInfoElement1);
    document.body.appendChild(mockPlayerInfoElement2);

    // Act and Assert - simulate checking the DOM for the <player-info-elements> when they are present.
    expect(DOMObserver.arePlayerInfoElementsPresent()).toBe(true);
  });

  it("should return false when player-info-name elements are not present in the DOM.", () => {
    // Arrange - Remove the <player-info-elements> from the DOM.
    document.body.removeChild(mockPlayerInfoElement1);
    document.body.removeChild(mockPlayerInfoElement2);
    
    // Act and Assert - Simulate checking the DOM for <player-info-elements> when there are non present.
    expect(DOMObserver.arePlayerInfoElementsPresent()).toBe(false);
  });
});
