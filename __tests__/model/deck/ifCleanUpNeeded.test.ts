import { it, describe, expect, afterEach, jest } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Method ifCleanUpNeeded()", () => {
  // Instantiate Deck object.
  let deck = new Deck("", false, "", "pName", "pNick", []);
  // Spy on method dependencies
  const checkForCleanUp = jest.spyOn(Deck.prototype, "checkForCleanUp");
  const checkForCellarDraw = jest.spyOn(Deck.prototype, "checkForCellarDraw");

  afterEach(() => {
    jest.clearAllMocks();
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should return true if a cleanup is needed based on the provided line", () => {
    // Arrange
    deck.logArchive = [
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

    // Act and Assert
    expect(deck.ifCleanUpNeeded(line)).toBe(true);
    expect(checkForCleanUp).toBeCalledTimes(1);
    expect(checkForCleanUp).toBeCalledWith(line);
    expect(checkForCellarDraw).toBeCalledTimes(1);
  });

  it("should return false if a cleanup is not needed based on the provided line", () => {
    // Arrange
    deck.logArchive = [
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

    // Act and Assert
    expect(deck.ifCleanUpNeeded(line)).toBe(false);
    expect(checkForCleanUp).toBeCalledTimes(1);
    expect(checkForCleanUp).toBeCalledWith(line);
    expect(checkForCellarDraw).toBeCalledTimes(1);
  });
});
