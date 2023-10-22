import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function checkForCellarDraw()", () => {
  it("should return true if the draws on the current line were caused by a cellar", () => {
    //Arrange
    const deck1 = new Deck("", false, "", "pName", "pNick", []);
    const deck2 = new Deck("", false, "", "pName", "pNick", []);
    // Case1 - shuffle occurred before draws take place due to low library count.
    const logArchive1 = [
      "pNick plays a Cellar.",
      "pNick gets +1 Action.",
      "pNick discards 3 Coppers, an Estate, and a Cellar.",
      "pNick shuffles their deck.",
    ];
    // Case2 - no shuffle needed because sufficient cards amount in library.
    const logArchive2 = [
      "pNick plays a Cellar.",
      "pNick gets +1 Action.",
      "pNick discards a Copper, a Silver, an Estate, and a Laboratory.",
    ];
    deck1.setLogArchive(logArchive1);
    deck2.setLogArchive(logArchive2);

    // Act
    const result1 = deck1.checkForCellarDraw();
    const result2 = deck2.checkForCellarDraw();

    // Assert
    expect(result1).toBeTruthy();
    expect(result2).toBeTruthy();
  });

  it("should return false if draws on the current line were not caused by a cellar", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive = [
      "Turn 9 - oName",
      "oNick plays a Silver, a Gold, and 2 Coppers. (+$7)",
      "oNick buys and gains a Gold.",
      "oNick draws 5 cards.",
      "Turn 10 - pName",
      "pNick plays a Laboratory.",
    ];
    deck.setLogArchive(logArchive);

    // Act
    const result = deck.checkForCellarDraw();
    // Assert
    expect(result).toBeFalsy();
  });
});
