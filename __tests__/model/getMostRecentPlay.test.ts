import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function getMostRecentPlay()", () => {
  it("should return the card that was most recently played in the logArchive", () => {
    // Arrange
    const deck = new Deck("", false, "", "pNick", "pName", []);
    const logArchive = [
      "pNick plays a Village.",
      "pNick draws a Smithy.",
      "pNick gets +2 Actions.",
      "pNick plays a Village.",
      "pNick draws a Silver.",
      "pNick gets +2 Actions.",
      "pNick plays a Smithy.",
      "pNick draws a Silver, a Cellar, and a Sentry.",
      "pNick plays a Sentry.",
      "pNick gets +1 Action.",
      "pNick plays a Cellar.", //  Most recent play is a Cellar.
      "pNick gets +1 Action.",
      "pNick discards 2 Estates.",
    ];

    // Act
    const result = deck.getMostRecentPlay(logArchive);
    const expectedResult = "Cellar";

    // Assert
    expect(result).toBe(expectedResult);
  });

  it("should not return treasure plays", () => {
    // Arrange
    const deck = new Deck("", false, "", "pNick", "pName", []);
    const logArchive = [
      "pNick plays a Village.",
      "pNick draws a Smithy.",
      "pNick gets +2 Actions.",
      "pNick plays a Village.",
      "pNick draws a Silver.",
      "pNick gets +2 Actions.",
      "pNick plays a Smithy.",
      "pNick draws a Silver, a Cellar, and a Sentry.",
      "pNick plays a Sentry.",
      "pNick gets +1 Action.",
      "pNick plays a Cellar.", //  Most recent play is a Cellar.
      "pNick gets +1 Action.",
      "pNick discards 2 Estates.",
      "pNick plays a Silver. (+$2)", //  Should not return "Silver"
    ];

    // Act
    const result = deck.getMostRecentPlay(logArchive);
    const expectedResult = "Cellar";

    // Assert
    expect(result).toBe(expectedResult);
  });

  it("should return the card correctly for cards played by Throne Room", () => {
    // Arrange
    const deck = new Deck("", false, "", "pNick", "pName", []);
    const logArchive = [
      "pNick plays a Sentry again.", // Cards played by Throne Room will end with 'again.' and require proper parsing.
      "pNick draws a Vassal.",
      "pNick gets +1 Action.",
      "pNick shuffles their deck.",
      "pNick looks at 2 Sentries.",
    ];

    // Act
    const result = deck.getMostRecentPlay(logArchive);
    const expectedResult = "Sentry";

    // Assert
    expect(result).toBe(expectedResult);
  });

  it("should work correctly for cards that start with a vowel preceded by the article 'an'", () => {
    // Arrange
    const deck = new Deck("", false, "", "pNick", "pName", []);
    const logArchive = [
      "pNick plays an Artisan.",
      "pNick gains a Market.",
      "pNick topdecks a Market.",
    ];

    // Act
    const result = deck.getMostRecentPlay(logArchive);
    const expectedResult = "Artisan";

    // Assert
    expect(result).toBe(expectedResult);
  });

  it("should return 'None' if no play is found in the logArchive", () => {
    // Arrange
    const deck = new Deck("", false, "", "pNick", "pName", []);
    const logArchive = [
      "Game #123456789, unrated.",
      "Card Pool: level 1",
      "pNick starts with 7 Coppers.",
      "pNick starts with 3 Estates.",
      "oNick starts with 7 Coppers.",
      "oNick starts with 3 Estates.",
      "pNick shuffles their deck.",
      "oNick shuffles their deck.",
      "pNick draws 4 Coppers and an Estate.",
      "oNick draws 5 cards.",
      "Turn 1 - pName",
    ];

    // Act
    const result = deck.getMostRecentPlay(logArchive);
    const expectedResult = "None";

    // Assert
    expect(result).toBe(expectedResult);
  });

  it("should throw an error if the logArchive is empty", () => {
    // Arrange
    const deck = new Deck("", false, "", "pNick", "pName", []);
    const logArchive: string[] = [];

    // Act and Assert
    expect(() => deck.getMostRecentPlay(logArchive)).toThrowError(
      "Empty logArchive."
    );
  });
});
