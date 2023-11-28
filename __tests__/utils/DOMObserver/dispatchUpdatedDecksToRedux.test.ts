import { expect, describe, it, beforeEach } from "@jest/globals";
import contentSlice from "../../../src/redux/contentSlice";
import { DOMStore } from "../../../src/utils";
import { Deck } from "../../../src/model/deck";
import { OpponentDeck } from "../../../src/model/opponentDeck";
import { DOMObserver } from "../../../src/utils/DOMObserver";
import { configureStore } from "@reduxjs/toolkit";
import optionsSlice from "../../../src/redux/optionsSlice";

describe("Function dispatchUpdatedDecksToRedux()", () => {
  // Declare reference for storeMock
  let storeMock: DOMStore;
  beforeEach(() => {
    // Create a new store instance for DOMObserver
    storeMock = configureStore({
      reducer: { content: contentSlice, options: optionsSlice },
      middleware: [],
    });
    // Set DOMObserver to use the mock store and mock dispatch
    DOMObserver.setStore(storeMock);
    DOMObserver.setDispatch(storeMock.dispatch);
  });

  it("should dispatch the setPlayerDeck and setOpponentDeck actions with the provided decks.", () => {
    // Arrange
    const playerStoreDeck = JSON.parse(
      JSON.stringify(
        new Deck("", false, "", "pName", "pNick", ["Card1", "Card2"])
      )
    );
    const opponentStoreDecks = [
      JSON.parse(
        JSON.stringify(
          new OpponentDeck("", false, "", "oName", "oNick", ["Card1", "Card2"])
        )
      ),
    ];

    // Act - simulate dispatching the actions with the provided decks.
    DOMObserver.dispatchUpdatedDecksToRedux(playerStoreDeck, opponentStoreDecks);

    // Assert - Verify the redux state contains the new StoreDeck data.
    expect(storeMock.getState().content.playerDeck).toStrictEqual(
      playerStoreDeck
    );
    expect(storeMock.getState().content.opponentDecks).toStrictEqual(
      opponentStoreDecks
    );
  });
});
