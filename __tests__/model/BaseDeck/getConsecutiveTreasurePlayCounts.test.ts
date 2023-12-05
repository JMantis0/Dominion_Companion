import { it, describe, expect, beforeEach } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("getConsecutiveTreasurePlayCounts", () => {
  // Declare BaseDeck object.
  let deck: BaseDeck;

  beforeEach(() => {
    deck = new BaseDeck("", false, "", "pNick", "pName", []);
  });

  it("should return an array with the correct number of Coppers to play", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick plays a Coppers and 2 Silvers. (+$2)";

    // Act and Assert -Simulate playing an additional Copper after playing one Copper and 2 Silvers.
    expect(
      deck.getConsecutiveTreasurePlayCounts(
        "pNick plays 2 Coppers and 2 Silvers. (+$4)"
      )
    ).toStrictEqual([1, 0, 0, 0]);
  });

  it("should return an array with the correct number of Silvers to play", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick plays 2 Coppers. (+$2)";

    // Act and Assert - Simulate playing a Silver after playing 2 Coppers.
    expect(
      deck.getConsecutiveTreasurePlayCounts(
        "pNick plays 2 Coppers and a Silver. (+$4)"
      )
    ).toStrictEqual([0, 1, 0, 0]);
  });

  it("should return an array with the correct number of Golds to play", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick plays 2 Coppers. (+$2)";

    // Act and Assert - Simulate playing a Gold after playing 2 Coppers.
    expect(
      deck.getConsecutiveTreasurePlayCounts(
        "pNick plays 2 Coppers and a Gold. (+$5)"
      )
    ).toStrictEqual([0, 0, 1, 0]);
  });

  it("should return an array with the correct number of Platina to play", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick plays 2 Coppers. (+$2)";

    // Act and Assert - Simulate playing a Gold after playing 2 Coppers.
    expect(
      deck.getConsecutiveTreasurePlayCounts(
        "pNick plays 2 Coppers and a Platinum. (+$7)"
      )
    ).toStrictEqual([0, 0, 0, 1]);
  });

  it(
    "should return an array with the correct treasure counts when the plural " +
      "Platina is present in the previous line",
    () => {
      // Arrange
      deck.lastEntryProcessed = "pNick plays 2 Coppers and 2 Platina. (+$12)";

      // Act and Assert - Simulate playing a Gold after playing 2 Coppers.
      expect(
        deck.getConsecutiveTreasurePlayCounts(
          "pNick plays 2 Coppers, 2 Platina, and a Silver. (+$14)"
        )
      ).toStrictEqual([0, 1, 0, 0]);
    }
  );

  it(
    "should return an array with the correct treasure counts when the plural " +
      "Platina is present in the current line but not the previous line",
    () => {
      // Arrange
      deck.lastEntryProcessed = "pNick plays 2 Coppers and a Platinum. (+$7)";

      // Act and Assert - Simulate playing a Gold after playing 2 Coppers.
      expect(
        deck.getConsecutiveTreasurePlayCounts(
          "pNick plays 2 Coppers and 2 Platina. (+$12)"
        )
      ).toStrictEqual([0, 0, 0, 1]);
    }
  );

  it("should return an array with the correct number of each treasure to play even if there are multiple treasures that have differences greater than 1", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick plays 2 Coppers. (+$2)";

    // Act and Assert - Simulate playing multiple treasures on a single line.
    expect(
      deck.getConsecutiveTreasurePlayCounts(
        "pNick plays 5 Coppers, 3 Silvers, and 2 Golds. (+$4)"
      )
    ).toStrictEqual([3, 3, 2, 0]);
  });

  it("should return an array with the correct number of each treasure to play (all treasures in both lines)", () => {
    // Arrange
    deck.lastEntryProcessed =
      "pNick plays 2 Coppers, 2 Silvers, and 3 Golds. (+$15)";

    // Act and Assert - Simulate playing multiple treasures on a single line.
    expect(
      deck.getConsecutiveTreasurePlayCounts(
        "pNick plays 5 Coppers, 5 Silvers, and 10 Golds. (+$4)"
      )
    ).toStrictEqual([3, 3, 7, 0]);
  });
});
