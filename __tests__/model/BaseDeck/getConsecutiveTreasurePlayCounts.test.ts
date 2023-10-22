import { it, describe, expect } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("Function getConsecutiveTreasurePlayCounts()", () => {
  it("should return an array with the correct number of Coppers to play", () => {
    // Arrange
    const deck = new BaseDeck("", false, "", "pNick", "pName", []);
    const lastEntryProcessed = "pNick plays a Coppers and 2 Silvers. (+$2)";
    deck.setLastEntryProcessed(lastEntryProcessed);
    const line = "pNick plays 2 Coppers and 2 Silvers. (+$4)";

    // Act
    const result = deck.getConsecutiveTreasurePlayCounts(line);
    const expectedResult = [1, 0, 0];

    // Assert
    expect(result).toStrictEqual(expectedResult);
  });

  it("should return an array with the correct number of Silvers to play", () => {
    // Arrange
    const deck = new BaseDeck("", false, "", "pNick", "pName", []);
    const lastEntryProcessed = "pNick plays 2 Coppers. (+$2)";
    deck.setLastEntryProcessed(lastEntryProcessed);
    const line = "pNick plays 2 Coppers and a Silver. (+$4)";

    // Act
    const result = deck.getConsecutiveTreasurePlayCounts(line);
    const expectedResult = [0, 1, 0];

    // Assert
    expect(result).toStrictEqual(expectedResult);
  });

  it("should return an array with the correct number of Golds to play", () => {
    // Arrange
    const deck = new BaseDeck("", false, "", "pNick", "pName", []);
    const lastEntryProcessed = "pNick plays 2 Coppers. (+$2)";
    deck.setLastEntryProcessed(lastEntryProcessed);
    const line = "pNick plays 2 Coppers and a Gold. (+$4)";

    // Act
    const result = deck.getConsecutiveTreasurePlayCounts(line);
    const expectedResult = [0, 0, 1];

    // Assert
    expect(result).toStrictEqual(expectedResult);
  });

  it("should return an array with the correct number of each treasure to play even if there are multiple treasures that have differences greater than 1", () => {
    // Arrange
    const deck = new BaseDeck("", false, "", "pNick", "pName", []);
    const lastEntryProcessed = "pNick plays 2 Coppers. (+$2)";
    deck.setLastEntryProcessed(lastEntryProcessed);
    const line = "pNick plays 5 Coppers, 3 Silvers, and 2 Golds. (+$4)";

    // Act
    const result = deck.getConsecutiveTreasurePlayCounts(line);
    const expectedResult = [3, 3, 2];

    // Assert
    expect(result).toStrictEqual(expectedResult);
  });
});
