import { describe, it, expect, beforeEach } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("consecutiveTreasurePlays", () => {
  let deck: BaseDeck;

  beforeEach(() => {
    deck = new BaseDeck("", false, "", "pName", "pNick", []);
  });

  it("should return true if the provided entry/line and the lastEntryProcessed both play treasures", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick plays 3 Coppers and a Silver. (+$5)";
    const line = "pNick plays 3 Coppers and 2 Silvers. (+7)";

    // Act - Simulate playing consecutive treasures
    const result = deck.consecutiveTreasurePlays(line);

    // Assert
    expect(result).toBe(true);
  });

  it("should return false when the lastEntryProcessed does not play a treasure", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick discards a Copper.";
    const line = "pNick plays a Silver. (+2)";

    // Act - Simulate playing a treasure on this line after discarding a card on the last line.
    const result = deck.consecutiveTreasurePlays(line);

    // Assert
    expect(result).toBe(false);
  });

  it("should return false if the current line does not play a treasure", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick plays a Silver. (+2)";
    const line = "pNick buys and gains a Moat.";

    // Act - simulate playing a treasure on the previous line, but not on the current line.
    const result = deck.consecutiveTreasurePlays(line);

    // Assert
    expect(result).toBe(false);
  });
});
