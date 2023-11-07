import { describe, expect, it, jest } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";
import { OpponentDeck } from "../../../src/model/opponentDeck";
import { Deck } from "../../../src/model/deck";
import { afterEach } from "node:test";

describe("Function getNewLogsAndUpdateDecks", () => {
  // Spy on function dependencies.
  let oDeck = new OpponentDeck("", false, "", "oName", "oNick", []);
  let pDeck = new Deck("", false, "", "pName", "pNick", []);
  let deckMap = new Map<string, Deck | OpponentDeck>();
  deckMap.set(oDeck.playerName, oDeck);
  deckMap.set(pDeck.playerName, pDeck);
  const getUndispatchedLogsMock = jest.fn() as jest.MockedFunction<
    typeof DOMObserver.getUndispatchedLogs
  >;
  getUndispatchedLogsMock.mockImplementation(
    (logsProcessed: string, gameLog: string) =>
      DOMObserver.getUndispatchedLogs(logsProcessed, gameLog)
  ); // Mocking with actual implementation
  const updateOpponentDeck = jest.spyOn(OpponentDeck.prototype, "update");
  const updateDeck = jest.spyOn(Deck.prototype, "update");
  const mapGet = jest.spyOn(Map.prototype, "get");
  const handleDeckError = jest.spyOn(DOMObserver, "handleDeckError");

  afterEach(() => {
    oDeck = new OpponentDeck("", false, "", "oName", "oNick", []);
    pDeck = new Deck("", false, "", "pName", "pNick", []);
    deckMap = new Map<string, Deck | OpponentDeck>();
    deckMap.set(oDeck.playerName, oDeck);
    deckMap.set(pDeck.playerName, pDeck);
    jest.clearAllMocks();
  });

  it("should get the new game logs, call the decks' update functions with the new logs, and return the updated decks as StoreDecks.", () => {
    // Arrange
    const logsProcessed = "Log1\nLog2";
    const gameLog = "Log1\nLog2\nLog3";

    // Act - Simulate getting new log entry within the log observer mutation callback and updating the decks.
    const { playerStoreDeck, opponentStoreDeck } =
      DOMObserver.getNewLogsAndUpdateDecks(
        logsProcessed,
        gameLog,
        getUndispatchedLogsMock,
        deckMap,
        "pName",
        "oName"
      );

    // Assert
    expect(getUndispatchedLogsMock).toBeCalledTimes(1);
    expect(getUndispatchedLogsMock).toBeCalledWith(
      "Log1\nLog2",
      "Log1\nLog2\nLog3"
    );
    expect(getUndispatchedLogsMock.mock.results[0].value).toBe("Log3");
    expect(mapGet).toBeCalledTimes(4);
    expect(updateOpponentDeck).toBeCalledTimes(1);
    expect(mapGet).nthCalledWith(1, "pName");
    expect(mapGet).nthCalledWith(2, "oName");
    expect(mapGet).nthCalledWith(3, "pName");
    expect(mapGet).nthCalledWith(4, "oName");
    expect(mapGet.mock.results[0].value).toStrictEqual(pDeck);
    expect(mapGet.mock.results[1].value).toStrictEqual(oDeck);
    expect(updateDeck).toBeCalledTimes(1);
    expect(updateDeck).toBeCalledWith(["Log3"]);
    expect(updateOpponentDeck).toBeCalledTimes(1);
    expect(updateOpponentDeck).toBeCalledWith(["Log3"]);
    expect(playerStoreDeck).toStrictEqual(JSON.parse(JSON.stringify(pDeck)));
    expect(opponentStoreDeck).toStrictEqual(JSON.parse(JSON.stringify(oDeck)));
  });

  it("should get work when there are multiple new logs (newLogsToDispatch has more than 1 element).", () => {
    // Arrange
    const logsProcessed = "Log1\nLog2";
    const gameLog = "Log1\nLog2\nLog3\nLog4";

    // Act - Simulate getting new log entries within the log observer mutation callback and updating the decks.
    const { playerStoreDeck, opponentStoreDeck } =
      DOMObserver.getNewLogsAndUpdateDecks(
        logsProcessed,
        gameLog,
        getUndispatchedLogsMock,
        deckMap,
        "pName",
        "oName"
      );

    // Assert
    expect(getUndispatchedLogsMock).toBeCalledTimes(1);
    expect(getUndispatchedLogsMock).toBeCalledWith(
      "Log1\nLog2",
      "Log1\nLog2\nLog3\nLog4"
    );
    expect(getUndispatchedLogsMock.mock.results[0].value).toBe("Log3\nLog4");
    expect(mapGet).toBeCalledTimes(4);
    expect(updateOpponentDeck).toBeCalledTimes(1);
    expect(mapGet).nthCalledWith(1, "pName");
    expect(mapGet).nthCalledWith(2, "oName");
    expect(mapGet).nthCalledWith(3, "pName");
    expect(mapGet).nthCalledWith(4, "oName");
    expect(mapGet.mock.results[0].value).toStrictEqual(pDeck);
    expect(mapGet.mock.results[1].value).toStrictEqual(oDeck);
    expect(updateDeck).toBeCalledTimes(1);
    expect(updateDeck).toBeCalledWith(["Log3", "Log4"]);
    expect(updateOpponentDeck).toBeCalledTimes(1);
    expect(updateOpponentDeck).toBeCalledWith(["Log3", "Log4"]);
    expect(playerStoreDeck).toStrictEqual(JSON.parse(JSON.stringify(pDeck)));
    expect(opponentStoreDeck).toStrictEqual(JSON.parse(JSON.stringify(oDeck)));
  });

  it("should catch an error thrown by a deck's update method and call the DOMObserver errorHandler.", () => {
    // Arrange
    // Mock Implement update to throw an error.
    const error = new Error("Test error");
    updateDeck.mockImplementation(() => {
      throw error;
    });

    const logsProcessed = "Log1\nLog2";
    const gameLog = "Log1\nLog2\nLog3\nLog4";

    // Act - Simulate an error being thrown by the player deck's update method..
    DOMObserver.getNewLogsAndUpdateDecks(
      logsProcessed,
      gameLog,
      getUndispatchedLogsMock,
      deckMap,
      "pName",
      "oName"
    );

    expect(handleDeckError).toBeCalled();
  });

  it("should catch an error thrown by a opponent deck's update method and call the DOMObserver errorHandler.", () => {
    // Arrange
    // Mock Implement update to throw an error.
    const error = new Error("Test error");
    updateOpponentDeck.mockImplementation(() => {
      throw error;
    });

    const logsProcessed = "Log1\nLog2";
    const gameLog = "Log1\nLog2\nLog3\nLog4";

    // Act - Simulate an error being thrown by the player deck's update method..
    DOMObserver.getNewLogsAndUpdateDecks(
      logsProcessed,
      gameLog,
      getUndispatchedLogsMock,
      deckMap,
      "pName",
      "oName"
    );

    expect(handleDeckError).toBeCalled();
  });
});
