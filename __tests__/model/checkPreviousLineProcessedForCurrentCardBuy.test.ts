import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function checkPreviousLineProcessedForCurrentCardBuy()", () => {
  it("should return true when the last logArchive line is a buy for the card in the current line", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const card: string = "Sentry";
    let logArchive: string[] = ["rNick buys a Sentry"];
    deck.setLogArchive(logArchive);
    // Act
    const result = deck.checkPreviousLineProcessedForCurrentCardBuy(card);
    // Assert
    expect(result).toBeTruthy();
  });

  it("should return false when the last logArchive line is not a buy for the card in the current line", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const card: string = "Joke";
    let logArchive: string[] = ["rNick buys a Sentry"];
    deck.setLogArchive(logArchive);
    // Act
    const result = deck.checkPreviousLineProcessedForCurrentCardBuy(card);
    // Assert
    expect(result).toBeFalsy();
  });
});
