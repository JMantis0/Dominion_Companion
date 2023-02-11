import { beforeAll } from "@jest/globals";
import { expect, jest, describe, it } from "@jest/globals";
import { getPlayerInfoNameElements } from "../src/content/contentFunctions";

describe("Function getPlayerInfoNameElements()", () => {
  describe("With player-info-name elements in the dom", () => {
    let mockPlayerInfoNameElementCollection: HTMLCollection;
    beforeAll(() => {
      const mockFrag: DocumentFragment = document.createDocumentFragment();
      const mockPlayerInfoNameElement1: HTMLElement =
        document.createElement("player-info-name");
      const mockPlayerInfoNameElement2: HTMLElement =
        document.createElement("player-info-name");
      mockFrag.appendChild(mockPlayerInfoNameElement1);
      mockFrag.appendChild(mockPlayerInfoNameElement2);
      mockPlayerInfoNameElementCollection = mockFrag.children;
      const spy = jest.spyOn(document, "getElementsByTagName");
      spy.mockReturnValue(mockPlayerInfoNameElementCollection);
    });
    it("Should return a HTML collection of 2 <player-info-name> elements", () => {
      expect(getPlayerInfoNameElements()).toBe(
        mockPlayerInfoNameElementCollection
      );
      
    });
  });
});
