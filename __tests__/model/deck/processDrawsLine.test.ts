import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Method processDrawsLine", () => {
  // Instantiate Deck object.
  let deck = new Deck("", false, "", "pName", "pNick", []);

  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", [
      "Copper",
      "Silver",
      "Gold",
      "Estate",
      "Merchant",
      "Bureaucrat",
      "Cellar",
    ]);
  });

  // Case where there are 5 draws taking place on one line and a shuffle occurred
  // on the previous line: no cleanup should occur.
  it("should not cleanup before drawing if lastLineProcessed is a shuffle", () => {
    // Arrange
    deck.library = ["Copper", "Copper", "Silver", "Gold", "Merchant"];
    deck.logArchive = [
      "pNick plays a Merchant.",
      "pNick draws an Estate.",
      "pNick gets +1 Action.",
      "pNick plays a Silver. (+$2)",
      "pNick gets +$1. (Merchant)",
      "pNick plays a Gold. (+$3)",
      "pNick buys and gains a Gold.",
      "pNick shuffles their deck.",
    ];
    deck.lastEntryProcessed = "pNick shuffles their deck.";

    // Mock a mid turn game board
    deck.inPlay = ["Shouldn't Move"];
    deck.graveyard = [];
    deck.hand = ["Copper"];
    deck.library = [
      "Copper",
      "Copper",
      "Silver",
      "Gold",
      "Merchant",
      "Bureaucrat",
    ];

    // Arguments for function being tested
    const line = "pNick draws 2 Coppers, a Silver, a Gold, and a Merchant.";
    const cards = ["Copper", "Silver", "Gold", "Merchant"];
    const numberOfCards = [2, 1, 1, 1];

    // Act - simulate drawing where a shuffle already occurred on the previous line.
    // with draws that were caused by turn ending.
    deck.processDrawsLine(line, cards, numberOfCards);

    // Assert - Verify the hand and library contain the expected cards
    expect(deck.hand).toStrictEqual([
      "Copper",
      "Copper",
      "Copper",
      "Silver",
      "Gold",
      "Merchant",
    ]);
    expect(deck.library).toStrictEqual(["Bureaucrat"]);
    // Verify no cleanup or occurred (inPlay and graveyard should not change)
    expect(deck.inPlay).toStrictEqual(["Shouldn't Move"]);
    expect(deck.graveyard).toStrictEqual([]);
  });

  // Case where there are 5 draws taking place on one line and
  // they were caused by playing a Cellar: no cleanup should occur.
  it("should not cleanup before drawing if draws are caused by a Cellar", () => {
    // Arrange
    deck.library = ["Copper", "Copper", "Silver", "Gold", "Estate"];
    deck.logArchive = [
      "pNick plays a Laboratory.",
      "pNick draws a Cellar and a Merchant.",
      "pNick gets +1 Action.",
      "pNick plays a Cellar.",
      "pNick gets +1 Action.",
      "pNick discards a Copper, 2 Silvers, a Cellar, and a Merchant.",
    ];
    deck.lastEntryProcessed =
      "pNick discards a Copper, 2 Silvers, a Cellar, and a Merchant.";

    // Mock a mid turn game board
    deck.inPlay = ["Shouldn't Move"];
    deck.graveyard = [];
    deck.hand = ["Copper"];
    deck.library = [
      "Copper",
      "Copper",
      "Silver",
      "Gold",
      "Estate",
      "Bureaucrat",
    ];

    // Arguments for function being tested
    const line = "pNick draws 2 Coppers, a Silver, a Gold, and an Estate.";
    const cards = ["Copper", "Silver", "Gold", "Estate"];
    const numberOfCards = [2, 1, 1, 1];

    // Act - simulate drawing where a shuffle already occurred on the previous line.
    // with draws that were caused by turn ending.
    deck.processDrawsLine(line, cards, numberOfCards);

    // Assert - Verify hand and library contain the expected cards.
    expect(deck.hand).toStrictEqual([
      "Copper",
      "Copper",
      "Copper",
      "Silver",
      "Gold",
      "Estate",
    ]);
    expect(deck.library).toStrictEqual(["Bureaucrat"]);
    // Verify no cleanup or occurred (inPlay and graveyard should not change)
    expect(deck.graveyard).toStrictEqual([]);
    expect(deck.inPlay).toStrictEqual(["Shouldn't Move"]);
  });

  // Case where a cleanup is needed before drawing
  // (5 draws, no shuffle, no Cellar play)
  it("should cleanup correctly before drawing", () => {
    // Arrange
    deck.library = ["Copper", "Copper", "Estate", "Estate", "Bureaucrat"];
    deck.logArchive = [
      "Turn 3 - oName",
      "oNick plays 3 Coppers. (+$3)",
      "oNick buys and gains a Silver.",
      "oNick draws 5 cards.",
      "Turn 3 - pName",
      "pNick plays a Silver and 3 Coppers. (+$5)",
      "pNick buys and gains a Festival.",
    ];
    deck.lastEntryProcessed = "pNick buys and gains a Festival.";

    // Mock a mid turn game board
    deck.inPlay = ["Silver", "Copper", "Copper", "Copper"];
    deck.graveyard = [];
    deck.hand = ["Estate"];
    deck.library = [
      "Copper",
      "Copper",
      "Estate",
      "Gold",
      "Estate",
      "Bureaucrat",
    ];

    // Arguments for the function being tested
    const line = "pNick draws 2 Coppers, 2 Estates, and a Bureaucrat.";
    const cards = ["Copper", "Estate", "Bureaucrat"];
    const numberOfCards = [2, 2, 1];

    // Act - Simulate drawing 5 cards at end of turn where a cleanup is needed.
    deck.processDrawsLine(line, cards, numberOfCards);

    // Assert - Verify that hand, inPlay, library, and graveyard contain the expected cards
    expect(deck.hand).toStrictEqual([
      "Copper",
      "Copper",
      "Estate",
      "Estate",
      "Bureaucrat",
    ]);
    expect(deck.library).toStrictEqual(["Gold"]);
    expect(deck.graveyard).toStrictEqual([
      "Copper",
      "Copper",
      "Copper",
      "Silver",
      "Estate",
    ]);
    expect(deck.inPlay).toStrictEqual([]);
  });

  // Case where cleanUp is not needed because there are *not* exactly 5 cards
  // being drawn.
  it("should not cleanup when there are not exactly 5 draws occurring", () => {
    // Arrange
    deck.library = ["Cellar", "Merchant"];
    deck.logArchive = [
      "L plays a Silver, a Gold, and a Copper. (+$6)",
      "L buys and gains a Duchy.",
      "L shuffles their deck.",
      "L draws 5 cards.",
      "Turn 16 - GoodBeard",
      "pNick plays a Laboratory.",
    ];
    deck.lastEntryProcessed = "pNick plays a Laboratory.";

    // Mock a mid turn game board
    deck.inPlay = ["Shouldn't Move"];
    deck.graveyard = ["Shouldn't Move"];
    deck.hand = ["Estate"];
    deck.library = ["Merchant", "Cellar", "Bureaucrat"];
    // Arguments for the function being tested
    const line = "pNick draws a Cellar and a Merchant.";
    const cards = ["Cellar", "Merchant"];
    const numberOfCards = [1, 1];

    // Act - Simulate drawing 5 cards at end of turn where a cleanup is needed.
    deck.processDrawsLine(line, cards, numberOfCards);

    // Assert - Verify the hand and library contain the correct cards
    expect(deck.library).toStrictEqual(["Bureaucrat"]);
    expect(deck.hand).toStrictEqual(["Estate", "Cellar", "Merchant"]);
    // Verify the inPlay and graveyard zones were not changed (there was no cleanup)
    expect(deck.inPlay).toStrictEqual(["Shouldn't Move"]);
    expect(deck.graveyard).toStrictEqual(["Shouldn't Move"]);
  });
});
