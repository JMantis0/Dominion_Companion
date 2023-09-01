/**
 * @jest-environment jsdom
 */

import { beforeAll } from "@jest/globals";
import { expect, describe, it } from "@jest/globals";
import { arePlayerInfoElementsPresent } from "../../src/content/components/Observer/observerFunctions";

describe("Function arePlayerInfoElementsPresent()", () => {
  // let mockPlayerInfoElementCollection: HTMLCollection;
  const mockPlayerInfoElement1: HTMLElement =
    document.createElement("player-info-name");
  mockPlayerInfoElement1.setAttribute("id", "el1");
  const mockPlayerInfoElement2: HTMLElement =
    document.createElement("player-info-name");
  mockPlayerInfoElement2.setAttribute("id", "el2");
  describe("with player-info-name elements in dom ", () => {
    beforeAll(() => {
      document.body.appendChild(mockPlayerInfoElement1);
      document.body.appendChild(mockPlayerInfoElement2);
    });
    it("should return true", () => {
      expect(arePlayerInfoElementsPresent()).toBe(true);
    });
  });

  describe("without player-info-name elements in dom ", () => {
    beforeAll(() => {
      document.body.removeChild(mockPlayerInfoElement1);
      document.body.removeChild(mockPlayerInfoElement2);
    });
    it("should return false", () => {
      expect(arePlayerInfoElementsPresent()).toBe(false);
    });
  });
});
