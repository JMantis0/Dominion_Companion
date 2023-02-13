import { jest, describe, it, expect } from "@jest/globals";
import { getUndispatchedLogs } from "../src/content/contentFunctions";

describe("Function getUndispatchedLogs()", () => {
  describe("when given the current game log, and logs Processed", () => {
    it("should return the logs that have not been dispatched(arent in the processed logs", () => {
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
  });
});
