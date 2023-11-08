import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("isArtisanGain", () => {
  // Declare Deck reference.
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should return true if the most recent entry processed is an Artisan play.", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick plays an Artisan.";

    // Act - Simulate checking for Artisan gain when the gain was from an Artisan.
    const artisanGain = deck.isArtisanGain();
    // Assert
    expect(artisanGain).toBe(true);
  });

  it("should return false if the most recent entry processed is not an Artisan play.", () => {
    deck.lastEntryProcessed = "pNick plays 2 Coppers. (+2)";
    // Act - Simulate checking for Artisan gain when the gain was not from an Artisan.
    const artisanGain = deck.isArtisanGain();
    // Assert
    expect(artisanGain).toBe(false);
  });
});
