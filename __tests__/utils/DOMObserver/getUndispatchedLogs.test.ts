import { describe, it, expect } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";

describe("getUndispatchedLogs", () => {
  it("should return the logs that have not been dispatched when given the current game log, and logs Processed", () => {
    // Arrange - 2 new lines in the game log
    const gameLog = "LogLine1\nLogLine2\nLogLine3\nLogLine4\nLine5\nLogLine6";
    const logsDispatched = "LogLine1\nLogLine2\nLogLine3\nLogLine4";

    // Act
    const undispatchedLogs = DOMObserver.getUndispatchedLogs(
      logsDispatched,
      gameLog
    );
    // Assert
    expect(undispatchedLogs).toBe("Line5\nLogLine6");
  });

  it("should return the last line of the gameLog when given gameLog and logsProcessed with same # of lines, but differing last lines", () => {
    // Arrange - Same # of lines in gameLog and logsDispatch, but last lines are different.
    const gameLog =
      "LogLine1\nLogLine2\nLogLine3\nLogLine4\nLine5\nthisLineIsDifferent";
    const logsDispatched =
      "LogLine1\nLogLine2\nLogLine3\nLogLine4\nLine5\nLogLine6";

    // Act
    const undispatchedLogs = DOMObserver.getUndispatchedLogs(
      logsDispatched,
      gameLog
    );

    // Assert
    expect(undispatchedLogs).toBe("thisLineIsDifferent");
  });

  it("should throw an error if there are no new logs", () => {
    // Arrange
    const gameLog = "Line1\nLine2";
    const logsDispatched = "Line1\nLine2";
    // Act and Assert
    expect(() =>
      DOMObserver.getUndispatchedLogs(logsDispatched, gameLog)
    ).toThrowError("No new logs.");
  });

  // describe("if there are ")
});

describe("getUndispatchedLogs", () => {
  it("should return undispatched logs when there are more game logs", () => {
    // Arrange - Create sample logsDispatched and gameLog
    const logsDispatched = "Log 1\nLog 2";
    const gameLog = "Log 1\nLog 2\nLog 3\nLog 4";

    // Act
    const undispatchedLogs = DOMObserver.getUndispatchedLogs(
      logsDispatched,
      gameLog
    );

    // Assert
    expect(undispatchedLogs).toBe("Log 3\nLog 4");
  });

  it("should throw an error when there are more dispatched logs than game logs", () => {
    // Arrange - Create sample logsDispatched and gameLog
    const logsDispatched = "Log 1\nLog 2\nLog 3\nLog 4";
    const gameLog = "Log 1\nLog 2";

    // Act and Assert
    expect(() =>
      DOMObserver.getUndispatchedLogs(logsDispatched, gameLog)
    ).toThrowError("More dispatched logs than game logs");
  });

  it("should throw an error when there are no new logs", () => {
    // Arrange - Create sample logsDispatched and gameLog with the same last line
    const logsDispatched = "Log 1\nLog 2\nLog 3";
    const gameLog = "Log 1\nLog 2\nLog 3";

    // Act and Assert
    expect(() =>
      DOMObserver.getUndispatchedLogs(logsDispatched, gameLog)
    ).toThrowError("No new logs.");
  });

  it("should return the last game log when the number of lines is equal but the last lines are different.", () => {
    // Arrange - Create sample logsDispatched and gameLog with different last lines
    const logsDispatched = "Log 1\nLog 2\nLog 3";
    const gameLog = "Log 1\nLog 2\nLog 4";

    // Act
    const undispatchedLogs = DOMObserver.getUndispatchedLogs(
      logsDispatched,
      gameLog
    );

    // Assert
    expect(undispatchedLogs).toBe("Log 4");
  });

  it("should, if the logsDispatched length is exactly one greater than the gameLog length, and the last gameLog line is a Merchant bonus line, should return the last line of the game log.", () => {
    // Arrange the logsDispatched to be exactly one greater than gameLog and gameLog to be ending in a Merchant bonus line

    const logsDispatched =
      "pNick plays a Silver. (+$2)\npNick gets +$2. (Merchant)\npNick gets +$1. (Merchant)";
    const gameLog = "pNick plays a Silver. (+$2)\npNick gets +$4. (Merchant)";

    // Act
    const undispatchedLogs = DOMObserver.getUndispatchedLogs(
      logsDispatched,
      gameLog
    );

    // Assert
    expect(undispatchedLogs).toBe("pNick gets +$4. (Merchant)");
  });

  it("should handle empty logsDispatched", () => {
    // Arrange - Create an empty logsDispatched and sample gameLog
    const logsDispatched = "";
    const gameLog = "Log 1\nLog 2\nLog 3";

    // Act
    const undispatchedLogs = DOMObserver.getUndispatchedLogs(
      logsDispatched,
      gameLog
    );

    // Assert
    expect(undispatchedLogs).toBe("Log 1\nLog 2\nLog 3");
  });
});
