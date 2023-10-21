import { describe, it, expect } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("Function checkForBuyAndGain", () => {
  it("should return true if the provide line contains the substring ' buys and gains ' and a match for the provided card", () => {
    // Arrange
    const deck = new BaseDeck("", false, "", "pName", "pNick", []);
    const card = "Sentry";
    const line = "oNick buys and gains 2 Sentries"; //  Matches card and ' buys and gains '

    // Act
    const result = deck.checkForBuyAndGain(line, card);

    // Assert
    expect(result).toBeTruthy();
  });

  it("should return false if the provide line does not contain the substring 'buys and gains' or does not contain a match for the provided card", () => {
    // Arrange
    const deck = new BaseDeck("", false, "", "pName", "pNick", []);
    const card = "Sentry";
    const line1 = "oNick buys and gains 2 Coppers"; //  Does not match card
    const line2 = "oNick plays a Sentry"; // Does not have 'buys and gains'
    const line3 = "oNick gets +$2."; // Does not match either

    // Act
    const result1 = deck.checkForBuyAndGain(line1, card);
    const result2 = deck.checkForBuyAndGain(line2, card);
    const result3 = deck.checkForBuyAndGain(line3, card);

    // Assert
    expect(result1).toBeFalsy();
    expect(result2).toBeFalsy();
    expect(result3).toBeFalsy();
  });
});
