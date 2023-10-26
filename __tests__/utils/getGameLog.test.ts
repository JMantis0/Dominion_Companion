/**
 * @jest-environment jsdom
 */

import { afterEach } from "@jest/globals";
import { expect, describe, it } from "@jest/globals";
import { getGameLog } from "../../src/utils/utils";

describe("Function getGameLog()", () => {
  describe("with game-log element in dom", () => {
    let mockGameLogElement: HTMLElement = document.createElement("div");
    mockGameLogElement.setAttribute("class", "game-log");
    document.body.appendChild(mockGameLogElement);
    afterEach(() => {
      mockGameLogElement.remove();
      mockGameLogElement = document.createElement("div");
      mockGameLogElement.setAttribute("class", "game-log");
      document.body.appendChild(mockGameLogElement);
    });
    it("should return game-log contents as string", () => {
      mockGameLogElement.innerText = "Game Log Contents";
      expect(getGameLog()).toBe("Game Log Contents");
    });
    it("should remove the last lines if it matches the string 'Premoves", () => {
      mockGameLogElement.innerText =
        "Log1\nLog2\nLog3\nPremoves:Player premoves a Copper";
      expect(getGameLog()).toBe("Log1\nLog2\nLog3");
    });
  });
});
