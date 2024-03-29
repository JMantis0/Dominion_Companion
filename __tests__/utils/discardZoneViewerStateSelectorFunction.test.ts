import { beforeEach, describe, it, expect } from "@jest/globals";
import { DOMStore } from "../../src/utils";
import { configureStore } from "@reduxjs/toolkit";
import contentSlice, { setPlayerDeck } from "../../src/redux/contentSlice";
import optionsSlice from "../../src/redux/optionsSlice";
import { Deck } from "../../src/model/deck";
import { act } from "@testing-library/react";
import { discardZoneViewerStateSelectorFunction } from "../../src/utils/utils";

describe("discardZoneViewerStateSelectorFunction", () => {
  // Declare a redux store
  let store: DOMStore;

  beforeEach(() => {
    // Initialize a new redux store before each test.
    store = configureStore({
      reducer: { content: contentSlice, options: optionsSlice },
      middleware: [],
    });
  });

  it("should return an object containing the portions of the redux state needed for the DiscardZoneViewer component", () => {
    // Arrange
    // Mock a value for state.content.playerDeck
    const playerDeck = new Deck(
      "MockTitle",
      false,
      "MockRating",
      "Player",
      "P",
      []
    );
    playerDeck.setGraveyard(["Vassal", "Sentry"]);

    // Dispatch the mocked values to the redux store
    act(() => {
      store.dispatch(setPlayerDeck(playerDeck));
    });

    // Get the state after dispatching the mock values
    const state = store.getState();

    // Act and Assert - Verify the returned state is correct.
    expect(discardZoneViewerStateSelectorFunction(state)).toStrictEqual({
      playerName: "Player",
      graveyard: ["Vassal", "Sentry"],
    });
  });
});
