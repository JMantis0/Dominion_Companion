import { it, describe, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function checkForBanditTrash()", () => {
  let rDeck: Deck;
  let logArchive: string[];
  describe("when the most recent play in the log archive was a Bandit", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = [
        "L plays a Bandit.",
        "L gains a Gold.",
        "G reveals a Silver and an Estate.",
        "G trashes a Silver.",
        "G discards an Estate.",
      ];
      rDeck.setLogArchive(logArchive);
    });
    it("should return true", () => {
      expect(rDeck.checkForBanditTrash()).toBeTruthy();
    });
  });
  describe("when the most recent play in was not a Bandit", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = [
        "G plays a Sentry.",
        "G draws a Copper.",
        "G gets +1 Action.",
        "G looks at a Smithy and a Village.",
        "G discards a Smithy.",
        "G topdecks a Village.",
      ];
      rDeck.setLogArchive(logArchive);
    });
    it("should return true", () => {
      expect(rDeck.checkForBanditTrash()).toBeFalsy();
    });
  });
});
