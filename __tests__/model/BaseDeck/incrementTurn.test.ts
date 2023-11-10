import { describe, it, expect } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("incrementTurn", () => {
  // Instantiate BaseDeck object.
  let deck = new BaseDeck("", false, "", "pName", "pNick", []);

  it("should increment turn field correctly", () => {
    // Arrange
    deck.gameTurn = 49;
    // Act
    deck.incrementTurn();
    //Assert
    expect(deck.gameTurn).toEqual(50);
  });
});
