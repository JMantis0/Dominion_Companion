import { it, describe, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function checkForSentryDiscard()", () => {
  let rDeck: Deck;
  let logArchive: string[];
  // Case for no trash and no interceding shuffle.
  describe("when the logArchive entry at index 4 less than the logArchive length contains the substring ' plays a Sentry'", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = [
        "G plays a Sentry.", // Index 4 less than logArchive length.
        "G draws a Poacher.",
        "G gets +1 Action.",
        "G looks at an Estate and a Poacher.",
      ];
      rDeck.setLogArchive(logArchive);
    });
    it("should return true", () => {
      expect(rDeck.checkForSentryDiscard()).toBeTruthy();
    });
  });

  // Case for no trash and yes interceding shuffle.
  describe("when the logArchive entry at index 5 less than the logArchive length contains the substring ' plays a Sentry' and the logArchive entry at index 4 less than the logArchive length contains the substring ' shuffles their deck'", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = [
        "G plays a Sentry.", // Index 5 less than logArchive length.
        "G shuffles their deck.", // Index 4 less than logArchive length.
        "G draws a Poacher.",
        "G gets +1 Action.",
        "G looks at an Estate and a Poacher.",
      ];
      rDeck.setLogArchive(logArchive);
    });
    it("should return true", () => {
      expect(rDeck.checkForSentryDiscard()).toBeTruthy();
    });
  });

  // Case for trash and no interceding shuffle.
  describe("when the logArchive entry at index 5 less than the logArchive length contains the substring ' plays a Sentry' and the logArchive entry at index 1 less than lorArchive length contains the substring ' trashes '", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = [
        "G plays a Sentry.", // Index 5 less than logArchive length.
        "G draws a Poacher.",
        "G gets +1 Action.",
        "G looks at an Estate and a Poacher.",
        "G trashes an Estate.", // Index 1 less than logArchive length.
      ];
      rDeck.setLogArchive(logArchive);
    });
    it("should return true", () => {
      expect(rDeck.checkForSentryDiscard()).toBeTruthy();
    });
  });

  // Case for trash and interceding shuffle
  describe("when the logArchive entry at index 6 less than the logArchive length contains the substring ' plays a Sentry' and the logArchive entry at index 5 less than logArchive length contains the substring ' shuffles their deck', and the logArchive entry at index 1 less than logArchive length contains the substring ' trashes '", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = [
        "G plays a Sentry.", // Index 6 less than logArchive length.
        "G shuffles their deck", // Index 5 less than logArchive length.
        "G draws a Poacher.",
        "G gets +1 Action.",
        "G looks at an Estate and a Poacher.",
        "G trashes an Estate.", // Index 1 less than logArchive length.
      ];
      rDeck.setLogArchive(logArchive);
    });
    it("should return true", () => {
      expect(rDeck.checkForSentryDiscard()).toBeTruthy();
    });
  });

  describe("when the logArchive entry at index 6 less than the logArchive length contains the substring ' plays a Sentry' and the logArchive entry at index 5 less than logArchive length contains the substring ' shuffles their deck', but the logArchive entry at index 1 less than logArchive length does not contain the substring ' trashes '", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = [
        "G plays a Sentry.", // Index 6 less than logArchive length.
        "G shuffles their deck", // Index 5 less than logArchive length.
        "G draws a Poacher.",
        "G gets +1 Action.",
        "G looks at an Estate and a Poacher.",
        "G draws an Estate.", // Index 1 less than logArchive length.
      ];
      rDeck.setLogArchive(logArchive);
    });

    it("should return false", () => {
      expect(rDeck.checkForSentryDiscard()).toBeFalsy();
    });
  });


});
