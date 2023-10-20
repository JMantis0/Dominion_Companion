import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function checkForSentryDiscard()", () => {
  it("should return true if the most recent play in the logArchive is a Sentry", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive = [
      "pNick plays a Sentry.", // Most recent play is Sentry
      "pNick draws a Poacher.",
      "pNick gets +1 Action.",
      "pNick looks at an Estate and a Poacher.",
    ];
    deck.setLogArchive(logArchive);
    // Act
    const result = deck.checkForSentryDiscard();
    // Assert
    expect(result).toBeTruthy();
  });
  it("should return false if the most recent play in the logArchive is a Sentry", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive = [
      "pNick plays a Sentry.",
      "pNick draws an Estate.",
      "pNick gets +1 Action.",
      "pNick looks at 2 Cellars.",
      "pNick trashes a Cellar.",
      "pNick topdecks a Cellar.",
      "pNick plays a Cellar.", // Most recent play is Cellar
      "pNick gets +1 Action.",
      "pNick discards a Copper and a Silver.",
      "pNick draws a Copper and a Cellar.",
    ];
    deck.setLogArchive(logArchive);
    // Act
    const result = deck.checkForSentryDiscard();
    // Assert
    expect(result).toBeFalsy();
  });
});
