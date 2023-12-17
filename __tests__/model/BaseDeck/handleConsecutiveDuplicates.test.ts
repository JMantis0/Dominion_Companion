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
      "Silver",
      "Gold",
      "Tide Pools",
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
        "P plays a WubStar.",
        "P gets +1 Action.",
        "P trashes 3 Coppers and a Chapel.",
      ];
      deck.lastEntryProcessed = "P trashes 3 Coppers and a Chapel.";
      const line = "P trashes 3 Coppers and 2 Chapels.";

      const [cards, number] = deck.handleConsecutiveReveals(line);

      // Act
      expect(deck.logArchive).toStrictEqual([
        "P plays a WubStar.",
        "P gets +1 Action.",
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
        "P plays a Wubstar.",
        "P gets +1 Action.",
        "P trashes 2 Estates.",
      ];
      deck.lastEntryProcessed = "P trashes 2 Estates.";
      const line = "P trashes a Copper and 2 Estates";
      // Act
      const [cards, number] = deck.handleConsecutiveDuplicates(line);
      // Assert
      expect(deck.logArchive).toStrictEqual([
        "P plays a Wubstar.",
        "P gets +1 Action.",
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
      deck.logArchive = ["P trashes a Treasure Map.", "P gains a Gold."];
      deck.lastEntryProcessed = "P gains a Gold.";
      const line = "P gains 4 Golds";
      // Act
      const [cards, number] = deck.handleConsecutiveDuplicates(line);
      // Assert
      expect(cards).toStrictEqual(["Gold"]);
      expect(number).toStrictEqual([3]);
      expect(deck.logArchive).toStrictEqual(["P trashes a Treasure Map."]);
    }
  );

  it(
    "should handle consecutive 'into their hand' lines by removing the most recent logEntry from the logArchive " +
      "and returning the correct card types and card amounts",
    () => {
      // Arrange
      deck.logArchive = [
        "P plays a Hunter.",
        "P gest +1 Action.",
        "P reveals a Copper and 2 Estates.",
        "P puts a Copper into their hand.",
      ];
      deck.lastEntryProcessed = "P puts a Copper into their hand.";
      const line = "P puts a Copper and an Estate into their hand.";
      // Act
      const [cards, number] = deck.handleConsecutiveDuplicates(line);
      // Assert
      expect(cards).toStrictEqual(["Copper", "Estate"]);
      expect(number).toStrictEqual([0, 1]);
      expect(deck.logArchive).toStrictEqual([
        "P plays a Hunter.",
        "P gest +1 Action.",
        "P reveals a Copper and 2 Estates.",
      ]);
    }
  );

  it(
    "should handle consecutive 'discards' lines by removing the most recent logEntry from the logArchive " +
      "and returning the correct card types and card amounts",
    () => {
      // Arrange
      deck.logArchive = [
        "P starts their turn.",
        "P puts an Estate in hand (Archive).",
        "P discards a Copper and an Estate. (Tide Pools)",
      ];
      deck.lastEntryProcessed =
        "P discards a Copper and an Estate. (Tide Pools)";
      const line = "P discards 2 Coppers and 2 Estates. (Tide Pools)";
      // Act
      const [cards, number] = deck.handleConsecutiveDuplicates(line);
      // Assert
      expect(cards).toStrictEqual(["Copper", "Estate"]);
      expect(number).toStrictEqual([1, 1]);
      expect(deck.logArchive).toStrictEqual([
        "P starts their turn.",
        "P puts an Estate in hand (Archive).",
      ]);
    }
  );

  it("should return an array with the correct number of each treasure to play (all treasures in both lines)", () => {
    // Arrange
    deck.lastEntryProcessed =
      "pNick plays 2 Coppers, 2 Silvers, and 3 Golds. (+$15)";

    // Act and Assert - Simulate playing multiple treasures on a single line.
    expect(
      deck.handleConsecutiveDuplicates(
        "pNick plays 5 Coppers, 5 Silvers, and 10 Golds. (+$4)"
      )
    ).toStrictEqual([
      ["Copper", "Silver", "Gold"],
      [3, 3, 7],
    ]);
  });

  it("should handle treasures correctly", () => {});
});
