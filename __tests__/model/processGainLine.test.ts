import { describe, it, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function processGainLine()", () => {
  it("should handle gaining a card from a normal purchase correctly", () => {
    // Arrange
    const deck = new Deck("", false, "", "pNick", "pName", [
      "Bureaucrat",
      "Mine",
      "Artisan",
      "Harbinger",
      "Merchant",
      "Vassal",
      "Village",
      "Workshop",
      "Copper",
      "Curse",
      "Estate",
      "Silver",
      "Duchy",
      "Gold",
      "Province",
    ]);
    const graveyard = ["Copper", "Copper"];
    deck.setGraveyard(graveyard);
    const logArchive = [
      "Turn 3 - pName",
      "pNick plays a Copper and a Silver. (+$3)",
      "pNick buys and gains a Silver.",
    ];
    deck.setLogArchive(logArchive);
    const cards = ["Silver"];
    const numberOfCards = [1];
    const line = "pNick buys and gains a Silver.";
    const expectedGraveyard = ["Copper", "Copper", "Silver"];
    const expectedEntireDeck = [
      "Estate",
      "Copper",
      "Estate",
      "Copper",
      "Estate",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Silver",
    ];
    // Act
    deck.processGainsLine(line, cards, numberOfCards);
    const resultGraveyard = deck.getGraveyard();
    const resultEntireDeck = deck.getEntireDeck();
    // Assert
    expect(resultGraveyard).toStrictEqual(expectedGraveyard);
    expect(resultEntireDeck).toStrictEqual(expectedEntireDeck);
  });
  // Gain into deck (bureaucrat)

  // Gain into Hand (Mine, Artisan)

  // Buy and gain
});
