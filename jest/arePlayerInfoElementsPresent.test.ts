import { beforeAll } from "@jest/globals";
import { expect, jest, describe, it } from "@jest/globals";
import { arePlayerInfoElementsPresent } from "../src/content/contentFunctions";

describe("Function arePlayerInfoElementsPresent()", () => {
  describe("with player-info-name elements in dom ", () => {
    const spy = jest.spyOn(document, "getElementsByTagName");
    beforeAll(() => {
      const mockPlayerInfoElement1: HTMLElement =
        document.createElement("player-info-name");
      const mockPlayerInfoElement2: HTMLElement =
        document.createElement("player-info-name");
      const frag = document.createDocumentFragment();
      frag.appendChild(mockPlayerInfoElement1);
      frag.appendChild(mockPlayerInfoElement2);
      const mockPlayerInfoElementCollection: HTMLCollection = frag.children;
      spy.mockReturnValue(mockPlayerInfoElementCollection);
    });

    it("should return true", () => {
      expect(arePlayerInfoElementsPresent()).toBe(true);
    });
  });
  describe("without player-info-name elements in dom ", () => {
    const spy = jest.spyOn(document, "getElementsByTagName");
    beforeAll(() => {
      const frag = document.createDocumentFragment();
      const mockEmptyElementCollection: HTMLCollection = frag.children;
      spy.mockReturnValue(mockEmptyElementCollection);
    });
    it("should return false", () => {
      expect(arePlayerInfoElementsPresent()).toBe(false);
    });
  });
});
