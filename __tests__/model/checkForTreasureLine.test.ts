import { it, describe, beforeEach, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function checkForTreasurePlayLine()", () => {
  let rDeck: Deck;
  let treasureLine: string;
  let nonTreasureLine1: string;
  let nonTreasureLine2: string;
  describe("when given a line that contains the substring  ' plays ' and also contains a match to the regular expression '/Coppers?|Silvers?|Golds?/'", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      treasureLine = "rNick plays 2 Coppers.";
    });
    it("should return true", () => {
      expect(rDeck.checkForTreasurePlayLine(treasureLine)).toBe(true);
    });
  });
  describe("when given a line that does not contain both the substring ' plays ' and a match for the regular expression '/Coppers?|Silvers?|Golds?/'", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      nonTreasureLine1 = "rNick plays a Library.";
      nonTreasureLine2 = "rNick buys and gains a Copper.";
    });
    it("should return false", () => {
      expect(rDeck.checkForTreasurePlayLine(nonTreasureLine1)).toBe(false);
      expect(rDeck.checkForTreasurePlayLine(nonTreasureLine2)).toBe(false);
    });
  });
});
