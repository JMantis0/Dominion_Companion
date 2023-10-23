import { it, describe, expect, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Method checkForLibraryLook()", () => {
  // Instantiate Deck object.
  let deck = new Deck("", false, "", "pName", "pNick", []);

  afterEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should return true when the current line is looking at a card due to a Library play", () => {
    // Arrange
    deck.latestPlay = "Library";

    // Act and Assert
    expect(deck.checkForLibraryLook("pNick looks at a Silver.")).toBeTruthy();
  });

  it("should return false when the curring line is looking at a card but it was not due to a Library play", () => {
    // Arrange
    deck.latestPlay = "Sentry";
    
    // Act and Assert
    expect(deck.checkForLibraryLook("pNick looks at 2 Coppers.")).toBeFalsy();
  });

  it("should return false if the current line is not looking at a card", () => {
    // Act and Assert
    expect(deck.checkForLibraryLook("pNick discards 2 Coppers.")).toBeFalsy();
  });
});
