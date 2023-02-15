/**
 * @jest-environment jsdom
 */

import { beforeAll } from "@jest/globals";
import { expect,  describe, it } from "@jest/globals";
import { getGameLog } from "../../src/content/contentFunctions";

describe("Function getGameLog()", () => {
  describe("with game-log element in dom", () => {
    beforeAll(() => {
      let mockGameLogElement: HTMLElement = document.createElement("div");
      mockGameLogElement.setAttribute("class", "game-log");
      mockGameLogElement.innerText = "Game Log Contents";
      document.body.appendChild(mockGameLogElement);
    });
    it("should return game-log contents as string", () => {
      expect(getGameLog()).toBe("Game Log Contents");
    });
  });
});
