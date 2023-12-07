import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("processTopDecksLine", () => {
  // Declare Deck reference.
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pNick", "pName", []);
    jest.clearAllMocks();
  });

  it("should move cards topdecked by an Artisan from hand.", () => {
    // Arrange deck state
    deck.latestAction = "Artisan";
    deck.library = ["Copper"];
    deck.hand = ["Bandit", "Market"];
    deck.graveyard = ["Bureaucrat"];
    deck.setAside = [];
    // Arguments for function being tested.
    const cards = ["Bandit"];
    const numberOfCards = [1];

    // Act - Simulate top decking a card with an Artisan.
    deck.processTopDecksLine(cards, numberOfCards);

    // Assert - Verify the card was moved from hand to library.
    expect(deck.library).toStrictEqual(["Copper", "Bandit"]);
    expect(deck.hand).toStrictEqual(["Market"]);
    //  Verify graveyard and setAside are not changed.
    expect(deck.graveyard).toStrictEqual(["Bureaucrat"]);
    expect(deck.setAside).toStrictEqual([]);
  });

  it("should move cards topdecked by an Bureaucrat from hand.", () => {
    // Arrange deck state
    deck.latestAction = "Bureaucrat";
    deck.library = ["Copper"];
    deck.hand = ["Estate", "Market"];
    deck.graveyard = ["Merchant"];
    deck.setAside = [];
    // Arguments for function being tested.
    const cards = ["Estate"];
    const numberOfCards = [1];

    // Act - Simulate top decking a card with an Bureaucrat.
    deck.processTopDecksLine(cards, numberOfCards);

    // Assert - Verify the card was moved from hand to library.
    expect(deck.library).toStrictEqual(["Copper", "Estate"]);
    expect(deck.hand).toStrictEqual(["Market"]);
    //  Verify graveyard and setAside are not changed.
    expect(deck.graveyard).toStrictEqual(["Merchant"]);
    expect(deck.setAside).toStrictEqual([]);
  });

  it("should move cards topdecked by an Courtyard from hand.", () => {
    // Arrange deck state
    deck.latestAction = "Courtyard";
    deck.library = ["Copper"];
    deck.hand = ["Estate", "Market"];
    deck.graveyard = ["Merchant"];
    deck.setAside = [];
    // Arguments for function being tested.
    const cards = ["Estate"];
    const numberOfCards = [1];

    // Act - Simulate top decking a card with a Courtyard.
    deck.processTopDecksLine(cards, numberOfCards);

    // Assert - Verify the card was moved from hand to library.
    expect(deck.library).toStrictEqual(["Copper", "Estate"]);
    expect(deck.hand).toStrictEqual(["Market"]);
    //  Verify graveyard and setAside are not changed.
    expect(deck.graveyard).toStrictEqual(["Merchant"]);
    expect(deck.setAside).toStrictEqual([]);
  });

  it("should move cards topdecked by a Harbinger from graveyard.", () => {
    // Arrange deck state
    deck.latestAction = "Harbinger";
    deck.library = ["Copper"];
    deck.hand = ["Market"];
    deck.graveyard = ["Bureaucrat", "Bandit"];
    deck.setAside = [];

    // Arguments for function being tested.
    const cards = ["Bandit"];
    const numberOfCards = [1];

    // Act - Simulate top decking a card with a Harbinger.
    deck.processTopDecksLine(cards, numberOfCards);

    // Assert - Verify the card was moved from graveyard to library
    expect(deck.graveyard).toStrictEqual(["Bureaucrat"]);
    expect(deck.library).toStrictEqual(["Copper", "Bandit"]);
    // Verify the hand is unchanged
    expect(deck.hand).toStrictEqual(["Market"]);
    expect(deck.setAside).toStrictEqual([]);
  });

  it("should move cards topdecked by a Sentry from setAside.", () => {
    // Arrange deck state
    deck.latestAction = "Sentry";
    deck.library = ["Copper"];
    deck.hand = ["Market"];
    deck.graveyard = ["Bureaucrat"];
    deck.setAside = ["Merchant", "Vassal"];

    // Arguments for function being tested.
    const cards = ["Merchant", "Vassal"];
    const numberOfCards = [1, 1];

    // Act - Simulate top decking a card with an Sentry.
    deck.processTopDecksLine(cards, numberOfCards);

    // Assert - Verify the cards were moved from setAside to library
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.library).toStrictEqual(["Copper", "Merchant", "Vassal"]);
    // Verify graveyard and hand are unchanged.
    expect(deck.graveyard).toStrictEqual(["Bureaucrat"]);
    expect(deck.hand).toStrictEqual(["Market"]);
  });

  it("should move cards topdecked by a Lookout from setAside.", () => {
    // Arrange deck state
    deck.latestAction = "Lookout";
    deck.library = ["Copper"];
    deck.hand = ["Market"];
    deck.graveyard = ["Bureaucrat"];
    deck.setAside = ["Merchant"];

    // Arguments for function being tested.
    const cards = ["Merchant"];
    const numberOfCards = [1];

    // Act - Simulate top decking a card with a Lookout.
    deck.processTopDecksLine(cards, numberOfCards);

    // Assert - Verify the cards were moved from setAside to library
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.library).toStrictEqual(["Copper", "Merchant"]);
    // Verify graveyard and hand are unchanged.
    expect(deck.graveyard).toStrictEqual(["Bureaucrat"]);
    expect(deck.hand).toStrictEqual(["Market"]);
  });

  it("should move cards topdecked by a Sentinel from setAside.", () => {
    // Arrange deck state
    deck.latestAction = "Sentinel";
    deck.library = ["Copper"];
    deck.hand = ["Market"];
    deck.graveyard = ["Bureaucrat"];
    deck.setAside = ["Merchant", "Merchant", "Merchant", "Silver"];

    // Arguments for function being tested.
    const cards = ["Merchant", "Silver"];
    const numberOfCards = [3, 1];

    // Act - Simulate top decking a card with a Sentinel.
    deck.processTopDecksLine(cards, numberOfCards);

    // Assert - Verify the cards were moved from setAside to library
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.library).toStrictEqual([
      "Copper",
      "Merchant",
      "Merchant",
      "Merchant",
      "Silver",
    ]);
    // Verify graveyard and hand are unchanged.
    expect(deck.graveyard).toStrictEqual(["Bureaucrat"]);
    expect(deck.hand).toStrictEqual(["Market"]);
  });

  it("should move cards topdecked by a Fortune Hunter from setAside.", () => {
    // Arrange deck state
    deck.latestAction = "Fortune Hunter";
    deck.library = ["Copper"];
    deck.hand = ["Market"];
    deck.graveyard = ["Bureaucrat"];
    deck.setAside = ["Merchant", "Sentry"];

    // Arguments for function being tested.
    const cards = ["Merchant", "Sentry"];
    const numberOfCards = [1, 1];

    // Act - Simulate top decking a card with a Fortune Hunter.
    deck.processTopDecksLine(cards, numberOfCards);

    // Assert - Verify the cards were moved from setAside to library
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.library).toStrictEqual(["Copper", "Merchant", "Sentry"]);
    // Verify graveyard and hand are unchanged.
    expect(deck.graveyard).toStrictEqual(["Bureaucrat"]);
    expect(deck.hand).toStrictEqual(["Market"]);
  });

  it("should move cards 'placed back onto their deck' by a Sea Chart from setAside to library.", () => {
    // Arrange deck state
    deck.latestAction = "Sea Chart";
    deck.library = ["Copper"];
    deck.hand = ["Market"];
    deck.graveyard = ["Bureaucrat"];
    deck.setAside = ["Merchant"];

    // Arguments for function being tested.
    const cards = ["Merchant"];
    const numberOfCards = [1];

    // Act - Simulate top decking a card with a Sea Chart.
    deck.processTopDecksLine(cards, numberOfCards);

    // Assert - Verify the cards were moved from setAside to library
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.library).toStrictEqual(["Copper", "Merchant"]);
    // Verify graveyard and hand are unchanged.
    expect(deck.graveyard).toStrictEqual(["Bureaucrat"]);
    expect(deck.hand).toStrictEqual(["Market"]);
  });

  it("should move cards topdecked by a Wandering Minstrel from setAside to library.", () => {
    // Arrange deck state
    deck.latestAction = "Wandering Minstrel";
    deck.library = ["Copper"];
    deck.hand = ["Market"];
    deck.graveyard = ["Bureaucrat"];
    deck.setAside = ["Copper", "Worker's Village", "Mountain Village"];
    // Act - Simulate top decking a card with a Wandering Minstrel.
    deck.processTopDecksLine(["Worker's Village", "Mountain Village"], [1, 1]);

    // Assert - Verify the cards were moved from setAside to library
    expect(deck.setAside).toStrictEqual(["Copper"]);
    expect(deck.library).toStrictEqual([
      "Copper",
      "Worker's Village",
      "Mountain Village",
    ]);
    // Verify graveyard and hand are unchanged.
    expect(deck.graveyard).toStrictEqual(["Bureaucrat"]);
    expect(deck.hand).toStrictEqual(["Market"]);
  });

  it("should move cards topdecked by a Cartographer from setAside to library.", () => {
    // Arrange deck state
    deck.latestAction = "Cartographer";
    deck.library = ["Copper"];
    deck.hand = ["Market"];
    deck.graveyard = ["Bureaucrat"];
    deck.setAside = ["Silver", "Copper"];
    // Act - Simulate top decking a card with a Cartographer.
    deck.processTopDecksLine(["Silver", "Copper"], [1, 1]);

    // Assert - Verify the cards were moved from setAside to library
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.library).toStrictEqual(["Copper", "Silver", "Copper"]);
    // Verify graveyard and hand are unchanged.
    expect(deck.graveyard).toStrictEqual(["Bureaucrat"]);
    expect(deck.hand).toStrictEqual(["Market"]);
  });

  it("should move cards topdecked by a Scavenger from graveyard to the library", () => {
    // Arrange
    deck.latestAction = "Scavenger";
    deck.graveyard = ["Copper", "Festival"];
    deck.library = ["Estate", "Copper"];

    // Act - Simulate topdecking a Festival with a Scavenger.
    deck.processTopDecksLine(["Festival"], [1]);

    // Assert - Verify the card was moved from graveyard to library
    expect(deck.graveyard).toStrictEqual(["Copper"]);
    expect(deck.library).toStrictEqual(["Estate", "Copper", "Festival"]);
  });
});
