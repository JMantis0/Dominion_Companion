import { it, describe, expect, beforeEach } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("checkForTreasurePlayLine", () => {
  let deck: BaseDeck;

  beforeEach(() => {
    deck = new BaseDeck("", false, "", "pName", "pNick", []);
  });

  it("should return true when the provided line plays one or more treasures", () => {
    // Arrange
    const line = "rNick plays 2 Coppers.";
    // Act
    const result = deck.checkForTreasurePlayLine(line);
    // Assert
    expect(result).toBe(true);
  });

  it("should return false when the provided line plays no treasures", () => {
    // Arrange
    const line = "rNick buys a Gold.";
    // Act
    const result = deck.checkForTreasurePlayLine(line);
    // Assert
    expect(result).toBe(false);
  });
});
