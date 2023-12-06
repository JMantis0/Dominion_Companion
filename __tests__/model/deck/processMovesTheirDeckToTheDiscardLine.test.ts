import { beforeEach, describe, it, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("processMovesTheirDeckToTheDiscardLine", () => {
  let deck: Deck;
  beforeEach(() => {
    deck = new Deck("", false, "", "Player", "P", []);
  });
  it("should move all of the cards in the player's library into the graveyard", () => {
    // Arrange
    deck.library = ["Copper", "Estate", "Colony", "Platinum", "Platinum"];
    deck.graveyard = ["Bureaucrat"];

    // Act
    deck.processMovesTheirDeckToTheDiscardLine();

    // Assert
    expect(deck.library).toStrictEqual([]);
    expect(deck.graveyard).toStrictEqual([
      "Bureaucrat",
      "Copper",
      "Estate",
      "Colony",
      "Platinum",
      "Platinum",
    ]);
  });
});
