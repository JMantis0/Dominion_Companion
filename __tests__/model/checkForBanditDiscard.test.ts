import { it, describe, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function checkForBanditDiscard()", () => {
  let rDeck: Deck;
  let logArchive: string[];

  describe("when the most recent play in the game log is a Bandit play", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = [
        "oNick plays a Bandit.",
        "rNick reveals a Silver and a Province.",
      ];
      rDeck.setLogArchive(logArchive);
    });
    it("should return true", () => {
      expect(rDeck.checkForBanditDiscard()).toBeTruthy();
    });
  });
  describe("when the most recent play in the game log is not a Bandit play", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = ["pNick plays a Vassal.", "pNick discards a Library"];
      rDeck.setLogArchive(logArchive);
    });
    it("should return false", () => {
      expect(rDeck.checkForBanditDiscard()).toBeFalsy();
    });
  });
});
