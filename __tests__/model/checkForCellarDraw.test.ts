import { it, describe, beforeEach, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function checkForCellarDraw()", () => {
  let rDeck: Deck;
  let logArchive: string[];
  // case with no shuffle
  describe('if the logArchive length is greater than 3 and at index of 3 less than the current logArchive length contains the substring " plays a Cellar"', () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = [
        "rNick plays a Cellar.",
        "rNick gets +1 Action.",
        "rNick discards an Estate.",
      ];
      rDeck.setLogArchive(logArchive);
    });
    it("should return true", () => {
      expect(rDeck.checkForCellarDraw()).toBeTruthy();
    });
  });
  // case with intermediate shuffle
  describe('if the logArchive length is greater than 3 and at index of 4 less than the current logArchive length contains the substring " plays a Cellar" AND the logArchive at the index of 1 less than logArchive length contains the substring "shuffles their deck"', () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = [
        "rNick plays a Cellar.",
        "rNick gets +1 Action.",
        "rNick discards an Estate.",
        "rNick shuffles their deck.",
      ];
      rDeck.setLogArchive(logArchive);
    });
    it("should return true", () => {
      expect(rDeck.checkForCellarDraw()).toBeTruthy();
    });
  });

  describe('when either the entry at 1 less than log Archive length does not contain the substring " shuffles their deck." or the log archive entry at 4 less than archive length does not contain the substring " plays a Cellar."', () => {
    it("should return false", () => {
      rDeck = createRandomDeck();
      logArchive = logArchive = [
        "rNick plays a Vassal",
        "rNick gets +$2.",
        "rNick trashes an Estate.",
        "rNick shuffles their deck.",
      ];
      rDeck.setLogArchive(logArchive);
      expect(rDeck.checkForCellarDraw()).toBeFalsy();
    });
  });
});
