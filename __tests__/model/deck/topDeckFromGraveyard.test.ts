import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("topDeckFromGraveyard ", () => {
  // Declare Deck reference
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should remove an instance of the provided card from graveyard, and add it to library", () => {
    // Arrange
    deck.graveyard = ["Harbinger", "Library", "Estate", "Silver"];
    deck.library = ["Sentry", "Vassal"];

    // Act - Simulate topdecking a Harbinger from graveyard.
    deck.topDeckFromGraveyard("Harbinger");

    // Assert - Verify card was moved from graveyard to library
    expect(deck.graveyard).toStrictEqual(["Library", "Estate", "Silver"]);
    expect(deck.library).toStrictEqual(["Sentry", "Vassal", "Harbinger"]);
  });

  it("should throw an error if the provided card is not in graveyard", () => {
    // Arrange
    deck.graveyard = ["Harbinger", "Library", "Estate", "Silver"];

    // Act and Assert
    expect(() => deck.topDeckFromGraveyard("Pot of Greed")).toThrowError(
      "No Pot of Greed in discard pile."
    );
  });
});
