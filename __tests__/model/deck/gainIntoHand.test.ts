import { it, describe, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("gainIntoHand", () => {
  // Instantiate Deck object.
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pNick", "pName", []);
  });

  it("should add the provided card to the hand", () => {
    // Arrange
    deck.hand = ["Copper"];
    deck.entireDeck = ["Estate", "Copper"];

    // Act - Simulate gaining a Chapel into hand (as with Artisan).
    deck.gainIntoHand("Chapel");

    // Assert - Verify card was added to hand and entireDeck.
    expect(deck.hand).toStrictEqual(["Copper", "Chapel"]);
    expect(deck.entireDeck).toStrictEqual(["Estate", "Copper", "Chapel"]);
  });
});
