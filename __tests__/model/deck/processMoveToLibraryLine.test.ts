import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("processMoveToLibraryLine", () => {
  // Declare Deck reference.
  let deck: Deck;
  const isDurationEffect = jest.spyOn(BaseDeck.prototype, "isDurationEffect");
  beforeEach(() => {
    deck = new Deck("", false, "", "pNick", "pName", []);
    isDurationEffect.mockReturnValue(false);
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
    deck.processMoveToLibraryLine(cards, numberOfCards);

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
    deck.processMoveToLibraryLine(cards, numberOfCards);

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
    deck.processMoveToLibraryLine(cards, numberOfCards);

    // Assert - Verify the card was moved from hand to library.
    expect(deck.library).toStrictEqual(["Copper", "Estate"]);
    expect(deck.hand).toStrictEqual(["Market"]);
    //  Verify graveyard and setAside are not changed.
    expect(deck.graveyard).toStrictEqual(["Merchant"]);
    expect(deck.setAside).toStrictEqual([]);
  });
  it("should move cards topdecked by an Pilgrim from hand.", () => {
    // Arrange deck state
    deck.latestAction = "Pilgrim";
    deck.library = ["Copper"];
    deck.hand = ["Estate", "Market"];
    deck.graveyard = ["Merchant"];
    deck.setAside = [];

    // Act - Simulate top decking a card with a Pilgrim.
    deck.processMoveToLibraryLine(["Estate"], [1]);

    // Assert - Verify the card was moved from hand to library.
    expect(deck.library).toStrictEqual(["Copper", "Estate"]);
    expect(deck.hand).toStrictEqual(["Market"]);
    //  Verify graveyard and setAside are not changed.
    expect(deck.graveyard).toStrictEqual(["Merchant"]);
    expect(deck.setAside).toStrictEqual([]);
  });

  it("should move cards topdecked by a Replace from graveyard.", () => {
    // Arrange deck state
    deck.latestAction = "Replace";
    deck.library = ["Copper"];
    deck.hand = ["Market"];
    deck.graveyard = ["Bureaucrat", "Bandit"];
    deck.setAside = [];

    // Arguments for function being tested.

    // Act - Simulate top decking a card with a Harbinger.
    deck.processMoveToLibraryLine(["Bandit"], [1]);

    // Assert - Verify the card was moved from graveyard to library
    expect(deck.graveyard).toStrictEqual(["Bureaucrat"]);
    expect(deck.library).toStrictEqual(["Copper", "Bandit"]);
    // Verify the hand is unchanged
    expect(deck.hand).toStrictEqual(["Market"]);
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

    // Act - Simulate top decking a card with a Replace.
    deck.processMoveToLibraryLine(cards, numberOfCards);

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
    deck.processMoveToLibraryLine(cards, numberOfCards);

    // Assert - Verify the cards were moved from setAside to library
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.library).toStrictEqual(["Copper", "Merchant", "Vassal"]);
    // Verify graveyard and hand are unchanged.
    expect(deck.graveyard).toStrictEqual(["Bureaucrat"]);
    expect(deck.hand).toStrictEqual(["Market"]);
  });

  it("should move cards topdecked by a Patrol from setAside.", () => {
    // Arrange deck state
    deck.latestAction = "Patrol";
    deck.library = ["Copper"];
    deck.hand = ["Market"];
    deck.graveyard = ["Bureaucrat"];
    deck.setAside = ["Copper", "Gold", "Moneylender"];

    // Act - Simulate top decking a Copper, a Gold, and a Moneylender with a Patr
    deck.processMoveToLibraryLine(["Copper", "Gold", "Moneylender"], [1, 1, 1]);

    // Assert - Verify the cards were moved from setAside to library
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.library).toStrictEqual([
      "Copper",
      "Copper",
      "Gold",
      "Moneylender",
    ]);
    // Verify graveyard and hand are unchanged.
    expect(deck.graveyard).toStrictEqual(["Bureaucrat"]);
    expect(deck.hand).toStrictEqual(["Market"]);
  });

  it("should move cards topdecked by a Seer from setAside.", () => {
    // Arrange deck state
    deck.latestAction = "Seer";
    deck.library = ["Silver"];
    deck.hand = ["Market"];
    deck.graveyard = ["Bureaucrat"];
    deck.setAside = ["Copper", "Copper"];

    // Act - Simulate top decking a Copper, a Gold, and a Moneylender with a Seer
    deck.processMoveToLibraryLine(["Copper"], [2]);

    // Assert - Verify the cards were moved from setAside to library
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.library).toStrictEqual(["Silver", "Copper", "Copper"]);
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
    deck.processMoveToLibraryLine(cards, numberOfCards);

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
    deck.processMoveToLibraryLine(cards, numberOfCards);

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
    deck.processMoveToLibraryLine(cards, numberOfCards);

    // Assert - Verify the cards were moved from setAside to library
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.library).toStrictEqual(["Copper", "Merchant", "Sentry"]);
    // Verify graveyard and hand are unchanged.
    expect(deck.graveyard).toStrictEqual(["Bureaucrat"]);
    expect(deck.hand).toStrictEqual(["Market"]);
  });

  it("should move cards by a Secret Passade from hand to library.", () => {
    // Arrange deck state
    deck.latestAction = "Secret Passage";
    deck.library = ["Copper"];
    deck.hand = ["Estate", "Copper", "Taxman"];

    // Arguments for function being tested.
    const cards = ["Estate"];
    const numberOfCards = [1];

    // Act - Simulate top decking a card with a Fortune Hunter.
    deck.processMoveToLibraryLine(cards, numberOfCards);

    // Assert - Verify the cards were moved from setAside to library
    expect(deck.library).toStrictEqual(["Copper", "Estate"]);
    expect(deck.hand).toStrictEqual(["Copper", "Taxman"]);
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
    deck.processMoveToLibraryLine(cards, numberOfCards);

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
    deck.processMoveToLibraryLine(
      ["Worker's Village", "Mountain Village"],
      [1, 1]
    );

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
    deck.processMoveToLibraryLine(["Silver", "Copper"], [1, 1]);

    // Assert - Verify the cards were moved from setAside to library
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.library).toStrictEqual(["Copper", "Silver", "Copper"]);
    // Verify graveyard and hand are unchanged.
    expect(deck.graveyard).toStrictEqual(["Bureaucrat"]);
    expect(deck.hand).toStrictEqual(["Market"]);
  });

  it("should move cards topdecked by a Fortune Teller from setAside to library.", () => {
    // Arrange deck state
    deck.latestAction = "Fortune Teller";
    deck.library = ["Copper"];
    deck.hand = ["Market"];
    deck.graveyard = ["Bureaucrat"];
    deck.setAside = ["Estate"];
    // Act - Simulate top decking a card with a Fortune Teller.
    deck.processMoveToLibraryLine(["Estate"], [1]);

    // Assert - Verify the cards were moved from setAside to library
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.library).toStrictEqual(["Copper", "Estate"]);
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
    deck.processMoveToLibraryLine(["Festival"], [1]);

    // Assert - Verify the card was moved from graveyard to library
    expect(deck.graveyard).toStrictEqual(["Copper"]);
    expect(deck.library).toStrictEqual(["Estate", "Copper", "Festival"]);
  });

  it("should move cards topdecked by a duration effect from inPlay to library", () => {
    // Arrange
    deck.latestAction = "None";
    deck.library = ["Estate", "Copper"];
    deck.inPlay = ["Rope", "Crew"];
    isDurationEffect.mockReturnValue(true);
    // Act - Simulate topdecking a Festival with a Crew duration effect.
    deck.processMoveToLibraryLine(["Crew"], [1]);

    // Assert - Verify the card was moved from graveyard to library
    expect(deck.inPlay).toStrictEqual(["Rope"]);
    expect(deck.library).toStrictEqual(["Estate", "Copper", "Crew"]);
  });
});
