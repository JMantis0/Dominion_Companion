import { it, expect } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

it("should add the provided card to the entireDeck", () => {
  // Arrange an BaseDeck object
  const deck = new BaseDeck("", false, "", "oName", "o", []);

  // Act - Simulate adding a card to the entireDeck
  deck.entireDeck = ["Card1", "Card2", "Card3"];
  deck.addCardToEntireDeck("Card4");

  // Assert

  expect(deck.entireDeck).toStrictEqual(["Card1", "Card2", "Card3", "Card4"]);
});
