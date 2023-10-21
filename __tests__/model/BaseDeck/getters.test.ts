import { describe, it, expect } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("The BaseDeck getter functions", () => {
  const oDeck = new BaseDeck(
    "Title",
    false,
    "Ranking",
    "Opponent Name",
    "o",
    ["Sample", "Kingdom", "Estate"]
  );
  it("should correctly return the value of of the deck fields", () => {
    oDeck.currentVP = 20;
    expect(oDeck.getCurrentVP()).toBe(20);

    oDeck.debug = true;
    expect(oDeck.getDebug()).toBe(true);

    oDeck.entireDeck = ["Sample", "Entire", "Deck", "Bandit"];
    expect(oDeck.getEntireDeck()).toStrictEqual([
      "Sample",
      "Entire",
      "Deck",
      "Bandit",
    ]);

    oDeck.gameResult = "Victory";
    expect(oDeck.getGameResult()).toBe("Victory");

    expect(oDeck.getGameTitle()).toBe("Title");

    oDeck.gameTurn = 14;
    expect(oDeck.getGameTurn()).toBe(14);

    expect(oDeck.getKingdom()).toStrictEqual(["Sample", "Kingdom", "Estate"]);

    oDeck.lastEntryProcessed = "Sample lastEntryProcessed.";
    expect(oDeck.getLastEntryProcessed()).toStrictEqual(
      "Sample lastEntryProcessed."
    );

    oDeck.logArchive = ["Log1", "Log2", "Log3"];
    expect(oDeck.getLogArchive()).toStrictEqual(["Log1", "Log2", "Log3"]);

    expect(oDeck.getPlayerName()).toBe("Opponent Name");

    expect(oDeck.getPlayerNick()).toBe("o");

    expect(oDeck.getRatedGame()).toBe(false);

    expect(oDeck.getRating()).toBe("Ranking");

    oDeck.trash = ["Sample", "Trash", "Zone"];
    expect(oDeck.getTrash()).toStrictEqual(["Sample", "Trash", "Zone"]);

    oDeck.treasurePopped = true;
    expect(oDeck.getTreasurePopped()).toBe(true);
  });
});
