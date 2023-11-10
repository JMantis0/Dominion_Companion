import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("processTopDecksLine", () => {
  // Declare Deck reference
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pNick", "pName", []);
  });

  it("should correctly move cards from setAside to library", () => {
    // Arrange
    deck.library = ["Copper", "Estate"];
    deck.setAside = ["Vassal", "Bandit"];

    // Assert - simulate topDecking a card from setAside
    deck.topDeckFromSetAside("Bandit");

    // Assert - Verify a card was moved from setAside to library
    expect(deck.setAside).toStrictEqual(["Vassal"]);
    expect(deck.library).toStrictEqual(["Copper", "Estate", "Bandit"]);
  });

  it("should throw an error if the given card is not in setAside", () => {
    // Arrange
    deck.setAside = ["Vassal", "Bandit"];

    // Act and Assert
    expect(() => deck.topDeckFromSetAside("Pot of Greed")).toThrowError(
      "No Pot of Greed in setAside."
    );
  });
});
