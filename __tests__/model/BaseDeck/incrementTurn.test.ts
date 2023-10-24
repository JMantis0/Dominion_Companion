import { describe, it, expect, jest } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("Method incrementTurn", () => {
  // Instantiate BaseDeck object.
  let deck = new BaseDeck("", false, "", "pName", "pNick", []);
  // Spy on function dependency.
  const setGameTurn = jest.spyOn(BaseDeck.prototype, "setGameTurn");

  it("should increment turn field correctly", () => {
    // Arrange
    deck.gameTurn = 49;
    // Act
    deck.incrementTurn();
    //Assert
    expect(deck.gameTurn).toEqual(50);
    expect(setGameTurn).toBeCalledTimes(1);
    expect(setGameTurn).toBeCalledWith(50);
  });
});
