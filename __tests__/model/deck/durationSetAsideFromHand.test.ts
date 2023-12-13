import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("durationSetAsideFromHand", () => {
  let deck: Deck;
  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });
  it("should move cards from the hand to durationSetAside", () => {
    // Arrange
    deck.durationSetAside = ["Vassal"];
    deck.hand = ["Bureaucrat", "Estate", "Copper"];
    // Act - discard four cards from durationSetAside
    deck.durationSetAsideFromHand("Copper");
    // Assert - Verify the durationSetAside and hand contain the correct cards
    expect(deck.durationSetAside).toStrictEqual(["Vassal", "Copper"]);
    expect(deck.hand).toStrictEqual(["Bureaucrat", "Estate"]);
  });

  it("should throw an error when the given card is not in hand.", () => {
    // Arrange
    deck.durationSetAside = ["Copper", "Estate", "Copper", "Vassal"];
    deck.graveyard = ["Bureaucrat"];

    // Act and Assert - Verify the correct error is thrown

    expect(() => deck.durationSetAsideFromHand("Tragic Hero")).toThrowError(
      "No Tragic Hero in hand."
    );
  });
});
