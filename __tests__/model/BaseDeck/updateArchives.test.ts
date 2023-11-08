import { describe, it, expect, beforeEach } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("Method updateArchives()", () => {
  // Instantiate BaseDeck object.
  let deck = new BaseDeck("", false, "", "pName", "pNick", []);

  beforeEach(() => {
    deck = new BaseDeck("", false, "", "pName", "pNick", []);
    deck.logArchive = ["Log1", "Log2"];
    deck.gameTurn = 5;
    deck.lastEntryProcessed = "Old Last Entry";
  });

  it("Should correctly add lines to the logArchive and lastEntryProcessed fields", () => {
    // Arrange
    const line = "pNick draws an Estate and 3 Coppers.";
    // Act - Simulate updating the deck logArchive and lastEntryProcessed fields with a log-gable line.
    deck.updateArchives(line);
    // Assert - Verify Records updated correctly
    expect(deck.lastEntryProcessed).toBe(line);
    expect(deck.logArchive).toStrictEqual(["Log1", "Log2", line]);
    expect(deck.gameTurn).toBe(5);
  });

  it("should correctly avoid adding Premoves lines to the logArchive and lastEntryProcessed fields", () => {
    // Arrange
    const line = "PremovesLog1Log2Log3";
    // Act - Simulate updating the deck logArchive and lastEntryProcessed fields with a 'Premoves' line.
    deck.updateArchives(line);
    // Assert - Verify records did not update
    expect(deck.lastEntryProcessed).toBe("Old Last Entry");
    expect(deck.logArchive).toStrictEqual(["Log1", "Log2"]);
    expect(deck.gameTurn).toBe(5);
  });

  it("should correctly avoid adding Between Turns lines to the logArchive and lastEntryProcessed fields", () => {
    // Arrange
    const line = "Between Turns";
    // Act - Simulate updating the deck logArchive and lastEntryProcessed fields with a 'Between Turns' line.
    deck.updateArchives(line);
    // Assert - Verify records did not update
    expect(deck.lastEntryProcessed).toBe("Old Last Entry");
    expect(deck.logArchive).toStrictEqual(["Log1", "Log2"]);
    expect(deck.gameTurn).toBe(5);
  });

  it("should correctly Increment Turn field when processing a 'New Turn' line", () => {
    // Arrange
    const line = "Turn 10 - pName";
    // Act - Simulate updating the deck logArchive and lastEntryProcessed fields with a 'New Turn' line.
    deck.updateArchives(line);
    // Assert
    expect(deck.lastEntryProcessed).toBe(line);
    expect(deck.logArchive).toStrictEqual(["Log1", "Log2", line]);
    expect(deck.gameTurn).toBe(6);
  });
});
