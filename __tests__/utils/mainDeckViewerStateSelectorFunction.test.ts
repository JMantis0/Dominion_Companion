import { beforeEach, describe, expect, it } from "@jest/globals";
import { configureStore } from "@reduxjs/toolkit";
import contentSlice, {
  initialState as initialContentState,
} from "../../src/redux/contentSlice";
import optionsSlice from "../../src/redux/optionsSlice";
import { DOMStore, MainDeckViewerState } from "../../src/utils";
import { Deck } from "../../src/model/deck";
import { mainDeckViewerStateSelectorFunction } from "../../src/utils/utils";

describe("mainDeckViewerStateSelectorFunction", () => {
  let store: DOMStore;
  beforeEach(() => {
    // Initialize a new redux store with some altered initial state.
    store = configureStore({
      reducer: { content: contentSlice, options: optionsSlice },
      middleware: [],
      preloadedState: {
        content: {
          ...initialContentState,
          playerDeck: JSON.parse(
            JSON.stringify(
              new Deck("MockTitle", false, "MockRating", "Player Name", "P", [])
            )
          ),
          topCardsLookAmount: 2,
          turnToggleButton: "Next",
        },
      },
    });
  });
  it("should return an object with the mainDeckViewerState portion of the given redux state", () => {
    // Arrangement done in the beforeEach callback

    // Construct the expected state object
    const expected: MainDeckViewerState = {
      deck: {
        entireDeck: [
          "Estate",
          "Copper",
          "Estate",
          "Copper",
          "Estate",
          "Copper",
          "Copper",
          "Copper",
          "Copper",
          "Copper",
        ],
        library: [
          "Estate",
          "Copper",
          "Estate",
          "Copper",
          "Estate",
          "Copper",
          "Copper",
          "Copper",
          "Copper",
          "Copper",
        ],
        graveyard: [],
        hand: [],
        inPlay: [],
        setAside: [],
      },
      playerName: "Player Name",
      topCardsLookAmount: 2,
      turnToggleButton: "Next",
    };

    // Act and Assert - Confirm the state is correctly returned.
    expect(expected).toStrictEqual(
      mainDeckViewerStateSelectorFunction(store.getState())
    );
  });
});
