import { it, describe, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function checkPreviousLineProcessedForCurrentCardBuy()", () => {
  let rDeck: Deck;
  let card: string;
  let logArchive: string[];
  describe("when given a card and a line that contains the substring ` buys a ${card}` ", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      card = "Sentry";
      logArchive = ["rNick buys a Sentry"];
      rDeck.setLogArchive(logArchive);
    });
    it("should return true", () => {
      expect(
        rDeck.checkPreviousLineProcessedForCurrentCardBuy(card)
      ).toBeTruthy();
    });
  });
  describe("when given a card and a line that does not contain the substring ` buys a ${card}` ", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      card = "Joker";
      logArchive = ["rNick buys a Sentry"];
      rDeck.setLogArchive(logArchive);
    });
    it("should return false", () => {
      expect(
        rDeck.checkPreviousLineProcessedForCurrentCardBuy(card)
      ).toBeFalsy();
    });
  });
});
