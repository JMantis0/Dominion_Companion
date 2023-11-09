import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("drawFromSetAside", () => {
  // Declare Deck reference.
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should draw the given card from setAside into hand", () => {
    // Arrange
    deck.hand = ["Copper"];
    deck.setAside = ["Mine", "Sentry"];

    // Act - simulate drawing a Mine from setAside.
    deck.drawFromSetAside("Mine");

    // Assert - Verify card was moved from setAside to hand.
    expect(deck.hand).toStrictEqual(["Copper", "Mine"]);
    expect(deck.setAside).toStrictEqual(["Sentry"]);
  });

  it("should throw an error if the given card is not in setAside", () => {
    // Arrange
    deck.setAside = ["Mine", "Sentry"];
    // Act and Assert - Simulate drawing a card from setAside that is not present.
    expect(() => deck.drawFromSetAside("Curse")).toThrowError(
      "No Curse in setAside."
    );
  });
});
