import { describe, it, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function trashFromHand() ", () => {
  it("should remove an instance of the provided card from hand, and add it to trash", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const hand = ["Harbinger", "Chapel", "Estate", "Silver"];
    const trash = ["Sentry", "Vassal"];
    const card = "Harbinger";
    deck.setHand(hand);
    deck.setTrash(trash);
    const expectedHand = ["Chapel", "Estate", "Silver"];
    const expectedTrash = ["Sentry", "Vassal", "Harbinger"];

    // Act
    deck.trashFromHand(card);
    const resultTrash = deck.getTrash();
    const resultHand = deck.getHand();

    // Assert
    expect(resultHand).toStrictEqual(expectedHand);
    expect(resultTrash).toStrictEqual(expectedTrash);
  });

  it("should throw an error if the provided card is not in hand", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const hand = ["Harbinger", "Chapel", "Estate", "Silver"];
    deck.setHand(hand);
    const card = "Pot of Greed";

    // Act and Assert
    expect(() => deck.trashFromHand(card)).toThrowError(
      "No Pot of Greed in hand."
    );
  });
});
