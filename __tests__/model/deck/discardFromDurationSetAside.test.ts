import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("discardFromDurationSetAside", () => {
  let deck: Deck;
  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });
  it("should move cards from the durationSetAside to graveyard", () => {
    // Arrange
    deck.durationSetAside = ["Copper", "Estate", "Copper", "Vassal"];
    deck.graveyard = ["Bureaucrat"];
    // Act - discard four cards from durationSetAside
    deck.discardFromDurationSetAside("Copper");
    // Assert - Verify the durationSetAside and Graveyard contain the correct cards
    expect(deck.durationSetAside).toStrictEqual(["Estate", "Copper", "Vassal"]);
    expect(deck.graveyard).toStrictEqual(["Bureaucrat", "Copper"]);
  });
  it("should throw an error when the given card is not in the durationSetAside zone.", () => {
    // Arrange
    deck.durationSetAside = ["Copper", "Estate", "Copper", "Vassal"];
    deck.graveyard = ["Bureaucrat"];

    // Act and Assert - Verify the correct error is thrown

    expect(() => deck.discardFromDurationSetAside("Tragic Hero")).toThrowError(
      "No Tragic Hero in durationSetAside."
    );
  });
});
