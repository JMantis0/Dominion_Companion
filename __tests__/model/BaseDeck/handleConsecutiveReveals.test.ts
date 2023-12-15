import { beforeEach, describe, expect, it } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("handleConsecutiveReveals", () => {
  let deck: BaseDeck;
  beforeEach(() => {
    deck = new BaseDeck("", false, "", "Player", "P", [
      "Copper",
      "Remodel",
      "Chapel",
      "Estate",
      "Fortune Teller",
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
  // THIS TEST IS DEPRECATED until needs dictate otherwise.  It may be useful for a specific case later.
  // it(
  //   "should not remove the most recent logArchive entry if it reveals a card type that was not " +
  //     "revealed on the previous line.",
  //   () => {
  //     // Arrange
  //     deck.logArchive = ["P gets +1 Action.", "P reveals 3 Coppers."];
  //     const line = "P reveals 3 Coppers and a Remodel.";

  //     const [cards, number] = deck.handleConsecutiveReveals(line);

  //     // Act
  //     expect(deck.logArchive).toStrictEqual([
  //       "P gets +1 Action.",
  //       "P reveals 3 Coppers.",
  //     ]);

  //     // Assert
  //     expect(cards).toStrictEqual(["Copper", "Remodel"]);
  //     expect(number).toStrictEqual([0, 1]);
  //   }
  // );
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

  it(
    "should handle consecutive reveals line where a new card is revealed on the current line" +
      "when the new card is positioned in front of the previous card in the string.",
    () => {
      // Arrange
      deck.logArchive = [
        "pNick plays a Sage.",
        "pNick gets +1 Action.",
        "pNick reveals 2 Estates.",
      ];
      const line = "pNick reveals a Copper and 2 Estates";
      // Act
      const [cards, number] = deck.handleConsecutiveReveals(line);
      // Assert
      expect(cards).toStrictEqual(["Copper", "Estate"]);
      expect(number).toStrictEqual([1, 0]);
      expect(deck.logArchive).toStrictEqual([
        "pNick plays a Sage.",
        "pNick gets +1 Action.",
      ]);
    }
  );

  it("should handle consecutive reveals lines when caused by a Fortune Teller", () => {
    // Arrange
    deck.logArchive = [
      "P plays a Fortune Teller.",
      "P gets +$2.",
      "L reveals a Fortune Teller.",
    ];
    const line = "L reveals an Estate and a Fortune Teller.";
    // Act
    const [cards, number] = deck.handleConsecutiveReveals(line);
    // Assert
    expect(cards).toStrictEqual(["Estate", "Fortune Teller"]);
    expect(number).toStrictEqual([1, 0]);
    expect(deck.logArchive).toStrictEqual([
      "P plays a Fortune Teller.",
      "P gets +$2.",
    ]);
  });
});
