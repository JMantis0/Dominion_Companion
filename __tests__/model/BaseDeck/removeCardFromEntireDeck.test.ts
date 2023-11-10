import { it, describe, expect, beforeEach } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("removeCardFromEntireDeck", () => {
  // Declare BaseDeck reference
  let deck: BaseDeck;

  beforeEach(() => {
    deck = new BaseDeck("", false, "", "pName", "pNick", []);
  });

  it("should remove an instance of the provided card from the entire deck", () => {
    // Arrange
    deck.entireDeck = ["Vassal", "Cellar", "Cellar"];

    // Act - simulate removing a Vassal from entireDeck.
    deck.removeCardFromEntireDeck("Vassal");

    // Assert
    expect(deck.entireDeck).toStrictEqual(["Cellar", "Cellar"]);
  });
  
  it("should throw an error when the provided card is not in the entire deck", () => {
    // Arrange
    deck.entireDeck = ["Vassal", "Cellar", "Cellar"];

    // Act and Assert - Simulate trying to remove a card that is not in the entireDeck.
    expect(() => deck.removeCardFromEntireDeck("Pot of Greed")).toThrowError(
      "No Pot of Greed in the deck list."
    );
  });
});
