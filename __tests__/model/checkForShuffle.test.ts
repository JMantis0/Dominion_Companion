import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function checkForShuffle()", () => {
  it("should return true when the provided line matches the string ' shuffles their deck'.", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const line = "pNick shuffles their deck.";

    // Act
    const result = deck.checkForShuffle(line);

    // Assert
    expect(result).toBeTruthy();
  });
  it("should return false when the provided line does not match ' shuffles their deck'", () => {
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const line = "pNick draws a Copper.";

    // Act
    const result = deck.checkForShuffle(line);

    // Assert
    expect(result).toBeFalsy();
  });
});
