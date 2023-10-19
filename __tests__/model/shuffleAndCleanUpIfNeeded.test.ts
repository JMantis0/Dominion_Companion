import { describe, it, expect, jest } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { afterEach } from "node:test";

describe("Function shuffleAndCleanupIfNeeded()", () => {
  // Mock function dependencies
  const ifCleanUpNeeded = jest.spyOn(Deck.prototype, "ifCleanUpNeeded");
  const cleanup = jest
    .spyOn(Deck.prototype, "cleanup")
    .mockImplementation(() => null);
  const shuffleGraveYardIntoLibrary = jest
    .spyOn(Deck.prototype, "shuffleGraveYardIntoLibrary")
    .mockImplementation(() => null);
  const setWaitToShuffle = jest.spyOn(Deck.prototype, "setWaitToShuffle");
  afterEach(() => {
    jest.resetAllMocks();
  });
  const deck = new Deck("", false, "", "pName", "pNick", []);

  it("should not shuffle if not needed", () => {
    // Arrange
    deck.waitToShuffle = false;

    // Arguments for function being tested
    const line = "pName draws a Copper.";

    // Act - an update where shuffle is not needed
    deck.shuffleAndCleanUpIfNeeded(line);

    // Assert
    expect(ifCleanUpNeeded).not.toBeCalled();
    expect(setWaitToShuffle).not.toBeCalled();
    expect(cleanup).not.toBeCalled();
    expect(shuffleGraveYardIntoLibrary).not.toBeCalled();
  });

  it("should shuffle if needed, but not cleanup if cleanup is not needed", () => {
    // Arrange
    deck.waitToShuffle = true;
    ifCleanUpNeeded.mockImplementation(() => false);

    // Arguments for function being tested
    const line = "pName draws a Copper.";

    // Act - simulate an update cleaning up and shuffling if needed
    deck.shuffleAndCleanUpIfNeeded(line);

    expect(ifCleanUpNeeded).toBeCalledTimes(1);
    expect(ifCleanUpNeeded).toBeCalledWith(line);
    expect(ifCleanUpNeeded.mock.results[0].value).toBe(false);
    expect(shuffleGraveYardIntoLibrary).toBeCalledTimes(1);
    expect(setWaitToShuffle).toBeCalledTimes(1);
    expect(setWaitToShuffle).toBeCalledWith(false);
    expect(cleanup).not.toBeCalled();
  });
  it("should shuffle and cleanup if both are needed()", () => {
    // Arrange
    deck.waitToShuffle = true;
    ifCleanUpNeeded.mockImplementation(() => true);

    // Arguments for function being tested
    const line = "pName draws a 5 Coppers.";

    // Act - simulate an update cleaning up and shuffling if needed
    deck.shuffleAndCleanUpIfNeeded(line);

    expect(ifCleanUpNeeded).toBeCalledTimes(1);
    expect(ifCleanUpNeeded).toBeCalledWith(line);
    expect(ifCleanUpNeeded.mock.results[0].value).toBe(true);
    expect(shuffleGraveYardIntoLibrary).toBeCalledTimes(1);
    expect(setWaitToShuffle).toBeCalledTimes(1);
    expect(setWaitToShuffle).toBeCalledWith(false);
    expect(cleanup).toBeCalledTimes(1);
  });
});
