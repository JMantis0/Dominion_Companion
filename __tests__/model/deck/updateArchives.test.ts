import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function updateArchives()", () => {
  const deck = new Deck("", false, "", "pName", "pNick", []);
  const setLastEntryProcessed = jest.spyOn(
    Deck.prototype,
    "setLastEntryProcessed"
  );
  const addLogToLogArchive = jest.spyOn(Deck.prototype, "addLogToLogArchive");
  const incrementTurn = jest.spyOn(Deck.prototype, "incrementTurn");
  const checkForTurnLine = jest.spyOn(Deck.prototype, "checkForTurnLine");
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should correctly add lines to the logArchive and lastEntryProcessed fields", () => {
    // Arrange
    const line = "pNick draws an Estate and 3 Coppers.";
    // Act - simulate updating the deck logArchive and lastEntryProcessed fields with a loggable line
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
    // Act - simulate updating the deck logArchive and lastEntryProcessed fields with a 'Premoves' line
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
    // Act - simulate updating the deck logArchive and lastEntryProcessed fields with a 'Between Turns' line
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
    // Act - simulate updating the deck logArchive and lastEntryProcessed fields with a 'Between Turns' line
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
