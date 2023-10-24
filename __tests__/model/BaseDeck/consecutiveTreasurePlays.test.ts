import { describe, it, expect, afterEach, jest } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("Method consecutiveTreasurePlays", () => {
  let deck = new BaseDeck("", false, "", "pName", "pNick", []);
  const checkForTreasurePlayLine = jest.spyOn(
    BaseDeck.prototype,
    "checkForTreasurePlayLine"
  );

  afterEach(() => {
    deck = new BaseDeck("", false, "", "pName", "pNick", []);
    jest.clearAllMocks();
  });

  it("should return true if the provided entry/line and the lastEntryProcessed both play treasures", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick plays 3 Coppers and a Silver. (+$5)";
    const line = "pNick plays 3 Coppers and 2 Silvers. (+7)";

    // Act - Simulate playing consecutive treasures
    const result = deck.consecutiveTreasurePlays(line);

    // Assert
    expect(result).toBe(true);
    expect(checkForTreasurePlayLine).toBeCalledTimes(2);
    expect(checkForTreasurePlayLine).nthCalledWith(1, deck.lastEntryProcessed);
    expect(checkForTreasurePlayLine).nthCalledWith(2, line);
  });

  it("should return false when the lastEntryProcessed does not play a treasure", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick discards a Copper.";
    const line = "pNick plays a Silver. (+2)";

    // Act - Simulate playing a treasure on this line after discarding a card on the last line.
    const result = deck.consecutiveTreasurePlays(line);

    // Assert
    expect(result).toBe(false);
    expect(checkForTreasurePlayLine).toBeCalledTimes(1);
    expect(checkForTreasurePlayLine).toBeCalledWith(deck.lastEntryProcessed);
  });

  it("should return false if the current line does not play a treasure", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick plays a Silver. (+2)";
    const line = "pNick buys and gains a Moat.";

    // Act - simulate playing a treasure on the previous line, but not on the current line.
    const result = deck.consecutiveTreasurePlays(line);

    // Assert
    expect(result).toBe(false);
    expect(checkForTreasurePlayLine).toBeCalledTimes(2);
    expect(checkForTreasurePlayLine).nthCalledWith(1, deck.lastEntryProcessed);
    expect(checkForTreasurePlayLine).nthCalledWith(2, line);
  });
});
