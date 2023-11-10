import { it, expect, describe } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";
describe("popLastLogArchiveEntry", () => {
  it("should remove the last element of the logArchive array()", () => {
    // Arrange
    const deck = new BaseDeck("", false, "", "pName", "pNick", []);
    deck.logArchive = ["Log1", "Log2", "Log3", "Log4"];

    // Act - simulate popping off a logArchive entry
    deck.popLastLogArchiveEntry(deck.logArchive);

    // Assert
    expect(deck.logArchive).toStrictEqual(["Log1", "Log2", "Log3"]);
  });
});
