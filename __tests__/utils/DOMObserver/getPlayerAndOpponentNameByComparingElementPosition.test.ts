/**
 * @jest-environment jsdom
 */

import { expect, describe, it } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";

describe("getPlayerAndOpponentNameByComparingElementPosition ", () => {
  it("should return an array of 2 strings, PlayerName first, Opponent name 2nd when given an HTMLCollectionOf<HTMLElement> of <player-info> elements", () => {
    // Arrange - assemble a collection of playerInfoElements to give to the function.
    const mockPlayerInfoElement1: HTMLElement =
      document.createElement("player-info");
    const mockPlayerInfoElement2: HTMLElement =
      document.createElement("player-info");
    const mockPlayerInfoNameElement1: HTMLElement =
      document.createElement("player-info-name");
    const mockPlayerInfoNameElement2: HTMLElement =
      document.createElement("player-info-name");
    mockPlayerInfoElement1.style.transform =
      "translateX(0px) translateY(37.55px)";
    mockPlayerInfoElement2.style.transform =
      "translateX(0px) translateY(0.48px)";
    mockPlayerInfoNameElement1.innerText = "Player Name";
    mockPlayerInfoNameElement2.innerText = "Opponent Name";
    mockPlayerInfoElement1.appendChild(mockPlayerInfoNameElement1);
    mockPlayerInfoElement2.appendChild(mockPlayerInfoNameElement2);
    const mockFrag: DocumentFragment = document.createDocumentFragment();
    mockFrag.appendChild(mockPlayerInfoElement1);
    mockFrag.appendChild(mockPlayerInfoElement2);
    const playerInfoElementCollection =
      mockFrag.children as HTMLCollectionOf<HTMLElement>;

    // Assert - Simulate getting the player name and opponent name from the playerInfoElements.
    expect(
      DOMObserver.getPlayerAndOpponentNameByComparingElementPosition(
        playerInfoElementCollection
      )
    ).toStrictEqual(["Player Name", "Opponent Name"]);
  });
});
