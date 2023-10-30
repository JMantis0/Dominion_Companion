import { describe, it, expect } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";

describe("getRatedGameBoolean", () => {
  it("should return true when the first log entry of the game log contains the substring ' rated.'", () => {
    // Act and Assert
    expect(DOMObserver.getRatedGameBoolean("Game #118962330, rated.")).toBe(
      true
    );
  });

  it("should return false when the first log entry of the game log contains the substring ' unrated.'", () => {
    // Act and Assert
    expect(DOMObserver.getRatedGameBoolean("Game #118962330, unrated.")).toBe(
      false
    );
  });

  it("should return true for rated game", () => {
    // Arrange - Create a sample first game log line for a rated game
    const firstGameLogLine = "The game is rated.";

    // Act
    const ratedGame = DOMObserver.getRatedGameBoolean(firstGameLogLine);

    // Assert
    expect(ratedGame).toBe(true);
  });

  it("should return false for unrated game", () => {
    // Arrange - Create a sample first game log line for an unrated game
    const firstGameLogLine = "The game is unrated.";

    // Act
    const ratedGame = DOMObserver.getRatedGameBoolean(firstGameLogLine);

    // Assert
    expect(ratedGame).toBe(false);
  });

  it("should throw an error for an invalid firstGameLogLine", () => {
    // Arrange - Create an invalid first game log line
    const firstGameLogLine = "Invalid game log entry.";

    // Act and Assert
    expect(() =>
      DOMObserver.getRatedGameBoolean(firstGameLogLine)
    ).toThrowError("Unable to determine if game is rated.");
  });

  // Add more test cases as needed
});
