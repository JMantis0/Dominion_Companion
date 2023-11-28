/**
 * @jest-environment jsdom
 */
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";
import contentSlice, {
  setBaseOnly,
  setError,
} from "../../../src/redux/contentSlice";
import { OpponentDeck } from "../../../src/model/opponentDeck";
import { Deck } from "../../../src/model/deck";
import { DOMStore } from "../../../src/utils";
import { configureStore } from "@reduxjs/toolkit";
import optionsSlice from "../../../src/redux/optionsSlice";

describe("resetGame", () => {
  // Spy on the MutationObserver method disconnect
  const observerDisconnect = jest.spyOn(
    MutationObserver.prototype,
    "disconnect"
  );
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

    // Populate the DOMObserver fields and redux state with values that need to be reset by resetGame.
    DOMObserver.undoObserver = undefined;
    DOMObserver.gameEndObserver = undefined;
    DOMObserver.gameLogObserver = undefined;
    DOMObserver.playersInitialized = true;
    DOMObserver.logInitialized = true;
    DOMObserver.kingdomInitialized = true;
    DOMObserver.decksInitialized = true;
    DOMObserver.logsProcessed = "Log1\nLog2\nLog3\nLog4";
    DOMObserver.gameLog = "Log1\nLog2\nLog3\nLog4";
    DOMObserver.playerName = "Player Name";
    DOMObserver.playerNick = "P";
    DOMObserver.playerRating = "321";
    DOMObserver.opponentNames = ["Opponent Name1", "Opponent Name2"];
    DOMObserver.opponentNicks = ["O1", "O2"];
    DOMObserver.opponentRatings = ["O1Rating", "O2Rating"];
    DOMObserver.decks = new Map([
      [
        DOMObserver.playerName,
        new Deck("Title", false, "321", DOMObserver.playerName, "P", []),
      ],
      [
        DOMObserver.opponentNames[0],
        new OpponentDeck(
          "",
          false,
          DOMObserver.opponentRatings[0],
          DOMObserver.opponentNames[0],
          DOMObserver.opponentNicks[0],
          []
        ),
      ],
      [
        DOMObserver.opponentNames[1],
        new OpponentDeck(
          "",
          false,
          DOMObserver.opponentRatings[1],
          DOMObserver.opponentNames[1],
          DOMObserver.opponentNicks[1],
          []
        ),
      ],
    ]);
    DOMObserver.kingdom = ["Card1", "Card2"];
    DOMObserver.baseOnly = false;
    DOMObserver.gameEndObserver = new MutationObserver(() => null);
    DOMObserver.gameEndObserver.observe(document.body, { childList: true });
    DOMObserver.gameLogObserver = new MutationObserver(() => null);
    DOMObserver.gameLogObserver.observe(document.body, { childList: true });
    DOMObserver.undoObserver = new MutationObserver(() => null);
    console.log(DOMObserver.undoObserver);
    DOMObserver.undoObserver.observe(document.body, { childList: true });
    storeMock.dispatch(setBaseOnly(false));
    storeMock.dispatch(setError("MockError"));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it(
    "should set the 'initialized' fields to false, assign empty strings to the logsProcessed, gameLog, playerName, and opponentName fields, " +
      "assign a new Map to the decks field, set the kingdom to an empty array, set baseOnly to true, dispatch the setBaseOnly ActionCreator with " +
      "payload of true, and disconnect the any mutation observers",
    () => {
      // Arrangement takes place in the above beforeEach clause.
      // Act - Simulate reset the game when no MutationObservers are assigned.
      DOMObserver.resetGame();

      // Assert
      expect(DOMObserver.playersInitialized).toBe(false);
      expect(DOMObserver.logInitialized).toBe(false);
      expect(DOMObserver.kingdomInitialized).toBe(false);
      expect(DOMObserver.decksInitialized).toBe(false);
      expect(DOMObserver.logsProcessed).toBe("");
      expect(DOMObserver.gameLog).toBe("");
      expect(DOMObserver.playerName).toBe("");
      expect(DOMObserver.playerNick).toBe("");
      expect(DOMObserver.playerRating).toBe("");
      expect(DOMObserver.opponentNames).toStrictEqual([]);
      expect(DOMObserver.opponentNicks).toStrictEqual([]);
      expect(DOMObserver.opponentRatings).toStrictEqual([]);
      expect(DOMObserver.decks).toStrictEqual(
        new Map([
          ["", new Deck("", false, "", "", "", [])],
          ["", new OpponentDeck("", false, "", "", "", [])],
        ])
      );
      expect(DOMObserver.kingdom).toStrictEqual([]);
      expect(DOMObserver.baseOnly).toBe(true);
      expect(storeMock.getState().content.baseOnly).toBe(true);
      expect(storeMock.getState().content.error).toBe(null);
      expect(DOMObserver.gameLogObserver).toBe(undefined);
      expect(DOMObserver.gameEndObserver).toBe(undefined);
      expect(DOMObserver.undoObserver).toBe(undefined);
      expect(observerDisconnect).toBeCalledTimes(3);
    }
  );
});
