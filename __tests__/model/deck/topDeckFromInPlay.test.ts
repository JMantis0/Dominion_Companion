import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("topDeckFromInPlay", () => {
  // Declare Deck reference
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pNick", "pName", []);
  });

  it("should correctly move cards from inPlay to library", () => {
    // Arrange
    deck.library = ["Copper", "Estate"];
    deck.inPlay = ["Vassal", "Crew"];

    // Assert - simulate topDecking a card from inPlay
    deck.topDeckFromInPlay("Crew");

    // Assert - Verify a card was moved from inPlay to library
    expect(deck.inPlay).toStrictEqual(["Vassal"]);
    expect(deck.library).toStrictEqual(["Copper", "Estate", "Crew"]);
  });

  it("should throw an error if the given card is not in inPlay", () => {
    // Arrange
    deck.inPlay = ["Vassal", "Bandit"];

    // Act and Assert
    expect(() => deck.topDeckFromInPlay("Pot of Greed")).toThrowError(
      "No Pot of Greed in inPlay."
    );
  });
});
