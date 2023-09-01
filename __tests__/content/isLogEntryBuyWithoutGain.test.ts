import { it, describe, beforeEach, expect } from "@jest/globals";
import { isLogEntryBuyWithoutGain } from "../../src/content/components/Observer/observerFunctions";

describe("Function isLogEntryBuyWithoutGain()", () => {
  let logEntry: string;
  describe("when given a line that contains the substring 'buy' but does not contain the substring ' gains '", () => {
    beforeEach(() => {
      logEntry = "Player buys a Festival.";
    });
    it("should return true", () => {
      expect(isLogEntryBuyWithoutGain(logEntry)).toBeTruthy();
    });
  });
  describe("when given a line that contains the substring buy and gain", () => {
    beforeEach(() => {
      logEntry = "Player buys and gains a Festival";
    });
    it("should return false", () => {
      expect(isLogEntryBuyWithoutGain(logEntry)).toBeFalsy();
    });
  });
});
