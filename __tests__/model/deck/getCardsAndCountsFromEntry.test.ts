import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function getCardCountsFromEntry", () => {
  // getCardCountsFromEntry iterates through the Kingdom to form its return value.
  // For this reason, the order of the members of the arrays being return depends on the kingdom order.
  it("should return an array of cards and array of cardAmounts for given line", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", [
      "Copper",
      "Silver",
      "Gold",
    ]);

    // Arguments for function being tested
    const line = "pName draws 4 Coppers, 10 Golds, and 2 Silvers.";

    // Act
    const [cardResult, cardAmountResult] =
      deck.getCardsAndCountsFromEntry(line);

    // Assert
    expect(cardResult).toStrictEqual(["Copper", "Silver", "Gold"]);
    expect(cardAmountResult).toStrictEqual([4, 2, 10]);
  });
  it("should work for both numbers and the articles 'a' and 'an'", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", [
      "Copper",
      "Gold",
      "Estate",
    ]);

    // Arguments for function being tested
    const line = "pName draws 4 Coppers, a Gold, and an Estate.";

    // Act
    const [cardResult, cardAmountResult] =
      deck.getCardsAndCountsFromEntry(line);

    // Assert
    expect(cardResult).toStrictEqual(["Copper", "Gold", "Estate"]);
    expect(cardAmountResult).toStrictEqual([4, 1, 1]);
  });
  
  it("should return an empty arrays for lines with no card matches", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", [
      "Copper",
      "Gold",
      "Estate",
    ]);

    // Arguments for function being tested
    const line = "pNick shuffles their deck.";

    // Act
    const [cardResult, cardAmountResult] =
      deck.getCardsAndCountsFromEntry(line);

    // Assert
    expect(cardResult).toStrictEqual([]);
    expect(cardAmountResult).toStrictEqual([]);
  });
});
