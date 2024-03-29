import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("processTrashesLine", () => {
  // Declare Deck reference.
  let deck: Deck;
  const isDurationEffect = jest
    .spyOn(BaseDeck.prototype, "isDurationEffect")
    .mockReturnValue(false);

  beforeEach(() => {
    deck = new Deck("", false, "", "pNick", "pName", []);
    jest.clearAllMocks();
  });

  it("should trash cards not trashed by Sentry, Bandit, or Lookout from hand.", () => {
    //Arrange
    deck.latestAction = "Moneylender";
    deck.hand = ["Copper", "Estate"];
    deck.setAside = ["Bureaucrat"];
    deck.entireDeck = ["Moneylender", "Bureaucrat", "Copper", "Estate"];
    // Arguments for function being tested.
    const cards = ["Copper"];
    const numberOfCards = [1];

    // Act - simulate trashing a Copper from hand by a Moneylender.
    deck.processTrashesLine("Non-duration effect line", cards, numberOfCards);

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
    deck.latestAction = "Sentry";
    deck.hand = ["Bureaucrat"];
    deck.setAside = ["Estate", "Copper"];
    deck.entireDeck = ["Bureaucrat", "Sentry", "Copper", "Estate"];

    // Arguments for function being tested.
    const cards = ["Estate", "Copper"];
    const numberOfCards = [1, 1];

    // Act - simulate trashing an Estate and a Copper from setAside by a Sentry.
    deck.processTrashesLine("Non-duration effect line", cards, numberOfCards);

    // Assert - Verify cards were removed from setAside and entireDeck
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.entireDeck).toStrictEqual(["Bureaucrat", "Sentry"]);
    // Verify hand is unchanged
    expect(deck.hand).toStrictEqual(["Bureaucrat"]);
  });

  it("should trash cards trashed by Bandit from setAside.", () => {
    // Arrange
    deck.latestAction = "Bandit";
    deck.setAside = ["Silver", "Estate"];
    deck.hand = ["Silver"];
    deck.entireDeck = ["Silver", "Silver", "Estate"];
    // Arguments for function being tested.
    const cards = ["Silver"];
    const numberOfCards = [1];

    // Act - simulate trashing a Silver from setAside by a Bandit.
    deck.processTrashesLine("Non-duration effect line", cards, numberOfCards);

    // Assert - Verify the card was removed from setAside and entireDeck
    expect(deck.setAside).toStrictEqual(["Estate"]);
    expect(deck.entireDeck).toStrictEqual(["Silver", "Estate"]);
    // Verify hand is not changed
    expect(deck.hand).toStrictEqual(["Silver"]);
  });

  it("should trash cards trashed by Lookout from setAside.", () => {
    // Arrange
    deck.latestAction = "Lookout";
    deck.setAside = ["Silver", "Estate", "Estate"];
    deck.hand = ["Silver"];
    deck.entireDeck = ["Silver", "Silver", "Estate", "Estate"];
    // Arguments for function being tested.
    const cards = ["Estate"];
    const numberOfCards = [1];

    // Act - simulate trashing an Estate from setAside by a Lookout.
    deck.processTrashesLine("Non-duration effect line", cards, numberOfCards);

    // Assert - Verify the card was removed from setAside and entireDeck
    expect(deck.setAside).toStrictEqual(["Silver", "Estate"]);
    expect(deck.entireDeck).toStrictEqual(["Silver", "Silver", "Estate"]);
    // Verify hand is not changed
    expect(deck.hand).toStrictEqual(["Silver"]);
  });

  it("should trash from setAside when caused by a Crystal Ball.", () => {
    // Arrange
    deck.latestAction = "Crystal Ball";
    deck.setAside = ["Silver", "Estate", "Estate"];
    deck.hand = ["Silver"];
    deck.entireDeck = ["Silver", "Silver", "Estate", "Estate"];
    // Arguments for function being tested.
    const cards = ["Estate"];
    const numberOfCards = [1];

    // Act - simulate trashing an Estate from setAside by a Crystal Ball.
    deck.processTrashesLine("Non-duration effect line", cards, numberOfCards);

    // Assert - Verify the card was removed from setAside and entireDeck
    expect(deck.setAside).toStrictEqual(["Silver", "Estate"]);
    expect(deck.entireDeck).toStrictEqual(["Silver", "Silver", "Estate"]);
    // Verify hand is not changed
    expect(deck.hand).toStrictEqual(["Silver"]);
  });

  it("should trash cards trashed by Sentinel from setAside.", () => {
    // Arrange
    deck.latestAction = "Sentinel";
    deck.setAside = ["Silver", "Estate", "Copper", "Copper", "Copper"];
    deck.hand = ["Silver", "Estate"];
    deck.entireDeck = [
      "Silver",
      "Estate",
      "Copper",
      "Copper",
      "Copper",
      "Silver",
      "Estate",
    ];
    // Arguments for function being tested.
    const cards = ["Estate", "Copper"];
    const numberOfCards = [1, 1];

    // Act - simulate trashing an Estate from setAside by a Lookout.
    deck.processTrashesLine("Non-duration effect line", cards, numberOfCards);

    // Assert - Verify the card was removed from setAside and entireDeck
    expect(deck.entireDeck).toStrictEqual([
      "Silver",
      "Copper",
      "Copper",
      "Silver",
      "Estate",
    ]);
    expect(deck.setAside).toStrictEqual(["Silver", "Copper", "Copper"]);
    // Verify hand is not changed
    expect(deck.hand).toStrictEqual(["Silver", "Estate"]);
  });

  it("should trash cards trashed by Swindler from library.", () => {
    // Arrange
    deck.latestAction = "Swindler";
    deck.library = ["Silver", "Estate"];
    deck.hand = ["Silver", "Estate"];
    deck.entireDeck = ["Silver", "Silver", "Estate", "Estate"];
    // Arguments for function being tested.
    const cards = ["Estate"];
    const numberOfCards = [1];

    // Act - simulate trashing an Estate from library by a Swindler.
    deck.processTrashesLine("Non-duration effect line", cards, numberOfCards);

    // Assert - Verify the card was removed from library and entireDeck
    expect(deck.entireDeck).toStrictEqual(["Silver", "Silver", "Estate"]);
    expect(deck.library).toStrictEqual(["Silver"]);
    // Verify hand is not changed
    expect(deck.hand).toStrictEqual(["Silver", "Estate"]);
  });

  it("should remove cards trashed by Barbarian from library.", () => {
    // Arrange
    deck.latestAction = "Barbarian";
    deck.library = ["Silver", "Estate", "Vassal"];
    deck.hand = ["Silver", "Estate"];
    deck.entireDeck = ["Silver", "Silver", "Estate", "Estate", "Vassal"];
    // Arguments for function being tested.
    const cards = ["Vassal"];
    const numberOfCards = [1];

    // Act - simulate trashing an Estate from library by a Swindler.
    deck.processTrashesLine("Non-duration effect line", cards, numberOfCards);

    // Assert - Verify the card was removed from library and entireDeck
    expect(deck.entireDeck).toStrictEqual([
      "Silver",
      "Silver",
      "Estate",
      "Estate",
    ]);
    expect(deck.library).toStrictEqual(["Silver", "Estate"]);
    // Verify hand is not changed
    expect(deck.hand).toStrictEqual(["Silver", "Estate"]);
  });

  it(
    "should trash from inPlay if the latestAction is 'Treasure Map' and the lastEntryProcessed " +
      "matches ' plays a Treasure Map.",
    () => {
      // Arrange
      deck.lastEntryProcessed = "P plays a Treasure Map.";
      deck.latestAction = "Treasure Map";
      deck.entireDeck = ["Treasure Map", "Copper", "Estate"];
      deck.inPlay = ["Treasure Map"];
      deck.library = ["Copper"];
      deck.hand = ["Estate"];
      deck.trash = ["Copper"];

      // Act
      deck.processTrashesLine(
        "Non-duration effect line",
        ["Treasure Map"],
        [1]
      );

      // Assert - Verify the card was trashed from inPlay
      expect(deck.inPlay).toStrictEqual([]);
      expect(deck.trash).toStrictEqual(["Copper", "Treasure Map"]);
      // Verify the card was removed from the entire deck.
      expect(deck.entireDeck).toStrictEqual(["Copper", "Estate"]);
    }
  );

  it("should trash from inPlay if the latestAction is 'Mining Village", () => {
    // Arrange
    deck.latestAction = "Mining Village";
    deck.entireDeck = ["Copper", "Estate", "Mining Village", "Copper"];
    deck.inPlay = ["Mining Village"];
    deck.library = ["Copper"];
    deck.hand = ["Estate", "Copper"];
    deck.trash = ["Copper"];

    // Act
    deck.processTrashesLine(
      "Non-duration effect line",
      ["Mining Village"],
      [1]
    );

    // Assert - Verify the card was trashed from inPlay
    expect(deck.inPlay).toStrictEqual([]);
    expect(deck.trash).toStrictEqual(["Copper", "Mining Village"]);
    // Verify the card was removed from the entire deck.
    expect(deck.entireDeck).toStrictEqual(["Copper", "Estate", "Copper"]);
  });

  it("should trash from inPlay if the latestAction is 'Tragic Hero", () => {
    // Arrange
    deck.latestAction = "Tragic Hero";
    deck.entireDeck = [
      "Copper",
      "Estate",
      "Tragic Hero",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
    ];
    deck.inPlay = ["Tragic Hero"];
    deck.library = ["Copper"];
    deck.hand = [
      "Estate",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
    ];
    deck.trash = ["Copper"];

    // Act
    deck.processTrashesLine("Non-duration effect line", ["Tragic Hero"], [1]);

    // Assert - Verify the card was trashed from inPlay
    expect(deck.inPlay).toStrictEqual([]);
    expect(deck.trash).toStrictEqual(["Copper", "Tragic Hero"]);
    // Verify the card was removed from the entire deck.
    expect(deck.entireDeck).toStrictEqual([
      "Copper",
      "Estate",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
    ]);
  });

  it("should trash from inPlay if the current line is a durationEffect of a Cabin Boy", () => {
    // Arrange
    deck.latestAction = "None";
    deck.entireDeck = ["Copper", "Copper", "Copper", "Copper", "Cabin Boy"];
    deck.inPlay = ["Cabin Boy"];
    deck.library = ["Copper"];
    deck.hand = ["Copper", "Copper", "Copper"];
    deck.trash = ["Estate"];
    isDurationEffect.mockReturnValue(true);

    // Act
    deck.processTrashesLine(
      "G trashes a Cabin Boy. (Cabin Boy)",
      ["Cabin Boy"],
      [1]
    );

    // Assert - Verify the card was trashed from inPlay
    expect(deck.inPlay).toStrictEqual([]);
    expect(deck.trash).toStrictEqual(["Estate", "Cabin Boy"]);
    // Verify the card was removed from the entire deck.
    expect(deck.entireDeck).toStrictEqual([
      "Copper",
      "Copper",
      "Copper",
      "Copper",
    ]);
  });

  it(
    "should trash from hand if the latestAction is 'Treasure Map' and the lastEntryProcessed " +
      "matches ' trashes a Treasure Map.",
    () => {
      // Arrange
      deck.lastEntryProcessed = "P trashes Treasure Map.";
      deck.latestAction = "Treasure Map";
      deck.entireDeck = ["Treasure Map", "Copper", "Estate"];
      deck.inPlay = [];
      deck.library = ["Copper"];
      deck.hand = ["Estate", "Treasure Map"];
      deck.trash = ["Copper", "Treasure Map"];

      // Act
      deck.processTrashesLine(
        "Non-duration effect line",
        ["Treasure Map"],
        [1]
      );

      // Assert - Verify the card was trashed from inPlay
      expect(deck.hand).toStrictEqual(["Estate"]);
      expect(deck.trash).toStrictEqual([
        "Copper",
        "Treasure Map",
        "Treasure Map",
      ]);
      // Verify the card was removed from the entire deck.
      expect(deck.entireDeck).toStrictEqual(["Copper", "Estate"]);
    }
  );
});
