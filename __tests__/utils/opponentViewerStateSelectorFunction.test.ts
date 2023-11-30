import { describe, it, expect, beforeEach } from "@jest/globals";
import { opponentViewerStateSelectorFunction } from "../../src/utils/utils";
import { act } from "@testing-library/react";
import optionsSlice from "../../src/redux/optionsSlice";
import { OpponentDeck } from "../../src/model/opponentDeck";
import { DOMStore, OpponentStoreDeck, SortButtonState } from "../../src/utils";
import contentSlice, {
  setOpponentSortState,
  setOpponentDecks,
} from "../../src/redux/contentSlice";
import { configureStore } from "@reduxjs/toolkit";

describe("opponentViewerStateSelectorFunction", () => {
  // Declare a redux store
  let store: DOMStore;

  beforeEach(() => {
    // Initialize a new redux store before each test.
    store = configureStore({
      reducer: { content: contentSlice, options: optionsSlice },
      middleware: [],
    });
  });

  it("should return an object with the opponentDecks and opponentSortState of the given redux state", () => {
    //  Arrange
    // Mock a value for state.content.opponentDecks
    const mockOpponentDecks: OpponentStoreDeck[] = [
      JSON.parse(
        JSON.stringify(
          new OpponentDeck(
            "MockTitle",
            false,
            "MockRating1",
            "Opponent 1",
            "O1",
            []
          )
        )
      ),
      JSON.parse(
        JSON.stringify(
          new OpponentDeck(
            "MockTitle",
            false,
            "MockRating1",
            "Opponent 1",
            "O1",
            []
          )
        )
      ),
    ];

    // Mock value for state.content.opponentSortState
    const mockOpponentSortState: SortButtonState = {
      category: "zone",
      sort: "descending",
    };
    // Dispatch values to the redux state.
    act(() => {
      store.dispatch(setOpponentDecks(mockOpponentDecks));
      store.dispatch(setOpponentSortState(mockOpponentSortState));
    });

    // Get the state after dispatching the mocked values.
    const state = store.getState();

    // Construct an expected deckData array.
    const expectedOpponentDeckData: Array<{
      playerName: string;
      entireDeck: string[];
    }> = [];
    mockOpponentDecks.forEach((deck) => {
      const deckData: {
        playerName: string;
        entireDeck: string[];
      } = {
        playerName: deck.playerName,
        entireDeck: deck.entireDeck,
      };
      expectedOpponentDeckData.push(deckData);
    });

    // Act - Get the opponentViewerState
    const opponentViewerState: {
      opponentDeckData: Array<{ playerName: string; entireDeck: string[] }>;
      opponentSortState: SortButtonState;
    } = opponentViewerStateSelectorFunction(state);

    // Assert - Verify the object contains the correct state.
    expect(opponentViewerState).toStrictEqual({
      opponentDeckData: expectedOpponentDeckData,
      opponentSortState: mockOpponentSortState,
    });
  });
});
