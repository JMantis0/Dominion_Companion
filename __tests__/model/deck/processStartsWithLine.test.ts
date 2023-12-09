import { describe, expect, it, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("processStartsWithLine", () => {
  let deck: Deck;
  beforeEach(() => {
    deck = new Deck("", false, "", "Player", "P", []);
  });
  it("should add the given cards to the library and entireDeck", () => {
    // Arrange
    deck.library = [];
    deck.entireDeck = [];
    // Act
    deck.processStartsWithLine(["Copper", "Estate"], [7, 3]);
    // Assert
    expect(deck.library).toStrictEqual([
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Estate",
      "Estate",
      "Estate",
    ]);
    expect(deck.entireDeck).toStrictEqual([
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Estate",
      "Estate",
      "Estate",
    ]);
  });
  it("should work with shelters", () => {
    // Arrange
    deck.library = [];
    deck.entireDeck = [];
    // Act
    deck.processStartsWithLine(
      ["Copper", "Hovel", "Necropolis", "Overgrown Estate"],
      [7, 1, 1, 1]
    );
    // Assert
    expect(deck.library).toStrictEqual([
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Hovel",
      "Necropolis",
      "Overgrown Estate",
    ]);
    expect(deck.entireDeck).toStrictEqual([
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Hovel",
      "Necropolis",
      "Overgrown Estate",
    ]);
  });
});
