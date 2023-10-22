import { it, describe, expect, afterEach } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("Function checkPreviousLineProcessedForCurrentCardBuy()", () => {
  let deck = new BaseDeck("", false, "", "pName", "pNick", []);

  afterEach(() => {
    deck = new BaseDeck("", false, "", "pName", "pNick", []);
  });

  it("should return true when the last logArchive line is a buy for the card in the current line", () => {
    // Arrange
    const card: string = "Sentry";
    let lastEntryProcessed: string = "rNick buys a Sentry";
    deck.setLastEntryProcessed(lastEntryProcessed);
    // Act
    const result = deck.checkPreviousLineProcessedForCurrentCardBuy(card);
    // Assert
    expect(result).toBeTruthy();
  });

  it("should return false when the last logArchive line is not a buy for the card in the current line", () => {
    // Arrange
    const card: string = "Joker";
    let lastEntryProcessed: string = "rNick buys a Sentry";
    deck.setLastEntryProcessed(lastEntryProcessed);
    // Act
    const result = deck.checkPreviousLineProcessedForCurrentCardBuy(card);
    // Assert
    expect(result).toBeFalsy();
  });
});
