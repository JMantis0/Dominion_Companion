import { expect, describe, it } from "@jest/globals";
import { areNewLogsToSend } from "../src/content/contentFunctions";

describe("Function areNewLogsToSend()", () => {
  describe("when given non-identical logsProcessed and gameLog", () => {
    const logsProcessed = "Log Line1\nLogLine2\nLogLine3\n";
    const gameLog = "Log Line1\nLogLine2\nLogLine3\n";
    it("should return true", () => {
      expect(areNewLogsToSend(logsProcessed, gameLog)).toBe(true);
    });
  });
  describe("when given identical logsProcessd and gameLog", () => {
    const logsProcessed = "Log Line1\nLogLine2\nLogLine3\n";
    const gameLog = "Log Line1\nLogLine2\nLogLine3\nLogLine4";
    it("should return false", () => {
      expect(areNewLogsToSend(logsProcessed, gameLog)).toBe(false);
    });
  });
});
