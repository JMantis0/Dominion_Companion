import { describe, it, expect, beforeEach } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";
import contentSlice, {
  setOpponentDeck,
  setPlayerDeck,
} from "../../../src/redux/contentSlice";
import { EmptyOpponentDeck } from "../../../src/model/emptyOpponentDeck";
import { EmptyDeck } from "../../../src/model/emptyDeck";
import { configureStore } from "@reduxjs/toolkit";
import optionsSlice from "../../../src/redux/optionsSlice";
import { store } from "../../../src/redux/store";
import { Deck } from "../../../src/model/deck";
import { OpponentDeck } from "../../../src/model/opponentDeck";
import { DOMStore } from "../../../src/utils";

describe("resetReduxDeckState", () => {
  // Mock dependencies
  // Declare a storeMock.
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
    // Populate the store with decks that will be reset.
    storeMock.dispatch(
      setPlayerDeck(
        JSON.parse(
          JSON.stringify(
            new Deck("Title", true, "Rating", "Name", "n", ["Card1"])
          )
        )
      )
    );
    storeMock.dispatch(
      setOpponentDeck(
        JSON.parse(
          JSON.stringify(
            new OpponentDeck("Title", true, "Rating", "Opponent Name", "n", [
              "Card1",
            ])
          )
        )
      )
    );
  });

  it("should dispatch the setPlayerDeck and setOpponentDeck ActionCreators with empty decks", () => {
    // Act - call resetDeckState
    DOMObserver.resetReduxDeckState();
    // Assert
    expect(store.getState().content.playerDeck).toStrictEqual(
      JSON.parse(JSON.stringify(new EmptyDeck()))
    );
    expect(store.getState().content.opponentDeck).toStrictEqual(
      JSON.parse(JSON.stringify(new EmptyOpponentDeck()))
    );
  });
});
