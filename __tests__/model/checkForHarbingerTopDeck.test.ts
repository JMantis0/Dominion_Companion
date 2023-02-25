import { it, describe, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function checkForHarbingerTopDeck()", () => {
  let rDeck: Deck;
  let logArchive: string[];
  describe("when the logArchive entry at 4 less than the logArchive length contains the substring ' plays a Harbinger'", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = [
        "G plays a Harbinger.",
        "G draws a Copper.",
        "G gets +1 Action.",
        "G looks at 4 Coppers, a Silver, an Estate, and a Merchant.",
      ];
      rDeck.setLogArchive(logArchive);
    });
    it("should return true", () => {
      expect(rDeck.checkForHarbingerTopDeck()).toBeTruthy();
    });
  });
  describe("when the logArchive entry at 4 less than the logArchive length contains the substring ' shuffles their deck', and the logArchive entry at index 5 less than the logArchive length contains the substring ' plays a Harbinger'", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = [
        "G plays a Harbinger.",
        "G shuffles their deck.",
        "G draws a Copper.",
        "G gets +1 Action.",
        "G looks at 4 Coppers, a Silver, an Estate, and a Merchant.",
      ];
      rDeck.setLogArchive(logArchive);
    });
    it("should return true", () => {
      expect(rDeck.checkForHarbingerTopDeck()).toBeTruthy();
    });
  });

  describe("when the logArchive entry at 4 less than the logArchive length contains the substring ' shuffles their deck', but the logArchive entry at index 5 less than the logArchive length does not contain the substring ' plays a Harbinger'", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = [
        "G plays a Merchant.",
        "G shuffles their deck.",
        "G draws a Copper.",
        "G gets +1 Action.",
        "G plays a Moneylender.",
      ];
      rDeck.setLogArchive(logArchive);
    });
    it("should return false", () => {
      expect(rDeck.checkForHarbingerTopDeck()).toBeFalsy();
    });
  });
});
