/**
 * @jest-environment jsdom
 */
import { expect, describe, it } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";
describe("getPlayerNameAbbreviations() ", () => {
  it("should return the abbreviated player names correctly when their names start with with different first letters", () => {
    // Arrange
    const playerName: string = "GoodBeard";
    const gameLog: string =
      "Game #116986281, unrated.\nCard Pool: level 1\nL starts with 7 Coppers.\nL starts with 3 Estates.\nG starts with 7 Coppers.\nG starts with 3 Estates.\nL shuffles their deck.\nG shuffles their deck.";
    const opponentNames = ["Lord Rattington"];
    // Act and Assert - Simulate getting abbreviations where the names start with different letters (simplest case).
    expect(
      DOMObserver.getPlayerNameAbbreviations(gameLog, playerName, opponentNames)
    ).toStrictEqual({ playerNick: "G", opponentNicks: ["L"] });
  });

  it("should return the multi-letter abbreviations for the player names when they start with the same letters ", () => {
    // Arrange
    const playerName: string = "Lord Rattingtop";
    const gameLog: string =
      "Game #116986281, unrated.\nCard Pool: level 1\nLord Rattington starts with 7 Coppers.\nLord Rattington starts with 3 Estates.\nLord Rattingtop starts with 7 Coppers.\nLord Rattingtop starts with 3 Estates.\nLord Rattington shuffles their deck.\nLord Rattingtop shuffles their deck.";
    const opponentNames = ["Lord Rattington"];
    // Act and Assert - Simulate getting abbreviations where the names begin with many of the same letters.
    expect(
      DOMObserver.getPlayerNameAbbreviations(gameLog, playerName, opponentNames)
    ).toStrictEqual({
      playerNick: "Lord Rattingtop",
      opponentNicks: ["Lord Rattington"],
    });
  });

  it("should return the multi-letter abbreviations for the player names when one player name is same as the other except for having an extra letter", () => {
    // Arrange
    const playerName: string = "Lord Rattingtop";
    const gameLog: string =
      "Game #116986281, unrated.\nCard Pool: level 1\nLord Rattingtopy starts with 7 Coppers.\nLord Rattingtopy starts with 3 Estates.\nLord Rattingtop starts with 7 Coppers.\nLord Rattingtop starts with 3 Estates.\nLord Rattingtop shuffles their deck.\nLord Rattingtop shuffles their deck.";
    const opponentNames = ["Lord Rattingtopy"];
    // Act and Assert.
    expect(
      DOMObserver.getPlayerNameAbbreviations(gameLog, playerName, opponentNames)
    ).toStrictEqual({
      playerNick: "Lord Rattingtop",
      opponentNicks: ["Lord Rattingtopy"],
    });
  });

  it("should return player and opponent name abbreviations", () => {
    // Arrange - Create a sample game log
    const gameLog = "...\nA starts with ... \nB starts with ...\n...";
    const playerName = "BigGuy";
    const opponentNames = ["Andy"];

    // Act
    const { playerNick, opponentNicks } =
      DOMObserver.getPlayerNameAbbreviations(
        gameLog,
        playerName,
        opponentNames
      );

    // Assert
    expect(playerNick).toBe("B");
    expect(opponentNicks).toStrictEqual(["A"]);
  });

  it("should handle player names in reverse order", () => {
    // Arrange - Create a sample game log with player names in reverse order
    const gameLog = "...\nPlayer B starts with ...\nPlayer A starts with ...\n...";
    const playerName = "Player A";
    const opponentNames = ["Player B"];

    // Act
    const { playerNick, opponentNicks } =
      DOMObserver.getPlayerNameAbbreviations(
        gameLog,
        playerName,
        opponentNames
      );

    // Assert
    expect(playerNick).toBe("Player A");
    expect(opponentNicks).toStrictEqual(["Player B"]);
  });

  it("should return empty strings if player names are not found in the log", () => {
    // Arrange - Create a sample game log without player names
    const gameLog = ".\n.\n.\n";
    const playerName = "Player A";
    const opponentNames = ["Player B"];
    // Act
    const { playerNick, opponentNicks } =
      DOMObserver.getPlayerNameAbbreviations(
        gameLog,
        playerName,
        opponentNames
      );

    // Assert
    expect(playerNick).toBe("");
    expect(opponentNicks).toStrictEqual([]);
  });

  it("should handle player names in correctly if playerName is player going first.", () => {
    // Arrange - Create a sample game log with player names in reverse order
    const gameLog =
      "...\nPlayer B starts with ...\nPlayer A starts with ...\n...";
    const playerName = "Player B";
    const opponentNames = ["Player A"];
    // Act
    const { playerNick, opponentNicks } =
      DOMObserver.getPlayerNameAbbreviations(
        gameLog,
        playerName,
        opponentNames
      );

    // Assert
    expect(playerNick).toBe("Player B");
    expect(opponentNicks).toStrictEqual(["Player A"]);
  });
});
