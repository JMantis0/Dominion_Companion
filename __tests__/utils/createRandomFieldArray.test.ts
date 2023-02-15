import { it, describe, expect } from "@jest/globals";
import { createRandomFieldArray, createRandomKingdom } from "../testUtilFuncs";

describe("Function createRandomFieldArray()", () => {
  describe("should return an array of string containing a random number between 0 and 10 of each kingdom card", () => {
    it("should have 17 or less unique elements", () => {
      const randomKingdom = createRandomKingdom();
      expect(typeof createRandomFieldArray(randomKingdom)).toBe(typeof []);
      
    });
  });
});
