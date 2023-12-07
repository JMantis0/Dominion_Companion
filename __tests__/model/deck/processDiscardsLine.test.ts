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
    deck.latestAction = "Militia";
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
    deck.latestAction = "Vassal";
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

  // Case - discard from library: Courier
  it("should discard from the library when latestPlay is a Courier", () => {
    // Arrange
    deck.latestAction = "Courier";
    const cards = ["Silver"];
    const numberOfCards = [1];
    deck.library = ["Copper", "Estate", "Silver"];
    deck.graveyard = ["Silver"];
    deck.setAside = ["Shouldn't Move"];
    deck.hand = ["Shouldn't Move"];

    // Act - Simulate discarding from library with Courier.
    deck.processDiscardsLine(cards, numberOfCards);

    // Assert - Verify the library and graveyard contain the expected cards.
    expect(deck.library).toStrictEqual(["Copper", "Estate"]);
    expect(deck.graveyard).toStrictEqual(["Silver", "Silver"]);
    // Verify that other zones were not discarded from.
    expect(deck.setAside).toStrictEqual(["Shouldn't Move"]);
    expect(deck.hand).toStrictEqual(["Shouldn't Move"]);
  });

  // Case - discard from library: Harvest
  it("should discard from the library when latestPlay is a Harvest", () => {
    // Arrange
    deck.latestAction = "Harvest";
    deck.library = [
      "Copper",
      "Estate",
      "Silver",
      "Silver",
      "Silver",
      "Hunting Party",
    ];
    deck.graveyard = ["Silver"];
    deck.setAside = ["Shouldn't Move"];
    deck.hand = ["Shouldn't Move"];

    // Act - Simulate discarding from library with Harvest.
    deck.processDiscardsLine(["Silver", "Hunting Party"], [3, 1]);

    // Assert - Verify the library and graveyard contain the expected cards.
    expect(deck.library).toStrictEqual(["Copper", "Estate"]);
    expect(deck.graveyard).toStrictEqual([
      "Silver",
      "Silver",
      "Silver",
      "Silver",
      "Hunting Party",
    ]);
    // Verify that other zones were not discarded from.
    expect(deck.setAside).toStrictEqual(["Shouldn't Move"]);
    expect(deck.hand).toStrictEqual(["Shouldn't Move"]);
  });

  // Case - Discard from setAside: Bandit
  it("should discard from setAside when latestPlay is a Bandit", () => {
    // Arrange
    deck.latestAction = "Bandit";
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
    deck.latestAction = "Library";
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
    deck.latestAction = "Sentry";
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
    deck.latestAction = "Lookout";
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

  // Case - Discard from setAside: Sage
  it("should discard from setAside when the latestPlay is a Sage", () => {
    // Arrange
    deck.latestAction = "Sage";
    deck.setAside = ["Province", "Silver"];
    deck.graveyard = ["Silver"];
    deck.library = ["Shouldn't Move"];
    deck.hand = ["Shouldn't Move"];

    const cards = ["Province", "Silver"];
    const numberOfCards = [1, 1];

    // Act - Simulate discarding a Province cards with Sage.
    deck.processDiscardsLine(cards, numberOfCards);

    //Assert - Verify the setAside and graveyard zones contain the expected cards.
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.graveyard).toStrictEqual(["Silver", "Province", "Silver"]);
    // Verify other zones were not discarded from.
    expect(deck.hand).toStrictEqual(["Shouldn't Move"]);
    expect(deck.library).toStrictEqual(["Shouldn't Move"]);
  });

  // Case - Discard from setAside: Farming Village
  it("should discard from setAside when the latestPlay is a Farming Village", () => {
    // Arrange
    deck.latestAction = "Farming Village";
    deck.setAside = ["Province", "Silver"];
    deck.graveyard = ["Silver"];
    deck.library = ["Shouldn't Move"];
    deck.hand = ["Shouldn't Move"];

    const cards = ["Province", "Silver"];
    const numberOfCards = [1, 1];

    // Act - Simulate discarding a Province cards with Farming Village.
    deck.processDiscardsLine(cards, numberOfCards);

    //Assert - Verify the setAside and graveyard zones contain the expected cards.
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.graveyard).toStrictEqual(["Silver", "Province", "Silver"]);
    // Verify other zones were not discarded from.
    expect(deck.hand).toStrictEqual(["Shouldn't Move"]);
    expect(deck.library).toStrictEqual(["Shouldn't Move"]);
  });

  it("should discard from setAside when discards are caused by a Wandering Minstrel", () => {
    // Arrange
    deck.latestAction = "Wandering Minstrel";
    deck.library = ["Estate", "Copper"];
    deck.setAside = ["Estate", "Copper", "Copper"];
    deck.graveyard = ["Bureaucrat"];

    // Act
    deck.processDiscardsLine(["Estate", "Copper"], [1, 2]);

    // Assert - Verify the cards were moved from setAside to graveyard.
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.graveyard).toStrictEqual([
      "Bureaucrat",
      "Estate",
      "Copper",
      "Copper",
    ]);
  });

  it("should discard from setAside when discards are caused by a Hunter", () => {
    // Arrange
    deck.latestAction = "Hunter";
    deck.library = ["Estate", "Copper"];
    deck.setAside = ["Copper"];
    deck.graveyard = ["Bureaucrat"];

    // Act
    deck.processDiscardsLine(["Copper"], [1]);

    // Assert - Verify the cards were moved from setAside to graveyard.
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.graveyard).toStrictEqual(["Bureaucrat", "Copper"]);
  });

  it("should discard from setAside when discards are caused by a Cartographer", () => {
    // Arrange
    deck.latestAction = "Cartographer";
    deck.library = ["Estate", "Copper"];
    deck.setAside = ["Copper", "Copper", "Silver", "Silver"];
    deck.graveyard = ["Bureaucrat"];

    // Act
    deck.processDiscardsLine(["Copper"], [2]);

    // Assert - Verify the cards were moved from setAside to graveyard.
    expect(deck.setAside).toStrictEqual(["Silver", "Silver"]);
    expect(deck.graveyard).toStrictEqual(["Bureaucrat", "Copper", "Copper"]);
  });

  it("should discard from setAside when discards are caused by a Hunting Party", () => {
    // Arrange
    deck.latestAction = "Hunting Party";
    deck.library = ["Estate", "Copper"];
    deck.setAside = ["Silver", "Silver"];
    deck.graveyard = ["Bureaucrat"];

    // Act
    deck.processDiscardsLine(["Silver"], [2]);

    // Assert - Verify the cards were moved from setAside to graveyard.
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.graveyard).toStrictEqual(["Bureaucrat", "Silver", "Silver"]);
  });
});
