import { it, describe, expect } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("Function checkForTreasurePlayLine()", () => {
  it("should return true when the provided line plays one or more treasures", () => {
    // Arrange
    const deck = new BaseDeck("", false, "", "pName", "pNick", []);
    const line = "rNick plays 2 Coppers.";
    // Act
    const result = deck.checkForTreasurePlayLine(line);
    expect(result).toBe(true);
  });
  it("should return false when the provided line plays no treasures", () => {
    // Arrange
    const deck = new BaseDeck("", false, "", "pName", "pNick", []);
    const line = "rNick buys a Gold";
    // Act
    const result = deck.checkForTreasurePlayLine(line);
    expect(result).toBe(false);
  });
});
