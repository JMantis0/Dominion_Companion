import { describe, it, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function incrementTurn", () => {
  it("should increment turn field correctly", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    // Act
    deck.incrementTurn();
    //Assert
    expect(deck.gameTurn).toEqual(1);
  });
});
