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
});
