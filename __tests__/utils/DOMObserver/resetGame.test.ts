/**
 * @jest-environment jsdom
 */
import { describe, expect, it, jest } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";
import { setBaseOnly } from "../../../src/redux/contentSlice";

describe("resetGame", () => {
  // Mock static methods
  const setLogInitialized = jest.spyOn(DOMObserver, "setLogInitialized");
  const setPlayersInitialized = jest.spyOn(
    DOMObserver,
    "setPlayersInitialized"
  );
  const setDecksInitialized = jest.spyOn(DOMObserver, "setDecksInitialized");
  const setKingdomInitialized = jest.spyOn(
    DOMObserver,
    "setKingdomInitialized"
  );
  const setLogsProcessed = jest.spyOn(DOMObserver, "setLogsProcessed");
  const setGameLog = jest.spyOn(DOMObserver, "setGameLog");
  const setPlayerName = jest.spyOn(DOMObserver, "setPlayerName");
  const setOpponentName = jest.spyOn(DOMObserver, "setOpponentName");
  const setDecks = jest.spyOn(DOMObserver, "setDecks");
  const setKingdom = jest.spyOn(DOMObserver, "setKingdom");
  const setBaseOnlyDomObserver = jest.spyOn(DOMObserver, "setBaseOnly");
  const dispatch = jest.spyOn(DOMObserver, "dispatch");
  const setBaseOnlyRedux = jest.spyOn(setBaseOnly) as jest.MockedFunction<
    typeof setBaseOnly
  >;
  const observerDisconnect = jest.spyOn(
    MutationObserver.prototype,
    "disconnect"
  );

  it("should set the 'initialized' fields to false, assign empty strings to the logsProcessed, gameLog, playerName, and opponentName fields, assign a new Map to the decks field, set the kingdom to an empty array, set baseOnly to true, dispatch the setBaseOnly ActionCreator with payload of true, and disconnect the any mutation observers", () => {
    DOMObserver.resetGame();
    expect(setPlayersInitialized).toBeCalledWith(false);
    expect(setLogInitialized).toBeCalledWith(false);
    expect(setKingdomInitialized).toBeCalledWith(false);
    expect(setDecksInitialized).toBeCalledWith(false);
    expect(setLogsProcessed).toBeCalledWith("");
    expect(setGameLog).toBeCalledWith("");
    expect(setPlayerName).toBeCalledWith("");
    expect(setOpponentName).toBeCalledWith("");
    expect(setDecks).toBeCalledWith(new Map());
    expect(setKingdom).toBeCalledWith([]);
    expect(setBaseOnlyDomObserver).toBeCalledWith(true);
    expect(dispatch).toBeCalledWith(setBaseOnlyRedux(true));
    expect(setBaseOnlyRedux).toBeCalledWith(true);
    expect(observerDisconnect).not.toBeCalled();
  });
});
