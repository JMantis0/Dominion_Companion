import { it, describe, expect } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("Function removeCardFromEntireDeck()", () => {
  it("should remove an instance of the provided card from the entire deck", () => {
    // Arrange
    const deck = new BaseDeck("", false, "", "pName", "pNick", []);
    const entireDeck = ["Vassal", "Cellar", "Cellar"];
    deck.setEntireDeck(entireDeck);
    const card = "Vassal";
    const expectedEntireDeck = ["Cellar", "Cellar"];

    // Act
    deck.removeCardFromEntireDeck(card);
    const resultEntireDeck = deck.getEntireDeck();

    // Assert
    expect(resultEntireDeck).toStrictEqual(expectedEntireDeck);
  });
  it("should throw an error when the provided card is not in the entire deck", () => {
    // Arrange
    const deck = new BaseDeck("", true, "", "pName", "pNick", []);
    const entireDeck = ["Vassal", "Cellar", "Cellar"];
    deck.setEntireDeck(entireDeck);
    const card = "Pot of Greed";

    // Act and Assert
    expect(() => deck.removeCardFromEntireDeck(card)).toThrowError(
      "No Pot of Greed in the deck list."
    );
  });
});
