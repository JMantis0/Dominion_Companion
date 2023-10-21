import { describe, it, expect } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("The BaseDeck setter functions", () => {
  const oDeck = new BaseDeck(
    "Title",
    false,
    "Ranking",
    "Opponent Name",
    "o",
    ["Sample", "Kingdom", "Estate"]
  );
  it("should correctly set the value of of the deck fields", () => {
    oDeck.setCurrentVP(20);
    expect(oDeck.currentVP).toBe(20);

    oDeck.setDebug(true);
    expect(oDeck.debug).toBe(true);

    oDeck.setEntireDeck(["Sample", "Entire", "Deck", "Bandit"]);
    expect(oDeck.entireDeck).toStrictEqual([
      "Sample",
      "Entire",
      "Deck",
      "Bandit",
    ]);

    oDeck.setGameResult("Victory");
    expect(oDeck.gameResult).toBe("Victory");

    oDeck.setGameTitle("New Title");
    expect(oDeck.gameTitle).toBe("New Title");

    oDeck.setGameTurn(14);
    expect(oDeck.gameTurn).toBe(14);

    oDeck.setKingdom(["New", "Sample", "Kingdom", "Estate"]);
    expect(oDeck.kingdom).toStrictEqual(["New", "Sample", "Kingdom", "Estate"]);

    oDeck.setLastEntryProcessed("Sample lastEntryProcessed.");
    expect(oDeck.lastEntryProcessed).toStrictEqual(
      "Sample lastEntryProcessed."
    );

    oDeck.setLogArchive(["Log1", "Log2", "Log3"]);
    expect(oDeck.logArchive).toStrictEqual(["Log1", "Log2", "Log3"]);

    oDeck.setPlayerName("New Opponent Name");
    expect(oDeck.playerName).toBe("New Opponent Name");

    oDeck.setPlayerNick("New Nickname");
    expect(oDeck.playerNick).toBe("New Nickname");

    oDeck.setRatedGame(true);
    expect(oDeck.ratedGame).toBe(true);
    oDeck.setRating("New Rating");
    expect(oDeck.rating).toBe("New Rating");

    oDeck.setTrash(["New", "Sample", "Trash", "Zone"]);
    expect(oDeck.trash).toStrictEqual(["New", "Sample", "Trash", "Zone"]);

    oDeck.setTreasurePopped(true);
    expect(oDeck.treasurePopped).toBe(true);
  });
});
