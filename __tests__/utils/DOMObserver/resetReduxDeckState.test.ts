import { describe, it, expect, beforeEach } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";
import {
  ContentState,
  setOpponentDeck,
  setPlayerDeck,
} from "../../../src/redux/contentSlice";
import { EmptyOpponentDeck } from "../../../src/model/emptyOpponentDeck";
import { EmptyDeck } from "../../../src/model/emptyDeck";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";
import { OptionsState } from "../../../src/redux/optionsSlice";
import { AnyAction } from "redux";
import { ThunkMiddleware } from "@reduxjs/toolkit";
import { store } from "../../../src/redux/store";
import { Deck } from "../../../src/model/deck";
import { OpponentDeck } from "../../../src/model/opponentDeck";

describe("resetReduxDeckState", () => {
  // Mock dependencies
  // Declare a storeMock.
  let storeMock: ToolkitStore<
    {
      content: ContentState;
      options: OptionsState;
    },
    AnyAction,
    [
      ThunkMiddleware<
        {
          content: ContentState;
          options: OptionsState;
        },
        AnyAction
      >
    ]
  >;

  beforeEach(() => {
    // Instantiate a storeMock.
    storeMock = store;
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
