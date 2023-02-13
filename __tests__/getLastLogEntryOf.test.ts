import { expect, describe, it } from "@jest/globals";
import { getLastLogEntryOf } from "../src/content/contentFunctions";

describe("Function getLastLogEntryOf()", () => {
  describe("given a gameLog or logsProcessed string", () => {
    it("should return the last line of the logs", () => {
      const sampleLog = "Log Line1\nLogLine2\nLogLine3";
      expect(getLastLogEntryOf(sampleLog)).toBe("LogLine3");
    });
  });
  describe("if can't find a final line, should return error", () => {
    const sampleLog = "";
    expect(() => getLastLogEntryOf(sampleLog)).toThrow(Error);
  });
});
