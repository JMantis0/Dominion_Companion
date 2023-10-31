import { expect, describe, it } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";

describe("areNewLogsToSend", () => {
  it("should throw an error when processed logs are larger than game log.", () => {
    // Arrange
    const logsProcessed = "Log1\nLog2\nLog3\nLog4\n";
    const gameLog = "Log1\nLog2\nLog3\n";

    // Act and Assert - Simulate checking for new logs when there are more logsProcessed lines than gameLog lines.  This indicates there is some buggy behavior in the deck logic.
    expect(() =>
      DOMObserver.areNewLogsToSend(logsProcessed, gameLog)
    ).toThrowError("Processed logs Larger than game log");
  });

  it("should return true when there are more gameLogLines than logsProcessed lines.", () => {
    // Arrange
    const logsProcessed = "Log1\nLog2\nLog3\n";
    const gameLog = "Log1\nLog2\nLog3\nLog4\n";

    // Act and Assert - Simulate checking for new logs when there are more gameLog lines than logsProcessed lines.
    expect(DOMObserver.areNewLogsToSend(logsProcessed, gameLog)).toBe(true);
  });

  it("should return false when there are equal number of lines in the logsProcessed and gameLogs AND the last lines are equivalent.", () => {
    // Arrange
    const logsProcessed = "Log1\nLog2\nLog3\nLog4Same";
    const gameLog = "Log1\nLog2\nLog3\nLog4Same";

    // Act and Assert - Simulate checking for new logs when the logsProcessed and gameLog are identical.
    expect(DOMObserver.areNewLogsToSend(logsProcessed, gameLog)).toBe(false);
  });

  it("should return true when there are equal number of lines in the logsProcessed and gameLogs AND the last lines are NOT equivalent.", () => {
    // Arrange
    const logsProcessed = "Log1\nLog2\nLog3\nLog4NOTTHESAME";
    const gameLog = "Log1\nLog2\nLog3\nLog4notthesame";

    // Act and Assert - Simulate checking for new logs when the logsProcessed and gameLog equal line length, but differing last lines.
    expect(DOMObserver.areNewLogsToSend(logsProcessed, gameLog)).toBe(true);
  });

  it("should return false when both processed and game logs are empty.", () => {
    // Arrange
    const logsProcessed = "";
    const gameLog = "";

    // Act and Assert - simulate checking for new logs when there is no gameLog and there are no logsProcessed.
    expect(DOMObserver.areNewLogsToSend(logsProcessed, gameLog)).toBe(false);
  });

  it("should return false when the last entry in processed logs is a 'buy without gain' line, but the logsProcessed and gameLog are the same otherwise.", () => {
    // Arrange
    const logsProcessed = "Log1\nLog2\nLog3\nLog4";
    const gameLog = "Log1\nLog2\nLog3\nLog4\npNick buys a Copper";

    // Act and Assert - Simulate checking for new logs  when there is an extra line in  the gameLog, but it is a 'buy without gain' line (should be ignored).
    expect(DOMObserver.areNewLogsToSend(logsProcessed, gameLog)).toBe(false);
  });

  it("should return false when the last line of the gameLog is a 'Merchant Bonus line'.", () => {
    // Arrange
    const logsProcessed = "Log1\nLog2\nLog3\nLog4\n";
    const gameLog = "Log1\nLog2\nLog3\nLog4\nPlayer gets +$3. (Merchant)";
    
    // Act and Assert - Simulate checking for new logs when the last gameLog line is a 'Merchant Bonus Line' (should be ignored).
    expect(DOMObserver.areNewLogsToSend(logsProcessed, gameLog)).toBe(false);
  });
});
