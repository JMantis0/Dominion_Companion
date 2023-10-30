/**
 * @jest-environment jsdom
 */
import { expect, describe, it } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";

describe("getPlayerInfoElements()", () => {
  it("Should return an HTML collection of 2 <player-info> elements", () => {
    // Arrange - Attack player-info elements to DOM
    const mockPlayerInfoElement1: HTMLElement =
      document.createElement("player-info");
    const mockPlayerInfoElement2: HTMLElement =
      document.createElement("player-info");
    document.body.appendChild(mockPlayerInfoElement1);
    document.body.appendChild(mockPlayerInfoElement2);

    // Manually create the expected object
    const mockFrag: DocumentFragment = document.createDocumentFragment();
    mockFrag.appendChild(mockPlayerInfoElement1.cloneNode());
    mockFrag.appendChild(mockPlayerInfoElement2.cloneNode());
    const mockPlayerInfoElementCollection =
      mockFrag.children as HTMLCollectionOf<HTMLElement>;

    // Act and Assert - Simulate getting the player-info elements
    expect(DOMObserver.getPlayerInfoElements()).toStrictEqual(
      mockPlayerInfoElementCollection
    );
  });

  it("should return a collection of player-info elements when they are present in the DOM", () => {
    // Arrange - Create player-info elements in the document
    document.body.innerHTML = `
      <player-info>Player 1</player-info>
      <player-info>Player 2</player-info>
      <player-info>Player 3</player-info>
    `;

    // Act
    const playerInfoElements = DOMObserver.getPlayerInfoElements();

    // Assert
    expect(playerInfoElements).toBeInstanceOf(HTMLCollection);
    expect(playerInfoElements.length).toBe(3); // Assuming there are 3 player-info elements
  });

  it("should throw an error if there are no <player-info> elements in the DOM", () => {
    // Arrange - Remove all player-info elements from the document
    document.body.innerHTML = "";

    // Act and Assert
    expect(() => DOMObserver.getPlayerInfoElements()).toThrowError(
      "No <player-info> elements found in the DOM."
    );
  });
});
