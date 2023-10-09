/**
 * @jest-environment jsdom
 */
import { beforeAll } from "@jest/globals";
import { expect, describe, it } from "@jest/globals";
import { getPlayerInfoElements } from "../../src/utils/utils";

describe("Function getPlayerInfoElements()", () => {
  describe("With player-info elements in the dom", () => {
    let mockPlayerInfoElementCollection: HTMLCollection;
    beforeAll(() => {
      const mockFrag: DocumentFragment = document.createDocumentFragment();
      const mockPlayerInfoElement1: HTMLElement =
        document.createElement("player-info");
      const mockPlayerInfoElement2: HTMLElement =
        document.createElement("player-info");
      const mockPlayerInfoElement3: HTMLElement =
        document.createElement("player-info");
      const mockPlayerInfoElement4: HTMLElement =
        document.createElement("player-info");
      mockFrag.appendChild(mockPlayerInfoElement1);
      mockFrag.appendChild(mockPlayerInfoElement2);
      mockPlayerInfoElementCollection = mockFrag.children;
      document.body.appendChild(mockPlayerInfoElement3);
      document.body.appendChild(mockPlayerInfoElement4);
    });
    it("Should return an HTML collection of 2 <player-info> elements", () => {
      expect(getPlayerInfoElements()).toStrictEqual(
        mockPlayerInfoElementCollection
      );
    });
  });

  describe("getPlayerInfoElements", () => {
    it("should return a collection of player-info elements", () => {
      // Arrange - Create player-info elements in the document
      document.body.innerHTML = `
      <player-info>Player 1</player-info>
      <player-info>Player 2</player-info>
      <player-info>Player 3</player-info>
    `;

      // Act
      const playerInfoElements = getPlayerInfoElements();

      // Assert
      expect(playerInfoElements).toBeInstanceOf(HTMLCollection);
      expect(playerInfoElements.length).toBe(3); // Assuming there are 3 player-info elements
    });

    it("should return an empty collection if no player-info elements are found", () => {
      // Arrange - Remove all player-info elements from the document
      document.body.innerHTML = "";

      // Act
      const playerInfoElements = getPlayerInfoElements();

      // Assert
      expect(playerInfoElements).toBeInstanceOf(HTMLCollection);
      expect(playerInfoElements.length).toBe(0);
    });

    // Add more test cases as needed
  });
});
