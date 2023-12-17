import { beforeEach, describe, expect, it } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("consecutiveDiscards", () => {
  let deck: BaseDeck;
  beforeEach(() => {
    deck = new BaseDeck("", false, "", "Player", "P", []);
  });
  it("should return true when the given line and last entry processed are both discards lines", () => {
    // Arrange
    deck.logArchive = [
      "P starts their turn.",
      "P puts an Estate in hand (Archive).",
      "P discards a Copper and an Estate. (Tide Pools)",
    ];
    deck.lastEntryProcessed = "P discards a Copper and an Estate. (Tide Pools)";
    const line = "P discards 2 Coppers and 2 Estates. (Tide Pools)";

    // Act and Assert
    expect(deck.consecutiveDiscards(line)).toBe(true);
  });
  it("should return true when the given line and last entry processed are not both discards lines", () => {
    // Arrange
    deck.logArchive = [
      "P starts their turn.",
      "P puts an Estate in hand (Archive).",
      "P discards a Copper and an Estate. (Tide Pools)",
    ];
    deck.lastEntryProcessed = "P discards a Copper and an Estate. (Tide Pools)";
    const line = "P shuffles their deck.";

    // Act and Assert
    expect(deck.consecutiveDiscards(line)).toBe(false);
  });
});
