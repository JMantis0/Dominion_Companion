import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("shuffleAndCleanupIfNeeded", () => {
  // Declare Deck reference.
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  // Note: a cleanup is needed if there are exactly 5 cards being drawn on the line, and those cards were not drawn
  // as a result of a Cellar.  Also note, that in the rare case that there are less than 5 cards in the entire deck,
  // a cleanup may be needed even if there are less than 5 draws on the current line.  In such a rare case, the amount
  // of cards being drawn on the line would need to be equal to the number of cards in the entire deck.

  // 6 Cases to check.
  // 1) No shuffle
  // 2) shuffle && entireDeck.length >= 5 && draws != 5
  // 3) shuffle && entireDeck.length >= 5 && draws = 5 caused by Cellar
  // 4) shuffle && entireDeck.length >= 5 && draws = 5 not caused by Cellar
  // 5) shuffle && entireDeck.length = n < 5 && draws = n
  // 6) shuffle && entireDeck.length = n < 5 && draws < n

  // Case 1 - No Shuffle
  it("should not cleanup or shuffle or if value of field 'waitToShuffle' is false.", () => {
    // Arrange
    deck.waitToShuffle = false;
    deck.inPlay = ["Bureaucrat"];
    deck.hand = ["Moneylender"];
    deck.graveyard = ["Market"];
    deck.library = ["Estate"];

    // Line with 1 card being drawn.
    const line = "pNick draws a Copper.";

    // Act - Simulate processing a log where the previous line was not a 'shuffles their deck' line.
    deck.shuffleAndCleanUpIfNeeded(line);

    // Assert - Verify that the no cleanup occurred and no shuffle occurred
    expect(deck.inPlay).toStrictEqual(["Bureaucrat"]);
    expect(deck.hand).toStrictEqual(["Moneylender"]);
    expect(deck.graveyard).toStrictEqual(["Market"]);
    expect(deck.library).toStrictEqual(["Estate"]);
  });

  // Case 2 - Shuffle && entireDeck.length >= 5 && draws != 5
  it(
    "should shuffle without cleaning up if value of field 'waitToShuffle' is true and " +
      "the given line is not drawing exactly 5 cards when entireDeck that consists of at least 5 cards.",
    () => {
      // Arrange - set up logArchive so a cleanup should not be needed. In this case, there are not 5 cards being
      // drawn on the line
      deck.logArchive = [
        "pNick gets +1 Action.",
        "pNick discards an Estate.",
        "pNick draws a Copper.",
        "pNick plays a Sentry.",
        "pNick shuffles their deck.",
      ];
      deck.waitToShuffle = true;
      // Set an entireDeck that has at least 5 cards;
      deck.entireDeck = ["Sentry", "Copper", "Copper", "Estate", "Estate"];
      deck.library = [];
      deck.hand = ["Estate"];
      deck.inPlay = ["Sentry"];
      deck.graveyard = ["Copper", "Copper", "Estate"];

      // Line with 1 card being drawn.
      const line = "pNick draws a Copper.";

      // Act - Simulate processing a log where a shuffle occurs and a cleanup should not occur.
      deck.shuffleAndCleanUpIfNeeded(line);

      // Assert - Verify a shuffle occurred, but not a cleanup
      expect(deck.library).toStrictEqual(["Estate", "Copper", "Copper"]);
      expect(deck.graveyard).toStrictEqual([]);
      // Verify hand and in Play are not changed
      expect(deck.hand).toStrictEqual(["Estate"]);
      expect(deck.inPlay).toStrictEqual(["Sentry"]);
      // Verify waitToShuffle was set to false
      expect(deck.waitToShuffle).toBe(false);
    }
  );

  // Case 3 - Shuffle && entireDeck.length >= 5 && draws = 5 caused by Cellar
  it(
    "should cleanup and shuffle if value of field 'waitToShuffle' is true and" +
      " exactly 5 cards are being drawn on the given line and" +
      " those draws were caused by a Cellar",
    () => {
      // Arrange - Set up a logArchive which shows that the cards on the given line are drawn due to a Cellar.
      deck.logArchive = [
        "pNick plays a Cellar.",
        "pNick gets +1 Action.",
        "pNick discards a Copper, a Silver, an Estate, a Laboratory, and a Library.",
        "pNick shuffles their deck.",
      ];
      deck.waitToShuffle = true;
      // Set an entireDeck that has at least 5 cards;
      deck.entireDeck = [
        "Copper",
        "Silver",
        "Copper",
        "Cellar",
        "Laboratory",
        "Merchant",
        "Copper",
        "Silver",
        "Estate",
        "Laboratory",
        "Library",
      ];
      deck.library = ["Copper", "Silver"];
      deck.hand = ["Copper"];
      deck.inPlay = ["Cellar", "Laboratory"];
      deck.graveyard = [
        "Merchant",
        "Copper",
        "Silver",
        "Estate",
        "Laboratory",
        "Library",
      ];
      // Line drawing exactly 5 cards
      const line = "pName draws 2 Coppers, a Silver, and 2 Laboratories.";

      // Act - Simulate calling when a shuffle but not cleanup is needed.
      deck.shuffleAndCleanUpIfNeeded(line);

      // Assert - Verify that a shuffle occurred, but not a cleanup.
      expect(deck.library).toStrictEqual([
        "Copper",
        "Silver",
        "Library",
        "Laboratory",
        "Estate",
        "Silver",
        "Copper",
        "Merchant",
      ]);
      expect(deck.graveyard).toStrictEqual([]);
      // Verify hand and inPlay are unchanged
      expect(deck.hand).toStrictEqual(["Copper"]);
      expect(deck.inPlay).toStrictEqual(["Cellar", "Laboratory"]);
      // Verify waitToShuffle was set to false
      expect(deck.waitToShuffle).toBe(false);
    }
  );

  // Case 4 - Shuffle && entireDeck.length >= 5 && draws = 5 not caused by Cellar
  it(
    "should shuffle and cleanup value of field 'waitToShuffle' is true and " +
      "the entireDeck is at least 5 cards, and the given line is drawing exactly 5 cards " +
      "and the draws on the current line are not caused by a Cellar",
    () => {
      // Arrange - set up a logArchive where 5 draws are occurring and are not caused by a Cellar.
      deck.logArchive = [
        "pNick plays 3 Coppers. (+$3)",
        "pNick buys and gains a Silver.",
        "pNick shuffles their deck.",
      ];
      deck.waitToShuffle = true;
      deck.inPlay = ["Copper", "Copper", "Copper"];
      deck.graveyard = ["Bureaucrat", "Market"];
      deck.hand = ["Estate"];
      deck.library = ["Chapel"];
      const line = "pNick draws 3 Coppers, a Silver, and an Estate.";

      // Act - Simulate processing a log where a shuffle and a cleanup should occur;
      deck.shuffleAndCleanUpIfNeeded(line);

      // Assert - Verify that the zones have the expected cards after a shuffle and cleanup
      expect(deck.inPlay).toStrictEqual([]);
      expect(deck.hand).toStrictEqual([]);
      expect(deck.graveyard).toStrictEqual([]);
      expect(deck.library).toStrictEqual([
        "Chapel",
        "Estate",
        "Copper",
        "Copper",
        "Copper",
        "Market",
        "Bureaucrat",
      ]);
    }
  );

  // Case 5 - Shuffle && entireDeck.length = n < 5 && draws = n
  it(
    "should shuffle and clean up if value of field is 'waitToShuffle' is true and" +
      " the entireDeck that consists less than 5 cards, and the given line is drawing" +
      " exactly the number of cards that are in the entireDeck.",
    () => {
      // Arrange - set up logArchive so a cleanup should not be needed. In this case, there are exactly 3 cards being
      // drawn on the line
      deck.waitToShuffle = true;
      deck.logArchive = ["pNick plays a Sentry.", "pNick shuffles their deck."];
      // Set an entireDeck that has 3 cards;
      deck.entireDeck = ["Sentry", "Silver", "Silver"];
      deck.library = [];
      deck.hand = ["Silver"];
      deck.inPlay = ["Sentry"];
      deck.graveyard = ["Silver"];

      // Line with 3 cards being drawn. (Exact same number as in the entireDeck, and entireDeck length is less than 5).
      const line = "pNick draws a Sentry and 2 Silvers.";

      // Act - Simulate processing a line that is drawing exactly the same number of cards that are in the entireDeck where the
      // entireDeck has less than 5 cards
      deck.shuffleAndCleanUpIfNeeded(line);

      // Assert - Verify a shuffle occurred and cleanup occurred.
      expect(deck.library).toStrictEqual(["Silver", "Sentry", "Silver"]);
      expect(deck.graveyard).toStrictEqual([]);
      // Verify hand and in Play are empty.
      expect(deck.hand).toStrictEqual([]);
      expect(deck.inPlay).toStrictEqual([]);
      // Verify waitToShuffle was set to false
      expect(deck.waitToShuffle).toBe(false);
    }
  );

  // Case 6 - Shuffle && entireDeck.length = n < 5 && draws < n
  it(
    "should shuffle without cleaning up if value of field 'waitToShuffle' is true and " +
      "the entireDeck that consists less than 5 cards, and the given line is not drawing " +
      " exactly the number of cards that are in the entireDeck.",
    () => {
      // Arrange - set up logArchive so a cleanup should not be needed. In this case, there are not 3 cards being
      // drawn on the line
      deck.waitToShuffle = true;
      deck.logArchive = ["pNick plays a Co.", "pNick shuffles their deck."];
      // Set an entireDeck that has 3 cards;
      deck.entireDeck = ["Sentry", "Silver", "Silver"];
      deck.library = [];
      deck.hand = ["Silver"];
      deck.inPlay = ["Sentry"];
      deck.graveyard = ["Silver"];

      // Line with 1 card being drawn.
      const line = "pNick draws a Copper.";

      // Act - simulate an processing a log where the entireDeck is only 3 cards, where a shuffle, but not a cleanup is needed.
      deck.shuffleAndCleanUpIfNeeded(line);

      // Assert - Verify a shuffle occurred, but not a cleanup
      expect(deck.library).toStrictEqual(["Silver"]);
      expect(deck.graveyard).toStrictEqual([]);
      // Verify hand and in Play are not changed
      expect(deck.hand).toStrictEqual(["Silver"]);
      expect(deck.inPlay).toStrictEqual(["Sentry"]);
      // Verify waitToShuffle was set to false
      expect(deck.waitToShuffle).toBe(false);
    }
  );
});
