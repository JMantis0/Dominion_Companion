import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function checkForTreasurePlayLine()", () => {
  it("should return true when the provided line plays one or more treasures", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const line = "rNick plays 2 Coppers.";
    // Act
    const result = deck.checkForTreasurePlayLine(line);
    expect(result).toBe(true);
  });
  it("should return false when the provided line plays no treasures", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const line = "rNick buys a Gold";
    // Act
    const result = deck.checkForTreasurePlayLine(line);
    expect(result).toBe(false);
  });
});
