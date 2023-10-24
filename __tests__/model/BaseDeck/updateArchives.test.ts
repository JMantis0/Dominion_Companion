import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("Method updateArchives()", () => {
  // Instantiate BaseDeck object.
  let deck = new BaseDeck("", false, "", "pName", "pNick", []);
  // Spy on method dependencies.
  const setLastEntryProcessed = jest.spyOn(
    BaseDeck.prototype,
    "setLastEntryProcessed"
  );
  const addLogToLogArchive = jest.spyOn(
    BaseDeck.prototype,
    "addLogToLogArchive"
  );
  const incrementTurn = jest.spyOn(BaseDeck.prototype, "incrementTurn");
  const checkForTurnLine = jest.spyOn(BaseDeck.prototype, "checkForTurnLine");

  afterEach(() => {
    deck = new BaseDeck("", false, "", "pName", "pNick", []);
    jest.clearAllMocks();
  });

  it("Should correctly add lines to the logArchive and lastEntryProcessed fields", () => {
    // Arrange
    const line = "pNick draws an Estate and 3 Coppers.";
    // Act - Simulate updating the deck logArchive and lastEntryProcessed fields with a log-gable line.
    deck.updateArchives(line);
    // Assert
    expect(setLastEntryProcessed).toBeCalledTimes(1);
    expect(setLastEntryProcessed).toBeCalledWith(line);
    expect(addLogToLogArchive).toBeCalledTimes(1);
    expect(addLogToLogArchive).toBeCalledWith(line);
    expect(checkForTurnLine).toBeCalledTimes(1);
    expect(checkForTurnLine).toBeCalledWith(line);
    expect(checkForTurnLine.mock.results[0].value).toBe(false);
    expect(incrementTurn).not.toBeCalled();
  });

  it("should correctly avoid adding Premoves lines to the logArchive and lastEntryProcessed fields", () => {
    // Arrange
    const line = "PremovesLog1Log2Log3";
    // Act - Simulate updating the deck logArchive and lastEntryProcessed fields with a 'Premoves' line.
    deck.updateArchives(line);
    // Assert
    expect(checkForTurnLine).toBeCalledTimes(1);
    expect(checkForTurnLine).toBeCalledWith(line);
    expect(checkForTurnLine.mock.results[0].value).toBe(false);
    expect(setLastEntryProcessed).not.toBeCalled();
    expect(addLogToLogArchive).not.toBeCalled();
    expect(incrementTurn).not.toBeCalled();
  });

  it("should correctly avoid adding Between Turns lines to the logArchive and lastEntryProcessed fields", () => {
    // Arrange
    const line = "Between Turns";
    // Act - Simulate updating the deck logArchive and lastEntryProcessed fields with a 'Between Turns' line.
    deck.updateArchives(line);
    // Assert
    expect(checkForTurnLine).toBeCalledTimes(1);
    expect(checkForTurnLine).toBeCalledWith(line);
    expect(checkForTurnLine.mock.results[0].value).toBe(false);
    expect(setLastEntryProcessed).not.toBeCalled();
    expect(addLogToLogArchive).not.toBeCalled();
    expect(incrementTurn).not.toBeCalled();
  });

  it("should correctly Increment Turn field when processing a 'New Turn' line", () => {
    // Arrange
    const line = "Turn 10 - pName";
    // Act - Simulate updating the deck logArchive and lastEntryProcessed fields with a 'New Turn' line.
    deck.updateArchives(line);
    // Assert
    expect(checkForTurnLine).toBeCalledTimes(1);
    expect(checkForTurnLine).toBeCalledWith(line);
    expect(checkForTurnLine.mock.results[0].value).toBe(true);
    expect(incrementTurn).toBeCalledTimes(1);
    expect(setLastEntryProcessed).toBeCalledTimes(1);
    expect(setLastEntryProcessed).toBeCalledWith(line);
    expect(addLogToLogArchive).toBeCalledTimes(1);
    expect(addLogToLogArchive).toBeCalledWith(line);
  });
});
