import { it, describe, expect, afterEach, jest } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("Method removeCardFromEntireDeck()", () => {
  // Instantiate BaseDeck object
  let deck = new BaseDeck("", false, "", "pName", "pNick", []);
  // Spy on function dependency
  const setEntireDeck = jest.spyOn(BaseDeck.prototype, "setEntireDeck");

  afterEach(() => {
    deck = new BaseDeck("", false, "", "pName", "pNick", []);
    jest.clearAllMocks();
  });

  it("should remove an instance of the provided card from the entire deck", () => {
    // Arrange
    deck.entireDeck = ["Vassal", "Cellar", "Cellar"];
    const card = "Vassal";
    const expectedEntireDeck = ["Cellar", "Cellar"];

    // Act - simulate removing a Vassal from entireDeck
    deck.removeCardFromEntireDeck(card);

    // Assert
    expect(deck.entireDeck).toStrictEqual(expectedEntireDeck);
    expect(setEntireDeck).toBeCalledTimes(1);
    expect(setEntireDeck).toBeCalledWith(expectedEntireDeck);
  });
  it("should throw an error when the provided card is not in the entire deck", () => {
    // Arrange
    const entireDeck = ["Vassal", "Cellar", "Cellar"];
    deck.setEntireDeck(entireDeck);
    const card = "Pot of Greed";

    // Act and Assert - Simulate trying to remove a card that is not in the entireDeck
    expect(() => deck.removeCardFromEntireDeck(card)).toThrowError(
      "No Pot of Greed in the deck list."
    );
  });
});
