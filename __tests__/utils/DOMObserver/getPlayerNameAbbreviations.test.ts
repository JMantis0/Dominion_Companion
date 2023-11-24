/**
 * @jest-environment jsdom
 */
import { expect, describe, it } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";
describe("getPlayerNameAbbreviations() ", () => {
  it("should return the abbreviated player names correctly when their names start with with different first letters", () => {
    // Arrange
    const playerName: string = "GoodBeard";
    const gameLog: string = "Game #116986281, unrated.\nCard Pool: level 1\nL starts with 7 Coppers.\nL starts with 3 Estates.\nG starts with 7 Coppers.\nG starts with 3 Estates.\nL shuffles their deck.\nG shuffles their deck.";

    // Act and Assert - Simulate getting abbreviations where the names start with different letters (simplest case).
    expect(
      DOMObserver.getPlayerNameAbbreviations(gameLog, playerName)
    ).toStrictEqual(["G", "L"]);
  });

  it("should return the multi-letter abbreviations for the player names when they start with the same letters ", () => {
    // Arrange
    const playerName: string = "Lord Rattingtop";
    const gameLog: string = "Game #116986281, unrated.\nCard Pool: level 1\nLord Rattington starts with 7 Coppers.\nLord Rattington starts with 3 Estates.\nLord Rattingtop starts with 7 Coppers.\nLord Rattingtop starts with 3 Estates.\nLord Rattington shuffles their deck.\nLord Rattingtop shuffles their deck.";

    // Act and Assert - Simulate getting abbreviations where the names begin with many of the same letters.
    expect(
      DOMObserver.getPlayerNameAbbreviations(gameLog, playerName)
    ).toStrictEqual(["Lord Rattingtop", "Lord Rattington"]);
  });

  it("should return the multi-letter abbreviations for the player names when one player name is same as the other except for having an extra letter", () => {
    // Arrange
    const playerName: string = "Lord Rattingtop";
    const gameLog: string = "Game #116986281, unrated.\nCard Pool: level 1\nLord Rattingtopy starts with 7 Coppers.\nLord Rattingtopy starts with 3 Estates.\nLord Rattingtop starts with 7 Coppers.\nLord Rattingtop starts with 3 Estates.\nLord Rattingtop shuffles their deck.\nLord Rattingtop shuffles their deck.";

    // Act and Assert.
    expect(
      DOMObserver.getPlayerNameAbbreviations(gameLog, playerName)
    ).toStrictEqual(["Lord Rattingtop", "Lord Rattingtopy"]);
  });

  it("should return player and opponent name abbreviations", () => {
    // Arrange - Create a sample game log
    const gameLog = "A starts with ...\n...\nB starts with ...\n...";
    const playerName = "BigGuy";

    // Act
    const [playerNick, opponentNick] = DOMObserver.getPlayerNameAbbreviations(
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
    const [playerNick, opponentNick] = DOMObserver.getPlayerNameAbbreviations(
      gameLog,
      playerName
    );

    // Assert
    expect(playerNick).toBe("Player A");
    expect(opponentNick).toBe("Player B");
  });

  it("should return empty strings if player names are not found in the log", () => {
    // Arrange - Create a sample game log without player names
    const gameLog = ".\n.\n.\n";
    const playerName = "Player A";

    // Act
    const [playerNick, opponentNick] = DOMObserver.getPlayerNameAbbreviations(
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
    const [playerNick, opponentNick] = DOMObserver.getPlayerNameAbbreviations(
      gameLog,
      playerName
    );

    // Assert
    expect(playerNick).toBe("Player B");
    expect(opponentNick).toBe("Player A");
  });
});
