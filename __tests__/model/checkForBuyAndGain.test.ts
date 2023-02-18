import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function checkForBuyAndGain()", () => {
  let rDeck: Deck;
  let line: string;
  let card = "Sentry"

  describe("when the current line contains the substring 'buys and gains'", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      line = "rNick buys and gains 2 Sentries.";
    });
    it("should return true", () => {
      expect(rDeck.checkForBuyAndGain(line, card)).toBeTruthy();
    });
  });
  beforeEach(() => {
    rDeck = createRandomDeck();
    line = "rNick buys a Stadium.";
  });

  describe("when the current line does not contain the substring 'buys and gains'", () => {
    it("should return false", () => {
      expect(rDeck.checkForBuyAndGain(line, card)).toBeFalsy();
    });
  });
});
