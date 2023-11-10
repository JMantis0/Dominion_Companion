import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("trashFromHand", () => {
  // Declare Deck reference
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should remove an instance of the provided card from hand, remove it from the entire deck, and add it to trash", () => {
    // Arrange
    deck.entireDeck = ["Harbinger", "Chapel", "Estate", "Silver", "Vassal"];
    deck.trash = ["Sentry", "Vassal"];
    deck.hand = ["Harbinger", "Chapel", "Estate", "Silver"];

    // Act - Simulate trashing a card from the hand.
    deck.trashFromHand("Harbinger");

    // Assert - Verify the card was removed from hand and entireDeck
    expect(deck.entireDeck).toStrictEqual([
      "Chapel",
      "Estate",
      "Silver",
      "Vassal",
    ]);
    expect(deck.trash).toStrictEqual(["Sentry", "Vassal", "Harbinger"]);
    expect(deck.hand).toStrictEqual(["Chapel", "Estate", "Silver"]);
  });

  it("should throw an error if the provided card is not in hand", () => {
    // Arrange
    deck.hand = ["Harbinger", "Chapel", "Estate", "Silver"];

    // Act and Assert
    expect(() => deck.trashFromHand("Pot of Greed")).toThrowError(
      "No Pot of Greed in hand."
    );
  });
});
