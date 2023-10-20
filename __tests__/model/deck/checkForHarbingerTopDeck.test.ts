import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function checkForHarbingerTopDeck()", () => {
  it("should return true when the most recent play in the logArchive is a Harbinger", () => {
    // Arrange
    const deck1 = new Deck("", false, "", "pName", "pNick", []);
    const deck2 = new Deck("", false, "", "pName", "pNick", []);
    const logArchive1 = [
      "pNick plays a Harbinger.",
      "pNick draws a Copper.",
      "pNick gets +1 Action.",
      "pNick looks at 4 Coppers, a Silver, an Estate, and a Merchant.",
    ];
    // Case with a shuffle occurring just before drawing with a Harbinger
    const logArchive2 = [
      "pNick plays a Harbinger.",
      "pNick shuffles their deck.",
      "pNick draws a Copper.",
      "pNick gets +1 Action.",
      "pNick looks at 4 Coppers, a Silver, an Estate, and a Merchant.",
    ];
    deck1.setLogArchive(logArchive1);
    deck2.setLogArchive(logArchive2);
    const result1 = deck1.checkForHarbingerTopDeck();
    const result2 = deck2.checkForHarbingerTopDeck();
    expect(result1).toBeTruthy();
    expect(result2).toBeTruthy();
  });
  it("should return false when the most recent play is not a Harbinger", () => {
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive = [
      "pNick plays a Sentry.",
      "pNick draws an Estate.",
      "pNick gets +1 Action.",
      "pNick looks at 2 Cellars.",
      "pNick trashes a Cellar.",
    ];
    deck.setLogArchive(logArchive);
    const result = deck.checkForHarbingerTopDeck();
    expect(result).toBeFalsy();
  });
});
