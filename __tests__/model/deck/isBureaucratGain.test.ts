import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("isBureaucratGain", () => {
  // Declare Deck reference.
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should return true if the most recent entry processed is an Bureaucrat play.", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick plays a Bureaucrat.";

    // Act - Simulate checking for Bureaucrat gain when the gain was from an Bureaucrat.
    const bureaucratGain = deck.isBureaucratGain();

    // Assert
    expect(bureaucratGain).toBe(true);
  });

  it("should return false if the most recent entry processed is not an Bureaucrat play.", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick plays 2 Coppers. (+2)";

    // Act - Simulate checking for Bureaucrat gain when the gain was not from an Bureaucrat.
    const bureaucratGain = deck.isBureaucratGain();

    // Assert
    expect(bureaucratGain).toBe(false);
  });
});
