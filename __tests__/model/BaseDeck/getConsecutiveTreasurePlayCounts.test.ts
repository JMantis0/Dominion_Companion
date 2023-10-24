import { it, describe, expect, jest, afterEach } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("Method getConsecutiveTreasurePlayCounts()", () => {
  // Instantiate BaseDeck object.
  let deck = new BaseDeck("", false, "", "pNick", "pName", []);
  // Spy on method dependency
  const setTreasurePopped = jest.spyOn(BaseDeck.prototype, "setTreasurePopped");
  afterEach(() => {
    deck = new BaseDeck("", false, "", "pNick", "pName", []);
    jest.clearAllMocks();
  });

  it("should return an array with the correct number of Coppers to play", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick plays a Coppers and 2 Silvers. (+$2)";

    // Act and Assert -Simulate playing an additional Copper after playing one Copper and 2 Silvers.
    expect(
      deck.getConsecutiveTreasurePlayCounts(
        "pNick plays 2 Coppers and 2 Silvers. (+$4)"
      )
    ).toStrictEqual([1, 0, 0]);
    expect(setTreasurePopped).toBeCalledTimes(1);
    expect(setTreasurePopped).toBeCalledWith(true);
  });

  it("should return an array with the correct number of Silvers to play", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick plays 2 Coppers. (+$2)";

    // Act and Assert - Simulate playing a Silver after playing 2 Coppers.
    expect(
      deck.getConsecutiveTreasurePlayCounts(
        "pNick plays 2 Coppers and a Silver. (+$4)"
      )
    ).toStrictEqual([0, 1, 0]);
    expect(setTreasurePopped).toBeCalledTimes(1);
    expect(setTreasurePopped).toBeCalledWith(true);
  });

  it("should return an array with the correct number of Golds to play", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick plays 2 Coppers. (+$2)";

    // Act and Assert - Simulate playing a Gold after playing 2 Coppers.
    expect(
      deck.getConsecutiveTreasurePlayCounts(
        "pNick plays 2 Coppers and a Gold. (+$4)"
      )
    ).toStrictEqual([0, 0, 1]);
    expect(setTreasurePopped).toBeCalledTimes(1);
    expect(setTreasurePopped).toBeCalledWith(true);
  });

  it("should return an array with the correct number of each treasure to play even if there are multiple treasures that have differences greater than 1", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick plays 2 Coppers. (+$2)";

    // Act and Assert - Simulate playing multiple treasures on a single line.
    expect(
      deck.getConsecutiveTreasurePlayCounts(
        "pNick plays 5 Coppers, 3 Silvers, and 2 Golds. (+$4)"
      )
    ).toStrictEqual([3, 3, 2]);
    expect(setTreasurePopped).toBeCalledTimes(1);
    expect(setTreasurePopped).toBeCalledWith(true);
  });
});
