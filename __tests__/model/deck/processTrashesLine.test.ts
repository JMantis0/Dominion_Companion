import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("processTrashesLine", () => {
  // Declare Deck reference.
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pNick", "pName", []);
    jest.clearAllMocks();
  });

  it("should trash cards not trashed by Sentry, Bandit, or Lookout from hand.", () => {
    //Arrange
    deck.latestPlay = "Moneylender";
    deck.hand = ["Copper", "Estate"];
    deck.setAside = ["Bureaucrat"];
    deck.entireDeck = ["Moneylender", "Bureaucrat", "Copper", "Estate"];
    // Arguments for function being tested.
    const cards = ["Copper"];
    const numberOfCards = [1];

    // Act - simulate trashing a Copper from hand by a Moneylender.
    deck.processTrashesLine(cards, numberOfCards);

    // Assert - Verify card was removed from hand and entireDeck
    expect(deck.hand).toStrictEqual(["Estate"]);
    expect(deck.entireDeck).toStrictEqual([
      "Moneylender",
      "Bureaucrat",
      "Estate",
    ]);
    // Verify setAside is unchanged
    expect(deck.setAside).toStrictEqual(["Bureaucrat"]);
  });

  it("should trash cards trashed by Sentry from setAside.", () => {
    // Arrange
    deck.latestPlay = "Sentry";
    deck.hand = ["Bureaucrat"];
    deck.setAside = ["Estate", "Copper"];
    deck.entireDeck = ["Bureaucrat", "Sentry", "Copper", "Estate"];

    // Arguments for function being tested.
    const cards = ["Estate", "Copper"];
    const numberOfCards = [1, 1];

    // Act - simulate trashing an Estate and a Copper from setAside by a Sentry.
    deck.processTrashesLine(cards, numberOfCards);

    // Assert - Verify cards were removed from setAside and entireDeck
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.entireDeck).toStrictEqual(["Bureaucrat", "Sentry"]);
    // Verify hand is unchanged
    expect(deck.hand).toStrictEqual(["Bureaucrat"]);
  });

  it("should trash cards trashed by Bandit from setAside.", () => {
    // Arrange
    deck.latestPlay = "Bandit";
    deck.setAside = ["Silver", "Estate"];
    deck.hand = ["Silver"];
    deck.entireDeck = ["Silver", "Silver", "Estate"];
    // Arguments for function being tested.
    const cards = ["Silver"];
    const numberOfCards = [1];

    // Act - simulate trashing a Silver from setAside by a Bandit.
    deck.processTrashesLine(cards, numberOfCards);

    // Assert - Verify the card was removed from setAside and entireDeck
    expect(deck.setAside).toStrictEqual(["Estate"]);
    expect(deck.entireDeck).toStrictEqual(["Silver", "Estate"]);
    // Verify hand is not changed
    expect(deck.hand).toStrictEqual(["Silver"]);
  });

  it("should trash cards trashed by Lookout from setAside.", () => {
    // Arrange
    deck.latestPlay = "Lookout";
    deck.setAside = ["Silver", "Estate", "Estate"];
    deck.hand = ["Silver"];
    deck.entireDeck = ["Silver", "Silver", "Estate", "Estate"];
    // Arguments for function being tested.
    const cards = ["Estate"];
    const numberOfCards = [1];

    // Act - simulate trashing an Estate from setAside by a Lookout.
    deck.processTrashesLine(cards, numberOfCards);

    // Assert - Verify the card was removed from setAside and entireDeck
    expect(deck.setAside).toStrictEqual(["Silver", "Estate"]);
    expect(deck.entireDeck).toStrictEqual(["Silver", "Silver", "Estate"]);
    // Verify hand is not changed
    expect(deck.hand).toStrictEqual(["Silver"]);
  });
});
