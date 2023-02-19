import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function checkForLibraryDiscard()", () => {
  let rDeck: Deck;
  let logArchive: string[];
  let line: string;
  describe("when the current line is a discard line and the most recent logEntry that contains the substring ' plays a ' also contains the substring ' plays a Library'", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = [
        "1",
        "2",
        "3",
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
      line =
        "G discards an Artisan, 7 Libraries, 2 Poachers, a Smithy, and a Throne Room.";
      rDeck.setLogArchive(logArchive);
    });
    it("should return true", () => {
      expect(rDeck.checkForLibraryDiscard(line)).toBeTruthy;
    });
  });
  describe("when the current line is not a discard line", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = ["Anthing"];
      line = "This is not a dscrd line";
      rDeck.setLogArchive(logArchive);
    });
    it("should throw error", () => {
      expect(() => rDeck.checkForLibraryDiscard(line)).toThrow(Error);
    });
  });
  describe("when the current line is a discard line and the most recent logArchive entry that contains the substring ' plays a ', does not also contain the substring ' plays a Libary'", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = [
        "Line1",
        "Line2",
        "Line3",
        "Line4",
        "G plays a Sentry.",
        "G draws an Estate.",
        "G gets +1 Action.",
        "G looks at 2 Coppers.",
      ];
      line = "G discards 2 Coppers.";
      rDeck.setLogArchive(logArchive);
    });
    it("should return false", () => {
      expect(rDeck.checkForLibraryDiscard(line)).toBeFalsy();
    });
  });
});
