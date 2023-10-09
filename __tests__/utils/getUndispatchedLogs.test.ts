import { describe, it, expect } from "@jest/globals";
import { getUndispatchedLogs } from "../../src/utils/utils";

describe("Function getUndispatchedLogs()", () => {
  describe("when given the current game log, and logs Processed", () => {
    it("should return the logs that have not been dispatched", () => {
      const gameLog = "LogLine1\nLogLine2\nLogLine3\nLogLine4\nLine5\nLogLine6";
      const logsDispatched = "LogLine1\nLogLine2\nLogLine3\nLogLine4";

      expect(getUndispatchedLogs(logsDispatched, gameLog)).toBe(
        "Line5\nLogLine6"
      );
    });
    describe("when given game log and logsProcessed with same # of lines, but differing last line of the gameLog", () => {
      it("should return the last line", () => {
        const gameLog =
          "LogLine1\nLogLine2\nLogLine3\nLogLine4\nLine5\nthisLineIsDifferent";
        const logsDispatched =
          "LogLine1\nLogLine2\nLogLine3\nLogLine4\nLine5\nLogLine6";

        expect(getUndispatchedLogs(logsDispatched, gameLog)).toBe(
          "thisLineIsDifferent"
        );
      });
    });
    describe("if there are no new logs", () => {
      it('should throw and catch an error, and return "No new Logs"', () => {
        const gameLog = "Line1\nLine2";
        const logsDispatched = "Line1\nLine2";
        expect(() => getUndispatchedLogs(logsDispatched, gameLog)).toThrow(
          Error
        );
      });
    });
    // describe("if there are ")
  });

  describe("getUndispatchedLogs", () => {
    it("should return undispatched logs when there are more game logs", () => {
      // Arrange - Create sample logsDispatched and gameLog
      const logsDispatched = "Log 1\nLog 2";
      const gameLog = "Log 1\nLog 2\nLog 3\nLog 4";

      // Act
      const undispatchedLogs = getUndispatchedLogs(logsDispatched, gameLog);

      // Assert
      expect(undispatchedLogs).toBe("Log 3\nLog 4");
    });

    it("should throw an error when there are more dispatched logs than game logs", () => {
      // Arrange - Create sample logsDispatched and gameLog
      const logsDispatched = "Log 1\nLog 2\nLog 3\nLog 4";
      const gameLog = "Log 1\nLog 2";

      // Act and Assert
      expect(() => getUndispatchedLogs(logsDispatched, gameLog)).toThrowError(
        "More dispatched logs than game logs"
      );
    });

    it("should throw an error when there are no new logs", () => {
      // Arrange - Create sample logsDispatched and gameLog with the same last line
      const logsDispatched = "Log 1\nLog 2\nLog 3";
      const gameLog = "Log 1\nLog 2\nLog 3";

      // Act and Assert
      expect(() => getUndispatchedLogs(logsDispatched, gameLog)).toThrowError(
        "Equal # lines and last line also equal"
      );
    });

    it("should return the last game log when there are new logs", () => {
      // Arrange - Create sample logsDispatched and gameLog with different last lines
      const logsDispatched = "Log 1\nLog 2\nLog 3";
      const gameLog = "Log 1\nLog 2\nLog 4";

      // Act
      const undispatchedLogs = getUndispatchedLogs(logsDispatched, gameLog);

      // Assert
      expect(undispatchedLogs).toBe("Log 4");
    });

    it("should handle empty logsDispatched", () => {
      // Arrange - Create an empty logsDispatched and sample gameLog
      const logsDispatched = "";
      const gameLog = "Log 1\nLog 2\nLog 3";

      // Act
      const undispatchedLogs = getUndispatchedLogs(logsDispatched, gameLog);

      // Assert
      expect(undispatchedLogs).toBe("Log 1\nLog 2\nLog 3");
    });
  });
});
