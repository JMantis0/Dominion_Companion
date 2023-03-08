import { expect, describe, it } from "@jest/globals";
import { isATreasurePlayLogEntry } from "../../src/content/contentScriptFunctions";

describe("Function isATreasurePlayLogEntry()", () => {
  describe("given a log entry that is not a treasure play", () => {
    it("should return false", () => {
      const nonTreasureLogEntry: string = "Player plays a non-treasure card";
      expect(isATreasurePlayLogEntry(nonTreasureLogEntry)).toBe(false);
    });
  });
  describe("given a log entry that is a treasure play", () => {
    it("should return true", () => {
      const treasureLogEntry = "Player plays 2 Coppers";
      expect(isATreasurePlayLogEntry(treasureLogEntry)).toBe(true);
    });
  });
});
