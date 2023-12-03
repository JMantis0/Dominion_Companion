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
    deck.latestPlay = "Artisan";
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
    deck.latestPlay = "Bureaucrat";
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
    deck.latestPlay = "Courtyard";
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
    deck.latestPlay = "Harbinger";
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
    deck.latestPlay = "Sentry";
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
    deck.latestPlay = "Lookout";
    deck.library = ["Copper"];
    deck.hand = ["Market"];
    deck.graveyard = ["Bureaucrat"];
    deck.setAside = ["Merchant"];

    // Arguments for function being tested.
    const cards = ["Merchant"];
    const numberOfCards = [1];

    // Act - Simulate top decking a card with an Lookout.
    deck.processTopDecksLine(cards, numberOfCards);

    // Assert - Verify the cards were moved from setAside to library
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.library).toStrictEqual(["Copper", "Merchant"]);
    // Verify graveyard and hand are unchanged.
    expect(deck.graveyard).toStrictEqual(["Bureaucrat"]);
    expect(deck.hand).toStrictEqual(["Market"]);
  });
});
