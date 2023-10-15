import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function checkForTurnLine()", () => {
  it("should return true if the provided line is a 'turn line' for deck's playerName ", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const line = "Turn 11 - pName";

    // Act
    const result = deck.checkForTurnLine(line);

    // Assert
    expect(result).toEqual(true);
  });

  it("should return false if the provided line is a 'turn line' for the deck's playerName ", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const line1 = "Between Turns";
    const line2 = "Turn 11 - OpponentName";

    // Act
    const result1 = deck.checkForTurnLine(line1);
    const result2 = deck.checkForTurnLine(line2);

    // Assert
    expect(result1).toEqual(false);
    expect(result2).toEqual(false);
  });
});
