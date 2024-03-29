import { it, describe, expect, beforeEach } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("getCardsAndCountsFromLine", () => {
  let deck: BaseDeck;

  beforeEach(() => {
    deck = new BaseDeck("", false, "", "pName", "pNick", [
      "Silver",
      "Gold",
      "Estate",
      "Copper",
      "Overgrown Estate",
      "Taxman",
      "Journeyman"
    ]);
  });

  it("should return an array of cards and array of cardAmounts for given line", () => {
    // Act - Simulate calling with a line that has multiple cards with differing values.
    const [cardResult, cardAmountResult] = deck.getCardsAndCountsFromLine(
      "pName draws 4 Coppers, 10 Golds, and 2 Silvers."
    );

    // Assert
    expect(cardResult).toStrictEqual(["Copper", "Gold", "Silver"]);
    expect(cardAmountResult).toStrictEqual([4, 10, 2]);
  });

  it("should work for both numbers and the articles 'a' and 'an'", () => {
    // Act - Simulate calling with a line with one card starting a vowel.
    const [cardResult, cardAmountResult] = deck.getCardsAndCountsFromLine(
      "pName draws 4 Coppers, a Gold, and an Estate."
    );

    // Assert
    expect(cardResult).toStrictEqual(["Copper", "Gold", "Estate"]);
    expect(cardAmountResult).toStrictEqual([4, 1, 1]);
  });

  it("should return an empty arrays for lines with no card matches", () => {
    // Act
    const [cardResult, cardAmountResult] = deck.getCardsAndCountsFromLine(
      "pNick shuffles their deck."
    );

    // Assert
    expect(cardResult).toStrictEqual([]);
    expect(cardAmountResult).toStrictEqual([]);
  });

  it("should handle Overgrown Estate correctly", () => {
    // Act
    const [cardResult, cardAmountResult] = deck.getCardsAndCountsFromLine(
      "pNick draws an Overgrown Estate."
    );

    // Assert
    expect(cardResult).toStrictEqual(["Overgrown Estate"]);
    expect(cardAmountResult).toStrictEqual([1]);
  });

  it("should handle cards found by wishing correctly", () => {
    // Act
    const [cardResult, cardAmountResult] = deck.getCardsAndCountsFromLine(
      "pNick wishes for Copper and finds it."
    );

    // Assert
    expect(cardResult).toStrictEqual(["Copper"]);
    expect(cardAmountResult).toStrictEqual([1]);
  });

  it("should handle Taxmen (plural of Taxmen) correctly", () => {
    // Act
    const [cardResult, cardAmountResult] = deck.getCardsAndCountsFromLine(
      "pNick draws 2 Taxmen."
    );

    // Assert
    expect(cardResult).toStrictEqual(["Taxman"]);
    expect(cardAmountResult).toStrictEqual([2]);
  });

  it("should handle Journeymen (plural of Journeymen) correctly", () => {
    // Act
    const [cardResult, cardAmountResult] = deck.getCardsAndCountsFromLine(
      "pNick draws 2 Journeymen."
    );

    // Assert
    expect(cardResult).toStrictEqual(["Journeyman"]);
    expect(cardAmountResult).toStrictEqual([2]);
  });
});
