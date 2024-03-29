import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("discardFromSetAside", () => {
  // Declare Deck reference.
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should remove the provided card from the setAside zone and add it to the graveyard", () => {
    // Arrange
    deck.setAside = ["Sentry", "Vassal"];
    deck.graveyard = ["Curse"];

    // Act - Simulate discarding a Vassal from setAside.
    deck.discardFromSetAside("Vassal");

    // Assert - Verify card was moved from setAside to graveyard.
    expect(deck.setAside).toStrictEqual(["Sentry"]);
    expect(deck.graveyard).toStrictEqual(["Curse", "Vassal"]);
  });

  it("throw an Error when the provided card is not in the setAside zone", () => {
    // Arrange
    deck.setAside = ["Sentry", "Vassal"];

    // Act and Assert
    expect(() => deck.discardFromSetAside("Pot of Greed")).toThrowError(
      "No Pot of Greed in setAside."
    );
  });
});
