import { it, describe, expect, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function checkForLibraryLook()", () => {
  let deck = new Deck("", false, "", "pName", "pNick", []);
  afterEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });
  it("should return true when the current line is looking at a card due to a Library play", () => {
    // Arrange
    deck.logArchive = [
      "Line1",
      "Line2",
      "Line3",
      "Line4",
      "pNick plays a Library.",
      "pNick looks at an Estate.",
      "pNick looks at a Workshop.",
      "pNick sets a Workshop aside with Library.",
      "pNick shuffles their deck.",
    ];
    deck.latestPlay = "Library";

    // Act and Assert
    expect(deck.checkForLibraryLook("pNick looks at a Silver.")).toBeTruthy();
  });

  it("should return false when the curring line is looking at a card but it was not due to a Library play", () => {
    // Arrange
    deck.logArchive = [
      "Line1",
      "Line2",
      "Line3",
      "Line4",
      "pNick plays a Sentry.",
      "pNick draws an Estate.",
      "pNick gets +1 Action.",
    ];
    deck.latestPlay = "Sentry";
    // Act and Assert
    expect(deck.checkForLibraryLook("pNick looks at 2 Coppers.")).toBeFalsy();
  });

  it("should return false if the current line is not looking at a card", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);

    deck.logArchive = [
      "Line1",
      "Line2",
      "Line3",
      "Line4",
      "pNick plays a Sentry.",
      "pNick draws an Estate.",
      "pNick gets +1 Action.",
      "pNick looks at 2 Coppers.",
    ];
    // Act and Assert
    expect(deck.checkForLibraryLook("pNick discards 2 Coppers.")).toBeFalsy();
  });
});
