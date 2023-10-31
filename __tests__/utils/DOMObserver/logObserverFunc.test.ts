import { describe, jest, it, expect, afterEach } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";
import { EmptyDeck } from "../../../src/model/emptyDeck";
import { EmptyOpponentDeck } from "../../../src/model/emptyOpponentDeck";
import {
  setOpponentDeck,
  setPlayerDeck,
} from "../../../src/redux/contentSlice";

describe("logObserverFunc", () => {
  // Mock dependencies
  const areNewLogsToSend = jest.spyOn(DOMObserver, "areNewLogsToSend");
  const getClientGameLog = jest.spyOn(DOMObserver, "getClientGameLog");
  const getNewLogsAndUpdateDecks = jest
    .spyOn(DOMObserver, "getNewLogsAndUpdateDecks")
    .mockImplementation(() => {
      return {
        playerStoreDeck: new EmptyDeck(),
        opponentStoreDeck: new EmptyOpponentDeck(),
      };
    });
  const dispatchUpdatedDecksToRedux = jest
    .spyOn(DOMObserver, "dispatchUpdatedDecksToRedux")
    .mockImplementation(() => null);

  afterEach(() => {
    DOMObserver.resetGame();
    jest.clearAllMocks();
  });

  it("should not trigger any updates if there are no new logs to send", () => {
    // Arrange a scenario where there are no new logs to send
    getClientGameLog.mockImplementation(() => "Log1");
    DOMObserver.logsProcessed = "Log1";
    // Act - simulate a mutation in the game log element when there are no new logs to process
    DOMObserver.logObserverFunc();
    // Assert
    expect(areNewLogsToSend).toBeCalledTimes(1);
    expect(areNewLogsToSend).toBeCalledWith("Log1", "Log1");
    expect(getClientGameLog).toBeCalledTimes(1);
    expect(getNewLogsAndUpdateDecks).not.toBeCalled();
    expect(dispatchUpdatedDecksToRedux).not.toBeCalled();
  });

  it("should not get the new logs and update decks when there are new logs", () => {
    // Arrange a scenario where there are some new logs to send
    getClientGameLog.mockImplementation(() => "Log1\nLog2\nLog3\nLog4");
    DOMObserver.logsProcessed = "Log1";

    // Act - simulate a mutation in the game log element when there are some new logs to process
    DOMObserver.logObserverFunc();

    // Assert
    expect(areNewLogsToSend).toBeCalledTimes(1);
    expect(areNewLogsToSend).toBeCalledWith("Log1", "Log1\nLog2\nLog3\nLog4");
    expect(getClientGameLog).toBeCalledTimes(2);
    expect(getNewLogsAndUpdateDecks).toBeCalledTimes(1);
    expect(getNewLogsAndUpdateDecks).toBeCalledWith(
      "Log1",
      "Log1\nLog2\nLog3\nLog4",
      DOMObserver.getUndispatchedLogs,
      DOMObserver.decks,
      DOMObserver.playerName,
      DOMObserver.opponentName
    );
    expect(dispatchUpdatedDecksToRedux).toBeCalledTimes(1);
    expect(dispatchUpdatedDecksToRedux).toBeCalledWith(
      DOMObserver.dispatch,
      setPlayerDeck,
      setOpponentDeck,
      new EmptyDeck(),
      new EmptyOpponentDeck()
    );
    expect(DOMObserver.logsProcessed).toBe("Log1\nLog2\nLog3\nLog4");
  });
});
