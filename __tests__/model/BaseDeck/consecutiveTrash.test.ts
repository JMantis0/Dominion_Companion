import { beforeEach, describe, expect, it } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("consecutiveTrash", () => {
  let deck: BaseDeck;
  beforeEach(() => {
    deck = new BaseDeck("", false, "", "Player", "P", []);
  });
  it("should return true if the given line and the lastEntryProcessed are both trash lines", () => {
    // Arrange
    deck.lastEntryProcessed = "P trashes a Copper.";
    // Act and Assert
    expect(deck.consecutiveTrash("P trashes 2 Coppers")).toBe(true);
    expect(deck.consecutiveTrash("P trashes a Copper and a Sentry")).toBe(true);
  });

  it("should return false if the given line and the lastEntryProcessed are not both trash lines", () => {
    // Arrange
    deck.lastEntryProcessed = "P trashes a Copper.";
    // Act and Assert
    expect(deck.consecutiveTrash("P plays a Sentry.")).toBe(false);

    // Arrange 2
    deck.lastEntryProcessed = "P looks at 2 Coppers.";
    // Act and assert 2
    expect(deck.consecutiveTrash("P trashes 2 Coppers")).toBe(false);
  });

  it("should return false if the latestAction is a Treasure Map", () => {
    // Arrange
    deck.lastEntryProcessed = "P trashes a Treasure Map";
    deck.latestAction = "Treasure Map";

    // Act and Assert
    expect(deck.consecutiveTrash("P trashes a Treasure Map")).toBe(false);
  });
});
