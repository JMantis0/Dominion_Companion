import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("consecutiveGainWithoutBuy", () => {
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "Player", "P", []);
  });
  it("should return true if the lastEntryProcessed and the given line are both gain without buy lines", () => {
    // Arrange
    deck.lastEntryProcessed = "P gains a Gold";
    // Act and Assert
    expect(deck.consecutiveGainWithoutBuy("P gains 4 Golds.")).toBe(true);
  });

  it("should return false if the lastEntryProcessed and the given line are not both gain without buy lines", () => {
    // Arrange
    deck.lastEntryProcessed = "P gains a Gold";
    // Act and Assert
    expect(deck.consecutiveGainWithoutBuy("P buys and gains a Gold.")).toBe(
      false
    );
    // Arrange 2
    deck.lastEntryProcessed = "P buys and gains a Gold";
    // Act and Assert
    expect(deck.consecutiveGainWithoutBuy("P gains a Gold.")).toBe(false);
  });
});
