import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("playFromDiscard", () => {
  // Declare Deck reference.
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should remove one instance of the the provided card from graveyard and add it to inPlay.", () => {
    // Arrange
    deck.graveyard = ["Copper", "Estate", "Estate", "Sentry"];
    deck.inPlay = ["Laboratory"];

    // Act - Simulate playing a card from graveyard (as with a Vassal).
    deck.playFromDiscard("Sentry");

    // Assert - Verify the card was moved from graveyard to inPlay
    expect(deck.graveyard).toStrictEqual(["Copper", "Estate", "Estate"]);
    expect(deck.inPlay).toStrictEqual(["Laboratory", "Sentry"]);
  });

  it("should throw an error when the provided card is not in graveyard.", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const graveyard = ["Copper", "Estate", "Estate", "Sentry"];
    deck.setGraveyard(graveyard);
    const card = "Pot of Greed";

    // Act and Assert - Simulate trying to play a card from the graveyard that isn't there.
    expect(() => deck.playFromDiscard(card)).toThrowError(
      "No Pot of Greed in discard pile."
    );
  });
});
