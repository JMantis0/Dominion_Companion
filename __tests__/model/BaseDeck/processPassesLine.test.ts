import { describe, expect, it, beforeEach } from "@jest/globals";
import { OpponentDeck } from "../../../src/model/opponentDeck";

describe("processPassesLine", () => {
  let oDeck: OpponentDeck;
  beforeEach(() => {
    oDeck = new OpponentDeck(
      "MockTitle",
      false,
      "MockRating",
      "Opponent",
      "O",
      []
    );
  });

  it("should remove an instance of the given card from an OpponentDeck's entireDeck when there is no optional incoming parameter", () => {
    // Arrange
    oDeck.entireDeck = ["Platinum", "Sentry", "Copper"];
    // Act - Pass a card to opponent.
    oDeck.processPassesLine(["Sentry"], [1]);

    expect(oDeck.entireDeck).toStrictEqual(["Platinum", "Copper"]);
  });

  it("should add an instance of the given card to an OpponentDeck's entireDeck  the optional incoming parameter is true", () => {
    // Arrange
    oDeck.entireDeck = ["Platinum", "Sentry", "Copper"];
    // Act - Get a card from opponent.
    oDeck.processPassesLine(["Curse"], [1], "incoming");

    expect(oDeck.entireDeck).toStrictEqual([
      "Platinum",
      "Sentry",
      "Copper",
      "Curse",
    ]);
  });
});
