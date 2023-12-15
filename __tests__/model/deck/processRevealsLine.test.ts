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

  it("should move cards revealed by a Wandering Minstrel from library to setAside", () => {
    // Arrange
    deck.latestAction = "Wandering Minstrel";
    deck.library = ["Copper", "Estate", "Bureaucrat", "Gold", "Silver"];
    deck.setAside = [];

    // Act - Simulate revealing a card from library with a Wandering Minstrel.
    deck.processRevealsLine(["Bureaucrat", "Gold", "Silver"], [1, 1, 1]);

    // Assert - Verify the card is moved from library to setAside
    expect(deck.library).toStrictEqual(["Copper", "Estate"]);
    expect(deck.setAside).toStrictEqual(["Bureaucrat", "Gold", "Silver"]);
  });

  it("should move cards revealed by a Hunter from library to setAside", () => {
    // Arrange
    deck.latestAction = "Hunter";
    deck.library = ["Copper", "Estate", "Bureaucrat", "Gold", "Silver"];
    deck.setAside = [];

    // Act - Simulate revealing a card from library with a Wandering Minstrel.
    deck.processRevealsLine(["Copper", "Gold", "Silver"], [1, 1, 1]);

    // Assert - Verify the card is moved from library to setAside
    expect(deck.library).toStrictEqual(["Estate", "Bureaucrat"]);
    expect(deck.setAside).toStrictEqual(["Copper", "Gold", "Silver"]);
  });

  it("should move cards revealed by a Hunting Party from library to setAside", () => {
    // Arrange
    deck.latestAction = "Hunting Party";
    deck.library = [
      "Copper",
      "Estate",
      "Bureaucrat",
      "Gold",
      "Silver",
      "Silver",
      "Cellar",
    ];
    deck.setAside = [];

    // Act - Simulate revealing a 2 Silvers and a Cellar from library with a Hunting Party.
    deck.processRevealsLine(["Silver", "Cellar"], [2, 1]);

    // Assert - Verify the card is moved from library to setAside
    expect(deck.library).toStrictEqual([
      "Copper",
      "Estate",
      "Bureaucrat",
      "Gold",
    ]);
    expect(deck.setAside).toStrictEqual(["Silver", "Silver", "Cellar"]);
  });

  it("should move cards revealed by a Seer from library to setAside", () => {
    // Arrange
    deck.latestAction = "Seer";
    deck.library = [
      "Copper",
      "Copper",
      "Chapel",
      "Estate",
      "Bureaucrat",
      "Gold",
    ];
    deck.setAside = [];

    // Act - Simulate revealing a 2 Coppers and a Chapel from library with a Seer.
    deck.processRevealsLine(["Copper", "Chapel"], [2, 1]);

    // Assert - Verify the card is moved from library to setAside
    expect(deck.library).toStrictEqual([
      "Estate",
      "Bureaucrat",
      "Gold",
    ]);
    expect(deck.setAside).toStrictEqual(["Copper", "Copper", "Chapel"]);
  });

  it("should move cards revealed by a Patrol from library to setAside", () => {
    // Arrange
    deck.latestAction = "Patrol";
    deck.library = [
      "Moneylender",
      "Copper",
      "Estate",
      "Bureaucrat",
      "Gold",
      "Silver",
      "Silver",
      "Cellar",
    ];
    deck.setAside = [];

    // Act - Simulate revealing a a Copper, a Gold, an Estate, and a Moneylender from library with a Patrol.
    deck.processRevealsLine(
      ["Copper", "Gold", "Estate", "Moneylender"],
      [1, 1, 1, 1]
    );

    // Assert - Verify the card is moved from library to setAside
    expect(deck.library).toStrictEqual([
      "Bureaucrat",
      "Silver",
      "Silver",
      "Cellar",
    ]);
    expect(deck.setAside).toStrictEqual([
      "Copper",
      "Gold",
      "Estate",
      "Moneylender",
    ]);
  });

  it("should move cards revealed by a Fortune Teller from library to setAside", () => {
    // Arrange
    deck.latestAction = "Fortune Teller";
    deck.library = [
      "Moneylender",
      "Copper",
      "Estate",
      "Bureaucrat",
      "Gold",
      "Silver",
      "Silver",
      "Cellar",
    ];
    deck.setAside = [];

    // Act - Simulate revealing a a Copper, a Gold, an Estate, and a Moneylender from library with a Fortune Teller.
    deck.processRevealsLine(
      ["Copper", "Gold", "Estate", "Moneylender"],
      [1, 1, 1, 1]
    );

    // Assert - Verify the card is moved from library to setAside
    expect(deck.library).toStrictEqual([
      "Bureaucrat",
      "Silver",
      "Silver",
      "Cellar",
    ]);
    expect(deck.setAside).toStrictEqual([
      "Copper",
      "Gold",
      "Estate",
      "Moneylender",
    ]);
  });

  it("should move cards revealed by a Advisor from library to setAside", () => {
    // Arrange
    deck.latestAction = "Advisor";
    deck.library = [
      "Moneylender",
      "Copper",
      "Estate",
      "Bureaucrat",
      "Gold",
      "Silver",
      "Silver",
      "Cellar",
    ];
    deck.setAside = [];

    // Act - Simulate revealing a a Copper, a Gold, an Estate, and a Moneylender from library with a Advisor.
    deck.processRevealsLine(
      ["Copper", "Gold", "Estate", "Moneylender"],
      [1, 1, 1, 1]
    );

    // Assert - Verify the card is moved from library to setAside
    expect(deck.library).toStrictEqual([
      "Bureaucrat",
      "Silver",
      "Silver",
      "Cellar",
    ]);
    expect(deck.setAside).toStrictEqual([
      "Copper",
      "Gold",
      "Estate",
      "Moneylender",
    ]);
  });
});
