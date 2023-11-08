import { it, expect, describe } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("addLogToLogArchive", () => {
  it("should add the provided line to the logArchive", () => {
    // Instantiate a BaseDeck object
    const deck = new BaseDeck("", false, "", "oName", "o", []);

    // Act - Simulate adding a log to the logArchive
    deck.logArchive = ["Log1", "Log2", "Log3"];
    deck.addLogToLogArchive("Log4");

    // Assert
    expect(deck.logArchive).toStrictEqual(["Log1", "Log2", "Log3", "Log4"]);
  });
});
