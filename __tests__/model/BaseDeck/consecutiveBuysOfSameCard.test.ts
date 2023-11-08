import { describe, it, expect, afterEach } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("Method consecutiveBuysOfSameCard()", () => {
  let deck = new BaseDeck("", false, "", "pName", "pNick", []);

  afterEach(() => {
    deck = new BaseDeck("", false, "", "pName", "pNick", []);
  });

  it("should return true if the provided line and the most recent line in logArchive are both 'buy and gain' lines for the same card", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick buys and gains 2 Villages."; // lestEntryProcessed is a 'buy and gain' for Village.
    const act = "gains";
    const line = "pNick buys and gains 3 Villages."; // Current line is 'buy and gain' for Village.
    const card = "Village";

    // Act - Simulate buying the same card consecutively.
    const result = deck.consecutiveBuysOfSameCard(act, line, card);

    // Assert
    expect(result).toBe(true);
  });

  it("should return false when neither line buy and gain.", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick draws an Estate and a Moat."; // Not a 'buy and gain' line.
    const act = "gains";
    const line = "pNick plays 4 Coppers. (+$4)"; // Not a 'buy and gain' line.
    const card = "Copper";

    // Act - Simulate making a play this line, after a draw last line.
    const result = deck.consecutiveBuysOfSameCard(act, line, card);

    // Assert
    expect(result).toBe(false);
  });

  it("should return false when both lines buy and gain, but are for different cards", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick buys and gains 2 Villages."; // Buy and gain line for Village.
    const act = "gains";
    const line = "pNick buys and gains a Vassal."; // Buy and gain line for Vassal.
    const card = "Vassal";

    // Act - Simulate making two buys in a row, of different cards.
    const result = deck.consecutiveBuysOfSameCard(act, line, card);

    // Assert
    expect(result).toBe(false);
  });

  it("should return false when provided line is not buy and gain, but last line in logArchive is", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick buys and gains 2 Villages."; //  'Buy and gain' line in last logArchive entry.
    const act = "gains";
    const line = "pNick draws a Copper, an Estate, a Festival, and 2 Poachers."; // Provided line not a 'buy and gain' line.
    const card = "Festival";

    // Act - Simulate making a draws on this line, after making a buy and gain on the previous line.
    const result = deck.consecutiveBuysOfSameCard(act, line, card);

    // Assert
    expect(result).toBe(false);
  });

  it("should return false if provided line is buy and gain, but not last line in logArchive.", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick plays 4 Coppers. (+$4)"; // lastEntryProcessed is not a 'buy and gain' line.
    const act = "gains";
    const line = "pNick buys and gains a Village."; // Provided line is a 'buy and gain' line.
    const card = "Village";

    // Act - Simulate making a buy and gain on this line after playing treasures on the previous line.
    const result = deck.consecutiveBuysOfSameCard(act, line, card);

    // Assert
    expect(result).toBe(false);
  });

  it("should return false when act is not 'gains'", () => {
    //Arrange
    const act = "plays";
    const line = "pNick plays a Sentry.";
    const card = "Sentry";

    // Act and Assert - Simulate not maying a gain on the current line.
    expect(deck.consecutiveBuysOfSameCard(act, line, card)).toBe(false);
  });
});
