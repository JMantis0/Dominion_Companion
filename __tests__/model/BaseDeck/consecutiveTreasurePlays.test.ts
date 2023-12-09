/**
 * @jest-environment jsdom
 */

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

  it("should return true for lines with the plural Platina", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick plays 2 Platina. (+$10)";
    const line = "pNick plays 2 Platina and a Silver. (+$12)";

    // Act - Simulate playing consecutive treasures with Platina on both the previous and current line.
    const result = deck.consecutiveTreasurePlays(line);

    // Assert
    expect(result).toBe(true);
  });

  it("should return false when the most recent play source is a Courier", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick plays a Platinum. (+$5)"; //This Platinum is played by a Courier
    deck.latestPlaySource = "Courier";
    const line = "pNick plays a Platinum. (+$5)"; //This platinum is played from hand.

    // The method should return false because the game-log in the client does not remove the log
    // for the Platinum that was played by the Courier even when the next play is a treasure.  The
    // client game-log does not combine them but keeps them on separate lines.

    // Act - simulate playing a treasure on the previous line, but not on the current line.
    const result = deck.consecutiveTreasurePlays(line);

    // Assert
    expect(result).toBe(false);
  });

  it("should return false when the most recent play source is a Fortune Hunter", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick plays a Platinum. (+$5)"; //This Platinum is played by a Fortune Hunter
    deck.latestPlaySource = "Fortune Hunter";
    const line = "pNick plays a Platinum. (+$5)"; //This platinum is played from hand.

    // The method should return false because the game-log in the client does not remove the log
    // for the Platinum that was played by the Fortune Hunter even when the next play is a treasure.  The
    // client game-log does not combine them but keeps them on separate lines.

    // Act - simulate playing a treasure on the previous line, but not on the current line.
    const result = deck.consecutiveTreasurePlays(line);

    // Assert
    expect(result).toBe(false);
  });
});
