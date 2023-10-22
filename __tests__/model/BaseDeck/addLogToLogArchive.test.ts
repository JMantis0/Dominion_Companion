import { it, expect, jest } from "@jest/globals";
import { OpponentDeck } from "../../../src/model/opponentDeck";

it("should add the provided line to the logArchive", () => {
  // Arrange an OpponentDeck object
  const oDeck = new OpponentDeck("", false, "", "oName", "o", []);
  oDeck.setLogArchive(["Log1", "Log2", "Log3"]);
  // Mock function dependency
  const setLogArchive = jest.spyOn(OpponentDeck.prototype, "setLogArchive");
  // Act - Simulate adding a card to the entireDeck
  oDeck.addLogToLogArchive("Log4");

  // Assert
  expect(setLogArchive).toBeCalledWith(["Log1", "Log2", "Log3", "Log4"]);
  expect(oDeck.logArchive).toStrictEqual(["Log1", "Log2", "Log3", "Log4"]);
});
