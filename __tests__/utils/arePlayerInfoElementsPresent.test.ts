/**
 * @jest-environment jsdom
 */

import { expect, describe, it } from "@jest/globals";
import { arePlayerInfoElementsPresent } from "../../src/utils/utils";

describe("Function arePlayerInfoElementsPresent()", () => {
  const mockPlayerInfoElement1: HTMLElement =
    document.createElement("player-info-name");
  const mockPlayerInfoElement2: HTMLElement =
    document.createElement("player-info-name");
  describe("with player-info-name elements in dom ", () => {
    it("should return true", () => {
      document.body.appendChild(mockPlayerInfoElement1);
      document.body.appendChild(mockPlayerInfoElement2);
      expect(arePlayerInfoElementsPresent()).toBe(true);
    });
  });

  describe("without player-info-name elements in dom ", () => {
    it("should return false", () => {
      document.body.removeChild(mockPlayerInfoElement1);
      document.body.removeChild(mockPlayerInfoElement2);
      expect(arePlayerInfoElementsPresent()).toBe(false);
    });
  });
});
