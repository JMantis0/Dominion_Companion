import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Method processDiscardsLine()", () => {
  // Instantiate Deck object.
  let deck = new Deck("", false, "", "pNick", "pName", []);
  // Spy on dependent methods.
  const discardFromSetAside = jest.spyOn(Deck.prototype, "discardFromSetAside");
  const discardFromLibrary = jest.spyOn(Deck.prototype, "discardFromLibrary");
  const discard = jest.spyOn(Deck.prototype, "discard");

  afterEach(() => {
    jest.clearAllMocks();
    deck = new Deck("", false, "", "pNick", "pName", []);
  });

  // Case: discard from hand
  it("should handle discarding cards from hand correctly", () => {
    // Arrange
    deck.latestPlay = "Militia";
    const cards = ["Copper", "Estate"];
    const numberOfCards = [1, 1];
    deck.hand = ["Copper", "Estate", "Estate"];
    deck.graveyard = ["Silver"];

    // Act - Simulate discarding two cards to an opponent's Militia.
    deck.processDiscardsLine(cards, numberOfCards);

    // Assert - Verify the hand and graveyard contain the expected cards.
    expect(deck.hand).toStrictEqual(["Estate"]);
    expect(deck.graveyard).toStrictEqual(["Silver", "Copper", "Estate"]);
    //  Verify that other zones were not discarded from.
    expect(discardFromSetAside).not.toBeCalled();
    expect(discardFromLibrary).not.toBeCalled();
  });

  // Case: discard from library
  it("should discard from the library when latestPlay is a Vassal", () => {
    // Arrange
    deck.latestPlay = "Vassal";
    const cards = ["Silver"];
    const numberOfCards = [1];
    deck.library = ["Copper", "Estate", "Silver"];
    deck.graveyard = ["Silver"];

    // Act - Simulate discarding from library with Vassal.
    deck.processDiscardsLine(cards, numberOfCards);

    // Assert - Verify the library and graveyard contain the expected cards.
    expect(deck.library).toStrictEqual(["Copper", "Estate"]);
    expect(deck.graveyard).toStrictEqual(["Silver", "Silver"]);
    // Verify that other zones were not discarded from.
    expect(discardFromSetAside).not.toBeCalled();
    expect(discard).not.toBeCalled();
  });

  it("should discard from setAside when latestPlay is a Bandit", () => {
    // Arrange
    deck.latestPlay = "Bandit";
    const cards = ["Smithy"];
    const numberOfCards = [1];
    deck.setAside = ["Smithy"];
    deck.graveyard = ["Silver"];

    // Act - Simulate discarding from library with Bandit.
    deck.processDiscardsLine(cards, numberOfCards);

    // Assert - Verify setAside and graveyard contain the expected cards.
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.graveyard).toStrictEqual(["Silver", "Smithy"]);
    // Verify other zones were not discarded from.
    expect(discard).not.toBeCalled();
    expect(discardFromLibrary).not.toBeCalled();
  });

  it("should discard from setAside when latestPlay is a Library", () => {
    // Arrange
    deck.latestPlay = "Library";
    const cards = ["Chapel", "Poacher"];
    const numberOfCards = [1, 2];
    deck.setAside = ["Chapel", "Poacher", "Poacher"];
    deck.graveyard = ["Silver"];

    // Act - simulate discarding 3 cards with a Library.
    deck.processDiscardsLine(cards, numberOfCards);

    expect(deck.setAside).toStrictEqual([]);
    expect(deck.graveyard).toStrictEqual([
      "Silver",
      "Chapel",
      "Poacher",
      "Poacher",
    ]);

    // Assert - Verify the setAside and graveyard zones contain the expected cards.
    expect(discardFromSetAside).toBeCalledTimes(3);
    // Verify the other zone were not discarded from.
    expect(discardFromLibrary).not.toBeCalled();
    expect(discard).not.toBeCalled();
  });

  it("should discard from setAside when the latestPlay is a Sentry", () => {
    // Arrange
    deck.latestPlay = "Sentry";
    const cards = ["Province", "Gardens"];
    const numberOfCards = [1, 1];
    deck.setAside = ["Province", "Gardens"];
    deck.graveyard = ["Silver"];

    // Act - Simulate discarding 2 cards with Sentry.
    deck.processDiscardsLine(cards, numberOfCards);

    //Assert - Verify the setAside and graveyard zones contain the expected cards.
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.graveyard).toStrictEqual(["Silver", "Province", "Gardens"]);
    // Verify other zones were not discarded from.
    expect(discardFromLibrary).not.toBeCalled();
    expect(discard).not.toBeCalled();
  });
});
