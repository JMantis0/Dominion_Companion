import { beforeEach, describe, expect, it } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("consecutiveReveals", () => {
  let deck: Deck;
  beforeEach(() => {
    deck = new Deck("", false, "", "Player", "P", []);
  });
  it(
    "should return true if the current line is a sage reveal and the most " +
      "recent logArchive entry is a sage reveal",
    () => {
      // Arrange
      deck.latestAction = "Sage";
      deck.lastEntryProcessed = "P reveals a Copper.";
      expect(deck.consecutiveReveals("P reveals 2 Coppers.")).toBe(true);
    }
  );
  it(
    "should return true if the current line is a sage reveal and the most " +
      "recent logArchive entry is a sage reveal",
    () => {
      // Arrange
      deck.latestAction = "Sage";
      deck.lastEntryProcessed = "P reveals a Copper.";
      expect(deck.consecutiveReveals("P reveals a Copper and a Remodel.")).toBe(
        true
      );
    }
  );
  it(
    "should return true if the current line is a Farming Village reveal and the most " +
      "recent logArchive entry is a Farming Village reveal",
    () => {
      // Arrange
      deck.latestAction = "Farming Village";
      deck.lastEntryProcessed = "P reveals an Estate.";
      expect(deck.consecutiveReveals("P reveals 2 Estates.")).toBe(true);
    }
  );

  it(
    "should return false if the current line is a sage reveal and the most " +
      "recent logArchive entry is not a sage reveal",
    () => {
      // Arrange
      deck.latestAction = "Sage";
      deck.lastEntryProcessed = "P draws a Copper.";
      expect(deck.consecutiveReveals("P draws a Copper.")).toBe(false);
    }
  );
});
