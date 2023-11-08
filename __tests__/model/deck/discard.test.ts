import { it, describe, expect, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Method discard()", () => {
  let deck = new Deck("", false, "", "pName", "pNick", []);

  afterEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should remove one instance of the provided card from the hand and add it to the graveyard", () => {
    // Arrange
    deck.hand = ["Copper", "Copper", "Copper", "Estate", "Estate"];

    // Act - Simulate discarding a Copper from hand.
    deck.discard("Copper");

    // Assert
    expect(deck.graveyard).toStrictEqual(["Copper"]);
    expect(deck.hand).toStrictEqual(["Copper", "Copper", "Estate", "Estate"]);
  });

  it("should throw an error when the provided card is not in hand", () => {
    // Arrange
    deck.hand = ["Copper", "Copper", "Copper", "Estate", "Estate"];

    // Act and Assert - Simulate trying to discard a card that is not in hand.
    expect(() => deck.discard("Sentry")).toThrowError("No Sentry in hand.");
  });
});
