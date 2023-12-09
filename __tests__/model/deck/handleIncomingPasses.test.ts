import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("handleIncomingPasses", () => {
  let deck: Deck;
  beforeEach(() => {
    deck = new Deck("MockTitle", false, "MockRating", "Player", "pNick", []);
  });
  it("should check if the pass is to the Deck and if so add the given cards to the hand and entireDeck", () => {
    // Arrange a hand and entireDeck
    deck.entireDeck = ["Copper", "Estate"];
    deck.hand = ["Copper"];

    // Act - handle a line that is passing to the deck
    deck.handleIncomingPasses(
      "L passes a Bureaucrat to pNick.",
      "passes",
      ["Bureaucrat"],
      [1]
    );

    // Assert - Verify the card was added to hand and entireDeck
    expect(deck.entireDeck).toStrictEqual(["Copper", "Estate", "Bureaucrat"]);
    expect(deck.hand).toStrictEqual(["Copper", "Bureaucrat"]);
  });

  it("should not take any action if the pass is not to the Deck", () => {
    // Arrange a hand and entireDeck
    deck.entireDeck = ["Copper", "Estate"];
    deck.hand = ["Copper"];

    // Act - handle a line that is passing to a different player
    deck.handleIncomingPasses(
      "L passes a Bureaucrat to Charles.",
      "passes",
      ["Bureaucrat"],
      [1]
    );

    // Assert - Verify the zones did not change.
    expect(deck.entireDeck).toStrictEqual(["Copper", "Estate"]);
    expect(deck.hand).toStrictEqual(["Copper"]);
  });
});
