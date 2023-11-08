import { it, describe, expect, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Method checkForShuffle()", () => {
  // Instantiate Deck object.
  let deck = new Deck("", false, "", "pName", "pNick", []);

  afterEach(() => {
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
