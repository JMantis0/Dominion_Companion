import { it, describe, expect, beforeEach, afterEach } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function checkForLibraryLook()", () => {
  let rDeck: Deck;
  let logArchive: string[];
  let line: string;
  describe("When the current line contains the substring ' looks at ' and nearest log line div looking backwards has innerText that contains the substring ' plays a ' and also also contains ' plays a Library'", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = [
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
      line = "G looks at a Silver.";
      rDeck.setLogArchive(logArchive);
    });
    afterEach(() => {});
    it("should return true", () => {
      expect(rDeck.checkForLibraryLook(line)).toBeTruthy();
    });
  });
  describe("When the current line contains the substring ' looks at ' and nearest log line div looking backwards has innerText that contains the substring ' plays a ' but does not contain the substring ' plays a Library'", () => {
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
      ];
      line = "G looks at 2 Coppers.";
      rDeck.setLogArchive(logArchive);
    });
    it("should return false", () => {
      expect(rDeck.checkForLibraryLook(line)).toBeFalsy();
    });
  });
  describe("When the current line does not contain the substring ' looks at ' ", () => {
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
      expect(rDeck.checkForLibraryLook(line)).toBeFalsy();
    });
  });
  describe("when the current line contains the substring ' looks at ', but the logArchive does not contain an entry that contains the substring ' plays a '", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = ["Line1", "Line2", "Line3", "Line4"];
      line = "G looks at 2 Coppers.";
      rDeck.setLogArchive(logArchive);
    });
    it("should throw error", () => {
      expect(() => rDeck.checkForLibraryLook(line)).toThrow(Error);
    });
  });
});
