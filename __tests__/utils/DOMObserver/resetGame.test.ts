/**
 * @jest-environment jsdom
 */
import { afterEach, describe, expect, it, jest } from "@jest/globals";
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
  const setBaseOnlyRedux = setBaseOnly as jest.MockedFunction<
    typeof setBaseOnly
  >;
  const observerDisconnect = jest.spyOn(
    MutationObserver.prototype,
    "disconnect"
  );

  afterEach(() => {
    jest.clearAllMocks();
    DOMObserver.undoObserver = undefined;
    DOMObserver.gameEndObserver = undefined;
    DOMObserver.gameLogObserver = undefined;
  });

  it("should set the 'initialized' fields to false, assign empty strings to the logsProcessed, gameLog, playerName, and opponentName fields, assign a new Map to the decks field, set the kingdom to an empty array, set baseOnly to true, dispatch the setBaseOnly ActionCreator with payload of true, and disconnect the any mutation observers", () => {
    // Act - Simulate reset the game when no MutationObservers are assigned.
    DOMObserver.resetGame();

    // Assert
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
    expect(observerDisconnect).not.toBeCalled();
    expect(setPlayersInitialized).toBeCalledTimes(1);
    expect(setLogInitialized).toBeCalledTimes(1);
    expect(setKingdomInitialized).toBeCalledTimes(1);
    expect(setDecksInitialized).toBeCalledTimes(1);
    expect(setLogsProcessed).toBeCalledTimes(1);
    expect(setGameLog).toBeCalledTimes(1);
    expect(setPlayerName).toBeCalledTimes(1);
    expect(setOpponentName).toBeCalledTimes(1);
    expect(setDecks).toBeCalledTimes(1);
    expect(setKingdom).toBeCalledTimes(1);
    expect(setBaseOnlyDomObserver).toBeCalledTimes(1);
    expect(dispatch).toBeCalledTimes(1);
    expect(observerDisconnect).not.toBeCalled();
  });

  it("case where undoObserver is not undefined and the other 2 are undefined", () => {
    // Arrange
    DOMObserver.undoObserver = new MutationObserver(() => null);
    
    // Act - reset the game when the undoObserver is defined.
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
    expect(observerDisconnect).toBeCalledTimes(1);
    expect(setPlayersInitialized).toBeCalledTimes(1);
    expect(setLogInitialized).toBeCalledTimes(1);
    expect(setKingdomInitialized).toBeCalledTimes(1);
    expect(setDecksInitialized).toBeCalledTimes(1);
    expect(setLogsProcessed).toBeCalledTimes(1);
    expect(setGameLog).toBeCalledTimes(1);
    expect(setPlayerName).toBeCalledTimes(1);
    expect(setOpponentName).toBeCalledTimes(1);
    expect(setDecks).toBeCalledTimes(1);
    expect(setKingdom).toBeCalledTimes(1);
    expect(setBaseOnlyDomObserver).toBeCalledTimes(1);
    expect(dispatch).toBeCalledTimes(1);
  });

  it("case where gameLogObserver is not undefined and the other 2 are undefined", () => {
    // Arrange
    DOMObserver.gameLogObserver = new MutationObserver(() => null);

    // Act - reset the game when the gameLogObserver is defined.
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
    expect(observerDisconnect).toBeCalledTimes(1);
    expect(setPlayersInitialized).toBeCalledTimes(1);
    expect(setLogInitialized).toBeCalledTimes(1);
    expect(setKingdomInitialized).toBeCalledTimes(1);
    expect(setDecksInitialized).toBeCalledTimes(1);
    expect(setLogsProcessed).toBeCalledTimes(1);
    expect(setGameLog).toBeCalledTimes(1);
    expect(setPlayerName).toBeCalledTimes(1);
    expect(setOpponentName).toBeCalledTimes(1);
    expect(setDecks).toBeCalledTimes(1);
    expect(setKingdom).toBeCalledTimes(1);
    expect(setBaseOnlyDomObserver).toBeCalledTimes(1);
    expect(dispatch).toBeCalledTimes(1);
  });

  it("case where gameEndObserver is not undefined and the other 2 are undefined", () => {
    // Arrange
    DOMObserver.gameEndObserver = new MutationObserver(() => null);

    // Act - reset the game when the gameLogObserver is defined.
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
    expect(observerDisconnect).toBeCalledTimes(1);
    expect(setPlayersInitialized).toBeCalledTimes(1);
    expect(setLogInitialized).toBeCalledTimes(1);
    expect(setKingdomInitialized).toBeCalledTimes(1);
    expect(setDecksInitialized).toBeCalledTimes(1);
    expect(setLogsProcessed).toBeCalledTimes(1);
    expect(setGameLog).toBeCalledTimes(1);
    expect(setPlayerName).toBeCalledTimes(1);
    expect(setOpponentName).toBeCalledTimes(1);
    expect(setDecks).toBeCalledTimes(1);
    expect(setKingdom).toBeCalledTimes(1);
    expect(setBaseOnlyDomObserver).toBeCalledTimes(1);
    expect(dispatch).toBeCalledTimes(1);
  });

  it("case where all 3 mutation observers are not undefined", () => {
    // Arrange
    DOMObserver.gameEndObserver = new MutationObserver(() => null);
    DOMObserver.gameLogObserver = new MutationObserver(() => null);
    DOMObserver.undoObserver = new MutationObserver(() => null);

    // Act - reset the game when the gameLogObserver is defined.
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
    expect(observerDisconnect).toBeCalledTimes(3);
    expect(setPlayersInitialized).toBeCalledTimes(1);
    expect(setLogInitialized).toBeCalledTimes(1);
    expect(setKingdomInitialized).toBeCalledTimes(1);
    expect(setDecksInitialized).toBeCalledTimes(1);
    expect(setLogsProcessed).toBeCalledTimes(1);
    expect(setGameLog).toBeCalledTimes(1);
    expect(setPlayerName).toBeCalledTimes(1);
    expect(setOpponentName).toBeCalledTimes(1);
    expect(setDecks).toBeCalledTimes(1);
    expect(setKingdom).toBeCalledTimes(1);
    expect(setBaseOnlyDomObserver).toBeCalledTimes(1);
    expect(dispatch).toBeCalledTimes(1);
  });
});
