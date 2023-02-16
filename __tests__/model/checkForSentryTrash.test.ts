import { it, describe, beforeEach, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function checkForSentryTrash()", () => {
  let rDeck: Deck;
  let logArchive: string[];
  describe("when the log entry at index 4 less than  logArchive length contains the substring ' plays a Sentry'", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = [
        "G plays a Sentry.",
        "G draws a Poacher.",
        "G gets +1 Action.",
        " G looks at an Estate and a Poacher.",
      ];
      rDeck.setLogArchive(logArchive);
    });
    it("should return true", () => {
      expect(rDeck.checkForSentryTrash()).toBeTruthy();
    });
  });
  describe("when the log entry at index 5 less than logArchive length contains the substring ' plays a Sentry' and the log entry at index 4 less than logArchive contains the substring ' shuffles their deck'", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = [
        "G plays a Sentry.",
        "G shuffles their deck",
        "G draws a Poacher.",
        "G gets +1 Action.",
        " G looks at an Estate and a Poacher.",
      ];
      rDeck.setLogArchive(logArchive);
    });
    it("should return true", () => {
      expect(rDeck.checkForSentryTrash()).toBeTruthy();
    });
  });
  describe("when the log entry at index 5 less than logArchive length contains the substring ' plays a Sentry' and the log entry at index 2 less than logArchive contains the substring ' shuffles their deck'", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = [
        "G plays a Sentry.",
        "G draws a Poacher.",
        "G gets +1 Action.",
        "G shuffles their deck.",
        "G looks at 2 Coppers.",
      ];
      rDeck.setLogArchive(logArchive);
    });
    it("should return true", () => {
      expect(rDeck.checkForSentryTrash()).toBeTruthy();
    });
  });
  describe("when the log entry at index 5 less than logArchive length contains the substring ' plays a Sentry' but neither the log entry at index 2 less than logArchive nor the log entry at index 4 less than logArchive length contain the substring ' shuffles their deck'", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = [
        "G plays a Sentry.",
        "G draws a Poacher.",
        "G gets +1 Action.",
        "G gets +$1",
        "G looks at 2 Coppers.",
      ];
      rDeck.setLogArchive(logArchive);
    });
    it("should return false", () => {
      expect(rDeck.checkForSentryTrash()).toBeFalsy();
    });
  });
});
