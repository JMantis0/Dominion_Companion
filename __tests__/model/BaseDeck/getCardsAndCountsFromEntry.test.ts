import { it, describe, expect, beforeEach } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("getCardCountsFromEntry", () => {
  let deck: BaseDeck;

  beforeEach(() => {
    deck = new BaseDeck("", false, "", "pName", "pNick", [
      "Silver",
      "Gold",
      "Estate",
      "Copper",
    ]);
  });

  it("should return an array of cards and array of cardAmounts for given line", () => {
    // Act - Simulate calling with a line that has multiple cards with differing values.
    const [cardResult, cardAmountResult] = deck.getCardsAndCountsFromEntry(
      "pName draws 4 Coppers, 10 Golds, and 2 Silvers."
    );

    // Assert
    expect(cardResult).toStrictEqual(["Copper", "Gold", "Silver"]);
    expect(cardAmountResult).toStrictEqual([4, 10, 2]);
  });

  it("should work for both numbers and the articles 'a' and 'an'", () => {
    // Act - Simulate calling with a line with one card starting a vowel.
    const [cardResult, cardAmountResult] = deck.getCardsAndCountsFromEntry(
      "pName draws 4 Coppers, a Gold, and an Estate."
    );

    // Assert
    expect(cardResult).toStrictEqual(["Copper", "Gold", "Estate"]);
    expect(cardAmountResult).toStrictEqual([4, 1, 1]);
  });

  it("should return an empty arrays for lines with no card matches", () => {
    // Act - Simulate calling with a shuffle line.
    const [cardResult, cardAmountResult] = deck.getCardsAndCountsFromEntry(
      "pNick shuffles their deck."
    );

    // Assert
    expect(cardResult).toStrictEqual([]);
    expect(cardAmountResult).toStrictEqual([]);
  });
});
