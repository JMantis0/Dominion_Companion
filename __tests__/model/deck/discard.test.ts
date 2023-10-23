import { it, describe, expect, afterEach, jest } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function discard()", () => {
  let deck = new Deck("", false, "", "pName", "pNick", []);
  const setGraveyard = jest.spyOn(Deck.prototype, "setGraveyard");
  const setHand = jest.spyOn(Deck.prototype, "setHand");
  afterEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
    jest.clearAllMocks();
  });
  it("should remove one instance of the provided card from the hand and add it to the graveyard", () => {
    // Arrange
    deck.hand = ["Copper", "Copper", "Copper", "Estate", "Estate"];

    // Act - Simulate discarding a Copper from hand.
    deck.discard("Copper");

    // Assert
    expect(deck.graveyard).toStrictEqual(["Copper"]);
    expect(deck.hand).toStrictEqual(["Copper", "Copper", "Estate", "Estate"]);
    expect(setHand).toBeCalledTimes(1);
    expect(setHand).toBeCalledWith(["Copper", "Copper", "Estate", "Estate"]);
    expect(setGraveyard).toBeCalledTimes(1);
    expect(setGraveyard).toBeCalledWith(["Copper"]);
  });

  it("should throw an error when the provided card is not in hand", () => {
    // Arrange
    deck.hand = ["Copper", "Copper", "Copper", "Estate", "Estate"];

    // Act and Assert - Simulate trying to discard a card that is not in hand.
    expect(() => deck.discard("Sentry")).toThrowError("No Sentry in hand.");
  });
});
