import { describe, it, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function checkForLibraryDiscard()", () => {
  it("should return true when the provided line matches ' discards ' and the most recent play in the logArchive is a Library play", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive = [
      "G plays a Library.",
      "G looks at a Poacher.",
      "G sets a Poacher aside with Library.",
      "G looks at a Smithy.",
      "G sets a Smithy aside with Library.",
      "G looks at a Library.",
      "G sets a Library aside with Library.",
      "G looks at a Library.",
      "G sets a Library aside with Library.",
      "G looks at a Library.",
      "G sets a Library aside with Library.",
      "G looks at an Artisan.",
      "G sets an Artisan aside with Library.",
      "G looks at a Poacher.",
      "G sets a Poacher aside with Library.",
      "G looks at a Copper.",
      "G looks at a Throne Room.",
      "G sets a Throne Room aside with Library.",
      "G looks at a Library.",
      "G sets a Library aside with Library.",
      "G looks at a Silver.",
      "G looks at a Library.",
      "G sets a Library aside with Library.",
      "G looks at a Library.",
      "G sets a Library aside with Library.",
      "G looks at a Copper.",
      "G looks at a Library.",
      "G sets a Library aside with Library.",
      "G looks at an Estate.",
      "G looks at a Copper.",
    ];
    const line =
      "G discards an Artisan, 7 Libraries, 2 Poachers, a Smithy, and a Throne Room.";
    deck.setLogArchive(logArchive);

    // Act
    const result = deck.checkForLibraryDiscard(line);

    // Assert
    expect(result).toBeTruthy;
  });

  it("should throw an error when the current line is not a discard line", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive = ["Anything"];
    const line = "This is not a discard line";
    deck.setLogArchive(logArchive);

    // Act and Assert
    expect(() => deck.checkForLibraryDiscard(line)).toThrow(Error);
  });
  it("should return true when the provided line is a discard line but the most recent play in the logArchive is not a Library play", () => {
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
    const result = deck.checkForLibraryDiscard(line);
    // Assert
    expect(result).toBeFalsy();
  });
});
