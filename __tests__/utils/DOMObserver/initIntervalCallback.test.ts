/**
 * @jest-environment jsdom
 */
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";
import { setGameActiveStatus } from "../../../src/redux/contentSlice";

describe("initIntervalCallback", () => {
  // Mock dependencies
  const resetGame = jest
    .spyOn(DOMObserver, "resetGame")
    .mockImplementation(() => {});
  const logInitializer = jest
    .spyOn(DOMObserver, "logInitializer")
    .mockImplementation(() => {});
  const playersInitializer = jest
    .spyOn(DOMObserver, "playersInitializer")
    .mockImplementation(() => {});
  const kingdomInitializer = jest
    .spyOn(DOMObserver, "kingdomInitializer")
    .mockImplementation(() => {});
  const deckMapInitializer = jest
    .spyOn(DOMObserver, "deckMapInitializer")
    .mockImplementation(() => {});
  const initialized = jest.spyOn(DOMObserver, "initialized");
  const resetDeckState = jest
    .spyOn(DOMObserver, "resetDeckState")
    .mockImplementation(() => {});
  const dispatch = jest.spyOn(DOMObserver, "dispatch");
  const mutationObserverInitializer = jest
    .spyOn(DOMObserver, "mutationObserverInitializer")
    .mockImplementation(() => {});
  const logObserverFunc = jest
    .spyOn(DOMObserver, "logObserverFunc")
    .mockImplementation(() => {});
  const saveGameData = jest
    .spyOn(DOMObserver, "saveGameData")
    .mockImplementation(() => {
      return new Promise<void>(() => {});
    });
  const clearInterval = jest
    .spyOn(global, "clearInterval")
    .mockImplementation(() => {});
  const setInterval = jest.spyOn(global, "setInterval");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call the DOM initializer methods, and then if the initializations are successful, and the kingdom is baseOnly, it should initialize the mutationObservers and decks.", () => {
    // Arrange - baseOnly is true and initializations successful.
    initialized.mockImplementation(() => true);
    DOMObserver.baseOnly = true;

    // Act - simulate calling the initIntervalCallback.
    DOMObserver.initIntervalCallback();

    // Assert
    expect(resetGame).toBeCalledTimes(1);
    expect(logInitializer).toBeCalledTimes(1);
    expect(playersInitializer).toBeCalledTimes(1);
    expect(kingdomInitializer).toBeCalledTimes(1);
    expect(deckMapInitializer).toBeCalledTimes(1);
    expect(initialized).toBeCalledTimes(1);
    expect(resetDeckState).toBeCalledTimes(1);
    expect(dispatch).toBeCalledTimes(1);
    expect(dispatch).toBeCalledWith(setGameActiveStatus(true));
    expect(mutationObserverInitializer).toBeCalledTimes(1);
    expect(logObserverFunc).toBeCalledTimes(1);
    expect(saveGameData).toBeCalledTimes(1);
    expect(saveGameData).toBeCalledWith(DOMObserver.gameLog, DOMObserver.decks);
    expect(clearInterval).toBeCalledTimes(1);
    expect(clearInterval).toBeCalledWith(DOMObserver.initInterval);
    expect(setInterval).toBeCalledWith(
      DOMObserver.resetCheckIntervalCallback,
      1000
    );
  });

  it("should call the DOM initializer methods, and if they're successful, but the kingdom is not base only, should not initialize the mutationObservers, dispatch any redux action, call the logObserverCallback, or save the game data.", () => {
    // Arrange - Initializations successful but kingdom is not baseOnly
    initialized.mockImplementation(() => true);
    DOMObserver.baseOnly = false;

    // Act - simulate calling the initIntervalCallback.
    DOMObserver.initIntervalCallback();

    // Assert
    expect(resetGame).toBeCalledTimes(1);
    expect(logInitializer).toBeCalledTimes(1);
    expect(playersInitializer).toBeCalledTimes(1);
    expect(kingdomInitializer).toBeCalledTimes(1);
    expect(deckMapInitializer).toBeCalledTimes(1);
    expect(initialized).toBeCalledTimes(1);
    expect(resetDeckState).toBeCalledTimes(1);
    expect(dispatch).not.toBeCalled();
    expect(mutationObserverInitializer).not.toBeCalled();
    expect(logObserverFunc).not.toBeCalled();
    expect(saveGameData).not.toBeCalled();
    expect(clearInterval).toBeCalledTimes(1);
    expect(clearInterval).toBeCalledWith(DOMObserver.initInterval);
    expect(setInterval).toBeCalledWith(
      DOMObserver.resetCheckIntervalCallback,
      1000
    );
  });

  it("should call the DOM initializer methods, and take no further action if the initializations are not successful.", () => {
    // Arrange - initializations not successful.
    initialized.mockImplementation(() => false);

    // Act - simulate calling the initIntervalCallback.
    DOMObserver.initIntervalCallback();

    // Assert
    expect(resetGame).toBeCalledTimes(1);
    expect(logInitializer).toBeCalledTimes(1);
    expect(playersInitializer).toBeCalledTimes(1);
    expect(kingdomInitializer).toBeCalledTimes(1);
    expect(deckMapInitializer).toBeCalledTimes(1);
    expect(initialized).toBeCalledTimes(1);
    expect(resetDeckState).not.toBeCalled();
    expect(dispatch).not.toBeCalled();
    expect(mutationObserverInitializer).not.toBeCalled();
    expect(logObserverFunc).not.toBeCalled();
    expect(saveGameData).not.toBeCalled();
    expect(clearInterval).not.toBeCalled();
    expect(setInterval).not.toBeCalled();
  });
});
