import { describe, it, expect } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("Function incrementTurn", () => {
  it("should increment turn field correctly", () => {
    // Arrange
    const deck = new BaseDeck("", false, "", "pName", "pNick", []);
    // Act
    deck.incrementTurn();
    //Assert
    expect(deck.gameTurn).toEqual(1);
  });
});
