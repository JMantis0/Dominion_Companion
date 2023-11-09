import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Method processLooksAtLine", () => {
  // Declare Deck reference
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
    jest.clearAllMocks();
  });

  it("should take no action if the look was not cause by a Library, Sentry, or Bandit", () => {
    // Arrange
    deck.latestPlay = "Harbinger";
    deck.hand = ["Copper", "Estate"];
    deck.library = ["Bureaucrat"];
    deck.setAside = [];
    deck.waitToDrawLibraryLook = false;

    // Arguments for function being tested
    const cards = ["Copper", "Estate", "Moat", "Poacher"];
    const numberOfCards = [3, 3, 1, 2];

    // Act - Simulate looking at card with a Harbinger
    deck.processLooksAtLine(cards, numberOfCards);

    // Assert - Verify no cards were moved from the hand, library, setAside.
    expect(deck.hand).toStrictEqual(["Copper", "Estate"]);
    expect(deck.library).toStrictEqual(["Bureaucrat"]);
    expect(deck.setAside).toStrictEqual([]);
    // Verify waiToDrawLibraryLook is not changed
    expect(deck.waitToDrawLibraryLook).toBe(false);
  });

  it("should move the cards to setAside if look is caused by a Sentry", () => {
    // Arrange
    deck.latestPlay = "Sentry";
    deck.hand = ["Bureaucrat"];
    deck.library = ["Copper", "Estate", "Province"];
    deck.setAside = [];
    deck.waitToDrawLibraryLook = false;

    // Arguments for function being tested
    const cards = ["Copper", "Province"];
    const numberOfCards = [1, 1];

    // Act - Simulate looking at a Copper and Province with a Sentry
    deck.processLooksAtLine(cards, numberOfCards);

    // Assert - Verify the cards were moved from library to setAside
    expect(deck.setAside).toStrictEqual(["Copper", "Province"]);
    expect(deck.library).toStrictEqual(["Estate"]);
    // Verify hand and waitToDrawLibraryLook are not changed.
    expect(deck.hand).toStrictEqual(["Bureaucrat"]);
    expect(deck.waitToDrawLibraryLook).toBe(false);
  });

  it("should move the cards to setAside if look is caused by a Bandit", () => {
    // Arrange
    deck.latestPlay = "Bandit";
    deck.hand = ["Bureaucrat"];
    deck.library = ["Smithy", "Gold", "Province"];
    deck.setAside = [];
    deck.waitToDrawLibraryLook = false;

    // Arguments for function being tested
    const cards = ["Smithy", "Gold"];
    const numberOfCards = [1, 1];

    // Act - Simulate looking at a Copper and Province with a Sentry
    deck.processLooksAtLine(cards, numberOfCards);

    // Assert - Verify cards were moved from library to setAside
    expect(deck.setAside).toStrictEqual(["Smithy", "Gold"]);
    expect(deck.library).toStrictEqual(["Province"]);
    // Verify hand and waitToDrawLibraryLook are unchanged.
    expect(deck.hand).toStrictEqual(["Bureaucrat"]);
    expect(deck.waitToDrawLibraryLook).toBe(false);
  });

  it("should draw certain cards immediately if they are looked at by a Library", () => {
    // Arrange
    deck.latestPlay = "Library";
    deck.hand = ["Bureaucrat"];
    deck.library = [
      "Smithy",
      "Gold",
      "Silver",
      "Copper",
      "Gardens",
      "Province",
      "Duchy",
      "Estate",
      "Curse",
    ];
    deck.setAside = [];
    deck.waitToDrawLibraryLook = false;
    // Arguments for function being tested
    const numberOfCards = [1];

    // Act - simulate a Library looking at a Gold
    deck.processLooksAtLine(["Gold"], numberOfCards);
    deck.processLooksAtLine(["Silver"], numberOfCards);
    deck.processLooksAtLine(["Copper"], numberOfCards);
    deck.processLooksAtLine(["Gardens"], numberOfCards);
    deck.processLooksAtLine(["Province"], numberOfCards);
    deck.processLooksAtLine(["Duchy"], numberOfCards);
    deck.processLooksAtLine(["Estate"], numberOfCards);
    deck.processLooksAtLine(["Curse"], numberOfCards);

    // Assert - Verify the cards were drawn from library to hand
    expect(deck.hand).toStrictEqual([
      "Bureaucrat",
      "Gold",
      "Silver",
      "Copper",
      "Gardens",
      "Province",
      "Duchy",
      "Estate",
      "Curse",
    ]);
    expect(deck.library).toStrictEqual(["Smithy"]);
    // Verify setAside and waitToDrawLibraryLook are unchanged.
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.waitToDrawLibraryLook).toBe(false);
  });

  it("should move cards that looked at by a Library, but not drawn immediately to setAside, and waitToDrawLibraryLook should be set to true", () => {
    // Arrange
    deck.latestPlay = "Library";
    deck.hand = ["Market"];
    deck.library = ["Smithy", "Bureaucrat"];
    deck.setAside = [];
    deck.waitToDrawLibraryLook = false;

    // Arguments for function being tested
    const cards = ["Bureaucrat"];
    const numberOfCards = [1];

    // Act - Simulate a player skipping a Bureaucrat while looking at cards with a Library
    deck.processLooksAtLine(cards, numberOfCards);

    // Assert - Verify card was moved from library to setAside and waitToDrawLibraryLook is true
    expect(deck.library).toStrictEqual(["Smithy"]);
    expect(deck.setAside).toStrictEqual(["Bureaucrat"]);
    expect(deck.waitToDrawLibraryLook).toBe(true);
    // Verify hand is unchanged
    expect(deck.hand).toStrictEqual(["Market"]);
  });
});
