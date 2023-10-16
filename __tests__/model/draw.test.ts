import { describe, it, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function draw()", () => {
  it("should remove one instance of the provided card from the library and add it to the hand", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const hand = ["Copper", "Copper", "Copper", "Estate", "Estate"];
    const library = ["Estate", "Copper", "Copper", "Copper", "Copper"];
    deck.setHand(hand);
    deck.setLibrary(library);
    const card = "Copper";

    // Act
    deck.draw(card);
    const resultHand = deck.getHand();
    const resultLibrary = deck.getLibrary();
    const expectedHand = [
      "Copper",
      "Copper",
      "Copper",
      "Estate",
      "Estate",
      "Copper",
    ];
    const expectedLibrary = ["Estate", "Copper", "Copper", "Copper"];

    // Assert
    expect(resultHand).toStrictEqual(expectedHand);
    expect(resultLibrary).toStrictEqual(expectedLibrary);
  });
  
  it("should throw an error when the provided card is not in library", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const library = ["Estate", "Copper", "Copper", "Copper", "Copper"];
    deck.setLibrary(library);
    const card = "Sentry";

    // Act and Assert
    expect(() => deck.draw(card)).toThrowError("No Sentry in library.");
  });
});
