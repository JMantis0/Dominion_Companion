import { describe, it, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function addCardToEntireDeck()", () => {
  it("should add the provided card to the entireDeck field", () => {
    //  Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const cardToAdd = "Ace";

    // Act
    deck.addCardToEntireDeck(cardToAdd);
    const entireDeck = deck.getEntireDeck();
    const entireDeckLength = entireDeck.length;

    // Assert
    expect(entireDeckLength).toEqual(11);
    expect(entireDeck).toContain("Ace");
  });
});
