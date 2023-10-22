import { it, expect, jest } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

it("should add the provided card to the entireDeck", () => {
  // Arrange an BaseDeck object
  const oDeck = new BaseDeck("", false, "", "oName", "o", []);
  oDeck.setEntireDeck(["Card1", "Card2", "Card3"]);
  // Mock function dependency
  const setLogArchive = jest.spyOn(BaseDeck.prototype, "setEntireDeck");
  // Act - Simulate adding a card to the entireDeck
  oDeck.addCardToEntireDeck("Card4");

  // Assert
  expect(setLogArchive).toBeCalledWith(["Card1", "Card2", "Card3", "Card4"]);
  expect(oDeck.entireDeck).toStrictEqual(["Card1", "Card2", "Card3", "Card4"]);
});
