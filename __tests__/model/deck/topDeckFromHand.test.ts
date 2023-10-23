import { describe, it, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Method topDeckFromHand() ", () => {
  it("should remove an instance of the provided card from hand, and add it to library", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const hand = ["Harbinger", "Library", "Estate", "Silver"];
    const library = ["Sentry", "Vassal"];
    const card = "Harbinger";
    deck.setHand(hand);
    deck.setLibrary(library);
    const expectedHand = ["Library", "Estate", "Silver"];
    const expectedLibrary = ["Sentry", "Vassal", "Harbinger"];

    // Act
    deck.topDeckFromHand(card);
    const resultLibrary = deck.getLibrary();
    const resultHand = deck.getHand();

    // Assert
    expect(resultHand).toStrictEqual(expectedHand);
    expect(resultLibrary).toStrictEqual(expectedLibrary);
  });
  
  it("should throw an error if the provided card is not in hand", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const hand = ["Harbinger", "Library", "Estate", "Silver"];
    deck.setHand(hand);
    const card = "Pot of Greed";

    // Act and Assert
    expect(() => deck.topDeckFromHand(card)).toThrowError(
      "No Pot of Greed in hand."
    );
  });
});
