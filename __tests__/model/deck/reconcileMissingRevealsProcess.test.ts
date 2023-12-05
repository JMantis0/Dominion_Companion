import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Deck } from "../../../src/model/deck";
import * as utils from "../../../src/utils/utils";

describe("reconcileMissingRevealsProcess", () => {
  const getGameLog = jest.spyOn(utils, "getClientGameLog");
  let deck: Deck;
  beforeEach(() => {
    jest.clearAllMocks();
    deck = new Deck("", false, "", "Player", "P", ["Copper", "Moneylender"]);
  });

  it(
    "should compare the lastEntryProcessed and second last line of the game long, and if they're" +
      "both Sage reveals and not equal, reconcile the difference",
    () => {
      // Arrange - set up a logArchive that didn't get updated properly.
      getGameLog.mockReturnValue(
        "G gets +1 Action.\nP reveals a Copper.\nP shuffles their deck.\nP reveals a Copper and a Moneylender.\nP puts a Moneylender into their hand."
      );
      deck.logArchive = [
        "G gets +1 Action.",
        "P reveals a Copper.",
        "P shuffles their deck.",
        "P reveals a Copper.",
      ];
      deck.setAside = ["Copper"];
      deck.library = ["Copper", "Moneylender"];
      deck.latestAction = "Sage";
      deck.lastEntryProcessed = "P reveals a Copper.";
      // Act - reconcile the logArchive with a missing entry with the gameLog
      deck.reconcileMissingRevealsProcess();

      expect(deck.logArchive).toStrictEqual([
        "G gets +1 Action.",
        "P reveals a Copper.",
        "P shuffles their deck.",
        "P reveals a Copper and a Moneylender.",
      ]);
      expect(deck.setAside).toStrictEqual(["Copper", "Moneylender"]);
      expect(deck.library).toStrictEqual(["Copper"]);
    }
  );

  it(
    "should compare the lastEntryProcessed and second last line of the game long, and if they're" +
      "both Farming Village reveals and not equal, reconcile the difference",
    () => {
      // Arrange - set up a logArchive that didn't get updated properly.
      getGameLog.mockReturnValue(
        "G gets +1 Action.\nP reveals a Copper.\nP shuffles their deck.\nP reveals a Copper and a Moneylender.\nP puts a Moneylender into their hand."
      );
      deck.logArchive = [
        "G gets +1 Action.",
        "P reveals a Copper.",
        "P shuffles their deck.",
        "P reveals a Copper.",
      ];
      deck.setAside = ["Copper"];
      deck.library = ["Copper", "Moneylender"];
      deck.latestAction = "Farming Village";
      deck.lastEntryProcessed = "P reveals a Copper.";
      // Act - reconcile the logArchive with a missing entry with the gameLog
      deck.reconcileMissingRevealsProcess();

      expect(deck.logArchive).toStrictEqual([
        "G gets +1 Action.",
        "P reveals a Copper.",
        "P shuffles their deck.",
        "P reveals a Copper and a Moneylender.",
      ]);
      expect(deck.setAside).toStrictEqual(["Copper", "Moneylender"]);
      expect(deck.library).toStrictEqual(["Copper"]);
    }
  );

  it("should work where there are not any new cards to be reconciled, only a difference in amount.", () => {
    // Arrange - set up a logArchive that didn't get updated properly.
    getGameLog.mockReturnValue(
      "G gets +1 Action.\nP reveals a Copper.\nP shuffles their deck.\nP reveals 2 Coppers.\nP puts a Copper into their hand."
    );
    deck.logArchive = [
      "G gets +1 Action.",
      "P reveals a Copper.",
      "P shuffles their deck.",
      "P reveals a Copper.",
    ];
    deck.setAside = ["Copper"];
    deck.library = ["Copper", "Moneylender"];
    deck.latestAction = "Sage";
    deck.lastEntryProcessed = "P reveals a Copper.";
    // Act - reconcile the logArchive with a missing entry with the gameLog
    deck.reconcileMissingRevealsProcess();

    expect(deck.logArchive).toStrictEqual([
      "G gets +1 Action.",
      "P reveals a Copper.",
      "P shuffles their deck.",
      "P reveals 2 Coppers.",
    ]);
    expect(deck.setAside).toStrictEqual(["Copper", "Copper"]);
    expect(deck.library).toStrictEqual(["Moneylender"]);
  });
});
