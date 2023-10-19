import { describe, it, expect, jest } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function addLogToLogArchive()", () => {
  const deck = new Deck("", false, "", "pName", "pNick", []);
  const setLogArchive = jest.spyOn(Deck.prototype, "setLogArchive");
  it("should add the provided line to the logArchive", () => {
    //Arrange
    deck.logArchive = ["Log1", "Log2"];
    const line = "Log3";

    // Act - Simulate adding a log to the logArchive
    deck.addLogToLogArchive(line);
    // Assert
    expect(setLogArchive).toBeCalledTimes(1);
    expect(setLogArchive).toBeCalledWith(["Log1", "Log2", "Log3"]);
  });
});
