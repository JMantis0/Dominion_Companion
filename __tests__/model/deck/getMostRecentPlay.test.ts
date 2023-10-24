import { it, describe, expect, afterEach, jest } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Method getMostRecentPlay()", () => {
  // Instantiate Deck object.
  let deck = new Deck("", false, "", "pNick", "pName", []);
  // Spy on function dependency
  const checkForTreasurePlayLine = jest.spyOn(
    Deck.prototype,
    "checkForTreasurePlayLine"
  );

  afterEach(() => {
    jest.clearAllMocks();
    deck = new Deck("", false, "", "pNick", "pName", []);
  });

  it("should return the card that was most recently played in the logArchive", () => {
    // Arrange
    deck.logArchive = [
      "pNick plays a Village.",
      "pNick draws a Smithy.",
      "pNick gets +2 Actions.",
      "pNick plays a Village.",
      "pNick draws a Silver.",
      "pNick gets +2 Actions.",
      "pNick plays a Smithy.",
      "pNick draws a Silver, a Cellar, and a Sentry.",
      "pNick plays a Sentry.",
      "pNick gets +1 Action.",
      "pNick plays a Cellar.", //  Most recent play is a Cellar.
      "pNick gets +1 Action.",
      "pNick discards 2 Estates.",
    ];

    // Act and Assert
    expect(deck.getMostRecentPlay(deck.logArchive)).toBe("Cellar");
    expect(checkForTreasurePlayLine).toBeCalledTimes(1);
    expect(checkForTreasurePlayLine).toBeCalledWith("pNick plays a Cellar.");
    expect(checkForTreasurePlayLine.mock.results[0].value).toBe(false);
  });

  it("should not return treasure plays", () => {
    // Arrange
    deck.logArchive = [
      "pNick plays a Village.",
      "pNick draws a Smithy.",
      "pNick gets +2 Actions.",
      "pNick plays a Village.",
      "pNick draws a Silver.",
      "pNick gets +2 Actions.",
      "pNick plays a Smithy.",
      "pNick draws a Silver, a Cellar, and a Sentry.",
      "pNick plays a Sentry.",
      "pNick gets +1 Action.",
      "pNick plays a Cellar.", //  Most recent play is a Cellar.
      "pNick gets +1 Action.",
      "pNick discards 2 Estates.",
      "pNick plays a Silver. (+$2)", //  Should not return "Silver"
    ];

    // Act and  Assert
    expect(deck.getMostRecentPlay(deck.logArchive)).toBe("Cellar");
    expect(checkForTreasurePlayLine).toBeCalledTimes(2);
    expect(checkForTreasurePlayLine).nthCalledWith(
      1,
      "pNick plays a Silver. (+$2)"
    );
    expect(checkForTreasurePlayLine.mock.results[0].value).toBe(true);
    expect(checkForTreasurePlayLine).nthCalledWith(2, "pNick plays a Cellar.");
    expect(checkForTreasurePlayLine.mock.results[1].value).toBe(false);
  });

  it("should return the card correctly for cards played by Throne Room", () => {
    // Arrange
    deck.logArchive = [
      "pNick plays a Sentry again.", // Cards played by Throne Room will end with 'again.' and require proper parsing.
      "pNick draws a Vassal.",
      "pNick gets +1 Action.",
      "pNick shuffles their deck.",
      "pNick looks at 2 Sentries.",
    ];

    // Act and Assert
    expect(deck.getMostRecentPlay(deck.logArchive)).toBe("Sentry");
    expect(checkForTreasurePlayLine).toBeCalledTimes(1);
    expect(checkForTreasurePlayLine.mock.results[0].value).toBe(false);
  });

  it("should work correctly for cards that start with a vowel preceded by the article 'an'", () => {
    // Arrange
    deck.logArchive = [
      "pNick plays an Artisan.",
      "pNick gains a Market.",
      "pNick topdecks a Market.",
    ];

    // Act and Assert
    expect(deck.getMostRecentPlay(deck.logArchive)).toBe("Artisan");
    expect(checkForTreasurePlayLine).toBeCalledTimes(1);
    expect(checkForTreasurePlayLine.mock.results[0].value).toBe(false);
  });

  it("should return 'None' if no play is found in the logArchive", () => {
    // Arrange
    deck.logArchive = [
      "Game #123456789, unrated.",
      "Card Pool: level 1",
      "pNick starts with 7 Coppers.",
      "pNick starts with 3 Estates.",
      "oNick starts with 7 Coppers.",
      "oNick starts with 3 Estates.",
      "pNick shuffles their deck.",
      "oNick shuffles their deck.",
      "pNick draws 4 Coppers and an Estate.",
      "oNick draws 5 cards.",
      "Turn 1 - pName",
    ];

    // Act and Assert
    expect(deck.getMostRecentPlay(deck.logArchive)).toBe("None");
    expect(checkForTreasurePlayLine).not.toBeCalled();
  });

  it("should throw an error if the logArchive is empty", () => {
    // Act and Assert
    expect(() => deck.getMostRecentPlay([])).toThrowError("Empty logArchive.");
  });
});
