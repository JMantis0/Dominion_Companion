import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("processDiscardsLine", () => {
  // Declare Deck reference.
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pNick", "pName", []);
  });

  // Case - discard from hand
  it("should handle discarding cards from hand correctly", () => {
    // Arrange
    deck.latestPlay = "Militia";
    const cards = ["Copper", "Estate"];
    const numberOfCards = [1, 1];
    deck.hand = ["Copper", "Estate", "Estate"];
    deck.graveyard = ["Silver"];
    deck.setAside = ["Shouldn't Move"];
    deck.library = ["Shouldn't Move"];

    // Act - Simulate discarding two cards to an opponent's Militia.
    deck.processDiscardsLine(cards, numberOfCards);

    // Assert - Verify the hand and graveyard contain the expected cards.
    expect(deck.hand).toStrictEqual(["Estate"]);
    expect(deck.graveyard).toStrictEqual(["Silver", "Copper", "Estate"]);
    //  Verify that other zones were not discarded from.
    expect(deck.setAside).toStrictEqual(["Shouldn't Move"]);
    expect(deck.library).toStrictEqual(["Shouldn't Move"]);
  });

  // Case - discard from library: Vassal
  it("should discard from the library when latestPlay is a Vassal", () => {
    // Arrange
    deck.latestPlay = "Vassal";
    const cards = ["Silver"];
    const numberOfCards = [1];
    deck.library = ["Copper", "Estate", "Silver"];
    deck.graveyard = ["Silver"];
    deck.setAside = ["Shouldn't Move"];
    deck.hand = ["Shouldn't Move"];

    // Act - Simulate discarding from library with Vassal.
    deck.processDiscardsLine(cards, numberOfCards);

    // Assert - Verify the library and graveyard contain the expected cards.
    expect(deck.library).toStrictEqual(["Copper", "Estate"]);
    expect(deck.graveyard).toStrictEqual(["Silver", "Silver"]);
    // Verify that other zones were not discarded from.
    expect(deck.setAside).toStrictEqual(["Shouldn't Move"]);
    expect(deck.hand).toStrictEqual(["Shouldn't Move"]);
  });

  // Case - Discard from setAside: Bandit
  it("should discard from setAside when latestPlay is a Bandit", () => {
    // Arrange
    deck.latestPlay = "Bandit";
    const cards = ["Smithy"];
    const numberOfCards = [1];
    deck.setAside = ["Smithy"];
    deck.graveyard = ["Silver"];
    deck.library = ["Shouldn't Move"];
    deck.hand = ["Shouldn't Move"];

    // Act - Simulate discarding from library with Bandit.
    deck.processDiscardsLine(cards, numberOfCards);

    // Assert - Verify setAside and graveyard contain the expected cards.
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.graveyard).toStrictEqual(["Silver", "Smithy"]);
    // Verify other zones were not discarded from.
    expect(deck.hand).toStrictEqual(["Shouldn't Move"]);
    expect(deck.library).toStrictEqual(["Shouldn't Move"]);
  });

  // Case - Discard from setAside: Library
  it("should discard from setAside when latestPlay is a Library", () => {
    // Arrange
    deck.latestPlay = "Library";
    const cards = ["Chapel", "Poacher"];
    const numberOfCards = [1, 2];
    deck.setAside = ["Chapel", "Poacher", "Poacher"];
    deck.graveyard = ["Silver"];
    deck.library = ["Shouldn't Move"];
    deck.hand = ["Shouldn't Move"];

    // Act - simulate discarding 3 cards with a Library.
    deck.processDiscardsLine(cards, numberOfCards);

    // Assert - Verify the setAside and graveyard zones contain the expected cards.
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.graveyard).toStrictEqual([
      "Silver",
      "Chapel",
      "Poacher",
      "Poacher",
    ]);
    // Verify the other zone were not discarded from.
    expect(deck.hand).toStrictEqual(["Shouldn't Move"]);
    expect(deck.library).toStrictEqual(["Shouldn't Move"]);
  });

  // Case - Discard from setAside: Sentry
  it("should discard from setAside when the latestPlay is a Sentry", () => {
    // Arrange
    deck.latestPlay = "Sentry";
    const cards = ["Province", "Gardens"];
    const numberOfCards = [1, 1];
    deck.setAside = ["Province", "Gardens"];
    deck.graveyard = ["Silver"];
    deck.library = ["Shouldn't Move"];
    deck.hand = ["Shouldn't Move"];

    // Act - Simulate discarding 2 cards with Sentry.
    deck.processDiscardsLine(cards, numberOfCards);

    //Assert - Verify the setAside and graveyard zones contain the expected cards.
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.graveyard).toStrictEqual(["Silver", "Province", "Gardens"]);
    // Verify other zones were not discarded from.
    expect(deck.hand).toStrictEqual(["Shouldn't Move"]);
    expect(deck.library).toStrictEqual(["Shouldn't Move"]);
  });

  // Case - Discard from setAside: Lookout
  it("should discard from setAside when the latestPlay is a Lookout", () => {
    // Arrange
    deck.latestPlay = "Lookout";
    deck.setAside = ["Province", "Silver"];
    deck.graveyard = ["Silver"];
    deck.library = ["Shouldn't Move"];
    deck.hand = ["Shouldn't Move"];

    const cards = ["Province"];
    const numberOfCards = [1];

    // Act - Simulate discarding a Province cards with Lookout.
    deck.processDiscardsLine(cards, numberOfCards);

    //Assert - Verify the setAside and graveyard zones contain the expected cards.
    expect(deck.setAside).toStrictEqual(["Silver"]);
    expect(deck.graveyard).toStrictEqual(["Silver", "Province"]);
    // Verify other zones were not discarded from.
    expect(deck.hand).toStrictEqual(["Shouldn't Move"]);
    expect(deck.library).toStrictEqual(["Shouldn't Move"]);
  });
});
