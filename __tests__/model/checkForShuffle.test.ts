import { it, describe, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function checkForShuffle()", () => {
  let rDeck: Deck;
  let line: string;
  describe('when given a line containing the substring "shuffles their deck"', () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      line = "rNick shuffles their deck.";
    });
    it("should return true", () => {
      expect(rDeck.checkForShuffle(line)).toBeTruthy();
    });
  });
  describe('when given a line that does not contain the substring "shuffles their deck"', () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      line = "rNick doesn't shuffle anything.";
    });
    it("should return false", () => {
      expect(rDeck.checkForShuffle(line)).toBeFalsy();
    });
  });
});
