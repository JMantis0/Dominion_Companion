/**
 * @jest-environment jsdom
 */
import { describe, it, expect } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";
import { OpponentDeck } from "../../../src/model/opponentDeck";
import { Deck } from "../../../src/model/deck";
import { store } from "../../../src/redux/store";
import { configureStore } from "@reduxjs/toolkit";
import contentSlice from "../../../src/redux/contentSlice";
import optionsSlice from "../../../src/redux/optionsSlice";

describe("DOMObserver setters", () => {
  it("should set field the values correctly", () => {
    const d = DOMObserver;

    // baseOnly field
    d.setBaseOnly(true);
    expect(d.baseOnly).toBe(true);

    // decks field
    const pDeck = new Deck("Title", true, "123", "Player", "P", ["Kingdom"]);
    const oDeck = new OpponentDeck("Title", true, "321", "Opponent", "O", [
      "Kingdom",
    ]);
    const decks = new Map([
      ["Player", pDeck],
      ["Opponent", oDeck],
    ]);
    d.setDecks(decks);
    expect(d.decks).toStrictEqual(decks);

    // decksInitialized field
    d.setDecksInitialized(true);
    expect(d.decksInitialized).toBe(true);

    // dispatch field
    d.setDispatch(store.dispatch);
    expect(d.dispatch).toStrictEqual(store.dispatch);

    // gameEndObserver field
    const nullCallback = () => null;
    d.setGameEndObserver(new MutationObserver(nullCallback));

    // gameLog field
    d.setGameLog("Log1\nLog2\nLogN");
    expect(d.gameLog).toBe("Log1\nLog2\nLogN");

    // gameLogObserver field
    const nullCallback2 = () => {
      const a = null;
      return a;
    };
    d.setGameLogObserver(new MutationObserver(nullCallback2));
    expect(d.gameLogObserver).toStrictEqual(
      new MutationObserver(nullCallback2)
    );

    // initInterval field
    d.setInitInterval(12345);
    expect(d.initInterval).toBe(12345);

    // kingdom field
    d.setKingdom(["Card1", "Card2", "Card3"]);
    expect(d.kingdom).toStrictEqual(["Card1", "Card2", "Card3"]);

    // kingdomInitialized field
    d.setKingdomInitialized(true);
    expect(d.kingdomInitialized).toBe(true);

    // logInitialized field
    d.setLogInitialized(true);
    expect(d.logInitialized).toBe(true);

    // logsProcessed field
    d.setLogsProcessed("Log1\nLog2\nLog3\nLogN");
    expect(d.logsProcessed).toBe("Log1\nLog2\nLog3\nLogN");

    // opponentName field
    d.setOpponentName("Opponent");
    expect(d.opponentName).toBe("Opponent");

    // opponentNick field
    d.setOpponentNick("O");
    expect(d.opponentNick).toBe("O");

    // opponentRating field
    d.setOpponentRating("123456");
    expect(d.opponentRating).toBe("123456");

    // playersInitialized field
    d.setPlayersInitialized(true);
    expect(d.playersInitialized).toBe(true);

    // playerName field
    d.setPlayerName("Player");
    expect(d.playerName).toBe("Player");

    // playerNick field
    d.setPlayerNick("P");
    expect(d.playerNick).toBe("P");

    // playerRating field
    d.setPlayerRating("654321");
    expect(d.playerRating).toBe("654321");

    // ratedGame field
    d.setRatedGame(true);
    expect(d.ratedGame).toBe(true);

    // resetInterval field
    d.setResetInterval(12345);
    expect(d.resetInterval).toBe(12345);

    // store field
    const storeMock = configureStore({
      reducer: { content: contentSlice, options: optionsSlice },
      middleware: [],
    });
    d.setStore(storeMock);
    expect(d.store).toStrictEqual(storeMock);

    // undoObserver field
    const nullCallback3 = () => {
      const b = null;
      return b;
    };
    d.setUndoObserver(new MutationObserver(nullCallback3));
    expect(d.undoObserver).toStrictEqual(new MutationObserver(nullCallback3));
  });
});
