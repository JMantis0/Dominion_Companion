import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("play", () => {
  //  Declare Deck reference.
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should remove one instance of the the provided card from hand and add it to inPlay", () => {
    // Arrange
    deck.hand = ["Copper", "Estate", "Estate", "Sentry"];
    deck.inPlay = ["Laboratory"];

    // Act - Simulate playing a Sentry from hand into play.
    deck.play("Sentry");

    // Assert - Verify the card was moved from hand to inPlay
    expect(deck.hand).toStrictEqual(["Copper", "Estate", "Estate"]);
    expect(deck.inPlay).toStrictEqual(["Laboratory", "Sentry"]);
  });

  it("should throw an error when the provided card is not in hand", () => {
    // Arrange
    deck.hand = ["Copper", "Estate", "Estate", "Sentry"];

    // Act and Assert - Simulate trying to play a card that is not in hand.
    expect(() => deck.play("Pot of Greed")).toThrowError(
      `No Pot of Greed in hand.`
    );
  });
});
