import { describe, it, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function checkForLibraryDiscard()", () => {
  it("should return true when the provided line matches ' discards ' and the most recent play in the logArchive is a Library play", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive = [
      "pNick plays a Library.",
      "pNick looks at a Poacher.",
      "pNick sets a Poacher aside with Library.",
      "pNick looks at a Smithy.",
      "pNick sets a Smithy aside with Library.",
      "pNick looks at a Library.",
      "pNick sets a Library aside with Library.",
      "pNick looks at a Library.",
      "pNick sets a Library aside with Library.",
      "pNick looks at a Library.",
      "pNick sets a Library aside with Library.",
      "pNick looks at an Artisan.",
      "pNick sets an Artisan aside with Library.",
      "pNick looks at a Poacher.",
      "pNick sets a Poacher aside with Library.",
      "pNick looks at a Copper.",
      "pNick looks at a Throne Room.",
      "pNick sets a Throne Room aside with Library.",
      "pNick looks at a Library.",
      "pNick sets a Library aside with Library.",
      "pNick looks at a Silver.",
      "pNick looks at a Library.",
      "pNick sets a Library aside with Library.",
      "pNick looks at a Library.",
      "pNick sets a Library aside with Library.",
      "pNick looks at a Copper.",
      "pNick looks at a Library.",
      "pNick sets a Library aside with Library.",
      "pNick looks at an Estate.",
      "pNick looks at a Copper.",
    ];
    const line =
      "pNick discards an Artisan, 7 Libraries, 2 Poachers, a Smithy, and a Throne Room.";
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
      "pNick plays a Sentry.",
      "pNick draws an Estate.",
      "pNick gets +1 Action.",
      "pNick looks at 2 Coppers.",
    ];
    const line = "pNick discards 2 Coppers.";
    deck.setLogArchive(logArchive);
    // Act
    const result = deck.checkForLibraryDiscard(line);
    // Assert
    expect(result).toBeFalsy();
  });
});
