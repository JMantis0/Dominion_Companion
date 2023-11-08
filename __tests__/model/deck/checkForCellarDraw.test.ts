import { it, describe, expect, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Method checkForCellarDraw()", () => {
  // Instantiate Deck object.
  let deck = new Deck("", false, "", "pName", "pNick", []);

  afterEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  // Case1 - No shuffle needed because sufficient cards amount in library.
  it("should return true if the draws on the current line were caused by a Cellar with no shuffle in between the draws and the Cellar play", () => {
    //Arrange
    deck.logArchive = [
      "pNick plays a Cellar.", // Draws caused by this Cellar.
      "pNick gets +1 Action.",
      "pNick discards a Copper, a Silver, an Estate, and a Laboratory.",
    ];

    // Act and Assert
    expect(deck.checkForCellarDraw()).toBe(true);
  });

  // Case2 - shuffle occurred before draws take place due to low library count.
  it("should return true if the draws on the current line were cause by a Cellar with a shuffle in between the draws and the Cellar play", () => {
    // Arrange
    deck.logArchive = [
      "pNick plays a Cellar.", // Draws caused by this Cellar, with a shuffle between.
      "pNick gets +1 Action.",
      "pNick discards 3 Coppers, an Estate, and a Cellar.",
      "pNick shuffles their deck.",
    ];

    // Act and Assert
    expect(deck.checkForCellarDraw()).toBe(true);
  });

  // Case 3 - Draws not caused by Cellar.
  it("should return false if draws on the current line were not caused by a cellar", () => {
    // Arrange
    deck.logArchive = [
      "Turn 9 - oName",
      "oNick plays a Silver, a Gold, and 2 Coppers. (+$7)",
      "oNick buys and gains a Gold.",
      "oNick draws 5 cards.",
      "Turn 10 - pName",
      "pNick plays a Laboratory.", // Draws caused by Laboratory.
    ];

    // Act and Assert
    expect(deck.checkForCellarDraw()).toBe(false);
  });
});
