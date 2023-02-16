import { it, describe, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function checkForVassalDiscard()", () => {
  let rDeck: Deck;
  let logArchive: string[];
  describe("when the log entry at index 2 less than the logArchive length contains the substring ' plays a Vassal'", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = ["G plays a Vassal.", "G gets +$2."];
      rDeck.setLogArchive(logArchive);
    });
    it("should return true", () => {
      expect(rDeck.checkForVassalDiscard()).toBeTruthy();
    });
  });
});
