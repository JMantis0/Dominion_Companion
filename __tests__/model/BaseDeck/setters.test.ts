import { describe, it, expect } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("The BaseDeck setter methods", () => {
  const bDeck = new BaseDeck(
    "Title",
    false,
    "Ranking",
    "Opponent Name",
    "o",
    ["Sample", "Kingdom", "Estate"]
  );
  it("should correctly set the value of of the deck fields", () => {
    bDeck.setCurrentVP(20);
    expect(bDeck.currentVP).toBe(20);
    bDeck.setDebug(true);
    expect(bDeck.debug).toBe(true);
    bDeck.setEntireDeck(["Sample", "Entire", "Deck", "Bandit"]);
    expect(bDeck.entireDeck).toStrictEqual([
      "Sample",
      "Entire",
      "Deck",
      "Bandit",
    ]);
    bDeck.setGameResult("Victory");
    expect(bDeck.gameResult).toBe("Victory");
    bDeck.setGameTitle("New Title");
    expect(bDeck.gameTitle).toBe("New Title");
    bDeck.setGameTurn(14);
    expect(bDeck.gameTurn).toBe(14);
    bDeck.setKingdom(["New", "Sample", "Kingdom", "Estate"]);
    expect(bDeck.kingdom).toStrictEqual(["New", "Sample", "Kingdom", "Estate"]);

    bDeck.setLastEntryProcessed("Sample lastEntryProcessed.");
    expect(bDeck.lastEntryProcessed).toStrictEqual(
      "Sample lastEntryProcessed."
    );
    bDeck.setLatestAction("Sample Latest Action");
    expect(bDeck.latestAction).toBe("Sample Latest Action");
    bDeck.setLatestPlay("Sample Latest Play");
    expect(bDeck.latestPlay).toBe("Sample Latest Play");
    bDeck.setLatestPlaySource("Vassal");
    expect(bDeck.latestPlaySource).toBe("Vassal");
    bDeck.setLogArchive(["Log1", "Log2", "Log3"]);
    expect(bDeck.logArchive).toStrictEqual(["Log1", "Log2", "Log3"]);
    bDeck.setPlayerName("New Opponent Name");
    expect(bDeck.playerName).toBe("New Opponent Name");
    bDeck.setPlayerNick("New Nickname");
    expect(bDeck.playerNick).toBe("New Nickname");
    bDeck.setRatedGame(true);
    expect(bDeck.ratedGame).toBe(true);
    bDeck.setRating("New Rating");
    expect(bDeck.rating).toBe("New Rating");
    bDeck.setTrash(["New", "Sample", "Trash", "Zone"]);
    expect(bDeck.trash).toStrictEqual(["New", "Sample", "Trash", "Zone"]);

  });
});
