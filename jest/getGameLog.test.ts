import { beforeAll } from "@jest/globals";
import { expect, jest, describe, it } from "@jest/globals";
import { getGameLog } from "../src/content/contentFunctions";

describe("Function getGameLog()", () => {
  describe("with game-log element in dom", () => {
    beforeAll(() => {
      let mockFrag: DocumentFragment = document.createDocumentFragment();
      let mockGameLogElement: HTMLElement = document.createElement("div");
      let spy;
      mockGameLogElement.innerText = "Game Log Contents";
      mockFrag.appendChild(mockGameLogElement);
      let mockCollection: HTMLCollection = mockFrag.children;
      spy = jest.spyOn(document, "getElementsByClassName");
      spy.mockReturnValue(mockCollection);
    });
    it("should return game-log contents as string", () => {
      expect(getGameLog()).toBe("Game Log Contents");
    });
  });
});
