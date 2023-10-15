import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function checkForSentryTrash()", () => {
  it("should return true if the most recent play in the logArchive is a Sentry", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive = [
      "pNick plays a Laboratory.",
      "pNick shuffles their deck.",
      "pNick draws 2 Silvers.",
      "pNick gets +1 Action.",
      "pNick plays a Sentry.", // Most recent play is Sentry
      "pNick draws an Estate.",
      "pNick gets +1 Action.",
      "pNick looks at 2 Cellars.",
    ];
    deck.setLogArchive(logArchive);
    // Act
    const result = deck.checkForSentryTrash();
    // Assert
    expect(result).toBeTruthy();
  });
  it("should return false if the most recent play in the logArchive is a Sentry", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive = [
      "pNick plays a Merchant.", 
      "pNick draws an Estate.",
      "pNick gets +1 Action.",
      "pNick plays a Chapel.",
    ];
    deck.setLogArchive(logArchive);
    // Act
    const result = deck.checkForSentryTrash();
    // Assert
    expect(result).toBeFalsy();
  });
});
