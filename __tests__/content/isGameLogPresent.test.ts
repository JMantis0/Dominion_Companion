/**
 * @jest-environment jsdom
 */

import { beforeAll } from "@jest/globals";
import { expect, describe, it } from "@jest/globals";
import { isGameLogPresent } from "../../src/content/utils/utils";

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
    beforeAll(() => {
      document.body.removeChild(mockGameLogElement);
    });
    it("should return false", () => {
      expect(isGameLogPresent()).toBe(false);
    });
  });
});
