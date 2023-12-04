import { beforeEach, describe, expect, it } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("handleConsecutiveReveals", () => {
  let deck: BaseDeck;
  beforeEach(() => {
    deck = new BaseDeck("", false, "", "Player", "P", [
      "Copper",
      "Remodel",
      "Chapel",
    ]);
  });

  // Case 1 - Simple
  it(
    "should remove the most recent logArchive entry if it a repeat reveal for the same card that was " +
      "revealed on the previous line.",
    () => {
      // Arrange
      deck.logArchive = [
        "P plays a Sage.",
        "P gets +1 Action.",
        "P reveals a Copper.",
      ];
      const line = "P Reveals 2 Coppers.";

      // Act
      const [cards, number] = deck.handleConsecutiveReveals(line);

      expect(deck.logArchive).toStrictEqual([
        "P plays a Sage.",
        "P gets +1 Action.",
      ]);
      // Assert
      expect(cards).toStrictEqual(["Copper"]);
      expect(number).toStrictEqual([1]);
    }
  );

  it(
    "should not remove the most recent logArchive entry if it reveals a card type that was not " +
      "revealed on the previous line.",
    () => {
      // Arrange
      deck.logArchive = ["P gets +1 Action.", "P reveals 3 Coppers."];
      const line = "P reveals 3 Coppers and a Remodel.";

      const [cards, number] = deck.handleConsecutiveReveals(line);

      // Act
      expect(deck.logArchive).toStrictEqual([
        "P gets +1 Action.",
        "P reveals 3 Coppers.",
      ]);

      // Assert
      expect(cards).toStrictEqual(["Copper", "Remodel"]);
      expect(number).toStrictEqual([0, 1]);
    }
  );
  // Failing case
  it(
    "should not remove the most recent logArchive entry if it reveals a card type that was not " +
      "revealed on the previous line.",
    () => {
      // Arrange
      deck.logArchive = [
        "pNick plays a Sage.",
        "pNick gets +1 Action.",
        "pNick reveals 2 Coppers.",
        "pNick shuffles their deck.",
        "pNick reveals 3 Coppers and a Chapel.",
      ];
      const line = "pNick reveals 3 Coppers and 2 Chapels.";

      const [cards, number] = deck.handleConsecutiveReveals(line);

      // Act
      expect(deck.logArchive).toStrictEqual([
        "pNick plays a Sage.",
        "pNick gets +1 Action.",
        "pNick reveals 2 Coppers.",
        "pNick shuffles their deck.",
      ]);

      // Assert
      expect(cards).toStrictEqual(["Copper", "Chapel"]);
      expect(number).toStrictEqual([0, 1]);
    }
  );
});