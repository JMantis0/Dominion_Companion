import { beforeEach, describe, expect, it } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("handleConsecutiveDuplicates", () => {
  let deck: BaseDeck;
  beforeEach(() => {
    deck = new BaseDeck("", false, "", "Player", "P", [
      "Copper",
      "Remodel",
      "Chapel",
      "Estate",
      "Gold",
    ]);
  });

  // Case 1 - Simple
  it(
    "should remove the most recent logArchive entry if it a repeat trash for the same card that was " +
      "revealed on the previous line.",
    () => {
      // Arrange
      deck.logArchive = ["P plays a Remake.", "P trashes a Copper."];
      deck.lastEntryProcessed = "P trashes a Copper.";
      const line = "P trashes 2 Coppers.";

      // Act
      const [cards, number] = deck.handleConsecutiveDuplicates(line);

      expect(deck.logArchive).toStrictEqual(["P plays a Remake."]);
      // Assert
      expect(cards).toStrictEqual(["Copper"]);
      expect(number).toStrictEqual([1]);
    }
  );

  it(
    "should remove the most recent logArchive entry if it trashes a card type that was not " +
      "revealed on the previous line.",
    () => {
      // Arrange
      deck.logArchive = ["P plays a Wubstar.", "P trashes 3 Coppers."];
      deck.lastEntryProcessed = "P trashes 3 Coppers.";
      const line = "P trashes 3 Coppers and a Remodel.";

      const [cards, number] = deck.handleConsecutiveDuplicates(line);

      // Act
      expect(deck.logArchive).toStrictEqual(["P plays a Wubstar."]);

      // Assert
      expect(cards).toStrictEqual(["Copper", "Remodel"]);
      expect(number).toStrictEqual([0, 1]);
    }
  );

  it(
    "should remove the most recent logArchive entry if it does not trash a card type that was not " +
      "revealed on the previous line.",
    () => {
      // Arrange
      deck.logArchive = [
        "pNick plays a WubStar.",
        "pNick gets +1 Action.",
        "pNick trashes 3 Coppers and a Chapel.",
      ];
      deck.lastEntryProcessed = "pNick trashes 3 Coppers and a Chapel.";
      const line = "pNick trashes 3 Coppers and 2 Chapels.";

      const [cards, number] = deck.handleConsecutiveReveals(line);

      // Act
      expect(deck.logArchive).toStrictEqual([
        "pNick plays a WubStar.",
        "pNick gets +1 Action.",
      ]);

      // Assert
      expect(cards).toStrictEqual(["Copper", "Chapel"]);
      expect(number).toStrictEqual([0, 1]);
    }
  );

  it(
    "should handle consecutive reveals line where a new card is revealed on the current line" +
      "when the new card is positioned in front of the previous card in the string.",
    () => {
      // Arrange
      deck.logArchive = [
        "pNick plays a Wubstar.",
        "pNick gets +1 Action.",
        "pNick trashes 2 Estates.",
      ];
      deck.lastEntryProcessed = "pNick trashes 2 Estates.";
      const line = "pNick trashes a Copper and 2 Estates";
      // Act
      const [cards, number] = deck.handleConsecutiveDuplicates(line);
      // Assert
      expect(deck.logArchive).toStrictEqual([
        "pNick plays a Wubstar.",
        "pNick gets +1 Action.",
      ]);
      expect(cards).toStrictEqual(["Copper", "Estate"]);
      expect(number).toStrictEqual([1, 0]);
    }
  );
  it(
    "should handle consecutive gains by removing the most recent logEntry from the logArchive " +
      "and returning the correct card types and card amounts",
    () => {
      // Arrange
      deck.logArchive = [
        "pNick trashes a Treasure Map.",
        "pNick gains a Gold.",
      ];
      deck.lastEntryProcessed = "pNick gains a Gold.";
      const line = "pNick gains 4 Golds";
      // Act
      const [cards, number] = deck.handleConsecutiveDuplicates(line);
      // Assert
      expect(cards).toStrictEqual(["Gold"]);
      expect(number).toStrictEqual([3]);
      expect(deck.logArchive).toStrictEqual(["pNick trashes a Treasure Map."]);
    }
  );
});
