import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("isMineGain", () => {
  // Instantiate Deck object.
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should return true if the most recent entry processed was a trash and the line before that was a Mine play", () => {
    // Arrange
    deck.logArchive = [
      "Turn 7 - pName",
      "pNick plays a Mine.",
      "pNick trashes a Copper.",
    ];
    deck.lastEntryProcessed = "pNick trashes a Copper.";

    // Act - simulate gaining a Silver with a Mine.
    const mineGain = deck.isMineGain();

    // Assert
    expect(mineGain).toBe(true);
  });

  it("should return false if the most recent entry processed is not a trash and if line before that was not a Mine play", () => {
    // Arrange
    deck.logArchive = [
      "Turn 5 - pName",
      "pNick plays a Mine.",
      "pNick plays 2 Coppers. (+$2)",
    ];
    deck.lastEntryProcessed = "pNick plays 2 Coppers. (+2)";

    // Act - simulate checking to see if the current line is a Mine gain.
    const mineGain = deck.isMineGain();

    // Assert
    expect(mineGain).toBe(false);
  });
});
