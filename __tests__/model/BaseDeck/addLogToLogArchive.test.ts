import { it, expect } from "@jest/globals";
import { OpponentDeck } from "../../../src/model/opponentDeck";

it("should add the provided line to the logArchive", () => {
  // Arrange an OpponentDeck object
  const oDeck = new OpponentDeck("", false, "", "oName", "o", []);

  // Act - Simulate adding a log to the logArchive
  oDeck.logArchive = ["Log1", "Log2", "Log3"];
  oDeck.addLogToLogArchive("Log4");

  // Assert
  expect(oDeck.logArchive).toStrictEqual(["Log1", "Log2", "Log3", "Log4"]);
});
