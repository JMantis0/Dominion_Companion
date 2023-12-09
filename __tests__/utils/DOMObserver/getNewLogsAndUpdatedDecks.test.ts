import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";
import { OpponentDeck } from "../../../src/model/opponentDeck";
import { Deck } from "../../../src/model/deck";
import { DOMStore } from "../../../src/utils";
import { configureStore } from "@reduxjs/toolkit";
import contentSlice from "../../../src/redux/contentSlice";
import optionsSlice from "../../../src/redux/optionsSlice";

describe("Function getNewLogsAndUpdateDecks", () => {
  // Declare reference variables.
  let pDeck: Deck;
  let oDeck: OpponentDeck;
  let deckMap: Map<string, Deck | OpponentDeck>;
  let storeMock: DOMStore;
  jest.spyOn(Deck.prototype, "checkLogAccuracy").mockReturnValue(true);

  beforeEach(() => {
    // Create a new store instance for DOMObserver
    storeMock = configureStore({
      reducer: { content: contentSlice, options: optionsSlice },
      middleware: [],
    });
    // Set DOMObserver to use the mock store and mock dispatch
    DOMObserver.setStore(storeMock);
    DOMObserver.setDispatch(storeMock.dispatch);

    // Set create a new Deck Map with new Decks, and reassign it and the player and opponent names.
    pDeck = new Deck("", false, "", "pName", "pNick", ["Copper"]);
    oDeck = new OpponentDeck("", false, "", "oName", "oNick", ["Copper"]);
    deckMap = new Map<string, Deck | OpponentDeck>();
    deckMap.set("pName", pDeck);
    deckMap.set("oName", oDeck);
    DOMObserver.playerName = "pName";
    DOMObserver.opponentNames = ["oName"];
    DOMObserver.decks = deckMap;
    jest.clearAllMocks();
  });

  it("should get the new game logs, call the decks' update functions with the new logs, and return the updated decks as StoreDecks.", () => {
    // Arrange
    DOMObserver.logsProcessed = "Log1\nLog2";

    const gameLog =
      "Log1\nLog2\noNick buys and gains a Copper.\nLog5\npNick buys and gains a Copper.";

    // Create a pair do decks and invoke the update method with the undispatched logs to use in assertions.
    const expectedPlayerDeck = new Deck("", false, "", "pName", "pNick", [
      "Copper",
    ]);
    expectedPlayerDeck.update(
      "oNick buys and gains a Copper.\nLog5\npNick buys and gains a Copper.".split(
        "\n"
      )
    );

    const expectedOpponentDeck = new OpponentDeck(
      "",
      false,
      "",
      "oName",
      "oNick",
      ["Copper"]
    );
    expectedOpponentDeck.update(
      "oNick buys and gains a Copper.\nLog5\npNick buys and gains a Copper.".split(
        "\n"
      )
    );

    // Act - Simulate getting new log entry within the log observer mutation callback and updating the decks.
    const { playerStoreDeck, opponentStoreDecks } =
      DOMObserver.getNewLogsAndUpdateDecks(gameLog);

    // Assert
    expect(playerStoreDeck).toStrictEqual(
      JSON.parse(JSON.stringify(expectedPlayerDeck))
    );
    expect(opponentStoreDecks).toStrictEqual([
      JSON.parse(JSON.stringify(expectedOpponentDeck)),
    ]);
  });

  it("should catch an error thrown by a deck's update method and call the DOMObserver errorHandler.", () => {
    // Arrange - Mock Deck's update method to throw an error
    const error = new Error("Test error");
    jest.spyOn(Deck.prototype, "update").mockImplementation(() => {
      throw error;
    });
    DOMObserver.logsProcessed = "Log1\nLog2";
    const gameLog = "Log1\nLog2\nLog3\nLog4";

    // Act - Simulate an error being thrown by the player deck's update method..
    DOMObserver.getNewLogsAndUpdateDecks(gameLog);

    expect(storeMock.getState().content.error).toBe("Test error");
  });

  it("should catch an error thrown by a opponent deck's update method and call the DOMObserver errorHandler.", () => {
    // Arrange - Mock  OpponentDeck's update method to throw an error.
    const error = new Error("Test error");
    jest.spyOn(OpponentDeck.prototype, "update").mockImplementation(() => {
      throw error;
    });
    DOMObserver.logsProcessed = "Log1\nLog2";
    const gameLog = "Log1\nLog2\nLog3\nLog4";

    // Act - Simulate an error being thrown by the player deck's update method..
    DOMObserver.getNewLogsAndUpdateDecks(gameLog);
    expect(storeMock.getState().content.error).toBe("Test error");
  });
});
