import { expect, describe, it, beforeEach } from "@jest/globals";
import { getPlayerRatings } from "../../src/utils/utils";

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

  describe("getPlayerRatings", () => {
    it("should return player and opponent ratings", () => {
      // Arrange - Create a sample game log with player and opponent ratings
      const gameLog =
        "\n" +
        "Player A: Rating 1700\n" +
        "...\n" +
        "Player B: Rating 1800\n" +
        "...\n";
      const playerName = "Player A";
      const opponentName = "Player B";

      // Act
      const [playerRating, opponentRating] = getPlayerRatings(
        playerName,
        opponentName,
        gameLog
      );

      // Assert
      expect(playerRating).toBe("1700");
      expect(opponentRating).toBe("1800");
    });

    it("should handle player names in reverse order", () => {
      // Arrange - Create a sample game log with player and opponent ratings in reverse order
      const gameLog =
        "\n" +
        "Player B: Rating 1800\n" +
        "...\n" +
        "Player A: Rating 1700\n" +
        "...\n";
      const playerName = "Player A";
      const opponentName = "Player B";

      // Act
      const [playerRating, opponentRating] = getPlayerRatings(
        playerName,
        opponentName,
        gameLog
      );

      // Assert
      expect(playerRating).toBe("1700");
      expect(opponentRating).toBe("1800");
    });

    it("should handle player ratings not found", () => {
      // Arrange - Create a sample game log without player ratings
      const gameLog =
        "\n" +
        "Player A starts with ...\n" +
        "...\n" +
        "Player B starts with ...\n" +
        "...\n";
      const playerName = "Player A";
      const opponentName = "Player B";

      // Act
      const [playerRating, opponentRating] = getPlayerRatings(
        playerName,
        opponentName,
        gameLog
      );

      // Assert
      expect(playerRating).toBe("Rating Not Found");
      expect(opponentRating).toBe("Rating Not Found");
    });

    // Add more test cases as needed
  });
});
