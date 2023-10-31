import { describe, it, expect, jest } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";
import { afterEach } from "node:test";
describe("logInitializer", () => {
  // Mock dependencies
  const isGameLogPresent = jest.spyOn(DOMObserver, "isGameLogPresent");
  const getClientGameLog = jest.spyOn(DOMObserver, "getClientGameLog");
  const getRatedGameBoolean = jest.spyOn(DOMObserver, "getRatedGameBoolean");
  const setGameLog = jest.spyOn(DOMObserver, "setGameLog");
  const setRatedGame = jest.spyOn(DOMObserver, "setRatedGame");
  const setLogInitialized = jest.spyOn(DOMObserver, "setRatedGame");
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should set the ratedGame and gameLog fiends if the game log is present, and return true", () => {});
  // Arrange Mock a scenario where the game-log element is present n the DOM.
  isGameLogPresent.mockImplementation(() => true);
  getClientGameLog.mockImplementation(() => "Log1\nLog2\nLog3\nLog4");
  getRatedGameBoolean.mockImplementation(() => true);

  // Act - Simulate calling the logInitializer when the game log element is present in the DOM.
  DOMObserver.logInitializer();

  // Assert
  expect(isGameLogPresent.mock.results[0].value).toBe(true);
  expect(getClientGameLog).toBeCalledTimes(1);
  expect(getRatedGameBoolean).toBeCalledTimes(1);
  expect(getRatedGameBoolean).toBeCalledWith("Log1");
  expect(setGameLog).toBeCalledTimes(1);
  expect(setGameLog).toBeCalledWith("Log1\nLog2\nLog3\nLog4");
  expect(setRatedGame).toBeCalledTimes(1);
  expect(setRatedGame).toBeCalledWith(true);
  expect(setLogInitialized).toBeCalledTimes(1);
  expect(setLogInitialized).toBeCalledWith(true);

  it("should return false if the game log is not present", () => {
    isGameLogPresent.mockImplementation(() => false);

    // Act - Simulate calling the logInitializer when the game log element is not present in the DOM.
    DOMObserver.logInitializer();

    // Assert
    expect(isGameLogPresent).toBeCalledTimes(1);
    expect(isGameLogPresent.mock.results[0].value).toBe(false);
    expect(getClientGameLog).not.toBeCalled();
    expect(getRatedGameBoolean).not.toBeCalled();
    expect(setGameLog).not.toBeCalled();
    expect(setRatedGame).not.toBeCalled();
    expect(setLogInitialized).not.toBeCalled();
  });
});
