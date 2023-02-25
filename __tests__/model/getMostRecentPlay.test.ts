import { it, describe, beforeEach, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function getMostRecentPlay()", () => {
  let rDeck: Deck;
  let logArch: string[];
  let logArch2: string[];
  describe("when given a logArchive that has at least one line that contains the substring ' plays a ' and/or also contains the substring ' again.'", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArch = [
        "G plays a Village.",
        "G draws a Smithy.",
        "G gets +2 Actions.",
        "G plays a Village.",
        "G draws a Silver.",
        "G gets +2 Actions.",
        "G plays a Smithy.",
        "G draws a Silver, a Cellar, and a Sentry.",
        "G plays a Sentry.",
        "G gets +1 Action.",
        "G plays a Cellar.",
        "G gets +1 Action.",
        "G discards 2 Estates.",
      ];
      logArch2 = [
        "G plays a Sentry again.",
        "G draws a Vassal.",
        "G gets +1 Action.",
        "G shuffles their deck.",
        "G looks at 2 Sentries.",
      ];
    });
    it("should return the card that was most recently played in the logArchive", () => {
      expect(rDeck.getMostRecentPlay(logArch)).toStrictEqual("Cellar");
    });
    it("should return the card that was most recently played in the logArchive", () => {
      expect(rDeck.getMostRecentPlay(logArch2)).toStrictEqual("Sentry");
    });
  });
  describe("when given a logArchive that contains no entries with the substring ' plays a '", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArch = [
        "G discards a Village.",
        "G draws a Smithy.",
        "G gets +2 Actions.",
        "G discards a Village.",
        "G draws a Silver.",
        "G gets +2 Actions.",
        "G discards a Smithy.",
        "G draws a Silver, a Cellar, and a Sentry.",
        "G discards a Sentry.",
        "G gets +1 Action.",
        "G discards a Cellar.",
        "G gets +1 Action.",
        "G discards 2 Estates.",
      ];
    });
    it("should throw an error", () => {
      expect(() => rDeck.getMostRecentPlay(logArch)).toThrow(Error);
    });
  });
  describe("when given an empty logArchive", () => {
    rDeck = createRandomDeck();
    logArch = [];
    it("should throw an error", () => {
      expect(() => rDeck.getMostRecentPlay(logArch)).toThrow(Error);
    });
  });
});
