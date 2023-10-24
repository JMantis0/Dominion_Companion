import { it, describe, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("libraryTriggeredPreviousLineDraw", () => {
  // Instantiate Deck object.
  let deck = new Deck("", false, "", "pName", "pNick", []);
  // Spy on function dependency.
  const checkForLibraryLook = jest.spyOn(Deck.prototype, "checkForLibraryLook");

  afterEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
    jest.clearAllMocks();
  });

  it("should return true if the logArchive entry is a 'library look' and the card from that entry needs to be drawn", () => {
    // Case 1 - Occurs when there is not sufficient context to draw the card that was being looked at immediately,
    // But on the turn after, there is sufficient context to draw the card.  This is the purpose of the
    // field 'waitToDrawLibraryLook'.
    // Arrange
    deck.logArchive = [
      "pNick plays a Library.",
      "pNick looks at a Chapel.",
      "pNick looks at a Poacher.",
    ];
    deck.latestPlay = "Library";
    deck.waitToDrawLibraryLook = true;

    // Act and Assert - Simulate the card that was looked at by Library play being taken into hand by the player.
    expect(deck.libraryTriggeredPreviousLineDraw("looks at")).toBe(true);
    expect(checkForLibraryLook).toBeCalledTimes(1);
    expect(checkForLibraryLook).toBeCalledWith("pNick looks at a Poacher.");
    expect(checkForLibraryLook.mock.results[0].value).toBe(true);
  });

  it("should return false if the logArchive entry is not a 'library look'", () => {
    // Case 2 - The most recent logArchive entry is not a 'Library look'
    // Arrange
    deck.logArchive = [
      "pNick plays a Sentry.",
      "pNick draws a Silver.",
      "pNick gets +1 Action.",
      "pNick looks at a Copper and a Gold.",
      "pNick trashes a Copper.",
      "pNick topdecks a Gold.",
    ];
    deck.latestPlay = "Sentry";
    deck.waitToDrawLibraryLook = true;

    // Act - Simulate a line where there is no Library play or card being looked at
    expect(deck.libraryTriggeredPreviousLineDraw("plays")).toBe(false);
    expect(checkForLibraryLook).toBeCalledTimes(1);
    expect(checkForLibraryLook).toBeCalledWith("pNick topdecks a Gold.");
    expect(checkForLibraryLook.mock.results[0].value).toBe(false);
  });

  it("should return false if the logArchive entry is not a 'library look', but the card from that entry was already drawn", () => {
    // Case 3 - The most recent logArchive entry is a 'Library look', but the card from that entry was already drawn, ie: this.waitToDrawLibraryLook is false.
    // Arrange
    deck.logArchive = [
      "pNick plays a Library.",
      "pNick looks at a Chapel.",
      "pNick looks at a Copper.",
    ];
    deck.latestPlay = "Library";
    deck.waitToDrawLibraryLook = false;

    // Act and Assert - simulate a player looking at a card with a Library, where the card from the previous line was automatically drawn already.
    expect(deck.libraryTriggeredPreviousLineDraw("looks at")).toBe(false);
    expect(checkForLibraryLook).toBeCalledTimes(1);
    expect(checkForLibraryLook).toBeCalledWith("pNick looks at a Copper.");
    expect(checkForLibraryLook.mock.results[0].value).toBe(true);
  });

  it("should return false when most recent logArchive entry is a 'Library look, and the card from that entry is not yet drawn, but the act of the current line is a 'aside with Library' action, indicating that the card was not selected to be drawn by the player", () => {
    // Case 4 - The most recent logArchive entry is a 'Library look, and the card from that entry is not yet drawn,
    // but the act of the current line is a 'aside with Library' action, indicating that the card was not selected to be drawn by the player.
    // Arrange
    deck.logArchive = [
      "pNick plays a Library.",
      "pNick looks at a Chapel.",
      "pNick looks at a Poacher.",
    ];
    deck.latestPlay = "Library";
    deck.waitToDrawLibraryLook = true;

    // Act and Assert - Simulate a player choosing to skip the card they look at with a Library.
    expect(deck.libraryTriggeredPreviousLineDraw("aside with Library")).toBe(
      false
    );
    expect(checkForLibraryLook).toBeCalledTimes(1);
    expect(checkForLibraryLook).toBeCalledWith("pNick looks at a Poacher.");
    expect(checkForLibraryLook.mock.results[0].value).toBe(true);
  });
});
