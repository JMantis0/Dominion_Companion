import { expect, describe, it } from "@jest/globals";
import { areNewLogsToSend } from "../../src/utils/utils";

describe("Function areNewLogsToSend()", () => {
  it("should return false when the last entry in processed logs is a 'buy without gain' line, but the logsProcessed and gameLog are the same otherwise", () => {
    const logsProcessed = "Log1\nLog2\nLog3\nLog4";
    const gameLog = "Log1\nLog2\nLog3\nLog4\npNick buys a Copper";
    expect(areNewLogsToSend(logsProcessed, gameLog)).toBe(false);
  });

  it("should throw an error when processed logs are larger than game log", () => {
    const logsProcessed = "Log1\nLog2\nLog3\nLog4\n";
    const gameLog = "Log1\nLog2\nLog3\n";
    expect(() => areNewLogsToSend(logsProcessed, gameLog)).toThrowError(
      "Processed logs Larger than game log"
    );
  });

  it("should return true when there are more gameLogLines than logsProcessed lines", () => {
    const logsProcessed = "Log1\nLog2\nLog3\n";
    const gameLog = "Log1\nLog2\nLog3\nLog4\n";
    expect(areNewLogsToSend(logsProcessed, gameLog)).toBe(true);
  });

  it("should return false when there are equal number of lines in the logsProcessed and gameLogs AND the last lines are equivalent", () => {
    const logsProcessed = "Log1\nLog2\nLog3\nLog4Same";
    const gameLog = "Log1\nLog2\nLog3\nLog4Same";
    expect(areNewLogsToSend(logsProcessed, gameLog)).toBe(false);
  });

  it("should return true when there are equal number of lines in the logsProcessed and gameLogs AND the last lines are NOT equivalent", () => {
    const logsProcessed = "Log1\nLog2\nLog3\nLog4NOTTHESAME";
    const gameLog = "Log1\nLog2\nLog3\nLog4notthesame";
    expect(areNewLogsToSend(logsProcessed, gameLog)).toBe(true);
  });

  it('should return false when the final line of the game log contains "Premoves", but otherwise the logsProcessed and gameLog are equal', () => {
    const logsProcessed = "Log1\nLog2\nLog3";
    const gameLog = "Log1\nLog2\nLog3\nPremoves";
    expect(areNewLogsToSend(logsProcessed, gameLog)).toBe(false);
  });

  it("should return false when both processed and game logs are empty", () => {
    const logsProcessed = "";
    const gameLog = "";
    expect(areNewLogsToSend(logsProcessed, gameLog)).toBe(false);
  });

  it("should return false when processed logs and game logs are the same", () => {
    const logsProcessed = "Log1\nLog2\nLog3\nLog4\n";
    const gameLog = "Log1\nLog2\nLog3\nLog4\n";
    expect(areNewLogsToSend(logsProcessed, gameLog)).toBe(false);
  });

});

describe("Function areNewLogsToSend() when there is a Premoves element active in the game log", () => {
  it("should return false when the last entry in processed logs is a 'buy without gain' line", () => {
    const logsProcessed = "Log1\nLog2\nLog3\nLog4";
    const gameLog =
      "Log1\nLog2\nLog3\nLog4\npNick buys a Copper\nPremoves Player Does Something";
    expect(areNewLogsToSend(logsProcessed, gameLog)).toBe(false);
  });

  it("should throw an error when processed logs are larger than game log", () => {
    const logsProcessed = "Log1\nLog2\nLog3\nLog4\n";
    const gameLog = "Log1\nLog2\nLog3\n\nPremoves Player Does Something";
    expect(() => areNewLogsToSend(logsProcessed, gameLog)).toThrowError(
      "Processed logs Larger than game log"
    );
  });

  it("should return true when there are more gameLogLines than logsProcessed lines", () => {
    const logsProcessed = "Log1\nLog2\nLog3\n";
    const gameLog = "Log1\nLog2\nLog3\nLog4\n\nPremoves Player Does Something";
    expect(areNewLogsToSend(logsProcessed, gameLog)).toBe(true);
  });

  it("should return false when there are equal number of lines in the logsProcessed and gameLogs AND the last lines are equivalent", () => {
    const logsProcessed = "Log1\nLog2\nLog3\nLog4Same";
    const gameLog =
      "Log1\nLog2\nLog3\nLog4Same\nPremoves Player Does Something";
    expect(areNewLogsToSend(logsProcessed, gameLog)).toBe(false);
  });

  it("should return true when there are equal number of lines in the logsProcessed and gameLogs AND the last lines are NOT equivalent", () => {
    const logsProcessed = "Log1\nLog2\nLog3\nLog4NOTTHESAME";
    const gameLog =
      "Log1\nLog2\nLog3\nLog4notthesame\nPremoves Player Does Something";
    expect(areNewLogsToSend(logsProcessed, gameLog)).toBe(true);
  });

  it("should return false when both processed and game logs are empty", () => {
    const logsProcessed = "";
    const gameLog = "";
    expect(areNewLogsToSend(logsProcessed, gameLog)).toBe(false);
  });

  it("should return false when processed logs and game logs are the same", () => {
    const logsProcessed = "Log1\nLog2\nLog3\nLog4";
    const gameLog = "Log1\nLog2\nLog3\nLog4\nPremoves Player Does Something";
    expect(areNewLogsToSend(logsProcessed, gameLog)).toBe(false);
  });
});
