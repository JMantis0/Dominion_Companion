import { it, expect, jest } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

it("should add the provided card to the entireDeck", () => {
  // Arrange an BaseDeck object
  const deck = new BaseDeck("", false, "", "oName", "o", []);
  // Mock function dependency
  const setEntireDeck = jest.spyOn(BaseDeck.prototype, "setEntireDeck");
  // Act - Simulate adding a card to the entireDeck
  deck.entireDeck = ["Card1", "Card2", "Card3"];
  deck.addCardToEntireDeck("Card4");

  // Assert
  expect(setEntireDeck).toBeCalledTimes(1);
  expect(setEntireDeck).toBeCalledWith(["Card1", "Card2", "Card3", "Card4"]);
  expect(deck.entireDeck).toStrictEqual(["Card1", "Card2", "Card3", "Card4"]);
});
