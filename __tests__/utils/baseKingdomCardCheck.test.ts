import { describe, it, beforeEach, expect } from "@jest/globals";
import { baseKingdomCardCheck } from "../../src/utils/utils";
import { createRandomKingdom } from "../testUtilFuncs";

describe("Function baseKingdomCardCheck.test.ts", () => {
  let kingdom: string[];
  describe("When given a kingdom that contains card only in the base set", () => {
    beforeEach(() => {
      kingdom = createRandomKingdom();
    });
    it("Should return true.", () => {
      expect(baseKingdomCardCheck(kingdom)).toBeTruthy();
    });
  });

  describe("When given a kingdom that contains cards outside of the base set", () => {
    beforeEach(() => {
      kingdom = createRandomKingdom();
      kingdom.push("NonBaseCard");
    });
    it("Should return false.", () => {
      expect(baseKingdomCardCheck(kingdom)).toBeFalsy();
    });
  });

  describe("baseKingdomCardCheck", () => {
    it("should return true for a kingdom containing only base cards", () => {
      const kingdom = [
        "Cellar",
        "Chapel",
        "Moat",
        "Harbinger",
        // Add more base cards as needed
      ];

      const result = baseKingdomCardCheck(kingdom);

      expect(result).toBe(true);
    });

    it("should return false for a kingdom containing non-base cards", () => {
      const kingdom = [
        "Cellar",
        "Chapel",
        "Smithy",
        "Vampire", // A non-base card
        // Add more cards as needed
      ];

      const result = baseKingdomCardCheck(kingdom);

      expect(result).toBe(false);
    });

    it("should return true for an empty kingdom", () => {
      const kingdom: string[] = [];

      const result = baseKingdomCardCheck(kingdom);

      expect(result).toBe(true);
    });
  });
});
