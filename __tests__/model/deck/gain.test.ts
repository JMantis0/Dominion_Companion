import { it, describe, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("gain", () => {
  // Declare Deck reference.
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pNick", "pName", []);
  });

  it("should add the provided card to the graveyard and to the entireDeck", () => {
    // Arrange
    deck.graveyard = ["Copper"];
    deck.entireDeck = ["Estate", "Copper"];

    // Act - Simulate gaining a Chapel into the graveyard.
    deck.gain("Chapel");

    // Assert
    expect(deck.graveyard).toStrictEqual(["Copper", "Chapel"]);
    expect(deck.entireDeck).toStrictEqual(["Estate", "Copper", "Chapel"]);
  });
});
