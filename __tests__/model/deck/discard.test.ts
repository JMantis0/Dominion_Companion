import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function discard()", () => {
  it("should remove one instance of the provided card from the hand and add it to the graveyard", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    // Initial hand and library to simulate first turn.
    const hand = ["Copper", "Copper", "Copper", "Estate", "Estate"];
    const library = ["Estate", "Copper", "Copper", "Copper", "Copper"];
    deck.setHand(hand);
    deck.setLibrary(library);
    const card = "Copper";

    // Act
    deck.discard(card);
    const resultHand = deck.getHand();
    const resultGraveyard = deck.getGraveyard();

    // Assert
    expect(resultHand).toStrictEqual(["Copper", "Copper", "Estate", "Estate"]);
    expect(resultGraveyard).toStrictEqual(["Copper"]);
  });
  it("should throw an error when the provided card is not in hand", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    // Initial hand and library to simulate first turn.
    const hand = ["Copper", "Copper", "Copper", "Estate", "Estate"];
    const library = ["Estate", "Copper", "Copper", "Copper", "Copper"];
    deck.setHand(hand);
    deck.setLibrary(library);
    const card = "Sentry";

    // Act and Assert
    expect(() => deck.discard(card)).toThrowError("No Sentry in hand.");
  });
});
