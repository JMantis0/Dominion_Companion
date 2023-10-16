import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";

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
    const line = "pName draws 4 Coppers, 10 Golds, and 2 Silvers.";
    const expectedCards = ["Copper", "Silver", "Gold"];
    const expectedCardAmounts = [4, 2, 10];

    // Act
    const [cardResult, cardAmountResult] =
      deck.getCardsAndCountsFromEntry(line);

    // Assert
    expect(expectedCards).toStrictEqual(cardResult);
    expect(expectedCardAmounts).toStrictEqual(cardAmountResult);
  });
});
