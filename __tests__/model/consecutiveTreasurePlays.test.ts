import { describe, it, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function consecutiveTreasurePlays", () => {
  it("should return true if the provided entry/line and the last entry in the logArchive (lastEntryProcessed) both play treasures", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    deck.setLastEntryProcessed("pNick plays 3 Coppers and a Silver. (+$5)");
    const line = "pNick plays 3 Coppers and 2 Silvers. (+7)";

    // Act
    const result = deck.consecutiveTreasurePlays(line);

    // Assert
    expect(result).toBe(true);
  });

  it("should return false when the lastEntryProcessed does not play a treasure", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    deck.setLastEntryProcessed("pNick discards a Copper.");
    const line = "pNick plays a Silver. (+2)";

    // Act
    const result = deck.consecutiveTreasurePlays(line);

    // Assert
    expect(result).toBe(false);
  });
  
  it("should return false if either the line provided  does not play a treasure", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    deck.setLastEntryProcessed("pNick plays a Silver. (+2)");
    const line = "pNick buys and gains a Moat.";

    // Act
    const result = deck.consecutiveTreasurePlays(line);

    // Assert
    expect(result).toBe(false);
  });
});
