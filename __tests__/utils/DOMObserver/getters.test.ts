/**
 * @jest-environment jsdom
 */
import { describe, it, expect } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";
import { OpponentDeck } from "../../../src/model/opponentDeck";
import { Deck } from "../../../src/model/deck";
import { store } from "../../../src/redux/store";
import { configureStore } from "@reduxjs/toolkit";
import contentSlice, { setError } from "../../../src/redux/contentSlice";
import optionsSlice from "../../../src/redux/optionsSlice";

describe("getters", () => {
  it("should return field values correctly", () => {
    const d = DOMObserver;
    // baseOnly field
    d.baseOnly = true;
    expect(d.getBaseOnly()).toBe(true);

    // decks Field
    d.decks = new Map([
      [
        "Player",
        new Deck("Title", false, "Rating", "Player", "P", ["Kingdom"]),
      ],
      [
        "Opponent",
        new OpponentDeck("Title", false, "Rating", "Opponent", "O", [
          "Kingdom",
        ]),
      ],
    ]);
    expect(d.getDecks()).toStrictEqual(
      new Map([
        [
          "Player",
          new Deck("Title", false, "Rating", "Player", "P", ["Kingdom"]),
        ],
        [
          "Opponent",
          new OpponentDeck("Title", false, "Rating", "Opponent", "O", [
            "Kingdom",
          ]),
        ],
      ])
    );

    // decksInitialized field
    d.decksInitialized = true;
    expect(d.getDecksInitialized()).toBe(true);

    // dispatch field
    expect(d.getDispatch()).toBe(store.dispatch);

    // gameEndObserver field
    const nullCallback2 = () => {
      const a = null;
      return a;
    };
    d.gameEndObserver = new MutationObserver(nullCallback2);
    expect(d.getGameEndObserver()).toStrictEqual(
      new MutationObserver(nullCallback2)
    );

    // gameLog field
    d.gameLog = "Log1\nLog2\nLog3";
    expect(d.getGameLog()).toBe("Log1\nLog2\nLog3");

    // gameLogObserver field
    const nullCallback = () => null;
    d.gameLogObserver = new MutationObserver(nullCallback);
    expect(d.getGameLogObserver()).toStrictEqual(
      new MutationObserver(nullCallback)
    );

    // initInterval field
    d.initInterval = 12345;
    expect(d.getInitInterval()).toBe(12345);

    // kingdom fields
    d.kingdom = ["Card1", "Card2"];
    expect(d.getKingdom()).toStrictEqual(["Card1", "Card2"]);

    // kingdomInitialized field
    d.kingdomInitialized = true;
    expect(d.getKingdomInitialized()).toBe(true);

    // logsInitialized field
    d.logInitialized = true;
    expect(d.getLogInitialized()).toBe(true);

    // logsProcessed field
    d.logsProcessed = "Log1\nLog2\nLog3\nLog4";
    expect(d.getLogsProcessed()).toBe("Log1\nLog2\nLog3\nLog4");

    // opponentName field
    d.opponentName = "Peter Piper";
    expect(d.getOpponentName()).toBe("Peter Piper");

    // opponentNick field
    d.opponentNick = "Op";
    expect(d.getOpponentNick()).toBe("Op");

    // opponentRating field
    d.opponentRating = "12345";
    expect(d.getOpponentRating()).toBe("12345");

    // playersInitialized field
    d.playersInitialized = true;
    expect(d.getPlayersInitialized()).toBe(true);

    // playerName field
    d.playerName = "Alexa";
    expect(d.getPlayerName()).toBe("Alexa");

    // playerNick field
    d.playerNick = "Al";
    expect(d.getPlayerNick()).toBe("Al");

    // playerRating field
    d.playerRating = "54321";
    expect(d.getPlayerRating()).toBe("54321");

    // ratedGame field
    d.ratedGame = true;
    expect(d.getRatedGame()).toBe(true);

    // resetInterval field
    d.resetInterval = 555;
    expect(d.getResetInterval()).toBe(555);

    // store field
    const storeMock = configureStore({
      reducer: { content: contentSlice, options: optionsSlice },
      middleware: [],
    });
    // Set DOMObserver to use the mock store and mock dispatch
    d.store = storeMock;
    // Change the store state to verify the store getter is working.
    storeMock.dispatch(setError("MockError"));
    expect(d.store).toStrictEqual(storeMock);

    // undoObserver field
    const nullCallback3 = () => {
      const b = null;
      return b;
    };
    d.undoObserver = new MutationObserver(nullCallback3);
    expect(d.getUndoObserver()).toStrictEqual(
      new MutationObserver(nullCallback3)
    );
  });
});
