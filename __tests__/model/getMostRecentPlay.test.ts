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

  it("should work correctly for cards played by Throne Room", () => {
    // Arrange
    const deck = new Deck("", false, "", "pNick", "pName", []);
    const logArchive = [
      "pNick plays a Sentry again.",  // Cards played by Throne Room will end with 'again.' and require proper parsing.
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
});
