import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function ifCleanUpNeeded()", () => {
  it("should return true if a cleanup is needed based on the provided line", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive: string[] = [
      "pNick plays a Laboratory.",
      "pNick draws a Market and a Moneylender.",
      "pNick gets +1 Action.",
      "pNick plays a Market.",
      "pNick draws an Estate.",
      "pNick gets +1 Action.",
      "pNick gets +1 Buy.",
      "pNick gets +$1.",
      "pNick plays a Moneylender.",
      "pNick trashes a Copper.",
      "pNick gets +$3.",
      "pNick plays a Copper and a Silver. (+$3)",
      "pNick buys and gains a Sentry.",
      "pNick buys and gains a Cellar.",
      "pNick shuffles their deck.",
    ];
    const line = "pNick draws a Silver, 2 Estates, a Laboratory, and a Market.";
    deck.setLogArchive(logArchive);
    // Act

    // Assert
    const result = deck.ifCleanUpNeeded(line);
    expect(result).toBe(true);
  });
  it("should return false if a cleanup is not needed based on the provided line", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive: string[] = [
      "pNick plays a Throne Room.",
      "pNick plays a Laboratory.",
      "pNick draws a Moneylender and a Sentry.",
      "pNick gets +1 Action.",
      "pNick plays a Laboratory again.",
      "pNick draws an Estate and a Cellar.",
      "pNick gets +1 Action.",
      "pNick plays a Cellar.",
      "pNick gets +1 Action.",
      "pNick discards a Silver, an Estate, a Moneylender, a Sentry, and a Vassal.", //  5 draws caused by Cellar, cleanup is not needed.
    ];
    const line = "pNick draws a Silver, 2 Estates, a Laboratory, and a Market.";
    deck.setLogArchive(logArchive);
    // Act

    // Assert
    const result = deck.ifCleanUpNeeded(line);
    expect(result).toBe(false);
  });
});
