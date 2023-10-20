import { describe, it, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Deck class getter functions ", () => {
  it("should return the values of the Deck fields correctly", () => {
    const deck = new Deck("", false, "", "Player Name", "p", []);
    // CurrentVP
    deck.setCurrentVP(50);
    expect(deck.currentVP).toBe(50);
    // Entire Deck
    deck.setEntireDeck(["Entire", "Deck", "Sample", "Zone"]);
    expect(deck.entireDeck).toStrictEqual(["Entire", "Deck", "Sample", "Zone"]);
    // Debug
    deck.setDebug(true);
    expect(deck.debug).toBe(true);
    // Game Result
    deck.setGameResult("Victory");
    expect(deck.gameResult).toBe("Victory");
    // Game Title
    deck.setGameTitle("Sample Title");
    expect(deck.gameTitle).toBe("Sample Title");
    // Game Turn
    deck.setGameTurn(60);
    expect(deck.gameTurn).toBe(60);
    // Graveyard
    deck.setGraveyard(["Sample", "Graveyard"]);
    expect(deck.graveyard).toStrictEqual(["Sample", "Graveyard"]);
    // Hand
    deck.setHand(["Sample", "Hand"]);
    expect(deck.hand).toStrictEqual(["Sample", "Hand"]);
    // In Play
    deck.setInPlay(["Sample", "In", "Play", "Zone"]);
    expect(deck.inPlay).toStrictEqual(["Sample", "In", "Play", "Zone"]);
    // Kingdom
    deck.setKingdom(["Sample", "Kingdom", "Zone"]);
    expect(deck.kingdom).toStrictEqual(["Sample", "Kingdom", "Zone"]);
    // Last Entry Processed
    deck.setLastEntryProcessed("Sample Last Entry Processed");
    expect(deck.lastEntryProcessed).toStrictEqual(
      "Sample Last Entry Processed"
    );
    // Library
    deck.setLibrary(["Sample", "Library", "Zone"]);
    expect(deck.library).toStrictEqual(["Sample", "Library", "Zone"]);
    // Log Archive
    deck.setLogArchive(["Log1", "Log2", "Log3"]);
    expect(deck.logArchive).toStrictEqual(["Log1", "Log2", "Log3"]);
    // Player Name
    deck.setPlayerName("Sample Player Name");
    expect(deck.playerName).toBe("Sample Player Name");
    // Player Nickname
    deck.setPlayerNick("p");
    expect(deck.playerNick).toBe("p");
    // Rated Game
    deck.setRatedGame(false);
    expect(deck.ratedGame).toBe(false);
    // Rating
    deck.setRating("1234");
    expect(deck.rating).toBe("1234");
    // Set Aside Zone
    deck.setSetAside(["Sample", "Set", "Aside", "Zone"]);
    expect(deck.setAside).toStrictEqual(["Sample", "Set", "Aside", "Zone"]);
    // Trash
    deck.setTrash(["Sample", "Trash", "Zone"]);
    expect(deck.trash).toStrictEqual(["Sample", "Trash", "Zone"]);
    // Treasure Popped
    deck.setTreasurePopped(true);
    expect(deck.treasurePopped).toBe(true);
    // Wait To Draw Library Look
    deck.setWaitToDrawLibraryLook(true);
    expect(deck.waitToDrawLibraryLook).toBe(true);
    // Wait to Shuffle
    deck.setWaitToShuffle(true);
    expect(deck.waitToShuffle).toBe(true);
  });
});
