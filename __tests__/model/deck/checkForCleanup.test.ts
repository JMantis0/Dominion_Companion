import { it, describe, expect, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Method checkForCleanup()", () => {
  // Instantiate Deck object.
  let deck = new Deck("", false, "", "pName", "pNick", []);

  afterEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should return true when a cleanup might be needed", () => {
    // Arrange
    // All 10 lines below have 5 draws.
    const line1 =
      "pNick draws a Sentry, a Copper, an Estate, a Vassal, and a Gold.";
    const line2 = "pNick draws a Sentry, a Copper, an Estate, and 2 Golds.";
    const line3 = "pNick draws a Sentry, a Copper, and 3 Festivals.";
    const line4 = "pNick draws a Sentry and 4 Libraries";
    const line5 = "pNick draws 5 Libraries.";
    const line6 = "pNick draws 4 Libraries and a Sentry.";
    const line7 = "pNick draws 3 Libraries, a Sentry, and an Estate.";
    const line8 = "pNick draws 2 Libraries, a Sentry, an Estate, and a Vassal.";
    const line9 =
      "pNick draws a Copper, a Sentry, an Estate, a Vassal, and a Gold.";
    const line10 = "pNick draws 5 Festivals.";

    // Act and Assert
    expect(deck.checkForCleanUp(line1)).toBe(true);
    expect(deck.checkForCleanUp(line2)).toBe(true);
    expect(deck.checkForCleanUp(line3)).toBe(true);
    expect(deck.checkForCleanUp(line4)).toBe(true);
    expect(deck.checkForCleanUp(line5)).toBe(true);
    expect(deck.checkForCleanUp(line6)).toBe(true);
    expect(deck.checkForCleanUp(line7)).toBe(true);
    expect(deck.checkForCleanUp(line8)).toBe(true);
    expect(deck.checkForCleanUp(line9)).toBe(true);
    expect(deck.checkForCleanUp(line10)).toBe(true);
  });

  it("should return false when a cleanup is not needed", () => {
    //Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const line1 = "rNick draws a Sentry."; // 1 draw
    const line2 = "rNick draws a Sentry and a Vassal."; // 2 draws
    const line3 = "rNick draws a Sentry, a Duchy, and a Vassal."; // 3 draws
    const line4 = "rNick draws a Sentry, a Duchy, a Festival, and a Vassal."; // 4 draws
    const line5 = "rNick draws 5 Witches, and a Vassal."; // 6 draws
    const line6 = "rNick draws 4 Witches, a Sentry, and a Vassal."; // 6 draws
    const line7 = "rNick draws 3 Witches, a Sentry, a Merchant, and a Vassal."; // 6 draws
    const line8 =
      "rNick draws 2 Witches ,a Sentry, a Merchant, a Curse, and a Vassal."; // 6 draws
    const line9 =
      "rNick draws a Duchy, a Cellar, a Merchant, a Curse, a Gold, and a Vassal."; // 6 Draws
    const line10 = "rNick draws a Curse and a Vassal."; // 2 draws

    // Act and Assert
    expect(deck.checkForCleanUp(line1)).toBe(false);
    expect(deck.checkForCleanUp(line2)).toBe(false);
    expect(deck.checkForCleanUp(line3)).toBe(false);
    expect(deck.checkForCleanUp(line4)).toBe(false);
    expect(deck.checkForCleanUp(line5)).toBe(false);
    expect(deck.checkForCleanUp(line6)).toBe(false);
    expect(deck.checkForCleanUp(line7)).toBe(false);
    expect(deck.checkForCleanUp(line8)).toBe(false);
    expect(deck.checkForCleanUp(line9)).toBe(false);
    expect(deck.checkForCleanUp(line10)).toBe(false);
  });

  // Case where entire deck is less than 5 cards.
  it("should work correctly when where are less than 5 cards in the entire deck", () => {
    // Arrange
    deck.entireDeck = ["Copper", "Copper", "Estate"];
    const line1 = "rNick draws 2 Coppers and an Estate"; // Draw count === entireDeck length - cleanUp may be needed.
    const line2 = "rNick draws 2 Coppers"; //  Draw count !== entireDeck length - cleanUp not needed.

    // Act act Assert
    expect(deck.checkForCleanUp(line1)).toBe(true);
    expect(deck.checkForCleanUp(line2)).toBe(false);
  });
});
