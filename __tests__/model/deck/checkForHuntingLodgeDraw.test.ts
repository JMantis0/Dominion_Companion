import { it, describe, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("checkForHuntingLodgeDraw", () => {
  // Declare Deck reference.
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  // Case1 - No shuffle needed because sufficient cards amount in library.
  it("should return true if the draws on the current line were caused by a Hunting Lodge with no shuffle in between the draws and the Hunting Lodge play", () => {
    //Arrange
    deck.logArchive = [
      "G plays a Hunting Lodge.", // Draws caused by this Hunting Lodge
      "G draws a Copper.",
      "G gets +2 Actions.",
      "G discards 2 Coppers and a Silver.",
    ];

    // Act and Assert
    expect(deck.checkForHuntingLodgeDraw()).toBe(true);
  });

  it(
    "should return true if the draws on the current line were caused by a Hunting Lodge with " +
      "no shuffle in between the draws and the Hunting Lodge play, and no discard because of empty hand.",
    () => {
      //Arrange
      deck.logArchive = [
        "G plays a Hunting Lodge.", // Draws caused by this Hunting Lodge
        "G draws a Copper.",
        "G gets +2 Actions.",
      ];

      // Act and Assert
      expect(deck.checkForHuntingLodgeDraw()).toBe(true);
    }
  );

  // Case 2 - Empty hand (no discard) with interceding shuffle (this case is moot because of case with discard and no shuffle)
  it(
    "should return true if the draws on the current line were caused by a Hunting Lodge with " +
      "a shuffle in between the draws and the Hunting Lodge play, and no discard because of empty hand.",
    () => {
      //Arrange
      deck.logArchive = [
        "G plays a Hunting Lodge.", // Draws caused by this Hunting Lodge
        "G shuffles their deck.",
        "G draws a Copper.",
        "G gets +2 Actions.",
      ];

      // Act and Assert
      expect(deck.checkForHuntingLodgeDraw()).toBe(true);

      // Arrange 2
      deck.logArchive = [
        "G plays a Hunting Lodge.", // Draws caused by this Hunting Lodge
        "G draws a Copper.",
        "G gets +2 Actions.",
        "G shuffles their deck.",
      ];

      // Act and Assert 2
      expect(deck.checkForHuntingLodgeDraw()).toBe(true);
    }
  );

  // Case3 - shuffle occurred before draws take place due to low library count.
  it("should return true if the draws on the current line were cause by a Hunting Lodge with a shuffle in between the draws and the Hunting Lodge play", () => {
    // Arrange
    deck.logArchive = [
      "pNick plays a Hunting Lodge.", // Draws caused by this Hunting lodge
      "pNick draws a Copper.",
      "pNick gets +2 Actions.",
      "pNick discards 2 Coppers and a Silver.",
      "pNick shuffles their deck.",
    ];

    // Act and Assert
    expect(deck.checkForHuntingLodgeDraw()).toBe(true);

    // Arrange 2 - Interceding shuffle occurs in a different spot
    deck.logArchive = [
      "pNick plays a Hunting Lodge.", // Draws caused by this Hunting lodge
      "pNick shuffles their deck.",
      "pNick draws a Copper.",
      "pNick gets +2 Actions.",
      "pNick discards 2 Coppers and a Silver.",
    ];
    // Act and Assert 2
    expect(deck.checkForHuntingLodgeDraw()).toBe(true);
  });

  // Case 3 - Draws not caused by Hunting Lodge.
  it("should return false if draws on the current line were not caused by a Hunting Lodge", () => {
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
    expect(deck.checkForHuntingLodgeDraw()).toBe(false);
  });
});
