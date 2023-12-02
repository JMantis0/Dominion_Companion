import { beforeEach, describe, expect, it } from "@jest/globals";
import { trashZoneViewerStateSelectorFunction } from "../../src/utils/utils";
import { DOMStore, OpponentStoreDeck, StoreDeck } from "../../src/utils";
import { configureStore } from "@reduxjs/toolkit";
import contentSlice, {
  setOpponentDecks,
  setPlayerDeck,
} from "../../src/redux/contentSlice";
import optionsSlice from "../../src/redux/optionsSlice";
import { OpponentDeck } from "../../src/model/opponentDeck";
import { Deck } from "../../src/model/deck";
import { act } from "@testing-library/react";

describe("trashZoneViewerStateSelectorFunction", () => {
  let store: DOMStore;

  beforeEach(() => {
    store = configureStore({
      reducer: { content: contentSlice, options: optionsSlice },
      middleware: [],
    });
  });
  it(
    "should return the correct portion of the redux store needed " +
      "by the TrashZoneViewer component",
    () => {
      // Arrange a deck and opponentDecks with trashed cards.
      const pDeck = new Deck(
        "MockTitle",
        false,
        "MockRating",
        "Player Name",
        "P",
        []
      );
      const oDeck1 = new OpponentDeck(
        "MockTitle",
        false,
        "MockRating1",
        "Opponent 1",
        "O1",
        []
      );
      const oDeck2 = new OpponentDeck(
        "MockTitle",
        false,
        "MockRating2",
        "Opponent 2",
        "O2",
        []
      );
      pDeck.setTrash(["Bureaucrat"]);
      oDeck1.setTrash(["Copper", "Copper"]);
      oDeck2.setTrash(["Estate", "Estate"]);

      // Convert decks to storeDecks
      const pStoreDeck = pDeck as StoreDeck;
      const oStoreDeck1 = oDeck1 as OpponentStoreDeck;
      const oStoreDeck2 = oDeck2 as OpponentStoreDeck;

      // Dispatch the decks to the redux state
      act(() => {
        store.dispatch(setPlayerDeck(pStoreDeck));
        store.dispatch(setOpponentDecks([oStoreDeck1, oStoreDeck2]));
      });

      // Get the state
      const state = store.getState();

      // Act and Assert - Select the TrashZoneViewer state and verify it is correct
      expect(trashZoneViewerStateSelectorFunction(state)).toStrictEqual({
        playerName: "Player Name",
        playerTrash: ["Bureaucrat"],
        opponentTrashData: [
          { playerName: "Opponent 1", trashZone: ["Copper", "Copper"] },
          { playerName: "Opponent 2", trashZone: ["Estate", "Estate"] },
        ],
      });
    }
  );
});
