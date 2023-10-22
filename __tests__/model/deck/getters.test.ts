import { describe, it, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Deck class getter functions ", () => {
  it("should return the values of the Deck fields correctly", () => {
    const deck = new Deck("", false, "", "Player Name", "p", []);
    // CurrentVP
    deck.currentVP = 50;
    expect(deck.getCurrentVP()).toBe(50);
    // Entire Deck
    deck.entireDeck = ["Entire", "Deck", "Sample", "Zone"];
    expect(deck.getEntireDeck()).toStrictEqual([
      "Entire",
      "Deck",
      "Sample",
      "Zone",
    ]);
    // Debug
    deck.debug = true;
    expect(deck.getDebug()).toBe(true);
    // Game Result
    deck.gameResult = "Victory";
    expect(deck.getGameResult()).toBe("Victory");
    // Game Title
    deck.gameTitle = "Sample Title";
    expect(deck.getGameTitle()).toBe("Sample Title");
    // Game Turn
    deck.gameTurn = 60;
    expect(deck.getGameTurn()).toBe(60);
    // Graveyard
    deck.graveyard = ["Sample", "Graveyard"];
    expect(deck.getGraveyard()).toStrictEqual(["Sample", "Graveyard"]);
    // Hand
    deck.hand = ["Sample", "Hand"];
    expect(deck.getHand()).toStrictEqual(["Sample", "Hand"]);
    // In Play
    deck.inPlay = ["Sample", "In", "Play", "Zone"];
    expect(deck.getInPlay()).toStrictEqual(["Sample", "In", "Play", "Zone"]);
    // Kingdom
    deck.kingdom = ["Sample", "Kingdom", "Zone"];
    expect(deck.getKingdom()).toStrictEqual(["Sample", "Kingdom", "Zone"]);
    // Last Entry Processed
    deck.lastEntryProcessed = "Sample Last Entry Processed";
    expect(deck.getLastEntryProcessed()).toStrictEqual(
      "Sample Last Entry Processed"
    );
    // Latest Play
    deck.latestPlay = "SampleLatestPlay";
    expect(deck.getLatestPlay()).toBe("SampleLatestPlay");
    // Library
    deck.library = ["Sample", "Library", "Zone"];
    expect(deck.getLibrary()).toStrictEqual(["Sample", "Library", "Zone"]);
    // Log Archive
    deck.logArchive = ["Log1", "Log2", "Log3"];
    expect(deck.getLogArchive()).toStrictEqual(["Log1", "Log2", "Log3"]);
    // Player Name
    deck.playerName = "Sample Player Name";
    expect(deck.getPlayerName()).toBe("Sample Player Name");
    // Player Nickname
    deck.playerNick = "p";
    expect(deck.getPlayerNick()).toBe("p");
    // Rated Game
    deck.ratedGame = false;
    expect(deck.getRatedGame()).toBe(false);
    // Rating
    deck.rating = "1234";
    expect(deck.getRating()).toBe("1234");
    // Set Aside Zone
    deck.setAside = ["Sample", "Set", "Aside", "Zone"];
    expect(deck.getSetAside()).toStrictEqual([
      "Sample",
      "Set",
      "Aside",
      "Zone",
    ]);
    // Trash
    deck.trash = ["Sample", "Trash", "Zone"];
    expect(deck.getTrash()).toStrictEqual(["Sample", "Trash", "Zone"]);
    // Treasure Popped
    deck.treasurePopped = true;
    expect(deck.getTreasurePopped()).toBe(true);
    // Wait To Draw Library Look
    deck.waitToDrawLibraryLook = true;
    expect(deck.getWaitToDrawLibraryLook()).toBe(true);
    // Wait to Shuffle
    deck.waitToShuffle = true;
    expect(deck.getWaitToShuffle()).toBe(true);
  });
});
