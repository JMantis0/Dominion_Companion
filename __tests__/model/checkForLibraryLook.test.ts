import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function checkForLibraryLook()", () => {
  it("should return true when the current line is looking at a card due to a Library play", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive = [
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
    const line = "pNick looks at a Silver.";
    deck.setLogArchive(logArchive);
    
    // Act
    const result = deck.checkForLibraryLook(line);

    // Assert
    expect(result).toBeTruthy();
  });

  it("should return false when the curring line is looking at a card but it was not due to a Library play", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive = [
      "Line1",
      "Line2",
      "Line3",
      "Line4",
      "pNick plays a Sentry.",
      "pNick draws an Estate.",
      "pNick gets +1 Action.",
    ];
    const line = "pNick looks at 2 Coppers.";
    deck.setLogArchive(logArchive);

    // Act
    const result = deck.checkForLibraryLook(line);

    // Assert
    expect(result).toBeFalsy();
  });

  it("should return false if the current line is not looking at a card", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);

    const logArchive = [
      "Line1",
      "Line2",
      "Line3",
      "Line4",
      "pNick plays a Sentry.",
      "pNick draws an Estate.",
      "pNick gets +1 Action.",
      "pNick looks at 2 Coppers.",
    ];
    const line = "pNick discards 2 Coppers.";
    deck.setLogArchive(logArchive);

    // Act
    const result = deck.checkForLibraryLook(line);

    // Assert
    expect(result).toBeFalsy();
  });
});
