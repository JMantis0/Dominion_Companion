import { beforeAll } from "@jest/globals";
import { expect, jest, describe, it } from "@jest/globals";
import { getPlayerInfoElements } from "../src/content/contentFunctions";

describe("Function getPlayerInfoElements()", () => {
  describe("With player-info elements in the dom", () => {
    let mockPlayerInfoElementCollection: HTMLCollectionOf<HTMLElement>;
    beforeAll(() => {
      const mockFrag: DocumentFragment = document.createDocumentFragment();
      const mockPlayerInfoElement1: HTMLElement =
        document.createElement("player-info");
      const mockPlayerInfoElement2: HTMLElement =
        document.createElement("player-info");
      mockFrag.appendChild(mockPlayerInfoElement1);
      mockFrag.appendChild(mockPlayerInfoElement2);
      mockPlayerInfoElementCollection =
        mockFrag.children as HTMLCollectionOf<HTMLElement>;
      const spy = jest.spyOn(document, "getElementsByTagName");
      spy.mockReturnValue(mockPlayerInfoElementCollection);
    });
    it("Should return an HTML collection of 2 <player-info> elements", () => {
      expect(getPlayerInfoElements()).toBe(mockPlayerInfoElementCollection);
    });
  });
});
