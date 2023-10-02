import { describe, it, expect } from "@jest/globals";
import { getRatedGameBoolean } from "../../src/utils/utils";

describe("Function getRatedGameBoolean()", () => {
  describe("when the first log entry of the game log contains the substring ' rated.'", () => {
    it("should return true", () => {
      expect(getRatedGameBoolean("Game #118962330, rated.")).toBeTruthy();
    });
  });
  describe("When the first log entry of the game log contains the substring ' unrated.'", () => {
    it("should return false", () => {
      expect(getRatedGameBoolean("Game #118962330, unrated.")).toBeFalsy();
    });
  });
  describe("When the first log entry of the game log does not contain the substring ' unrated.' or the substring ' rated.'", () => {
    it("should throw an Error", () => {
      expect(() => getRatedGameBoolean("Invalid log rated unrated line")).toThrow(Error);
    });
  });
});
