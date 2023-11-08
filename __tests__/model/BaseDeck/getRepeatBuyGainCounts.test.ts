import { it, describe, expect, beforeEach } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("getRepeatBuyGainCounts", () => {
  // Declare BaseDeck reference.
  let deck: BaseDeck;

  beforeEach(() => {
    deck = new BaseDeck("", false, "", "pNick", "pName", []);
  });

  it("should return the difference between the amount of the card that is bought in the provided line, and the amount that is bought in the most recent logArchive entry, and remove the last member of the logArchive", () => {
    // Arrange
    deck.logArchive = [
      "pNick plays 2 Golds. (+$6)",
      "pNick buys and gains 2 Golds.",
    ];
    deck.lastEntryProcessed = "pNick buys and gains 2 Golds.";
    // Act and Assert - Simulate playing a third Gold immediately after playing 2 Golds.
    expect(
      deck.getRepeatBuyGainCounts(
        "pNick buys and gains 3 Golds.",
        deck.logArchive
      )
    ).toEqual(1);
    expect(deck.logArchive).toStrictEqual(["pNick plays 2 Golds. (+$6)"]);
  });

  it("should work even if the difference is greater than 1", () => {
    deck.logArchive = [
      "pNick plays 8 Golds. (+$24)",
      "pNick buys and gains an Artisan.",
    ];
    // Arrange
    deck.lastEntryProcessed = "pNick buys and gains an Artisan.";

    // Act and Assert - simulate playing 3 Artisans in one line immediately after purchasing one Artisan.
    expect(
      deck.getRepeatBuyGainCounts(
        "pNick buys and gains 4 Artisans.",
        deck.logArchive
      )
    ).toEqual(3);
    expect(deck.logArchive).toStrictEqual(["pNick plays 8 Golds. (+$24)"]);
  });

  it("should throw an error when the logArchive is empty", () => {
    // Arrange
    deck.logArchive = [];

    // Act and Assert
    expect(() =>
      deck.getRepeatBuyGainCounts("Game #132083560, unrated.", deck.logArchive)
    ).toThrowError("Empty logArchive.");
  });
});
