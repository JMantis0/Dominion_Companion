import { beforeAll } from "@jest/globals";
import { expect, jest, describe, it } from "@jest/globals";
import { isGameLogPresent } from "../src/content/contentFunctions";

describe("Function isGameLogPresent()", () => {
  let mockGameLogElement: HTMLElement;
  describe("with game-log element in dom", () => {
    beforeAll(() => {
      mockGameLogElement = document.createElement("div");
      mockGameLogElement.setAttribute("class", "game-log");
      document.body.appendChild(mockGameLogElement);
    });
    it("should return true", () => {
      expect(isGameLogPresent()).toBe(true);
    });
  });
  describe("without game-log element in dom", () => {
    let nonGameLogFrag: DocumentFragment;
    beforeAll(() => {
      document.body.removeChild(mockGameLogElement);
    });
    it("should return false", () => {
      expect(isGameLogPresent()).toBe(false);
    });
  });
});
