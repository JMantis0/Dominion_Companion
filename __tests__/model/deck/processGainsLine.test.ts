import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("processGainsLine", () => {
  // Declare Deck reference.
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", [
      "Copper",
      "Silver",
      "Gold",
      "Estate",
      "Merchant",
      "Bureaucrat",
      "Cellar",
      "Laboratory",
    ]);
    jest.clearAllMocks();
  });

  it("should add card gained by purchasing to graveyard.", () => {
    // Arrange
    deck.logArchive = ["Turn 3 - pName", "pNick plays a Gold. (+$3)"];
    const cards = ["Silver"];
    const numberOfCards = [1];
    const line = "pNick buys and gains a Silver.";

    // Mock a mid turn game board.
    deck.graveyard = [];
    deck.hand = ["Gold"];
    deck.library = ["Copper"];
    deck.entireDeck = ["Copper", "Gold"];

    // Act - Simulate gaining a Silver by buying.
    deck.processGainsLine(line, cards, numberOfCards);

    // Assert - Verify the card was gained into the graveyard and added to the entireDeck.
    expect(deck.graveyard).toStrictEqual(["Silver"]);
    expect(deck.entireDeck).toStrictEqual(["Copper", "Gold", "Silver"]);
    // Verify nothing was gained into the hand or library.
    expect(deck.hand).toStrictEqual(["Gold"]);
    expect(deck.library).toStrictEqual(["Copper"]);
    // Verify the logArchive did not change.
    expect(deck.logArchive).toStrictEqual([
      "Turn 3 - pName",
      "pNick plays a Gold. (+$3)",
    ]);
  });

  // This case occurs when a 'Buy without gain' line is processed into the logArchive.
  // The function should remove this entry from the logArchive to maintain it as a precise the
  // copy of the client game-log.
  it("should handle gaining a card was bought but not gained yet correctly, by removing an entry from the logArchive", () => {
    // Arrange
    deck.logArchive = ["pNick plays a Gold. (+$3)", "pNick buys a Silver."];
    deck.lastEntryProcessed = "pNick buys a Silver.";
    const cards = ["Silver"];
    const numberOfCards = [1];
    const line = "pNick buys and gains a Silver.";

    // Mock a mid turn game board.
    deck.graveyard = [];
    deck.hand = [];
    deck.library = ["Copper"];
    deck.entireDeck = ["Copper", "Gold"];

    // Act - Simulate buy a second Silver consecutively.
    deck.processGainsLine(line, cards, numberOfCards);

    // Assert - Verify entireDeck and graveyard contain the expected cards.
    expect(deck.graveyard).toStrictEqual(["Silver"]);
    expect(deck.entireDeck).toStrictEqual(["Copper", "Gold", "Silver"]);
    // Verify no cards were gained into hand or library
    expect(deck.hand).toStrictEqual([]);
    expect(deck.library).toStrictEqual(["Copper"]);
    // Verify the last line was removed from the logArchive, since it was a 'buy without gain' line.
    expect(deck.logArchive).toStrictEqual(["pNick plays a Gold. (+$3)"]);
  });

  // Case - Mine gain: should be added to hand.
  it("should add cards gained by a Mine to hand", () => {
    // Arrange
    deck.latestAction = "Mine";
    deck.lastEntryProcessed = "pNick trashes a Copper.";
    deck.logArchive = ["pNick plays a Mine.", "pNick trashes a Copper."];
    const cards = ["Silver"];
    const numberOfCards = [1];
    const line = "pNick gains a Silver.";

    // Mock a mid turn game board
    deck.graveyard = [];
    deck.hand = ["Bureaucrat"];
    deck.library = ["Copper"];
    deck.entireDeck = ["Copper", "Mine", "Bureaucrat"];

    // Act - Simulate gaining a Silver by playing a Mine.
    deck.processGainsLine(line, cards, numberOfCards);

    // Assert - Verify that a Silver was added to hand and to entireDeck.
    expect(deck.hand).toStrictEqual(["Bureaucrat", "Silver"]);
    expect(deck.entireDeck).toStrictEqual([
      "Copper",
      "Mine",
      "Bureaucrat",
      "Silver",
    ]);
    // Verify no cards were gained to graveyard or library.
    expect(deck.graveyard).toStrictEqual([]);
    expect(deck.library).toStrictEqual(["Copper"]);
    // Verify logArchive was not changed.
    expect(deck.logArchive).toStrictEqual([
      "pNick plays a Mine.",
      "pNick trashes a Copper.",
    ]);
  });

  // Case - Artisan gain: should be added to hand.
  it("should add cards gained by an Artisan to hand", () => {
    // Arrange
    deck.latestAction = "Artisan";
    deck.lastEntryProcessed = "pNick plays an Artisan.";
    deck.logArchive = ["pNick plays an Artisan."];

    // Arguments for function being tested.
    const cards = ["Laboratory"];
    const numberOfCards = [1];
    const line = "pNick gains a Laboratory.";
    // Mock a mid turn game board.
    deck.graveyard = [];
    deck.hand = ["Bureaucrat"];
    deck.library = ["Copper"];
    deck.entireDeck = ["Copper", "Artisan", "Bureaucrat"];

    // Act - Simulate gaining a Laboratory by playing an Artisan.
    deck.processGainsLine(line, cards, numberOfCards);

    // Assert - Verify the Laboratory was added to hand and entireDeck.
    expect(deck.hand).toStrictEqual(["Bureaucrat", "Laboratory"]);
    expect(deck.entireDeck).toStrictEqual([
      "Copper",
      "Artisan",
      "Bureaucrat",
      "Laboratory",
    ]);
    // Verify nothing was gained to library or graveyard.
    expect(deck.library).toStrictEqual(["Copper"]);
    expect(deck.graveyard).toStrictEqual([]);
    // Verify logArchive is unchanged.
    expect(deck.logArchive).toStrictEqual(["pNick plays an Artisan."]);
  });

  // Case Gain into library.
  it("should add cards gained by Bureaucrat to library.", () => {
    // Arrange
    const cards = ["Silver"];
    const numberOfCards = [1];
    const line = "pNick gains a Silver.";
    deck.latestAction = "Bureaucrat";
    deck.lastEntryProcessed = "pNick plays a Bureaucrat.";
    deck.logArchive = ["pNick plays an Bureaucrat."];
    // Mock a mid turn game board.
    deck.graveyard = [];
    deck.hand = ["Artisan"];
    deck.library = ["Copper"];
    deck.entireDeck = ["Copper", "Artisan", "Bureaucrat"];

    // Act - Simulate gaining a Silver by playing a Bureaucrat.
    deck.processGainsLine(line, cards, numberOfCards);

    // Assert - Verify a Silver was added to library and entireDeck.
    expect(deck.library).toStrictEqual(["Copper", "Silver"]);
    expect(deck.entireDeck).toStrictEqual([
      "Copper",
      "Artisan",
      "Bureaucrat",
      "Silver",
    ]);
    // Verify nothing was gained into hand or graveyard.
    expect(deck.hand).toStrictEqual(["Artisan"]);
    expect(deck.graveyard).toStrictEqual([]);
    // Verify the logArchive was not changed.
    expect(deck.logArchive).toStrictEqual(["pNick plays an Bureaucrat."]);
  });

  it("should add cards gained by Armory to library.", () => {
    // Arrange
    const cards = ["Courier"];
    const numberOfCards = [1];
    const line = "pNick gains a Courier.";
    deck.latestAction = "Armory";
    deck.graveyard = [];
    deck.hand = ["Artisan"];
    deck.library = ["Copper"];
    deck.entireDeck = ["Copper", "Artisan", "Armory"];

    // Act - Simulate gaining a Silver by playing a Bureaucrat.
    deck.processGainsLine(line, cards, numberOfCards);

    // Assert - Verify a Silver was added to library and entireDeck.
    expect(deck.library).toStrictEqual(["Copper", "Courier"]);
    expect(deck.entireDeck).toStrictEqual([
      "Copper",
      "Artisan",
      "Armory",
      "Courier",
    ]);
    // Verify nothing was gained into hand or graveyard.
    expect(deck.hand).toStrictEqual(["Artisan"]);
    expect(deck.graveyard).toStrictEqual([]);
    // Verify the logArchive was not changed.
  });
});
