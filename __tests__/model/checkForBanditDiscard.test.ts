import { it, describe, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function checkForBanditDiscard()", () => {
  let rDeck: Deck;
  let logArchive: string[];
  describe("when the log entry at index 1 less than the logArchive length contains the substring ' trashes ', and the logArchive entry just before that contains the substring ' reveals '", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = ["rNick reveals a Silver and a Province."];
      rDeck.setLogArchive(logArchive);
    });
    it("should return true", () => {
      expect(rDeck.checkForBanditDiscard()).toBeTruthy();
    });
  });

  describe("whent he log entry at index 1 less thatn the logArchive length contains the substring ' reveals '", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = [
        "rNick reveals a Silver and a Province.",
        "rNick trashes a Silver",
      ];
      rDeck.setLogArchive(logArchive);
    });
    it("should return true", () => {
      expect(rDeck.checkForBanditDiscard()).toBeTruthy();
    });
  });
});
