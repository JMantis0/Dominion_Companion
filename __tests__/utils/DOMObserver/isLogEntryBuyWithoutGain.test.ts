import { it, describe, expect } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";

describe("isLogEntryBuyWithoutGain", () => {
  it("should return true when given a line that contains the substring 'buy' but does not contain the substring ' gains '", () => {
    // Arrange
    const logEntry = "Player buys a Festival.";

    // Act and Assert
    expect(DOMObserver.isLogEntryBuyWithoutGain(logEntry)).toBeTruthy();
  });
  it("should return false when given a line that contains the substring buy and gain", () => {
    // Arrange
    const logEntry = "Player buys and gains a Festival";

    // Act and Assert
    expect(DOMObserver.isLogEntryBuyWithoutGain(logEntry)).toBeFalsy();
  });
});
