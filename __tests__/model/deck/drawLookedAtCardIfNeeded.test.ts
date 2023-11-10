import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("drawLookedAtCardIfNeeded", () => {
  // Declare Deck reference.
  let deck: Deck;
  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", [
      "Chapel",
      "Library",
      "Harbinger",
      "Copper",
    ]);
  });

  it("should draw the card that was looked at on the previous line, if needed()", () => {
    // Arrange
    deck.logArchive = ["pNick plays a Library.", "pNick looks at a Chapel."];
    deck.latestPlay = "Library";
    deck.waitToDrawLibraryLook = true;
    deck.setAside = ["Chapel"];
    deck.hand = ["Copper", "Estate"];
    const act = "plays";

    // Act - Simulate an update where a draw from the previous line's Library action is needed
    deck.drawLookedAtCardIfNeeded(act);

    // Assert - Verify the card moved from setAside to hand.
    expect(deck.hand).toStrictEqual(["Copper", "Estate", "Chapel"]);
    expect(deck.setAside).toStrictEqual([]);
    // Verify waitToDrawLibraryLook was set to false
    expect(deck.waitToDrawLibraryLook).toBe(false);
  });

  it("should not draw the card that was looked at on the previous line, if that card was set aside by the player", () => {
    // Arrange
    deck.logArchive = ["pNick plays a Library.", "pNick looks at a Chapel."];
    deck.latestPlay = "Library";
    deck.waitToDrawLibraryLook = true;
    deck.setAside = ["Chapel"];
    deck.hand = ["Copper", "Estate"];
    const act = "aside with Library";
    // Act - Simulate a call to drawLookedAtCardIfNeeded where the player chose not to draw the card.
    deck.drawLookedAtCardIfNeeded(act);

    // Assert - Verify the card was not drawn.
    expect(deck.hand).toStrictEqual(["Copper", "Estate"]);
    expect(deck.setAside).toStrictEqual(["Chapel"]);
    // Verify waitToDrawLibraryLook was set to false
    expect(deck.waitToDrawLibraryLook).toBe(false);
  });

  it("should not draw the card that was looked at on the previous line, if card was one of the cards that is auto drawn", () => {
    // Arrange
    deck.logArchive = ["pNick plays a Library.", "pNick looks at a Copper."];
    deck.latestPlay = "Library";
    deck.waitToDrawLibraryLook = false;
    deck.hand = ["Copper", "Estate", "Copper"];
    deck.setAside = [];
    const act = "looks at";

    // Act - Simulate a call to drawLookedAtCardIfNeeded where the card was not an action, and was automatically drawn.
    deck.drawLookedAtCardIfNeeded(act);

    // Assert - Verify the card was not drawn.
    expect(deck.hand).toStrictEqual(["Copper", "Estate", "Copper"]);
    expect(deck.setAside).toStrictEqual([]);
    // Verify waitToDrawLibraryLook was set to false
    expect(deck.waitToDrawLibraryLook).toBe(false);
  });

  it("should not draw the card that was looked at on the previous line, if previous line is not a Library look", () => {
    // Arrange
    deck.logArchive = ["pNick plays a Harbinger.", "pNick looks at a Copper."];
    deck.latestPlay = "Harbinger";
    deck.waitToDrawLibraryLook = false;
    deck.hand = ["Copper", "Estate", "Copper"];
    deck.setAside = [];
    const act = "plays";

    // Act - Simulate a call to drawLookedAtCardIfNeeded where the previous line is not a Library look.
    deck.drawLookedAtCardIfNeeded(act);

    // Assert - Verify the card was not drawn.
    expect(deck.hand).toStrictEqual(["Copper", "Estate", "Copper"]);
    expect(deck.setAside).toStrictEqual([]);
    // Verify waitToDrawLibraryLook was set to false
    expect(deck.waitToDrawLibraryLook).toBe(false);
  });
});
