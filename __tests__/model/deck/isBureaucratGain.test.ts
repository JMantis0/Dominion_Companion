import { describe, it, expect, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function isBureaucratGain()", () => {
  // Instantiate Deck object.
  let deck = new Deck("", false, "", "pName", "pNick", []);

  afterEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should return true if the most recent entry processed is an Bureaucrat play.", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick plays a Bureaucrat.";

    // Act - Simulate checking for Bureaucrat gain when the gain was from an Bureaucrat.
    const artisanGain = deck.isBureaucratGain();

    // Assert
    expect(artisanGain).toBe(true);
  });

  it("should return false if the most recent entry processed is not an Bureaucrat play.", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick plays 2 Coppers. (+2)";

    // Act - Simulate checking for Bureaucrat gain when the gain was not from an Bureaucrat.
    const artisanGain = deck.isBureaucratGain();
    
    // Assert
    expect(artisanGain).toBe(false);
  });
});
