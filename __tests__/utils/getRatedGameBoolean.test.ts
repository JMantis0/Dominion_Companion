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
  
describe('getRatedGameBoolean', () => {
  it('should return true for rated game', () => {
    // Arrange - Create a sample first game log line for a rated game
    const firstGameLogLine = 'The game is rated.';

    // Act
    const ratedGame = getRatedGameBoolean(firstGameLogLine);

    // Assert
    expect(ratedGame).toBe(true);
  });

  it('should return false for unrated game', () => {
    // Arrange - Create a sample first game log line for an unrated game
    const firstGameLogLine = 'The game is unrated.';

    // Act
    const ratedGame = getRatedGameBoolean(firstGameLogLine);

    // Assert
    expect(ratedGame).toBe(false);
  });

  it('should throw an error for an invalid firstGameLogLine', () => {
    // Arrange - Create an invalid first game log line
    const firstGameLogLine = 'Invalid game log entry.';

    // Act and Assert
    expect(() => getRatedGameBoolean(firstGameLogLine)).toThrowError('Invalid firstGameLogLine ' + firstGameLogLine);
  });

  // Add more test cases as needed
});
});
