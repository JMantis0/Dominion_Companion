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
});
