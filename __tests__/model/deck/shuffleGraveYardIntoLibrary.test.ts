import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("shuffleGraveYardIntoLibrary", () => {
  // Declare Deck reference.
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should remove all cards from the graveyard and add them the library", () => {
    // Arrange
    deck.graveyard = ["Harbinger", "Library", "Estate", "Silver"];
    deck.library = ["Sentry", "Vassal"];

    // Act - Simulate shuffling a small graveyard into the library
    deck.shuffleGraveYardIntoLibrary();

    // Assert
    expect(deck.graveyard).toStrictEqual([]);
    expect(deck.library).toStrictEqual([
      "Sentry",
      "Vassal",
      "Silver",
      "Estate",
      "Library",
      "Harbinger",
    ]);
  });
});
