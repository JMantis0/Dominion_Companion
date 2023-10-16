import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function handleRepeatBuyGain()", () => {
  it("should return the difference between the amount of the card that is bought in the provided line, and the amoutn that is bought in the most recent logArchive entry", () => {
    // Arrange
    const deck = new Deck("", false, "", "pNick", "pName", []);
    const logArchive = ["pNick buys and gains a Gold."];
    deck.setLogArchive(logArchive);
    const line = "pNick buys and gains 2 Golds.";

    // Act
    const result = deck.handleRepeatBuyGain(line);
    const expectedResult = 1;
    // Assert
    expect(result).toEqual(expectedResult);
  });
  it("should work even if the difference is greater than 1", () => {
    // Arrange
    const deck = new Deck("", false, "", "pNick", "pName", []);
    const logArchive = ["pNick buys and gains a Gold."];
    deck.setLogArchive(logArchive);
    const line = "pNick buys and gains 45 Golds.";

    // Act
    const result = deck.handleRepeatBuyGain(line);
    const expectedResult = 44;
    // Assert
    expect(result).toEqual(expectedResult);
  });
});
