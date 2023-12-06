import { describe, it, expect } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("The BaseDeck getter methods", () => {
  const bDeck = new BaseDeck("Title", false, "Ranking", "Opponent Name", "o", [
    "Sample",
    "Kingdom",
    "Estate",
  ]);
  it("should correctly return the value of of the deck fields", () => {
    // Current VP
    bDeck.currentVP = 20;
    expect(bDeck.getCurrentVP()).toBe(20);
    // Debug
    bDeck.debug = true;
    expect(bDeck.getDebug()).toBe(true);
    // Entire Deck
    bDeck.entireDeck = ["Sample", "Entire", "Deck", "Bandit"];
    expect(bDeck.getEntireDeck()).toStrictEqual([
      "Sample",
      "Entire",
      "Deck",
      "Bandit",
    ]);
    // Game Result
    bDeck.gameResult = "Victory";
    expect(bDeck.getGameResult()).toBe("Victory");
    // Game Title
    expect(bDeck.getGameTitle()).toBe("Title");
    // Game Turn
    bDeck.gameTurn = 14;
    expect(bDeck.getGameTurn()).toBe(14);
    // Kingdom
    expect(bDeck.getKingdom()).toStrictEqual(["Sample", "Kingdom", "Estate"]);
    // Last Entry Processed
    bDeck.lastEntryProcessed = "Sample Last Entry Processed";
    expect(bDeck.getLastEntryProcessed()).toStrictEqual(
      "Sample Last Entry Processed"
    );
    // Latest Action
    bDeck.latestAction = "SampleLatestPlay";
    expect(bDeck.getLatestAction()).toBe("SampleLatestPlay");
    // Latest Play
    bDeck.latestPlay = "SampleLatestPlay";
    expect(bDeck.getLatestPlay()).toBe("SampleLatestPlay");
    // Latest Play Source
    bDeck.latestPlaySource = "Hand";
    expect(bDeck.getLatestPlaySource()).toBe("Hand");
    // Log Archive
    bDeck.logArchive = ["Log1", "Log2", "Log3"];
    expect(bDeck.getLogArchive()).toStrictEqual(["Log1", "Log2", "Log3"]);
    // Player Name
    expect(bDeck.getPlayerName()).toBe("Opponent Name");
    // Player Nickname
    expect(bDeck.getPlayerNick()).toBe("o");
    // Rated Game
    expect(bDeck.getRatedGame()).toBe(false);
    // Rating
    expect(bDeck.getRating()).toBe("Ranking");
    // Trash
    bDeck.trash = ["Sample", "Trash", "Zone"];
    expect(bDeck.getTrash()).toStrictEqual(["Sample", "Trash", "Zone"]);
  });
});
