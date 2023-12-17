import { it, describe, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("ifCleanUpNeeded", () => {
  // Instantiate Deck object.
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  // Cases
  // 1) entireDeck.length >= 5 && draws on given line != 5
  // 2) entireDeck.length >= 5 && draws on given line = 5 caused by Cellar
  // 3) entireDeck.length >= 5 && draws on given line = 5 not caused by Cellar
  // 4) entireDeck.length = n < 5 && draws on given line = n
  // 5) entireDeck.length = n < 5 && draws on given line < n
  // 6) entireDeck.length >=5 and draws on line = 5 caused by Innkeeper
  // 7) given line is not a draw line.

  // Case 1 - entireDeck.length >= 5 && draws on given line != 5
  it("should return false if entireDeck.length >= 5 && draws on given line != 5", () => {
    // Arrange
    deck.logArchive = [
      "oNick draws 4 cards.",
      "oNick gets +1 Buy.",
      "pNick draws an Estate.",
      "oNick plays 4 Coppers, a Silver, and a Gold. (+$9)",
      "oNick buys and gains a Province.",
      "oNick draws 5 cards.",
      "Turn 9 - pName",
      "pNick plays a Laboratory.",
    ];

    // Act and Assert - Verify return value is false - (only 2 cards being drawn)
    expect(deck.ifCleanUpNeeded("pNick draws a Copper and a Laboratory.")).toBe(
      false
    );
  });

  // Case 2 - entireDeck.length >= 5 && draws = 5 caused by Cellar
  it("should return false if entireDeck.length >= 5 && draws on given line = 5 caused by Cellar", () => {
    // Arrange
    deck.logArchive = [
      "pNick plays a Throne Room.",
      "pNick plays a Laboratory.",
      "pNick draws a Moneylender and a Sentry.",
      "pNick gets +1 Action.",
      "pNick plays a Laboratory again.",
      "pNick draws an Estate and a Cellar.",
      "pNick gets +1 Action.",
      "pNick plays a Cellar.",
      "pNick gets +1 Action.",
      "pNick discards a Silver, an Estate, a Moneylender, a Sentry, and a Vassal.", //  5 draws caused by Cellar, cleanup is not needed.
    ];
    const line = "pNick draws a Silver, 2 Estates, a Laboratory, and a Market.";

    // Act and Assert
    expect(deck.ifCleanUpNeeded(line)).toBe(false);
  });

  // Case 3 - entireDeck.length >= 5 && draws = 5 not caused by Cellar
  it("should return true if entireDeck.length >= 5 && draws = 5 not caused by Cellar", () => {
    // Arrange
    deck.logArchive = [
      "pNick plays a Laboratory.",
      "pNick draws a Market and a Moneylender.",
      "pNick gets +1 Action.",
      "pNick plays a Market.",
      "pNick draws an Estate.",
      "pNick gets +1 Action.",
      "pNick gets +1 Buy.",
      "pNick gets +$1.",
      "pNick plays a Moneylender.",
      "pNick trashes a Copper.",
      "pNick gets +$3.",
      "pNick plays a Copper and a Silver. (+$3)",
      "pNick buys and gains a Sentry.",
      "pNick buys and gains a Cellar.",
      "pNick shuffles their deck.",
    ];
    const line = "pNick draws a Silver, 2 Estates, a Laboratory, and a Market.";

    // Act and Assert
    expect(deck.ifCleanUpNeeded(line)).toBe(true);
  });
  // Case 4 - entireDeck.length = n < 5 && draws on given line = n
  it("should return true if  entireDeck.length = n < 5 && draws on given line = n", () => {
    // Arrange logArchive and set entireDeck that is less than 5 cards
    deck.logArchive = ["pNick plays a Sentry.", "pNick shuffles their deck."];
    deck.entireDeck = ["Sentry", "Silver", "Silver"];

    // Act and Assert - Verify method returns true, a cleanup is certainly needed (entireDeck only 3 cards and 3 cards being drawn)
    expect(deck.ifCleanUpNeeded("pNick draws a Sentry and 2 Silvers.")).toBe(
      true
    );
  });
  // Case 5 - entireDeck.length = n < 5 && draws on given line < n

  it("should return false if entireDeck.length = n < 5 && draws on given line < n", () => {
    // Arrange logArchive and set entireDeck that is less than 5 cards
    deck.logArchive = ["pNick plays a Co.", "pNick shuffles their deck."];
    deck.entireDeck = ["Sentry", "Silver", "Silver"];

    // Act and Assert - Verify method returns false, only 1 card being drawn on the given line, while entireDeck is length 3
    expect(deck.ifCleanUpNeeded("pNick draws a Copper.")).toBe(false);
  });

  // Case 6 - entireDeck.length >= 5 && draws = 5 caused by Innkeeper
  it("should return false if entireDeck.length >= 5 && draws on given line = 5 caused by Innkeeper", () => {
    // Arrange
    deck.latestAction = "Innkeeper";
    deck.logArchive = [
      "pNick plays an Innkeeper.",
      "pNick gets +1 Action.",
      "pNick shuffles their deck.",
    ];
    const line =
      "pNick draws 2 Coppers, a Silver, an Estate, and an Innkeeper.";

    // Act and Assert
    expect(deck.ifCleanUpNeeded(line)).toBe(false);
  });

  it("should return false if the given line is not a draw line", () => {
    // Arrange
    deck.logArchive = [
      "pNick plays a Journeyman.",
      "pNick names Copper.",
      "pNick shuffles their deck.",
    ];
    const line =
      "pNick reveals 2 Coppers, 2 Estates, and a Wandering Minstrel.";

    // Act and Assert
    expect(deck.ifCleanUpNeeded(line)).toBe(false);
  });
});
