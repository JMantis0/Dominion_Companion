import { describe, expect, it, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("processPassesLine", () => {
  let deck: Deck;
  beforeEach(() => {
    deck = new Deck("MockTitle", false, "MockRating", "Player", "P", []);
  });
  it("should remove an instance of the given card from a Deck's hand and entireDeck when there is no optional incoming parameter", () => {
    // Arrange
    deck.hand = ["Platinum", "Sentry"];
    deck.entireDeck = ["Platinum", "Sentry", "Copper"];
    // Act - Pass a card to opponent.
    deck.processPassesLine(["Sentry"], [1]);

    expect(deck.hand).toStrictEqual(["Platinum"]);
    expect(deck.entireDeck).toStrictEqual(["Platinum", "Copper"]);
  });
  it("should throw an error if the given card to be removed from hand is not in hand", () => {
    // Arrange
    deck.hand = ["Platinum", "Sentry"];
    deck.entireDeck = ["Platinum", "Sentry", "Copper"];
    // Act and Assert - Pass a card that is not in hand to opponent.
    expect(() => deck.processPassesLine(["Lurker"], [1])).toThrowError(
      "No Lurker in hand."
    );
  });

  it("should add an instance of the given card to a Decks's hand and entireDeck when the optional incoming parameter is true", () => {
    // Arrange
    deck.hand = ["Platinum", "Sentry"];
    deck.entireDeck = ["Platinum", "Sentry", "Copper"];
    // Act - Get a card from opponent.
    deck.processPassesLine(["Copper"], [1], "incoming");

    expect(deck.hand).toStrictEqual(["Platinum", "Sentry", "Copper"]);
    expect(deck.entireDeck).toStrictEqual([
      "Platinum",
      "Sentry",
      "Copper",
      "Copper",
    ]);
  });
});
