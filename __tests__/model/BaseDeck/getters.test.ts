import { describe, it, expect } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("The BaseDeck getter functions", () => {
  const oDeck = new BaseDeck("Title", false, "Ranking", "Opponent Name", "o", [
    "Sample",
    "Kingdom",
    "Estate",
  ]);
  it("should correctly return the value of of the deck fields", () => {
    // Current VP
    oDeck.currentVP = 20;
    expect(oDeck.getCurrentVP()).toBe(20);
    // Debug
    oDeck.debug = true;
    expect(oDeck.getDebug()).toBe(true);
    // Entire Deck
    oDeck.entireDeck = ["Sample", "Entire", "Deck", "Bandit"];
    expect(oDeck.getEntireDeck()).toStrictEqual([
      "Sample",
      "Entire",
      "Deck",
      "Bandit",
    ]);
    // Game Result
    oDeck.gameResult = "Victory";
    expect(oDeck.getGameResult()).toBe("Victory");
    // Game Title
    expect(oDeck.getGameTitle()).toBe("Title");
    // Game Turn
    oDeck.gameTurn = 14;
    expect(oDeck.getGameTurn()).toBe(14);
    // Kingdom
    expect(oDeck.getKingdom()).toStrictEqual(["Sample", "Kingdom", "Estate"]);
    // Last Entry Processed
    oDeck.lastEntryProcessed = "Sample lastEntryProcessed.";
    expect(oDeck.getLastEntryProcessed()).toStrictEqual(
      "Sample lastEntryProcessed."
    );
    // Log Archive
    oDeck.logArchive = ["Log1", "Log2", "Log3"];
    expect(oDeck.getLogArchive()).toStrictEqual(["Log1", "Log2", "Log3"]);
    // Player Name
    expect(oDeck.getPlayerName()).toBe("Opponent Name");
    // Player Nickname
    expect(oDeck.getPlayerNick()).toBe("o");
    // Rated Game
    expect(oDeck.getRatedGame()).toBe(false);
    // Rating
    expect(oDeck.getRating()).toBe("Ranking");
    // Trash
    oDeck.trash = ["Sample", "Trash", "Zone"];
    expect(oDeck.getTrash()).toStrictEqual(["Sample", "Trash", "Zone"]);
    // Treasure Popped
    oDeck.treasurePopped = true;
    expect(oDeck.getTreasurePopped()).toBe(true);
  });
});
