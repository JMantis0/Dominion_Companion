import { it, describe, expect } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("Method logEntryAppliesToThisDeck()", () => {
  it("should return true when the line has a match for the playerName or playerNick", () => {
    // Arrange
    const deck = new BaseDeck("", false, "", "pName", "pNick", []);
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
    const deck = new BaseDeck("", false, "", "pName", "pNick", []);
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
