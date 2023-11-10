import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Method trashFromSetAside", () => {
  // Declare Deck reference
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should add the given card to trash and remove it from the entireDeck", () => {
    //Arrange
    deck.trash = ["Trash1", "Trash2"];
    deck.entireDeck = ["Card1", "Card2", "Copper"];
    deck.setAside = ["Copper", "Estate"];

    // Act - simulate trashing Copper from setAside
    deck.trashFromSetAside("Copper");

    // Assert - Verify card was added to trash and removed from setAside and entireDeck.
    expect(deck.trash).toStrictEqual(["Trash1", "Trash2", "Copper"]);
    expect(deck.entireDeck).toStrictEqual(["Card1", "Card2"]);
    expect(deck.setAside).toStrictEqual(["Estate"]);
  });

  it("should throw an error if the given card is not in setAside=", () => {
    // Arrange
    deck.trash = ["Trash1", "Trash2"];
    deck.entireDeck = ["Card1", "Card2", "Copper", "Pot of Greed"]; // Card in entireDeck, but not setAside
    deck.setAside = ["Copper", "Estate"];

    // Act and Assert - simulate trashing a card from setAside that is not in the entireDeck
    expect(() => deck.trashFromSetAside("Pot of Greed")).toThrowError(
      "No Pot of Greed in setAside."
    );
  });
});
