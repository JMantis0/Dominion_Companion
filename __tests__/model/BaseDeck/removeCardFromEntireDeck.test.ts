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

    // Act - simulate removing a Vassal from entireDeck.
    deck.removeCardFromEntireDeck("Vassal");

    // Assert
    expect(deck.entireDeck).toStrictEqual(["Cellar", "Cellar"]);
    expect(setEntireDeck).toBeCalledTimes(1);
    expect(setEntireDeck).toBeCalledWith(["Cellar", "Cellar"]);
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
