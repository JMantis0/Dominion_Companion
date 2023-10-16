import { describe, it, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function consecutiveBuysOfSameCard()", () => {
  it("should return true if the provided line and the most recent line in logArchive are both 'buy and gain' lines for the same card", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive = [
      "Turn 10 - pName",
      "pNick plays a Festival.",
      "pNick gets +2 Actions.",
      "pNick gets +1 Buy.",
      "pNick gets +$2.",
      "pNick plays a Moat.",
      "pNick draws a Copper and a Moat.",
      "pNick plays a Moat.",
      "pNick draws an Estate and a Moat.",
      "pNick plays 4 Coppers. (+$4)",
      "pNick buys and gains 2 Villages.", // Last logArchive entry is a 'buy and gain' for Village.
    ];
    deck.setLogArchive(logArchive);
    const act = "gains";
    const numberOfCards = 1;
    const line = "pNick buys and gains 3 Villages."; // Current line is 'buy and gain' for Village.
    const card = "Village";

    // Act
    const result = deck.consecutiveBuysOfSameCard(
      act,
      numberOfCards,
      line,
      card
    );

    // Assert
    expect(result).toBeTruthy();
  });
  it("should return false when neither line buy and gain.", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive = [
      "Turn 10 - pName",
      "pNick plays a Festival.",
      "pNick gets +2 Actions.",
      "pNick gets +1 Buy.",
      "pNick gets +$2.",
      "pNick plays a Moat.",
      "pNick draws a Copper and a Moat.",
      "pNick plays a Moat.",
      "pNick draws an Estate and a Moat.", // Not a 'buy and gain' line.
    ];
    deck.setLogArchive(logArchive);
    const act = "gains";
    const numberOfCards = 1;
    const line = "pNick plays 4 Coppers. (+$4)"; // Not a 'buy and gain' line.
    const card = "Copper";

    // Act
    const result = deck.consecutiveBuysOfSameCard(
      act,
      numberOfCards,
      line,
      card
    );

    // Assert
    expect(result).toBe(false);
  });

  it("should return false when both lines buy and gain, but are for different cards", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive = [
      "Turn 10 - pName",
      "pNick plays a Festival.",
      "pNick gets +2 Actions.",
      "pNick gets +1 Buy.",
      "pNick gets +$2.",
      "pNick plays a Moat.",
      "pNick draws a Copper and a Moat.",
      "pNick plays a Moat.",
      "pNick draws an Estate and a Moat.",
      "pNick plays 4 Coppers. (+$4)",
      "pNick buys and gains 2 Villages.", // Buy and gain line for Village.
    ];
    deck.setLogArchive(logArchive);
    const act = "gains";
    const numberOfCards = 1;
    const line = "pNick buys and gains a Vassal."; // Buy and gain line for Vassal.
    const card = "Vassal";

    // Act
    const result = deck.consecutiveBuysOfSameCard(
      act,
      numberOfCards,
      line,
      card
    );

    // Assert
    expect(result).toBe(false);
  });

  it("should return false when provided line is not buy and gain, but last line in logArchive is", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive = [
      "Turn 10 - pName",
      "pNick plays a Festival.",
      "pNick gets +2 Actions.",
      "pNick gets +1 Buy.",
      "pNick gets +$2.",
      "pNick plays a Moat.",
      "pNick draws a Copper and a Moat.",
      "pNick plays a Moat.",
      "pNick draws an Estate and a Moat.",
      "pNick plays 4 Coppers. (+$4)",
      "pNick buys and gains 2 Villages.", //  'Buy and gain' line in last logArchive entry.
    ];
    deck.setLogArchive(logArchive);
    const act = "gains";
    const numberOfCards = 1;
    const line = "pNick draws a Copper, an Estate, a Festival, and 2 Poachers."; // Provided line not a 'buy and gain' line.
    const card = "Festival";

    // Act
    const result = deck.consecutiveBuysOfSameCard(
      act,
      numberOfCards,
      line,
      card
    );

    // Assert
    expect(result).toBe(false);
  });
  it("should return false if provided line is buy and gain, but not last line in logArchive.", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive = [
      "Turn 10 - pName",
      "pNick plays a Festival.",
      "pNick gets +2 Actions.",
      "pNick gets +1 Buy.",
      "pNick gets +$2.",
      "pNick plays a Moat.",
      "pNick draws a Copper and a Moat.",
      "pNick plays a Moat.",
      "pNick draws an Estate and a Moat.",
      "pNick plays 4 Coppers. (+$4)", // Last entry of logArchive is not a 'buy and gain' line.
    ];
    deck.setLogArchive(logArchive);
    const act = "gains";
    const numberOfCards = 1;
    const line = "pNick buys and gains a Village."; // Provided line is a 'buy and gain' line.
    const card = "Village";

    // Act
    const result = deck.consecutiveBuysOfSameCard(
      act,
      numberOfCards,
      line,
      card
    );

    // Assert
    expect(result).toBe(false);
  });
});
