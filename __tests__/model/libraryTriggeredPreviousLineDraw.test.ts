import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("libraryTriggeredPreviousLineDraw", () => {
  it("should return true if the logArchive entry is a 'library look' and the card from that entry needs to be drawn", () => {
    // This case occurs when there is not sufficient context to draw the card that was being looked at immediately,
    // But on the turn after, there is sufficient context to draw the card.  This is the purpose of the
    // field 'waitToDrawLibraryLook'.
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive = [
      "pNick plays a Library.",
      "pNick looks at a Chapel.",
      "pNick looks at a Poacher.",
    ];
    deck.setLogArchive(logArchive);
    deck.waitToDrawLibraryLook = true;
    const act = "looks at";

    // Act
    const result = deck.libraryTriggeredPreviousLineDraw(act);

    // Assert
    expect(result).toBe(true);
  });

  it("should return false if the logArchive entry is not a 'library look'", () => {
    // Case1 most recent logArchive entry is not a 'Library look'
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive = [
      "pNick plays a Sentry.",
      "pNick draws a Silver.",
      "pNick gets +1 Action.",
      "pNick looks at a Copper and a Gold.",
      "pNick trashes a Copper.",
      "pNick topdecks a Gold.",
    ];
    deck.setLogArchive(logArchive);
    deck.waitToDrawLibraryLook = true;
    const act = "looks at";

    // Act
    const result = deck.libraryTriggeredPreviousLineDraw(act);
    expect(result).toBe(false);
  });
  
  it("should return false if the logArchive entry is not a 'library look', but the card from that entry was already drawn", () => {
    // Case2 most recent logArchive entry is a 'Library look', but the card from that entry was already drawn, ie: this.waitToDrawLibraryLook is false.
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive = [
      "pNick plays a Library.",
      "pNick looks at a Chapel.",
      "pNick looks at a Copper.",
    ];
    deck.setLogArchive(logArchive);
    deck.waitToDrawLibraryLook = false;
    const act = "looks at";

    // Act
    const result = deck.libraryTriggeredPreviousLineDraw(act);

    // Assert
    expect(result).toBe(false);
  });

  it("should return false when most recent logArchive entry is a 'Library look, and the card from that entry is not yet drawn, but the act of the current line is a 'aside with Library' action, indicating that the card was not selected to be drawn by the player", () => {
    // Case3 most recent logArchive entry is a 'Library look, and the card from that entry is not yet drawn,
    // but the act of the current line is a 'aside with Library' action, indicating that the card was not selected to be drawn by the player.
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive = [
      "pNick plays a Library.",
      "pNick looks at a Chapel.",
      "pNick looks at a Poacher.",
    ];
    deck.setLogArchive(logArchive);
    deck.waitToDrawLibraryLook = true;
    const act = "aside with Library";

    // Act
    const result = deck.libraryTriggeredPreviousLineDraw(act);

    // Assert
    expect(result).toBe(false);
  });
});
