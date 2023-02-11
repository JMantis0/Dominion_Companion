import { beforeAll } from "@jest/globals";
import { expect, jest, describe, it } from "@jest/globals";
import { isGameLogPresent } from "../src/content/contentFunctions";

describe("Function isGameLogPresent()", () => {
  let spy;
  beforeAll(() => {
    spy = jest.spyOn(document, "getElementsByClassName");
  });
  describe("with game-log element in dom", () => {
    let mockGameLogElement: HTMLElement;
    let mockGameLogElementCollection: HTMLCollection;
    let gameLogFrag: DocumentFragment;
    beforeAll(() => {
      gameLogFrag = document.createDocumentFragment();
      mockGameLogElement = document.createElement("div");
      mockGameLogElement.setAttribute("class", "game-log");
      gameLogFrag.appendChild(mockGameLogElement);
      mockGameLogElementCollection = gameLogFrag.children;
      spy.mockReturnValue(mockGameLogElementCollection);
    });

    it("should return true", () => {
      expect(isGameLogPresent()).toBe(true);
    });
  });

  describe("without game-log element in dom", () => {
    let mockNonGameLogElementCollection: HTMLCollection;
    let nonGameLogFrag: DocumentFragment;
    beforeAll(() => {
      nonGameLogFrag = document.createDocumentFragment();
      mockNonGameLogElementCollection = nonGameLogFrag.children;
      spy.mockReturnValue(mockNonGameLogElementCollection);
    });

    it("should return false", () => {
      expect(isGameLogPresent()).toBe(false);
    });
  });
});
