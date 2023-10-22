import { describe, it, expect, afterEach } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("Function consecutiveTreasurePlays", () => {
  let deck = new BaseDeck("", false, "", "pName", "pNick", []);

  afterEach(() => {
    deck = new BaseDeck("", false, "", "pName", "pNick", []);
  });

  it("should return true if the provided entry/line and the lastEntryProcessed both play treasures", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick plays 3 Coppers and a Silver. (+$5)";
    const line = "pNick plays 3 Coppers and 2 Silvers. (+7)";

    // Act
    const result = deck.consecutiveTreasurePlays(line);

    // Assert
    expect(result).toBe(true);
  });

  it("should return false when the lastEntryProcessed does not play a treasure", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick discards a Copper.";
    const line = "pNick plays a Silver. (+2)";

    // Act
    const result = deck.consecutiveTreasurePlays(line);

    // Assert
    expect(result).toBe(false);
  });

  it("should return false if either the line provided does not play a treasure", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick plays a Silver. (+2)";
    const line = "pNick buys and gains a Moat.";

    // Act
    const result = deck.consecutiveTreasurePlays(line);

    // Assert
    expect(result).toBe(false);
  });
});
