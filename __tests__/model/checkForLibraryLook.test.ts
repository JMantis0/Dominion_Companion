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
      "G plays a Library.",
      "G looks at an Estate.",
      "G looks at a Workshop.",
      "G sets a Workshop aside with Library.",
      "G shuffles their deck.",
    ];
    const line = "G looks at a Silver.";
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
      "G plays a Sentry.",
      "G draws an Estate.",
      "G gets +1 Action.",
    ];
    const line = "G looks at 2 Coppers.";
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
      "G plays a Sentry.",
      "G draws an Estate.",
      "G gets +1 Action.",
      "G looks at 2 Coppers.",
    ];
    const line = "G discards 2 Coppers.";
    deck.setLogArchive(logArchive);

    // Act
    const result = deck.checkForLibraryLook(line);

    // Assert
    expect(result).toBeFalsy();
  });
});
