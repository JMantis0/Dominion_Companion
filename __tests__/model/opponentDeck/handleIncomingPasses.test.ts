import { describe, it, expect, beforeEach } from "@jest/globals";
import { OpponentDeck } from "../../../src/model/opponentDeck";

describe("handleIncomingPasses", () => {
  let oDeck: OpponentDeck;
  beforeEach(() => {
    oDeck = new OpponentDeck(
      "MockTitle",
      false,
      "MockRating",
      "Player",
      "pNick",
      []
    );
  });

  it("should check if the pass is to the Deck and if so add the given cards to the entireDeck", () => {
    // Arrange a hand and entireDeck
    oDeck.entireDeck = ["Copper", "Estate"];

    // Act - handle a line that is passing to the oDeck
    oDeck.handleIncomingPasses(
      "passes",
      "L passes a Bureaucrat to pNick.",
      ["Bureaucrat"],
      [1]
    );

    // Assert - Verify the card was added to hand and entireDeck
    expect(oDeck.entireDeck).toStrictEqual(["Copper", "Estate", "Bureaucrat"]);
  });

  it("should not take any action if the pass is not to the Deck", () => {
    // Arrange a hand and entireDeck
    oDeck.entireDeck = ["Copper", "Estate"];

    // Act - handle a line that is passing to a different player
    oDeck.handleIncomingPasses(
      "passes",
      "L passes a Bureaucrat to Charles.",
      ["Bureaucrat"],
      [1]
    );

    // Assert - Verify the zones did not change.
    expect(oDeck.entireDeck).toStrictEqual(["Copper", "Estate"]);
  });
});
