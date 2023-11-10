import { it, describe, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("checkForShuffle", () => {
  // Declare Deck reference.
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should return true when the provided line matches the string ' shuffles their deck'.", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick shuffles their deck.";

    // Act and Assert
    expect(deck.checkForShuffle()).toBeTruthy();
  });

  it("should return false when the provided line does not match ' shuffles their deck'", () => {
    deck.lastEntryProcessed = "pNick draws a Copper.";

    // Act and Assert
    expect(deck.checkForShuffle()).toBeFalsy();
  });
});
