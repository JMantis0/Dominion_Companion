import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function logEntryAppliesToThisDeck()", () => {
  it("should return true when the line has a match for the playerName or playerNick", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const line1 = "pNick plays a Sentry.";
    const line2 = "Turn 3 - pName";

    // Act
    const result1 = deck.logEntryAppliesToThisDeck(line1);
    const result2 = deck.logEntryAppliesToThisDeck(line2);

    // Assert
    expect(result1).toBe(true);
    expect(result2).toBe(true);
  });

  it("should return false when the line does not match playerName or playerNick", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const line1 = "oNick plays a Sentry.";
    const line2 = "Turn 3 - oName";

    // Act
    const result1 = deck.logEntryAppliesToThisDeck(line1);
    const result2 = deck.logEntryAppliesToThisDeck(line2);

    // Assert
    expect(result1).toBe(false);
    expect(result2).toBe(false);
  });
});
