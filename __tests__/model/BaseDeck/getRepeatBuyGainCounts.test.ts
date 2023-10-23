import { it, describe, expect, jest } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";
import { afterEach } from "node:test";

describe("Method getRepeatBuyGainCounts()", () => {
  let deck = new BaseDeck("", false, "", "pNick", "pName", []);
  const setLogArchive = jest.spyOn(BaseDeck.prototype, "setLogArchive");
  afterEach(() => {
    deck = new BaseDeck("", false, "", "pNick", "pName", []);
    jest.clearAllMocks();
  });
  it("should return the difference between the amount of the card that is bought in the provided line, and the amount that is bought in the most recent logArchive entry, and remove the last member of the logArchive", () => {
    // Arrange
    deck.logArchive = [
      "pNick plays 2 Golds. (+$6)",
      "pNick buys and gains 2 Golds.",
    ];
    deck.lastEntryProcessed = "pNick buys and gains 2 Golds.";
    const line = "pNick buys and gains 3 Golds.";
    const expectedDifference = 1;
    const expectedLogArchive = ["pNick plays 2 Golds. (+$6)"];
    // Act
    const resultDifference = deck.getRepeatBuyGainCounts(line, deck.logArchive);
    const resultLogArchive = deck.getLogArchive();
    // Assert
    expect(resultDifference).toEqual(expectedDifference);
    expect(resultLogArchive).toStrictEqual(expectedLogArchive);
    expect(setLogArchive).toBeCalledTimes(1);
    expect(setLogArchive).toBeCalledWith(expectedLogArchive);
  });

  it("should work even if the difference is greater than 1", () => {
    deck.logArchive = [
      "pNick plays 8 Golds. (+$24)",
      "pNick buys and gains an Artisan.",
    ];
    // Arrange
    deck.lastEntryProcessed = "pNick buys and gains an Artisan.";
    const line = "pNick buys and gains 4 Artisans.";
    const expectedDifference = 3;
    const expectedLogArchive = ["pNick plays 8 Golds. (+$24)"];

    // Act
    const resultDifference = deck.getRepeatBuyGainCounts(line, deck.logArchive);
    const resultLogArchive = deck.getLogArchive();

    // Assert
    expect(resultDifference).toEqual(expectedDifference);
    expect(resultLogArchive).toStrictEqual(expectedLogArchive);
    expect(setLogArchive).toBeCalledTimes(1);
    expect(setLogArchive).toBeCalledWith(expectedLogArchive);
  });

  it("should throw an error when the logArchive is empty", () => {
    // Arrange
    deck.logArchive = [];
    const line = "Game #132083560, unrated.";

    // Act and Assert
    expect(() =>
      deck.getRepeatBuyGainCounts(line, deck.logArchive)
    ).toThrowError("Empty logArchive.");
  });
});
