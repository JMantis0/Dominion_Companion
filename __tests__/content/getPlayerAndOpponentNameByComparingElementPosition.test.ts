/**
 * @jest-environment jsdom
 */


import { expect, describe, it } from "@jest/globals";
import { getPlayerAndOpponentNameByComparingElementPosition } from "../../src/content/contentFunctions";

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
});
