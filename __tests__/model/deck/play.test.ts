import { describe, it, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function play()", () => {
  it("should remove one instance of the the provided card from hand and add it to inPlay", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const hand = ["Copper", "Estate", "Estate", "Sentry"];
    const inPlay = ["Laboratory"];
    const card = "Sentry";
    deck.setHand(hand);
    deck.setInPlay(inPlay);
    const expectedHand = ["Copper", "Estate", "Estate"];
    const expectedInPlay = ["Laboratory", "Sentry"];
    // Act
    deck.play(card);
    const resultHand = deck.getHand();
    const resultInPlay = deck.getInPlay();

    // Assert
    expect(resultHand).toStrictEqual(expectedHand);
    expect(resultInPlay).toStrictEqual(expectedInPlay);
  });

  it("should throw an error when the provided card is not in hand", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const hand = ["Copper", "Estate", "Estate", "Sentry"];
    deck.setHand(hand);
    const card = "Pot of Greed";

    // Act and Assert
    expect(() => deck.play(card)).toThrowError(`No Pot of Greed in hand.`);
  });
});
