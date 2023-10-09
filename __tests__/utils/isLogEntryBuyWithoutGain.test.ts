import { it, describe, expect } from "@jest/globals";
import { isLogEntryBuyWithoutGain } from "../../src/utils/utils";

describe("Function isLogEntryBuyWithoutGain()", () => {
  let logEntry: string;
  describe("when given a line that contains the substring 'buy' but does not contain the substring ' gains '", () => {
    it("should return true", () => {
      logEntry = "Player buys a Festival.";
      expect(isLogEntryBuyWithoutGain(logEntry)).toBeTruthy();
    });
  });
  describe("when given a line that contains the substring buy and gain", () => {
    it("should return false", () => {
      logEntry = "Player buys and gains a Festival";
      expect(isLogEntryBuyWithoutGain(logEntry)).toBeFalsy();
    });
  });
});
