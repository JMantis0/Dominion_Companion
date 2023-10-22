import { it, expect, jest } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

it("should remove the last element of the logArchive array()", () => {
  // Arrange
  const deck = new BaseDeck("", false, "", "pName", "pNick", []);
  deck.logArchive = ["Log1", "Log2", "Log3", "Log4"];
  const setLogArchive = jest.spyOn(BaseDeck.prototype, "setLogArchive");

  // Act - simulate popping off a logArchive entry
  deck.popLastLogArchiveEntry(deck.logArchive);

  // Assert
  expect(setLogArchive).toBeCalledTimes(1);
  expect(setLogArchive).toBeCalledWith(["Log1", "Log2", "Log3"]);
  expect(deck.getLogArchive()).toStrictEqual(["Log1", "Log2", "Log3"]);
});
