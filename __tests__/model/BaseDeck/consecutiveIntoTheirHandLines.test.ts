import { beforeEach, describe, expect, it } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("consecutiveIntoTheirHandLines", () => {
  let bDeck: BaseDeck;
  beforeEach(() => {
    bDeck = new BaseDeck("", false, "", "Player", "P", []);
  });
  it("should return true if the lastEntry processed and the given line are both  'into their hand' lines", () => {
    // Arrange
    bDeck.lastEntryProcessed = "P puts a Copper into their hand.";

    // Act and Assert
    expect(
      bDeck.consecutiveIntoTheirHandLines(
        "P puts a Copper and an Estate into their hand."
      )
    ).toBe(true);
  });
  it("should return false if the lastEntry processed and the given line are both  'into their hand' lines", () => {
    // Arrange
    bDeck.lastEntryProcessed = "P puts a Copper into their hand.";

    // Act and Assert
    expect(bDeck.consecutiveIntoTheirHandLines("P plays a Sentry.")).toBe(
      false
    );

    // Arrange 2
    bDeck.lastEntryProcessed = "P reveals a Copper.";
    // Act and Assert 2
    expect(
      bDeck.consecutiveIntoTheirHandLines("P puts a Copper into their hand.")
    ).toBe(false);
  });
});
