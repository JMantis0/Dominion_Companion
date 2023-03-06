/**
 * @jest-environment jsdom
 */
import { beforeAll } from "@jest/globals";
import { expect, describe, it } from "@jest/globals";
import { getPlayerInfoElements } from "../../src/content/contentScriptFunctions";

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
});
