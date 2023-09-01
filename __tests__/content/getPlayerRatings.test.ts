import { expect, describe, it, beforeEach } from "@jest/globals";
import { getPlayerRatings } from "../../src/content/components/Observer/observerFunctions";

describe("Function getPlayerRatings()", () => {
  let gameLog: string;
  describe("When the game is rated", () => {
    beforeEach(() => {
      gameLog = "Game #118965591, rated.\nGoodBeard: 40.21\nbaysox109: 43.61";
    });
    it("It should return two numbers, one rating for each player", () => {
      expect(getPlayerRatings("GoodBeard", "baysox109", gameLog)).toStrictEqual(
        ["40.21", "43.61"]
      );
    });
    beforeEach(() => {
      gameLog = "Game #118965591, rated.\nbaysox109: 43.61\nGoodBeard: 40.21";
    });
    it("It should return two numbers, one rating for each player", () => {
      expect(getPlayerRatings("GoodBeard", "baysox109", gameLog)).toStrictEqual(
        ["40.21", "43.61"]
      );
    });
  });
});
