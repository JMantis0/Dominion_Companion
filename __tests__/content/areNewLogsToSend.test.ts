import { expect, describe, it } from "@jest/globals";
import { areNewLogsToSend } from "../../src/content/Observer/observerFunctions";

describe("Function areNewLogsToSend()", () => {
  describe("when given identical logsProcessed and gameLog", () => {
    const logsProcessed: string = "Log Line1\nLogLine2\nLogLine3";
    const gameLog: string = "Log Line1\nLogLine2\nLogLine3";
    it("should return false", () => {
      expect(areNewLogsToSend(logsProcessed, gameLog)).toBe(false);
    });
  });
  describe("when given non-identical logsProcessed and gameLog", () => {
    const logsProcessed: string = "Log Line1\nLogLine2\nLogLine3";
    const gameLog: string = "Log Line1\nLogLine2\nLogLine3\nLogLine4";
    it("should return true", () => {
      expect(areNewLogsToSend(logsProcessed, gameLog)).toBe(true);
    });
  });
  describe("when given more logsProcessed than game-log", () => {
    const tooManyLogsProcessed: string =
      "Log Line1\nLogLine2\nLogLine3\nLogLine4";
    const gameLog: string = "Log Line1\nLogLine2\nLogLine3";
    it("should throw error", () => {
      expect(() => areNewLogsToSend(tooManyLogsProcessed, gameLog)).toThrow(
        Error
      );
    });
  });
});
