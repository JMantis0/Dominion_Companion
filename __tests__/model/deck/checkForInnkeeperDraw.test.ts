import { it, describe, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("checkForInnkeeperDraw", () => {
  // Declare Deck reference.
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  // Case1 - No shuffle needed because sufficient cards amount in library.
  it("should return true if the draws on the current line were caused by an Innkeeper with no shuffle in between the draws and the Innkeeper play", () => {
    //Arrange
    deck.logArchive = [
      "pNick plays an Innkeeper.", // Draws caused by this Innkeeper.
      "pNick gets +1 Action.",
    ];

    // Act and Assert
    expect(deck.checkForInnkeeperDraw()).toBe(true);
  });

  // Case2 - shuffle occurred before draws take place due to low library count.
  it("should return true if the draws on the current line were cause by an Innkeeper with a shuffle in between the draws and the Innkeeper play", () => {
    // Arrange
    deck.logArchive = [
      "pNick plays an Innkeeper.", // Draws caused by this Innkeeper, with a shuffle between.
      "pNick gets +1 Action.",
      "pNick shuffles their deck.",
    ];

    // Act and Assert
    expect(deck.checkForInnkeeperDraw()).toBe(true);
  });

  // Case 3 - Draws not caused by Innkeeper.
  it("should return false if draws on the current line were not caused by an Innkeeper", () => {
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
    expect(deck.checkForInnkeeperDraw()).toBe(false);
  });
});
