import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("processRevealsLine", () => {
  // Declare Deck reference.
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
    jest.clearAllMocks();
  });

  it("should move cards revealed by a Bandit play to from library to setAside", () => {
    // Arrange
    deck.latestAction = "Bandit";
    deck.library = ["Bureaucrat", "Gold", "Silver"];
    deck.setAside = [];

    // Act - Simulate an opponent's Bandit revealing two of the player's cards.
    deck.processRevealsLine(["Gold", "Silver"], [1, 1]);

    // Assert - Verify the cards were moved from library to setAside
    expect(deck.library).toStrictEqual(["Bureaucrat"]);
    expect(deck.setAside).toStrictEqual(["Gold", "Silver"]);
  });

  it("should move cards revealed by a Sage play to from library to setAside", () => {
    // Arrange
    deck.latestAction = "Sage";
    deck.library = ["Bureaucrat", "Gold", "Silver"];
    deck.setAside = [];

    // Act - Simulate revealing a card from library with a Sage.
    deck.processRevealsLine(["Silver"], [1, 1]);

    // Assert - Verify the card is moved from library to setAside
    expect(deck.library).toStrictEqual(["Bureaucrat", "Gold"]);
    expect(deck.setAside).toStrictEqual(["Silver"]);
  });

  it("should move cards revealed by a Sea Chart play to from library to setAside", () => {
    // Arrange
    deck.latestAction = "Sea Chart";
    deck.library = ["Bureaucrat", "Gold", "Silver"];
    deck.setAside = [];

    // Act - Simulate revealing a card from library with a Sage.
    deck.processRevealsLine(["Silver"], [1]);

    // Assert - Verify the card is moved from library to setAside
    expect(deck.library).toStrictEqual(["Bureaucrat", "Gold"]);
    expect(deck.setAside).toStrictEqual(["Silver"]);
  });

  it("should move cards revealed by a Farming Village play to from library to setAside", () => {
    // Arrange
    deck.latestAction = "Farming Village";
    deck.library = ["Bureaucrat", "Gold", "Silver"];
    deck.setAside = [];

    // Act - Simulate revealing a card from library with a Farming Village.
    deck.processRevealsLine(["Silver"], [1]);

    // Assert - Verify the card is moved from library to setAside
    expect(deck.library).toStrictEqual(["Bureaucrat", "Gold"]);
    expect(deck.setAside).toStrictEqual(["Silver"]);
  });
});
