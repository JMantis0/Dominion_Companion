/**
 * @jest-environment jsdom
 */

import { expect, describe, it } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";

describe("Function isKingdomElementPresent", () => {
  it("should return true when element with class kingdom-viewer-group is in the DOM", () => {
    // Arrange - place a kingdom element in the DOM
    const kingdomElement = document.createElement("div") as HTMLElement;
    kingdomElement.setAttribute("class", "kingdom-viewer-group");
    document.body.appendChild(kingdomElement);

    // Act and Assert - Simulate checking for a kingdom element when one is present.
    expect(DOMObserver.isKingdomElementPresent()).toBe(true);
  });

  it("should return false when no element with class kingdom-viewer-group is in the DOM", () => {
    // Arrange - Remove any kingdom element from the DOM
    document.body.innerHTML = "";

    // Act and Assert - Simulate checking for a kingdom element when none is present.
    expect(DOMObserver.isKingdomElementPresent()).toBe(false);
  });
});
