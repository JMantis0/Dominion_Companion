/**
 * @jest-environment jsdom
 */

import { expect, describe, it } from "@jest/globals";
import { getHeroPlayerInfoElement } from "../../src/content/contentScriptFunctions";

describe("Function getHeroPlayerInfoElement()", () => {
  describe("When given an HTMLCollectionOf<HTMLElement> of <player-info> elements", () => {
    it("should return the <player-info> element of the hero (protagonist player)", () => {
      let playerInfoElementCollection: HTMLCollectionOf<HTMLElement>;
      const mockFrag: DocumentFragment = document.createDocumentFragment();
      const mockHeroPlayerInfo: HTMLElement =
        document.createElement("player-info");

      mockHeroPlayerInfo.style.transform =
        "translateX(0px) translateY(37.55px)";
      const mockOpponentPlayerInfoElement: HTMLElement =
        document.createElement("player-info");

      mockOpponentPlayerInfoElement.style.transform =
        "translateX(0px) translateY(0.48px)";

      mockFrag.appendChild(mockHeroPlayerInfo);
      mockFrag.appendChild(mockOpponentPlayerInfoElement);
      playerInfoElementCollection =
        mockFrag.children as HTMLCollectionOf<HTMLElement>;

      expect(
        getHeroPlayerInfoElement(playerInfoElementCollection)
      ).toStrictEqual(mockHeroPlayerInfo);
    });
  });
});
