/**
 * @jest-environment jsdom
 */
import { expect, describe, it } from "@jest/globals";
import { getPlayerNameAbbreviations } from "../../src/utils/utils";

describe("Function getPlayerNameAbbreviations() ", () => {
  describe("Given the playerNames with different first Letters and first few lines of game log", () => {
    it("should return the abbreviated player names", () => {
      let playerName: string = "GoodBeard";
      const gameLog: string = `Game #116986281, unrated.\nCard Pool: level 1\nL starts with 7 Coppers.\nL starts with 3 Estates.\nG starts with 7 Coppers.\nG starts with 3 Estates.\nL shuffles their deck.\nG shuffles their deck.`;

      expect(getPlayerNameAbbreviations(gameLog, playerName)).toStrictEqual([
        "G",
        "L",
      ]);
    });
  });
  describe("Given playerNames with some of the same starting characters", () => {
    it("should return the multi-letter abbreviations for the player names", () => {
      let playerName: string = "Lord Rattingtop";
      const gameLog: string = `Game #116986281, unrated.\nCard Pool: level 1\nLord Rattington starts with 7 Coppers.\nLord Rattington starts with 3 Estates.\nLord Rattingtop starts with 7 Coppers.\nLord Rattingtop starts with 3 Estates.\nLord Rattington shuffles their deck.\nLord Rattingtop shuffles their deck.`;
      expect(getPlayerNameAbbreviations(gameLog, playerName)).toStrictEqual([
        "Lord Rattingtop",
        "Lord Rattington",
      ]);
    });
  });
  describe("Given playerNames where they are the same except one has an extra letter", () => {
    it("should return the multi-letter abbreviations for the player names", () => {
      let playerName: string = "Lord Rattingtop";
      const gameLog: string = `Game #116986281, unrated.\nCard Pool: level 1\nLord Rattingtopy starts with 7 Coppers.\nLord Rattingtopy starts with 3 Estates.\nLord Rattingtop starts with 7 Coppers.\nLord Rattingtop starts with 3 Estates.\nLord Rattingtop shuffles their deck.\nLord Rattingtop shuffles their deck.`;
      expect(getPlayerNameAbbreviations(gameLog, playerName)).toStrictEqual([
        "Lord Rattingtop",
        "Lord Rattingtopy",
      ]);
    });
  });

  describe("getPlayerNameAbbreviations", () => {
    it("should return player and opponent name abbreviations", () => {
      // Arrange - Create a sample game log
      const gameLog = "A starts with ...\n...\nB starts with ...\n...";
      const playerName = "BigGuy";

      // Act
      const [playerNick, opponentNick] = getPlayerNameAbbreviations(
        gameLog,
        playerName
      );

      // Assert
      expect(playerNick).toBe("B");
      expect(opponentNick).toBe("A");
    });

    it("should handle player names in reverse order", () => {
      // Arrange - Create a sample game log with player names in reverse order
      const gameLog =
        "Player B starts with ...\n...\nPlayer A starts with ...\n...";
      const playerName = "Player A";

      // Act
      const [playerNick, opponentNick] = getPlayerNameAbbreviations(
        gameLog,
        playerName
      );

      // Assert
      expect(playerNick).toBe("Player A");
      expect(opponentNick).toBe("Player B");
    });

    it("should return empty strings if player names are not found in the log", () => {
      // Arrange - Create a sample game log without player names
      const gameLog = `.\n.\n.\n`;
      const playerName = "Player A";

      // Act
      const [playerNick, opponentNick] = getPlayerNameAbbreviations(
        gameLog,
        playerName
      );

      // Assert
      expect(playerNick).toBe("");
      expect(opponentNick).toBe("");
    });

    it("should handle player names in correctly if playerName is player going first.", () => {
      // Arrange - Create a sample game log with player names in reverse order
      const gameLog =
        "Player B starts with ...\n...\nPlayer A starts with ...\n...";
      const playerName = "Player B";

      // Act
      const [playerNick, opponentNick] = getPlayerNameAbbreviations(
        gameLog,
        playerName
      );

      // Assert
      expect(playerNick).toBe("Player B");
      expect(opponentNick).toBe("Player A");
    });
  });
});
