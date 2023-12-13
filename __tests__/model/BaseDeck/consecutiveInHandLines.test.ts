import { beforeEach, describe, expect, it } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("consecutiveInHandLines", () => {
  let bDeck: BaseDeck;
  beforeEach(() => {
    bDeck = new BaseDeck("", false, "", "Player", "P", []);
  });
  it("should return true if the lastEntry processed and the given line are both 'in hand' lines", () => {
    // Arrange
    bDeck.lastEntryProcessed = "P puts a Copper in hand (Haven).";

    // Act and Assert
    expect(
      bDeck.consecutiveInHandLines(
        "P puts a Copper and an Estate in hand (Haven)."
      )
    ).toBe(true);
  });
  it("should return false if the lastEntry processed and the given line are not both 'in hand' lines", () => {
    // Arrange
    bDeck.lastEntryProcessed = "P puts a Copper in hand.";

    // Act and Assert
    expect(bDeck.consecutiveInHandLines("P starts their turn.")).toBe(false);

    // Arrange 2
    bDeck.lastEntryProcessed = "P reveals a Copper.";
    // Act and Assert 2
    expect(
      bDeck.consecutiveInHandLines("P puts a Copper into hand (Haven).")
    ).toBe(false);
  });
});
