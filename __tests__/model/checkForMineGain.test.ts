import { it, describe, beforeEach, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function checkForMineGain()", () => {
  let rDeck: Deck;
  let fakeLogArchive: string[];

  describe("when the gain occuring on the line is from a mine play", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      fakeLogArchive = ["pNick plays a Mine.", "pNick trashes a copper."];
      rDeck.setLogArchive(fakeLogArchive);
    });
    it("should return true", () => {
      expect(rDeck.checkForMineGain()).toBe(true);
    });
  });
  describe("when the gain occuring on the line is not from a mine play", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      fakeLogArchive = ["pNick gains a Mine", "pNick plays 3 Coppers. (+$3)."];
      rDeck.setLogArchive(fakeLogArchive);
    });
    it("should return false", () => {
      expect(rDeck.checkForMineGain()).toBe(false);
    });
  });
});
