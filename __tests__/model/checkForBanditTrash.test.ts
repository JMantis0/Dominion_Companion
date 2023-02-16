import { it, describe, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function checkForBanditTrash()", () => {
  let rDeck: Deck;
  let logArchive: string[];
  describe("when the logArchive entry at index 1 less than the logArchive length (aka last entry) contains the substring ' reveals'", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = ["rNick reveals a Silver and a Province."];
      rDeck.setLogArchive(logArchive);
    });
    it("should return true", () => {
      expect(rDeck.checkForBanditTrash()).toBeTruthy();
    });
  });
  describe("when the logArchive entry at index 1 less than the logArchive length (aka last entry) contains the substring ' reveals'", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = ["rNick plays a Moneylender."];
      rDeck.setLogArchive(logArchive);
    });
    it("should return false", () => {
      expect(rDeck.checkForBanditTrash()).toBeFalsy();
    });
  });
});
