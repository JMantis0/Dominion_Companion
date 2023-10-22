import { it, describe, expect } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("Function handleRepeatBuyGain()", () => {

  it("should return the difference between the amount of the card that is bought in the provided line, and the amount that is bought in the most recent logArchive entry, and remove the last member of the logArchive", () => {
    // Arrange
    const deck = new BaseDeck("", false, "", "pNick", "pName", []);
    const logArchive = [
      "pNick plays 2 Golds. (+$6)",
      "pNick buys and gains 2 Golds.",
    ];
    deck.setLogArchive(logArchive);
    const line = "pNick buys and gains 3 Golds.";
    const expectedDifference = 1;
    const expectedLogArchive = ["pNick plays 2 Golds. (+$6)"];
    // Act
    const resultDifference = deck.handleRepeatBuyGain(line, logArchive);
    const resultLogArchive = deck.getLogArchive();
    // Assert
    expect(resultDifference).toEqual(expectedDifference);
    expect(resultLogArchive).toStrictEqual(expectedLogArchive);
  });

  it("should work even if the difference is greater than 1", () => {
    // Arrange
    const deck = new BaseDeck("", false, "", "pNick", "pName", []);
    const logArchive = [
      "pNick plays 8 Golds. (+$24)",
      "pNick buys and gains an Artisan.",
    ];
    deck.setLogArchive(logArchive);
    const line = "pNick buys and gains 4 Artisans.";
    const expectedDifference = 3;
    const expectedLogArchive = ["pNick plays 8 Golds. (+$24)"];

    // Act
    const resultDifference = deck.handleRepeatBuyGain(line, logArchive);
    const resultLogArchive = deck.getLogArchive();

    // Assert
    expect(resultDifference).toEqual(expectedDifference);
    expect(resultLogArchive).toStrictEqual(expectedLogArchive);
  });

  it("should throw an error when the logArchive is empty", () => {
    // Arrange
    const deck = new BaseDeck("", false, "", "pNick", "pName", []);
    const logArchive: string[] = [];
    const line = "Game #132083560, unrated.";

    // Act and Assert
    expect(() => deck.handleRepeatBuyGain(line, logArchive)).toThrowError(
      "Empty logArchive."
    );
  });
});
