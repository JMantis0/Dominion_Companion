import { it, describe, beforeEach, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function checkForVassalPlay()", () => {
  let rDeck: Deck;
  let logArchive: string[];
  describe("when the logArchive entry at index 3 less than the logArchive length contains the substring ' plays a Vassal'", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = ["G plays a Vassal.", "G gets +$2.", "G discards a Chapel."];
      rDeck.setLogArchive(logArchive);
    });
    it("should return true", () => {
      expect(rDeck.checkForVassalPlay()).toBeTruthy();
    });
  });
});
