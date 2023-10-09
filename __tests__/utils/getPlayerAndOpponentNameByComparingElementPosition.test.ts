/**
 * @jest-environment jsdom
 */

import { expect, describe, it } from "@jest/globals";
import { getPlayerAndOpponentNameByComparingElementPosition } from "../../src/utils/utils";

describe("Function getPlayerAndOpponentNameByComparingElementPosition()", () => {
  describe("When given an HTMLCollectionOf<HTMLElement> of <player-info> elements", () => {
    it("should return an array of 2 strings, PlayerName first, Opponent name 2nd", () => {
      let playerInfoElementCollection: HTMLCollectionOf<HTMLElement>;
      const mockFrag: DocumentFragment = document.createDocumentFragment();
      const mockPlayerInfoElement1: HTMLElement =
        document.createElement("player-info");
      const mockPlayerInfoNameElement1: HTMLElement =
        document.createElement("player-info-name");
      mockPlayerInfoElement1.style.transform =
        "translateX(0px) translateY(37.55px)";
      mockPlayerInfoNameElement1.innerText = "Player Name";
      const mockPlayerInfoElement2: HTMLElement =
        document.createElement("player-info");
      const mockPlayerInfoNameElement2: HTMLElement =
        document.createElement("player-info-name");
      mockPlayerInfoElement2.style.transform =
        "translateX(0px) translateY(0.48px)";
      mockPlayerInfoNameElement2.innerText = "Opponent Name";

      mockPlayerInfoElement1.appendChild(mockPlayerInfoNameElement1);
      mockPlayerInfoElement2.appendChild(mockPlayerInfoNameElement2);
      mockFrag.appendChild(mockPlayerInfoElement1);
      mockFrag.appendChild(mockPlayerInfoElement2);
      playerInfoElementCollection =
        mockFrag.children as HTMLCollectionOf<HTMLElement>;

      expect(
        getPlayerAndOpponentNameByComparingElementPosition(
          playerInfoElementCollection
        )
      ).toStrictEqual(["Player Name", "Opponent Name"]);
    });
  });

  // Another suite using other techniques
  describe("getPlayerAndOpponentNameByComparingElementPosition", () => {
    it("should return player and opponent names based on element position", () => {
      // Arrange
      document.body.innerHTML = `
      <div class="player-info-element" style="transform: translateY(10px);">
        <player-info-name>Player A</player-info-name>
      </div>
      <div class="player-info-element" style="transform: translateY(20px);">
        <player-info-name>Player B</player-info-name>
      </div>
      <div class="player-info-element" style="transform: translateY(5px);">
        <player-info-name>Player C</player-info-name>
      </div>
    `;
      const playerInfoElements = document.getElementsByClassName(
        "player-info-element"
      ) as HTMLCollectionOf<HTMLElement>;

      // Act
      const [playerName, opponentName] =
        getPlayerAndOpponentNameByComparingElementPosition(playerInfoElements);

      // Assert
      expect(playerName).toBe("Player B"); // Player B has the highest translateY value
      expect(opponentName).toBe("Player C"); // Player C has the lowest translateY value
    });

    it("should return an empty array if playerInfoElements is empty", () => {
      // Arrange
      document.body.innerHTML = "";
      const playerInfoElements = document.getElementsByClassName(
        "player-info-element"
      ) as HTMLCollectionOf<HTMLElement>;

      // Act
      const [playerName, opponentName] =
        getPlayerAndOpponentNameByComparingElementPosition(playerInfoElements);

      // Assert
      expect(playerName).toBeUndefined();
      expect(opponentName).toBeUndefined();
    });

    // Add more test cases as needed
  });
});
