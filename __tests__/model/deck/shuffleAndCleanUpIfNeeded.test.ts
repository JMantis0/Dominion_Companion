import { describe, it, expect, jest } from "@jest/globals";
import { Deck } from "../../../src/model/deck";
import { afterEach } from "node:test";

describe("Method shuffleAndCleanupIfNeeded()", () => {
  // Instantiate Deck object.
  let deck = new Deck("", false, "", "pName", "pNick", []);
  // Spy on method dependencies
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
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should not cleanup or shuffle or if value of field 'waitToShuffle' is false.", () => {
    // Arrange
    deck.waitToShuffle = false;

    // Arguments for function being tested
    const line = "pName draws a Copper.";

    // Act - Simulate processing a log where the previous line was not a 'shuffles their deck' line.
    deck.shuffleAndCleanUpIfNeeded(line);

    // Assert
    expect(ifCleanUpNeeded).not.toBeCalled();
    expect(setWaitToShuffle).not.toBeCalled();
    expect(cleanup).not.toBeCalled();
    expect(shuffleGraveYardIntoLibrary).not.toBeCalled();
  });

  it("should shuffle without cleaning up if value of field is 'waitToShuffle, and method ifCleanUpNeeded returns false.", () => {
    // Arrange
    deck.waitToShuffle = true;
    ifCleanUpNeeded.mockImplementation(() => false); // Mock situation where not exactly 5 non-Cellar draws are occurring.

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

  it("should cleanup and shuffle if value of field 'waitToShuffle' is true and method ifCleanUpNeeded returns true", () => {
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
