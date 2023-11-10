import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("topDeckFromHand", () => {
  // Declare Deck reference
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should remove an instance of the provided card from hand, and add it to library", () => {
    // Arrange
    deck.hand = ["Harbinger", "Library", "Estate", "Silver"];
    deck.library = ["Sentry", "Vassal"];

    // Act - Simulate topdecking a Harbinger from hand.
    deck.topDeckFromHand("Harbinger");

    // Assert - Verify card was moved from hand to library
    expect(deck.hand).toStrictEqual(["Library", "Estate", "Silver"]);
    expect(deck.library).toStrictEqual(["Sentry", "Vassal", "Harbinger"]);
  });

  it("should throw an error if the provided card is not in hand", () => {
    // Arrange

    // Act and Assert
    expect(() => deck.topDeckFromHand("Pot of Greed")).toThrowError(
      "No Pot of Greed in hand."
    );
  });
});
