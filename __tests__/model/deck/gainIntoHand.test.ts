import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function gain()", () => {
  it("should add the provided card to the hand", () => {
    // Arrange
    const deck = new Deck("", false, "", "pNick", "pName", []);
    const hand = ["Copper"];
    const card = "Chapel";
    deck.setHand(hand);

    // Act
    deck.gainIntoHand(card);
    const resultHand = deck.getHand();
    const expectedHand = ["Copper", "Chapel"];

    // Assert
    expect(resultHand).toStrictEqual(expectedHand);
  });
});
