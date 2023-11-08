import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";
describe("cleanup", () => {
  // Instantiate Deck object
  const deck = new Deck("", false, "", "pName", "pNick", []);

  it("should remove all members from the hand and inPlay field arrays, and add them to the graveyard field array", () => {
    // Arrange
    deck.graveyard = ["Copper"];
    deck.inPlay = ["Copper", "Laboratory", "Bandit"];
    deck.hand = ["Estate", "Duchy", "Remodel"];
    // Act
    deck.cleanup();
    // Assert
    expect(deck.graveyard).toStrictEqual([
      "Copper",
      "Bandit",
      "Laboratory",
      "Copper",
      "Remodel",
      "Duchy",
      "Estate",
    ]);
    expect(deck.hand).toStrictEqual([]);
    expect(deck.inPlay).toStrictEqual([]);
  });
});
